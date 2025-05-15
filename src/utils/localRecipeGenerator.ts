// Banco de dados local de receitas saudáveis para uso quando a API estiver indisponível

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  prepTime: string;
  servings: number;
  variation: string;
}

// Lista de receitas pré-definidas
export const healthyRecipes: Recipe[] = [
  // Receita 1
  {
    name: "Bowl de Quinoa com Frango e Vegetais",
    ingredients: [
      "120g de peito de frango",
      "1/2 xícara de quinoa cozida",
      "1 xícara de brócolis picado",
      "1/2 cenoura ralada",
      "1/4 de abacate em fatias",
      "1 colher de sopa de azeite",
      "Suco de 1/2 limão",
      "Sal, pimenta e ervas a gosto"
    ],
    instructions: [
      "Tempere o frango com sal, pimenta e ervas a gosto",
      "Grelhe o frango até dourar dos dois lados e esteja completamente cozido",
      "Cozinhe a quinoa conforme instruções da embalagem",
      "Cozinhe o brócolis no vapor por 3-4 minutos até ficar al dente",
      "Monte o bowl com a quinoa na base, depois os vegetais, o frango cortado em fatias e o abacate por cima",
      "Regue com azeite e suco de limão, adicione sal e pimenta a gosto"
    ],
    nutritionalInfo: {
      calories: 420,
      protein: 35,
      carbs: 30,
      fat: 18
    },
    prepTime: "25 minutos",
    servings: 1,
    variation: "Substitua o frango por tofu firme para uma versão vegetariana"
  },
  
  // Receita 2
  {
    name: "Wrap de Omelete com Espinafre e Queijo Cottage",
    ingredients: [
      "2 ovos",
      "1 xícara de espinafre picado",
      "2 colheres de sopa de queijo cottage",
      "1 tomate pequeno picado",
      "1 colher de chá de azeite",
      "Sal e pimenta a gosto",
      "Orégano a gosto"
    ],
    instructions: [
      "Bata os ovos em uma tigela com sal e pimenta",
      "Aqueça o azeite em uma frigideira antiaderente",
      "Despeje os ovos batidos e deixe cozinhar em fogo baixo",
      "Quando a omelete começar a firmar, adicione o espinafre por cima",
      "Quando estiver quase pronta, adicione o queijo cottage e o tomate",
      "Dobre a omelete ao meio como um wrap e polvilhe orégano",
      "Sirva quente"
    ],
    nutritionalInfo: {
      calories: 280,
      protein: 22,
      carbs: 6,
      fat: 19
    },
    prepTime: "15 minutos",
    servings: 1,
    variation: "Adicione cogumelos salteados para um sabor extra"
  },
  
  // Receita 3
  {
    name: "Salada Proteica de Atum e Grão-de-Bico",
    ingredients: [
      "1 lata pequena de atum em água escorrido",
      "1/2 xícara de grão-de-bico cozido",
      "1 tomate médio picado",
      "1/4 de pepino picado",
      "1/4 de cebola roxa fatiada finamente",
      "1 colher de sopa de azeite",
      "Suco de 1/2 limão",
      "Sal, pimenta e ervas frescas a gosto"
    ],
    instructions: [
      "Em uma tigela, misture o atum escorrido e o grão-de-bico",
      "Adicione o tomate, pepino e cebola roxa",
      "Tempere com azeite, suco de limão, sal, pimenta e ervas",
      "Misture delicadamente todos os ingredientes",
      "Leve à geladeira por 15 minutos antes de servir para intensificar os sabores"
    ],
    nutritionalInfo: {
      calories: 350,
      protein: 30,
      carbs: 25,
      fat: 15
    },
    prepTime: "10 minutos",
    servings: 1,
    variation: "Substitua o atum por frango desfiado para uma versão diferente"
  },
  
  // Receita 4
  {
    name: "Tigela de Aveia Proteica com Frutas",
    ingredients: [
      "1/2 xícara de aveia em flocos",
      "1 scoop de proteína em pó sabor baunilha",
      "1 xícara de leite desnatado ou vegetal",
      "1/2 banana fatiada",
      "1/4 xícara de mirtilos (blueberries)",
      "1 colher de sopa de pasta de amendoim",
      "1 colher de chá de sementes de chia"
    ],
    instructions: [
      "Misture a aveia, a proteína em pó e o leite em uma tigela",
      "Deixe descansar por 5 minutos para a aveia absorver o líquido",
      "Adicione a banana fatiada e os mirtilos por cima",
      "Finalize com a pasta de amendoim e as sementes de chia"
    ],
    nutritionalInfo: {
      calories: 380,
      protein: 25,
      carbs: 45,
      fat: 12
    },
    prepTime: "10 minutos",
    servings: 1,
    variation: "Use frutas vermelhas congeladas para uma versão mais refrescante"
  },
  
  // Receita 5
  {
    name: "Salmão Assado com Aspargos",
    ingredients: [
      "150g de filé de salmão",
      "8 aspargos frescos",
      "1/2 limão (suco e raspas)",
      "1 colher de sopa de azeite",
      "1 dente de alho picado",
      "Sal e pimenta a gosto",
      "Ervas frescas (dill ou salsa) a gosto"
    ],
    instructions: [
      "Pré-aqueça o forno a 180°C",
      "Tempere o salmão com sal, pimenta, raspas de limão e ervas",
      "Corte as pontas duras dos aspargos e disponha-os ao redor do salmão",
      "Regue o salmão e os aspargos com azeite e suco de limão",
      "Polvilhe o alho picado por cima",
      "Asse por 15-18 minutos ou até que o salmão esteja cozido",
      "Sirva imediatamente"
    ],
    nutritionalInfo: {
      calories: 320,
      protein: 32,
      carbs: 8,
      fat: 18
    },
    prepTime: "25 minutos",
    servings: 1,
    variation: "Substitua o salmão por truta para uma versão mais econômica"
  },
  
  // Receita 6
  {
    name: "Smoothie Bowl de Frutas Vermelhas",
    ingredients: [
      "1 xícara de frutas vermelhas congeladas (morango, framboesa, amora)",
      "1/2 banana congelada",
      "1/4 xícara de iogurte grego natural",
      "1 colher (scoop) de proteína em pó sabor neutro",
      "2 colheres de sopa de água (se necessário)",
      "Toppings: 1 colher de sopa de granola, 1/2 colher de sopa de sementes de chia, frutas frescas"
    ],
    instructions: [
      "No liquidificador, bata as frutas congeladas, a banana, o iogurte e a proteína",
      "Adicione água aos poucos apenas se necessário para ajudar a bater",
      "Transfira para uma tigela",
      "Decore com granola, sementes de chia e frutas frescas"
    ],
    nutritionalInfo: {
      calories: 310,
      protein: 24,
      carbs: 42,
      fat: 6
    },
    prepTime: "10 minutos",
    servings: 1,
    variation: "Use manga e abacaxi para uma versão tropical"
  },
  
  // Receita 7
  {
    name: "Tofu Salteado com Legumes",
    ingredients: [
      "150g de tofu firme em cubos",
      "1 xícara de brócolis em floretes",
      "1/2 pimentão vermelho fatiado",
      "1/2 cenoura cortada em palitos finos",
      "1 dente de alho picado",
      "1 colher de chá de gengibre ralado",
      "1 colher de sopa de molho de soja (shoyu)",
      "1 colher de chá de óleo de gergelim",
      "1 colher de sopa de azeite"
    ],
    instructions: [
      "Escorra o tofu e pressione com papel-toalha para remover o excesso de água",
      "Aqueça o azeite em uma wok ou frigideira grande",
      "Doure o tofu de todos os lados e reserve",
      "Na mesma wok, salteie o alho e o gengibre por 30 segundos",
      "Adicione os legumes e salteie por 3-4 minutos até ficarem al dente",
      "Retorne o tofu à wok, adicione o molho de soja e misture",
      "Finalize com óleo de gergelim e sirva imediatamente"
    ],
    nutritionalInfo: {
      calories: 290,
      protein: 20,
      carbs: 15,
      fat: 18
    },
    prepTime: "20 minutos",
    servings: 1,
    variation: "Adicione um pouco de pimenta caiena para uma versão picante"
  },
  
  // Receita 8
  {
    name: "Muffins de Ovo com Espinafre e Queijo",
    ingredients: [
      "6 ovos",
      "1 xícara de espinafre picado",
      "1/4 de cebola picada",
      "1/2 pimentão vermelho picado",
      "50g de queijo feta ou cottage esfarelado",
      "Sal e pimenta a gosto",
      "1 colher de chá de azeite para untar"
    ],
    instructions: [
      "Pré-aqueça o forno a 180°C",
      "Unte formas de muffin com azeite",
      "Bata os ovos em uma tigela e tempere com sal e pimenta",
      "Distribua o espinafre, cebola e pimentão nas formas",
      "Despeje a mistura de ovos por cima",
      "Espalhe o queijo",
      "Asse por 20-25 minutos até que estejam firmes e dourados",
      "Deixe esfriar um pouco antes de desenformar"
    ],
    nutritionalInfo: {
      calories: 240,
      protein: 18,
      carbs: 4,
      fat: 16
    },
    prepTime: "35 minutos",
    servings: 6,
    variation: "Adicione cogumelos salteados para mais sabor"
  },
  
  // Receita 9
  {
    name: "Papillote de Peixe com Legumes",
    ingredients: [
      "150g de filé de peixe branco (tilápia, linguado ou merluza)",
      "1/2 abobrinha fatiada",
      "1/2 cenoura fatiada finamente",
      "1/4 de cebola fatiada",
      "1/2 limão (suco e rodelas)",
      "1 colher de sopa de azeite",
      "Ervas frescas (salsinha, cebolinha)",
      "Sal e pimenta a gosto"
    ],
    instructions: [
      "Pré-aqueça o forno a 200°C",
      "Corte um pedaço grande de papel alumínio ou papel manteiga",
      "Coloque as fatias de legumes no centro do papel",
      "Tempere o peixe com sal, pimenta e coloque sobre os legumes",
      "Regue com azeite e suco de limão",
      "Coloque rodelas de limão e ervas frescas por cima",
      "Feche o papillote selando bem as bordas",
      "Asse por 15-20 minutos",
      "Abra cuidadosamente (vapor quente!) e sirva"
    ],
    nutritionalInfo: {
      calories: 280,
      protein: 30,
      carbs: 10,
      fat: 14
    },
    prepTime: "30 minutos",
    servings: 1,
    variation: "Use diferentes ervas como tomilho ou alecrim para variar o sabor"
  },
  
  // Receita 10
  {
    name: "Salada de Lentilha com Legumes Assados",
    ingredients: [
      "1/2 xícara de lentilhas secas (ou 1 xícara de lentilhas já cozidas)",
      "1 xícara de vegetais para assar (cenoura, abóbora, beterraba)",
      "1/4 de cebola roxa fatiada",
      "Folhas verdes a gosto (rúcula, espinafre)",
      "1 colher de sopa de azeite",
      "1 colher de sopa de vinagre balsâmico",
      "1 colher de chá de mostarda Dijon",
      "Sal e pimenta a gosto"
    ],
    instructions: [
      "Cozinhe as lentilhas conforme as instruções da embalagem e escorra",
      "Pré-aqueça o forno a 200°C",
      "Corte os vegetais em cubos, tempere com azeite, sal e pimenta",
      "Asse os vegetais por 20-25 minutos até ficarem macios e dourados",
      "Prepare o molho misturando azeite, vinagre balsâmico e mostarda",
      "Em uma tigela, misture as lentilhas, os vegetais assados e a cebola",
      "Adicione as folhas verdes e o molho",
      "Misture delicadamente e sirva"
    ],
    nutritionalInfo: {
      calories: 310,
      protein: 15,
      carbs: 40,
      fat: 10
    },
    prepTime: "45 minutos",
    servings: 2,
    variation: "Adicione queijo de cabra esfarelado por cima para mais proteína e cremosidade"
  }
];

// Função para obter uma receita aleatória baseada no ID do usuário
export function getRandomRecipe(userId: string): Recipe {
  // Usar ID do usuário como seed para pseudo-aleatoriedade
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
  const index = positiveHash % healthyRecipes.length;
  
  return healthyRecipes[index];
}

// Função para formatar receita como texto
export function formatRecipe(recipe: Recipe): string {
  return `
# ${recipe.name}

## Ingredientes:
${recipe.ingredients.map(ingredient => `- ${ingredient}`).join('\n')}

## Modo de Preparo:
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Informações Nutricionais (por porção):
- Calorias: ${recipe.nutritionalInfo.calories} kcal
- Proteínas: ${recipe.nutritionalInfo.protein}g
- Carboidratos: ${recipe.nutritionalInfo.carbs}g
- Gorduras: ${recipe.nutritionalInfo.fat}g

## Tempo de Preparo: ${recipe.prepTime}
## Rendimento: ${recipe.servings} ${recipe.servings > 1 ? 'porções' : 'porção'}

## Dica de Variação:
${recipe.variation}
`;
} 