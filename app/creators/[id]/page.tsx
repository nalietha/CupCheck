import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ItemCard from '@/features/items/ItemCard';

export default async function CreatorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: creator, error: creatorError } = await supabase
    .from('creators')
    .select('*')
    .eq('id', id)
    .single();

  if (creatorError || !creator) {
    notFound();
  }

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

  // Safely default to an empty array
  const socialLinks = Array.isArray(creator.social_links) ? creator.social_links : [];

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl min-h-screen">
      
      <div className="flex flex-col md:flex-row gap-8 bg-vaporCard/60 p-8 rounded-2xl border border-vaporBorder shadow-xl backdrop-blur-sm mb-12 relative overflow-hidden">
        
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 z-10">
          <div className="aspect-square rounded-xl overflow-hidden border-2 border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)] bg-vaporBg">
            <img
              src={creator.image_url || 'https://placehold.co/400x400/1a1a2e/ff00ff?text=No+Avatar'}
              alt={creator.name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center z-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 tracking-wider">
                {creator.name}
              </h1>
              {creator.gg_codes && creator.gg_codes.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-vaporCyan font-mono text-sm uppercase tracking-widest">
                    Code{creator.gg_codes.length > 1 ? 's' : ''}:
                  </span>
                  {creator.gg_codes.map((code: string) => (
                    <span key={code} className="bg-vaporBg border border-vaporBorder text-vaporText font-bold font-mono text-sm px-3 py-1 rounded-md">
                      {code}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamically mapped Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link: any, index: number) => {
                  const platformName = link.platform === 'Custom' && link.custom_label 
                    ? link.custom_label 
                    : link.platform;

                  return (
                    <a 
                      key={link.id || index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="bg-black/50 border border-vaporBorder hover:border-cyan-400 hover:text-cyan-400 text-vaporText px-4 py-2 rounded-lg font-bold transition-all shadow-lg text-sm"
                    >
                      {platformName}
                    </a>
                  );
                })}
              </div>
            )}
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