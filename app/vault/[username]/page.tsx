'use client';
import { use } from 'react';
import { useVaultData } from '@/hooks/useVaultData';
import { useVaultFilters } from '@/hooks/useVaultFilters';
import VaultHeader from '@/features/vault/VaultHeader';
import DisplayShelf from '@/components/DisplayShelf';
import VaultControls from '@/features/vault/VaultControls';
import VaultItemCard from '@/features/vault/VaultItemCard';

export default function VaultPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const vaultOwner = decodeURIComponent(resolvedParams.username);

  // 1. Fetch Data
  const { profile, vaultItems, loading } = useVaultData(vaultOwner);
  
  // 2. Process Filters & Sorts
  const { 
    searchQuery, setSearchQuery, filterType, setFilterType, 
    sortBy, setSortBy, uniqueItemTypes, processedItems, clearFilters 
  } = useVaultFilters(vaultItems);

  // 3. Render Checks
  if (loading) return <div className="min-h-screen bg-vaporBg text-vaporText flex items-center justify-center">Loading Vault...</div>;
  if (!profile) return <div className="min-h-screen bg-vaporBg text-vaporText flex items-center justify-center">Vault not found.</div>;

  // 4. Derived Shelves Data
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        <div>
          <DisplayShelf title="Favorites ✨" items={favorites} emptyMessage="No favorites selected yet." />
          <div className="mt-8">
            <DisplayShelf title="Newest Additions" items={newestItems.slice(0, 5)} />
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
              {processedItems.map(item => <VaultItemCard key={item.id} item={item} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-vaporCard/50 rounded-xl border border-vaporBorder border-dashed">
              <p className="text-vaporMuted">No items match your search/filter criteria.</p>
              <button onClick={clearFilters} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}