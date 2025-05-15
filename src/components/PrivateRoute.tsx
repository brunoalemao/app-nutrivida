import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

const REDIRECT_KEY = 'nutrivida-private-route-redirect';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nutrivida-primary"></div>
  </div>
);

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, initialized, refreshSession } = useAuth();
  const location = useLocation();
  const [redirectProcessed, setRedirectProcessed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  
  console.log('[PrivateRoute] Renderizando', { 
    path: location.pathname,
    user: user ? 'existe' : 'null',
    loading,
    initialized,
    redirectProcessed,
    isRefreshing,
    refreshAttempted
  });

  // Verificar mudança de rota e reset flags quando apropriado
  useEffect(() => {
    // Reset o redirect flag quando mudar de rota
    const currentPath = location.pathname;
    const storedPath = sessionStorage.getItem(`${REDIRECT_KEY}-path`);
    
    console.log('[PrivateRoute] Verificando se mudou de rota', { currentPath, storedPath });
    
    if (storedPath !== currentPath) {
      console.log('[PrivateRoute] Rota mudou, resetando flag de redirecionamento');
      sessionStorage.removeItem(REDIRECT_KEY);
      sessionStorage.setItem(`${REDIRECT_KEY}-path`, currentPath);
      setRedirectProcessed(false);
      setRefreshAttempted(false); // Resetar a tentativa de refresh
    }

    // Caso específico: se o usuário está indo explicitamente para /perfil,
    // devemos garantir que todas as flags sejam limpas para permitir acesso
    if (currentPath === '/perfil') {
      console.log('[PrivateRoute] Acesso à página de perfil, garantindo que flags não bloqueiem');
      sessionStorage.removeItem('nutrivida-dashboard-to-profile');
      // Não removemos a flag do PrivateRoute porque ela controla o redirecionamento para login
    }
  }, [location.pathname]);

  // Tenta atualizar a sessão se o usuário não estiver presente e ainda não tiver tentado atualizar
  useEffect(() => {
    const tryRefreshSession = async () => {
      if (!user && initialized && !loading && !refreshAttempted && !redirectProcessed) {
        console.log('[PrivateRoute] Tentando atualizar sessão antes de redirecionar');
        setIsRefreshing(true);
        
        try {
          const refreshed = await refreshSession();
          console.log('[PrivateRoute] Resultado da atualização da sessão:', refreshed);
          
          // Se não conseguiu atualizar, marca para redirecionamento
          if (!refreshed) {
            console.log('[PrivateRoute] Falha na atualização, preparando redirecionamento');
            setRedirectProcessed(true);
          }
        } catch (error) {
          console.error('[PrivateRoute] Erro ao tentar atualizar sessão:', error);
          setRedirectProcessed(true);
        } finally {
          setIsRefreshing(false);
          setRefreshAttempted(true);
        }
      }
    };
    
    tryRefreshSession();
  }, [user, initialized, loading, refreshAttempted, redirectProcessed, refreshSession]);

  // Se o sistema de autenticação não foi inicializado ou está carregando ou atualizando, mostre o spinner
  if (!initialized || loading || isRefreshing) {
    console.log('[PrivateRoute] Exibindo spinner - não inicializado, carregando ou atualizando');
    return <LoadingSpinner />;
  }

  // Se não houver usuário após a inicialização e já tentamos atualizar, redirecione para o login
  if (!user && refreshAttempted && !redirectProcessed) {
    console.log('[PrivateRoute] Redirecionando para login - usuário não autenticado após tentativa de atualização');
    
    // Marcar como redirecionado para prevenir múltiplos redirecionamentos
    sessionStorage.setItem(REDIRECT_KEY, 'true');
    setRedirectProcessed(true);
    
    // Remover o flag de redirecionamento do Login para permitir ir para login
    sessionStorage.removeItem('nutrivida-login-redirect');
    
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Se estamos em uma rota protegida mas sem usuário, mostrar spinner enquanto 
  // aguardamos o redirecionamento ser processado
  if (!user && redirectProcessed) {
    console.log('[PrivateRoute] Aguardando redirecionamento para login');
    return <LoadingSpinner />;
  }

  // Se tiver usuário autenticado, renderize o conteúdo protegido
  console.log('[PrivateRoute] Renderizando children - usuário autenticado');
  return <>{children}</>;
}; 