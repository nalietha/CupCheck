'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddToVaultButton from '@/features/items/AddToVaultButton';
import { ImageService } from '@/lib/services/ImageService';

interface ItemCardProps {
  item: any;
  showAddButton?: boolean;
}

export default function ItemCard({ item, showAddButton = true }: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [autoSwap, setAutoSwap] = useState(false);

  // Safety check: Ensure the item actually has a valid ID string
  const isValidItem = item?.id && item.id !== 'preview' && String(item.id) !== 'undefined';

  // Identifies if the item requires the special glowing border
  // Update the condition below to match your actual database schema (e.g., variant_type, rarity, or a boolean flag)
  const isSpecialEdition = item?.variant_type?.toLowerCase() === 'special' || item?.is_special_edition === true;

  const { primaryImage, hoverImage } = ImageService.getCardImages(item);

  useEffect(() => {
    if (!hoverImage) return;
    const interval = setInterval(() => setAutoSwap(prev => !prev), 5000);
    return () => clearInterval(interval);
  }, [hoverImage]);

  const showSecondary = isHovered || autoSwap;
  const displayImage = showSecondary && hoverImage ? hoverImage : primaryImage;

  // Dynamically assigns standard vapor styling or a high-visibility glowing border for special editions
  const cardStyleClasses = isSpecialEdition
    ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:shadow-[0_0_25px_rgba(250,204,21,0.8)] z-10'
    : 'border-vaporBorder hover:border-vaporPink shadow-neon';

  return (
    <div
      className={`overflow-hidden border transition-all duration-300 group flex flex-col h-full relative bg-vaporCard ${cardStyleClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Special Edition Badge Overlay */}
      {isSpecialEdition && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-b-md shadow-[0_0_10px_rgba(250,204,21,0.8)]">
          Special Edition
        </div>
      )}

      <div className="relative aspect-[3/4] w-full bg-vaporBg overflow-hidden mt-1">
        {displayImage ? (
          <img
            src={displayImage}
            alt={item?.name || 'Preview Item'}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 font-mono text-sm">
            Image Required
          </div>
        )}
        
        {hoverImage && !showSecondary && (
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-vaporText text-xs px-2 py-1 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            Hover to Swap
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-vaporText mb-1 truncate">{item?.name || 'Unnamed Item'}</h3>
        <p className="text-sm text-vaporMuted capitalize mb-2">{item?.item_type || 'Unknown Type'}</p>
        
        <div className="mt-auto pt-4 flex gap-2">
          {isValidItem ? (
            <Link 
              href={`/items/${item.id}`} 
              className="flex-1 bg-vaporBg hover:bg-gray-700 text-vaporText text-center py-2 rounded-lg font-bold text-sm transition-colors border border-gray-700 hover:border-gray-500"
            >
              Details
            </Link>
          ) : (
            <button disabled className="flex-1 bg-vaporBg text-gray-600 py-2 rounded-lg font-bold text-sm border border-vaporBorder/50 cursor-not-allowed">
              {item?.id === 'preview' ? 'Preview Mode' : 'Data Error'}
            </button>
          )}
          
          {showAddButton && isValidItem && (
            <AddToVaultButton itemId={item.id} />
          )}
        </div>
      </div>
    </div>
  );
}