'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminEntitySearch from '@/features/admin/AdminEntitySearch';
import AdminItemForm from '@/features/admin/AdminItemForm';

export default function EditItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. Read the sort option from the URL, fallback to 'a-z'
  const sortOption = (searchParams.get('sort') as 'a-z' | 'recent' | 'missing') || 'a-z';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [itemData, setItemData] = useState<any | null>(null);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Fetch all items on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoadingList(true);
      const { data, error } = await supabase
        .from('items')
        .select('id, name, created_at, image_url')
        .order('name');
      
      if (data) setAllItems(data);
      setLoadingList(false);
    };
    fetchAll();
  }, []);

  // Fetch full details when an ID is selected
  useEffect(() => {
    if (selectedId) {
      const fetchItem = async () => {
        const { data, error } = await supabase
          .from('items')
          .select(`
            *,
            item_images ( id, image_url, display_order ),
            item_creators ( creator:creators ( id, name ) ),
            item_artist ( role, artist:artists ( id, name ) )
          `)
          .eq('id', selectedId)
          .single();
                   
        if (error) {
          console.error("Error fetching item:", error);
          return;
        }
        
        const formattedData = {
          ...data,
          creators: data.item_creators?.map((ic: any) => ic.creator) || [],
          artists: data.item_artist?.map((ia: any) => ({
            id: ia.artist?.id,
            name: ia.artist?.name,
            role: ia.role
          })) || []
        };
        setItemData(formattedData);
      };
      fetchItem();
    }
  }, [selectedId]);

  // Process the list locally based on the selected sort option
  const displayedItems = useMemo(() => {
    let processed = [...allItems];
    
    if (sortOption === 'missing') {
      processed = processed.filter(item => !item.image_url);
    } else if (sortOption === 'recent') {
      processed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      processed.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    
    return processed;
  }, [allItems, sortOption]);

  // 2. Handle changing the sort option to update the URL
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'a-z') {
      params.delete('sort'); // Keep the URL clean if it's the default
    } else {
      params.set('sort', newSort);
    }
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl text-vaporPink font-bold mb-6">Admin: Edit Item</h1>
             
      {!selectedId ? (
        <div className="space-y-8">
          <AdminEntitySearch 
            tableName="items"
            searchColumn="name"
            onSelect={setSelectedId}
            placeholder="Search items by name..."
          />
          
          <div className="bg-vaporCard p-6 rounded-xl border border-vaporBorder shadow-lg">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-vaporText font-bold uppercase tracking-wider">
                All Items <span className="text-vaporPink">({displayedItems.length})</span>
              </h2>
              
              <select
                value={sortOption}
                onChange={handleSortChange} // 3. Use the new handler here
                className="bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-2 rounded-lg focus:outline-none focus:border-vaporCyan text-sm w-full sm:w-auto transition-colors"
              >
                <option value="a-z">A-Z (Alphabetical)</option>
                <option value="recent">Recently Added</option>
                <option value="missing">Missing Images</option>
              </select>
            </div>

            {loadingList ? (
                <p className="text-vaporCyan animate-pulse text-sm font-bold">LOADING CATALOG...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-vaporPink/50">
                    {displayedItems.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => setSelectedId(item.id)}
                            className={`text-left text-sm p-3 rounded-lg transition-colors flex items-center justify-between group ${
                              !item.image_url && sortOption !== 'missing' 
                                ? 'border border-red-500/30 bg-red-500/10 hover:bg-red-500/20' 
                                : 'bg-[#0A0710] border border-transparent hover:border-vaporCyan hover:bg-vaporCyan/10'
                            }`}
                        >
                            <span className="text-vaporText group-hover:text-vaporCyan truncate pr-2">{item.name}</span>
                            
                            {!item.image_url && (
                              <span className="text-[9px] text-red-400 bg-red-900/40 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap font-bold">
                                NO IMG
                              </span>
                            )}
                        </button>
                    ))}
                    {displayedItems.length === 0 && (
                      <div className="col-span-full text-center py-8 text-vaporMuted border border-dashed border-vaporBorder rounded-lg">
                        No items match this filter. You're all caught up!
                      </div>
                    )}
                </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <button 
            onClick={() => {
              setSelectedId(null);
              setItemData(null);
            }} 
            className="text-vaporMuted mb-6 hover:text-vaporPink transition-colors font-bold uppercase tracking-wider text-sm flex items-center gap-2"
          >
              &larr; Back to List
          </button>
                     
          {itemData ? (
            <AdminItemForm 
              initialData={itemData}
              itemId={selectedId}
              onComplete={() => {
                setSelectedId(null);
                setItemData(null);
              }}
            />
          ) : (
            <p className="text-vaporCyan animate-pulse font-bold tracking-widest">DECRYPTING ITEM DATA...</p>
          )}
        </div>
      )}
    </div>
  );
}