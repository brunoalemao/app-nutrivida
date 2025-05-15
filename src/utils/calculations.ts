
import { UserProfile, UserMetrics } from '../types/user';

// Calcula o IMC (Índice de Massa Corporal)
export function calculateBMI(height: number, weight: number): number {
  // Altura em metros (convertendo de cm)
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

// Interpreta o resultado do IMC
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Abaixo do peso";
  if (bmi < 24.9) return "Peso normal";
  if (bmi < 29.9) return "Sobrepeso";
  if (bmi < 34.9) return "Obesidade Grau 1";
  if (bmi < 39.9) return "Obesidade Grau 2";
  return "Obesidade Grau 3";
}

// Calcula a Taxa Metabólica Basal (TMB) usando a fórmula de Mifflin-St Jeor
export function calculateBMR(profile: UserProfile): number {
  const { age, gender, height, currentWeight } = profile;
  
  if (gender === 'masculino') {
    return Math.round(10 * currentWeight + 6.25 * height - 5 * age + 5);
  } else {
    return Math.round(10 * currentWeight + 6.25 * height - 5 * age - 161);
  }
}

// Calcula as calorias diárias com base no nível de atividade
export function calculateDailyCalories(bmr: number, activityLevel: string): number {
  const activityMultipliers = {
    sedentario: 1.2,      // Pouco ou nenhum exercício
    leve: 1.375,          // Exercício leve 1-3 dias por semana
    moderado: 1.55,       // Exercício moderado 3-5 dias por semana
    ativo: 1.725,         // Exercício pesado 6-7 dias por semana
    muito_ativo: 1.9      // Exercício muito pesado, trabalho físico
  };

  const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers];
  return Math.round(bmr * multiplier);
}

// Calcula o déficit calórico para perda de peso saudável (0.5kg por semana)
export function calculateCaloriesForWeightLoss(dailyCalories: number): number {
  // Déficit de ~500 calorias por dia para perder ~0.5kg por semana
  return Math.max(1200, dailyCalories - 500); // Não recomenda menos que 1200 calorias
}

// Calcula todas as métricas do usuário
export function calculateUserMetrics(profile: UserProfile): UserMetrics {
  const bmi = calculateBMI(profile.height, profile.currentWeight);
  const bmr = calculateBMR(profile);
  const dailyCalories = calculateDailyCalories(bmr, profile.activityLevel);
  
  // Define meta semanal de perda de peso (entre 0.5kg e 1kg por semana dependendo do IMC)
  let weeklyGoal = 0.5; // padrão
  if (bmi > 30) {
    weeklyGoal = 1.0; // para obesidade, meta maior é segura
  } else if (bmi > 27) {
    weeklyGoal = 0.7; // para sobrepeso considerável
  }
  
  return {
    bmi,
    bmr,
    dailyCalories,
    weeklyGoal
  };
}

// Calcula o tempo estimado para atingir o peso meta
export function calculateTimeToGoal(currentWeight: number, goalWeight: number, weeklyGoal: number): number {
  if (currentWeight <= goalWeight) return 0;
  const weightToLose = currentWeight - goalWeight;
  return Math.ceil(weightToLose / weeklyGoal); // em semanas
}
