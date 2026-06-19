// components/ItemCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import AddToVaultButton from '@/features/items/AddToVaultButton';

interface ItemCardProps {
  item: any;
  showAddButton?: boolean;
}

export default function ItemCard({ item, showAddButton = true }: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Safety check: Ensure the item actually has a valid ID string
  const isValidItem = item?.id && item.id !== 'preview' && String(item.id) !== 'undefined';

  // Determine Primary and Hover Images
  let primaryImage = item?.image_url;
  let hoverImage = null;

  if (item?.item_images && item.item_images.length > 0) {
    const sortedImages = [...item.item_images].sort((a, b) => a.display_order - b.display_order);
    primaryImage = sortedImages[0]?.url || sortedImages[0]?.image_url || primaryImage;
    if (sortedImages.length > 1) {
      hoverImage = sortedImages[1]?.url || sortedImages[1]?.image_url;
    }
  }

  // Fallback to No Image Placeholder
  const fallbackImage = 'https://placehold.co/400x600/1a1a2e/ff00ff?text=No+Image';
  const displayImage = isHovered && hoverImage ? hoverImage : (primaryImage || fallbackImage);

  return (
    <div
      className="overflow-hidden border border-vaporBorder hover:border-vaporPink transition-all duration-300 group flex flex-col h-full shadow-neon relative bg-vaporCard"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full bg-vaporBg overflow-hidden">
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
        
        {hoverImage && !isHovered && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-vaporText text-xs px-2 py-1 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            Hover to Swap
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-vaporText mb-1 truncate">{item?.name || 'Unnamed Item'}</h3>
        <p className="text-sm text-vaporMuted capitalize mb-2">{item?.item_type || 'Unknown Type'}</p>
        
        <div className="mt-auto pt-4 flex gap-2">
          {/* Use our isValidItem check to determine if we render a working link */}
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