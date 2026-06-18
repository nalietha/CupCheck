'use client';
import React, { useState } from 'react';

interface ImageGalleryProps {
  primaryImage: string;
  galleryImages: { id: string; image_url: string }[];
  altText: string;
}

export default function ItemImageGallery({ primaryImage, galleryImages, altText }: ImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(primaryImage);

  // Combine primary image with gallery images, filtering out duplicates
  const allImages = [
    { id: 'primary', image_url: primaryImage },
    ...galleryImages.filter(img => img.image_url !== primaryImage)
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Display Image */}
      <div 
        className="w-full aspect-square bg-vaporCard overflow-hidden border border-vaporBorder shadow-neon transition-colors duration-300"
        
      >
        <img 
          src={currentImage} 
          alt={altText} 
          className="w-full h-full object-contain p-4 drop-shadow-2xl"
        />
      </div>

      {/* Thumbnail Carousel */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setCurrentImage(image.image_url)}
              className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all duration-300 ${
                currentImage === image.image_url 
                  ? 'border-vaporCyan opacity-100 shadow-[0_0_10px_rgba(1,205,254,0.5)]' 
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-vaporPink'
              }`}
              
            >
              <img 
                src={image.image_url} 
                alt="Thumbnail" 
                className="w-full h-full object-cover bg-vaporCard"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}