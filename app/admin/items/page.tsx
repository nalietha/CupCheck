'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminEntitySearch from '@/features/admin/AdminEntitySearch';
import AdminItemForm from '@/features/admin/AdminItemForm';

export default function EditItemPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [itemData, setItemData] = useState<any | null>(null);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // 1. Fetch all items on mount so they are ready to view/select
  useEffect(() => {
    const fetchAll = async () => {
      setLoadingList(true);
      const { data, error } = await supabase
        .from('items')
        .select('id, name')
        .order('name');
      
      if (data) setAllItems(data);
      setLoadingList(false);
    };
    fetchAll();
  }, []);

  // 2. Fetch full details when an ID is selected
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

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl text-vaporPink font-bold mb-6">Admin: Edit Item</h1>
             
      {!selectedId ? (
        <div className="space-y-8">
          {/* Keep the search for quick finding */}
          <AdminEntitySearch 
            tableName="items"
            searchColumn="name"
            onSelect={setSelectedId}
            placeholder="Search items by name..."
          />
          
          {/* New: Quick list of all items */}
          <div className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
            <h2 className="text-vaporText font-bold mb-4">All Items ({allItems.length})</h2>
            {loadingList ? (
                <p className="text-vaporMuted">Loading catalog...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allItems.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => setSelectedId(item.id)}
                            className="text-left text-sm p-2 bg-vaporBg hover:bg-vaporCyan/20 rounded text-vaporText hover:text-vaporCyan transition-colors"
                        >
                            {item.name}
                        </button>
                    ))}
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
            className="text-vaporMuted mb-4 hover:text-vaporText transition-colors"
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
            <p className="text-vaporCyan animate-pulse font-bold">Loading item details...</p>
          )}
        </div>
      )}
    </div>
  );
}