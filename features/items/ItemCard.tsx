'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ItemCardProps {
  item: any; // Replace with your actual Item type
  showAddButton?: boolean;
}

export default function ItemCard({ item, showAddButton = true }: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Compiles all valid images into a single array, starting with the primary image
  const allImages = [
    item.image_url,
    ...(item.item_images?.map((img: any) => img.image_url) || [])
  ].filter(Boolean); // Filters out any null or undefined URLs

  // Manages the 3-second slideshow interval when hovered
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isHovered && allImages.length > 1) {
      // Rotates the image index every 3000ms
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
      }, 3000);
    } else {
      // Resets immediately to the primary image when hover ends
      setCurrentImageIndex(0);
    }

    // Cleanup function prevents memory leaks and overlapping intervals
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
      {/* Image Container with cross-fade transition */}
      <div className="relative w-full aspect-square bg-[#0B0914] overflow-hidden">
        {allImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`${item.name} - View ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-700 ease-in-out ${
              index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}

        {/* Optional: Indicator dots to show how many images exist */}
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

      {/* Card Content Wrapper */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Link href={`/items/${item.id}`} className="hover:text-vaporPink transition-colors">
            <h3 className="text-lg font-bold text-vaporText uppercase tracking-wider line-clamp-2">
              {item.name}
            </h3>
          </Link>
          <span className="text-sm font-mono text-vaporCyan bg-vaporCyan/10 px-2 py-1 rounded border border-vaporCyan/30 whitespace-nowrap">
            {item.item_type}
          </span>
        </div>

        <p className="text-vaporMuted text-xs mb-4 line-clamp-2 flex-grow">
          {item.description || 'No description available.'}
        </p>

        {/* Footer actions area */}
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-vaporBorder/50">
          {/* <span className="text-vaporText font-bold">
            ${item.retail_price?.toFixed(2) || '---'}
          </span> */}
          
          {showAddButton && (
            <button className="text-xs font-bold uppercase tracking-widest text-[#0B0914] bg-vaporCyan hover:bg-white px-3 py-1.5 rounded transition-colors shadow-[0_0_10px_rgba(1,205,254,0.4)] hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]">
              + Vault
            </button>
          )}
        </div>
      </div>
    </div>
  );
}