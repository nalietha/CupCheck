'use client';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SettingsForm from '@/components/SettingsForm';

export default function SettingsPage() {
  const router = useRouter();
  const [profiles, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadProfile = async () => {
      // Check session on the client side
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      // Fetch profiles data
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setProfile(data);
      }
      setLoading(false);
    };

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-vaporCyan font-black tracking-widest animate-pulse">
          ACCESSING SYS_CONFIG...
        </div>
      </div>
    );
  }

  if (!profiles) {
    return <div className="text-center mt-20 text-red-500 font-bold">profiles Sync Error. Contact Admin.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink">
          SYS_CONFIG
        </h1>
        <p className="text-vaporMuted">Manage your profile, visibility, and session state.</p>
      </header>

      <SettingsForm profiles={profiles} />
    </div>
  );
}