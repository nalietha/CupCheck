'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SettingsForm({ profiles }: { profiles: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    display_name: profiles.display_name || '',
    bio: profiles.bio || '',
    is_public: profiles.is_public || false,
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: formData.display_name,
        bio: formData.bio,
        is_public: formData.is_public,
      })
      .eq('id', profiles.id);

    if (error) {
      setMessage('Error updating profiles.');
      console.error(error);
    } else {
      setMessage('profiles updated successfully!');
      router.refresh(); // Refresh the page to show new data
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect to home and refresh to force the NavBar to update
    router.push('/');
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleUpdate} className="bg-[#1A1625] p-6 rounded-xl border border-vaporBorder space-y-6">
        
        <div>
          <label className="block text-vaporMuted text-sm mb-1">Username (Immutable)</label>
          <input 
            type="text" 
            value={profiles.username}
            disabled
            className="w-full bg-[#0B0914] border border-vaporBorder/50 rounded p-2 text-vaporMuted cursor-not-allowed"
          />
          <p className="text-xs text-vaporMuted mt-1">Your public Vault link is: /vault/{profiles.username}</p>
        </div>

        <div>
          <label className="block text-vaporMuted text-sm mb-1">Display Name</label>
          <input 
            type="text" 
            value={formData.display_name}
            onChange={(e) => setFormData({...formData, display_name: e.target.value})}
            className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
            placeholder="How you want to be known..."
          />
        </div>

        <div>
          <label className="block text-vaporMuted text-sm mb-1">Bio</label>
          <textarea 
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
            placeholder="Tell the world about your collection..."
          />
        </div>

        <div className="flex items-center gap-3 bg-[#0B0914] p-4 rounded border border-vaporBorder">
          <input 
            type="checkbox" 
            id="is_public"
            checked={formData.is_public}
            onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
            className="w-5 h-5 accent-vaporCyan"
          />
          <div>
            <label htmlFor="is_public" className="text-white font-bold block">Public Vault</label>
            <span className="text-vaporMuted text-xs">Allow anyone to view your collection at your custom URL.</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-vaporCyan text-[#0B0914] font-bold py-3 rounded hover:opacity-80 transition-all shadow-[0_0_15px_rgba(1,205,254,0.3)] disabled:opacity-50"
        >
          {loading ? 'SAVING...' : 'SAVE CHANGES'}
        </button>

        {message && <p className="text-center text-sm font-bold mt-2 text-green-400">{message}</p>}
      </form>

      {/* DANGER ZONE - LOGOUT */}
      <div className="bg-[#1A1625] p-6 rounded-xl border border-red-500/30 flex justify-between items-center">
        <div>
          <h3 className="text-red-400 font-bold">System Connection</h3>
          <p className="text-sm text-vaporMuted">Terminate your current session.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded font-bold transition-all"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}