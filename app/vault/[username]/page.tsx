import { supabase } from '../../../lib/supabase'; // Adjust path if needed
import Link from 'next/link';

// Next.js passes the URL parameters into the component automatically
export default async function UserVault({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  // 2. Await the promise to unwrap the 'username'
  const { username } = await params;

  // 3. The rest of your code remains exactly the same!
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('username', username)
    .single();
    
  // Handle if the user doesn't exist
  if (!profile || profileError) {
    return (
      <div className="min-h-screen bg-vaporBg text-vaporText flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black italic text-vaporPink mb-4">404: VAULT NOT FOUND</h1>
        <p className="text-vaporMuted mb-8">This user does not exist in the mainframe.</p>
        <Link href="/" className="text-vaporCyan hover:text-white border-2 border-vaporCyan px-6 py-2 rounded transition-all">
          RETURN HOME
        </Link>
      </div>
    );
  }

  // Handle if the profile is private
  if (!profile.is_public) {
    return (
      <div className="min-h-screen bg-vaporBg text-vaporText flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black italic text-vaporPurple mb-4">VAULT CLASSIFIED</h1>
        <p className="text-vaporMuted mb-8">@{username} has set their collection to private.</p>
        <Link href="/" className="text-vaporCyan hover:text-white border-2 border-vaporCyan px-6 py-2 rounded transition-all">
          RETURN HOME
        </Link>
      </div>
    );
  }

  // 2. Fetch the cups this user owns
  // NOTE: This assumes you have a many-to-many junction table called 'user_items' 
  // that links 'profile_id' to 'item_id'
  const { data: userItems, error: itemsError } = await supabase
    .from('user_items')
    .select(`
      items (*)
    `)
    .eq('profile_id', profile.id);

  // Extract just the item data from the nested Supabase response
  const cups = userItems?.map(ui => ui.items).flat() || [];

  return (
    <div className="min-h-screen bg-vaporBg text-vaporText font-sans pb-12">

      {/* Navigation Bar */}
      <nav className="border-b border-vaporBorder bg-[#0B0914]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-vaporCyan flex items-center justify-center text-black font-black italic shadow-[0_0_10px_rgba(1,205,254,0.5)]">
              CC
            </div>
            <span className="font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink hidden sm:block">
              CUPCHECK
            </span>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-8">

        {/* Profile Header */}
        <header className="mb-12 border-b border-vaporBorder pb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-vaporPink bg-[#0A0710] shadow-[0_0_20px_rgba(255,113,206,0.4)] flex items-center justify-center">
              <span className="text-4xl text-vaporPink font-black italic">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-widest text-vaporCyan drop-shadow-[0_0_10px_rgba(1,205,254,0.3)]">
                @{username.toUpperCase()}
              </h1>
              <p className="text-vaporMuted text-lg mt-2">
                Total Cups: <span className="text-white font-bold">{cups.length}</span>
              </p>
            </div>
          </div>
        </header>

        {/* The User's Cup Grid */}
        {cups.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-vaporBorder rounded-xl bg-[#0A0710]">
            <p className="text-vaporMuted text-xl">This vault is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cups.map((cup) => (
              <div key={cup.id} className="bg-vaporCard rounded-xl overflow-hidden border border-vaporBorder shadow-lg hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(1,205,254,0.2)] transition-all duration-300 flex flex-col opacity-90 hover:opacity-100">

                {/* Image Container */}
                <div className="h-64 bg-[#0A0710] flex items-center justify-center p-4 relative group">
                  {cup.image_url ? (
                    <img
                      src={cup.image_url}
                      alt={cup.name}
                      className="object-contain h-full w-full drop-shadow-[0_0_15px_rgba(1,205,254,0.1)] group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-vaporBorder font-medium tracking-widest text-sm">NO IMAGE</span>
                  )}

                  {cup.limited && (
                    <span className="absolute top-3 right-3 bg-[#0B0914] text-vaporPink border border-vaporPink text-xs font-bold px-3 py-1 rounded shadow-[0_0_10px_rgba(255,113,206,0.3)]">
                      LIMITED
                    </span>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-xl text-vaporCyan mb-1">{cup.name}</h3>
                    <p className="text-sm text-vaporMuted capitalize">{cup.item_type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}