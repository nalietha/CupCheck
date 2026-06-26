// components/SettingsForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getCustomizationLimit } from '@/lib/utils/tier';

export default function SettingsForm({ profiles }: { profiles: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [theme, setTheme] = useState('vaporwave');

  const [formData, setFormData] = useState({
    display_name: profiles.display_name || '',
    bio: profiles.bio || '',
    is_public: profiles.is_public || false,
    started_collecting: profiles.started_collecting || '', // Added state binding
  });

  // Load existing trackers or initialize empty array safely
  const [trackers, setTrackers] = useState<{ filter_type: string, filter_value: string }[]>(
    Array.isArray(profiles.vault_trackers) ? profiles.vault_trackers : []
  );

  const trackerLimit = getCustomizationLimit(profiles.subscription_tier);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') || 'vaporwave';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('app_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleAddTracker = () => {
    if (trackers.length < trackerLimit) {
      setTrackers([...trackers, { filter_type: 'item_type', filter_value: 'cup' }]);
    }
  };

  const handleRemoveTracker = (index: number) => {
    setTrackers(trackers.filter((_, i) => i !== index));
  };

  const handleTrackerChange = (index: number, field: string, value: string) => {
    const newTrackers = [...trackers];
    newTrackers[index] = { ...newTrackers[index], [field]: value };
    setTrackers(newTrackers);
  };

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
        vault_trackers: trackers,
        started_collecting: formData.started_collecting || null, // Prevent empty string database errors
      })
      .eq('id', profiles.id);

    if (error) {
      setMessage('Error updating profile.');
      console.error(error);
    } else {
      setMessage('Profile updated successfully!');
      router.refresh(); 
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleUpdate} className="bg-[#1A1625] p-6 rounded-xl border border-vaporBorder space-y-6">
        
        {/* Basic Settings */}
        <div>
          <label className="block text-vaporMuted text-sm mb-1">App Theme</label>
          <select 
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="w-full bg-[#0A0710] border border-vaporBorder rounded p-3 text-vaporText focus:border-vaporCyan outline-none transition-colors"
          >
            <option value="vaporwave">Vaporwave (Default)</option>
            <option value="cyberpunk">Cyberpunk 2077</option>
          </select>
        </div>

        <div>
          <label className="block text-vaporMuted text-sm mb-1">Username (Immutable)</label>
          <input 
            type="text" 
            value={profiles.username}
            disabled
            className="w-full bg-vaporBg border border-vaporBorder/50 rounded p-2 text-vaporMuted cursor-not-allowed"
          />
          <p className="text-xs text-vaporMuted mt-1">Your public Vault link is: /vault/{profiles.username}</p>
        </div>
        
        <div>
          <label className="block text-vaporMuted text-sm mb-1">Display Name</label>
          <input 
            type="text" 
            value={formData.display_name}
            onChange={(e) => setFormData({...formData, display_name: e.target.value})}
            className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-vaporText focus:border-vaporCyan outline-none"
            placeholder="How you want to be known..."
          />
        </div>

        {/* --- ADDED COLLECTING START DATE --- */}
        <div>
          <label className="block text-vaporMuted text-sm mb-1">Date Started Collecting</label>
          <input 
            type="date" 
            value={formData.started_collecting}
            onChange={(e) => setFormData({...formData, started_collecting: e.target.value})}
            className="w-full bg-[#0A0710] border border-vaporBorder rounded p-3 text-vaporText focus:border-vaporCyan outline-none transition-colors"
          />
          <p className="text-xs text-vaporMuted mt-1">
            Leave blank to fall back to your account creation date.
          </p>
        </div>
        
        <div>
          <label className="block text-vaporMuted text-sm mb-1">Bio</label>
          <textarea 
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-vaporText focus:border-vaporCyan outline-none"
            placeholder="Tell the world about your collection..."
          />
        </div>
        
        <div className="flex items-center gap-3 bg-vaporBg p-4 rounded border border-vaporBorder">
          <input 
            type="checkbox" 
            id="is_public"
            checked={formData.is_public}
            onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
            className="w-5 h-5 accent-vaporCyan"
          />
          <div>
            <label htmlFor="is_public" className="text-vaporText font-bold block">Public Vault</label>
            <span className="text-vaporMuted text-xs">Allow anyone to view your collection at your custom URL.</span>
          </div>
        </div>

        {/* --- VAULT TRACKERS SECTION --- */}
        <div className="border-t border-vaporBorder pt-6">
          <div className="flex justify-between items-center mb-4">
             <div>
               <h3 className="text-vaporCyan font-bold uppercase tracking-widest">Progress Trackers</h3>
               <p className="text-xs text-vaporMuted">
                 Track your collection progress. ({trackers.length} / {trackerLimit} used)
               </p>
             </div>
             <button
               type="button"
               onClick={handleAddTracker}
               disabled={trackers.length >= trackerLimit}
               className="text-xs font-bold bg-vaporCyan/20 text-vaporCyan border border-vaporCyan px-3 py-1 rounded hover:bg-vaporCyan hover:text-[#0B0914] transition-colors disabled:opacity-50"
             >
               + ADD TRACKER
             </button>
          </div>

          <div className="space-y-4">
            {trackers.length === 0 ? (
               <div className="p-4 bg-[#0A0710] border border-dashed border-vaporBorder rounded text-center text-sm text-vaporMuted">
                 No trackers active.
               </div>
            ) : (
              trackers.map((tracker, index) => (
                <div key={index} className="flex gap-4 items-end bg-[#0A0710] p-4 border border-vaporBorder rounded-lg">
                  <div className="flex-1">
                    <label className="block text-xs text-vaporMuted mb-1">Filter Type</label>
                    <select
                      value={tracker.filter_type}
                      onChange={(e) => handleTrackerChange(index, 'filter_type', e.target.value)}
                      className="w-full bg-vaporBg border border-vaporBorder rounded p-2 text-sm text-vaporText focus:border-vaporCyan outline-none"
                    >
                      <option value="item_type">Item Type</option>
                      <option value="season">Season</option>
                      <option value="collection_id">Collection ID</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-vaporMuted mb-1">Value to Track</label>
                    <input
                      type="text"
                      value={tracker.filter_value}
                      onChange={(e) => handleTrackerChange(index, 'filter_value', e.target.value)}
                      placeholder="e.g. cup, Season 4"
                      className="w-full bg-vaporBg border border-vaporBorder rounded p-2 text-sm text-vaporText focus:border-vaporCyan outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTracker(index)}
                    className="p-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors text-xs font-bold h-[38px]"
                  >
                    X
                  </button>
                </div>
              ))
            )}
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
          className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-vaporText px-6 py-2 rounded font-bold transition-all"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}