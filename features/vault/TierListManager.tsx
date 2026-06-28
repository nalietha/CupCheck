'use client';

import { useState } from 'react';
// 1. Import the sensor hooks
import { DndContext, DragEndEvent, useDraggable, useDroppable, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { TierListService, TierListItem } from '@/lib/services/TierListService';

interface TierListManagerProps {
  initialItems: TierListItem[];
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
  const [items, setItems] = useState<TierListItem[]>(initialItems);

  // 2. Configure the sensors
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }, // Require 10px of movement before dragging
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 }, // Press and hold for 250ms on mobile
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !isOwner) return;

    const itemId = active.id as string;
    const newTier = over.id as string;

    setItems((prev) => 
      prev.map((item) => item.item_id === itemId ? { ...item, tier: newTier } : item)
    );

    try {
      await TierListService.updateSingleItemTier(userId, itemId, newTier);
    } catch (error) {
      console.error("Failed to synchronize tier placement:", error);
    }
  };

  return (
    // 3. Apply the sensors to the context
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
          {isOwner ? 'Unranked Tubs (Press & Hold to Drag)' : 'Unranked Tubs'}
        </h3>
        <TierRow 
          id="UNRANKED" 
          label="POOL" 
          colorClass="border-vaporBorder text-vaporMuted" 
          items={items.filter(i => i.tier === 'UNRANKED')} 
          isOwner={isOwner}
        />
      </div>
    </DndContext>
  );
}

function TierRow({ id, label, colorClass, items, isOwner }: { id: string, label: string, colorClass: string, items: TierListItem[], isOwner: boolean }) {
  const { setNodeRef } = useDroppable({ id, disabled: !isOwner });

  return (
    <div ref={setNodeRef} className="flex min-h-[120px] bg-black/40 border border-vaporBorder rounded-xl overflow-hidden shadow-sm">
      <div className={`w-24 md:w-32 flex-shrink-0 flex items-center justify-center bg-[#0A0710] border-r-4 ${colorClass}`}>
        <span className="text-3xl md:text-5xl font-black italic">{label}</span>
      </div>
      
      <div className="flex-grow p-4 flex flex-wrap gap-4 items-center">
        {items.map((item) => (
          <DraggableTub key={item.item_id} item={item} isOwner={isOwner} />
        ))}
        {items.length === 0 && (
          <span className="text-vaporMuted italic text-sm">Drop items here</span>
        )}
      </div>
    </div>
  );
}

function DraggableTub({ item, isOwner }: { item: TierListItem, isOwner: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.item_id,
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
      
      <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[10px] text-center text-vaporText truncate px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.name}
      </div>
    </div>
  );
}