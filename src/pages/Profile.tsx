import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import ProfileForm from '@/components/ProfileForm';
import DbDiagnostics from '@/components/DbDiagnostics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, UserProfile } from '@/types/user';
import { calculateBMI, calculateUserMetrics } from '@/utils/calculations';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { 
  upsertUserProfile, 
  saveUserProfileDetails, 
  saveUserMetrics,
  addWeightRecord,
  loadCompleteUserProfile
} from '@/integrations/supabase/database';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('[Profile] Renderizando página de perfil', { 
    hasAuthUser: !!authUser,
    loading 
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!authUser) {
        console.log('[Profile] Nenhum usuário autenticado');
        return; // PrivateRoute vai redirecionar
      }

      try {
        setLoading(true);
        console.log('[Profile] Carregando dados do perfil para', authUser.id);

        // Carregar o perfil das tabelas do Supabase
        const userFromDb = await loadCompleteUserProfile(authUser.id);
        
        if (userFromDb) {
          console.log('[Profile] Perfil carregado do banco de dados:', userFromDb);
          setUserProfile(userFromDb);
        } else {
          // Criar um objeto de usuário básico com os dados disponíveis no Auth
          console.log('[Profile] Criando perfil básico a partir dos dados de autenticação');
          const userMetadata = authUser.user_metadata || {};
          
          const user: User = {
            id: authUser.id,
            name: userMetadata.name || authUser.email?.split('@')[0] || 'Usuário',
            email: authUser.email || '',
            createdAt: new Date(),
            profile: {
              age: 30,
              gender: 'masculino',
              height: 170,
              currentWeight: 70,
              goalWeight: 65,
              activityLevel: 'moderado',
              weightHistory: [
                {
                  date: new Date(),
                  weight: 70
                }
              ]
            }
          };

          setUserProfile(user);
        }
        
        console.log('[Profile] Dados do perfil carregados', { hasProfile: true });
      } catch (error) {
        console.error('[Profile] Erro ao carregar perfil:', error);
        toast.error('Erro ao carregar dados do perfil');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [authUser, navigate]);

  // Função para criar todas as tabelas necessárias de uma só vez
  const inicializarBancoDados = async () => {
    if (!authUser || !userProfile) return;
    
    try {
      setLoading(true);
      
      // 1. Atualizar tabela profiles (deve já existir)
      console.log('Inicializando tabela profiles...');
      await upsertUserProfile(
        authUser.id,
        userProfile.name,
        userProfile.email
      );
      
      // 2. Criar um perfil básico padrão
      console.log('Inicializando tabela user_profiles...');
      await saveUserProfileDetails(
        authUser.id,
        {
          age: 30,
          gender: 'masculino',
          height: 170,
          currentWeight: 70,
          goalWeight: 65, 
          activityLevel: 'moderado'
        }
      );
      
      // 3. Criar métricas básicas padrão
      const metricsBasicas = calculateUserMetrics({
        age: 30,
        gender: 'masculino',
        height: 170,
        currentWeight: 70,
        goalWeight: 65,
        activityLevel: 'moderado',
        weightHistory: []
      });
      
      const bmi = calculateBMI(170, 70);
      
      console.log('Inicializando tabela user_metrics...');
      await saveUserMetrics(
        authUser.id,
        {
          bmr: metricsBasicas.bmr,
          dailyCalories: metricsBasicas.dailyCalories,
          weeklyGoal: metricsBasicas.weeklyGoal,
          bmi: bmi
        }
      );
      
      // 4. Adicionar um registro de peso inicial
      console.log('Inicializando tabela weight_history...');
      await addWeightRecord(
        authUser.id,
        70
      );
      
      toast.success('Banco de dados inicializado com sucesso!');
      
      // Recarregar a página para ver os dados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
      toast.error('Erro ao inicializar banco de dados');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (profileData: Partial<UserProfile>) => {
    if (!authUser || !userProfile) return;

    // Garantindo que temos o perfil completo
    const currentDate = new Date();
    
    // Salvar informações completas do perfil
    const completeProfile: UserProfile = {
      age: profileData.age!,
      gender: profileData.gender!,
      height: profileData.height!,
      currentWeight: profileData.currentWeight!,
      goalWeight: profileData.goalWeight!,
      activityLevel: profileData.activityLevel!,
      weightHistory: [
        {
          date: currentDate,
          weight: profileData.currentWeight!
        }
      ]
    };
    
    // Calcular métricas do usuário
    const metrics = calculateUserMetrics(completeProfile);
    const bmi = calculateBMI(completeProfile.height, completeProfile.currentWeight);
    completeProfile.metrics = metrics;

    try {
      console.log('[Profile] Salvando perfil nas tabelas do Supabase');
      
      // 1. Salvar perfil básico
      await upsertUserProfile(
        authUser.id,
        userProfile.name,
        userProfile.email
      );
      
      // 2. Salvar detalhes do perfil
      await saveUserProfileDetails(
        authUser.id,
        {
          age: completeProfile.age,
          gender: completeProfile.gender,
          height: completeProfile.height,
          currentWeight: completeProfile.currentWeight,
          goalWeight: completeProfile.goalWeight,
          activityLevel: completeProfile.activityLevel
        }
      );
      
      // 3. Salvar métricas
      await saveUserMetrics(
        authUser.id,
        {
          bmr: metrics.bmr,
          dailyCalories: metrics.dailyCalories,
          weeklyGoal: metrics.weeklyGoal,
          bmi: bmi
        }
      );
      
      // 4. Adicionar registro de peso inicial
      await addWeightRecord(
        authUser.id,
        completeProfile.currentWeight,
        currentDate
      );
      
      // Atualizar o usuário com o perfil
      const updatedUser: User = {
        ...userProfile,
        profile: completeProfile
      };
      
      setUserProfile(updatedUser);
      
      // Limpar quaisquer flags de redirecionamento
      sessionStorage.removeItem('nutrivida-dashboard-to-profile');
      
      toast.success('Perfil atualizado com sucesso!');
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('[Profile] Erro ao atualizar perfil:', error);
      toast.error('Erro ao salvar perfil. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader user={userProfile} />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nutrivida-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader user={userProfile} />
      
      <main className="flex-grow py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Complete Seu Perfil</CardTitle>
              <CardDescription>
                Precisamos de algumas informações para criar seu plano personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm 
                onSubmit={handleProfileUpdate} 
                initialData={userProfile?.profile}
              />
            </CardContent>
          </Card>
          
          {/* Diagnóstico temporário do banco de dados */}
          <div className="mt-6">
            <DbDiagnostics />
          </div>
          
          {/* Botão para inicializar o banco de dados */}
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Inicializar Banco de Dados</CardTitle>
                <CardDescription>
                  Use este botão para criar todas as tabelas necessárias com dados padrão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Esta função irá criar registros nas tabelas de perfil, métricas e histórico de peso
                  com dados padrão para inicializar o banco de dados.
                </p>
                <Button 
                  onClick={inicializarBancoDados}
                  className="w-full bg-nutrivida-secondary hover:bg-nutrivida-secondary/80"
                  disabled={loading}
                >
                  {loading ? 'Inicializando...' : 'Inicializar Banco de Dados'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="mt-auto py-6 bg-white border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} NutriVida. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Profile;
