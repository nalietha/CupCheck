import { getFullItemDetails } from '@/lib/services/ItemService';
import ItemImageGallery from '@/features/items/ItemImageGallery';
import Link from 'next/link';

export default async function ItemDisplayPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await getFullItemDetails(resolvedParams.id);

  if (!item) {
    return <div className="text-center text-vaporText mt-10">Item not found.</div>;
  }


  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl text-vaporText transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: Image Gallery */}
        <div>
          <ItemImageGallery 
            primaryImage={item.primary_image_url} 
            galleryImages={item.images} 
            altText={item.name}
          />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink drop-shadow-[0_0_10px_rgba(1,205,254,0.3)]">
              {item.name}
            </h1>
            
            {/* Collection Badge */}
            {item.collection && (
              <span className="inline-block mt-3 px-3 py-1 bg-vaporPurple/20 text-vaporPurple border border-vaporPurple/50 text-sm font-bold uppercase tracking-wider rounded-md">
                {item.collection.name} Collection
              </span>
            )}
          </div>

          <p className="text-vaporMuted text-lg leading-relaxed">
            {item.description}
          </p>

          <div className="border-t border-vaporBorder pt-6 space-y-4">
            {/* Creators Section */}
            {item.creators.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-vaporMuted uppercase tracking-wider mb-2">Creator</h3>
                <div className="flex gap-2 flex-wrap">
                  {item.creators.map(creator => (
                    <Link key={creator.id} href={`/creators/${creator.id}`} className="text-vaporCyan hover:text-vaporPink transition-colors hover:underline font-medium">
                      {creator.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Artists Section */}
            {item.artists.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-vaporMuted uppercase tracking-wider mb-2">Artist</h3>
                <div className="flex gap-2 flex-wrap">
                  {item.artists.map(artist => (
                    <Link key={artist.id} href={`/artists/${artist.id}`} className="text-vaporCyan hover:text-vaporPink transition-colors hover:underline font-medium">
                      {artist.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}