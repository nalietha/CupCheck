import { supabase } from '@/lib/supabase';
import SearchBar from '@/components/SearchBar';
import AddToVaultButton from '@/components/AddToVaultButton';

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams;
  const query = q;

  let supabaseQuery = supabase
    .from('items')
    .select('*')
    .order('release_date', { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }

  const { data: cups, error } = await supabaseQuery;

  if (error) console.error("Error fetching cups:", error);

  return (
    <main className="max-w-7xl mx-auto px-6 mt-12 space-y-8">
      {/* --- HEADER & SEARCH AREA --- */}
      <header className="mb-12 text-center space-y-6 pt-4">
        <h1 className="text-5xl md:text-6xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan via-vaporPurple to-vaporPink drop-shadow-[0_0_15px_rgba(255,113,206,0.3)]">
          THE VAULT
        </h1>
        <p className="text-vaporMuted text-lg max-w-2xl mx-auto">
          Track, flex, and manage your Gamersupps collection.
        </p>

        <SearchBar />
      </header>

      {/* --- THE LIVE CUP GRID --- */}
      {cups?.length === 0 ? (
        <div className="text-center text-vaporMuted py-10">No cups found matching "{query}"</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {cups?.map((cup) => (
            <div key={cup.id} className="bg-vaporCard rounded-xl overflow-hidden border border-vaporBorder shadow-lg hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(1,205,254,0.2)] transition-all duration-300 flex flex-col">

              {/* Image Container */}
              <div className="h-64 bg-[#0A0710] flex items-center justify-center p-4 relative group">
                {cup.image_url ? (
                  <img
                    src={cup.image_url}
                    alt={cup.name}
                    className="object-contain h-full w-full drop-shadow-[0_0_15px_rgba(1,205,254,0.1)] group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-vaporBorder font-medium tracking-widest text-sm">NO IMAGE</span>
                )}

                {cup.limited && (
                  <span className="absolute top-3 right-3 bg-[#0B0914] text-vaporPink border border-vaporPink text-xs font-bold px-3 py-1 rounded shadow-[0_0_10px_rgba(255,113,206,0.3)]">
                    LIMITED
                  </span>
                )}
              </div>

              {/* Card Details */}
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-xl text-vaporCyan mb-1">{cup.name || 'Unknown Cup'}</h3>
                  <div className="flex justify-between items-center text-sm text-vaporMuted">
                    <span className="capitalize">{cup.item_type || 'Item'}</span>
                    {cup.retail_price && <span>${cup.retail_price}</span>}
                  </div>
                </div>

                <AddToVaultButton itemId={cup.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}