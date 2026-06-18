import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AdminUserForm from '@/features/admin/AdminUserForm';

type Props = {
  params: Promise<{ username: string }>;
};

export default async function ManageUserPage(props: Props) {
  const resolvedParams = await props.params;
  const username = resolvedParams.username;

  // 1. Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (profileError || !profile) return notFound();

  // 2. Fetch User's Items (Vault)
  const { data: collection } = await supabase
    .from('user_collections')
    .select(`
      id,
      added_at,
      items ( name, image_url )
    `)
    .eq('user_id', profile.id);

  return (
    <div className="container mx-auto p-6 text-vaporText max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Managing: <span className="text-vaporCyan">{profile.username}</span></h1>
      
      {/* User Status & Role Form */}
      <AdminUserForm profile={profile} />

      {/* Account Items Management */}
      <div className="bg-vaporCard border border-vaporBorder p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-vaporCyan">Account Items (Vault)</h2>
        {collection && collection.length > 0 ? (
          <ul className="divide-y divide-gray-800">
            {collection.map((entry: any) => (
              <li key={entry.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src={entry.items.image_url} alt="cup" className="w-10 h-10 rounded object-cover" />
                  <span>{entry.items.name}</span>
                </div>
                
                {/* TODO: Create a client component button here to delete this 
                  specific entry from `user_collections` if the admin needs 
                  to forcefully remove an item from a user's vault.
                */}
                <button className="text-red-400 hover:text-red-300 text-sm">
                  Remove Item
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">This user has no items in their vault.</p>
        )}
      </div>
    </div>
  );
}