'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 1. Change 'username' to 'displayName'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '', 
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 2. Pass the displayName into the options.data payload!
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          // Our SQL trigger looks for 'full_name' and puts it in the 'display_name' column
          full_name: formData.displayName, 
        }
      }
    });
    if (data.user) {
  await supabase.from('profiles').insert([
    { 
      id: data.user.id, 
      display_name: displayName, // This is what you want to use everywhere!
      username: email.split('@')[0] // Keep this just for the URL slug
    }
  ]);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      // Success! Redirect them to the explore page or their new vault
      router.push('/explore');
      router.refresh();
    }
    setLoading(false);
  };

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
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              className="w-full bg-[#0A0710] border border-vaporBorder rounded p-3 text-vaporText focus:border-vaporCyan outline-none transition-colors"
              placeholder="Your public moniker..."
            />
          </div>

          <div>
            <label className="block text-vaporMuted text-sm mb-1">Email</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-[#0A0710] border border-vaporBorder rounded p-3 text-vaporText focus:border-vaporCyan outline-none transition-colors"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="block text-vaporMuted text-sm mb-1">Password</label>
            <input 
              required
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-[#0A0710] border border-vaporBorder rounded p-3 text-vaporText focus:border-vaporCyan outline-none transition-colors"
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