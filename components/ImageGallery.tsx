'use client';
import { useState, useEffect } from 'react';
import { ImageService } from '@/lib/services/ImageService';

interface ItemImageGalleryProps {
  primaryImageUrl?: string;
  itemImages?: any[];
  itemName: string;
}

export default function ItemImageGallery({ primaryImageUrl, itemImages, itemName }: ItemImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extracts a normalized, flat array of valid image URL strings from the provided item data.
  const displayImages = ImageService.getGalleryImages({
    image_url: primaryImageUrl,
    item_images: itemImages
  });

  // Initializes an automatic rotation interval if multiple images exist.
  useEffect(() => {
    if (displayImages.length <= 1) {
      console.debug(`[ItemImageGallery] Single image detected for "${itemName}", skipping auto-rotation.`);
      return;
    }

    console.debug(`[ItemImageGallery] Initializing 5s auto-rotation for ${displayImages.length} images.`);
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
    }, 5000);

    // Cleans up the interval on component unmount to prevent memory leaks.
    return () => clearInterval(interval);
  }, [displayImages.length, itemName]);

  // Safely resolves the current image to display, falling back to the first image if the index is invalid.
  const currentImageUrl = displayImages[currentIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image Display */}
      <div className="w-full aspect-square relative rounded-xl overflow-hidden border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)] bg-vaporBg flex items-center justify-center">
        {currentImageUrl ? (
          <img 
            src={currentImageUrl} 
            alt={`${itemName} detailed view`} 
            className="object-contain w-full h-full transition-opacity duration-300"
          />
        ) : (
          <span className="text-vaporMuted font-mono text-sm">No Image Available</span>
        )}
      </div>

      {/* Thumbnails Strip */}
      {/* Renders a scrollable list of thumbnail buttons only if multiple images are available. */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-pink-500/50">
          {displayImages.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => {
                console.debug(`[ItemImageGallery] Manually selected image index: ${idx}`);
                setCurrentIndex(idx);
              }}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === idx 
                  ? 'border-cyan-400 opacity-100 scale-105 shadow-[0_0_10px_rgba(34,211,238,0.4)]' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img 
                src={imgUrl} 
                alt={`${itemName} thumbnail ${idx + 1}`} 
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}