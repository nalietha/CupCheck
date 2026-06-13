'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function NavBar() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkUserStatus = async () => {
            // 1. Check if they are logged in at all
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                setIsLoggedIn(true);

                // 2. If logged in, check if they are an admin
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profiles?.role === 'admin') {
                    setIsAdmin(true);
                }
            }
        };

        checkUserStatus();

        // Optional: Listen for auth changes (like if they log out while on the page)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setIsLoggedIn(false);
                setIsAdmin(false);
            } else if (event === 'SIGNED_IN') {
                checkUserStatus();
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <nav className="flex items-center justify-between p-4 bg-[#1A1625] border-b border-vaporBorder sticky top-0 z-50">
            {/* Left side: Logo/Home Link */}
            <Link href="/" className="flex items-center gap-2 group">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-vaporPink to-vaporCyan tracking-widest group-hover:opacity-80 transition-opacity">
                    CUPCHECK
                </span>
            </Link>

            {/* Right side: Links & Auth */}
            <div className="flex gap-6 items-center">
                <Link href="/explore" className="text-vaporMuted hover:text-white font-bold transition-colors">
                    Explore
                </Link>

                {/* Show Vault only if logged in */}
                {isLoggedIn && (
                    <Link href="/vault/me" className="text-vaporCyan hover:text-white font-bold transition-colors">
                        My Vault
                    </Link>
                )}

                {/* The Secret Door: Only visible to Admins */}
                {isAdmin && (
                    <Link 
                        href="/admin" 
                        className="bg-vaporPink text-[#0B0914] px-3 py-1 rounded font-bold hover:bg-white transition-all shadow-[0_0_10px_rgba(255,113,206,0.5)] hover:shadow-[0_0_15px_rgba(255,113,206,0.8)]"
                    >
                        ADMIN PANEL
                    </Link>
                )}

                {/* Show Login if NOT logged in, otherwise show a basic Profiles/Logout option */}
                {!isLoggedIn ? (
                    <Link href="/login" className="bg-[#2A2438] text-white px-4 py-2 rounded font-bold hover:bg-vaporCyan hover:text-[#0B0914] transition-all">
                        Login
                    </Link>
                ) : (
                    <button 
                        onClick={() => supabase.auth.signOut()} 
                        className="text-xs text-vaporMuted hover:text-red-400 transition-colors"
                    >
                        Sign Out
                    </button>
                )}
            </div>
        </nav>
    );
}