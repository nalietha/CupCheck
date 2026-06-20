import { supabase } from '@/lib/supabase';
import { ImageService } from '@/lib/services/ImageService';

export interface TierListItem {
  item_id: string;
  name: string;
  image_url: string;
  tier: string; 
}

export const TierListService = {
  /**
   * Constructs the complete tier list by merging all available base tubs 
   * with the user's specific ranking data.
   */
  async getUserTierList(userId: string): Promise<TierListItem[]> {
    const { data: allTubs, error: tubError } = await supabase
      .from('items')
      .select('id, name, image_url, item_images(image_url, display_order)')
      .eq('item_type', 'tub')
      .eq('variant_type', 'standard');

    if (tubError) throw new Error('Failed to fetch tubs');

    const { data: userTiers, error: tierError } = await supabase
      .from('flavor_tier_lists')
      .select('item_id, tier')
      .eq('user_id', userId);

    if (tierError) throw new Error('Failed to fetch user tier list');

    const tierMap = new Map(userTiers?.map(t => [t.item_id, t.tier]));

    return allTubs.map(tub => {
      const { primaryImage } = ImageService.getCardImages(tub);
      return {
        item_id: tub.id,
        name: tub.name || 'Unknown',
        image_url: primaryImage || tub.image_url || '',
        tier: tierMap.get(tub.id) || 'UNRANKED'
      };
    });
  },

  /**
   * Synchronizes a single item's tier placement with the database.
   * Removes the database record entirely if the item is moved to the unranked pool.
   */
  async updateSingleItemTier(userId: string, itemId: string, tier: string) {
    if (tier === 'UNRANKED') {
      const { error } = await supabase.from('flavor_tier_lists')
        .delete()
        .eq('user_id', userId)
        .eq('item_id', itemId);
      
      if (error) throw error;
      return;
    }

    const { error } = await supabase.from('flavor_tier_lists').upsert(
      { 
        user_id: userId, 
        item_id: itemId, 
        tier: tier,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id, item_id' }
    );

    if (error) throw error;
  }
};