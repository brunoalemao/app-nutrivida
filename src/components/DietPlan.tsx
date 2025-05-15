import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from '@/types/user';
import { calculateUserMetrics } from '@/utils/calculations';
import { toast } from 'sonner';
import GeminiError from './GeminiError';
import { getLocalMealPlan, formatMealPlan } from '@/utils/localRecipes';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface DietPlanProps {
  profile: UserProfile;
}

// Chave para armazenar no localStorage quando o usuário gerou um plano pela última vez
const LAST_PLAN_GENERATED_KEY = 'last_diet_plan_generated_';

const DietPlan: React.FC<DietPlanProps> = ({ profile }) => {
  const [dietPlan, setDietPlan] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('dieta');
  const [error, setError] = useState<{message: string, code?: string} | null>(null);
  const [nextPlanAvailableDate, setNextPlanAvailableDate] = useState<Date | null>(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (profile && !dietPlan) {
      checkAndGenerateDietPlan();
    }
  }, [profile]);

  // Verifica quando o último plano foi gerado e se um novo pode ser gerado
  const checkAndGenerateDietPlan = async () => {
    if (!authUser) return;
    
    const lastGeneratedKey = LAST_PLAN_GENERATED_KEY + authUser.id;
    const lastGeneratedStr = localStorage.getItem(lastGeneratedKey);
    
    if (lastGeneratedStr) {
      const lastGenerated = new Date(lastGeneratedStr);
      const now = new Date();
      
      // Calcula a data do próximo plano disponível (7 dias após o último)
      const nextAvailable = new Date(lastGenerated);
      nextAvailable.setDate(nextAvailable.getDate() + 7);
      setNextPlanAvailableDate(nextAvailable);
      
      // Verifica se passou uma semana desde a última geração
      if (now < nextAvailable) {
        // Menos de uma semana se passou, então carrega o plano salvo
        const savedPlan = localStorage.getItem('saved_diet_plan_' + authUser.id);
        if (savedPlan) {
          setDietPlan(savedPlan);
          return;
        }
      }
    }
    
    // Se chegou aqui, ou nunca gerou um plano ou já passou uma semana
    generateDietPlanForUser();
  };

  const generateDietPlanForUser = async () => {
    if (!profile || !authUser) return;
    
    // Verifica se o usuário pode gerar um novo plano
    if (nextPlanAvailableDate && new Date() < nextPlanAvailableDate) {
      toast.error(`Você só pode gerar um novo plano a partir de ${nextPlanAvailableDate.toLocaleDateString()}`);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Calcula as métricas do usuário
      const metrics = profile.metrics || calculateUserMetrics(profile);
      
      // Calcula calorias para perda de peso (déficit de aproximadamente 500 calorias)
      const targetCalories = metrics.dailyCalories - 500;

      // Obter um plano local baseado no ID do usuário e timestamp
      const localPlan = getLocalMealPlan(authUser.id);
      
      // Formatar o plano com as calorias calculadas
      const formattedPlan = formatMealPlan(localPlan, Math.round(targetCalories));
      
      setDietPlan(formattedPlan);
      
      // Salva o plano e a data de geração
      saveDietPlanData(formattedPlan);
    } catch (error: any) {
      console.error('Erro ao gerar plano de dieta:', error);
      
      // Captura informações de erro para exibição amigável
      setError({
        message: error.message || 'Não foi possível gerar o plano de dieta no momento.',
        code: error.code
      });
      
      // Mesmo se houver erro nas métricas, tenta mostrar algo
      if (!dietPlan) {
        const fallbackPlan = getLocalMealPlan(authUser?.id || 'default');
        const formattedFallback = formatMealPlan(fallbackPlan, 1500); // valor calórico padrão
        setDietPlan(formattedFallback);
        saveDietPlanData(formattedFallback);
      }
    } finally {
      setLoading(false);
    }
  };

  // Salva os dados do plano e a data de geração
  const saveDietPlanData = (plan: string) => {
    if (!authUser) return;
    
    const now = new Date();
    localStorage.setItem(LAST_PLAN_GENERATED_KEY + authUser.id, now.toISOString());
    localStorage.setItem('saved_diet_plan_' + authUser.id, plan);
    
    // Calcula a próxima data disponível (7 dias depois)
    const nextAvailable = new Date(now);
    nextAvailable.setDate(nextAvailable.getDate() + 7);
    setNextPlanAvailableDate(nextAvailable);
    
    // Salvar no banco de dados também (opcional, implementação futura)
    try {
      // Pode-se implementar a persistência no Supabase aqui
    } catch (error) {
      console.error('Erro ao salvar dados do plano no banco:', error);
    }
  };

  const refreshDietPlan = () => {
    // Verifica se pode gerar um novo plano
    if (nextPlanAvailableDate && new Date() < nextPlanAvailableDate) {
      toast.error(`Você só pode gerar um novo plano a partir de ${nextPlanAvailableDate.toLocaleDateString()}`);
      return;
    }
    
    // Força o uso de uma nova receita aleatória adicionando timestamp ao ID do usuário
    const forceNewTime = new Date().getTime().toString();
    if (authUser) {
      authUser.id = authUser.id.split('-')[0] + '-' + forceNewTime;
    }
    setDietPlan('');
    generateDietPlanForUser();
  };

  // Formata a data para exibição
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Seu Plano Personalizado</CardTitle>
        <CardDescription>
          Plano nutricional baseado no seu perfil para alcançar seus objetivos
        </CardDescription>
        {nextPlanAvailableDate && (
          <p className="mt-1 text-xs text-nutrivida-primary">
            Próximo plano disponível em: {formatDate(nextPlanAvailableDate)}
          </p>
        )}
      </CardHeader>

      <Tabs defaultValue="dieta" value={currentTab} onValueChange={setCurrentTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dieta">Plano de Dieta</TabsTrigger>
            <TabsTrigger value="info">Informações Nutricionais</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="dieta" className="space-y-4">
          <CardContent>
            {error && (
              <GeminiError 
                message={error.message} 
                code={error.code} 
                retry={refreshDietPlan} 
              />
            )}
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nutrivida-primary"></div>
                <p className="mt-4 text-nutrivida-primary font-medium">Gerando seu plano de dieta personalizado...</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {dietPlan ? (
                  <div className="whitespace-pre-line">{dietPlan}</div>
                ) : (
                  <p className="text-center text-gray-500">
                    Não há plano de dieta disponível. Clique em gerar novo plano.
                  </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              onClick={refreshDietPlan} 
              disabled={loading || (nextPlanAvailableDate && new Date() < nextPlanAvailableDate)}
              className="w-full bg-nutrivida-primary hover:bg-nutrivida-dark"
            >
              {nextPlanAvailableDate && new Date() < nextPlanAvailableDate 
                ? `Novo plano disponível em ${formatDate(nextPlanAvailableDate)}` 
                : "Gerar Novo Plano de Refeições"}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="info">
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informações Sobre Seu Plano</h3>
              
              {profile.metrics && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-nutrivida-light p-4 rounded-lg">
                      <p className="font-semibold text-nutrivida-dark">Metabolismo Basal (TMB)</p>
                      <p className="text-lg font-bold">{profile.metrics.bmr} kcal</p>
                      <p className="text-xs text-gray-600">Calorias gastas em repouso</p>
                    </div>
                    
                    <div className="bg-nutrivida-light p-4 rounded-lg">
                      <p className="font-semibold text-nutrivida-dark">Gasto Calórico Diário</p>
                      <p className="text-lg font-bold">{profile.metrics.dailyCalories} kcal</p>
                      <p className="text-xs text-gray-600">Com base no seu nível de atividade</p>
                    </div>
                    
                    <div className="bg-nutrivida-light p-4 rounded-lg">
                      <p className="font-semibold text-nutrivida-dark">Meta Calórica para Emagrecimento</p>
                      <p className="text-lg font-bold">{profile.metrics.dailyCalories - 500} kcal</p>
                      <p className="text-xs text-gray-600">Déficit recomendado para perda saudável</p>
                    </div>
                    
                    <div className="bg-nutrivida-light p-4 rounded-lg">
                      <p className="font-semibold text-nutrivida-dark">Meta Semanal de Perda</p>
                      <p className="text-lg font-bold">{profile.metrics.weeklyGoal} kg</p>
                      <p className="text-xs text-gray-600">Perda de peso saudável por semana</p>
                    </div>
                  </div>
                  
                  <div className="bg-nutrivida-secondary/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Dicas para Seguir Seu Plano</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Beba pelo menos 2 litros de água por dia</li>
                      <li>Faça 5-6 refeições menores ao longo do dia</li>
                      <li>Evite alimentos ultraprocessados e com açúcar refinado</li>
                      <li>Priorize alimentos integrais e proteínas magras</li>
                      <li>Combine seu plano alimentar com exercícios regulares</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DietPlan;

