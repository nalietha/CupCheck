// app/page.tsx
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

  // Fetches metadata and catalog items based on creation and release dates
  const [filterRes, newlyAddedRes, newestReleasesRes] = await Promise.all([
    supabase.from('items').select('item_type, season'),
    supabase.from('items')
      .select('*, item_images(image_url, display_order)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('items')
      .select('*, item_images(image_url, display_order)')
      .order('release_date', { ascending: false })
      .limit(5)
  ]);

  const availableTypes = Array.from(new Set(filterRes.data?.map(d => d.item_type).filter(Boolean))).sort();
  const availableSeasons = Array.from(new Set(filterRes.data?.map(d => d.season).filter(Boolean))).sort();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 md:mt-12 space-y-8 mb-20 w-full">
      {isSearching ? (
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 space-y-8 shrink-0">
            <h2 className="text-lg font-bold text-vaporCyan mb-2 tracking-wider">SEARCH</h2>
            <SearchBar />
            <FilterSidebar 
              currentType={type} currentSeason={season} 
              availableTypes={availableTypes} availableSeasons={availableSeasons} 
            />
          </aside>
          <section className="w-full md:w-3/4">
            <header className="mb-6 pb-4 border-b border-vaporBorder">
              <h1 className="text-2xl md:text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink break-words">
                RESULTS
              </h1>
              {query && <p className="text-vaporMuted mt-1 text-sm">Showing matches for "{query}"</p>}
            </header>

            {/* Displays a beta notice regarding data integrity */}
            <div className="mb-8 p-4 bg-pink-900/10 border border-vaporPink/30 rounded-xl flex items-start gap-4 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
              <span className="text-vaporPink text-2xl leading-none">⚠</span>
              <p className="text-sm text-vaporMuted">
                <strong className="text-vaporPink tracking-widest uppercase">Data Verification in Progress</strong>
                <br/>
                A significant portion of the catalog is currently being verified by the community. Notice missing or incorrect data? 
                <Link href="/support/data-fix" className="text-vaporCyan hover:text-cyan-300 ml-1 underline decoration-cyan-500/30">
                  Submit a data fix
                </Link>.
              </p>
            </div>

            <CatalogSearch query={query} page={currentPage} type={type} season={season} />
          </section>
        </div>
      ) : (
        <div className="space-y-12 md:space-y-16">
          
          <header className="flex flex-col items-center justify-center text-center pt-2 mb-8 md:mb-12">
            <div className="w-40 sm:w-56 md:w-[400px] mb-4 md:mb-6 transition-transform duration-700 hover:scale-105">
              <img 
                src="/images/cupcheck_logo.png" 
                alt="CupCheck Logo" 
                className="w-full h-auto object-contain mix-blend-screen drop-shadow-[0_0_20px_rgba(1,205,254,0.3)]"
              />
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink uppercase mb-2 md:mb-4 break-words px-2">
              CupCheck.cc
            </h1>
            
            <p className="text-vaporMuted text-sm md:text-lg mb-6 md:mb-8 px-4 max-w-xl">
              Track, flex, and manage your Gamersupps collection.
            </p>
            
            <div className="w-full max-w-md px-2">
               <SearchBar />
            </div>
          </header>

          {/* Renders dynamic inventory shelves */}
          <DisplayShelf 
            title="Recently Added to Catalog" 
            items={newlyAddedRes.data || []} 
            viewAllHref="/?page=1" 
          />
          <DisplayShelf 
            title="Latest Releases" 
            items={newestReleasesRes.data || []} 
            viewAllHref="/?page=1" 
          />

          <div className="flex justify-center pt-4">
            <Link href="/?page=1" className="bg-transparent border-2 border-vaporCyan text-vaporCyan hover:bg-vaporCyan hover:text-black font-black italic px-6 py-3 md:px-8 md:py-4 rounded-full transition-all text-xs sm:text-sm md:text-lg shadow-[0_0_15px_rgba(1,205,254,0.3)] tracking-widest text-center">
              VIEW ENTIRE CATALOG
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}