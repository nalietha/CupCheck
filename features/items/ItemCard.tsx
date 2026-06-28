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

  // CLEANS THE NAME: Strips "Creator Cups x", "Waifu Jugs -", etc.
  const displayName = item.name?.replace(/^(creator cups?|waifu cups?|creator jugs?|waifu jugs?|pixel cups?|Metal Waifu Cup?)\s*(x|-|:)\s*/i, '').trim() || 'Unnamed Item';

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
      className="bg-vaporCard border border-vaporBorder rounded-xl overflow-hidden shadow-neon transition-transform hover:-translate-y-1 relative group flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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

        {allImages.length > 1 && isHovered && (
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
            {/* We add the full official name to the title attribute so it shows on mouse hover */}
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