import { supabase } from '../lib/supabase';

export default async function Home() {
  // 1. Fetch real items from your Supabase database!
  const { data: cups, error } = await supabase
    .from('items')
    .select('*')
    .order('release_date', { ascending: false }); // Show newest first

  if (error) console.error("Error fetching cups:", error);

  return (
    <div className="min-h-screen bg-vaporBg text-vaporText font-sans pb-12">
      {/* ... Keep your existing header and search bar here ... */}

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-8">
        
        {/* ... Keep your Header & Search HTML ... */}

        {/* The Live Cup Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          
          {/* 2. Map through the real data instead of hardcoding! */}
          {cups?.map((cup) => (
            <div key={cup.id} className="bg-vaporCard rounded-xl overflow-hidden border border-vaporBorder shadow-lg hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(1,205,254,0.15)] transition-all duration-300">
              <div className="h-64 bg-[#0A0710] flex items-center justify-center p-4 relative group">
                {/* We will swap this out for a real <img> tag later! */}
                <span className="text-vaporBorder italic group-hover:text-vaporCyan transition-colors">
                  {cup.image_url ? "Image Loaded" : "No Image"}
                </span>
                
                {cup.limited && (
                  <span className="absolute top-3 right-3 bg-vaporPurple/20 text-vaporPurple border border-vaporPurple/50 text-xs px-2 py-1 rounded">
                    Limited
                  </span>
                )}
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-xl text-vaporCyan">{cup.name || 'Unknown Cup'}</h3>
                  <p className="text-sm text-vaporMuted capitalize">{cup.item_type || 'Item'}</p>
                </div>
                <button className="w-full bg-vaporPink text-vaporBg font-bold py-2.5 rounded-md hover:bg-white hover:text-vaporPink transition-all shadow-[0_0_10px_rgba(255,113,206,0.4)] hover:shadow-[0_0_20px_rgba(255,113,206,0.8)]">
                  + Add to Vault
                </button>
              </div>
            </div>
          ))}
          
        </div>
      </main>
    </div>
  );
}