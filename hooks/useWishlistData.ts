import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types'; 

export function useWishlistData(vaultOwner: string) {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      let fetchedProfile: Profile | null = null;

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

      const { data: wishlistData } = await supabase
        .from('user_wishlists')
        .select(`
          id, 
          added_at, 
          priority,
          items (
            *,
            item_images (
              id,
              image_url,
              display_order
            )
          )
        `)
        .eq('user_id', fetchedProfile.id)
        .order('added_at', { ascending: false });

      if (wishlistData) {
        const extractedItems = wishlistData.map(row => ({
          ...row.items,
          wishlist_record_id: row.id,
          added_at: row.added_at,
          priority: row.priority
        }));
        setWishlistItems(extractedItems);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [vaultOwner]);

  return { profile, wishlistItems, loading };
}