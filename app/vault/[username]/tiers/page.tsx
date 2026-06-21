import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import TierListManager from '@/features/vault/TierListManager';
import { TierListService } from '@/lib/services/TierListService';
import Link from 'next/link';

export default async function FlavorTierListPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = decodeURIComponent(resolvedParams.username);

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, is_public')
    .ilike('username', username)
    .single();

  if (!profile) return notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === profile.id;

  if (!isOwner && !profile.is_public) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-vaporText">
        <h1 className="text-2xl font-bold mb-2">Private Vault</h1>
        <p className="text-vaporMuted mb-6">This user's tier list is set to private.</p>
      </div>
    );
  }

  // Delegate data aggregation to the dedicated service
  const tierListItems = await TierListService.getUserTierList(profile.id);

  return (
    <div className="min-h-screen bg-vaporBg pb-20 pt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
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