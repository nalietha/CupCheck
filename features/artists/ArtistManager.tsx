'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// 1. We include your exact helper function here!
async function getOrCreateArtist(artistName: string) {
  const cleanName = artistName.trim();
  if (!cleanName) return null;

  const { data: existingArtist } = await supabase
    .from('artists')
    .select('id')
    .ilike('name', cleanName)
    .single();

  if (existingArtist) return existingArtist.id;

  const { data: newArtist, error } = await supabase
    .from('artists')
    .insert([{ name: cleanName }])
    .select('id')
    .single();

  if (error || !newArtist) {
    console.error("Failed to create artist:", error);
    return null;
  }
  return newArtist.id;
}

// 2. The Component Interface
interface AdminArtistManagerProps {
  currentArtistId: string;
  onArtistSelected: (uuid: string) => void;
}

export default function AdminArtistManager({ currentArtistId, onArtistSelected }: AdminArtistManagerProps) {
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([]);
  const [newArtistName, setNewArtistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all existing artists when the component loads
  useEffect(() => {
    const fetchArtists = async () => {
      const { data } = await supabase
        .from('artists')
        .select('id, name')
        .order('name'); // Alphabetical order makes it easier for admins
      
      if (data) setArtists(data);
    };
    fetchArtists();
  }, []);

  // Handle the Quick Add button
  const handleQuickAdd = async () => {
    if (!newArtistName.trim()) return;
    setIsCreating(true);
    
    // Run your helper function
    const newId = await getOrCreateArtist(newArtistName);
    
    if (newId) {
      // Add the new artist to our local dropdown list immediately
      setArtists((prev) => [...prev, { id: newId, name: newArtistName.trim() }].sort((a, b) => a.name.localeCompare(b.name)));
      
      // Tell the parent form that this new UUID is the selected one
      onArtistSelected(newId);
      
      // Clear the input
      setNewArtistName('');
    }
    setIsCreating(false);
  };

  return (
    <div className="space-y-3 bg-vaporBg/50 p-4 rounded-lg border border-vaporBorder">
      <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
        Assigned Artist
      </label>

      {/* Dropdown for Existing Artists */}
      <select
        value={currentArtistId || ''}
        onChange={(e) => onArtistSelected(e.target.value)}
        className="w-full bg-vaporCard border border-gray-700 text-vaporText text-sm rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-2.5 transition-colors"
      >
        <option value="">-- Select an Artist --</option>
        {artists.map((artist) => (
          <option key={artist.id} value={artist.id}>
            {artist.name}
          </option>
        ))}
      </select>

      {/* Quick Add for New Artists */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Or quick-add new artist..."
          value={newArtistName}
          onChange={(e) => setNewArtistName(e.target.value)}
          onKeyDown={(e) => {
            // Allow pressing 'Enter' to submit, but prevent it from submitting the whole parent item form!
            if (e.key === 'Enter') {
              e.preventDefault(); 
              handleQuickAdd();
            }
          }}
          className="flex-grow bg-vaporCard border border-gray-700 text-vaporText text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2.5 transition-colors"
        />
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isCreating || !newArtistName.trim()}
          className="px-4 py-2 bg-vaporCard hover:bg-pink-600 text-vaporText text-sm font-medium rounded-lg border border-gray-700 hover:border-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  );
}