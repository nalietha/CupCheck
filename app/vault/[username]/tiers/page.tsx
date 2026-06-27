// app/vault/[username]/tiers/page.tsx
'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import TierListManager from '@/features/vault/TierListManager';
import { TierListService, TierListItem } from '@/lib/services/TierListService';
import Link from 'next/link';

export default function FlavorTierListPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const username = decodeURIComponent(resolvedParams.username);

  const [profile, setProfile] = useState<any>(null);
  const [tierListItems, setTierListItems] = useState<TierListItem[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadTierList() {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, username, display_name, is_public')
          .ilike('username', username)
          .single();

        if (!profileData) {
          setError(true);
          setLoading(false);
          return;
        }

        setProfile(profileData);

        const { data: { user } } = await supabase.auth.getUser();
        let userIsAdmin = false;
        
        if (user) {
          const userIsOwner = user.id === profileData.id;
          setIsOwner(userIsOwner);
          
          const { data: currentUserProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          userIsAdmin = currentUserProfile?.role === 'admin';
          setIsAdmin(userIsAdmin);
        }

        // Only fetch if they are the owner, an admin, OR if the profile is public
        if (user?.id === profileData.id || profileData.is_public || userIsAdmin) {
          const items = await TierListService.getUserTierList(profileData.id);
          setTierListItems(items);
        }
      } catch (err) {
        console.error("Error loading tier list:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadTierList();
  }, [username]);

  if (loading) return <div className="min-h-screen bg-vaporBg text-vaporText flex items-center justify-center">Loading Flavor Tiers...</div>;
  if (error || !profile) return <div className="min-h-screen bg-vaporBg text-vaporText flex items-center justify-center">User not found.</div>;

  if (!isOwner && !profile.is_public && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-vaporText">
        <h1 className="text-2xl font-bold mb-2">Private Vault</h1>
        <p className="text-vaporMuted mb-6">This user's tier list is set to private.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vaporBg pb-20 pt-12">
      {/* Admin Override Warning Banner */}
      {!profile.is_public && isAdmin && !isOwner && (
        <div className="absolute top-0 w-full bg-red-900/80 text-white text-center text-xs font-bold py-2 uppercase tracking-widest border-b border-red-500 z-50">
          Viewing Private Vault (Admin Override)
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="mb-8">
          <Link href={`/vault/${profile.username}`} className="text-sm text-vaporCyan hover:underline font-bold uppercase tracking-wider">
            &larr; Back to Vault
          </Link>
          <div className="mt-4">
            <h1 className="text-4xl md:text-5xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink drop-shadow-[0_0_10px_rgba(1,205,254,0.3)]">
              {profile.display_name || profile.username}'s Flavor Tiers
            </h1>
            <p className="text-vaporMuted mt-2">
              {isOwner ? 'Drag and drop your tubs to rank them.' : 'Check out how they rank the flavors.'}
            </p>
          </div>
        </div>

        <TierListManager 
          initialItems={tierListItems} 
          isOwner={isOwner} 
          userId={profile.id} 
        />
        
      </div>
    </div>
  );
}