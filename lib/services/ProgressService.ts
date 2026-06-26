// lib/services/ProgressService.ts
import { supabase } from '@/lib/supabase';
import { getCustomizationLimit } from '@/lib/utils/tier';

export interface TrackerChoice {
  filter_type: 'season' | 'collection_id' | 'creator' | 'item_type';
  filter_value: string;
}

export const ProgressService = {
  /**
   * Calculates completion percentages for a user's chosen trackers.
   * Enforces the 2 (free) or 5 (paid) limit based on their profile tier.
   */
  async getUserTrackers(userId: string) {
    // 1. Fetch user profile for tier and tracker selections
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('subscription_tier, vault_trackers')
      .eq('id', userId)
      .single();

    if (profileErr || !profile) throw new Error('Profile not found');

    const limit = getCustomizationLimit(profile.subscription_tier);
    const trackers: TrackerChoice[] = (profile.vault_trackers || []).slice(0, limit);

    // 2. Calculate progress for each valid tracker
    const results = await Promise.all(trackers.map(async (tracker) => {
      
      // Determines total items existing in the database for this category
      const { count: totalCount } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq(tracker.filter_type, tracker.filter_value);

      // Fetch the items the user owns matching this criteria using an !inner join
      const { data: userItems } = await supabase
        .from('user_collections')
        .select('item_id, items!inner(id)')
        .eq('user_id', userId)
        .eq(`items.${tracker.filter_type}`, tracker.filter_value);

      const total = totalCount || 0;
      
      // We use a Set to find the UNIQUE items owned, ignoring duplicates (quantity > 1)
      const uniqueOwned = new Set(userItems?.map(record => record.item_id));
      const owned = uniqueOwned.size;
      
      const percentage = total === 0 ? 0 : Math.round((owned / total) * 100);

      return {
        ...tracker,
        owned,
        total,
        percentage
      };
    }));

    return results;
  }
};