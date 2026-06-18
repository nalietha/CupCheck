// app/explore/page.tsx
import { supabase } from '@/lib/supabase';
import ExploreRow from './ExploreRow';
import ProfileCard from '@/features/user/ProfileCard';
import ArtistCard from '@/features/artists/ArtistCard';
import CreatorCard from '@/features/creators/CreatorCard';

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  // Fetch individually so one failure doesn't crash the others
  const profilesPromise = supabase
    .from('profiles')
    .select('username, display_name, user_collections(count)')
    .eq('is_public', true);

  const creatorsPromise = supabase
    .from('creators')
    .select('*')
    .eq('is_active', true);

  const artistsPromise = supabase
    .from('artists')
    .select('*');

  // Await them individually. If one fails, we set it to null or empty array
  const [profilesRes, creatorsRes, artistsRes] = await Promise.allSettled([
    profilesPromise,
    creatorsPromise,
    artistsPromise
  ]);

  // Safely extract data
  const profiles = profilesRes.status === 'fulfilled' ? profilesRes.value.data : [];
  const creators = creatorsRes.status === 'fulfilled' ? creatorsRes.value.data : [];
  const artists = artistsRes.status === 'fulfilled' ? artistsRes.value.data : [];

  // LOG ERRORS TO FIND WHICH ONE IS BREAKING
  if (profilesRes.status === 'rejected') console.error("Profiles Error:", profilesRes.reason);
  if (creatorsRes.status === 'rejected') console.error("Creators Error:", creatorsRes.reason);
  if (artistsRes.status === 'rejected') console.error("Artists Error:", artistsRes.reason);

  return (
    <div className="max-w-7xl mx-auto p-8 mt-6">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black italic tracking-widest text-vaporText drop-shadow-[0_0_15px_rgba(1,205,254,0.3)]">
          EXPLORE
        </h1>
        <p className="text-vaporMuted text-lg mt-2">
          Discover the community, legendary artists, and creators.
        </p>
      </header>

      {/* Creators Row */}
      <ExploreRow title="CREATORS">
        {creators?.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </ExploreRow>

      {/* Artists Row */}
      <ExploreRow title="ARTISTS">
        {artists?.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </ExploreRow>

      {/* Public Vaults Row */}
      <ExploreRow title="PUBLIC VAULTS">
        {profiles?.map((profile: any) => (
          <ProfileCard
            key={profile.username}
            username={profile.username}
            displayName={profile.display_name}
            itemCount={profile.user_collections?.[0]?.count || 0}
          />
        ))}
      </ExploreRow>
    </div>
  );
}