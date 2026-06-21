'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface LinkItem {
  id: string;
  platform: string;
  url: string;
}

const PLATFORM_PRESETS = ['Twitter / X', 'Instagram', 'Pixiv', 'Patreon', 'ArtStation', 'Portfolio', 'BlueSky' , 'Custom'];

export default function ArtistForm({ artistId, initialData }: { artistId?: string, initialData?: any }) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [image_url, setImageUrl] = useState(initialData?.image_url || '');
  const [links, setLinks] = useState<LinkItem[]>(initialData?.links || []);
  const [loading, setLoading] = useState(false);

  const addLink = () => setLinks([...links, { id: crypto.randomUUID(), platform: 'Twitter / X', url: '' }]);
  
  const updateLink = (id: string, field: keyof LinkItem, value: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { name, image_url, links };
    
    if (artistId) {
      await supabase.from('artists').update(payload).eq('id', artistId);
    } else {
      await supabase.from('artists').insert([payload]);
    }
    router.push('/admin/artists');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-vaporCard/50 p-8 rounded-xl border border-vaporBorder">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">Avatar</label>
          <input type="url" value={image_url} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-black/40 border border-vaporBorder p-3 rounded" placeholder="Image URL..." />
        </div>
        <div className="md:col-span-9">
          <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">Artist Name</label>
          <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/40 border border-vaporBorder p-3 rounded" />
        </div>
      </div>

      <div className="pt-6 border-t border-vaporBorder space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-vaporPink italic uppercase tracking-widest">Network Directory</h3>
          <button type="button" onClick={addLink} className="px-3 py-1 bg-vaporPink/20 text-vaporPink border border-vaporPink rounded text-xs font-bold uppercase">+ Add Link</button>
        </div>
        {links.map((link) => (
          <div key={link.id} className="grid grid-cols-12 gap-4 bg-black/30 p-4 rounded-xl border border-vaporBorder">
            <select value={link.platform} onChange={(e) => updateLink(link.id, 'platform', e.target.value)} className="col-span-3 bg-black/60 border border-vaporMuted rounded px-2 py-2 text-sm">
              {PLATFORM_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="url" value={link.url} onChange={(e) => updateLink(link.id, 'url', e.target.value)} className="col-span-7 bg-black/60 border border-vaporMuted rounded px-3 py-2 text-sm" placeholder="https://..." />
            <button type="button" onClick={() => setLinks(links.filter(l => l.id !== link.id))} className="col-span-2 text-red-500 font-bold text-sm">REMOVE</button>
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-vaporCyan to-vaporPurple text-black font-black uppercase tracking-widest rounded-lg">
        {loading ? 'SAVING...' : artistId ? 'UPDATE ARTIST' : 'INITIALIZE ARTIST'}
      </button>
    </form>
  );
}