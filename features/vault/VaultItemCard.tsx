import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VaultItem } from '@/types';
import { ImageService } from '@/lib/services/ImageService';

interface VaultItemCardProps {
  item: VaultItem;
}

export default function VaultItemCard({ item: vaultItem }: VaultItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [autoSwap, setAutoSwap] = useState(false);

  const { primaryImage, hoverImage } = ImageService.getCardImages(vaultItem);

  const isSpecialEdition = vaultItem?.variant_type?.toLowerCase() === 'special' || vaultItem?.is_special_edition === true;

  // CLEANS THE NAME: Strips "Creator Cups x", "Waifu Jugs -", etc.
  const displayName = vaultItem.name?.replace(/^(creator cups?|waifu cups?|creator jugs?|waifu jugs?)\s*(x|-|:)\s*/i, '').trim() || 'Unnamed Item';

  useEffect(() => {
    if (!hoverImage) return;
    const interval = setInterval(() => setAutoSwap(prev => !prev), 5000);
    return () => clearInterval(interval);
  }, [hoverImage]);

  const showSecondary = isHovered || autoSwap;
  const displayImage = showSecondary && hoverImage ? hoverImage : primaryImage;

  // Prioritize purchase_date, fallback to added_at
  const dateToUse = vaultItem.purchase_date || vaultItem.added_at;
  const formattedDate = dateToUse 
    ? new Date(dateToUse).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Unknown Date';

  const cardStyleClasses = isSpecialEdition
    ? 'border-vaporCyan shadow-[0_0_15px_var(--theme-cyan)] hover:shadow-[0_0_25px_var(--theme-cyan)] z-10'
    : 'border-vaporBorder shadow-neon hover:border-vaporPink hover:shadow-[0_0_20px_var(--theme-pink)]';
  return (
    <div
      className={`bg-vaporCard rounded-xl overflow-hidden border transition-all duration-300 group flex flex-col h-full relative ${cardStyleClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
{/* --- OVERLAY BADGES --- */}
      {isSpecialEdition && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-vaporCyan text-[#0B0914] text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-b-md shadow-[0_0_10px_var(--theme-cyan)]">
          Special Edition
        </div>
      )}

      {/* Updated to use vaporYellow */}
      {vaultItem.is_favorite && (
        <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm text-vaporYellow text-sm px-2 py-1 rounded-md border border-vaporYellow/30 shadow-lg">
          ⭐
        </div>
      )}

      {/* Updated to use vaporPink */}
      {vaultItem.quantity > 1 && (
        <div className="absolute top-2 right-2 z-10 bg-vaporPink/90 backdrop-blur-sm text-vaporText text-xs font-bold px-2 py-1 rounded-md border border-white/20 shadow-lg">
          x{vaultItem.quantity}
        </div>
      )}

      {/* --- IMAGE SECTION --- */}
      <div className="relative aspect-[3/4] w-full bg-vaporCard overflow-hidden mt-1">
        {displayImage ? (
          <img
            src={displayImage}
            alt={displayName}
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

      {/* --- DETAILS SECTION --- */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-vaporText mb-1 truncate" title={vaultItem.name}>
          {displayName}
        </h3>

        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-vaporMuted capitalize">{vaultItem.item_type || 'Unknown Type'}</p>
          {vaultItem.retail_price && (
            <p className="text-neonBlue font-mono text-sm">${vaultItem.retail_price}</p>
          )}
        </div>

        <p className="text-xs text-gray-500 font-mono mb-4">
          Acquired: {formattedDate}
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