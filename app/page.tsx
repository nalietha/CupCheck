import Link from 'next/link';
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

  // Fetch filter metadata and main shelf data in parallel
  const [filterRes, cupsRes, apparelRes, tubsRes] = await Promise.all([
    supabase.from('items').select('item_type, season'),
    supabase.from('items').select('*, item_images(image_url, display_order)').eq('item_type', 'cup').order('release_date', { ascending: false }).limit(5),
    supabase.from('items').select('*, item_images(image_url, display_order)').eq('item_type', 'shirt').order('release_date', { ascending: false }).limit(5),
    supabase.from('items').select('*, item_images(image_url, display_order)').eq('item_type', 'tub').order('release_date', { ascending: false }).limit(5)
  ]);

  const availableTypes = Array.from(new Set(filterRes.data?.map(d => d.item_type).filter(Boolean))).sort();
  const availableSeasons = Array.from(new Set(filterRes.data?.map(d => d.season).filter(Boolean))).sort();

  return (
    <main className="max-w-7xl mx-auto px-6 mt-12 space-y-8 mb-20">
      {isSearching ? (
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 space-y-8 shrink-0">
            <h2 className="text-xl font-bold text-vaporCyan mb-4 tracking-wider">SEARCH</h2>
            <SearchBar />
            <FilterSidebar 
              currentType={type} currentSeason={season} 
              availableTypes={availableTypes} availableSeasons={availableSeasons} 
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
          {/* Hero Section */}
          <header className="flex flex-col items-center justify-center text-center pt-4 mb-16">
            <div className="w-64 sm:w-80 md:w-[400px] mb-8 transition-transform duration-700 hover:scale-105">
              <img 
                src="/images/cupcheck_logo.png" 
                alt="CupCheck Logo" 
                className="w-full h-auto object-contain mix-blend-screen drop-shadow-[0_0_20px_rgba(1,205,254,0.3)]"
              />
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink uppercase mb-6">
              CupCheck
            </h1>
            <p className="text-vaporMuted text-lg mb-8">Track, flex, and manage your Gamersupps collection.</p>
            <SearchBar />
          </header>

          {/* Shelves */}
          <DisplayShelf title="Latest Cups" items={cupsRes.data || []} viewAllHref="/?type=cup" />
          <DisplayShelf title="Apparel Drop" items={apparelRes.data || []} viewAllHref="/?type=shirt" />
          <DisplayShelf title="Latest Flavors" items={tubsRes.data || []} viewAllHref="/?type=tub" />

          {/* CTA */}
          <div className="flex justify-center pt-8">
            <Link href="/?page=1" className="bg-transparent border-2 border-vaporCyan text-vaporCyan hover:bg-vaporCyan hover:text-black font-black italic px-8 py-4 rounded-full transition-all shadow-[0_0_15px_rgba(1,205,254,0.3)] tracking-widest text-lg">
              VIEW ENTIRE CATALOG
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}