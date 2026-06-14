import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';
import AddToVaultButton from '@/features/items/AddToVaultButton';

export default async function ItemDetailsPage({ params }: { params: { id: string } }) {
  // 1. Fetch the primary item details along with connected table data
  const { data: item, error } = await supabase
    .from('items')
    .select(`
      *,
      collections ( name ),
      artists ( name ),
      creators ( name )
    `)
    .eq('id', params.id)
    .single();

  if (error || !item) {
    notFound(); // Triggers the 404 page if the cup ID is fake
  }

  // 2. Fetch the custom-ordered images from our junction table
  const { data: images } = await supabase
    .from('item_images')
    .select('url')
    .eq('item_id', params.id)
    .order('display_order', { ascending: true });

  // Fallback in case a cup has no images uploaded yet
  const displayImages = images && images.length > 0 
    ? images 
    : [{ url: item.image_url || '/placeholder.png' }];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl min-h-screen">
      
      {/* 2-Column Grid for Desktop, stacked on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: The Interactive Gallery */}
        <div className="w-full">
          <ImageGallery images={displayImages} />
        </div>

        {/* Right Column: Metadata, Vaporwave Styling, and Vault Button */}
        <div className="text-white space-y-8 flex flex-col justify-center">
          
          {/* Header Section */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-2 drop-shadow-md">
              {item.name}
            </h1>
            {item.collections && (
              <span className="text-xl text-cyan-300 font-bold tracking-widest uppercase opacity-80">
                {item.collections.name}
              </span>
            )}
          </div>

          {/* Description Block */}
          <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 shadow-lg backdrop-blur-sm">
            <p className="text-gray-300 leading-relaxed text-lg">
              {item.description || "No official description available for this drop."}
            </p>
          </div>

          {/* Stats / Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {item.creators && (
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800/50 hover:border-pink-500/50 transition-colors">
                <span className="text-gray-500 block mb-1 uppercase tracking-wider text-xs">Creator</span>
                <span className="text-pink-400 font-medium text-base">{item.creators.name}</span>
              </div>
            )}
            
            {item.artists && (
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800/50 hover:border-cyan-400/50 transition-colors">
                <span className="text-gray-500 block mb-1 uppercase tracking-wider text-xs">Artist</span>
                <span className="text-cyan-400 font-medium text-base">{item.artists.name}</span>
              </div>
            )}

            {item.release_date && (
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800/50">
                <span className="text-gray-500 block mb-1 uppercase tracking-wider text-xs">Drop Date</span>
                <span className="text-white text-base">{new Date(item.release_date).toLocaleDateString()}</span>
              </div>
            )}

            {item.retail_price && (
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800/50">
                <span className="text-gray-500 block mb-1 uppercase tracking-wider text-xs">Retail Price</span>
                <span className="text-green-400 font-bold text-base">${item.retail_price}</span>
              </div>
            )}
          </div>

          {/* The Call to Action */}
          <div className="pt-4 border-t border-gray-800">
            <div className="w-full md:w-2/3">
              <AddToVaultButton itemId={item.id} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}