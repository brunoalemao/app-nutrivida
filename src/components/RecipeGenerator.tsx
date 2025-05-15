import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { getRandomRecipe, formatRecipe } from '@/utils/localRecipeGenerator';
import { toast } from 'sonner';

// Chave para armazenar no localStorage quando o usuário gerou uma receita pela última vez
const LAST_RECIPE_GENERATED_KEY = 'last_recipe_generated_';

const RecipeGenerator: React.FC = () => {
  const [recipe, setRecipe] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [nextRecipeAvailableDate, setNextRecipeAvailableDate] = useState<Date | null>(null);
  const { user: authUser } = useAuth();

  // Verifica quando a última receita foi gerada e se uma nova pode ser gerada
  const checkAndGenerateRecipe = () => {
    if (!authUser) return;
    
    const lastGeneratedKey = LAST_RECIPE_GENERATED_KEY + authUser.id;
    const lastGeneratedStr = localStorage.getItem(lastGeneratedKey);
    
    if (lastGeneratedStr) {
      const lastGenerated = new Date(lastGeneratedStr);
      const now = new Date();
      
      // Calcula a data da próxima receita disponível (1 dia após a última)
      const nextAvailable = new Date(lastGenerated);
      nextAvailable.setDate(nextAvailable.getDate() + 1); // Agora é um dia em vez de 7
      setNextRecipeAvailableDate(nextAvailable);
      
      // Verifica se passou um dia desde a última geração
      if (now < nextAvailable) {
        // Menos de um dia se passou, então carrega a receita salva
        const savedRecipe = localStorage.getItem('saved_recipe_' + authUser.id);
        if (savedRecipe) {
          setRecipe(savedRecipe);
          return;
        }
      }
    }
    
    // Se chegou aqui, ou nunca gerou uma receita ou já passou um dia
    generateRecipe();
  };

  const generateRecipe = () => {
    if (!authUser) return;
    
    // Verifica se o usuário pode gerar uma nova receita
    if (nextRecipeAvailableDate && new Date() < nextRecipeAvailableDate) {
      const horasRestantes = Math.ceil((nextRecipeAvailableDate.getTime() - new Date().getTime()) / (1000 * 60 * 60));
      toast.error(`Você só pode gerar uma nova receita em ${horasRestantes} hora${horasRestantes > 1 ? 's' : ''}`);
      return;
    }

    setLoading(true);
    
    // Força uma nova receita adicionando um timestamp ao ID do usuário
    const forceNewTime = new Date().getTime().toString();
    const tempUserId = authUser.id.split('-')[0] + '-' + forceNewTime;
    
    try {
      // Obter uma receita aleatória do banco local
      const randomRecipe = getRandomRecipe(tempUserId);
      const formattedRecipe = formatRecipe(randomRecipe);
      
      setRecipe(formattedRecipe);
      saveRecipeData(formattedRecipe);
    } catch (error) {
      console.error('Erro ao gerar receita:', error);
      setRecipe('Não foi possível gerar uma receita no momento. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Salva os dados da receita e a data de geração
  const saveRecipeData = (recipeText: string) => {
    if (!authUser) return;
    
    const now = new Date();
    localStorage.setItem(LAST_RECIPE_GENERATED_KEY + authUser.id, now.toISOString());
    localStorage.setItem('saved_recipe_' + authUser.id, recipeText);
    
    // Calcula a próxima data disponível (1 dia depois)
    const nextAvailable = new Date(now);
    nextAvailable.setDate(nextAvailable.getDate() + 1); // Agora é 1 dia
    setNextRecipeAvailableDate(nextAvailable);
  };

  // Formata a data para exibição
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `em ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Gerar uma receita inicial quando o componente for montado, se não houver receita
  useEffect(() => {
    if (!recipe && authUser) {
      checkAndGenerateRecipe();
    }
  }, [authUser, recipe]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Receitas Saudáveis</CardTitle>
        <CardDescription>
          Descubra receitas deliciosas e saudáveis para seu plano alimentar
        </CardDescription>
        {nextRecipeAvailableDate && (
          <p className="mt-1 text-xs text-nutrivida-primary">
            Próxima receita disponível {formatDate(nextRecipeAvailableDate)}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nutrivida-primary"></div>
            <p className="mt-4 text-nutrivida-primary font-medium">Gerando receita saudável...</p>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            {recipe ? (
              <div className="whitespace-pre-line">{recipe}</div>
            ) : (
              <p className="text-center text-gray-500">
                Clique em gerar nova receita para ver sugestões.
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={checkAndGenerateRecipe} 
          disabled={loading || (nextRecipeAvailableDate && new Date() < nextRecipeAvailableDate)}
          className="w-full bg-nutrivida-primary hover:bg-nutrivida-dark"
        >
          {nextRecipeAvailableDate && new Date() < nextRecipeAvailableDate 
            ? `Nova receita disponível ${formatDate(nextRecipeAvailableDate)}` 
            : "Gerar Nova Receita"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeGenerator;
