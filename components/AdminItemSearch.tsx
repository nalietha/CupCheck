'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
// Interfces imports
import { SearchResult } from '@/types';

// TODO: Move to types/index.tsx
interface AdminItemSearchProps {
  onSelect: (id: string) => void;
}

export default function AdminItemSearch({ onSelect }: AdminItemSearchProps) {
  const [query, setQuery] = useState('');
  
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('items')
      .select('id, name')
      .ilike('name', `%${query}%`);

    if (error) {
      console.error("Error searching items:", error);
      return;
    }

    setResults(data || []);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-pink-500/20">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input 
          className="bg-gray-800 p-2 rounded text-white w-full"
          placeholder="Search for item to edit..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-pink-600 px-4 py-2 rounded font-bold">
          Search
        </button>
      </form>
      <div className="mt-4 space-y-1">
        {results.map((item) => (
          <button 
            key={item.id} 
            onClick={() => onSelect(item.id)}
            className="block w-full text-left p-3 rounded hover:bg-gray-800 text-cyan-400 transition-colors"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}