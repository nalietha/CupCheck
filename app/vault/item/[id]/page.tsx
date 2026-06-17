'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import VaultItemDetails from '@/features/vault/VaultItemDetails';
import Link from 'next/link';

export default function SpecificVaultItemPage({ params }: { params: Promise<{ id: string }> }) {
  const [vaultItem, setVaultItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  // 1. Unwrap the Next.js 15 Promise params
  useEffect(() => {
    params.then(p => setResolvedId(p.id));
  }, [params]);

  // 2. Fetch data client-side where Auth is available
  useEffect(() => {
    if (!resolvedId) return;

    async function fetchData() {
      // Get the currently logged-in user
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch the record using .maybeSingle() to prevent the PGRST116 crash!
      const { data, error } = await supabase
        .from('user_collections')
        .select(`
          *,
          item:items ( id, name, description, image_url, collection:collections ( name ) )
        `)
        .eq('id', resolvedId)
        .maybeSingle();

      if (error) {
        console.error("Supabase Error:", error);
      }

      if (data) {
        // Flatten the collection name
        const itemData = {
          ...data.item,
          collection_name: Array.isArray(data.item.collection) 
            ? data.item.collection[0]?.name 
            : data.item.collection?.name
        };
        
        // Check if the current user owns this record
        const isUserOwner = user && user.id === data.user_id;
        setIsOwner(!!isUserOwner);

        // Fetch profile privacy separately to avoid Foreign Key issues
        let isPublic = false;
        if (!isUserOwner && data.user_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('is_public')
            .eq('id', data.user_id)
            .maybeSingle();
          isPublic = profileData?.is_public || false;
        }

        setVaultItem({ 
          ...data, 
          item: itemData,
          profile: { is_public: isPublic }
        });
      }
      setLoading(false);
    }

    fetchData();
  }, [resolvedId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!vaultItem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Item not found</h1>
        <p className="text-gray-500 mb-6">This item may not exist, or the user's vault is private.</p>
        <Link href="/vault/me" className="text-blue-600 hover:underline font-medium">
          Return to My Vault
        </Link>
      </div>
    );
  }

  if (!isOwner && !vaultItem.profile?.is_public) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Private Vault</h1>
        <p className="text-gray-500 mb-6">This user's vault is set to private.</p>
        <Link href="/explore" className="text-blue-600 hover:underline">Go to Explore</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link 
          href={`/vault/${isOwner ? 'me' : 'user'}`} 
          className="text-sm text-blue-600 hover:underline flex items-center gap-1 w-fit"
        >
          &larr; Back to {isOwner ? 'My Vault' : `Vault`}
        </Link>
      </div>

      <VaultItemDetails vaultItem={vaultItem} isOwner={isOwner} />
    </div>
  );
}