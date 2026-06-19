import { supabase } from '@/lib/supabase';

export interface FullItemDetails {
  id: string;
  name: string;
  description: string;
  primary_image_url: string;
  collection: { id: string; name: string } | null;
  images: { id: string; image_url: string; display_order: number }[];
  artists: { id: string; name: string; image_url?: string; links?: any }[];
  creators: { id: string; name: string; image_url?: string; gg_code?: string }[];
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
      item_artist ( artist:artists ( id, name, image_url, links ) ),
      item_creators ( creator:creators ( id, name, image_url, gg_code ) )
    `)
    .eq('id', itemId)
    .single();

  if (error || !data) {
    console.error('Error fetching item details:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    primary_image_url: data.image_url,
    collection: Array.isArray(data.collection) ? data.collection[0] : data.collection,
    images: (data.images || []).sort((a, b) => a.display_order - b.display_order),
    artists: data.item_artist?.map((ia: any) => ia.artist).filter(Boolean) || [],
    creators: data.item_creators?.map((ic: any) => ic.creator).filter(Boolean) || [],
  };
}