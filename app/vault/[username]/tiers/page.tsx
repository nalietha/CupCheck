import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import TierListManager from '@/features/vault/TierListManager';
import Link from 'next/link';

export default async function FlavorTierListPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = decodeURIComponent(resolvedParams.username);

  // 1. Fetch Profile to get their ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, is_public')
    .ilike('username', username)
    .single();

  if (!profile) return notFound();

  // Check auth to see if the current viewer is the owner
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === profile.id;

  // Protect private vaults
  if (!isOwner && !profile.is_public) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-vaporText">
        <h1 className="text-2xl font-bold mb-2">Private Vault</h1>
        <p className="text-vaporMuted mb-6">This user's tier list is set to private.</p>
      </div>
    );
  }

  // 2. Fetch all Tubs from the database
  const { data: allTubs } = await supabase
    .from('items')
    .select('id, name, image_url')
    .eq('item_type', 'tub');

  // 3. Fetch the user's saved tier rankings
  const { data: userTiers } = await supabase
    .from('flavor_tier_lists')
    .select('item_id, tier')
    .eq('user_id', profile.id);

  // 4. Merge them together
  const mergedItems = (allTubs || []).map((tub) => {
    const ranking = userTiers?.find((t) => t.item_id === tub.id);
    return {
      id: tub.id,
      name: tub.name || 'Unknown Tub',
      image_url: tub.image_url || '',
      tier: ranking ? ranking.tier : 'unranked',
    };
  });

  return (
    <div className="min-h-screen bg-vaporBg pb-20 pt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Navigation & Header */}
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

        {/* The Drag and Drop Area */}
        <TierListManager 
          initialItems={mergedItems} 
          isOwner={isOwner} 
          userId={profile.id} 
        />

      </div>
    </div>
  );
}