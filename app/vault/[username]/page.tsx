'use client';
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Item } from '@/types';

interface VaultItem extends Item {
  quantity: number;
}

export default function VaultPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const vaultOwner = decodeURIComponent(resolvedParams.username);

  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: State to hold the actual username so the Header doesn't say "me's Vault"
  const [realUsername, setRealUsername] = useState(vaultOwner);

  useEffect(() => {
    const fetchVault = async () => {
      setLoading(true);

      let profileIdToFetch = null;
      let displayUsername = vaultOwner;

      // 1. INTERCEPTOR: If the URL is /vault/me, fetch the logged-in user instead
      if (vaultOwner.toLowerCase() === 'me') {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authData.user) {
          console.error("User is not logged in!");
          setLoading(false);
          return; // You could optionally redirect to /login here
        }

        // Now fetch their real profile using their auth ID
        const { data: myProfile } = await supabase
          .from('profiles')
          .select('id, username, is_public')
          .eq('id', authData.user.id)
          .single();

        if (myProfile) {
          profileIdToFetch = myProfile.id;
          displayUsername = myProfile.username;
        }
      } else {
        // 2. NORMAL SEARCH: If it's a normal username, search like we did before
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, is_public')
          .ilike('username', vaultOwner) 
          .single();

        if (profileData) {
          profileIdToFetch = profileData.id;
          displayUsername = profileData.username;
        }
      }

      // If neither method found a profile, bail out
      if (!profileIdToFetch) {
        console.error("Profile not found");
        setLoading(false);
        return;
      }

      // Update the header text to show the real name
      setRealUsername(displayUsername);

      // 3. FETCH THE VAULT using the guaranteed correct profile ID
      const { data: collectionData, error: collectionError } = await supabase
        .from('user_collections')
        .select(`
          id,
          added_at,
          items (
            id,
            name,
            item_type,
            image_url,
            description,
            retail_price
          )
        `)
        .eq('user_id', profileIdToFetch);

      if (collectionError) {
        console.error("Error fetching collection:", collectionError);
      } else if (collectionData) {
        const groupedItemsMap = collectionData.reduce((acc: Record<string, VaultItem>, row: any) => {
          const item = row.items;
          if (!item) return acc; 

          if (acc[item.id]) {
            acc[item.id].quantity += 1;
          } else {
            acc[item.id] = { ...item, quantity: 1 };
          }
          return acc;
        }, {});

        setVaultItems(Object.values(groupedItemsMap));
      }

      setLoading(false);
    };

    fetchVault();
  }, [vaultOwner]);

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Updated to use realUsername instead of vaultOwner */}
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-8">
        {realUsername}'s Vault
      </h1>

      {loading ? (
        <p className="text-cyan-400 animate-pulse font-bold">Decrypting Vault...</p>
      ) : vaultItems.length === 0 ? (
        <p className="text-gray-500">This vault is completely empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {vaultItems.map((item) => (
            <div key={item.id} className="relative bg-gray-900 border border-pink-500/20 p-4 rounded-xl hover:border-cyan-400 transition-colors mt-4">
              
              {item.quantity > 1 && (
                <div className="absolute -top-3 -right-3 bg-pink-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold border-2 border-gray-950 z-10 shadow-[0_0_10px_rgba(219,39,119,0.8)]">
                  x{item.quantity}
                </div>
              )}

              <div className="w-full h-48 bg-gray-800 rounded-lg mb-4 flex items-center justify-center text-gray-600">
                {item.image_url ? (
                    <img 
                        src={item.image_url.startsWith('http') ? item.image_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-images/${item.image_url}`} 
                        alt={item.name} 
                        className="w-full h-48 object-contain rounded-lg mb-4"
                    />
                    ) : (
                    <div className="w-full h-48 bg-gray-800 rounded-lg mb-4 flex items-center justify-center text-gray-600">
                        No Image
                    </div>
                    )}
              </div>
              <h3 className="text-white font-bold truncate">{item.name}</h3>
              <p className="text-cyan-400 text-sm capitalize">{item.item_type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}