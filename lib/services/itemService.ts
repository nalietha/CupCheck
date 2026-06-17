import { supabase } from '@/lib/supabase';

// Define strict types for the returned data
export interface FullItemDetails {
  id: string;
  name: string;
  description: string;
  primary_image_url: string;
  collection: { id: string; name: string } | null;
  images: { id: string; image_url: string; display_order: number }[];
  artists: { id: string; name: string }[];
  creators: { id: string; name: string }[];
}

export async function getFullItemDetails(itemId: string): Promise<FullItemDetails | null> {
  const { data, error } = await supabase
    .from('items')
    .select(`
      id,
      name,
      description,
      image_url,
      collection:collections ( id, name ),
      images:item_images!item_images_item_id_fkey ( id, image_url, display_order ),
      item_artist ( artist:artists ( id, name ) ),
      item_creators ( creator:creators ( id, name ) )
    `)
    .eq('id', itemId)
    .single();

  if (error || !data) {
    console.error('Error fetching item details:', error);
    return null;
  }

  // Transform the nested Supabase relational data into a clean, flat object
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    primary_image_url: data.image_url,
    collection: Array.isArray(data.collection) ? data.collection[0] : data.collection,
    // Sort images by display order to ensure the carousel flows correctly
    images: (data.images || []).sort((a, b) => a.display_order - b.display_order),
    // Extract artists and creators from the joining tables
    artists: data.item_artist?.map((ia: any) => ia.artist).filter(Boolean) || [],
    creators: data.item_creators?.map((ic: any) => ic.creator).filter(Boolean) || [],
  };
}