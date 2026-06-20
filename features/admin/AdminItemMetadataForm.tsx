'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ItemTypeSelect from '@/components/ItemTypeSelect';

interface AdminItemMetadataFormProps {
  formData: any;
  setFormData: (data: any) => void;
  selectedCreators: { id?: string; name: string }[];
  setSelectedCreators: (creators: { id?: string; name: string }[]) => void;
  selectedArtists: { id?: string; name: string; role: string }[];
  setSelectedArtists: (artists: { id?: string; name: string; role: string }[]) => void;
}

const DEFAULT_PRICES: Record<string, number> = {
  cup: 25.00,
  tub: 40.00,
  shirt: 25.00, 
  merch: 20.00, 
  apparel: 40.00,
};

export default function AdminItemMetadataForm({
  formData,
  setFormData,
  selectedCreators,
  setSelectedCreators,
  selectedArtists,
  setSelectedArtists
}: AdminItemMetadataFormProps) {

  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [parentTubs, setParentTubs] = useState<{ id: string; name: string }[]>([]);

  // Creators State
  const [availableCreators, setAvailableCreators] = useState<{ id: string; name: string }[]>([]);
  const [creatorInput, setCreatorInput] = useState('');
  const [filteredCreators, setFilteredCreators] = useState<{ id: string; name: string }[]>([]);
  const [creatorNavIndex, setCreatorNavIndex] = useState(-1);

  // Artists State
  const [availableArtists, setAvailableArtists] = useState<{ id: string; name: string }[]>([]);
  const [artistInput, setArtistInput] = useState('');
  const [filteredArtists, setFilteredArtists] = useState<{ id: string; name: string }[]>([]);
  const [artistNavIndex, setArtistNavIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      const [colRes, creRes, tubRes, artRes] = await Promise.all([
        supabase.from('collections').select('id, name'),
        supabase.from('creators').select('id, name').order('name'),
        supabase.from('items').select('id, name').eq('item_type', 'tub').eq('variant_type', 'standard'),
        supabase.from('artists').select('id, name').order('name')
      ]);

      if (colRes.data) setCollections(colRes.data);
      if (creRes.data) setAvailableCreators(creRes.data);
      if (tubRes.data) setParentTubs(tubRes.data);
      if (artRes.data) setAvailableArtists(artRes.data);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    // Auto Update Price Bug Fix
    if (name === 'item_type') {
      setFormData((prev: any) => ({
        ...prev,
        [name]: val,
        retail_price: DEFAULT_PRICES[val as string] !== undefined ? DEFAULT_PRICES[val as string] : prev.retail_price
      }));
      return;
    }
    
    setFormData((prev: any) => ({ ...prev, [name]: val }));
  };

  // --- CREATOR LOGIC ---
  const handleCreatorSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCreatorInput(input);
    setCreatorNavIndex(-1); // Reset highlight when typing
    if (input.trim() === '') {
      setFilteredCreators([]);
      return;
    }
    const matches = availableCreators.filter(
      (c) => c.name.toLowerCase().includes(input.toLowerCase()) && !selectedCreators.some((selected) => selected.id === c.id)
    );
    setFilteredCreators(matches);
  };

  const addCreator = (creator: { id?: string; name: string }) => {
    if (!selectedCreators.some((c) => c.name.toLowerCase() === creator.name.toLowerCase())) {
      setSelectedCreators([...selectedCreators, creator]);
    }
    setCreatorInput('');
    setFilteredCreators([]);
    setCreatorNavIndex(-1);
  };

  const handleCreatorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCreatorNavIndex((prev) => (prev < filteredCreators.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCreatorNavIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (creatorNavIndex >= 0 && creatorNavIndex < filteredCreators.length) {
        addCreator(filteredCreators[creatorNavIndex]);
      } else if (creatorInput.trim() !== '') {
        const exactMatch = availableCreators.find((c) => c.name.toLowerCase() === creatorInput.toLowerCase());
        addCreator(exactMatch || { name: creatorInput.trim() });
      }
    }
  };

  // --- ARTIST LOGIC ---
  const handleArtistSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setArtistInput(input);
    setArtistNavIndex(-1); // Reset highlight when typing
    if (input.trim() === '') {
      setFilteredArtists([]);
      return;
    }
    const matches = availableArtists.filter(
      (a) => a.name.toLowerCase().includes(input.toLowerCase()) && !selectedArtists.some((selected) => selected.id === a.id)
    );
    setFilteredArtists(matches);
  };

  const addArtist = (artist: { id?: string; name: string }) => {
    if (!selectedArtists.some((a) => a.name.toLowerCase() === artist.name.toLowerCase())) {
      setSelectedArtists([...selectedArtists, { ...artist, role: 'Artist' }]);
    }
    setArtistInput('');
    setFilteredArtists([]);
    setArtistNavIndex(-1);
  };

  const handleArtistKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setArtistNavIndex((prev) => (prev < filteredArtists.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setArtistNavIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (artistNavIndex >= 0 && artistNavIndex < filteredArtists.length) {
        addArtist(filteredArtists[artistNavIndex]);
      } else if (artistInput.trim() !== '') {
        const exactMatch = availableArtists.find((a) => a.name.toLowerCase() === artistInput.toLowerCase());
        addArtist(exactMatch || { name: artistInput.trim() });
      }
    }
  };

  return (
    <div className="bg-vaporCard p-6 rounded-xl border border-vaporBorder grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-vaporMuted mb-2">Item Name</label>
        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink" />
      </div>
      <div>
        <label className="block text-sm font-medium text-vaporMuted mb-2">Item Type</label>
        <ItemTypeSelect name="item_type" value={formData.item_type || 'cup'} onChange={handleChange} className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink" />
      </div>

      {['tub', 'afk'].includes(formData.item_type) && (
        <div className="md:col-span-2 bg-vaporPurple/10 border border-vaporPurple p-4 rounded-lg space-y-4 shadow-[0_0_15px_rgba(185,103,255,0.1)]">
          <h3 className="text-lg font-black text-vaporPurple italic uppercase tracking-widest border-b border-vaporPurple/30 pb-2">
            Tub Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-vaporMuted mb-2">Variant Type</label>
              <select name="variant_type" value={formData.variant_type || 'standard'} onChange={handleChange} className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:border-vaporPurple">
                <option value="standard">Standard Release</option>
                <option value="caffeine_free">Caffeine Free</option>
                <option value="alt_art_1_10">1/10 Alt Art Chase</option>
                <option value="reskin">Artwork Reskin</option>
                <option value="with_melatonin">With Melatonin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-vaporMuted mb-2">Flavor Profile</label>
              <input type="text" name="flavor_profile" value={formData.flavor_profile || ''} onChange={handleChange} placeholder="e.g. Strawberry Margarita" className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:border-vaporPurple" />
            </div>
            {formData.variant_type !== 'standard' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-vaporMuted mb-2">Link to Parent Tub (Base Flavor)</label>
                <select name="parent_item_id" value={formData.parent_item_id || ''} onChange={handleChange} className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:border-vaporPurple">
                  <option value="">-- Select Base Tub --</option>
                  {parentTubs.map((tub) => (<option key={tub.id} value={tub.id}>{tub.name}</option>))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-vaporMuted mb-2">Collection</label>
        <select name="collection_id" value={formData.collection_id || ''} onChange={handleChange} className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink">
          <option value="">None / Base</option>
          {collections.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-vaporMuted mb-2">Description</label>
        <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink" />
      </div>

      <div>
        <label className="block text-sm font-medium text-vaporMuted mb-2">Retail Price ($)</label>
        <input type="number" step="0.01" name="retail_price" value={formData.retail_price || ''} onChange={handleChange} className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink" />
      </div>

      <div>
        <label className="block text-sm font-medium text-vaporMuted mb-2">Season</label>
        <input type="text" name="season" value={formData.season || ''} onChange={handleChange} placeholder="e.g. Season 4" className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink" />
      </div>

      <div>
        <label className="block text-sm font-medium text-vaporMuted mb-2">Material</label>
        <input type="text" name="material" value={formData.material || ''} onChange={handleChange} placeholder="e.g. Plastic, Vinyl" className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink" />
      </div>
      
      <div>
         <label className="block text-sm font-medium text-vaporMuted mb-2">Date Released</label>
         <input type="date" value={formData.release_date || ''} onChange={(e) => setFormData({ ...formData, release_date: e.target.value })} className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink" />
      </div>

      {/* --- SMART CREATOR SECTION --- */}
      <div className="md:col-span-2 relative">
        <label className="block text-sm font-medium text-vaporMuted mb-2">Creators</label>
        <input
          type="text"
          value={creatorInput}
          onChange={handleCreatorSearch}
          onKeyDown={handleCreatorKeyDown}
          placeholder="Search creators or type and press Enter to add new..."
          className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink"
        />
        {selectedCreators.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCreators.map((creator, idx) => (
              <div key={creator.id || idx} className="flex items-center gap-2 bg-pink-500/20 border border-pink-500 text-pink-300 px-3 py-1 rounded-full text-sm">
                <span>{creator.name}</span>
                <button type="button" onClick={() => setSelectedCreators(selectedCreators.filter((c) => c.name !== creator.name))} className="text-pink-400 hover:text-white font-bold">&times;</button>
              </div>
            ))}
          </div>
        )}
        {filteredCreators.length > 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-vaporCard border border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredCreators.map((creator, idx) => (
              <li
                key={creator.id}
                onClick={() => addCreator(creator)}
                className={`p-2 cursor-pointer transition-colors ${creatorNavIndex === idx ? 'bg-pink-500 text-white' : 'hover:bg-gray-700 text-gray-200'}`}
              >
                {creator.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- SMART ARTIST SECTION --- */}
      <div className="md:col-span-2 relative">
        <label className="block text-sm font-medium text-vaporMuted mb-2">Artists</label>
        <input
          type="text"
          value={artistInput}
          onChange={handleArtistSearch}
          onKeyDown={handleArtistKeyDown}
          placeholder="Search artists or type and press Enter to add new..."
          className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-vaporCyan"
        />
        {selectedArtists.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedArtists.map((artist, idx) => (
              <div key={artist.id || idx} className="flex items-center gap-2 bg-vaporCyan/20 border border-vaporCyan text-cyan-300 px-3 py-1 rounded-full text-sm">
                <span>{artist.name}</span>
                <input
                  type="text"
                  value={artist.role}
                  onChange={(e) => {
                    const newArtists = [...selectedArtists];
                    newArtists[idx].role = e.target.value;
                    setSelectedArtists(newArtists);
                  }}
                  className="bg-transparent border-b border-cyan-500/50 outline-none w-24 text-xs text-white placeholder-cyan-500/50 ml-2"
                  placeholder="Role (e.g. Logo)"
                />
                <button type="button" onClick={() => setSelectedArtists(selectedArtists.filter((a) => a.name !== artist.name))} className="text-cyan-400 hover:text-white font-bold">&times;</button>
              </div>
            ))}
          </div>
        )}
        {filteredArtists.length > 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-vaporCard border border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredArtists.map((artist, idx) => (
              <li
                key={artist.id}
                onClick={() => addArtist(artist)}
                className={`p-2 cursor-pointer transition-colors ${artistNavIndex === idx ? 'bg-vaporCyan text-black font-bold' : 'hover:bg-gray-700 text-gray-200'}`}
              >
                {artist.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="md:col-span-2 flex gap-8 p-4 bg-vaporBg rounded-lg border border-vaporBorder">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="limited" checked={formData.limited || false} onChange={handleChange} className="w-5 h-5 accent-neonPink bg-vaporCard border-gray-700 rounded" />
          <span className="text-vaporText font-medium">Limited Edition</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="retired" checked={formData.retired || false} onChange={handleChange} className="w-5 h-5 accent-neonPink bg-vaporCard border-gray-700 rounded" />
          <span className="text-vaporText font-medium">Retired Design</span>
        </label>
      </div>
    </div>
  );
}