// components/CatalogSearch.tsx
import { supabase } from '@/lib/supabase';
import ItemCard from '@/features/items/ItemCard';
import Pagination from '@/components/Pagination';

interface CatalogSearchProps {
  query: string;
  page: string;
  type?: string;
  season?: string;
}

export default async function CatalogSearch({ query, page, type, season }: CatalogSearchProps) {
  const ITEMS_PER_PAGE = 40;
  const currentPage = parseInt(page, 10) || 1;
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // 1. Build the base query asking for exact count
  let supabaseQuery = supabase
    .from('items') 
    .select(`
      *,
      item_images (
        image_url,
        display_order
      )
    `, { count: 'exact' });

  // 2. Apply text search
  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }

  // 3. Apply advanced filters
  if (type) {
    supabaseQuery = supabaseQuery.eq('item_type', type);
  }
  if (season) {
    supabaseQuery = supabaseQuery.eq('season', season);
  }

  // 4. Apply pagination and ordering
  supabaseQuery = supabaseQuery
    .order('created_at', { ascending: false })
    .range(from, to);

  const { data: items, count, error } = await supabaseQuery;

  if (error) {
    console.error("Supabase Fetch Error:", error);
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  return (
    <div className="w-full flex flex-col min-h-[500px]">
      {items?.length === 0 ? (
        <div className="text-center text-vaporMuted py-20 bg-black/20 rounded-lg border border-vaporBorder">
          No items found matching your filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {items?.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-auto pt-12 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  );
}