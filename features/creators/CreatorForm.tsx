'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { scrapeArtistProfile } from '@/lib/actions/scraper'; // Reusing our universal scraper

interface LinkItem {
  id: string; // Used for React keys during editing
  platform: string;
  custom_label?: string;
  url: string;
  is_nsfw: boolean;
}

interface CreatorFormProps {
  creatorId?: string;
  initialData?: {
    name: string;
    description?: string;
    image_url?: string;
    gg_codes?: string[];
    aliases?: string[]; // Added aliases
    is_active?: boolean;
    is_nsfw?: boolean;
    social_links?: LinkItem[];
  };
}

const PLATFORM_PRESETS = [
  'YouTube', 'YouTube VODs', 'YouTube Shorts', 
  'Twitch', 'Twitter / X', 'TikTok', 'Instagram','Spotify', 
  'vTuber wiki', 'Discord', 'Official Website', 
  'Merch Store', 'Linktree', 'Patreon', 'Fansly', 'OnlyFans', 'Custom'
];

export default function CreatorForm({ creatorId, initialData }: CreatorFormProps) {
  const router = useRouter();

  // Core Data
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    image_url: initialData?.image_url || '',
    is_active: initialData?.is_active ?? true,
    is_nsfw: initialData?.is_nsfw ?? false,
  });

  // Array Data
  const [ggCodes, setGgCodes] = useState<string[]>(initialData?.gg_codes || []);
  const [newCodeInput, setNewCodeInput] = useState('');
  
  const [aliases, setAliases] = useState<string[]>(initialData?.aliases || []);
  const [newAliasInput, setNewAliasInput] = useState('');

  const [social_links, setLinks] = useState<LinkItem[]>(initialData?.social_links || []);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Scraper States
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  // --- Scraper Logic ---
  const handleScrape = async () => {
    if (!scrapeUrl) return;
    setIsScraping(true);
    
    try {
      const result = await scrapeArtistProfile(scrapeUrl);
      
      if (result.success) {
        if (!result.imageUrl && (!result.links || result.links.length === 0)) {
          alert("Scrape successful, but no images or links were detected in the page HTML. The site may be blocking bots.");
        } else {
          // Success: Populate the data
          if (result.imageUrl && !formData.image_url) {
            setFormData(prev => ({ ...prev, image_url: result.imageUrl }));
          }
          
          if (result.links && result.links.length > 0) {
            const newLinks = result.links.map((l: any) => ({
              id: crypto.randomUUID(),
              platform: l.platform,
              url: l.url,
              is_nsfw: false
            }));
            setLinks((prev) => [...prev, ...newLinks]);
          }
        }
      } else {
        alert(`Scrape failed: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred while communicating with the scraper.");
    } finally {
      setIsScraping(false);
      setScrapeUrl('');
    }
  };

  // --- Dynamic Codes Logic ---
  const handleAddCode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = newCodeInput.trim().toUpperCase();
      if (code && !ggCodes.includes(code)) {
        setGgCodes([...ggCodes, code]);
      }
      setNewCodeInput('');
    }
  };

  const removeCode = (codeToRemove: string) => {
    setGgCodes(ggCodes.filter(c => c !== codeToRemove));
  };

  // --- Dynamic Aliases Logic ---
  const handleAddAlias = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const alias = newAliasInput.trim();
      if (alias && !aliases.includes(alias)) {
        setAliases([...aliases, alias]);
      }
      setNewAliasInput('');
    }
  };

  const removeAlias = (aliasToRemove: string) => {
    setAliases(aliases.filter(a => a !== aliasToRemove));
  };

  // --- Dynamic Links Logic ---
  const addLink = () => {
    setLinks([...social_links, { 
      id: crypto.randomUUID(), 
      platform: 'YouTube', 
      url: '', 
      is_nsfw: false 
    }]);
  };

  const updateLink = (id: string, field: keyof LinkItem, value: any) => {
    setLinks(social_links.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const removeLink = (id: string) => {
    setLinks(social_links.filter(link => link.id !== id));
  };

  // --- Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanedLinks = social_links.filter(link => link.url.trim() !== '');

    const payload = {
      ...formData,
      gg_codes: ggCodes,
      aliases, // Added to payload
      social_links: cleanedLinks,
    };

    try {
      if (creatorId) {
        const { data, error: updateError } = await supabase.from('creators').update(payload).eq('id', creatorId).select();
        if (updateError) throw updateError;
        if (!data || data.length === 0) throw new Error('Action blocked by database security policies.');
      } else {
        const { data, error: insertError } = await supabase.from('creators').insert([payload]).select();
        if (insertError) throw insertError;
        if (!data || data.length === 0) throw new Error('Action blocked by database security policies.');
      }
      router.push('/admin/creators');
      router.refresh();
    } catch (err: any) {
      console.error('Creator synchronization failed:', err.message || JSON.stringify(err));
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-black/40 border border-vaporBorder text-vaporText rounded-lg focus:outline-none focus:border-vaporCyan focus:shadow-[0_0_15px_rgba(1,205,254,0.3)] transition-all duration-300 p-3";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-vaporCard/50 p-6 md:p-8 rounded-xl border border-vaporBorder max-w-4xl shadow-lg backdrop-blur-sm">
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500 text-red-300 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <span className="font-bold tracking-widest uppercase mr-2">Error:</span> {error}
        </div>
      )}

      {/* --- Scraper Utility --- */}
      <div className="bg-black/30 p-4 rounded-xl border border-vaporCyan/50 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-grow w-full">
          <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">
            Auto-Fill Scraper (Twitter/X or Linktree)
          </label>
          <input 
            type="url" 
            value={scrapeUrl} 
            onChange={(e) => setScrapeUrl(e.target.value)} 
            className="w-full bg-black/60 border border-vaporCyan/30 p-3 rounded-lg text-sm text-vaporText focus:border-vaporCyan outline-none" 
            placeholder="https://x.com/creator_name" 
          />
        </div>
        <button 
          type="button" 
          onClick={handleScrape}
          disabled={isScraping || !scrapeUrl}
          className="bg-vaporCyan text-black font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-lg disabled:opacity-50 hover:bg-cyan-300 transition-colors w-full md:w-auto"
        >
          {isScraping ? 'SCRAPING...' : 'QUICK FETCH'}
        </button>
      </div>

      {/* --- Core Identity Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3 flex flex-col items-center justify-start pt-6">
          <div className={`w-32 h-32 rounded-full border-2 overflow-hidden flex items-center justify-center bg-black/40 ${formData.image_url ? 'border-vaporCyan shadow-[0_0_20px_rgba(1,205,254,0.4)]' : 'border-vaporBorder border-dashed'}`}>
            {formData.image_url ? (
              <img 
                src={formData.image_url} alt="Avatar Preview" className="w-full h-full object-cover"
                onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid'}
              />
            ) : <span className="text-vaporMuted text-xs uppercase tracking-widest text-center px-4">No Image</span>}
          </div>
        </div>

        <div className="md:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">Creator Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClasses} placeholder="e.g. Smii7y" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">Profile Image URL</label>
              <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className={inputClasses} placeholder="https://..." />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">Description / Bio</label>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClasses} placeholder="Background info..." />
            </div>
          </div>
        </div>
      </div>

      {/* --- Tags, Aliases & Toggles --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dynamic Codes Input */}
        <div className="bg-black/30 p-6 rounded-xl border border-vaporBorder">
          <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">GG Codes</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {ggCodes.map(code => (
              <span key={code} className="bg-vaporCyan/20 border border-vaporCyan text-cyan-300 px-3 py-1 rounded-md text-sm font-bold flex items-center gap-2">
                {code}
                <button type="button" onClick={() => removeCode(code)} className="text-cyan-500 hover:text-white">&times;</button>
              </span>
            ))}
            {ggCodes.length === 0 && <span className="text-vaporMuted text-sm italic">No codes assigned</span>}
          </div>
          <input
            type="text"
            value={newCodeInput}
            onChange={(e) => setNewCodeInput(e.target.value)}
            onKeyDown={handleAddCode}
            placeholder="Type code and press Enter..."
            className="w-full bg-transparent border-b border-vaporMuted focus:border-vaporCyan text-vaporText p-2 outline-none uppercase"
          />
        </div>

        {/* Dynamic Aliases Input */}
        <div className="bg-black/30 p-6 rounded-xl border border-vaporBorder">
          <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">Known Aliases</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {aliases.map(alias => (
              <span key={alias} className="bg-vaporPink/20 border border-vaporPink text-pink-300 px-3 py-1 rounded-md text-sm font-bold flex items-center gap-2">
                {alias}
                <button type="button" onClick={() => removeAlias(alias)} className="text-pink-500 hover:text-white">&times;</button>
              </span>
            ))}
            {aliases.length === 0 && <span className="text-vaporMuted text-sm italic">No aliases assigned</span>}
          </div>
          <input
            type="text"
            value={newAliasInput}
            onChange={(e) => setNewAliasInput(e.target.value)}
            onKeyDown={handleAddAlias}
            placeholder="Type alias and press Enter..."
            className="w-full bg-transparent border-b border-vaporMuted focus:border-vaporPink text-vaporText p-2 outline-none"
          />
        </div>

        {/* Global Toggles */}
        <div className="md:col-span-2 bg-black/30 p-6 rounded-xl border border-vaporBorder flex flex-row justify-around gap-6">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
              <div className={`block w-12 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-vaporCyan' : 'bg-gray-700'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_active ? 'translate-x-6' : ''}`}></div>
            </div>
            <span className="text-vaporText font-bold tracking-widest uppercase text-sm group-hover:text-vaporCyan transition-colors">Active Profile</span>
          </label>

          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={formData.is_nsfw} onChange={(e) => setFormData({ ...formData, is_nsfw: e.target.checked })} />
              <div className={`block w-12 h-6 rounded-full transition-colors ${formData.is_nsfw ? 'bg-pink-600' : 'bg-gray-700'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_nsfw ? 'translate-x-6 shadow-[0_0_10px_white]' : ''}`}></div>
            </div>
            <span className={`font-bold tracking-widest uppercase text-sm ${formData.is_nsfw ? 'text-pink-500 shadow-neon' : 'text-vaporText group-hover:text-pink-400'}`}>Profile NSFW (18+)</span>
          </label>
        </div>
      </div>

      {/* --- Dynamic Network Directory --- */}
      <div className="pt-6 border-t border-vaporBorder space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-vaporPink italic uppercase tracking-widest">Network Directory</h3>
          <button type="button" onClick={addLink} className="text-xs font-bold bg-vaporPink/20 text-vaporPink border border-vaporPink px-3 py-1 rounded hover:bg-vaporPink hover:text-black transition-colors">
            + Add Link
          </button>
        </div>

        {social_links.length === 0 ? (
          <p className="text-vaporMuted text-sm border border-dashed border-vaporBorder p-6 text-center rounded-xl">No network social_links added yet. Try Auto-Filling!</p>
        ) : (
          <div className="space-y-4">
            {social_links.map((link) => (
              <div key={link.id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 rounded-xl border transition-colors ${link.is_nsfw ? 'bg-pink-950/20 border-pink-500/50' : 'bg-black/30 border-vaporBorder'}`}>
                
                <div className="md:col-span-3 space-y-2">
                  <select 
                    value={link.platform} 
                    onChange={(e) => updateLink(link.id, 'platform', e.target.value)}
                    className="w-full bg-black/60 border border-vaporMuted text-vaporText rounded px-2 py-2 text-sm focus:border-vaporCyan outline-none"
                  >
                    {PLATFORM_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {link.platform === 'Custom' && (
                    <input 
                      type="text" placeholder="Custom Label..." value={link.custom_label || ''} 
                      onChange={(e) => updateLink(link.id, 'custom_label', e.target.value)}
                      className="w-full bg-black/60 border border-vaporMuted text-vaporText rounded px-2 py-1 text-sm outline-none focus:border-vaporCyan"
                    />
                  )}
                </div>

                <div className="md:col-span-6">
                  <input 
                    type="url" required placeholder="https://..." value={link.url} 
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    className="w-full bg-black/60 border border-vaporMuted text-vaporText rounded px-3 py-2 text-sm outline-none focus:border-vaporCyan"
                  />
                </div>

                <div className="md:col-span-3 flex items-center justify-between gap-2 h-full py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={link.is_nsfw} onChange={(e) => updateLink(link.id, 'is_nsfw', e.target.checked)} className="accent-pink-500 w-4 h-4" />
                    <span className={`text-xs font-bold uppercase ${link.is_nsfw ? 'text-pink-500' : 'text-vaporMuted'}`}>NSFW</span>
                  </label>
                  <button type="button" onClick={() => removeLink(link.id)} className="text-red-500 hover:text-red-400 text-sm font-bold uppercase tracking-wider px-2">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Action Buttons --- */}
      <div className="flex justify-end gap-4 pt-8 border-t border-vaporBorder">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-vaporMuted hover:text-white transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading || !formData.name.trim()} className="px-8 py-3 bg-gradient-to-r from-vaporCyan to-vaporPurple hover:from-cyan-400 hover:to-purple-500 text-black font-black uppercase tracking-widest rounded-lg transition-all duration-300 disabled:opacity-50 shadow-[0_0_15px_rgba(1,205,254,0.4)]">
          {loading ? 'Transmitting...' : creatorId ? 'Update Record' : 'Initialize Profile'}
        </button>
      </div>
    </form>
  );
}