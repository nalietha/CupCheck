import { supabase } from '@/lib/supabase';
import SearchBar from '@/components/SearchBar';
import AddToVaultButton from '@/features/items/AddToVaultButton';

export default async function ExplorePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const { q } = await searchParams;
  
  // Fetch items based on search query
  let query = supabase
    .from('items')
    .select('*')
    .order('release_date', { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data: cups } = await query;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black italic text-white mb-8">Explore Cups</h1>
      <SearchBar />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {cups?.map((cup) => (
          <div key={cup.id} className="bg-[#1A1625] p-4 rounded-xl border border-vaporBorder">
            <h2 className="text-vaporCyan font-bold">{cup.name}</h2>
            <AddToVaultButton itemId={cup.id} />
          </div>
        ))}
      </div>
    </div>
  );
}