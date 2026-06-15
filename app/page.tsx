import SearchBar from '@/components/SearchBar';
import CatalogSearch from '@/components/CatalogSearch'; 

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams;
  const query = q || ''; 

  return (
    <main className="max-w-7xl mx-auto px-6 mt-12 space-y-8">
      {/* --- HEADER & SEARCH BAR AREA --- */}
      <header className="mb-12 text-center space-y-6 pt-4">
        <h1 className="text-5xl md:text-6xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan via-vaporPurple to-vaporPink drop-shadow-[0_0_15px_rgba(255,113,206,0.3)]">
          THE VAULT
        </h1>
        <p className="text-vaporMuted text-lg max-w-2xl mx-auto">
          Track, flex, and manage your Gamersupps collection.
        </p>

        <SearchBar />
      </header>

      {/* --- REUSABLE CATALOG COMPONENT --- */}
      <CatalogSearch query={query} />
      
    </main>
  );
}