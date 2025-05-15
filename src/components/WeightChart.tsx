
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeightRecord } from '@/types/user';

interface WeightChartProps {
  weightHistory: WeightRecord[];
  goalWeight?: number;
}

const WeightChart: React.FC<WeightChartProps> = ({ weightHistory, goalWeight }) => {
  // Formata os dados para o gráfico
  const chartData = weightHistory.map(record => ({
    date: new Date(record.date).toLocaleDateString('pt-BR'),
    peso: record.weight,
    meta: goalWeight
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Evolução do Seu Peso</CardTitle>
        <CardDescription>Acompanhe seu progresso ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                domain={['dataMin - 1', 'dataMax + 1']} 
                label={{ 
                  value: 'Peso (kg)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { textAnchor: 'middle' },
                  fontSize: 12 
                }}
              />
              <Tooltip 
                formatter={(value) => [`${value} kg`, 'Peso']} 
                labelFormatter={(label) => `Data: ${label}`} 
              />
              <Area 
                type="monotone" 
                dataKey="peso" 
                stroke="#4CAF50" 
                fill="#4CAF50" 
                fillOpacity={0.3} 
                activeDot={{ r: 8 }} 
                name="Peso"
              />
              {goalWeight && (
                <Area 
                  type="monotone" 
                  dataKey="meta" 
                  stroke="#00BCD4" 
                  strokeDasharray="5 5" 
                  fill="#00BCD4" 
                  fillOpacity={0.1} 
                  name="Meta" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightChart;
