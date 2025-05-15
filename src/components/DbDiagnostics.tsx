import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { checkDatabaseStructure } from '@/integrations/supabase/database';

const DbDiagnostics: React.FC = () => {
  const [diagResult, setDiagResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const result = await checkDatabaseStructure();
      setDiagResult(result);
    } catch (error) {
      setDiagResult(`Erro: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Diagnóstico do Banco de Dados</CardTitle>
        <CardDescription>
          Verifique a estrutura do banco de dados e identifique problemas
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">
            Este diagnóstico verifica se as tabelas necessárias existem e se estão acessíveis.
            Verifique o console do navegador para ver os resultados detalhados.
          </p>
          
          {diagResult && (
            <div className="bg-slate-100 p-4 rounded-md">
              <h3 className="font-medium mb-2">Resultado:</h3>
              <p className="text-sm whitespace-pre-wrap">{diagResult}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={runDiagnostics}
          disabled={loading}
          className="w-full bg-nutrivida-primary hover:bg-nutrivida-dark"
        >
          {loading ? 'Executando...' : 'Executar Diagnóstico'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DbDiagnostics; 