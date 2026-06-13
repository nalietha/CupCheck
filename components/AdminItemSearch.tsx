'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminItemSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const { data } = await supabase
      .from('items')
      .select('id, name')
      .ilike('name', `%${query}%`);
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
        <button type="submit" className="bg-pink-600 px-4 py-2 rounded">Search</button>
      </form>
      <div className="mt-4">
        {results.map((item) => (
          <button 
            key={item.id} 
            onClick={() => onSelect(item.id)}
            className="block w-full text-left p-2 hover:bg-gray-800 text-cyan-400"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}