import { supabase } from '@/integrations/supabase/client';

export interface AIContentHistoryItem {
  id: string;
  user_id: string;
  prompt: string;
  response: string;
  type: string;
  created_at: string;
}

/**
 * Salva um novo item no histórico de conteúdo AI
 */
export async function saveAIContentHistory(
  userId: string,
  prompt: string,
  response: string,
  type: string
) {
  try {
    const { data, error } = await supabase
      .from('ai_content_history')
      .insert({
        user_id: userId,
        prompt,
        response,
        type,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar histórico de conteúdo AI:', error);
    throw error;
  }
}

/**
 * Busca o histórico de conteúdo AI de um usuário
 */
export async function getAIContentHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('ai_content_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AIContentHistoryItem[];
  } catch (error) {
    console.error('Erro ao buscar histórico de conteúdo AI:', error);
    throw error;
  }
}

/**
 * Busca o histórico de conteúdo AI de um usuário por tipo
 */
export async function getAIContentHistoryByType(userId: string, type: string) {
  try {
    const { data, error } = await supabase
      .from('ai_content_history')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AIContentHistoryItem[];
  } catch (error) {
    console.error('Erro ao buscar histórico de conteúdo AI por tipo:', error);
    throw error;
  }
} 