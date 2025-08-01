'use client';
import React, { useState } from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX + 15, y: e.clientY - 10 });
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      
      {isVisible && (
        <div 
          className="fixed z-50 px-3 py-2 bg-gray-800 text-white text-sm rounded-md shadow-lg transform -translate-y-1/2"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
            pointerEvents: 'none',
          }}
        >
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"></div>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;