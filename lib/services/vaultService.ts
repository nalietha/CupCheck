import { supabase } from '@/lib/supabase';

export async function getVaultItemDetails(vaultRecordId: string) {
  const { data, error } = await supabase
    .from('user_collections')
    .select(`
      *,
      item:items (
        id, 
        name, 
        description, 
        image_url,
        collection:collections ( name )
      ),
      profile:profiles ( id, username, is_public )
    `)
    .eq('id', vaultRecordId)
    .single();

  if (error || !data) {
    console.error('Error fetching vault record:', error);
    return null;
  }

  // Flatten the collection name if it exists to make UI code cleaner
  const itemData = {
    ...data.item,
    collection_name: Array.isArray(data.item.collection) 
      ? data.item.collection[0]?.name 
      : data.item.collection?.name
  };

  return { ...data, item: itemData };
}