import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ItemType {
  value: string;
  label: string;
}

export function useItemTypes() {
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      const { data, error } = await supabase
        .from('item_types')
        .select('value, label')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching item types:', error);
      } else if (data) {
        setItemTypes(data);
      }
      setLoading(false);
    };

    fetchTypes();
  }, []);

  return { itemTypes, loading };
}