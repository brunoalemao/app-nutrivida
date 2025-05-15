import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';

const LOGIN_REDIRECT_KEY = 'nutrivida-login-redirect';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, initialized, signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectProcessed, setRedirectProcessed] = useState(false);

  // Log para diagnóstico
  console.log('[Login] Renderizando componente', { 
    user: user ? 'existe' : 'null', 
    authLoading, 
    initialized, 
    isSubmitting,
    locationPathname: location.pathname,
    locationState: location.state,
    redirectProcessed
  });

  // Verificar e processar redirecionamento apenas uma vez ao montar
  useEffect(() => {
    const hasRedirected = sessionStorage.getItem(LOGIN_REDIRECT_KEY) === 'true';
    console.log('[Login] Verificando se já redirecionou', { hasRedirected });
    
    if (hasRedirected) {
      console.log('[Login] Redirecionamento já processado anteriormente');
      setRedirectProcessed(true);
      return;
    }

    // Se não redirecionou ainda, verificar se tem usuário
    if (initialized && user && !isSubmitting && !redirectProcessed) {
      // Marcar como redirecionado para evitar loops
      sessionStorage.setItem(LOGIN_REDIRECT_KEY, 'true');
      setRedirectProcessed(true);
      
      console.log('[Login] Redirecionando para dashboard');
      // Redirecionar para dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [user, initialized, isSubmitting, navigate, redirectProcessed]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    console.log('[Login] Iniciando tentativa de login');
    setIsSubmitting(true);

    try {
      console.log('[Login] Chamando signIn');
      const { error, success } = await signIn(formData.email, formData.password);

      console.log('[Login] Resultado do signIn', { error, success });

      if (success) {
        toast.success('Login realizado com sucesso!');
        // Limpar o indicador de redirecionamento
        sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
        
        console.log('[Login] Login bem-sucedido, redirecionando para dashboard');
        navigate('/dashboard', { replace: true });
      } else if (error) {
        console.error('[Login] Erro de login:', error);
        if (error.message.includes('Email not confirmed')) {
          toast.error(
            <div>
              Email não confirmado. 
              <br />
              Por favor, verifique sua caixa de entrada e confirme seu email.
            </div>
          );
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else {
          toast.error(error.message || 'Erro ao fazer login. Por favor, tente novamente.');
        }
      }
    } catch (error: any) {
      console.error('[Login] Erro inesperado ao fazer login:', error);
      toast.error('Erro inesperado ao fazer login. Por favor, tente novamente.');
    } finally {
      console.log('[Login] Finalizando tentativa de login, isSubmitting = false');
      setIsSubmitting(false);
    }
  };

  // Usuário não autenticado ou redirecionamento já processado
  if (!initialized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-nutrivida-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nutrivida-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o usuário já está autenticado e estamos aguardando o redirecionamento
  if (user && !redirectProcessed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-nutrivida-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nutrivida-primary mx-auto mb-4"></div>
          <p>Você já está logado. Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-nutrivida-light p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Acesse sua conta para continuar sua jornada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="seu.email@exemplo.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/esqueci-senha" className="text-xs text-nutrivida-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="******" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-nutrivida-primary hover:bg-nutrivida-dark"
              disabled={isSubmitting || authLoading}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-nutrivida-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
