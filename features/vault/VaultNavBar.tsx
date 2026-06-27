'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface VaultNavBarProps {
  username: string;
}

export default function VaultNavBar({ username }: VaultNavBarProps) {
  const pathname = usePathname();
  const baseUrl = `/vault/${username}`;

  // Check which tab is currently active
  const isCollectionActive = pathname === baseUrl;
  const isTiersActive = pathname === `${baseUrl}/tiers`;
  const isWishlistActive = pathname === `${baseUrl}/wishlist`;

  return (
    <div className="mt-8 mb-4 border-b border-gray-800">
      <nav className="flex space-x-8 px-4 overflow-x-auto scrollbar-hide" aria-label="Vault Tabs">
        
        {/* The Collection Tab */}
        <Link 
          href={baseUrl} 
          className={`py-4 px-1 font-bold uppercase tracking-widest text-sm transition-all border-b-2 whitespace-nowrap ${
            isCollectionActive 
              ? 'border-vaporCyan text-vaporCyan shadow-[0_4px_10px_rgba(1,205,254,0.1)]' 
              : 'border-transparent text-vaporMuted hover:text-vaporCyan hover:border-vaporCyan'
          }`}
        >
          The Collection
        </Link>
        
        {/* Flavor Rankings Tab */}
        <Link 
          href={`${baseUrl}/tiers`} 
          className={`py-4 px-1 font-bold uppercase tracking-widest text-sm transition-all border-b-2 whitespace-nowrap ${
            isTiersActive 
              ? 'border-vaporPink text-vaporPink shadow-[0_4px_10px_rgba(255,113,206,0.1)]' 
              : 'border-transparent text-vaporMuted hover:text-vaporPink hover:border-vaporPink'
          }`}
        >
          Flavor Rankings
        </Link>

        {/* Dynamic Wishlist Tab */}
        <Link 
          href={`${baseUrl}/wishlist`} 
          className={`py-4 px-1 font-bold uppercase tracking-widest text-sm transition-all border-b-2 whitespace-nowrap before:content-[var(--term-wishlist)] ${
            isWishlistActive 
              ? 'border-vaporYellow text-vaporYellow shadow-[0_4px_10px_rgba(255,251,150,0.1)]' 
              : 'border-transparent text-vaporMuted hover:text-vaporYellow hover:border-vaporYellow'
          }`}
        >
        </Link>
        
      </nav>
    </div>
  );
}