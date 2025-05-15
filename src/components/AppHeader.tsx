import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Logo from './Logo';
import { useAuth } from '@/hooks/useAuth';

interface AppHeaderProps {
  user?: {
    name: string;
    email: string;
  } | null;
}

const AppHeader: React.FC<AppHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Função para limpar flags de redirecionamento
  const clearRedirectionFlags = () => {
    console.log('[AppHeader] Limpando flags de redirecionamento');
    sessionStorage.removeItem('nutrivida-dashboard-to-profile');
    sessionStorage.removeItem('nutrivida-profile-redirect');
  };

  // Função para navegar para o perfil limpando flags
  const handleProfileNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    clearRedirectionFlags();
    navigate('/perfil');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Logo />
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 bg-nutrivida-secondary">
                      <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-4 py-3 border-b">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <DropdownMenuItem onClick={handleProfileNavigation} className="cursor-pointer">
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-nutrivida-primary hover:bg-nutrivida-dark">
                <Link to="/cadastro">Criar Conta</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
