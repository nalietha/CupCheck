import { getFullItemDetails } from '@/lib/services/itemService';
import ItemImageGallery from '@/features/items/ItemImageGallery';
import Link from 'next/link';

export default async function ItemDisplayPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await getFullItemDetails(resolvedParams.id);

  if (!item) {
    return <div>Item not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <h1 className="text-4xl font-bold text-gray-900">{item.name}</h1>
            
            {/* Collection Badge */}
            {item.collection && (
              <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                {item.collection.name} Collection
              </span>
            )}
          </div>

          <p className="text-gray-600 text-lg">{item.description}</p>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            {/* Creators Section */}
            {item.creators.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Creator</h3>
                <div className="flex gap-2 flex-wrap">
                  {item.creators.map(creator => (
                    <Link key={creator.id} href={`/creators/${creator.id}`} className="text-blue-600 hover:underline font-medium">
                      {creator.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Artists Section */}
            {item.artists.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Artist</h3>
                <div className="flex gap-2 flex-wrap">
                  {item.artists.map(artist => (
                    <Link key={artist.id} href={`/artists/${artist.id}`} className="text-blue-600 hover:underline font-medium">
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