// Banco de dados local de refeições para uso quando a API estiver indisponível
export interface MealPlan {
  breakfast: string;
  morningSnack: string;
  lunch: string;
  afternoonSnack: string;
  dinner: string;
  eveningSnack?: string;
  tips: string[];
}

// Café da manhã - opções
export const breakfastOptions = [
  "- 2 fatias de pão integral\n- 1 colher de sopa de pasta de amendoim\n- 1 maçã\n- 1 xícara de chá verde",
  "- Omelete com 2 ovos, tomate e espinafre\n- 1 fatia de pão integral\n- 1 xícara de chá de hortelã",
  "- Mingau de aveia (40g) com canela e banana\n- 1 colher de chá de mel\n- 1 xícara de leite desnatado",
  "- Iogurte natural (200g) com granola sem açúcar (20g)\n- 1 punhado de frutas vermelhas\n- 1 xícara de chá de camomila",
  "- Panquecas de banana (1 banana + 1 ovo + canela)\n- 1 colher de sopa de mel\n- 1 xícara de café com leite desnatado",
  "- Tapioca média com queijo branco e orégano\n- 1 laranja\n- 1 xícara de chá verde",
  "- Smoothie de banana, morango e leite de amêndoas\n- 1 torrada integral com abacate",
  "- 200g de cuscuz de milho\n- 1 ovo cozido\n- 1 maçã\n- 1 xícara de café preto",
  "- 2 fatias de pão integral com 2 colheres de requeijão light\n- 1 fatia de melão\n- 1 xícara de chá mate",
  "- Vitamina de mamão com aveia (200ml)\n- 1 torrada integral com queijo branco"
];

// Lanche da manhã - opções
export const morningSnackOptions = [
  "- 1 iogurte natural desnatado\n- 1 colher de sopa de granola sem açúcar\n- 5 unidades de castanha-do-pará",
  "- 1 maçã média\n- 12 amêndoas",
  "- 1 banana com 1 colher de sopa de pasta de amendoim",
  "- 1 pote pequeno de salada de frutas\n- 3 castanhas de caju",
  "- 1 pera média\n- 1 fatia de queijo branco",
  "- 1 copo de suco verde (couve, limão, gengibre, maçã)",
  "- 1 barra de cereal integral sem açúcar\n- 1 tangerina",
  "- 1 fatia média de melão com 50g de presunto de peru",
  "- 1 iogurte de kefir (200ml)\n- 2 colheres de aveia",
  "- 1 xícara de morangos com 1 colher de iogurte natural"
];

// Almoço - opções
export const lunchOptions = [
  "- 120g de peito de frango grelhado\n- 2 colheres de sopa de arroz integral\n- 4 colheres de sopa de feijão\n- Salada de folhas verdes à vontade\n- 1 colher de sobremesa de azeite",
  "- 120g de salmão assado\n- 1 batata doce média assada\n- Legumes no vapor (brócolis, cenoura, abobrinha)\n- 1 colher de sopa de azeite",
  "- 120g de carne magra grelhada\n- 3 colheres de sopa de arroz integral\n- 2 colheres de sopa de lentilhas\n- Salada de tomate, pepino e cebola roxa\n- 1 colher de chá de azeite",
  "- 2 ovos cozidos\n- 4 colheres de sopa de quinoa\n- Mix de legumes salteados (abobrinha, berinjela, pimentão)\n- 1 colher de sopa de azeite",
  "- 120g de peixe branco assado\n- Purê de abóbora (100g)\n- Salada de folhas e tomate cereja\n- 1 colher de sobremesa de azeite",
  "- 120g de peito de peru grelhado\n- 4 colheres de sopa de arroz de couve-flor\n- Salada de repolho e cenoura ralada\n- 1 colher de chá de azeite",
  "- Omelete de legumes (2 ovos + abobrinha, tomate, cebola)\n- 2 colheres de sopa de arroz integral\n- Salada verde com rúcula e agrião\n- 1 colher de azeite",
  "- Escondidinho de batata doce com frango desfiado (150g)\n- Salada de alface, tomate e pepino\n- 1 colher de chá de azeite",
  "- 100g de carne moída refogada com legumes\n- 3 colheres de sopa de macarrão integral\n- Salada de agrião com tomate\n- 1 colher de chá de azeite",
  "- Bowl de proteína (100g de frango + quinoa + brócolis + cenoura + tomate)\n- 1 colher de azeite"
];

// Lanche da tarde - opções
export const afternoonSnackOptions = [
  "- 1 banana média\n- 1 colher de sopa de aveia\n- 1 copo de água de coco",
  "- 1 fatia de pão integral com 1 fatia de queijo branco\n- 1 xícara de chá verde",
  "- 1 maçã média com 1 colher de sopa de pasta de amendoim",
  "- 1 pote pequeno de iogurte natural com canela\n- 5 nozes",
  "- 1 ovo cozido\n- 1 torrada integral\n- 1 xícara de chá de erva-cidreira",
  "- Shake proteico (200ml de leite desnatado + 1 scoop de proteína + 1 fruta)",
  "- 1 barrinha caseira de aveia e banana\n- 1 xícara de chá de hortelã",
  "- 200ml de vitamina de abacate (sem açúcar)\n- 2 biscoitos integrais",
  "- 2 fatias de abacaxi\n- 1 fatia de queijo branco\n- 1 xícara de chá mate",
  "- 1 pera com 1 colher de canela\n- 5 amêndoas"
];

// Jantar - opções
export const dinnerOptions = [
  "- 120g de peixe assado\n- Legumes no vapor (brócolis, cenoura, abobrinha)\n- 1 batata doce pequena",
  "- Sopa de legumes com peito de frango desfiado (300ml)\n- 1 fatia de pão integral",
  "- Omelete de espinafre (2 ovos)\n- Salada de folhas verdes\n- 1 colher de chá de azeite",
  "- Salada de atum (100g) com folhas verdes, tomate e pepino\n- 1 colher de azeite\n- 1 fatia de pão integral",
  "- 100g de peito de frango grelhado\n- Purê de couve-flor (100g)\n- Salada de rúcula e tomate\n- 1 colher de chá de azeite",
  "- 100g de carne magra grelhada\n- Abobrinha refogada\n- Salada de alface e tomate\n- 1 colher de chá de azeite",
  "- 120g de peixe assado com ervas\n- Mix de legumes assados (pimentão, cebola, tomate)\n- 1 colher de chá de azeite",
  "- Wrap de alface com atum (100g), tomate e cebola\n- 1 colher de chá de azeite",
  "- 100g de tofu grelhado com legumes\n- Salada de folhas verdes\n- 1 colher de chá de azeite",
  "- 2 ovos mexidos com espinafre e cogumelos\n- Salada de tomate e pepino\n- 1 colher de chá de azeite"
];

// Ceia (opcional) - opções
export const eveningSnackOptions = [
  "- 1 xícara de chá de camomila\n- 3 castanhas",
  "- 1 copo pequeno de leite morno com canela",
  "- 1 iogurte natural (100g)",
  "- Chá de erva-doce sem açúcar",
  "- 1 banana pequena",
  "- 1 maçã pequena fatiada com canela",
  "- 1 xícara de chá de melissa",
  "- 1/2 pera",
  "- 1 copo de leite vegetal sem açúcar",
  "- 1 iogurte kefir (100ml)"
];

// Dicas nutricionais - opções
export const nutritionalTipsOptions = [
  [
    "Prepare as refeições com antecedência para evitar escolhas impulsivas",
    "Beba pelo menos 2 litros de água por dia",
    "Evite alimentos processados e ultra-processados"
  ],
  [
    "Mastigue bem os alimentos para melhorar a digestão",
    "Evite refrigerantes e sucos industrializados",
    "Prefira alimentos integrais aos refinados"
  ],
  [
    "Respeite os horários das refeições",
    "Coma devagar, em ambiente tranquilo",
    "Inclua proteínas magras em todas as refeições"
  ],
  [
    "Priorize métodos de cocção como cozimento, assado ou grelhado",
    "Tenha sempre vegetais e frutas disponíveis para lanches",
    "Utilize ervas e especiarias para dar sabor aos alimentos em vez de sal em excesso"
  ],
  [
    "Leia os rótulos dos alimentos antes de comprar",
    "Reduza o consumo de açúcares adicionados",
    "Não pule refeições, especialmente o café da manhã"
  ]
];

// Função para gerar um número aleatório baseado no ID do usuário e no dia
export function getRandomIndex(array: any[], userId: string): number {
  // Usar uma combinação do ID do usuário e o dia para ter pseudo-aleatoriedade
  // mas manter o mesmo plano durante o dia todo
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = userId + today;
  
  // Criar um valor hash simples
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash; // Converter para inteiro de 32 bits
  }
  
  // Garantir que seja positivo e dentro do range do array
  const positiveHash = Math.abs(hash);
  return positiveHash % array.length;
}

// Função para obter um plano alimentar baseado no ID do usuário
export function getLocalMealPlan(userId: string): MealPlan {
  // Obter índices para cada tipo de refeição
  const breakfastIndex = getRandomIndex(breakfastOptions, userId + "breakfast");
  const morningSnackIndex = getRandomIndex(morningSnackOptions, userId + "morningSnack");
  const lunchIndex = getRandomIndex(lunchOptions, userId + "lunch");
  const afternoonSnackIndex = getRandomIndex(afternoonSnackOptions, userId + "afternoonSnack");
  const dinnerIndex = getRandomIndex(dinnerOptions, userId + "dinner");
  const eveningSnackIndex = getRandomIndex(eveningSnackOptions, userId + "eveningSnack");
  const tipsIndex = getRandomIndex(nutritionalTipsOptions, userId + "tips");
  
  // Retornar o plano alimentar formatado
  return {
    breakfast: breakfastOptions[breakfastIndex],
    morningSnack: morningSnackOptions[morningSnackIndex],
    lunch: lunchOptions[lunchIndex],
    afternoonSnack: afternoonSnackOptions[afternoonSnackIndex],
    dinner: dinnerOptions[dinnerIndex],
    eveningSnack: eveningSnackOptions[eveningSnackIndex],
    tips: nutritionalTipsOptions[tipsIndex]
  };
}

// Função para formatar o plano em texto
export function formatMealPlan(plan: MealPlan, calories: number = 1500): string {
  return `
# Plano Alimentar Personalizado (${calories} kcal)

## Café da Manhã (300-350 kcal)
${plan.breakfast}

## Lanche da Manhã (150-200 kcal)
${plan.morningSnack}

## Almoço (400-450 kcal)
${plan.lunch}

## Lanche da Tarde (150-200 kcal)
${plan.afternoonSnack}

## Jantar (350-400 kcal)
${plan.dinner}

## Ceia (opcional, 100-150 kcal)
${plan.eveningSnack}

## Dicas para manter o plano alimentar:
1. ${plan.tips[0]}
2. ${plan.tips[1]}
3. ${plan.tips[2]}
`;
} 