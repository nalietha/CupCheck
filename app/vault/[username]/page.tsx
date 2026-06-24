'use client';
import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useVaultData } from '@/hooks/useVaultData';
import { useVaultFilters } from '@/hooks/useVaultFilters';
import Link from 'next/link';

import VaultHeader from '@/features/vault/VaultHeader';
import VaultDisplayShelf from '@/features/vault/VaultDisplayShelf';
import VaultControls from '@/features/vault/VaultControls';
import VaultItemCard from '@/features/vault/VaultItemCard';
import VaultCompletionDisplay from '@/features/vault/VaultCompletionDisplay';

export default function VaultPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const vaultOwner = decodeURIComponent(resolvedParams.username);

  // Fetch Data
  const { profile, vaultItems, loading } = useVaultData(vaultOwner);
  
  // Auth & Privacy State
  const [isOwner, setIsOwner] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check if the current user owns this profile
  useEffect(() => {
    async function checkOwnership() {
      if (profile) {
        const { data: { user } } = await supabase.auth.getUser();
        setIsOwner(user?.id === profile.id);
      }
      setAuthLoading(false);
    }

    if (!loading && profile) {
      checkOwnership();
    } else if (!loading && !profile) {
      setAuthLoading(false);
    }
  }, [profile, loading]);

  // Process Filters & Sorts
  const { 
    searchQuery, setSearchQuery, filterType, setFilterType, 
    sortBy, setSortBy, uniqueItemTypes, processedItems, clearFilters 
  } = useVaultFilters(vaultItems);

  // Render Checks
  if (loading || authLoading) {
    return <div className="min-h-screen bg-vaporBg text-vaporText flex items-center justify-center">Loading Vault...</div>;
  }
  
  if (!profile) {
    return <div className="min-h-screen bg-vaporBg text-vaporText flex items-center justify-center">Vault not found.</div>;
  }

  // Privacy Check
  if (!profile.is_public && !isOwner) {
    return (
      <div className="min-h-screen bg-vaporBg text-vaporText flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-black italic text-vaporCyan mb-4 tracking-widest">PRIVATE VAULT</h2>
        <p className="text-vaporMuted mb-6">This collector has set their vault to private.</p>
        <Link 
          href="/explore" 
          className="bg-transparent border-2 border-vaporPink text-vaporPink hover:bg-vaporPink hover:text-[#0B0914] font-bold px-6 py-2 rounded transition-all shadow-[0_0_10px_rgba(255,113,206,0.3)]"
        >
          RETURN TO EXPLORE
        </Link>
      </div>
    );
  }

  // Derived Shelves Data
  const favorites = vaultItems.filter(item => item.is_favorite);
  const newestItems = [...vaultItems].sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime());

  return (
    <div className="min-h-screen bg-vaporBg pb-20">
      <VaultHeader 
        username={profile.display_name || profile.username}
        uniqueCount={vaultItems.length}
        dateStarted={profile.created_at}
        bannerUrl={profile.banner_url} 
      />
      
      <div className="mt-8 mb-4 border-b border-gray-800">
          <nav className="flex space-x-8 px-4" aria-label="Vault Tabs">
            <Link 
              href={`/vault/${profile.username}`}
              className="border-b-2 border-vaporCyan text-vaporCyan py-4 px-1 font-bold uppercase tracking-widest text-sm shadow-[0_4px_10px_rgba(1,205,254,0.1)]"
            >
              The Collection
            </Link>
            
            <Link 
              href={`/vault/${profile.username}/tiers`}
              className="border-b-2 border-transparent text-vaporMuted hover:text-vaporPink hover:border-vaporPink py-4 px-1 font-bold uppercase tracking-widest text-sm transition-all"
            >
              Flavor Rankings
            </Link>
          </nav>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        
        <VaultCompletionDisplay userId={profile.id} />

        <div>
          <VaultDisplayShelf title="Favorites ✨" items={favorites} emptyMessage="No favorites selected yet." />
          <div className="mt-8">
            <VaultDisplayShelf title="Newest Additions" items={newestItems.slice(0, 5)} />
          </div>
        </div>

        <hr className="border-vaporBorder" />

        <div className="pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-vaporText">Full Collection</h2>
            
            <VaultControls 
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              filterType={filterType} setFilterType={setFilterType}
              sortBy={sortBy} setSortBy={setSortBy}
              uniqueItemTypes={uniqueItemTypes}
            />
          </div>

          {processedItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {processedItems.map(item => <VaultItemCard key={item.record_id || item.id} item={item} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-vaporCard/50 rounded-xl border border-vaporBorder border-dashed">
              <p className="text-vaporMuted">No items match your search/filter criteria.</p>
              <button onClick={clearFilters} className="mt-4 text-vaporCyan hover:text-cyan-300 text-sm font-medium">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}