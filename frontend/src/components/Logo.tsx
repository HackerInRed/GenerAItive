
import React from 'react';

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-white font-bold text-xl">
        Cre<span className="text-vidsmith-accent">AI</span>tive
      </span>
    </div>
  );
};

export default Logo;
