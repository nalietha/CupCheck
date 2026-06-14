'use client';
import { useState } from 'react';

export default function ImageGallery({ images }: { images: { url: string }[] }) {
  // Default to the first image in the array
  const [mainImage, setMainImage] = useState(images[0]?.url || '/placeholder.png');

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="w-full aspect-square relative rounded-xl overflow-hidden border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)] bg-gray-950 flex items-center justify-center">
        <img 
          src={mainImage} 
          alt="Item detailed view" 
          className="object-contain w-full h-full"
        />
      </div>

      {/* Thumbnails Strip (Only show if there is more than 1 image) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-pink-500/50">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img.url)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                mainImage === img.url 
                  ? 'border-cyan-400 opacity-100 scale-105' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={img.url} 
                alt={`Thumbnail ${idx + 1}`} 
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}