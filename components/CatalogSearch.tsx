import { supabase } from '@/lib/supabase';
import ItemCard from '@/components/ItemCard';

// We accept the query string as a prop so any parent page can pass it down
export default async function CatalogSearch({ query }: { query: string }) {
  
  // 1. Build the base query
  let supabaseQuery = supabase
    .from('items') // Note: If you created the 'searchable_items' view earlier, use that here!
    .select(`
      *,
      item_images (
        image_url,
        display_order
      )
    `)
    .order('display_order', { referencedTable: 'item_images', ascending: true });

  // 2. Apply the search filter ONLY if a query was provided
  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }

  // 3. Await the actual variable we built (Fixes the bug!)
  const { data: items, error } = await supabaseQuery;

  if (error) {
    console.error("Supabase Fetch Error:", error);
  }

  // 4. Return the Grid
  return (
    <div className="w-full">
      {items?.length === 0 ? (
        <div className="text-center text-vaporMuted py-10">
          No items found matching "{query}"
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {items?.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}