// lib/itemActions.ts
import { supabase } from '@/lib/supabase';
import { debug } from './debug';

export async function uploadSingleImage(file: File) {
  const fileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
  const filePath = `items/${fileName}`;
  
  const { error } = await supabase.storage.from('item-images').upload(filePath, file);
  if (error) throw error;
  
  const { data } = supabase.storage.from('item-images').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function uploadItemImages(itemImages: any[]) {
  return await Promise.all(itemImages.map(async (img, idx) => {
    // Evaluates if the image is a new file upload
    if (img.isNew && img.file) {
      const fileExt = img.file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(filePath, img.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);

      // Returns the newly generated URL
      return { id: img.id, image_url: publicUrl, display_order: idx };
    }
    
    // Returns the existing database URL string
    return { id: img.id, image_url: img.image_url || img.url, display_order: idx };
  }));
}

export async function saveItem(itemId: string | null, itemPayload: any) {
  if (itemId) {
    debug.info("Updating item with ID:", itemId);
    const { error } = await supabase.from('items').update(itemPayload).eq('id', itemId);
    if (error) throw error;
    return itemId;
  } else {
    debug.info("Inserting new item");
    const { data, error } = await supabase
      .from('items')
      .insert([itemPayload])
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id; 
  }
}

export async function syncItemRelationships(
  itemId: string,
  processedImages: any[],
  selectedCreators: string[]
) {
  // Retrieves current images tied to the item
  const { data: existingImages } = await supabase
    .from('item_images')
    .select('id, image_url')
    .eq('item_id', itemId);

  const newImageIds = processedImages.map(img => img.id).filter(Boolean);
  const imagesToDelete = existingImages?.filter(img => !newImageIds.includes(img.id)) || [];

  // Deletes only removed files from the storage bucket
  if (imagesToDelete.length > 0) {
    const pathsToDelete = imagesToDelete
      .map(img => img.image_url.split('/').pop()) 
      .filter(name => name)
      .map(name => `items/${name}`); 

    if (pathsToDelete.length > 0) {
      await supabase.storage.from('item-images').remove(pathsToDelete);
    }

    // Removes deleted image records from the database
    await supabase.from('item_images')
      .delete()
      .in('id', imagesToDelete.map(img => img.id));
  }

  // Updates display order or inserts new image records
  for (const img of processedImages) {
    if (img.id) {
      await supabase.from('item_images')
        .update({ display_order: img.display_order, image_url: img.image_url })
        .eq('id', img.id);
    } else {
      await supabase.from('item_images')
        .insert({
          item_id: itemId,
          image_url: img.image_url,
          display_order: img.display_order
        });
    }
  }

  // Syncs creator relationships
  await supabase.from('item_creators').delete().eq('item_id', itemId);
  if (selectedCreators.length > 0) {
    debug.info("Syncing creators for item:", itemId);
    const { error: creError } = await supabase.from('item_creators').insert(
      selectedCreators.map(cid => ({
        item_id: itemId,
        creator_id: cid
      }))
    );
    if (creError) throw creError;
  }
}