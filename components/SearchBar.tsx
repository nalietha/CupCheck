
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get the current search from the URL if it exists
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Update the URL to include the search query
      router.push(`/?q=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group mt-6 w-full">
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search cups, seasons, creators..." 
        className="w-full bg-[#0A0710] border-2 border-vaporBorder text-vaporText px-6 py-4 rounded-full focus:outline-none focus:border-vaporCyan focus:shadow-[0_0_20px_rgba(1,205,254,0.3)] transition-all placeholder-vaporMuted/50"
      />
      <button type="submit" className="absolute right-6 top-4 text-vaporMuted text-xl hover:text-vaporCyan transition-colors">
        🔍
      </button>
    </form>
  );
}