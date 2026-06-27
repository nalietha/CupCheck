import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import UserSearch from './UserSearch';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const role = resolvedParams.role || 'all';
  const status = resolvedParams.status || 'all';

  let dbQuery = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (query) {
    dbQuery = dbQuery.ilike('username', `%${query}%`);
  }
  if (role !== 'all') {
    dbQuery = dbQuery.eq('role', role);
  }
  if (status !== 'all') {
    dbQuery = dbQuery.eq('status', status);
  }

  const { data: users, error } = await dbQuery;

  return (
    <div className="container mx-auto py-8 px-4 text-vaporText max-w-6xl">
      <div className="mb-8 border-b border-vaporBorder pb-6">
        <h1 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink uppercase">
          User Management
        </h1>
        <p className="text-vaporMuted mt-2">Search, filter, and oversee registered accounts.</p>
      </div>
      
      <UserSearch />

      <div className="bg-vaporCard border border-vaporBorder rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-vaporBg text-gray-300 uppercase tracking-wider">
            <tr>
              <th className="p-4 font-medium">Username</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Joined</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {error && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-red-400">Error retrieving users.</td>
              </tr>
            )}
            {!error && users?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-vaporMuted">No users match your criteria.</td>
              </tr>
            )}
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-vaporCard/50 transition-colors">
                <td className="p-4 font-bold text-vaporText">{user.username}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-gray-800 text-gray-300'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    user.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                    user.status === 'banned' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {user.status || 'active'}
                  </span>
                </td>
                <td className="p-4 text-vaporMuted">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right space-x-4">
                  <Link href={`/vault/${user.username}`} className="text-vaporMuted hover:text-vaporCyan font-bold uppercase tracking-wider text-xs">
                    Vault
                  </Link>
                  <Link href={`/admin/users/${user.username}`} className="text-vaporCyan hover:text-cyan-300 font-bold uppercase tracking-wider text-xs">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}