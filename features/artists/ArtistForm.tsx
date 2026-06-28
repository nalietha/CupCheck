'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { scrapeArtistProfile } from '@/lib/actions/scraper';

interface LinkItem {
  id: string;
  platform: string;
  url: string;
}

const PLATFORM_PRESETS = ['Twitter / X', 'Instagram', 'Pixiv', 'Patreon', 'ArtStation', 'Portfolio', 'BlueSky', 'Twitch', 'YouTube', 'Linktree', 'Custom'];

export default function ArtistForm({ artistId, initialData }: { artistId?: string, initialData?: any }) {
  const router = useRouter();
  
  // Core State
  const [name, setName] = useState(initialData?.name || '');
  const [image_url, setImageUrl] = useState(initialData?.image_url || '');
  const [links, setLinks] = useState<LinkItem[]>(initialData?.links || []);
  
  // Aliases State
  const [aliases, setAliases] = useState<string[]>(initialData?.aliases || []);
  const [newAliasInput, setNewAliasInput] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  // --- Scraper Logic ---
  const handleScrape = async () => {
    if (!scrapeUrl) return;
    setIsScraping(true);
    
    try {
      const result = await scrapeArtistProfile(scrapeUrl);
      
      if (result.success) {
        // Detect the "Silent Failure"
        if (!result.imageUrl && (!result.links || result.links.length === 0)) {
          alert("Scrape successful, but no images or links were detected in the page HTML. The site may be blocking bots.");
        } else {
          // Success: Populate the data
          if (result.imageUrl && !image_url) setImageUrl(result.imageUrl);
          
          if (result.links && result.links.length > 0) {
            const newLinks = result.links.map((l: any) => ({
              id: crypto.randomUUID(),
              platform: l.platform,
              url: l.url
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
  const addLink = () => setLinks([...links, { id: crypto.randomUUID(), platform: 'Twitter / X', url: '' }]);
  
  const updateLink = (id: string, field: keyof LinkItem, value: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  // --- Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { 
      name, 
      image_url, 
      links,
      aliases
    };
    
    try {
      if (artistId) {
        const { data, error } = await supabase.from('artists').update(payload).eq('id', artistId).select();
        if (error) throw error;
        if (!data || data.length === 0) throw new Error('Action blocked by database security policies.');
      } else {
        const { data, error } = await supabase.from('artists').insert([payload]).select();
        if (error) throw error;
        if (!data || data.length === 0) throw new Error('Action blocked by database security policies.');
      }
      router.push('/admin/artists');
      router.refresh();
    } catch (err: any) {
      console.error('Artist synchronization failed:', err.message || JSON.stringify(err));
      alert(err.message || 'Failed to save artist data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-vaporCard/50 p-8 rounded-xl border border-vaporBorder">
      
      {/* --- Scraper Utility --- */}
      <div className="bg-black/30 p-4 rounded-xl border border-vaporCyan/50 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-grow w-full">
          <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">
            Auto-Fill Scraper (Linktree or Twitter)
          </label>
          <input 
            type="url" 
            value={scrapeUrl} 
            onChange={(e) => setScrapeUrl(e.target.value)} 
            className="w-full bg-black/60 border border-vaporCyan/30 p-3 rounded text-sm text-vaporText focus:border-vaporCyan outline-none" 
            placeholder="https://linktr.ee/artistname" 
          />
        </div>
        <button 
          type="button" 
          onClick={handleScrape}
          disabled={isScraping || !scrapeUrl}
          className="bg-vaporCyan text-black font-bold uppercase tracking-widest text-sm px-6 py-3 rounded disabled:opacity-50 hover:bg-cyan-300 transition-colors w-full md:w-auto"
        >
          {isScraping ? 'SCRAPING...' : 'QUICK FETCH'}
        </button>
      </div>

      {/* --- Core Info --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">Avatar</label>
          <div className="flex flex-col gap-3">
            {image_url && (
              <img src={image_url} alt="Preview" className="w-24 h-24 rounded-lg object-cover border border-vaporCyan shadow-neon" />
            )}
            <input type="url" value={image_url} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-black/40 border border-vaporBorder p-3 rounded text-sm" placeholder="Image URL..." />
          </div>
        </div>
        
        <div className="md:col-span-9 space-y-6">
          <div>
            <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">Artist Name</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/40 border border-vaporBorder p-3 rounded text-vaporText" />
          </div>

          {/* --- Aliases --- */}
          <div className="bg-black/30 p-4 rounded-xl border border-vaporBorder">
            <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">Known Aliases</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {aliases.map(alias => (
                <span key={alias} className="bg-vaporCyan/20 border border-vaporCyan text-cyan-300 px-3 py-1 rounded-md text-sm font-bold flex items-center gap-2">
                  {alias}
                  <button type="button" onClick={() => removeAlias(alias)} className="text-cyan-500 hover:text-white">&times;</button>
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
              className="w-full bg-transparent border-b border-vaporMuted focus:border-vaporCyan text-vaporText p-2 outline-none"
            />
          </div>
        </div>
      </div>

      {/* --- Network Directory --- */}
      <div className="pt-6 border-t border-vaporBorder space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-vaporPink italic uppercase tracking-widest">Network Directory</h3>
          <button type="button" onClick={addLink} className="px-3 py-1 bg-vaporPink/20 text-vaporPink border border-vaporPink rounded text-xs font-bold uppercase hover:bg-vaporPink hover:text-black transition-colors">+ Add Link</button>
        </div>
        
        {links.map((link) => (
          <div key={link.id} className="grid grid-cols-12 gap-4 bg-black/30 p-4 rounded-xl border border-vaporBorder">
            <select value={link.platform} onChange={(e) => updateLink(link.id, 'platform', e.target.value)} className="col-span-12 md:col-span-3 bg-black/60 border border-vaporMuted rounded px-2 py-2 text-sm text-vaporText">
              {PLATFORM_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="url" value={link.url} onChange={(e) => updateLink(link.id, 'url', e.target.value)} className="col-span-12 md:col-span-7 bg-black/60 border border-vaporMuted rounded px-3 py-2 text-sm text-vaporText" placeholder="https://..." />
            <button type="button" onClick={() => setLinks(links.filter(l => l.id !== link.id))} className="col-span-12 md:col-span-2 text-red-500 hover:text-red-400 font-bold text-sm uppercase tracking-wider text-right md:text-center">Remove</button>
          </div>
        ))}
        {links.length === 0 && (
          <div className="text-center p-6 border border-dashed border-vaporBorder text-vaporMuted rounded-xl">No links added. Try scraping a Linktree!</div>
        )}
      </div>

      <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-vaporCyan to-vaporPurple hover:from-cyan-400 hover:to-purple-500 text-black font-black uppercase tracking-widest rounded-lg transition-all shadow-[0_0_15px_rgba(1,205,254,0.4)] disabled:opacity-50">
        {loading ? 'SAVING...' : artistId ? 'UPDATE ARTIST' : 'INITIALIZE ARTIST'}
      </button>
    </form>
  );
}