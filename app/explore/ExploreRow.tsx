// app/explore/ExploreRow.tsx
'use client';
import React, { useState } from 'react';

interface ExploreRowProps {
  title: string;
  children: React.ReactNode;
}

export default function ExploreRow({ title, children }: ExploreRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Extracts valid children components into an array for counting and slicing
  const childrenArray = React.Children.toArray(children);
  
  if (childrenArray.length === 0) return null;

  // Limits displayed items to 4 unless the user expands the row
  const displayedItems = isExpanded ? childrenArray : childrenArray.slice(0, 4);

  return (
    <div className="mb-12 md:mb-16">
      <div className="flex justify-between items-end mb-4 md:mb-6 border-b border-vaporBorder pb-2">
        <h2 className="text-2xl md:text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink">
          {title}
        </h2>
        
        {childrenArray.length > 4 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-vaporCyan hover:text-vaporPink font-bold text-xs md:text-sm tracking-wider transition-colors uppercase pb-1"
          >
            {isExpanded ? 'Show Less' : 'See More'}
          </button>
        )}
      </div>
      
      {/* Defines responsive grid structure */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {displayedItems}
      </div>
    </div>
  );
}