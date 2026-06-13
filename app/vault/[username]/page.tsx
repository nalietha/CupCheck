'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';

// Define the shape of our data
type VaultItem = {
    id: string;
    acquired_at: string;
    creator_code: string | null;
    item: {
        id: string;
        name: string;
        image_url: string;
        item_type: string;
    };
};

export default function VaultPage() {
    const params = useParams();
    const router = useRouter();
    // Next.js params can sometimes be an array, so we ensure it's a string
    const usernameParam = Array.isArray(params.username) ? params.username[0] : params.username;

    const [loading, setLoading] = useState(true);
    const [collection, setCollection] = useState<VaultItem[]>([]);
    const [profiles, setProfile] = useState<{ id: string, username: string } | null>(null);

    useEffect(() => {
        const fetchVault = async () => {
            setLoading(true);
            let targetUserId = null;

            // SCENARIO 1: The user clicked "My Vault" in the NavBar
            if (usernameParam === 'me') {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login'); // Kick them to login if not authenticated
                    return;
                }
                targetUserId = user.id;
                
                // Get their username for the header
                const { data: userProfile } = await supabase
                    .from('profiles')
                    .select('id, username')
                    .eq('id', user.id)
                    .single();
                setProfile(userProfile);
            } 
            // SCENARIO 2: Viewing someone else's vault (e.g., /vault/schlattFan99)
            else {
                const { data: targetProfile } = await supabase
                    .from('profiles')
                    .select('id, username')
                    .eq('username', usernameParam)
                    .single();

                if (!targetProfile) {
                    setLoading(false);
                    return; // Profile not found
                }
                targetUserId = targetProfile.id;
                setProfile(targetProfile);
            }

            // Fetch the items inside the vault!
            if (targetUserId) {
                const { data: vaultData, error } = await supabase
                    .from('user_collections')
                    .select(`
                        id,
                        acquired_at,
                        creator_code,
                        item:items (
                            id, name, image_url, item_type
                        )
                    `)
                    .eq('user_id', targetUserId)
                    .order('acquired_at', { ascending: false });

                if (!error && vaultData) {
                    // We have to cast this because Supabase's nested joins can confuse TypeScript
                    setCollection(vaultData as unknown as VaultItem[]);
                }
            }
            setLoading(false);
        };

        fetchVault();
    }, [usernameParam, router]);

    // UI States
    if (loading) return <div className="min-h-screen flex items-center justify-center text-vaporCyan font-bold tracking-widest animate-pulse">LOADING VAULT...</div>;
    if (!profiles) return <div className="min-h-screen flex items-center justify-center text-vaporPink font-bold text-2xl">USER NOT FOUND 404</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* VAULT HEADER */}
            <div className="border-b border-vaporBorder pb-4">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink uppercase">
                    {usernameParam === 'me' ? 'My Vault' : `${profiles.username}'s Vault`}
                </h1>
                <p className="text-vaporMuted mt-2 font-bold tracking-wider">
                    {collection.length} ITEMS SECURED
                </p>
            </div>

            {/* VAULT GRID */}
            {collection.length === 0 ? (
                <div className="text-center py-32 border-2 border-dashed border-vaporBorder rounded-xl bg-[#1A1625]/50">
                    <p className="text-vaporMuted italic">This vault is completely empty.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {collection.map((entry) => (
                        <div key={entry.id} className="bg-[#1A1625] rounded-xl border border-vaporBorder overflow-hidden hover:border-vaporCyan transition-colors group">
                            
                            {/* Image Container */}
                            <div className="aspect-square bg-[#0A0710] p-4 relative flex items-center justify-center">
                                {entry.item.image_url ? (
                                    <img 
                                        src={entry.item.image_url} 
                                        alt={entry.item.name} 
                                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                                    />
                                ) : (
                                    <div className="text-vaporMuted text-xs font-mono border border-vaporBorder px-2 py-1 rounded">NO_IMG</div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="p-4 border-t border-vaporBorder bg-gradient-to-b from-transparent to-[#0A0710]/50">
                                <h3 className="text-sm font-bold text-white truncate" title={entry.item.name}>
                                    {entry.item.name}
                                </h3>
                                <p className="text-xs text-vaporMuted uppercase tracking-wider mt-1">
                                    {entry.item.item_type}
                                </p>
                                
                                {/* Creator Code Badge (If applicable) */}
                                {entry.creator_code && (
                                    <div className="mt-3">
                                        <span className="text-[10px] text-vaporCyan bg-[#0A0710] border border-vaporCyan/30 px-2 py-1 rounded font-bold tracking-widest">
                                            CODE: {entry.creator_code.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}