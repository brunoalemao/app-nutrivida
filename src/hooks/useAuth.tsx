import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthError, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean; 
  initialized: boolean; // Nova flag para indicar se a verificação inicial foi concluída
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; success: boolean }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false); // Nova flag de inicialização
  
  // Refs para controlar operações em andamento
  const isAuthOperationInProgress = useRef(false);
  const sessionCheckId = useRef(0);

  console.log('[AuthProvider] Renderizando com estado:', { 
    user: user ? `${user.id} (${user.email})` : 'null', 
    loading, 
    initialized,
    isAuthOperationInProgress: isAuthOperationInProgress.current
  });

  // Função para atualizar sessão quando o token de refresh falhar
  const refreshSession = useCallback(async (): Promise<boolean> => {
    console.log('[AuthProvider] Tentando atualizar sessão manualmente');
    
    if (isAuthOperationInProgress.current) {
      console.log('[AuthProvider] Operação de auth já em andamento, ignorando refreshSession');
      return false;
    }
    
    isAuthOperationInProgress.current = true;
    setLoading(true);
    
    try {
      // Verifica se existe uma sessão atual
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.log('[AuthProvider] Sem sessão ativa para atualizar');
        // Limpa qualquer estado antigo para forçar um novo login
        setUser(null);
        localStorage.removeItem('nutrivida-auth-storage');
        return false;
      }
      
      // Tentar renovar o token
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('[AuthProvider] Erro ao atualizar sessão:', error);
        // Se falhar na atualização, limpamos o estado para forçar um novo login
        setUser(null);
        localStorage.removeItem('nutrivida-auth-storage');
        return false;
      }
      
      if (data.session) {
        console.log('[AuthProvider] Sessão atualizada com sucesso:', data.session.user.id);
        setUser(data.session.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[AuthProvider] Erro ao atualizar sessão:', error);
      return false;
    } finally {
      setLoading(false);
      isAuthOperationInProgress.current = false;
    }
  }, []);

  useEffect(() => {
    // Função para carregar o estado de autenticação atual
    const loadAuthState = async () => {
      console.log('[AuthProvider] Iniciando loadAuthState');
      
      // Incrementa o ID da verificação atual para invalidar verificações anteriores
      const currentCheckId = ++sessionCheckId.current;
      
      try {
        isAuthOperationInProgress.current = true;
        setLoading(true);
        
        console.log('[AuthProvider] Buscando sessão atual', { checkId: currentCheckId });
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        // Verificar se esta é ainda a verificação mais recente
        if (currentCheckId !== sessionCheckId.current) {
          console.log('[AuthProvider] Verificação cancelada - outra verificação mais recente está em andamento', 
            { currentId: currentCheckId, latestId: sessionCheckId.current });
          return;
        }
        
        if (sessionError) {
          console.error('[AuthProvider] Erro ao buscar sessão:', sessionError);
          // Tentar limpar o armazenamento se houver erro de sessão
          localStorage.removeItem('nutrivida-auth-storage');
          throw sessionError;
        }
        
        const session = sessionData.session;
        console.log('[AuthProvider] Sessão obtida:', { 
          hasSession: !!session,
          userId: session?.user?.id,
          checkId: currentCheckId
        });
        
        // Se temos uma sessão mas ela está expirando em breve, tenta atualizar
        if (session) {
          const expiresAt = session.expires_at;
          const now = Math.floor(Date.now() / 1000);
          // Se expira em menos de 10 minutos, tenta atualizar
          if (expiresAt && (expiresAt - now < 600)) {
            console.log('[AuthProvider] Sessão expirando em breve, tentando atualizar');
            try {
              const { data, error } = await supabase.auth.refreshSession();
              if (error) {
                console.error('[AuthProvider] Erro ao atualizar sessão:', error);
              } else if (data.session) {
                console.log('[AuthProvider] Sessão atualizada com sucesso');
              }
            } catch (refreshError) {
              console.error('[AuthProvider] Erro ao atualizar sessão:', refreshError);
            }
          }
        }
        
        // Atualiza o usuário baseado na sessão atual
        setUser(session?.user ?? null);
        console.log('[AuthProvider] User definido como:', session?.user?.id || 'null');
        
        // Configurar o listener para mudanças na autenticação
        console.log('[AuthProvider] Configurando listener onAuthStateChange');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('[AuthProvider] Evento de autenticação:', event, { 
              hasSession: !!session,
              userId: session?.user?.id
            });
            
            // Para alguns eventos, queremos atualizar o loading para garantir
            // que a UI não tente navegar antes que o estado esteja estabilizado
            if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) {
              setLoading(true);
              
              // Um pequeno delay para permitir que o Supabase processe completamente
              // a mudança de estado antes de atualizarmos nossos estados locais
              setTimeout(() => {
                setUser(session?.user ?? null);
                setLoading(false);
              }, 100);
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('[AuthProvider] Token atualizado com sucesso');
              setUser(session?.user ?? null);
            } else if (event === 'INITIAL_SESSION') {
              console.log('[AuthProvider] Sessão inicial detectada');
              setUser(session?.user ?? null);
            } else {
              setUser(session?.user ?? null);
            }
            
            console.log('[AuthProvider] User atualizado para:', session?.user?.id || 'null');
          }
        );

        return () => {
          console.log('[AuthProvider] Limpando subscription');
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error("[AuthProvider] Erro ao carregar estado de autenticação:", error);
        
        // Verificar novamente se esta é a verificação mais recente
        if (currentCheckId === sessionCheckId.current) {
          setUser(null);
        }
      } finally {
        // Só finalizamos se esta for a verificação mais recente
        if (currentCheckId === sessionCheckId.current) {
          console.log('[AuthProvider] Finalizando inicialização', { checkId: currentCheckId });
          setLoading(false);
          setInitialized(true);
          isAuthOperationInProgress.current = false;
        }
      }
    };

    loadAuthState();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log(`[AuthProvider] Tentando login para ${email}`);
    
    if (isAuthOperationInProgress.current) {
      console.log('[AuthProvider] Operação de auth já em andamento, ignorando signIn');
      return { error: { name: 'AuthError', message: 'Uma operação de autenticação já está em andamento.' } as AuthError, success: false };
    }
    
    isAuthOperationInProgress.current = true;
    setLoading(true);
    
    try {
      // Primeiro, limpe qualquer sessão anterior que possa estar causando problemas
      localStorage.removeItem('nutrivida-auth-storage');
      
      console.log('[AuthProvider] Chamando signInWithPassword');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[AuthProvider] Erro no login:', error);
        throw error;
      }

      // Atualiza o usuário imediatamente após o login para evitar flashes de tela
      if (data.session) {
        console.log('[AuthProvider] Login bem-sucedido, atualizando user:', data.session.user.id);
        setUser(data.session.user);
        return { error: null, success: true };
      }
      
      console.log('[AuthProvider] Login sem erro, mas sem sessão');
      return { error: { name: 'AuthError', message: 'Login falhou, nenhuma sessão retornada.' } as AuthError, success: false };
    } catch (error) {
      console.error('[AuthProvider] Erro ao fazer login:', error);
      return { error: error as AuthError, success: false };
    } finally {
      console.log('[AuthProvider] Finalizando processo de login');
      
      // Pequeno delay para garantir que qualquer evento onAuthStateChange também tenha sido processado
      setTimeout(() => {
        setLoading(false);
        isAuthOperationInProgress.current = false;
      }, 100);
    }
  };

  const signOut = async () => {
    console.log('[AuthProvider] Iniciando logout');
    
    if (isAuthOperationInProgress.current) {
      console.log('[AuthProvider] Operação de auth já em andamento, ignorando signOut');
      return;
    }
    
    isAuthOperationInProgress.current = true;
    setLoading(true);
    
    try {
      console.log('[AuthProvider] Chamando auth.signOut');
      await supabase.auth.signOut();
      console.log('[AuthProvider] Logout concluído, limpando user');
      setUser(null); // Atualizamos o usuário imediatamente
      
      // Limpar o storage também
      localStorage.removeItem('nutrivida-auth-storage');
    } catch (error) {
      console.error('[AuthProvider] Erro ao fazer logout:', error);
    } finally {
      console.log('[AuthProvider] Finalizando processo de logout');
      
      // Pequeno delay para garantir que qualquer evento onAuthStateChange também tenha sido processado
      setTimeout(() => {
        setLoading(false);
        isAuthOperationInProgress.current = false;
      }, 100);
    }
  };

  const value = {
    user,
    loading,
    initialized,
    signIn,
    signOut,
    refreshSession,
  };

  // Se ainda estiver na inicialização (antes do primeiro check de auth), mostra um spinner global
  if (!initialized) {
    console.log('[AuthProvider] Exibindo spinner de inicialização');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nutrivida-primary"></div>
      </div>
    );
  }

  console.log('[AuthProvider] Renderizando filhos com contexto', { 
    hasUser: !!user, 
    loading 
  });
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 