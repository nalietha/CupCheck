'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddToVaultButton from '@/features/items/AddToVaultButton';
import AddToWishlistButton from '@/features/items/AddToWishlistButton';

interface ItemCardProps {
  item: any; 
  showAddButton?: boolean;
}

export default function ItemCard({ item, showAddButton = true }: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const rawImages = [
    item.image_url || item.url, 
    ...(item.item_images?.map((img: any) => img.image_url || img.url) || [])
  ].filter(Boolean); 
  
  const allImages = Array.from(new Set(rawImages));

  // CLEANS THE NAME: Strips "Creator Cups x", "Waifu Jugs -", "Waifu Cups:", etc.
  const displayName = item.name?.replace(/^(creator cups?|waifu cups?|creator jugs?|waifu jugs?)\s*(x|-|:)\s*/i, '').trim() || 'Unnamed Item';

  // BADGE & STYLE LOGIC
  const isSpecialEdition = item?.variant_type?.toLowerCase() === 'special' || item?.is_special_edition === true;
  const isPreorder = item?.shipping_status === 'pre_order';

const cardStyleClasses = isSpecialEdition
    ? 'border-vaporCyan shadow-[0_0_15px_var(--theme-cyan)] hover:shadow-[0_0_25px_var(--theme-cyan)] z-10'
    : 'border-vaporBorder shadow-neon hover:border-vaporPink hover:shadow-[0_0_20px_var(--theme-pink)]';

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isHovered && allImages.length > 1) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
      }, 1500);
    } else {
      setCurrentImageIndex(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHovered, allImages.length]);

  return (
    <div 
      className={`bg-vaporCard border rounded-xl overflow-hidden transition-transform hover:-translate-y-1 relative group flex flex-col h-full ${cardStyleClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* --- OVERLAY BADGES --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none">
        {isSpecialEdition && (
          <div className="bg-vaporCyan text-[#0B0914] text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-b-md shadow-[0_0_10px_var(--theme-cyan)]">
            Special Edition
          </div>
        )}
        {isPreorder && (
          <div className="bg-vaporYellow text-[#0B0914] text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-md shadow-[0_0_10px_var(--theme-yellow)] animate-pulse mt-0.5">
            Pre-Order
          </div>
        )}
      </div>

      <div className="relative w-full aspect-square bg-[#0B0914] overflow-hidden">
        {allImages.map((src, index) => (
          <img
            key={index}
            src={src as string}
            alt={`${displayName} - View ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-contain p-2 md:p-4 transition-opacity duration-700 ease-in-out ${
              index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}

        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
            {allImages.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentImageIndex ? 'bg-vaporCyan' : 'bg-vaporBorder'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 md:mb-2 gap-2">
          <Link href={`/items/${item.id}`} className="hover:text-vaporPink transition-colors w-full">
            <h3 className="text-sm md:text-lg font-bold text-vaporText uppercase tracking-wider line-clamp-2 leading-tight" title={item.name}>
              {displayName}
            </h3>
          </Link>
        </div>

        <p className="text-vaporMuted text-[10px] md:text-xs mb-3 md:mb-4 line-clamp-2 flex-grow leading-snug">
          {item.description || 'No description available.'}
        </p>

        <div className="mt-auto flex flex-col pt-2 md:pt-3 border-t border-vaporBorder/50">
          {showAddButton && (
            <>
              <AddToVaultButton itemId={item.id} />
              <AddToWishlistButton itemId={item.id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}