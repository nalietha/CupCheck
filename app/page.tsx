import { supabase } from '@/lib/supabase';
import SearchBar from '@/components/SearchBar';
import AddToVaultButton from '@/components/AddToVaultButton';
import ItemCard from '@/components/ItemCard';

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams;
  const query = q || ''; // Ensure it's at least an empty string

  // Build the query
  let supabaseQuery = supabase
    .from('items')
    .select(`
      *,
      item_images (
        url,
        display_order
      )
    `)
    .order('display_order', { foreignTable: 'item_images', ascending: true });

  // Apply search filter if query exists
  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }

  const { data: items, error } = await supabase
    .from('items')
    .select(`
      *,
      item_images (
        image_url,
        display_order
      )
    `)
    // Remove the foreignTable argument from inside the select
    // and use the standard order method:
    .order('display_order', { referencedTable: 'item_images', ascending: true });

  if (error) {
    console.error("Supabase Fetch Error:", error);
  }

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

      {/* --- THE LIVE ITEM GRID --- */}
      {items?.length === 0 ? (
        <div className="text-center text-vaporMuted py-10">No items found matching "{query}"</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {items?.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}