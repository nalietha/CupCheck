import { useState } from 'react';
import Link from 'next/link';
import { VaultItem } from '@/types'; 

interface VaultItemCardProps {
  item: VaultItem;
}

export default function VaultItemCard({ item: vaultItem }: VaultItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine Primary and Hover Images
  let primaryImage = vaultItem.image_url;
  let hoverImage = null;

  // Keep the hover logic in case you update the Vault query to include item_images later
if (vaultItem.item_images && vaultItem.item_images.length > 0) {
    const sortedImages = [...vaultItem.item_images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    // CHANGE .url to .image_url here:
    primaryImage = sortedImages[0]?.image_url || primaryImage;
    if (sortedImages.length > 1) {
      // CHANGE .url to .image_url here:
      hoverImage = sortedImages[1]?.image_url;
    }
  }

  // Fallback to No Image Placeholder
  const fallbackImage = 'https://placehold.co/400x600/1a1a2e/ff00ff?text=No+Image';
  const displayImage = isHovered && hoverImage ? hoverImage : (primaryImage || fallbackImage);

  // Format the added date nicely (e.g., "Oct 12, 2023")
  const formattedDate = new Date(vaultItem.added_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div
      className="bg-vaporCard rounded-xl overflow-hidden border border-neonPink/20 hover:border-neonPink transition-all duration-300 group flex flex-col h-full shadow-lg hover:shadow-neonPink/20 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- OVERLAY BADGES --- */}
      
      {/* Favorite Badge (Top Left) */}
      {vaultItem.is_favorite && (
        <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm text-yellow-400 text-sm px-2 py-1 rounded-md border border-yellow-400/30 shadow-lg">
          ⭐ 
        </div>
      )}

      {/* Quantity Badge (Top Right) */}
      {vaultItem.quantity > 1 && (
        <div className="absolute top-2 right-2 z-10 bg-neonPink/90 backdrop-blur-sm text-vaporText text-xs font-bold px-2 py-1 rounded-md border border-white/20 shadow-lg">
          x{vaultItem.quantity}
        </div>
      )}


      {/* --- IMAGE SECTION --- */}
      <div className="relative aspect-[3/4] w-full bg-vaporCard overflow-hidden">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={vaultItem.name || 'Preview Item'} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 font-mono text-sm">
            Image Required
          </div>
        )}
        
        {/* Hover Hint Badge */}
        {hoverImage && !isHovered && (
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-vaporText text-xs px-2 py-1 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            Hover to Swap
          </div>
        )}
      </div>


      {/* --- DETAILS SECTION --- */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-vaporText mb-1 truncate" title={vaultItem.name}>
          {vaultItem.name || 'Unnamed Item'}
        </h3>
        
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-vaporMuted capitalize">{vaultItem.item_type || 'Unknown Type'}</p>
          {vaultItem.retail_price && (
            <p className="text-neonBlue font-mono text-sm">${vaultItem.retail_price}</p>
          )}
        </div>

        <p className="text-xs text-gray-500 font-mono mb-4">
          Added: {formattedDate}
        </p>
        
        <div className="mt-auto pt-4 flex gap-2">
          <Link 
            href={`/vault/item/${vaultItem.record_id}`} 
            className="flex-1 bg-vaporCard hover:bg-gray-700 text-vaporText text-center py-2 rounded-lg font-bold text-sm transition-colors border border-gray-700 hover:border-gray-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}