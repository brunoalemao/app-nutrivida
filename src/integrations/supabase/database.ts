import { supabase } from './client';
import { User, UserProfile, WeightRecord } from '@/types/user';

// =========================================
// Funções para gerenciar perfil do usuário
// =========================================

// Criar ou atualizar o perfil do usuário na tabela "profiles"
export async function upsertUserProfile(userId: string, name: string, email: string) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      name,
      email,
      created_at: new Date().toISOString()
    })
    .select();

  if (error) {
    console.error('Erro ao salvar perfil básico:', error);
    throw error;
  }

  return data;
}

// Salvar ou atualizar dados detalhados do perfil na tabela "user_profiles"
export async function saveUserProfileDetails(
  userId: string, 
  profileData: {
    age: number;
    gender: string;
    height: number;
    currentWeight: number;
    goalWeight: number;
    activityLevel: string;
  }
) {
  try {
    // Primeiro verificamos se já existe um registro para este usuário
    const { data: existingProfile, error: queryError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (queryError) {
      console.error('Erro ao consultar perfil existente:', queryError);
    }
    
    // Se não existir, precisamos criar um com ID
    if (!existingProfile) {
      console.log('Perfil não encontrado, criando novo registro');
      
      // Preparar dados com um ID novo
      const profileWithId = {
        id: crypto.randomUUID(), // Gerar um ID único
        user_id: userId,
        age: profileData.age,
        gender: profileData.gender,
        height: profileData.height,
        current_weight: profileData.currentWeight,
        goal_weight: profileData.goalWeight,
        activity_level: profileData.activityLevel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Inserindo novo perfil:', profileWithId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileWithId);
      
      if (error) {
        console.error('Erro ao inserir novo perfil:', error);
        throw error;
      }
      
      return data;
    }
    
    // Se já existe, atualizamos
    console.log('Perfil encontrado, atualizando:', existingProfile);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        age: profileData.age,
        gender: profileData.gender,
        height: profileData.height,
        current_weight: profileData.currentWeight,
        goal_weight: profileData.goalWeight,
        activity_level: profileData.activityLevel,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao atualizar perfil existente:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro detalhado ao salvar perfil:', error);
    throw error;
  }
}

// Salvar métricas do usuário na tabela "user_metrics"
export async function saveUserMetrics(
  userId: string,
  metrics: {
    bmr: number;
    dailyCalories: number;
    weeklyGoal: number;
    bmi: number;
  }
) {
  try {
    // Primeiro verificamos se já existe um registro para este usuário
    const { data: existingMetrics, error: queryError } = await supabase
      .from('user_metrics')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (queryError) {
      console.error('Erro ao consultar métricas existentes:', queryError);
    }
    
    // Se não existir, precisamos criar um com ID
    if (!existingMetrics) {
      console.log('Métricas não encontradas, criando novo registro');
      
      // Preparar dados com um ID novo
      const metricsWithId = {
        id: crypto.randomUUID(), // Gerar um ID único
        user_id: userId,
        bmr: metrics.bmr,
        daily_calories: metrics.dailyCalories,
        weekly_goal: metrics.weeklyGoal,
        bmi: metrics.bmi,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Inserindo novas métricas:', metricsWithId);
      
      const { data, error } = await supabase
        .from('user_metrics')
        .insert(metricsWithId);
      
      if (error) {
        console.error('Erro ao inserir novas métricas:', error);
        throw error;
      }
      
      return data;
    }
    
    // Se já existe, atualizamos
    console.log('Métricas encontradas, atualizando:', existingMetrics);
    
    const { data, error } = await supabase
      .from('user_metrics')
      .update({
        bmr: metrics.bmr,
        daily_calories: metrics.dailyCalories,
        weekly_goal: metrics.weeklyGoal,
        bmi: metrics.bmi,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao atualizar métricas existentes:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro detalhado ao salvar métricas:', error);
    throw error;
  }
}

// =========================================
// Funções para gerenciar histórico de peso
// =========================================

// Adicionar novo registro de peso
export async function addWeightRecord(userId: string, weight: number, date?: Date) {
  const recordDate = date || new Date();
  
  try {
    console.log('Dados a serem salvos na tabela weight_history:', {
      user_id: userId,
      weight,
      recorded_at: recordDate.toISOString()
    });

    const { data, error } = await supabase
      .from('weight_history')
      .insert({
        user_id: userId,
        weight,
        recorded_at: recordDate.toISOString()
      });

    if (error) {
      console.error('Erro ao salvar registro de peso:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro detalhado ao salvar registro de peso:', error);
    throw error;
  }
}

// Obter todos os registros de peso para um usuário
export async function getWeightHistory(userId: string): Promise<WeightRecord[]> {
  try {
    const { data, error } = await supabase
      .from('weight_history')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: true });

    if (error) {
      console.error('Erro ao obter histórico de peso:', error);
      throw error;
    }

    // Se não há dados, retornamos um array vazio
    if (!data || data.length === 0) {
      return [];
    }

    // Converter formato do banco para o formato da aplicação
    return data.map(record => ({
      date: new Date(record.recorded_at || ''),
      weight: record.weight
    }));
  } catch (error) {
    console.error('Erro detalhado ao obter histórico de peso:', error);
    return [];  // Retornar array vazio em caso de erro
  }
}

// =========================================
// Funções para carregar perfil completo
// =========================================

// Carregar perfil completo com todas as informações
export async function loadCompleteUserProfile(userId: string): Promise<User | null> {
  try {
    // 1. Obter perfil básico
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Erro ao carregar perfil básico:', profileError);
      return null;
    }

    // 2. Obter detalhes do perfil
    const { data: profileDetails, error: detailsError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (detailsError) {
      console.error('Erro ao carregar detalhes do perfil:', detailsError);
      // Se não for um erro 'não encontrado', retornamos como erro
      if (detailsError.code !== 'PGRST116') {
        throw detailsError;
      }
    }

    // 3. Obter métricas do usuário
    const { data: metricsData, error: metricsError } = await supabase
      .from('user_metrics')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (metricsError) {
      console.error('Erro ao carregar métricas:', metricsError);
      // Se não for um erro 'não encontrado', retornamos como erro
      if (metricsError.code !== 'PGRST116') {
        throw metricsError;
      }
    }

    // 4. Obter histórico de peso
    let weightHistory: WeightRecord[] = [];
    try {
      weightHistory = await getWeightHistory(userId);
    } catch (error) {
      console.error('Erro ao obter histórico de peso:', error);
      // Continuamos sem o histórico de peso
    }

    // Se não temos os detalhes do perfil, retornamos apenas os dados básicos
    if (!profileDetails) {
      return {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        createdAt: new Date(profileData.created_at || ''),
        profile: undefined
      };
    }

    // Construir objeto de perfil completo
    const userProfile: UserProfile = {
      age: profileDetails.age,
      gender: profileDetails.gender as 'masculino' | 'feminino' | 'outro',
      height: profileDetails.height,
      currentWeight: profileDetails.current_weight,
      goalWeight: profileDetails.goal_weight,
      activityLevel: profileDetails.activity_level as 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'muito_ativo',
      weightHistory: weightHistory.length > 0 ? weightHistory : [
        { date: new Date(), weight: profileDetails.current_weight }
      ]
    };

    // Adicionar métricas se disponíveis
    if (metricsData) {
      userProfile.metrics = {
        bmr: metricsData.bmr,
        dailyCalories: metricsData.daily_calories,
        weeklyGoal: metricsData.weekly_goal,
        bmi: metricsData.bmi
      };
    }

    return {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      createdAt: new Date(profileData.created_at || ''),
      profile: userProfile
    };
  } catch (error) {
    console.error('Erro ao carregar perfil completo:', error);
    return null;
  }
}

// =========================================
// Funções de diagnóstico de banco de dados
// =========================================

// Verificar se as tabelas necessárias existem e mostrar suas estruturas
export async function checkDatabaseStructure() {
  try {
    console.log('Verificando estrutura do banco de dados...');
    
    // Verificar tabela profiles
    const { data: profilesInfo, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('Erro ao verificar tabela profiles:', profilesError);
    } else {
      console.log('Tabela profiles OK, estrutura:', 
        profilesInfo.length > 0 ? Object.keys(profilesInfo[0]) : 'Sem dados');
    }
    
    // Verificar tabela user_profiles
    const { data: userProfilesInfo, error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (userProfilesError) {
      console.error('Erro ao verificar tabela user_profiles:', userProfilesError);
    } else {
      console.log('Tabela user_profiles OK, estrutura:', 
        userProfilesInfo.length > 0 ? Object.keys(userProfilesInfo[0]) : 'Sem dados');
    }
    
    // Verificar tabela user_metrics
    const { data: metricsInfo, error: metricsError } = await supabase
      .from('user_metrics')
      .select('*')
      .limit(1);
    
    if (metricsError) {
      console.error('Erro ao verificar tabela user_metrics:', metricsError);
    } else {
      console.log('Tabela user_metrics OK, estrutura:', 
        metricsInfo.length > 0 ? Object.keys(metricsInfo[0]) : 'Sem dados');
    }
    
    // Verificar tabela weight_history
    const { data: weightInfo, error: weightError } = await supabase
      .from('weight_history')
      .select('*')
      .limit(1);
    
    if (weightError) {
      console.error('Erro ao verificar tabela weight_history:', weightError);
    } else {
      console.log('Tabela weight_history OK, estrutura:', 
        weightInfo.length > 0 ? Object.keys(weightInfo[0]) : 'Sem dados');
    }
    
    return 'Verificação concluída, veja o console para detalhes.';
  } catch (error) {
    console.error('Erro ao verificar estrutura do banco de dados:', error);
    return 'Erro ao verificar estrutura do banco de dados.';
  }
} 