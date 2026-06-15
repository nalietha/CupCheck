'use client';
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Item } from '@/types';
import VaultHeader from '@/components/VaultHeader';
import DisplayShelf from '@/components/DisplayShelf';

// 1. Extend your VaultItem interface to handle the new derived data
interface VaultItem extends Item {
  quantity: number;
  added_at: string;
  is_favorite?: boolean;
}

interface Profile {
  id: string;
  username: string;
  created_at: string;
  banner_url?: string;
  is_public: boolean;
}

export default function VaultPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const vaultOwner = decodeURIComponent(resolvedParams.username);

  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null); // Added Profile State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVault = async () => {
      setLoading(true);

      let fetchedProfile: Profile | null = null;

      // 1. INTERCEPTOR: If the URL is /vault/me, fetch the logged-in user instead
      if (vaultOwner.toLowerCase() === 'me') {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authData.user) {
          console.error("User is not logged in!");
          setLoading(false);
          return;
        }

        // Now fetch their real profile using their auth ID (added created_at & banner_url)
        const { data: myProfile } = await supabase
          .from('profiles')
          .select('id, username, is_public, created_at, banner_url')
          .eq('id', authData.user.id)
          .single();

        if (myProfile) fetchedProfile = myProfile;

      } else {
        // 2. NORMAL SEARCH: If it's a normal username, search like we did before
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, is_public, created_at, banner_url')
          .ilike('username', vaultOwner) 
          .single();

        if (profileData) fetchedProfile = profileData;
      }

      // If neither method found a profile, bail out
      if (!fetchedProfile) {
        console.error("Profile not found");
        setLoading(false);
        return;
      }

      // Update the profile state for the Header
      setProfile(fetchedProfile);

      // 3. FETCH THE VAULT using the guaranteed correct profile ID
      const { data: collectionData, error: collectionError } = await supabase
        .from('user_collections')
        .select(`
          id,
          added_at,
          is_favorite, 
          items (
            id,
            name,
            item_type,
            image_url,
            description,
            retail_price
          )
        `)
        .eq('user_id', fetchedProfile.id);

      if (collectionError) {
        console.error("Error fetching collection:", collectionError);
      } else if (collectionData) {
        
        // Group the items but retain added_at and is_favorite
        const groupedItemsMap = collectionData.reduce((acc: Record<string, VaultItem>, row: any) => {
          const item = row.items;
          if (!item) return acc; 

          if (acc[item.id]) {
            acc[item.id].quantity += 1;
            // If they favorited a duplicate, ensure the grouped item shows as favorited
            if (row.is_favorite) acc[item.id].is_favorite = true;
          } else {
            acc[item.id] = { 
              ...item, 
              quantity: 1, 
              added_at: row.added_at, 
              is_favorite: row.is_favorite 
            };
          }
          return acc;
        }, {});

        setVaultItems(Object.values(groupedItemsMap));
      }

      setLoading(false);
    };

    fetchVault();
  }, [vaultOwner]);

  // Handle Loading & Null states to prevent crashing
  if (loading) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading Vault...</div>;
  if (!profile) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Vault not found.</div>;

  // 4. DERIVE ARRAYS FOR SHELVES
  // Assumes `is_favorite` exists on the user_collections table
  const favorites = vaultItems.filter(item => item.is_favorite);
  
  // Sort items by the preserved added_at date (descending)
  const newestItems = [...vaultItems].sort((a, b) => 
    new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <VaultHeader 
        username={profile.username}
        uniqueCount={vaultItems.length}
        dateStarted={profile.created_at}
        bannerUrl={profile.banner_url} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Favorites Shelf */}
        <DisplayShelf 
          title="Favorites ✨" 
          items={favorites} 
          emptyMessage="No favorites selected yet." 
        />

        {/* Dynamic / Custom Shelves */}
        <DisplayShelf 
          title="Newest Additions" 
          items={newestItems.slice(0, 5)} 
        />
      </div>
    </div>
  );
}