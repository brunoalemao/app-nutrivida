// Utilitário para gerar conteúdo simulado para a aplicação

import { API_KEYS, API_ENDPOINTS, API_CONFIG, USE_LOCAL_FALLBACK } from '@/config/api';
import { supabase } from '@/integrations/supabase/client';
import { saveAIContentHistory } from '@/services/aiContentHistory';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
  }[];
}

interface GeminiErrorResponse {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

class GeminiError extends Error {
  constructor(
    message: string, 
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Gera conteúdo localmente como fallback quando a API Gemini não está disponível
 */
function generateFallbackContent(prompt: string, type: string): string {
  console.log('Usando geração de conteúdo local de fallback');
  
  if (type === 'diet_plan') {
    return `
# Plano Alimentar Saudável

## Café da Manhã (300-350 kcal)
- 2 fatias de pão integral
- 1 colher de sopa de pasta de amendoim
- 1 maçã média
- 1 xícara de chá verde

## Lanche da Manhã (150-200 kcal)
- 1 iogurte natural desnatado
- 1 colher de sopa de granola sem açúcar
- 5 unidades de castanha-do-pará

## Almoço (400-450 kcal)
- 120g de peito de frango grelhado
- 2 colheres de sopa de arroz integral
- 4 colheres de sopa de feijão
- Salada de folhas verdes à vontade
- 1 colher de sobremesa de azeite

## Lanche da Tarde (150-200 kcal)
- 1 banana média
- 1 colher de sopa de aveia
- 1 copo de água de coco

## Jantar (350-400 kcal)
- 120g de peixe assado
- Legumes no vapor (brócolis, cenoura, abobrinha)
- 1 batata doce pequena

## Dicas para manter o plano alimentar:
1. Prepare as refeições com antecedência para evitar escolhas impulsivas
2. Beba pelo menos 2 litros de água por dia
3. Evite alimentos processados e ultra-processados
`;
  } else if (type === 'recipe') {
    return `
# Tigela de Proteína com Legumes Assados

## Ingredientes:
- 120g de peito de frango
- 1 xícara de brócolis
- 1 cenoura média
- 1/2 abobrinha
- 1/4 de cebola roxa
- 1 colher de sopa de azeite
- 1 dente de alho picado
- Sal, pimenta e ervas a gosto
- 1/2 xícara de quinoa cozida

## Modo de Preparo:
1. Pré-aqueça o forno a 200°C.
2. Corte os legumes em pedaços semelhantes.
3. Misture os legumes com metade do azeite, sal e pimenta.
4. Asse por 20-25 minutos, virando na metade do tempo.
5. Tempere o peito de frango com sal e pimenta.
6. Em uma frigideira, aqueça o restante do azeite e doure o alho.
7. Cozinhe o frango por 6-7 minutos de cada lado até dourar.
8. Deixe o frango descansar por 5 minutos e fatie.
9. Monte a tigela com a quinoa na base, os legumes assados e o frango fatiado por cima.

## Informações Nutricionais (por porção):
- Calorias: 350 kcal
- Proteínas: 30g
- Carboidratos: 25g
- Gorduras: 12g

## Tempo de Preparo: 40 minutos
## Rendimento: 1 porção

## Dica de Variação:
Substitua o frango por tofu firme marinado para uma versão vegetariana.
`;
  } else if (type === 'motivation') {
    return `
1. Lembre-se que pequenas mudanças diárias levam a grandes resultados ao longo do tempo.

2. Celebre cada vitória, por menor que seja - cada escolha saudável é um passo na direção certa.

3. Seu corpo está mudando mesmo quando a balança não mostra - músculos pesam mais que gordura.

4. Foque em como você se sente, não apenas nos números - mais energia e disposição são sinais de progresso.

5. Transformar hábitos leva tempo - seja paciente e persista mesmo nos dias difíceis.

6. Visualize seu objetivo e lembre-se do porquê começou quando sentir vontade de desistir.

7. Não busque a perfeição, busque a consistência - é melhor manter 80% de adherência constante do que 100% por uma semana e desistir.
`;
  } else {
    return `
Não foi possível gerar o conteúdo solicitado no momento. Por favor, tente novamente mais tarde.

Enquanto isso, continue seguindo estas orientações gerais:
- Mantenha uma alimentação balanceada com proteínas magras, gorduras saudáveis e carboidratos complexos
- Beba bastante água ao longo do dia
- Pratique atividade física regularmente
- Durma pelo menos 7-8 horas por noite
- Gerencie o estresse com técnicas de relaxamento
`;
  }
}

/**
 * Função para gerar conteúdo usando a API Gemini com retry automático e fallback
 */
export async function generateWithGemini(
  prompt: string,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<string> {
  // Se não tiver chave da API, estiver no modo de desenvolvimento com flag específica, 
  // ou o fallback global estiver ativado, use o fallback
  if (!API_KEYS.GEMINI || import.meta.env.VITE_USE_FALLBACK === 'true' || USE_LOCAL_FALLBACK) {
    console.log('Usando geração local de conteúdo (fallback ativado)');
    return generateFallbackContent(prompt, getContentType(prompt));
  }

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Espera exponencial entre tentativas
        await delay(initialDelay * Math.pow(2, attempt - 1));
      }

      console.log(`Tentando gerar conteúdo com Gemini (tentativa ${attempt + 1}/${maxRetries})`);
      
      // Ajustando payload para Gemini 1.0
      const payload = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: API_CONFIG.temperature,
          topK: API_CONFIG.topK,
          topP: API_CONFIG.topP,
          maxOutputTokens: API_CONFIG.maxOutputTokens,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };
      
      console.log('Payload da requisição:', JSON.stringify(payload));
      console.log('Endpoint:', `${API_ENDPOINTS.GEMINI}?key=${API_KEYS.GEMINI.substring(0, 5)}...`);
      
      const response = await fetch(
        `${API_ENDPOINTS.GEMINI}?key=${API_KEYS.GEMINI}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resposta com erro HTTP:', response.status, response.statusText);
        console.error('Texto da resposta de erro:', errorText);
        
        let errorData: GeminiErrorResponse;
        try {
          errorData = JSON.parse(errorText) as GeminiErrorResponse;
        } catch (e) {
          console.error('Erro ao parsear resposta de erro:', e);
          errorData = {
            error: {
              code: response.status,
              message: `Erro HTTP ${response.status}: ${response.statusText}`,
              status: response.statusText
            }
          };
        }
        
        const errorMessage = errorData.error?.message || 'Erro desconhecido na API Gemini';
        
        // Log detalhado do erro para ajudar no diagnóstico
        console.error('Detalhes do erro:', {
          status: response.status,
          statusText: response.statusText,
          errorCode: errorData.error?.code,
          errorMessage: errorMessage
        });
        
        if (errorMessage.includes('API key not valid')) {
          throw new GeminiError(
            'Chave da API inválida. Por favor, configure uma chave válida.',
            response.status,
            'INVALID_API_KEY'
          );
        }
        
        // Detectar diferentes tipos de erros para tratamento específico
        if (response.status === 404 || 
            errorMessage.includes('not found') || 
            errorMessage.includes('is not found for API version')) {
          throw new GeminiError(
            'Modelo não encontrado. Verifique o nome do modelo no endpoint.',
            response.status,
            'MODEL_NOT_FOUND'
          );
        }
        
        if (response.status === 400) {
          if (errorMessage.includes('safety')) {
            throw new GeminiError(
              'O conteúdo solicitado foi bloqueado por questões de segurança.',
              response.status,
              'SAFETY_ERROR'
            );
          } else if (errorMessage.includes('Invalid request')) {
            throw new GeminiError(
              'Requisição inválida. Verifique o formato do payload enviado para a API.',
              response.status,
              'INVALID_REQUEST'
            );
          }
        }
        
        if (response.status === 429) {
          throw new GeminiError(
            'Limite de taxa excedido. Tente novamente mais tarde.',
            response.status,
            'RATE_LIMIT_EXCEEDED'
          );
        }
        
        if (response.status === 500 || response.status === 503) {
          throw new GeminiError(
            'Serviço do Gemini temporariamente indisponível. Tente novamente mais tarde.',
            response.status,
            'SERVICE_UNAVAILABLE'
          );
        }

        throw new GeminiError(
          errorMessage,
          response.status,
          errorData.error?.code?.toString()
        );
      }

      const data = await response.json() as GeminiResponse;
      console.log('Resposta recebida:', data);
      
      // Tratamento para diferentes versões da API Gemini
      let generatedContent: string;
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error('Resposta em formato inválido ou inesperado:', data);
        
        // Tentativa de extração alternativa (para diferentes formatos de resposta)
        if (data.candidates?.[0]?.content?.parts) {
          const parts = data.candidates[0].content.parts;
          // Se for um array de partes, tenta extrair texto de cada uma
          generatedContent = parts.map(part => part.text || '').filter(Boolean).join('\n');
          
          if (generatedContent) {
            console.log('Conteúdo extraído de formato alternativo');
          } else {
            throw new GeminiError('Resposta da API Gemini em formato inválido - não foi possível extrair texto');
          }
        } else {
          throw new GeminiError('Resposta da API Gemini em formato inválido');
        }
      } else {
        generatedContent = data.candidates[0].content.parts[0].text;
      }
      
      console.log('Conteúdo gerado com sucesso!');

      // Salva o conteúdo gerado no histórico
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await saveAIContentHistory(
            user.id,
            prompt,
            generatedContent,
            getContentType(prompt)
          );
        }
      } catch (error) {
        console.error("Erro ao salvar histórico:", error);
      }

      return generatedContent;
    } catch (error) {
      lastError = error;
      
      // Se for um erro que não deve ser retentado, propaga imediatamente
      if (error instanceof GeminiError && 
         ['INVALID_API_KEY', 'MODEL_NOT_FOUND', 'SAFETY_ERROR'].includes(error.code || '')) {
        throw error;
      }

      // Se for a última tentativa, propaga o erro
      if (attempt === maxRetries - 1) {
        if (error instanceof GeminiError) {
          throw error;
        }
        throw new GeminiError(
          'Erro ao gerar conteúdo com Gemini: ' + error.message,
          500,
          'INTERNAL_ERROR'
        );
      }

      // Log da tentativa falha
      console.warn(`Tentativa ${attempt + 1} falhou, tentando novamente...`, error);
    }
  }

  // Se todas as tentativas falharem, use o fallback
  console.log('Todas as tentativas falharam, usando geração local de fallback');
  return generateFallbackContent(prompt, getContentType(prompt));
}

/**
 * Determina o tipo de conteúdo baseado no prompt
 */
function getContentType(prompt: string): string {
  if (prompt.includes("plano de alimentação") || prompt.includes("plano alimentar")) {
    return "diet_plan";
  } else if (prompt.includes("receita") || prompt.includes("culinária")) {
    return "recipe";
  } else if (prompt.includes("motivacional") || prompt.includes("dicas")) {
    return "motivation";
  }
  return "other";
}

/**
 * Gera um plano de dieta personalizado com base no perfil do usuário
 */
export async function generateDietPlan(
  calories: number,
  goalWeight: number,
  currentWeight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
  preferences: string[] = []
): Promise<string> {
  const preferencesText = preferences.length > 0 
    ? `Preferências alimentares: ${preferences.join(', ')}.`
    : "Sem preferências alimentares específicas.";

  const prompt = `
    Você é um nutricionista especializado em emagrecimento.
    Crie um plano de alimentação detalhado para uma pessoa com as seguintes características:
    - Gênero: ${gender}
    - Idade: ${age} anos
    - Altura: ${height} cm
    - Peso atual: ${currentWeight} kg
    - Peso desejado: ${goalWeight} kg
    - Nível de atividade física: ${activityLevel}
    - Meta calórica diária: ${calories} calorias
    ${preferencesText}
    
    Formate o plano alimentar para 1 dia, incluindo café da manhã, lanche da manhã, almoço, lanche da tarde, jantar e ceia opcional.
    Para cada refeição, liste os alimentos com porções em gramas ou medidas caseiras.
    Ao final, inclua 3 dicas práticas para ajudar a pessoa a manter o plano alimentar.
    Responda completamente em português.
  `;

  return generateWithGemini(prompt);
}

/**
 * Gera receitas saudáveis com base nas preferências
 */
export async function generateHealthyRecipes(
  preferences: string[] = [],
  mealType: string = "almoço",
  calorieLimit: number = 500
): Promise<string> {
  const preferencesText = preferences.length > 0 
    ? `Considere essas preferências alimentares: ${preferences.join(', ')}.`
    : "";

  const prompt = `
    Você é um chef especializado em culinária saudável para emagrecimento.
    Crie uma receita detalhada para ${mealType} com no máximo ${calorieLimit} calorias.
    ${preferencesText}
    
    A receita deve incluir:
    - Nome criativo do prato
    - Lista de ingredientes com quantidades
    - Modo de preparo passo a passo
    - Informações nutricionais aproximadas (calorias, proteínas, carboidratos, gorduras)
    - Tempo de preparo
    - Rendimento (porções)
    - Uma dica para variação do prato
    
    O prato deve ser nutritivo, saboroso e ajudar no processo de emagrecimento.
    Responda completamente em português.
  `;

  return generateWithGemini(prompt);
}

/**
 * Gera dicas motivacionais para perda de peso
 */
export async function generateMotivationalTips(
  currentWeight: number,
  goalWeight: number,
  weeksOnDiet: number = 1
): Promise<string> {
  const prompt = `
    Você é um coach especializado em motivação para emagrecimento.
    Gere 5 dicas motivacionais curtas e impactantes para alguém que:
    - Está tentando perder peso (de ${currentWeight}kg para ${goalWeight}kg)
    - Está na semana ${weeksOnDiet} de sua jornada de emagrecimento
    
    As dicas devem ser:
    - Positivas e encorajadoras
    - Baseadas em ciência
    - Práticas e aplicáveis no dia a dia
    - Focadas em construir hábitos saudáveis a longo prazo
    
    Formate as dicas em tópicos curtos e inspire a pessoa a continuar sua jornada.
    Responda completamente em português.
  `;

  return generateWithGemini(prompt);
}
