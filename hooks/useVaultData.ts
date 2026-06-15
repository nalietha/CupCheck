// Retreive the data for the users vault

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { VaultItem, Profile } from '@/types'; // Move your interfaces to your types file

export function useVaultData(vaultOwner: string) {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVault = async () => {
      setLoading(true);
      let fetchedProfile: Profile | null = null;

      // 1. Fetch Profile
      if (vaultOwner.toLowerCase() === 'me') {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const { data } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
          fetchedProfile = data;
        }
      } else {
        const { data } = await supabase.from('profiles').select('*').ilike('username', vaultOwner).single();
        fetchedProfile = data;
      }

      if (!fetchedProfile) {
        setLoading(false);
        return;
      }
      setProfile(fetchedProfile);

      // 2. Fetch & Group Collection
      const { data: collectionData } = await supabase
        .from('user_collections')
        .select(`
                id, 
                added_at, 
                is_favorite, 
                items (
                    *,
                    item_images (
                    id,
                    image_url,
                    display_order
                    )
                )
                `)
        .eq('user_id', fetchedProfile.id);

      if (collectionData) {
        const groupedItemsMap = collectionData.reduce((acc: Record<string, VaultItem>, row: any) => {
          const item = row.items;
          if (!item) return acc; 
          
          if (acc[item.id]) {
            acc[item.id].quantity += 1;
            if (row.is_favorite) acc[item.id].is_favorite = true;
          } else {
            acc[item.id] = { ...item, quantity: 1, added_at: row.added_at, is_favorite: row.is_favorite };
          }
          return acc;
        }, {});
        setVaultItems(Object.values(groupedItemsMap));
      }
      setLoading(false);
    };

    fetchVault();
  }, [vaultOwner]);

  return { profile, vaultItems, loading };
}