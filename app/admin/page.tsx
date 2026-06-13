'use client';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminItemForm from '@/components/AdminItemForm';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      // 1. Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // 2. Fetch the user's profile to check their role
      const { data: profile } = await supabase
        .from('profile')
        .select('role')
        .eq('id', session.user.id)
        .single();

      // 3. Check role and redirect if not admin
      if (profile?.role === 'admin') {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return <div className="text-center mt-20 text-vaporMuted">VERIFYING_PERMISSIONS...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink">
          OVERSEER TERMINAL
        </h1>
        <p className="text-vaporMuted">Authorized personnel only.</p>
      </header>

      <AdminItemForm />
    </div>
  );
}