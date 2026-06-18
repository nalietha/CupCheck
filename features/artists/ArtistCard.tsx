import React from 'react';
import Link from 'next/link';

// You can expand this based on your database schema
export interface ArtistSite {
  platform: 'twitter' | 'instagram' | 'website' | 'artstation';
  url: string;
}

export interface Artist {
  id: string;
  name: string;
  image_url?: string;
  sites?: ArtistSite[];
}

export default function ArtistCard({ artist }: { artist: Artist }) {
  // Helper to render the right SVG based on the platform
  const renderIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
             <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.95H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        );
      default: // Generic Link Icon
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        );
    }
  };

  return (
    <div 
      className="flex flex-col bg-vaporCard border border-vaporBorder transition-all shadow-neon overflow-hidden group hover:border-vaporPink"
      style={{ borderRadius: 'var(--card-radius)' }}
    >
      <div className="w-32 h-full bg-gray-100 flex-shrink-0">
        {artist.image_url ? (
          <img 
            src={artist.image_url} 
            alt={artist.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-vaporMuted">
            {/* Fallback avatar icon */}
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Right side: Content */}
      <div className="p-4 flex flex-col justify-center flex-grow">
        <Link href={`/artists/${artist.id}`} className="hover:text-blue-600">
          <h3 className="text-xl font-bold text-gray-900 truncate">{artist.name}</h3>
        </Link>
        
        {/* Sites/Social Icons */}
        {artist.sites && artist.sites.length > 0 && (
          <div className="flex gap-3 mt-3 text-gray-500">
            {artist.sites.map((site, index) => (
              <a 
                key={index} 
                href={site.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
                title={site.platform}
              >
                {renderIcon(site.platform)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}