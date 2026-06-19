// components/FilterSidebar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

// Define the expected props
interface FilterSidebarProps {
  currentType?: string;
  currentSeason?: string;
  availableTypes: string[];
  availableSeasons: string[];
}

export default function FilterSidebar({ 
  currentType, 
  currentSeason, 
  availableTypes, 
  availableSeasons 
}: FilterSidebarProps) {
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return `/?${params.toString()}`;
    },
    [searchParams]
  );

  // Helper function to capitalize the raw database values (e.g., "cup" -> "Cup")
  const formatLabel = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="space-y-8 text-vaporText">
      {/* Category Filter */}
      {availableTypes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-vaporPink border-b border-vaporBorder pb-1 uppercase tracking-widest text-sm">
            Category
          </h3>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => router.push(createQueryString('type', ''))}
                className={`text-sm hover:text-vaporCyan transition-colors ${!currentType ? 'text-vaporCyan font-bold' : 'text-vaporMuted'}`}
              >
                All Items
              </button>
            </li>
            {/* Dynamically render database types */}
            {availableTypes.map((type) => (
              <li key={type}>
                <button 
                  onClick={() => router.push(createQueryString('type', type))}
                  className={`text-sm hover:text-vaporCyan transition-colors ${currentType === type ? 'text-vaporCyan font-bold' : 'text-vaporMuted'}`}
                >
                  {formatLabel(type)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Season Filter */}
      {availableSeasons.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-vaporPink border-b border-vaporBorder pb-1 uppercase tracking-widest text-sm">
            Season
          </h3>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => router.push(createQueryString('season', ''))}
                className={`text-sm hover:text-vaporCyan transition-colors ${!currentSeason ? 'text-vaporCyan font-bold' : 'text-vaporMuted'}`}
              >
                Any Season
              </button>
            </li>
            {/* Dynamically render database seasons */}
            {availableSeasons.map((season) => (
              <li key={season}>
                <button 
                  onClick={() => router.push(createQueryString('season', season))}
                  className={`text-sm hover:text-vaporCyan transition-colors ${currentSeason === season ? 'text-vaporCyan font-bold' : 'text-vaporMuted'}`}
                >
                  {season}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}