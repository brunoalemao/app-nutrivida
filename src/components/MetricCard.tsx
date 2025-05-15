
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  className = '',
  trend
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
          {icon && <div className="text-gray-500">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-2xl font-bold">{value}</div>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend === 'up' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1h6a1 1 0 011 1v4z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M5 14a1 1 0 01-1-1v-2a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H5z" clipRule="evenodd" />
                  </svg>
                  <span>Em alta</span>
                </>
              )}
              {trend === 'down' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H6a1 1 0 01-1-1v-6z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1h4z" clipRule="evenodd" />
                  </svg>
                  <span>Em baixa</span>
                </>
              )}
              {trend === 'neutral' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Estável</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
