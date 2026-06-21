import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AdminArtistList from '@/features/admin/AdminArtistList';
import AdminEntitySearch from '@/features/admin/AdminEntitySearch';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Artists | Admin',
};

// Ensure the admin always sees the absolute latest data
export const revalidate = 0;

export default async function AdminArtistsPage() {
  const { data: artists, error } = await supabase
    .from('artists')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching artists for admin:', error);
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 w-full">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-vaporBorder pb-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink drop-shadow-[0_0_10px_rgba(1,205,254,0.3)] uppercase">
            Artist Database
          </h1>
          <p className="text-vaporMuted mt-2">
            Search, modify, or initialize artist profiles.
          </p>
        </div>
        <Link
          href="/admin/artists/new"
          className="px-6 py-3 bg-vaporCyan/10 border border-vaporCyan text-vaporCyan hover:bg-vaporCyan hover:text-black font-black uppercase tracking-widest rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(1,205,254,0.2)] hover:shadow-[0_0_25px_rgba(1,205,254,0.6)] text-center flex-shrink-0"
        >
          + Initialize New
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Search Tool */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-vaporText mb-4 uppercase tracking-wider">Quick Search</h2>
          <AdminEntitySearch
            tableName="artists"
            searchColumn="name"
            baseRoute="/admin/artists/edit"
            placeholder="Search artists by name..."
          />
        </div>

        {/* Right Column: Artist Directory */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-vaporText mb-4 uppercase tracking-wider">Directory</h2>
          <AdminArtistList artists={artists || []} />
        </div>
      </div>
    </div>
  );
}