import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

  // Fetch users, filtering by username if a search query exists
  let dbQuery = supabase.from('profiles').select('*').order('created_at', { ascending: false });
  
  if (query) {
    dbQuery = dbQuery.ilike('username', `%${query}%`);
  }

  const { data: users, error } = await dbQuery;

  return (
    <div className="container mx-auto p-6 text-vaporText">
      <h1 className="text-3xl font-bold mb-6 text-vaporPink vapor-text">User Management</h1>
      
      {/* Search Bar could go here (similar to your item search) */}

      <div className="bg-vaporCard border border-pink-500 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-vaporCard text-pink-400">
            <tr>
              <th className="p-4">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-t border-vaporBorder hover:bg-vaporCard/50">
                <td className="p-4">{user.username}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-pink-500/20 text-pink-400' : 'bg-gray-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  <Link href={`/admin/users/${user.username}`} className="text-blue-400 hover:text-blue-300 underline">
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