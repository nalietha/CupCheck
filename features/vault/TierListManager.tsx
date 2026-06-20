'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { supabase } from '@/lib/supabase';

interface TubItem {
  id: string;
  name: string;
  image_url: string;
  tier: string; // 'S', 'A', 'B', 'C', 'D', 'F', or 'unranked'
}

interface TierListManagerProps {
  initialItems: TubItem[];
  isOwner: boolean;
  userId: string;
}

const TIER_COLORS: Record<string, string> = {
  S: 'border-pink-500 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]',
  A: 'border-orange-400 text-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.4)]',
  B: 'border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]',
  C: 'border-green-400 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.4)]',
  D: 'border-blue-400 text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.4)]',
  F: 'border-gray-500 text-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]',
};

export default function TierListManager({ initialItems, isOwner, userId }: TierListManagerProps) {
  const [items, setItems] = useState<TubItem[]>(initialItems);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !isOwner) return;

    const itemId = active.id as string;
    const newTier = over.id as string;

    // 1. Optimistically update the UI
    setItems((prev) => 
      prev.map((item) => item.id === itemId ? { ...item, tier: newTier } : item)
    );

    // 2. Save to Supabase (Only if moving to an actual tier)
    if (newTier !== 'unranked') {
      const { error } = await supabase.from('flavor_tier_lists').upsert(
        { user_id: userId, item_id: itemId, tier: newTier },
        { onConflict: 'user_id, item_id' }
      );
      if (error) console.error("Error saving tier:", error);
    } else {
      // If moving back to unranked, delete the record
      const { error } = await supabase.from('flavor_tier_lists')
        .delete()
        .eq('user_id', userId)
        .eq('item_id', itemId);
      if (error) console.error("Error removing tier:", error);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="space-y-4 mb-12">
        {Object.keys(TIER_COLORS).map((tierId) => (
          <TierRow 
            key={tierId} 
            id={tierId} 
            label={tierId} 
            colorClass={TIER_COLORS[tierId]} 
            items={items.filter(i => i.tier === tierId)} 
            isOwner={isOwner}
          />
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-vaporBorder">
        <h3 className="text-xl font-bold text-vaporCyan mb-6 uppercase tracking-widest">
          {isOwner ? 'Unranked Tubs (Drag to Tier)' : 'Unranked Tubs'}
        </h3>
        <TierRow 
          id="unranked" 
          label="POOL" 
          colorClass="border-vaporBorder text-vaporMuted" 
          items={items.filter(i => i.tier === 'unranked')} 
          isOwner={isOwner}
        />
      </div>
    </DndContext>
  );
}

// --- SUB-COMPONENTS ---

function TierRow({ id, label, colorClass, items, isOwner }: { id: string, label: string, colorClass: string, items: TubItem[], isOwner: boolean }) {
  // Setup drop zone
  const { setNodeRef } = useDroppable({ id, disabled: !isOwner });

  return (
    <div ref={setNodeRef} className="flex min-h-[120px] bg-black/40 border border-vaporBorder rounded-xl overflow-hidden shadow-sm">
      {/* Tier Label Box */}
      <div className={`w-24 md:w-32 flex-shrink-0 flex items-center justify-center bg-[#0A0710] border-r-4 ${colorClass}`}>
        <span className="text-3xl md:text-5xl font-black italic">{label}</span>
      </div>
      
      {/* Items Container */}
      <div className="flex-grow p-4 flex flex-wrap gap-4 items-center">
        {items.map((item) => (
          <DraggableTub key={item.id} item={item} isOwner={isOwner} />
        ))}
        {items.length === 0 && (
          <span className="text-vaporMuted italic text-sm">Drop items here</span>
        )}
      </div>
    </div>
  );
}

function DraggableTub({ item, isOwner }: { item: TubItem, isOwner: boolean }) {
  // Setup drag source
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: !isOwner
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      title={item.name}
      className={`relative w-20 h-20 md:w-24 md:h-24 bg-vaporCard border border-vaporBorder rounded-lg overflow-hidden group 
        ${isOwner ? 'cursor-grab active:cursor-grabbing hover:border-vaporCyan' : ''} 
        ${isDragging ? 'opacity-50 scale-110 shadow-neon' : 'shadow-md'} transition-all duration-200`}
    >
      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover p-1" />
      
      {/* Tooltip on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[10px] text-center text-vaporText truncate px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.name}
      </div>
    </div>
  );
}