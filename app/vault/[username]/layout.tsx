import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

type Props = {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const username = decodeURIComponent(resolvedParams.username);

  // Fetch the basic stats needed for the OG card
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name')
    .ilike('username', username)
    .single();

  let itemCount = 0;
  if (profile) {
    const { count } = await supabase
      .from('user_collections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id);
      
    itemCount = count || 0;
  }

  const displayName = profile?.display_name || username;
  
  // Define the absolute URL for the OG image generation endpoint
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cupcheck.cc';
  const ogImageUrl = `${baseUrl}/api/og/vault?user=${encodeURIComponent(displayName)}&count=${itemCount}`;

  return {
    title: `${displayName}'s Vault | CupCheck`,
    description: `Check out ${displayName}'s collection of ${itemCount} items in the vault.`,
    openGraph: {
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${displayName}'s Vault Stats`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImageUrl],
    },
  };
}

// This layout simply wraps your existing page.tsx
export default function VaultLayout({ children }: Props) {
  return <>{children}</>;
}