import { useState, useMemo } from 'react';
import { VaultItem } from '@/types';

export function useVaultFilters(vaultItems: VaultItem[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const uniqueItemTypes = useMemo(() => {
    // Safely extract unique item types
    if (!vaultItems || vaultItems.length === 0) return [];
    return Array.from(new Set(vaultItems.map(item => item.item_type).filter(Boolean)));
  }, [vaultItems]);

  const processedItems = useMemo(() => {
    // Safety check for empty arrays
    if (!vaultItems || vaultItems.length === 0) return [];

    let items = [...vaultItems];

    // 1. Search Filter (Safe name check)
    if (searchQuery) {
      items = items.filter(item => 
        (item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 2. Type Filter
    if (filterType !== 'all') {
      items = items.filter(item => item.item_type === filterType);
    }

    // 3. Sort Logic (Safe string and number checks)
    items.sort((a, b) => {
      switch (sortBy) {
        case 'newest': 
          return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
        case 'oldest': 
          return new Date(a.added_at).getTime() - new Date(b.added_at).getTime();
        case 'price-desc': 
          return Number(b.retail_price || 0) - Number(a.retail_price || 0);
        case 'price-asc': 
          return Number(a.retail_price || 0) - Number(b.retail_price || 0);
        case 'name-asc': 
          // Provide fallback empty strings for localeCompare
          return (a.name || "").localeCompare(b.name || "");
        case 'name-desc': 
          // Provide fallback empty strings for localeCompare
          return (b.name || "").localeCompare(a.name || "");
        default: 
          return 0;
      }
    });

    return items;
  }, [vaultItems, searchQuery, filterType, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
  };

  return {
    searchQuery, setSearchQuery,
    filterType, setFilterType,
    sortBy, setSortBy,
    uniqueItemTypes,
    processedItems,
    clearFilters
  };
}