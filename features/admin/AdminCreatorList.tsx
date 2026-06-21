'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Creator {
  id: string;
  name: string;
  gg_codes?: string[]; 
  image_url?: string;
  is_active: boolean;
  is_nsfw: boolean;
}

export default function AdminCreatorList({ initialCreators }: { initialCreators: Creator[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Updated filter logic to search through the array of codes
  const filteredCreators = initialCreators.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    const matchesName = c.name.toLowerCase().includes(searchLower);
    const matchesCode = c.gg_codes?.some(code => code.toLowerCase().includes(searchLower));
    
    return matchesName || matchesCode;
  });

  return (
    <div className="space-y-6">
      {/* Search Module */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-vaporCyan font-bold">»</span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Query Database by Name or GG Code..."
          className="w-full bg-black/40 border border-vaporBorder text-vaporText rounded-lg pl-10 pr-4 py-4 focus:outline-none focus:border-vaporCyan focus:shadow-[0_0_15px_rgba(1,205,254,0.2)] transition-all duration-300 placeholder-gray-600 font-mono"
        />
      </div>

      {/* Results Count */}
      <div className="text-xs font-bold text-vaporMuted uppercase tracking-widest">
        Showing {filteredCreators.length} {filteredCreators.length === 1 ? 'Record' : 'Records'}
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCreators.length > 0 ? (
          filteredCreators.map((creator) => (
            <div 
              key={creator.id} 
              className="group flex flex-col md:flex-row items-center gap-4 bg-vaporCard border border-vaporBorder hover:border-vaporPink p-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,107,216,0.15)]"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full border-2 border-vaporBorder group-hover:border-vaporPink overflow-hidden flex-shrink-0 bg-black/50 flex items-center justify-center transition-colors">
                {creator.image_url ? (
                  <img 
                    src={creator.image_url} 
                    alt={creator.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=?';
                    }}
                  />
                ) : (
                  <span className="text-vaporMuted text-xs font-mono">N/A</span>
                )}
              </div>

              {/* Core Info */}
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold text-vaporText">{creator.name}</h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                  
                  {/* Dynamic Code Mapping */}
                  {creator.gg_codes && creator.gg_codes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mr-2 border-r border-vaporBorder pr-2">
                      {creator.gg_codes.map(code => (
                        <span key={code} className="px-2 py-0.5 bg-gray-800 border border-gray-600 text-gray-300 text-[10px] font-bold rounded uppercase tracking-wider">
                          {code}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Status Badges */}
                  {creator.is_active ? (
                    <span className="px-2 py-0.5 bg-cyan-900/40 border border-cyan-500 text-cyan-400 text-xs font-bold rounded uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-900/40 border border-red-500 text-red-400 text-xs font-bold rounded uppercase tracking-wider">
                      Inactive
                    </span>
                  )}
                  
                  {creator.is_nsfw && (
                    <span className="px-2 py-0.5 bg-pink-900/40 border border-pink-500 text-pink-400 text-xs font-bold rounded uppercase tracking-wider shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                      NSFW
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 md:mt-0 w-full md:w-auto flex-shrink-0">
                <Link 
                  href={`/admin/creators/${creator.id}`}
                  className="block w-full md:w-auto px-6 py-2 bg-transparent border border-vaporMuted text-vaporMuted hover:border-vaporPink hover:text-vaporPink font-bold text-sm uppercase tracking-widest rounded transition-all duration-300 text-center"
                >
                  Edit Data
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center border border-dashed border-vaporBorder rounded-xl bg-black/20">
            <p className="text-vaporMuted font-mono">No matching records found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}