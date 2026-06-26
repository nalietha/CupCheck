// components/NavBar.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function NavBar() {
    // Manages user authorization and mobile menu visibility
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkUserStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setIsLoggedIn(true);

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

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setIsLoggedIn(false);
                setIsAdmin(false);
                setIsMobileMenuOpen(false);
            } else if (event === 'SIGNED_IN') {
                checkUserStatus();
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Closes the mobile menu upon navigation
    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="flex items-center justify-between p-4 bg-[#1A1625] border-b border-vaporBorder sticky top-0 z-50">
            {/* Branding */}
            <Link href="/" className="flex items-center group">
                <span className="text-xl md:text-2xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink uppercase transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,113,206,0.6)]">
                    CupCheck.cc
                </span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button 
                className="md:hidden text-vaporText p-2 hover:text-vaporCyan transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
            >
                {isMobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 items-center">
                <Link href="/explore" className="text-vaporMuted hover:text-vaporText font-bold transition-colors">
                    Explore
                </Link>

                {isLoggedIn && (
                    <Link href="/vault/me" className="text-vaporCyan hover:text-vaporText font-bold transition-colors">
                        My Vault
                    </Link>
                )}

                {isAdmin && (
                    <Link
                        href="/admin"
                        className="bg-vaporPink text-[#0B0914] px-3 py-1 rounded font-bold hover:bg-white transition-all shadow-[0_0_10px_rgba(255,113,206,0.5)] hover:shadow-[0_0_15px_rgba(255,113,206,0.8)]"
                    >
                        ADMIN PANEL
                    </Link>
                )}

                {!isLoggedIn ? (
                    <Link href="/login" className="bg-[#2A2438] text-vaporText px-4 py-2 rounded font-bold hover:bg-vaporCyan hover:text-[#0B0914] transition-all">
                        Login
                    </Link>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            href="/settings"
                            className="text-vaporMuted hover:text-vaporCyan transition-transform hover:rotate-90 duration-300"
                            title="Settings"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </Link>
                        <button
                            onClick={() => supabase.auth.signOut()}
                            className="text-xs text-vaporMuted hover:text-red-400 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Dropdown Navigation */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#1A1625] border-b border-vaporBorder flex flex-col py-4 px-6 gap-6 md:hidden shadow-xl z-40">
                    <Link href="/explore" onClick={handleLinkClick} className="text-vaporMuted hover:text-vaporText font-bold transition-colors">
                        Explore
                    </Link>

                    {isLoggedIn && (
                        <Link href="/vault/me" onClick={handleLinkClick} className="text-vaporCyan hover:text-vaporText font-bold transition-colors">
                            My Vault
                        </Link>
                    )}

                    {isAdmin && (
                        <Link
                            href="/admin"
                            onClick={handleLinkClick}
                            className="inline-block w-max bg-vaporPink text-[#0B0914] px-3 py-1 rounded font-bold hover:bg-white transition-all"
                        >
                            ADMIN PANEL
                        </Link>
                    )}

                    {!isLoggedIn ? (
                        <Link href="/login" onClick={handleLinkClick} className="inline-block w-max bg-[#2A2438] text-vaporText px-4 py-2 rounded font-bold hover:bg-vaporCyan hover:text-[#0B0914] transition-all">
                            Login
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-4 border-t border-vaporBorder pt-4">
                            <Link href="/settings" onClick={handleLinkClick} className="flex items-center gap-2 text-vaporMuted hover:text-vaporCyan transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </Link>
                            <button
                                onClick={() => {
                                    supabase.auth.signOut();
                                    handleLinkClick();
                                }}
                                className="w-max text-sm text-red-400 hover:text-red-300 font-bold transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}