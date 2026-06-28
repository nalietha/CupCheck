import React from 'react';
import Link from 'next/link';

export default function CreatorCard({ creator }: { creator: any }) {
  return (
    <div 
      className="flex flex-col bg-vaporCard border border-vaporBorder transition-all shadow-neon overflow-hidden group hover:border-vaporCyan"
      style={{ borderRadius: 'var(--card-radius)' }}
    >
      <div className="w-full aspect-square bg-vaporBg flex-shrink-0 overflow-hidden relative">
        {creator.image_url ? (
          <img src={creator.image_url} alt={creator.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-vaporMuted text-xs">
            No Image
          </div>
        )}
      </div>
      {/* Reduced padding for mobile */}
      <div className="p-3 md:p-4 flex flex-col justify-center flex-grow">
        <Link href={`/creators/${creator.id}`} className="hover:text-vaporCyan transition-colors">
          {/* Scaled text size for mobile */}
          <h3 className="text-base md:text-xl font-bold text-vaporText truncate">{creator.name}</h3>
        </Link>
        {creator.gg_codes && creator.gg_codes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 md:mt-2">
            {creator.gg_codes.map((code: string) => (
              <span key={code} className="text-vaporMuted text-[9px] md:text-[10px] font-bold font-mono bg-black/40 border border-vaporBorder px-1.5 md:px-2 py-0.5 rounded uppercase tracking-wider">
                {code}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}