'use client';

import React from 'react';

interface AdPlaceholderProps {
  size: string;
  position: string;
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ 
  size, 
  position, 
  className = '' 
}) => {
  const [width, height] = size.includes('x') 
    ? size.split('x').map(s => parseInt(s)) 
    : [300, 100];

  return (
    <div 
      className={`
        relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 
        bg-gradient-to-br from-gray-50 to-gray-100 
        flex items-center justify-center text-gray-500 text-sm font-medium
        hover:border-gray-400 transition-colors duration-200
        ${className}
      `}
      style={{ 
        minHeight: `${height}px`,
        minWidth: `${width}px`
      }}
    >
      <div className="text-center space-y-1">
        <div className="text-xs uppercase tracking-wide font-semibold text-gray-400">
          Advertisement
        </div>
        <div className="font-medium">
          {size} - {position}
        </div>
        <div className="text-xs text-gray-400">
          Ad Space
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-gray-300 rounded-full opacity-50"></div>
      <div className="absolute top-2 right-2 w-2 h-2 bg-gray-300 rounded-full opacity-50"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-gray-300 rounded-full opacity-50"></div>
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-gray-300 rounded-full opacity-50"></div>
    </div>
  );
};

export default AdPlaceholder;