'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
// Component imports
import AdminItemSearch from '@/components/AdminItemSearch';
import AdminItemForm from '@/components/AdminItemForm'; 
// Interfaces imports
import { Item } from '@/types';

export default function EditItemPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [itemData, setItemData] = useState<Item | null>(null);

  useEffect(() => {
    if (selectedId) {
      const fetchItem = async () => {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('id', selectedId)
          .single();
        
        if (error) {
          console.error("Error fetching item:", error);
          return;
        }

        setItemData(data as Item);
      };
      fetchItem();
    }
  }, [selectedId]);

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl text-vaporPink font-bold mb-6">Admin: Edit Item</h1>
      
      {!selectedId ? (
        <AdminItemSearch onSelect={setSelectedId} />
      ) : (
        <div>
          <button 
            onClick={() => {
              setSelectedId(null);
              setItemData(null); 
            }} 
            className="text-vaporMuted mb-4 hover:text-white transition-colors"
          >
            ← Back to Search
          </button>
          
          {itemData ? (
            <AdminItemForm initialData={itemData} />
          ) : (
            <p className="text-vaporCyan animate-pulse font-bold">Loading item details...</p>
          )}
        </div>
      )}
    </div>
  );
}