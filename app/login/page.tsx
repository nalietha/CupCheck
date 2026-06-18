"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Call Supabase Auth to log the user in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // If successful, redirect them back to the main Vault page!
    router.push('/');
    router.refresh(); // Forces the page to re-fetch data so it knows we are logged in
  };

  return (
    <div className="min-h-screen bg-vaporBg text-vaporText font-sans flex items-center justify-center p-6">
      
      {/* Back to Home Button */}
      <Link href="/" className="absolute top-6 left-6 text-vaporCyan hover:text-vaporPink transition-colors font-bold tracking-wider">
        ← BACK TO VAULT
      </Link>

      <div className="max-w-md w-full bg-vaporBg border-2 border-vaporBorder rounded-xl p-8 shadow-[0_0_30px_rgba(255,113,206,0.15)]">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink drop-shadow-[0_0_10px_rgba(1,205,254,0.3)]">
            CUPCHECK
          </h1>
          <p className="text-vaporMuted mt-2">Access Your Vault</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-vaporCyan mb-2">EMAIL</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="waifu@gamersupps.com" 
              className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporPink focus:shadow-[0_0_15px_rgba(255,113,206,0.2)] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-vaporCyan mb-2">PASSWORD</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporPink focus:shadow-[0_0_15px_rgba(255,113,206,0.2)] transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-vaporCyan text-[#0B0914] font-black tracking-widest py-3 rounded hover:bg-white hover:text-vaporCyan transition-all shadow-[0_0_15px_rgba(1,205,254,0.4)] hover:shadow-[0_0_25px_rgba(1,205,254,0.8)] mt-4 disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'INITIATE LOGIN'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-vaporMuted border-t border-vaporBorder pt-6">
          Need an account? <Link href="/signup" className="text-vaporPink hover:text-vaporText transition-colors font-bold">Sign Up Here</Link>
        </div>

      </div>
    </div>
  );
}