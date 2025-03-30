
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="glass-panel p-6 transition-all duration-300 hover:shadow-glow hover:border-vidsmith-accent">
      <div className="w-12 h-12 bg-vidsmith-accent/20 text-vidsmith-accent rounded-lg flex items-center justify-center mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;
