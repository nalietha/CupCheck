// Not currently used, but this is the admin page for managing items in a grid format. 
// It includes filters for missing data and links to edit forms.

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Item = {
  id: string;
  name: string;
  image_url: string | null;
  artist_id: string | null;
  creator_id: string | null;
  is_creator_cup: boolean; 
};

type FilterType = 'all' | 'missing_image' | 'missing_artist' | 'missing_creator';

export default function AdminItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchItems() {
      // Adjust the select query to match your actual schema
      const { data, error } = await supabase
        .from('items')
        .select('id, name, image_url, artist_id, creator_id, is_creator_cup')
        .order('name', { ascending: true });

      if (data) setItems(data);
      setLoading(false);
    }
    
    fetchItems();
  }, []);

  // 1. Filter Logic
  const filteredItems = items.filter((item) => {
    // Search text match
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Missing data filters
    switch (activeFilter) {
      case 'missing_image':
        return !item.image_url;
      case 'missing_artist':
        return !item.artist_id;
      case 'missing_creator':
        // Only flag it if it IS a creator cup, but lacks a creator_id
        return item.is_creator_cup && !item.creator_id;
      case 'all':
      default:
        return true;
    }
  });

  // 2. Helper to render warning badges on the cards
  const renderWarnings = (item: Item) => {
    const warnings = [];
    if (!item.image_url) warnings.push('No Image');
    if (!item.artist_id) warnings.push('No Artist');
    if (item.is_creator_cup && !item.creator_id) warnings.push('No Creator');

    if (warnings.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {warnings.map((w, i) => (
          <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-red-900/50 text-red-400 border border-red-500/50 px-2 py-0.5 rounded-sm">
            {w}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-widest text-vaporText mb-2 drop-shadow-[0_0_10px_rgba(1,205,254,0.3)]">
            ITEM INVENTORY
          </h1>
          <p className="text-vaporMuted">Manage your database and fix missing data.</p>
        </div>

        {/* Global Action */}
        <Link 
          href="/admin/items/new" 
          className="bg-vaporPink text-white px-6 py-2 rounded font-bold tracking-widest hover:bg-pink-600 transition-colors"
        >
          + NEW ITEM
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="bg-vaporCard border border-vaporBorder rounded-lg p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-2 rounded focus:outline-none focus:border-vaporCyan"
        />

        {/* Filters */}
        <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 md:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded text-sm font-bold uppercase whitespace-nowrap transition-colors ${
              activeFilter === 'all' ? 'bg-vaporCyan text-black' : 'text-vaporMuted hover:text-vaporText bg-[#0A0710]'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveFilter('missing_image')}
            className={`px-4 py-2 rounded text-sm font-bold uppercase whitespace-nowrap transition-colors ${
              activeFilter === 'missing_image' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-vaporMuted hover:text-red-400 bg-[#0A0710]'
            }`}
          >
            Missing Image
          </button>
          <button
            onClick={() => setActiveFilter('missing_artist')}
            className={`px-4 py-2 rounded text-sm font-bold uppercase whitespace-nowrap transition-colors ${
              activeFilter === 'missing_artist' ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'text-vaporMuted hover:text-orange-400 bg-[#0A0710]'
            }`}
          >
            Missing Artist
          </button>
          <button
            onClick={() => setActiveFilter('missing_creator')}
            className={`px-4 py-2 rounded text-sm font-bold uppercase whitespace-nowrap transition-colors ${
              activeFilter === 'missing_creator' ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'text-vaporMuted hover:text-yellow-400 bg-[#0A0710]'
            }`}
          >
            Missing Creator
          </button>
        </div>
        
        <div className="ml-auto text-vaporMuted text-sm">
          Showing: <span className="text-vaporText font-bold">{filteredItems.length}</span> items
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="flex justify-center py-20 text-vaporCyan">Loading Data...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/admin/items/edit/${item.id}`} // Links to your edit form
              className="bg-vaporCard border border-vaporBorder rounded-lg overflow-hidden group hover:border-vaporCyan transition-all flex flex-col"
            >
              {/* Image Area */}
              <div className="aspect-square bg-black relative border-b border-vaporBorder/50">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-vaporMuted/30 flex-col">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="text-xs uppercase font-bold tracking-widest">No Image</span>
                  </div>
                )}
                
                {/* Creator Cup Badge indicator */}
                {item.is_creator_cup && (
                  <div className="absolute top-2 right-2 bg-vaporPink/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm">
                    Cup
                  </div>
                )}
              </div>

              {/* Data Area */}
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-vaporText font-bold truncate text-sm" title={item.name}>
                  {item.name}
                </h3>
                
                <div className="mt-auto pt-2">
                  {renderWarnings(item)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-20 text-vaporMuted border border-dashed border-vaporBorder rounded-xl">
          No items found for this filter. You're all caught up!
        </div>
      )}
    </div>
  );
}