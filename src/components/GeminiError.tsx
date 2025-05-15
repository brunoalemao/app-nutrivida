import React from 'react';
import { AlertCircle } from 'lucide-react';

interface GeminiErrorProps {
  message: string;
  code?: string;
  retry?: () => void;
}

const GeminiError: React.FC<GeminiErrorProps> = ({ message, code, retry }) => {
  const isQuotaError = message.includes('taxa excedido') || code === 'RATE_LIMIT_EXCEEDED';
  const isModelError = message.includes('modelo não encontrado') || code === 'MODEL_NOT_FOUND';
  
  // Determinar a mensagem amigável com base no tipo de erro
  let friendlyMessage = message;
  
  if (isQuotaError) {
    friendlyMessage = 'Estamos usando respostas pré-configuradas no momento porque atingimos o limite de solicitações à API. Retorne mais tarde para conteúdo personalizado.';
  } else if (isModelError) {
    friendlyMessage = 'Estamos usando respostas pré-configuradas no momento porque há um problema técnico com o serviço de IA. Nossa equipe já foi notificada.';
  }

  return (
    <div className="p-4 border rounded-md bg-red-50 border-red-200 text-red-900 mb-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <div className="font-medium mb-1">
            {isQuotaError ? 'Usando conteúdo local temporariamente' : 'Erro ao gerar conteúdo'}
          </div>
          <p className="text-sm text-red-800">{friendlyMessage}</p>
          {retry && (
            <button 
              onClick={retry} 
              className="mt-3 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
            >
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiError; 