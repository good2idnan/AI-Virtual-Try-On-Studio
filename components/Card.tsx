import React, { ReactNode } from 'react';
import { PersonIcon } from './icons/PersonIcon';
import { ShirtIcon } from './icons/ShirtIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface CardProps {
  title: string;
  icon: 'person' | 'shirt' | 'sparkles';
  children: ReactNode;
}

const icons = {
  person: <PersonIcon className="w-6 h-6" />,
  shirt: <ShirtIcon className="w-6 h-6" />,
  sparkles: <SparklesIcon className="w-6 h-6" />,
};

export const Card: React.FC<CardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-gray-800/40 rounded-xl shadow-2xl backdrop-blur-xl border border-gray-700/60 overflow-hidden h-full flex flex-col">
      <div className="flex items-center p-4 border-b border-gray-700/60 bg-gray-900/20">
        <div className="text-purple-400">{icons[icon]}</div>
        <h2 className="ml-3 text-md font-semibold text-gray-200 tracking-wide uppercase">{title}</h2>
      </div>
      <div className="p-4 sm:p-5 flex-grow">
        {children}
      </div>
    </div>
  );
};