'use client';

import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import VaultHeader from '@/features/vault/VaultHeader';
import ItemCard from '@/features/items/ItemCard';
import { useWishlistData } from '@/hooks/useWishlistData';
import VaultNavBar from '@/features/vault/VaultNavBar';

export default function WishlistPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const vaultOwner = decodeURIComponent(resolvedParams.username);

  const { profile, wishlistItems, loading } = useWishlistData(vaultOwner);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkOwnershipAndRole() {
      if (profile) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setIsOwner(user.id === profile.id);
          const { data: currentUserProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          setIsAdmin(currentUserProfile?.role === 'admin');
        }
      }
    }
    checkOwnershipAndRole();
  }, [profile]);

  if (loading) return <div className="min-h-screen bg-vaporBg text-vaporText flex items-center justify-center">Loading Data...</div>;
  if (!profile) return <div className="min-h-screen bg-vaporBg text-vaporText flex items-center justify-center">User not found.</div>;

  if (!profile.is_public && !isOwner && !isAdmin) {
    return (
      <div className="min-h-screen bg-vaporBg text-vaporText flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-black italic text-vaporCyan mb-4 tracking-widest">PRIVATE VAULT</h2>
        <p className="text-vaporMuted mb-6">This collector has set their vault to private.</p>
        <Link href="/explore" className="bg-transparent border-2 border-vaporPink text-vaporPink hover:bg-vaporPink hover:text-[#0B0914] font-bold px-6 py-2 rounded transition-all shadow-[0_0_10px_rgba(255,113,206,0.3)]">
          RETURN TO EXPLORE
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vaporBg pb-20">
      
      {!profile.is_public && isAdmin && !isOwner && (
        <div className="bg-red-900/80 text-white text-center text-xs font-bold py-2 uppercase tracking-widest border-b border-red-500">
          Viewing Private Vault (Admin Override)
        </div>
      )}

      <VaultHeader
        username={profile.display_name || profile.username}
        uniqueCount={wishlistItems.length}
        dateStarted={profile.started_collecting || profile.created_at} 
        bannerUrl={profile.banner_url}
      />

      <VaultNavBar username={profile.username} />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {wishlistItems.map((item) => (
              <ItemCard key={item.wishlist_record_id} item={item} showAddButton={isOwner} />
            ))}
          </div>
        ) : (
          <div className="w-full py-12 text-center border border-vaporBorder border-dashed rounded-xl bg-vaporCard/20">
            <p className="text-vaporMuted font-mono text-sm">No targets currently designated.</p>
          </div>
        )}
      </div>
    </div>
  );
}