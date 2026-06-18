'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  [key: string]: any;
}

interface AdminEntitySearchProps {
  tableName: string;           // The Supabase table to query (e.g., 'items', 'creators')
  searchColumn?: string;       // The column to search against (defaults to 'name')
  displayColumn?: string;      // The column to display in the UI (defaults to 'name')
  baseRoute?: string;          // Optional: If provided, routes to `${baseRoute}/${id}`
  onSelect?: (id: string) => void; // Optional: If provided, triggers state change instead of routing
  placeholder?: string;
}

export default function AdminEntitySearch({
  tableName,
  searchColumn = 'name',
  displayColumn = 'name',
  baseRoute,
  onSelect,
  placeholder = 'Search...'
}: AdminEntitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const { data, error } = await supabase
      .from(tableName)
      .select(`id, ${displayColumn}`)
      .ilike(searchColumn, `%${query}%`)
      .limit(10); // Keep payloads light

    if (error) {
      console.error(`Error searching ${tableName}:`, error);
      return;
    }

    setResults(data || []);
  };

  const handleResultClick = (id: string) => {
    if (onSelect) {
      onSelect(id);
    } else if (baseRoute) {
      router.push(`${baseRoute}/${id}`);
    }
  };

  return (
    <div className="bg-vaporCard p-6 rounded-xl border border-vaporBorder shadow-lg">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input 
          className="bg-vaporBg border border-gray-700 p-3 rounded-lg text-vaporText w-full focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-pink-600 hover:bg-pink-500 px-6 py-2 rounded-lg font-bold text-vaporText transition-colors">
          Search
        </button>
      </form>
      
      {results.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-vaporBorder pt-4">
          {results.map((item) => (
            <button 
              key={item.id} 
              type="button"
              onClick={() => handleResultClick(item.id)}
              className="block w-full text-left p-3 rounded-lg bg-vaporBg border border-vaporBorder hover:border-cyan-500 text-vaporCyan hover:text-cyan-300 transition-all"
            >
              {item[displayColumn]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}