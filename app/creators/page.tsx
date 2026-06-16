import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AdminEntitySearch from '@/features/admin/AdminEntitySearch';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Creators | Admin',
};

// Next.js standard to ensure this page always fetches fresh data for the admin
export const revalidate = 0; 

export default async function CreatorsAdminPage() {
  // Fetch a quick list of recently added creators so the page isn't empty before searching
  const { data: recentCreators, error } = await supabase
    .from('creators')
    .select('id, name, is_active, is_nsfw')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 w-full">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-widest">
            Manage Creators
          </h1>
          <p className="text-gray-400 mt-2">
            Search, edit, or add new creators to the database.
          </p>
        </div>
        <Link 
          href="/admin/creators/new"
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
        >
          + Add New Creator
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: The Search Tool */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Quick Search</h2>
          {/* Using our DRY generic search component configured for creators */}
          <AdminEntitySearch 
            tableName="creators"
            searchColumn="name"
            baseRoute="/admin/creators" // Automatically routes to /admin/creators/[id]
            placeholder="Search creators by name..."
          />
        </div>

        {/* Right Column: Recent Activity Table */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Recently Added</h2>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-950 text-gray-300 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Tags</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {error ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-red-400">Failed to load creators.</td>
                  </tr>
                ) : !recentCreators || recentCreators.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No creators found in the database.</td>
                  </tr>
                ) : (
                  recentCreators.map((creator) => (
                    <tr key={creator.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{creator.name}</td>
                      <td className="px-6 py-4">
                        {creator.is_active ? (
                          <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">Active</span>
                        ) : (
                          <span className="text-gray-500 bg-gray-500/10 px-2 py-1 rounded text-xs">Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {creator.is_nsfw && (
                          <span className="text-pink-400 bg-pink-400/10 px-2 py-1 rounded text-xs font-bold border border-pink-500/20">NSFW</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/creators/${creator.id}`}
                          className="text-cyan-400 hover:text-cyan-300 font-bold underline decoration-cyan-400/30 underline-offset-4"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}