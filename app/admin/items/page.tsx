'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Component imports
import AdminEntitySearch from '@/features/admin/AdminEntitySearch';
import AdminItemForm from '@/features/admin/AdminItemForm';

export default function EditItemPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [itemData, setItemData] = useState<any | null>(null); // Changed to 'any' to easily hold relational arrays

  useEffect(() => {
    if (selectedId) {
      const fetchItem = async () => {
        // Fetch the item AND all its relational data
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

        // Flatten the Supabase join data so it matches what AdminItemForm expects
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
        <AdminEntitySearch 
          tableName="items"
          searchColumn="name"
          onSelect={setSelectedId} // FIX 1: Use onSelect instead of baseRoute
          placeholder="Search items by name..."
        />
      ) : (
        <div>
          <button 
            onClick={() => {
              setSelectedId(null);
              setItemData(null); 
            }} 
            className="text-vaporMuted mb-4 hover:text-vaporText transition-colors"
          >
              &larr; Back to Search
          </button>
          
          {itemData ? (
            <AdminItemForm 
              initialData={itemData} 
              itemId={selectedId} // FIX 2: Pass the ID so it UPDATES instead of INSERTS
              onComplete={() => {
                // Optional: Auto-return to search when done
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