'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ExploreRow from './ExploreRow';
import ProfileCard from '@/features/user/ProfileCard';
import ArtistCard from '@/features/artists/ArtistCard';
import CreatorCard from '@/features/creators/CreatorCard';

export default function ExplorePage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'creators' | 'artists' | 'vaults'>('all');

  useEffect(() => {
    async function fetchExploreData() {
      const [profilesRes, creatorsRes, artistsRes] = await Promise.allSettled([
        supabase.from('profiles').select('username, display_name, user_collections(count)').eq('is_public', true),
        supabase.from('creators').select('*').eq('is_active', true),
        supabase.from('artists').select('*')
      ]);

      if (profilesRes.status === 'fulfilled') setProfiles(profilesRes.value.data || []);
      if (creatorsRes.status === 'fulfilled') setCreators(creatorsRes.value.data || []);
      if (artistsRes.status === 'fulfilled') setArtists(artistsRes.value.data || []);
      
      setLoading(false);
    }
    
    fetchExploreData();
  }, []);

  // Compute filtered datasets derived from state
  const searchLower = searchQuery.toLowerCase();

  const filteredCreators = creators.filter((c) =>
    c.name?.toLowerCase().includes(searchLower) ||
    c.gg_codes?.some((code: string) => code.toLowerCase().includes(searchLower))
  );

  const filteredArtists = artists.filter((a) =>
    a.name?.toLowerCase().includes(searchLower)
  );

  const filteredProfiles = profiles.filter((p) =>
    p.username?.toLowerCase().includes(searchLower) ||
    p.display_name?.toLowerCase().includes(searchLower)
  );

  return (
    <div className="max-w-7xl mx-auto p-8 mt-6 min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black italic tracking-widest text-vaporText drop-shadow-[0_0_15px_rgba(1,205,254,0.3)]">
          EXPLORE
        </h1>
        <p className="text-vaporMuted text-lg mt-2 mb-8">
          Discover the community, legendary artists, and creators.
        </p>

        {/* Global Search and Filter Nav */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Search by name, code, or vault..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 bg-[#0A0710] border-2 border-vaporBorder text-vaporText px-6 py-3 rounded-full focus:outline-none focus:border-vaporCyan focus:shadow-[0_0_15px_rgba(1,205,254,0.3)] transition-all placeholder-vaporMuted/50"
          />

          <div className="flex bg-[#0A0710] border border-vaporBorder rounded-full p-1 overflow-x-auto w-full md:w-auto">
            {(['all', 'creators', 'artists', 'vaults'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 md:flex-none px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                  activeFilter === filter
                    ? 'bg-vaporCyan text-black shadow-[0_0_10px_rgba(1,205,254,0.5)]'
                    : 'text-vaporMuted hover:text-vaporText hover:bg-vaporCard'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-vaporCyan"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Creators Row */}
          {(activeFilter === 'all' || activeFilter === 'creators') && filteredCreators.length > 0 && (
            <ExploreRow title="CREATORS">
              {filteredCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </ExploreRow>
          )}

          {/* Artists Row */}
          {(activeFilter === 'all' || activeFilter === 'artists') && filteredArtists.length > 0 && (
            <ExploreRow title="ARTISTS">
              {filteredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </ExploreRow>
          )}

          {/* Public Vaults Row */}
          {(activeFilter === 'all' || activeFilter === 'vaults') && filteredProfiles.length > 0 && (
            <ExploreRow title="PUBLIC VAULTS">
              {filteredProfiles.map((profile: any) => (
                <ProfileCard
                  key={profile.username}
                  username={profile.username}
                  displayName={profile.display_name}
                  itemCount={profile.user_collections?.[0]?.count || 0}
                />
              ))}
            </ExploreRow>
          )}

          {/* Empty State */}
          {filteredCreators.length === 0 &&
            filteredArtists.length === 0 &&
            filteredProfiles.length === 0 && (
              <div className="text-center py-20 text-vaporMuted border border-dashed border-vaporBorder rounded-xl bg-[#0A0710]/50">
                <p className="text-lg">No results found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="mt-4 text-vaporCyan hover:text-vaporPink transition-colors font-bold uppercase tracking-widest text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}