'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [needsVerification, setNeedsVerification] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.displayName,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      // CHECK FOR SESSION HERE
      if (!data.session) {
        // Email confirmation is required
        setNeedsVerification(true);
      } else {
        // Email confirmation is disabled, user is automatically logged in
        router.push('/explore');
        router.refresh();
      }
    }

    setLoading(false);
  };

  if (needsVerification) {
    return (
      <div className="max-w-md mx-auto mt-20 px-6">
        <div className="bg-[#1A1625] p-8 rounded-xl border border-vaporCyan shadow-[0_0_20px_rgba(1,205,254,0.2)] text-center space-y-6">
          <h2 className="text-3xl font-black italic text-vaporCyan">CHECK YOUR EMAIL</h2>
          <p className="text-vaporMuted">
            A verification link has been sent to <span className="text-vaporText font-bold">{formData.email}</span>.
            You must verify your email address before you can log in to your vault.
          </p>
          <Link
            href="/login"
            className="block w-full bg-transparent border-2 border-vaporCyan text-vaporCyan font-black italic py-3 rounded hover:bg-vaporCyan hover:text-[#0B0914] transition-all shadow-[0_0_15px_rgba(1,205,254,0.3)]"
          >
            RETURN TO LOGIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 px-6">
      <form onSubmit={handleSignUp} className="bg-[#1A1625] p-8 rounded-xl border border-vaporBorder shadow-[0_0_20px_rgba(1,205,254,0.1)]">
        <h2 className="text-3xl font-black italic text-vaporCyan mb-6 text-center">JOIN THE VAULT</h2>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-vaporMuted text-sm mb-1">Display Name</label>
            <input
              required
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full bg-[#0A0710] border border-vaporBorder rounded p-3 text-white focus:border-vaporCyan outline-none transition-colors"
              placeholder="Your public moniker..."
            />
          </div>

          <div>
            <label className="block text-vaporMuted text-sm mb-1">Email</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#0A0710] border border-vaporBorder rounded p-3 text-white focus:border-vaporCyan outline-none transition-colors"
              placeholder="you@email.com"
            />
            <p className="text-xs text-vaporMuted opacity-75 mt-2">
              Used strictly for account verification and password recovery. We will never spam you or sell your data.
            </p>
          </div>

          <div>
            <label className="block text-vaporMuted text-sm mb-1">Password</label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-[#0A0710] border border-vaporBorder rounded p-3 text-white focus:border-vaporCyan outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-vaporCyan to-vaporPink text-[#0B0914] font-black italic py-3 rounded hover:opacity-90 transition-all mt-4 disabled:opacity-50"
          >
            {loading ? 'INITIALIZING...' : 'REGISTER'}
          </button>
        </div>


        <p className="text-center text-vaporMuted text-sm mt-6">
          Already have an account? <Link href="/login" className="text-vaporCyan hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}