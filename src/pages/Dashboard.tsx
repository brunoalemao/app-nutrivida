import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import MetricCard from '@/components/MetricCard';
import WeightChart from '@/components/WeightChart';
import DietPlan from '@/components/DietPlan';
import RecipeGenerator from '@/components/RecipeGenerator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, WeightRecord } from '@/types/user';
import { calculateBMI, getBMICategory, calculateTimeToGoal, calculateUserMetrics } from '@/utils/calculations';
import { generateMotivationalTips } from '@/utils/gemini';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import GeminiError from '@/components/GeminiError';
import { getRandomMotivationalTips } from '@/utils/localMotivation';
import { 
  loadCompleteUserProfile,
  saveUserProfileDetails,
  addWeightRecord,
  saveUserMetrics
} from '@/integrations/supabase/database';

// Chave para rastrear o redirecionamento para a página de perfil
const PROFILE_REDIRECT_KEY = 'nutrivida-dashboard-to-profile';

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user: authUser } = useAuth();
  
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState<string>('');
  const [motivationalTips, setMotivationalTips] = useState<string>('');
  const [loadingTips, setLoadingTips] = useState<boolean>(false);
  const [tipsError, setTipsError] = useState<{message: string, code?: string} | null>(null);
  
  // Estado para controlar redirecionamentos
  const [profileRedirectProcessed, setProfileRedirectProcessed] = useState(
    sessionStorage.getItem(PROFILE_REDIRECT_KEY) === 'true'
  );

  // Função para limpar flags de redirecionamento quando solicitado explicitamente
  const resetRedirectionFlags = () => {
    console.log('[Dashboard] Limpando flags de redirecionamento');
    sessionStorage.removeItem(PROFILE_REDIRECT_KEY);
    setProfileRedirectProcessed(false);
  };

  // Função para navegar para o perfil limpando os flags de redirecionamento
  const navigateToProfile = () => {
    console.log('[Dashboard] Navegando para perfil (navegação explícita)');
    resetRedirectionFlags();
    navigate('/perfil');
  };

  console.log('[Dashboard] Renderizando dashboard', {
    hasAuthUser: !!authUser,
    hasUserProfile: !!userProfile,
    loading,
    profileRedirectProcessed
  });

  useEffect(() => {
    // Verificar se há um usuário autenticado
    if (!authUser) {
      console.log('[Dashboard] Sem usuário autenticado, PrivateRoute redirecionará');
      return; // O PrivateRoute já vai lidar com o redirecionamento
    }
    
    // Carregar os dados do perfil do usuário
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        console.log('[Dashboard] Carregando perfil do banco de dados para', authUser.id);
        
        // Carregar perfil completo do banco de dados
        const userFromDb = await loadCompleteUserProfile(authUser.id);
        
        if (!userFromDb || !userFromDb.profile) {
          console.log('[Dashboard] Dados de perfil incompletos');
          
          // Verificar se já redirecionamos para o perfil para evitar loops
          if (!profileRedirectProcessed) {
            console.log('[Dashboard] Redirecionando para /perfil');
            
            // Marcar que já redirecionamos para evitar loops
            sessionStorage.setItem(PROFILE_REDIRECT_KEY, 'true');
            setProfileRedirectProcessed(true);
            
            toast.error('Você precisa completar seu perfil primeiro');
            navigate('/perfil');
            return;
          } else {
            console.log('[Dashboard] Já redirecionamos para /perfil anteriormente, exibindo interface vazia');
            // Criar um perfil temporário mínimo para evitar erros
            setUserProfile({
              id: authUser.id,
              name: authUser.user_metadata?.name || 'Usuário',
              email: authUser.email || '',
              createdAt: new Date(),
              profile: undefined
            });
          }
        } else {
          // Perfil foi carregado com sucesso
          console.log('[Dashboard] Perfil carregado com sucesso:', userFromDb);
          setUserProfile(userFromDb);
          
          // Carregar dicas motivacionais
          loadMotivationalTips(userFromDb);
        }
      } catch (error) {
        console.error('[Dashboard] Erro ao carregar perfil:', error);
        toast.error('Erro ao carregar perfil. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [authUser, navigate, profileRedirectProcessed]);

  const loadMotivationalTips = async (userData: User) => {
    if (!userData.profile || !authUser) return;

    setLoadingTips(true);
    setTipsError(null);
    
    // Usar diretamente as dicas motivacionais locais
    const tipsFromLocalDB = getRandomMotivationalTips(
      authUser.id, 
      Math.max(1, userData.profile.weightHistory.length)
    );
    
    setMotivationalTips(tipsFromLocalDB);
    setLoadingTips(false);
    
    // Código abaixo é mantido apenas para referência, mas não será executado
    if (false) { // Nunca executa este bloco
      try {
        const tips = await generateMotivationalTips(
          userData.profile.currentWeight,
          userData.profile.goalWeight,
          Math.max(1, userData.profile.weightHistory.length)
        );
        
        setMotivationalTips(tips);
      } catch (error: any) {
        console.error('Erro ao carregar dicas motivacionais:', error);
        setTipsError({
          message: error.message || 'Erro ao carregar dicas motivacionais',
          code: error.code
        });
        setMotivationalTips(
          "1. Cada pequeno passo é uma vitória na sua jornada.\n" +
          "2. Seu corpo está mudando, mesmo quando a balança não mostra.\n" +
          "3. Consistência supera perfeição - mantenha o foco diário.\n" +
          "4. Visualize seu objetivo e porque ele é importante para você.\n" +
          "5. Celebre cada escolha saudável que você faz."
        );
      } finally {
        setLoadingTips(false);
      }
    }
  };

  const handleUpdateWeight = async () => {
    if (!userProfile || !userProfile.profile || !authUser) return;
    
    const weightValue = parseFloat(newWeight);
    
    if (isNaN(weightValue) || weightValue <= 0) {
      toast.error('Por favor, insira um peso válido');
      return;
    }
    
    // Adicionar novo registro de peso
    const newWeightRecord: WeightRecord = {
      date: new Date(),
      weight: weightValue
    };
    
    const updatedWeightHistory = [
      ...userProfile.profile.weightHistory,
      newWeightRecord
    ];
    
    // Atualizar perfil do usuário
    const updatedUser = {
      ...userProfile,
      profile: {
        ...userProfile.profile,
        currentWeight: weightValue,
        weightHistory: updatedWeightHistory
      }
    };
    
    try {
      // Salvar o registro de peso no banco de dados
      console.log('[Dashboard] Salvando novo registro de peso:', weightValue);
      
      // 1. Atualizar o peso atual no perfil
      await saveUserProfileDetails(authUser.id, {
        age: userProfile.profile.age,
        gender: userProfile.profile.gender,
        height: userProfile.profile.height,
        currentWeight: weightValue,
        goalWeight: userProfile.profile.goalWeight,
        activityLevel: userProfile.profile.activityLevel
      });
      
      // 2. Adicionar novo registro ao histórico de peso
      await addWeightRecord(authUser.id, weightValue);
      
      // 3. Atualizar as métricas do usuário
      if (userProfile.profile.metrics) {
        const bmi = calculateBMI(userProfile.profile.height, weightValue);
        await saveUserMetrics(authUser.id, {
          bmr: userProfile.profile.metrics.bmr,
          dailyCalories: userProfile.profile.metrics.dailyCalories,
          weeklyGoal: userProfile.profile.metrics.weeklyGoal,
          bmi: bmi
        });
      }
      
      // Atualizar estado local
      setUserProfile(updatedUser);
      setNewWeight('');
      
      toast.success('Peso atualizado com sucesso!');
    } catch (error) {
      console.error('[Dashboard] Erro ao atualizar peso:', error);
      toast.error('Erro ao atualizar peso. Por favor, tente novamente.');
    }
  };

  if (loading || !userProfile || !userProfile.profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader user={userProfile} />
        <div className="flex-grow flex items-center justify-center">
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nutrivida-primary"></div>
          ) : !userProfile ? (
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">Usuário não encontrado</h2>
              <p className="mb-4">Não foi possível carregar os dados do usuário.</p>
              <Button 
                className="bg-nutrivida-primary hover:bg-nutrivida-dark"
                onClick={navigateToProfile}
              >
                Ir para Perfil
              </Button>
            </div>
          ) : (
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">Perfil Incompleto</h2>
              <p className="mb-4">Complete seu perfil para acessar todas as funcionalidades.</p>
              <Button 
                className="bg-nutrivida-primary hover:bg-nutrivida-dark"
                onClick={navigateToProfile}
              >
                Completar Perfil
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const { profile } = userProfile;
  const weightLost = profile.weightHistory.length > 1 
    ? profile.weightHistory[0].weight - profile.currentWeight 
    : 0;
  
  const bmi = calculateBMI(profile.height, profile.currentWeight);
  const bmiCategory = getBMICategory(bmi);
  
  const weeksToGoal = calculateTimeToGoal(
    profile.currentWeight, 
    profile.goalWeight, 
    profile.metrics?.weeklyGoal || 0.5
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader user={userProfile} />
      
      <main className="flex-grow py-4 md:py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Olá, {userProfile.name.split(' ')[0]}!</h1>
            <p className="text-gray-600">Acompanhe seu progresso e continue sua jornada</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <MetricCard
              title="Peso Atual"
              value={`${profile.currentWeight} kg`}
              description={weightLost > 0 ? `${weightLost.toFixed(1)} kg perdidos` : 'Registre seu progresso'}
              trend={weightLost > 0 ? 'down' : 'neutral'}
            />
            
            <MetricCard
              title="Meta de Peso"
              value={`${profile.goalWeight} kg`}
              description={`Faltam ${(profile.currentWeight - profile.goalWeight).toFixed(1)} kg`}
            />
            
            <MetricCard
              title="IMC"
              value={bmi.toString()}
              description={bmiCategory}
              trend={bmi > 25 ? 'down' : bmi < 18.5 ? 'up' : 'neutral'}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <WeightChart
                weightHistory={profile.weightHistory}
                goalWeight={profile.goalWeight}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Registrar Peso</CardTitle>
                <CardDescription>Atualize seu peso para acompanhar seu progresso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Novo Peso (kg)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="weight"
                        type="number"
                        placeholder="Ex: 65.5"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        step="0.1"
                        min="30"
                        max="300"
                      />
                      <Button 
                        onClick={handleUpdateWeight} 
                        className="bg-nutrivida-primary hover:bg-nutrivida-dark"
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Dados da sua jornada</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Peso inicial:</span>
                        <span className="font-medium">{profile.weightHistory[0].weight} kg</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Peso atual:</span>
                        <span className="font-medium">{profile.currentWeight} kg</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Tempo estimado para meta:</span>
                        <span className="font-medium">{weeksToGoal} semanas</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Calorias diárias meta:</span>
                        <span className="font-medium">{profile.metrics?.dailyCalories ? profile.metrics.dailyCalories - 500 : '---'} kcal</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">Ver Dicas Motivacionais</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-center text-nutrivida-primary">Dicas Motivacionais</DialogTitle>
                      </DialogHeader>
                      
                      <div className="mb-4 whitespace-pre-line bg-nutrivida-light p-4 rounded-lg">
                        {tipsError && (
                          <GeminiError
                            message={tipsError.message}
                            code={tipsError.code}
                            retry={() => loadMotivationalTips(userProfile)}
                          />
                        )}
                        {loadingTips ? (
                          <div className="flex justify-center items-center h-24">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-nutrivida-primary"></div>
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-semibold mb-2">Dicas Motivacionais:</h3>
                            <div className="text-sm">{motivationalTips}</div>
                          </div>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button className="w-full bg-nutrivida-secondary">Fechar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="dieta" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="dieta">Plano de Dieta</TabsTrigger>
              <TabsTrigger value="receitas">Receitas Saudáveis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dieta">
              <DietPlan profile={profile} />
            </TabsContent>
            
            <TabsContent value="receitas">
              <RecipeGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="mt-auto py-6 bg-white border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} NutriVida. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
