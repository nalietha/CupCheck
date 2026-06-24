// components/ThemeableCard.tsx
import React from 'react';

interface ThemeableCardProps {
  title: string;
  children: React.ReactNode;
  customClasses?: string;
  customStyles?: React.CSSProperties;
}

export default function ThemeableCard({ 
  title, 
  children, 
  customClasses = '', 
  customStyles = {} 
}: ThemeableCardProps) {
  return (
    <div 
      className={`bg-vaporCard border border-vaporBorder p-6 rounded-xl shadow-neon transition-colors duration-300 ${customClasses}`}
      style={customStyles}
    >
      <h3 className="text-xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink mb-6 uppercase">
        {title}
      </h3>
      
      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
}