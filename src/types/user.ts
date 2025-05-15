
export interface User {
  id: string;
  name: string;
  email: string;
  profile?: UserProfile;
  createdAt: Date;
}

export interface UserProfile {
  age: number;
  gender: 'masculino' | 'feminino' | 'outro';
  height: number; // em cm
  currentWeight: number; // em kg
  goalWeight: number; // em kg
  activityLevel: 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'muito_ativo';
  weightHistory: WeightRecord[];
  metrics?: UserMetrics;
}

export interface WeightRecord {
  date: Date;
  weight: number;
}

export interface UserMetrics {
  bmi: number; // IMC - Índice de Massa Corporal
  bmr: number; // TMB - Taxa Metabólica Basal
  dailyCalories: number; // Calorias diárias recomendadas
  weeklyGoal: number; // Meta semanal de perda de peso em kg
}

export interface Diet {
  id: string;
  name: string;
  description: string;
  totalCalories: number;
  meals: Meal[];
}

export interface Meal {
  id: string;
  name: string;
  type: 'cafe_da_manha' | 'lanche_manha' | 'almoco' | 'lanche_tarde' | 'jantar' | 'ceia';
  calories: number;
  foods: Food[];
}

export interface Food {
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number; // em minutos
  cookTime: number; // em minutos
  servings: number;
  calories: number;
  ingredients: string[];
  instructions: string[];
  image?: string;
  tags: string[];
}
