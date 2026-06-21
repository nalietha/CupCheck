import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ItemCard from '@/features/items/ItemCard';

export default async function CreatorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch Creator Data
  const { data: creator, error: creatorError } = await supabase
    .from('creators')
    .select('*')
    .eq('id', id)
    .single();

  if (creatorError || !creator) {
    notFound();
  }

  // 2. Fetch Associated Items via Junction Table (item_creators)
  // We use an inner join to only grab items linked to this specific creator
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select(`
      *,
      item_images (
        image_url,
        display_order
      ),
      item_creators!inner(creator_id)
    `)
    .eq('item_creators.creator_id', id)
    .order('release_date', { ascending: false });

  const socialLinks = creator.social_links || {};

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl min-h-screen">
      
      {/* --- TOP SECTION: Creator Info --- */}
      <div className="flex flex-col md:flex-row gap-8 bg-vaporCard/60 p-8 rounded-2xl border border-vaporBorder shadow-xl backdrop-blur-sm mb-12 relative overflow-hidden">
        
        {/* Background Accent Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Left: Creator Image */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
          <div className="aspect-square rounded-xl overflow-hidden border-2 border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)] bg-vaporBg">
            <img
              src={creator.image_url || 'https://placehold.co/400x400/1a1a2e/ff00ff?text=No+Avatar'}
              alt={creator.name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Right: Details & Links */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 tracking-wider">
                {creator.name}
              </h1>
              {creator.gg_codes && (
                <div className="mt-2 inline-block bg-vaporBg border border-vaporBorder text-vaporCyan font-mono text-sm px-3 py-1 rounded-md">
                  Use Code: <span className="font-bold text-vaporText">{creator.gg_codes}</span>
                </div>
              )}
            </div>

            {/* Social Links on the Right */}
            <div className="flex gap-3">
              {socialLinks.twitch && (
                <a href={socialLinks.twitch} target="_blank" rel="noreferrer" className="bg-[#6441a5] hover:bg-[#7d5bbe] text-vaporText px-4 py-2 rounded-lg font-bold transition-all shadow-lg text-sm">
                  Twitch
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="bg-[#FF0000] hover:bg-[#ff3333] text-vaporText px-4 py-2 rounded-lg font-bold transition-all shadow-lg text-sm">
                  YouTube
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="bg-[#1DA1F2] hover:bg-[#40b1f5] text-vaporText px-4 py-2 rounded-lg font-bold transition-all shadow-lg text-sm">
                  Twitter
                </a>
              )}
            </div>
          </div>

          <div className="mt-4 text-gray-300 leading-relaxed text-lg">
            {creator.description ? (
              <p>{creator.description}</p>
            ) : (
              <p className="text-gray-500 italic">No description provided for this creator yet.</p>
            )}
          </div>
          
          {creator.is_nsfw && (
             <span className="mt-4 self-start bg-pink-900/40 text-pink-400 border border-pink-500/50 text-xs px-2 py-1 rounded uppercase tracking-widest font-bold">
               NSFW Content Warning
             </span>
          )}
        </div>
      </div>

      {/* --- BOTTOM SECTION: Creator's Items --- */}
      <div>
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-black text-vaporText uppercase tracking-widest">
            Released Items
          </h2>
          <div className="ml-6 flex-grow h-px bg-gradient-to-r from-cyan-500 to-transparent"></div>
        </div>

        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-vaporCard/30 rounded-xl border border-vaporBorder border-dashed">
            <p className="text-gray-500 text-lg">This creator doesn't have any items linked to them yet.</p>
          </div>
        )}
      </div>

    </div>
  );
}