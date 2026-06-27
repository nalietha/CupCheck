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

  const getInitialPrivacy = () => {
    if (profiles.is_public) return 'public';
    if (profiles.is_unlisted) return 'unlisted';
    return 'private';
  };

  const [privacyMode, setPrivacyMode] = useState(getInitialPrivacy());

  const [formData, setFormData] = useState({
    display_name: profiles.display_name || '',
    bio: profiles.bio || '',
    started_collecting: profiles.started_collecting || '', 
    show_nsfw: profiles.show_nsfw || false,
  });

  const [trackers, setTrackers] = useState<{ filter_type: string, filter_value: string, filter_label: string }[]>(
    Array.isArray(profiles.vault_trackers) ? profiles.vault_trackers : []
  );

  // Stores relational data for dynamic dropdown population
  const [trackerOptions, setTrackerOptions] = useState<Record<string, { id: string, name: string }[]>>({
    item_type: [],
    season: [],
    collection_id: [],
    creator_id: [],
    artist_id: []
  });

  const trackerLimit = getCustomizationLimit(profiles.subscription_tier);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') || 'vaporwave';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Hydrates the dropdowns with active database categories
    async function fetchOptions() {
      const [types, cols, creas, arts, itemsRes] = await Promise.all([
        supabase.from('item_types').select('value, label').order('display_order'),
        supabase.from('collections').select('id, name').order('name'),
        supabase.from('creators').select('id, name').order('name'),
        supabase.from('artists').select('id, name').order('name'),
        supabase.from('items').select('season')
      ]);

      // Extracts unique seasons from the catalog
      const uniqueSeasons = Array.from(new Set(itemsRes.data?.map(i => i.season).filter(Boolean))).sort();

      setTrackerOptions({
        item_type: types.data?.map((t: any) => ({ id: t.value, name: t.label })) || [],
        season: uniqueSeasons.map(s => ({ id: s as string, name: s as string })),
        collection_id: cols.data?.map((c: any) => ({ id: c.id, name: c.name })) || [],
        creator_id: creas.data?.map((c: any) => ({ id: c.id, name: c.name })) || [],
        artist_id: arts.data?.map((a: any) => ({ id: a.id, name: a.name })) || []
      });
    }

    fetchOptions();
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('app_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleAddTracker = () => {
    if (trackers.length < trackerLimit) {
      const defaultOptions = trackerOptions['item_type'] || [];
      const defaultSelection = defaultOptions[0];
      setTrackers([...trackers, {
        filter_type: 'item_type',
        filter_value: defaultSelection ? defaultSelection.id : 'cup',
        filter_label: defaultSelection ? defaultSelection.name : 'Cup'
      }]);
    }
  };

  const handleRemoveTracker = (index: number) => {
    setTrackers(trackers.filter((_, i) => i !== index));
  };

  const handleTrackerTypeChange = (index: number, newType: string) => {
    const options = trackerOptions[newType] || [];
    const firstOption = options[0];
    const newTrackers = [...trackers];

    newTrackers[index] = {
      filter_type: newType,
      filter_value: firstOption ? firstOption.id : '',
      filter_label: firstOption ? firstOption.name : ''
    };

    setTrackers(newTrackers);
  };

  const handleTrackerValueChange = (index: number, newValue: string) => {
    const type = trackers[index].filter_type;
    const options = trackerOptions[type] || [];
    const selectedOption = options.find(opt => opt.id === newValue);

    const newTrackers = [...trackers];
    newTrackers[index] = {
      ...newTrackers[index],
      filter_value: newValue,
      filter_label: selectedOption ? selectedOption.name : ''
    };

    setTrackers(newTrackers);
  };



  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const is_public = privacyMode === 'public';
    const is_unlisted = privacyMode === 'unlisted';

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: formData.display_name,
        bio: formData.bio,
        show_nsfw: formData.show_nsfw,
        is_public,           
        is_unlisted,         
        vault_trackers: trackers, 
        started_collecting: formData.started_collecting || null, 
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
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-vaporText focus:border-vaporCyan outline-none"
            placeholder="How you want to be known..."
          />
        </div>

        <div>
          <label className="block text-vaporMuted text-sm mb-1">Date Started Collecting</label>
          <input
            type="date"
            value={formData.started_collecting}
            onChange={(e) => setFormData({ ...formData, started_collecting: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-vaporText focus:border-vaporCyan outline-none"
            placeholder="Tell the world about your collection..."
          />
        </div>

        <div className="flex flex-col gap-4">
          
          {/* New 3-Tier Privacy Selector */}
          <div className="bg-vaporBg p-4 rounded border border-vaporBorder">
            <label className="block text-vaporCyan font-bold uppercase tracking-wider mb-3">
              Vault Visibility
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="privacy" 
                  value="public" 
                  checked={privacyMode === 'public'} 
                  onChange={(e) => setPrivacyMode(e.target.value)}
                  className="w-4 h-4 accent-vaporCyan"
                />
                <div>
                  <span className="text-vaporText font-bold block group-hover:text-vaporCyan transition-colors">Public</span>
                  <span className="text-vaporMuted text-xs">Visible on the Explore page. Anyone can view your collection.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="privacy" 
                  value="unlisted" 
                  checked={privacyMode === 'unlisted'} 
                  onChange={(e) => setPrivacyMode(e.target.value)}
                  className="w-4 h-4 accent-vaporYellow"
                />
                <div>
                  <span className="text-vaporText font-bold block group-hover:text-vaporYellow transition-colors">Unlisted</span>
                  <span className="text-vaporMuted text-xs">Hidden from Explore. Only people with your direct profile link can view it.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="privacy" 
                  value="private" 
                  checked={privacyMode === 'private'} 
                  onChange={(e) => setPrivacyMode(e.target.value)}
                  className="w-4 h-4 accent-vaporPink"
                />
                <div>
                  <span className="text-vaporText font-bold block group-hover:text-vaporPink transition-colors">Private</span>
                  <span className="text-vaporMuted text-xs">Completely hidden. Only you can view your vault.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-pink-900/10 p-4 rounded border border-pink-500/30">
            <input
              type="checkbox"
              id="show_nsfw"
              checked={formData.show_nsfw}
              onChange={(e) => setFormData({ ...formData, show_nsfw: e.target.checked })}
              className="w-5 h-5 accent-pink-500"
            />
            <div>
              <label htmlFor="show_nsfw" className="text-pink-400 font-bold block uppercase tracking-wider text-sm">Enable NSFW Content (18+)</label>
              <span className="text-vaporMuted text-xs">I confirm I am 18 years of age or older and wish to view NSFW creator links and tags.</span>
            </div>
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
                <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-[#0A0710] p-4 border border-vaporBorder rounded-lg">
                  <div className="flex-1 w-full">
                    <label className="block text-xs text-vaporMuted mb-1">Filter Type</label>
                    <select
                      value={tracker.filter_type}
                      onChange={(e) => handleTrackerTypeChange(index, e.target.value)}
                      className="w-full bg-vaporBg border border-vaporBorder rounded p-2 text-sm text-vaporText focus:border-vaporCyan outline-none"
                    >
                      <option value="item_type">Item Type</option>
                      <option value="season">Season / Drop</option>
                      <option value="collection_id">Collection</option>
                      <option value="creator_id">Creator</option>
                      <option value="artist_id">Artist</option>
                    </select>
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs text-vaporMuted mb-1">Target</label>
                    <select
                      value={tracker.filter_value}
                      onChange={(e) => handleTrackerValueChange(index, e.target.value)}
                      className="w-full bg-vaporBg border border-vaporBorder rounded p-2 text-sm text-vaporText focus:border-vaporCyan outline-none"
                    >
                      {trackerOptions[tracker.filter_type]?.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTracker(index)}
                    className="w-full md:w-auto p-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors text-xs font-bold md:h-[38px]"
                  >
                    REMOVE
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