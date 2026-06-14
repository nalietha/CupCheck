// app/explore/page.tsx
import { supabase } from '@/lib/supabase';
import ProfileCard from '@/features/user/ProfileCard';

export default async function ExplorePage() {
  const { data: profiles } = await supabase
    .from('profiles')
    .select(`
      username,
      user_collection(count)
    `)
    .eq('is_public', true);

  // Check if no profiles exist
  if (!profiles || profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">No public vaults yet...</h2>
        <p className="text-gray-400 max-w-md">
          It looks like no one has made their collection public yet! 
          Check back later, or be the first to set your profile to public in your settings.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Explore Vaults</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {profiles.map((profile: any) => (
          <ProfileCard 
            key={profile.username} 
            username={profile.username} 
            itemCount={profile.user_collection[0]?.count || 0} 
          />
        ))}
      </div>
    </div>
  );
}