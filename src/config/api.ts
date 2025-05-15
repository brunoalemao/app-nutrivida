const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCfijiII7oGsQWDE2596Z_6XzvpfBoO3O0';

// Ativar o fallback para usar conteúdo local quando a API estiver com limite excedido
const USE_FALLBACK = true;

if (!GEMINI_API_KEY) {
  console.error('Chave da API Gemini não encontrada. Configure a variável de ambiente VITE_GEMINI_API_KEY');
}

export const API_KEYS = {
  GEMINI: GEMINI_API_KEY
};

// Corrigindo para o endpoint e modelo corretos - atualizando para Gemini 1.5 Pro
export const API_ENDPOINTS = {
  GEMINI: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"
};

// Configuração otimizada para a API Gemini
export const API_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048
};

// Exportar a flag de fallback
export const USE_LOCAL_FALLBACK = USE_FALLBACK; 