// app/explore/ExploreRow.tsx
'use client';
import React, { useState } from 'react';

interface ExploreRowProps {
  title: string;
  children: React.ReactNode;
}

export default function ExploreRow({ title, children }: ExploreRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Convert children to a safe array so we can count and slice them
  const childrenArray = React.Children.toArray(children);
  
  if (childrenArray.length === 0) return null;

  // Show 4 items by default, or all items if expanded
  const displayedItems = isExpanded ? childrenArray : childrenArray.slice(0, 4);

  return (
    <div className="mb-16">
      <div className="flex justify-between items-end mb-6 border-b border-vaporBorder pb-2">
        <h2 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink">
          {title}
        </h2>
        
        {childrenArray.length > 4 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-vaporCyan hover:text-vaporPink font-bold text-sm tracking-wider transition-colors uppercase"
          >
            {isExpanded ? 'Show Less' : 'See More'}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {displayedItems}
      </div>
    </div>
  );
}