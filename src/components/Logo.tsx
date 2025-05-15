
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-8 w-8 bg-nutrivida-primary rounded-full flex items-center justify-center text-white font-bold">
        N
      </div>
      <span className="font-montserrat font-bold text-xl text-nutrivida-primary">
        NutriVida
      </span>
    </div>
  );
};

export default Logo;
