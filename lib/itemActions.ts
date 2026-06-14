import { supabase } from '@/lib/supabase';
import { debug } from './debug';

export async function uploadItemImages(itemImages: any[]) {
  return await Promise.all(itemImages.map(async (img, idx) => {
    if (img.isNew && img.file) {
      const fileExt = img.file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(filePath, img.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);

      return { url: publicUrl, display_order: idx };
    }
    return { url: img.url, display_order: idx };
  }));
}

export async function saveItem(itemId: string | null, itemPayload: any) {
  if (itemId) {
    // UPDATE existing
    debug.info("Updating item with ID:", itemId);
    const { error } = await supabase.from('items').update(itemPayload).eq('id', itemId);
    if (error) throw error;
    return itemId;
  } else {
    // INSERT new
    debug.info("Inserting new item");
    const { data, error } = await supabase
      .from('items')
      .insert([itemPayload])
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id; // Return the generated UUID
  }
}

export async function syncItemRelationships(
  itemId: string,
  processedImages: any[],
  selectedCreators: string[]
) {
  // Sync Images
  await supabase.from('item_images').delete().eq('item_id', itemId);
  if (processedImages.length > 0) {
    const { error: imgError } = await supabase.from('item_images').insert(
      processedImages.map(img => ({
        item_id: itemId,
        image_url: img.url,
        display_order: img.display_order
      }))
    );
    if (imgError) throw imgError;
  }

  // Sync Creators
  await supabase.from('item_creators').delete().eq('item_id', itemId);
  if (selectedCreators.length > 0) {
    debug.info("Syncing creators for item:", itemId);
    debug.info("Selected creators:", selectedCreators);
    const { error: creError } = await supabase.from('item_creators').insert(
      selectedCreators.map(cid => ({
        item_id: itemId,
        creator_id: cid
      }))
    );
    if (creError) throw creError;
  }
}