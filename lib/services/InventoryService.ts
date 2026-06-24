// lib/services/InventoryService.ts
import { supabase } from '@/lib/supabase';

export const InventoryService = {
  /**
   * Adds a duplicate record for a specific item to a user's vault.
   */
  async addDuplicateRecord(userId: string, itemId: string) {
    const { data, error } = await supabase
      .from('user_collections')
      .insert([{ user_id: userId, item_id: itemId }]);
      
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Removes a single specific record (quantity -1) based on its unique ID.
   */
  async removeSingleRecord(collectionId: string) {
    const { error } = await supabase
      .from('user_collections')
      .delete()
      .eq('id', collectionId);
      
    if (error) throw new Error(error.message);
    return true;
  },

  /**
   * Completely removes all copies of a specific item from a user's vault.
   */
  async removeAllRecordsForItem(userId: string, itemId: string) {
    const { error } = await supabase
      .from('user_collections')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId);
      
    if (error) throw new Error(error.message);
    return true;
  },

  /**
   * Updates the mutable details of a specific vault record.
   */
  async updateRecordDetails(collectionId: string, updateData: any) {
    const { error } = await supabase
      .from('user_collections')
      .update(updateData)
      .eq('id', collectionId);

    if (error) throw new Error(error.message);
    return true;
  },

  async toggleFavorite(collectionId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('user_collections')
      .update({ is_favorite: !currentStatus })
      .eq('id', collectionId);
    if (error) throw new Error(error.message);
    return true;
  }
};