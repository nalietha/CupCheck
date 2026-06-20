'use client';

import { useState } from 'react';
import { TierListService, TierListItem } from '@/lib/services/tierListService';

const TIERS = ['S', 'A', 'B', 'C', 'D', 'F'];
const TIER_COLORS: Record<string, string> = {
  S: 'bg-red-500',
  A: 'bg-orange-500',
  B: 'bg-yellow-500',
  C: 'bg-green-500',
  D: 'bg-blue-500',
  F: 'bg-purple-500',
};

interface TierListEditorProps {
  initialItems: TierListItem[];
  userId: string;
}

export default function TierListEditor({ initialItems, userId }: TierListEditorProps) {
  const [items, setItems] = useState<TierListItem[]>(initialItems);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // --- HTML5 Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('itemId', itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetTier: string) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('itemId');
    
    setItems(prev => prev.map(item => 
      item.item_id === draggedItemId ? { ...item, tier: targetTier } : item
    ));
  };

  // --- Save Handler ---
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await TierListService.saveTierList(userId, items);
      setSaveMessage('Tier list saved successfully!');
    } catch (error) {
      console.error(error);
      setSaveMessage('Failed to save tier list.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000); // Clear message after 3s
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-vaporCard p-4 rounded-xl border border-vaporBorder">
        <h2 className="text-2xl font-black italic text-vaporCyan uppercase tracking-widest">
          My Flavor Tier List
        </h2>
        <div className="flex items-center gap-4">
          {saveMessage && (
            <span className={`text-sm font-bold ${saveMessage.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
              {saveMessage}
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-neonPink hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Tier List'}
          </button>
        </div>
      </div>

      {/* --- RANKED TIERS --- */}
      <div className="bg-[#0B0914] rounded-xl border border-vaporBorder overflow-hidden flex flex-col gap-1">
        {TIERS.map(tier => (
          <div 
            key={tier} 
            className="flex min-h-[100px] border-b border-vaporBorder/50 last:border-0 bg-vaporCard/50"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, tier)}
          >
            {/* Tier Label Box */}
            <div className={`w-24 flex-shrink-0 flex items-center justify-center font-black text-3xl text-black ${TIER_COLORS[tier]}`}>
              {tier}
            </div>
            
            {/* Drop Zone for Items */}
            <div className="flex-1 p-2 flex flex-wrap gap-2 items-center">
              {items.filter(i => i.tier === tier).map(item => (
                <div 
                  key={item.item_id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.item_id)}
                  className="w-16 h-16 md:w-20 md:h-20 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform bg-vaporBg border border-vaporBorder rounded-md overflow-hidden group relative"
                  title={item.name}
                >
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[10px] text-center text-white truncate px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.name}
                  </div>
                </div>
              ))}
              {items.filter(i => i.tier === tier).length === 0 && (
                <span className="text-vaporMuted text-sm italic pl-4">Drag flavors here...</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- UNRANKED POOL --- */}
      <div 
        className="bg-vaporCard p-4 rounded-xl border border-vaporBorder min-h-[200px]"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'UNRANKED')}
      >
        <h3 className="text-vaporMuted font-bold mb-4 uppercase tracking-widest border-b border-vaporBorder pb-2">
          Unranked Flavors
        </h3>
        <div className="flex flex-wrap gap-3">
          {items.filter(i => i.tier === 'UNRANKED').map(item => (
            <div 
              key={item.item_id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.item_id)}
              className="w-16 h-16 md:w-20 md:h-20 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform bg-vaporBg border border-vaporBorder rounded-md overflow-hidden group relative"
              title={item.name}
            >
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[10px] text-center text-white truncate px-1">
                {item.name}
              </div>
            </div>
          ))}
          {items.filter(i => i.tier === 'UNRANKED').length === 0 && (
            <span className="text-vaporMuted text-sm italic">All flavors ranked!</span>
          )}
        </div>
      </div>
    </div>
  );
}