// lib/services/ProgressService.ts
import { supabase } from '@/lib/supabase';
import { getCustomizationLimit } from '@/lib/utils/tier';

export interface TrackerChoice {
  filter_type: 'item_type' | 'collection_id' | 'creator_id' | 'artist_id' | 'season';
  filter_value: string;
  filter_label: string; 
}

export const ProgressService = {
  async getUserTrackers(userId: string) {
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('subscription_tier, vault_trackers')
      .eq('id', userId)
      .single();

    if (profileErr || !profile) throw new Error('Profile not found');

    const limit = getCustomizationLimit(profile.subscription_tier);
    const trackers: TrackerChoice[] = (profile.vault_trackers || []).slice(0, limit);

    const results = await Promise.all(trackers.map(async (tracker) => {
      let totalCount = 0;
      let validItemIds: string[] = [];
      
      // Identifies the pool of valid item IDs depending on the selected relational filter
      if (tracker.filter_type === 'creator_id') {
        const { data } = await supabase.from('item_creators').select('item_id').eq('creator_id', tracker.filter_value);
        validItemIds = data?.map(d => d.item_id) || [];
        totalCount = validItemIds.length;
      } else if (tracker.filter_type === 'artist_id') {
        const { data } = await supabase.from('item_artist').select('item_id').eq('artist_id', tracker.filter_value);
        validItemIds = data?.map(d => d.item_id) || [];
        totalCount = validItemIds.length;
      } else {
        const { data } = await supabase.from('items').select('id').eq(tracker.filter_type, tracker.filter_value);
        validItemIds = data?.map(d => d.id) || [];
        totalCount = validItemIds.length;
      }

      // Evaluates the user's vault against the validated item pool
      let owned = 0;
      if (validItemIds.length > 0) {
        const { data: userItems } = await supabase
          .from('user_collections')
          .select('item_id')
          .eq('user_id', userId)
          .in('item_id', validItemIds);
          
        const uniqueOwned = new Set(userItems?.map(record => record.item_id));
        owned = uniqueOwned.size;
      }

      const percentage = totalCount === 0 ? 0 : Math.round((owned / totalCount) * 100);

      return {
        ...tracker,
        owned,
        total: totalCount,
        percentage
      };
    }));

    return results;
  }
};