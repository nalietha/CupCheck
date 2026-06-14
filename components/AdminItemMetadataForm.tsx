'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminArtistManager from '@/features/artists/ArtistManager';

interface AdminItemMetadataFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  selectedCreators: string[];
  setSelectedCreators: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function AdminItemMetadataForm({ formData, setFormData, selectedCreators, setSelectedCreators }: AdminItemMetadataFormProps) {
  const [collections, setCollections] = useState<{ id: string, name: string }[]>([]);
  const [availableCreators, setAvailableCreators] = useState<{ id: string, name: string }[]>([]);
  
  // Creator Quick-Add State
  const [newCreatorName, setNewCreatorName] = useState('');
  const [isCreatingCreator, setIsCreatingCreator] = useState(false);
  const [creatorError, setCreatorError] = useState('');

  // Fetch Collections and Creators for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      const [colRes, creRes] = await Promise.all([
        supabase.from('collections').select('id, name'),
        supabase.from('creators').select('id, name').order('name')
      ]);
      if (colRes.data) setCollections(colRes.data);
      if (creRes.data) setAvailableCreators(creRes.data);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev: any) => ({ ...prev, [name]: val }));
  };

  const toggleCreator = (creatorId: string) => {
     setSelectedCreators(prev =>
       prev.includes(creatorId)
         ? prev.filter(id => id !== creatorId)
         : [...prev, creatorId]
     );
  };

  // --- CREATOR QUICK-ADD ---
  const handleCreateCreator = async () => {
    if (!newCreatorName.trim()) return;
    setIsCreatingCreator(true);
    setCreatorError('');
    
    try {
      const { data, error } = await supabase
        .from('creators')
        .insert([{ name: newCreatorName.trim() }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setAvailableCreators(prev => [...prev, { id: data.id, name: data.name }].sort((a, b) => a.name.localeCompare(b.name)));
        setSelectedCreators(prev => [...prev, data.id]);
        setNewCreatorName('');
      }
    } catch (err: any) {
      console.error("Failed to create creator:", err);
      setCreatorError(err.message || 'Failed to create creator. Name might already exist.');
    } finally {
      setIsCreatingCreator(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-400 mb-2">Item Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonPink" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Item Type</label>
        <select name="item_type" value={formData.item_type} onChange={handleChange} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonPink">
          <option value="cup">Waifu Cup</option>
          <option value="shirt">Shirt</option>
          <option value="deskmat">Deskmat</option>
          <option value="tub">Energy Tub</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Collection</label>
        <select name="collection_id" value={formData.collection_id} onChange={handleChange} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonPink">
          <option value="">None / Base</option>
          {collections.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonPink" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Retail Price ($)</label>
        <input type="number" step="0.01" name="retail_price" value={formData.retail_price} onChange={handleChange} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonPink" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Season</label>
        <input type="text" name="season" value={formData.season || ''} onChange={handleChange} placeholder="e.g. Season 4" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonPink" />
      </div>

      <AdminArtistManager 
        currentArtistId={formData.artist}
        onArtistSelected={(uuid) => setFormData({ ...formData, artist: uuid })} 
      />

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Material</label>
        <input type="text" name="material" value={formData.material || ''} onChange={handleChange} placeholder="e.g. Plastic, Vinyl" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonPink" />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-400 mb-2">Associated Creators</label>
        
        {/* Quick Add Creator Input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newCreatorName}
            onChange={(e) => setNewCreatorName(e.target.value)}
            placeholder="Quick add new creator..."
            className="flex-grow bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-neonPink"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreateCreator();
              }
            }}
          />
          <button
            type="button"
            onClick={handleCreateCreator}
            disabled={isCreatingCreator || !newCreatorName.trim()}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isCreatingCreator ? 'Adding...' : 'Add'}
          </button>
        </div>
        {creatorError && <p className="text-red-400 text-xs mb-2">{creatorError}</p>}

        {/* Existing Creators List */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableCreators.map(creator => (
            <label key={creator.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-900 rounded-md transition-colors">
              <input
                type="checkbox"
                checked={selectedCreators.includes(creator.id)}
                onChange={() => toggleCreator(creator.id)}
                className="w-4 h-4 accent-neonPink bg-gray-900 border-gray-700 rounded"
              />
              <span className="text-white text-sm">{creator.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 flex gap-8 p-4 bg-gray-950 rounded-lg border border-gray-800">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="limited" checked={formData.limited} onChange={handleChange} className="w-5 h-5 accent-neonPink bg-gray-900 border-gray-700 rounded" />
          <span className="text-white font-medium">Limited Edition</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="retired" checked={formData.retired} onChange={handleChange} className="w-5 h-5 accent-neonPink bg-gray-900 border-gray-700 rounded" />
          <span className="text-white font-medium">Retired Design</span>
        </label>
      </div>
    </div>
  );
}