'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminArtistManager from '@/features/artists/ArtistManager';

interface AdminItemMetadataFormProps {
  formData: any;
  setFormData: (data: any) => void;
  selectedCreators: { id?: string; name: string }[];
  setSelectedCreators: (creators: { id?: string; name: string }[]) => void;
}

export default function AdminItemMetadataForm({
  formData,
  setFormData,
  selectedCreators,
  setSelectedCreators,
}: AdminItemMetadataFormProps) {
  
  // --- STATE ---
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [availableCreators, setAvailableCreators] = useState<{ id: string; name: string }[]>([]);

  // --- CREATOR SEARCH STATE ---
  const [creatorInput, setCreatorInput] = useState('');
  const [filteredCreators, setFilteredCreators] = useState<{ id: string; name: string }[]>([]);

  // Fetch Collections and Creators on component mount
  useEffect(() => {
    const fetchData = async () => {
      const [colRes, creRes] = await Promise.all([
        supabase.from('collections').select('id, name'),
        supabase.from('creators').select('id, name').order('name'),
      ]);
      if (colRes.data) setCollections(colRes.data);
      if (creRes.data) setAvailableCreators(creRes.data);
    };
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev: any) => ({ ...prev, [name]: val }));
  };

  // Handle the Search/Filtering logic as the user types
  const handleCreatorSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCreatorInput(input);

    if (input.trim() === '') {
      setFilteredCreators([]);
      return;
    }

    // Filter creators that match the text, but hide ones already selected
    const matches = availableCreators.filter(
      (c) =>
        c.name.toLowerCase().includes(input.toLowerCase()) &&
        !selectedCreators.some((selected) => selected.id === c.id)
    );
    setFilteredCreators(matches);
  };

  // Add an existing creator from the dropdown or an exact match
  const addCreator = (creator: { id?: string; name: string }) => {
    if (!selectedCreators.some((c) => c.name.toLowerCase() === creator.name.toLowerCase())) {
      setSelectedCreators([...selectedCreators, creator]);
    }
    setCreatorInput(''); // Clear the text box
    setFilteredCreators([]); // Hide the dropdown
  };

  // Allow pressing "Enter" to quick-add a brand new creator
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (creatorInput.trim() !== '') {
        // Check if they typed an exact match first
        const exactMatch = availableCreators.find(
          (c) => c.name.toLowerCase() === creatorInput.toLowerCase()
        );
        if (exactMatch) {
          addCreator(exactMatch);
        } else {
          // If no match, add as a new creator (no ID yet)
          addCreator({ name: creatorInput.trim() });
        }
      }
    }
  };

  const removeCreator = (nameToRemove: string) => {
    setSelectedCreators(selectedCreators.filter((c) => c.name !== nameToRemove));
  };

  // --- RENDER ---
  return (
    <div className="bg-vaporCard p-6 rounded-xl border border-vaporBorder grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-vaporMuted mb-2">Item Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
          className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-vaporMuted mb-2">Item Type</label>
        <select
          name="item_type"
          value={formData.item_type || 'cup'}
          onChange={handleChange}
          className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink"
        >
          <option value="cup">Waifu Cup</option>
          <option value="shirt">Shirt</option>
          <option value="deskmat">Deskmat</option>
          <option value="tub">Energy Tub</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-vaporMuted mb-2">Collection</label>
        <select
          name="collection_id"
          value={formData.collection_id || ''}
          onChange={handleChange}
          className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink"
        >
          <option value="">None / Base</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-vaporMuted mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-vaporMuted mb-2">Retail Price ($)</label>
        <input
          type="number"
          step="0.01"
          name="retail_price"
          value={formData.retail_price || ''}
          onChange={handleChange}
          className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-vaporMuted mb-2">Season</label>
        <input
          type="text"
          name="season"
          value={formData.season || ''}
          onChange={handleChange}
          placeholder="e.g. Season 4"
          className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink"
        />
      </div>

      <AdminArtistManager
        currentArtistId={formData.artist}
        onArtistSelected={(uuid) => setFormData({ ...formData, artist: uuid })}
      />

      <div>
        <label className="block text-sm font-medium text-vaporMuted mb-2">Material</label>
        <input
          type="text"
          name="material"
          value={formData.material || ''}
          onChange={handleChange}
          placeholder="e.g. Plastic, Vinyl"
          className="w-full bg-vaporBg border border-vaporBorder rounded-lg px-4 py-2 text-vaporText focus:outline-none focus:border-neonPink"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-vaporMuted mb-2">Associated Creators</label>

        {/* --- DATE RELEASED FIELD --- */}
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-semibold text-gray-300">Date Released</label>
          <input
            type="date"
            value={formData.release_date || ''}
            onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
            className="p-2 bg-vaporCard border border-gray-700 rounded text-vaporText focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* --- SMART CREATOR SECTION --- */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-sm font-semibold text-gray-300">Creators</label>

          {/* 1. The Search Textbox */}
          <input
            type="text"
            value={creatorInput}
            onChange={handleCreatorSearch}
            onKeyDown={handleKeyDown}
            placeholder="Search creators or type and press Enter to add new..."
            className="p-2 bg-vaporCard border border-gray-700 rounded text-vaporText focus:outline-none focus:border-pink-500"
          />

          {/* 2. Selected Creators */}
          {selectedCreators.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCreators.map((creator, idx) => (
                <div
                  key={creator.id || idx}
                  className="flex items-center gap-2 bg-pink-500/20 border border-pink-500 text-pink-300 px-3 py-1 rounded-full text-sm"
                >
                  <span>{creator.name}</span>
                  <button
                    type="button"
                    onClick={() => removeCreator(creator.name)}
                    className="text-pink-400 hover:text-vaporText font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 3. The Search Results Dropdown */}
          {filteredCreators.length > 0 && (
            <ul className="absolute z-10 w-full mt-[70px] bg-vaporCard border border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredCreators.map((creator) => (
                <li
                  key={creator.id}
                  onClick={() => addCreator(creator)}
                  className="p-2 cursor-pointer hover:bg-gray-700 text-gray-200 transition-colors"
                >
                  {creator.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="md:col-span-2 flex gap-8 p-4 bg-vaporBg rounded-lg border border-vaporBorder">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="limited"
            checked={formData.limited || false}
            onChange={handleChange}
            className="w-5 h-5 accent-neonPink bg-vaporCard border-gray-700 rounded"
          />
          <span className="text-vaporText font-medium">Limited Edition</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="retired"
            checked={formData.retired || false}
            onChange={handleChange}
            className="w-5 h-5 accent-neonPink bg-vaporCard border-gray-700 rounded"
          />
          <span className="text-vaporText font-medium">Retired Design</span>
        </label>
      </div>
    </div>
  );
}