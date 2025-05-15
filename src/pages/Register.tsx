import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não correspondem');
      return;
    }

    setLoading(true);

    try {
      // Criar o usuário na autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            name: formData.name,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          toast.error(
            <div>
              Este e-mail já está cadastrado. 
              <Link to="/login" className="text-nutrivida-primary hover:underline ml-1">
                Faça login
              </Link>
              {' '}ou{' '}
              <Link to="/recuperar-senha" className="text-nutrivida-primary hover:underline">
                recupere sua senha
              </Link>
            </div>
          );
          return;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Não foi possível criar o usuário');
      }

      toast.success(
        <div>
          Conta criada com sucesso! 
          <br />
          Por favor, verifique seu e-mail para confirmar o cadastro.
        </div>
      );
      navigate('/login');
      
    } catch (error: any) {
      console.error('Erro completo:', error);
      toast.error(error.message || 'Erro ao criar conta. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-nutrivida-light p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Crie sua Conta</CardTitle>
          <CardDescription>
            Comece sua jornada de emagrecimento personalizada hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name" 
                name="name"
                placeholder="Seu nome completo" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
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
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="******" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              <p className="text-xs text-gray-500">Mínimo de 6 caracteres</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                placeholder="******" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-nutrivida-primary hover:bg-nutrivida-dark"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-nutrivida-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
