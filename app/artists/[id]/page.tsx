import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ItemCard from '@/features/items/ItemCard';

export default async function ArtistDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch Artist Data
  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single();

  if (artistError || !artist) {
    notFound();
  }

  // 2. Fetch Associated Items via Junction Table (item_artist)
  // We use an inner join to only grab items linked to this specific artist
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select(`
      *,
      item_images (
        image_url,
        display_order
      ),
      item_artist!inner(artist_id, role)
    `)
    .eq('item_artist.artist_id', id)
    .order('release_date', { ascending: false });

  // Safety check for links array
  const socialLinks = artist.links || [];

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl min-h-screen">
      
      {/* --- TOP SECTION: Artist Info --- */}
      <div className="flex flex-col md:flex-row gap-8 bg-vaporCard/60 p-8 rounded-2xl border border-vaporBorder shadow-xl backdrop-blur-sm mb-12 relative overflow-hidden">
        
        {/* Background Accent Glow */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Left: Artist Image */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 z-10">
          <div className="aspect-square rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(1,205,254,0.15)] bg-vaporBg">
            {artist.image_url ? (
              <img
                src={artist.image_url}
                alt={artist.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-vaporMuted">
                <svg className="w-20 h-20 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Right: Details & Links */}
        <div className="flex-1 flex flex-col justify-center z-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-vaporPink to-cyan-400 tracking-wider">
                {artist.name}
              </h1>
              <div className="mt-2 inline-block bg-vaporBg border border-vaporBorder text-vaporMuted text-xs px-3 py-1 rounded-md uppercase tracking-widest font-bold">
                Featured Artist
              </div>
            </div>

            {/* Social Links on the Right */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link: any, index: number) => (
                  <a 
                    key={index} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="bg-black/50 border border-vaporBorder hover:border-cyan-400 hover:text-cyan-400 text-vaporText px-4 py-2 rounded-lg font-bold transition-all shadow-lg text-sm"
                  >
                    {link.platform || 'Link'}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: Artist's Items --- */}
      <div>
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-black text-vaporText uppercase tracking-widest">
            Portfolio
          </h2>
          <div className="ml-6 flex-grow h-px bg-gradient-to-r from-vaporPink to-transparent"></div>
        </div>

        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="relative group">
                <ItemCard item={item} />
                
                {/* Optional: Show their specific role on the item if they have one */}
                {item.item_artist?.[0]?.role && (
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-cyan-400 border border-cyan-400/30 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider z-20">
                    {item.item_artist[0].role}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-vaporCard/30 rounded-xl border border-vaporBorder border-dashed">
            <p className="text-gray-500 text-lg">No items have been attributed to this artist yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}