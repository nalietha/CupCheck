'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function UserMenu() {
  const [session, setSession] = useState<any>(null);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    // Helper function to fetch the username if a session exists
    const fetchUserAndSession = async (sessionData: any) => {
      setSession(sessionData);
      if (sessionData) {
        const { data } = await supabase
          .from('profile')
          .select('username')
          .eq('id', sessionData.user.id)
          .single();
        if (data) setUsername(data.username);
      }
    };

    // 1. Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserAndSession(session);
    });

    // 2. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserAndSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {/* Now pointing to your ACTUAL username dynamically */}
        <Link href={`/vault/${username}`}>
          <button className="text-sm font-bold text-vaporPink border-2 border-vaporPink px-5 py-2 rounded hover:bg-vaporPink hover:text-[#0B0914] transition-all shadow-[0_0_10px_rgba(255,113,206,0.2)]">
            MY VAULT
          </button>
        </Link>
        
        <Link href="/settings" className="text-vaporMuted hover:text-vaporCyan transition-colors text-2xl" title="Settings">
          ⚙️
        </Link>
      </div>
    );
  }

  return (
    <Link href="/login">
      <button className="text-sm font-bold text-vaporCyan border-2 border-vaporCyan px-5 py-2 rounded hover:bg-vaporCyan hover:text-[#0B0914] transition-all shadow-[0_0_10px_rgba(1,205,254,0.2)]">
        LOGIN
      </button>
    </Link>
  );
}