// app/vault/[username]/page.tsx
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
import { ShelfChoice, VaultItem } from '@/types';
import VaultNavBar from '@/features/vault/VaultNavBar';

export default function VaultPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const vaultOwner = decodeURIComponent(resolvedParams.username);

  const { profile, vaultItems, loading } = useVaultData(vaultOwner);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function checkOwnershipAndRole() {
      if (profile) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setIsOwner(user.id === profile.id);
          
          // Fetch the current logged-in user's role
          const { data: currentUserProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          setIsAdmin(currentUserProfile?.role === 'admin');
        }
      }
      setAuthLoading(false);
    }

    if (!loading && profile) {
      checkOwnershipAndRole();
    } else if (!loading && !profile) {
      setAuthLoading(false);
    }
  }, [profile, loading]);

  const {
    searchQuery, setSearchQuery, filterType, setFilterType,
    sortBy, setSortBy, uniqueItemTypes, processedItems, clearFilters
  } = useVaultFilters(vaultItems);

  if (loading || authLoading) return <div className="min-h-screen bg-vaporBg text-vaporText flex items-center justify-center">Loading Vault...</div>;
  if (!profile) return <div className="min-h-screen bg-vaporBg text-vaporText flex items-center justify-center">Vault not found.</div>;

  // Privacy Check - Bypassed if Admin
  if (!profile.is_public && !isOwner && !isAdmin) {
    return (
      <div className="min-h-screen bg-vaporBg text-vaporText flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-black italic text-vaporCyan mb-4 tracking-widest">PRIVATE VAULT</h2>
        <p className="text-vaporMuted mb-6">This collector has set their vault to private.</p>
        <Link href="/explore" className="bg-transparent border-2 border-vaporPink text-vaporPink hover:bg-vaporPink hover:text-[#0B0914] font-bold px-6 py-2 rounded transition-all shadow-[0_0_10px_rgba(255,113,206,0.3)]">
          RETURN TO EXPLORE
        </Link>
      </div>
    );
  }

  const getShelfItems = (shelf: ShelfChoice, allVaultItems: VaultItem[]) => {
    let items: VaultItem[] = [];
    switch (shelf.type) {
      case 'preset':
        if (shelf.id === 'favorites') items = allVaultItems.filter(item => item.is_favorite);
        else if (shelf.id === 'newest') items = [...allVaultItems].sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime());
        break;
      case 'collection':
        items = allVaultItems.filter(item => item.collection_id === shelf.value);
        break;
      case 'item_type':
        items = allVaultItems.filter(item => item.item_type === shelf.value);
        break;
    }
    return items.slice(0, 5); 
  };

  const validShelves = Array.isArray(profile.vault_shelves) ? profile.vault_shelves : [];

  return (
    <div className="min-h-screen bg-vaporBg pb-20">
      
      {/* Admin Override Warning Banner */}
      {!profile.is_public && isAdmin && !isOwner && (
        <div className="bg-red-900/80 text-white text-center text-xs font-bold py-2 uppercase tracking-widest border-b border-red-500">
          Viewing Private Vault (Admin Override)
        </div>
      )}

      <VaultHeader
        username={profile.display_name || profile.username}
        uniqueCount={vaultItems.length}
        dateStarted={profile.started_collecting || profile.created_at} 
        bannerUrl={profile.banner_url}
      />

      <VaultNavBar username={profile.username} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        <VaultCompletionDisplay userId={profile.id} />

        <div className="space-y-8">
          {validShelves.map((shelf: ShelfChoice) => {
            const shelfItems = getShelfItems(shelf, vaultItems);
            return (
              <VaultDisplayShelf
                key={shelf.id}
                title={shelf.label}
                items={shelfItems}
                emptyMessage={`No items match this shelf criteria.`}
              />
            );
          })}

          {validShelves.length === 0 && (
            <VaultDisplayShelf
              title="Favorites"
              items={vaultItems.filter(i => i.is_favorite).slice(0, 5)}
              emptyMessage="No favorites selected yet."
            />
          )}
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