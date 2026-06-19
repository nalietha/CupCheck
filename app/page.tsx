// app/page.tsx
import Link from 'next/link'; // Make sure Link is imported
import SearchBar from '@/components/SearchBar';
import CatalogSearch from '@/components/CatalogSearch'; 
import DisplayShelf from '@/components/DisplayShelf';
import FilterSidebar from '@/components/FilterSidebar';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ q?: string; page?: string; type?: string; season?: string }>
}) {
  const { q, page, type, season } = await searchParams;
  
  const query = q || ''; 
  const currentPage = page || '1';
  
  const isSearching = Boolean(query || type || season || page);

  const { data: filterData } = await supabase.from('items').select('item_type, season');
  
  const availableTypes = Array.from(new Set(filterData?.map(d => d.item_type).filter(Boolean))).sort();
  const availableSeasons = Array.from(new Set(filterData?.map(d => d.season).filter(Boolean))).sort();

  let latestCups: any[] = [];
  let apparel: any[] = [];
  
  if (!isSearching) {
    const [cupsRes, apparelRes] = await Promise.all([
      supabase.from('items').select('*, item_images(image_url, display_order)').eq('item_type', 'cup').order('created_at', { ascending: false }).limit(5),
      supabase.from('items').select('*, item_images(image_url, display_order)').eq('item_type', 'shirt').order('created_at', { ascending: false }).limit(5)
    ]);
    latestCups = cupsRes.data || [];
    apparel = apparelRes.data || [];
  }

  return (
    <main className="max-w-7xl mx-auto px-6 mt-12 space-y-8 mb-20">
      
      {isSearching ? (
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 space-y-8 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-vaporCyan mb-4 tracking-wider">SEARCH</h2>
              <SearchBar />
            </div>
            <FilterSidebar 
              currentType={type} 
              currentSeason={season} 
              availableTypes={availableTypes}
              availableSeasons={availableSeasons}
            />
          </aside>

          <section className="w-full md:w-3/4">
            <header className="mb-6 pb-4 border-b border-vaporBorder">
              <h1 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink">
                RESULTS
              </h1>
              {query && <p className="text-vaporMuted mt-1">Showing matches for "{query}"</p>}
            </header>
            <CatalogSearch query={query} page={currentPage} type={type} season={season} />
          </section>
        </div>
      ) : (
        <div className="space-y-16">
          <header className="text-center space-y-6 pt-4 mb-16">
            <h1 className="text-5xl md:text-6xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan via-vaporPurple to-vaporPink drop-shadow-[0_0_15px_rgba(255,113,206,0.3)]">
              THE VAULT
            </h1>
            <p className="text-vaporMuted text-lg max-w-2xl mx-auto">
              Track, flex, and manage your Gamersupps collection.
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar />
            </div>
          </header>

          {/* Add the viewAllHref props to your shelves */}
          <DisplayShelf 
            title="Latest Cups" 
            items={latestCups} 
            viewAllHref="/?type=cup" 
          />
          <DisplayShelf 
            title="Apparel Drop" 
            items={apparel} 
            viewAllHref="/?type=shirt" 
          />
          
          {/* View Everything Button */}
          <div className="flex justify-center pt-8 pb-12">
            <Link 
              href="/?page=1"
              className="bg-transparent border-2 border-vaporCyan text-vaporCyan hover:bg-vaporCyan hover:text-[#0B0914] font-black italic px-8 py-4 rounded-full transition-all shadow-[0_0_15px_rgba(1,205,254,0.3)] hover:shadow-[0_0_25px_rgba(1,205,254,0.6)] tracking-widest text-lg"
            >
              VIEW ENTIRE CATALOG
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}