// components/FilterSidebar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      
      if (value) params.set(name, value);
      else params.delete(name);
      
      return `/?${params.toString()}`;
    },
    [searchParams]
  );

  const formatLabel = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  const activeFiltersCount = (currentType ? 1 : 0) + (currentSeason ? 1 : 0);

  return (
    <div className="text-vaporText w-full">
      
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden w-full flex items-center justify-between bg-vaporCard border border-vaporBorder p-4 rounded-lg font-bold text-vaporCyan shadow-neon mb-4"
      >
        <span>
          Filters {activeFiltersCount > 0 && <span className="bg-vaporPink text-black px-2 py-0.5 rounded-full text-xs ml-2">{activeFiltersCount}</span>}
        </span>
        <span className="text-lg leading-none">{isMobileOpen ? '−' : '+'}</span>
      </button>

      {/* Filter Content (Hidden on mobile unless toggled open) */}
      <div className={`space-y-8 ${isMobileOpen ? 'block' : 'hidden'} md:block`}>
        {availableTypes.length > 0 && (
          <div className="space-y-3 bg-vaporCard/30 md:bg-transparent p-4 md:p-0 rounded-lg border border-vaporBorder md:border-none">
            <h3 className="font-bold text-vaporPink border-b border-vaporBorder pb-1 uppercase tracking-widest text-sm">
              Category
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto md:max-h-none pr-2 scrollbar-thin scrollbar-thumb-vaporPink/50">
              <li>
                <button 
                  onClick={() => router.push(createQueryString('type', ''))}
                  className={`text-sm hover:text-vaporCyan transition-colors w-full text-left ${!currentType ? 'text-vaporCyan font-bold' : 'text-vaporMuted'}`}
                >
                  All Items
                </button>
              </li>
              {availableTypes.map((type) => (
                <li key={type}>
                  <button 
                    onClick={() => router.push(createQueryString('type', type))}
                    className={`text-sm hover:text-vaporCyan transition-colors w-full text-left ${currentType === type ? 'text-vaporCyan font-bold' : 'text-vaporMuted'}`}
                  >
                    {formatLabel(type)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {availableSeasons.length > 0 && (
          <div className="space-y-3 bg-vaporCard/30 md:bg-transparent p-4 md:p-0 rounded-lg border border-vaporBorder md:border-none">
            <h3 className="font-bold text-vaporPink border-b border-vaporBorder pb-1 uppercase tracking-widest text-sm">
              Season
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto md:max-h-none pr-2 scrollbar-thin scrollbar-thumb-vaporPink/50">
              <li>
                <button 
                  onClick={() => router.push(createQueryString('season', ''))}
                  className={`text-sm hover:text-vaporCyan transition-colors w-full text-left ${!currentSeason ? 'text-vaporCyan font-bold' : 'text-vaporMuted'}`}
                >
                  Any Season
                </button>
              </li>
              {availableSeasons.map((season) => (
                <li key={season}>
                  <button 
                    onClick={() => router.push(createQueryString('season', season))}
                    className={`text-sm hover:text-vaporCyan transition-colors w-full text-left ${currentSeason === season ? 'text-vaporCyan font-bold' : 'text-vaporMuted'}`}
                  >
                    {season}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}