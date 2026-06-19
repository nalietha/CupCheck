'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

// Pass in the data we got from the server, plus a boolean for ownership,
// and eventually an optional `customTheme` object from their equipped cosmetics.
export default function VaultItemDetails({ 
  vaultItem, 
  isOwner,
  customTheme 
}: { 
  vaultItem: any, 
  isOwner: boolean,
  customTheme?: { border?: string; shadow?: string; cardBg?: string; }
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local state for the form edits
  const [formData, setFormData] = useState({
    condition: vaultItem.condition || '',
    notes: vaultItem.notes || '',
    purchase_price: vaultItem.purchase_price || '',
    purchase_location: vaultItem.purchase_location || '',
    purchase_date: vaultItem.purchase_date || '',
    creator_code: vaultItem.creator_code || '',
  });

  // Determine which image to show (Custom user image vs Official item image)
  const displayImage = vaultItem.user_image_url || vaultItem.item.image_url;

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('user_collections')
      .update({
        condition: formData.condition,
        notes: formData.notes,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        purchase_location: formData.purchase_location,
        purchase_date: formData.purchase_date || null,
        creator_code: formData.creator_code,
      })
      .eq('id', vaultItem.id);

    setIsSaving(false);
    if (!error) {
      setIsEditing(false);
    } else {
      alert('Failed to save updates.');
    }
  };

  // Dynamic styling for unlockable themes
  const themeStyles = customTheme ? {
    borderColor: customTheme.border,
    boxShadow: customTheme.shadow,
    backgroundColor: customTheme.cardBg,
  } : {};

  return (
    <div 
      className="bg-vaporCard rounded-xl shadow-neon border border-vaporBorder overflow-hidden transition-all duration-500"
      style={themeStyles}
    >
      <div className="grid grid-cols-1 md:grid-cols-3">
        
        {/* Left Column: Image & Trophy Toggle */}
        <div className="bg-[#0A0710]/50 p-8 flex flex-col items-center justify-center border-r border-vaporBorder relative group">
          
          <div className="relative w-full max-w-sm aspect-square bg-vaporBg border border-vaporBorder rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,113,206,0.15)] flex items-center justify-center">
            <img 
              src={displayImage} 
              alt={vaultItem.item.name} 
              className="w-full h-full object-contain p-4 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
            {vaultItem.user_image_url && (
               <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-black px-2 py-1 rounded uppercase tracking-widest shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                 Trophy Image
               </div>
            )}
          </div>

          {/* {isOwner && (
            <button className="mt-6 theme-btn w-full py-2 text-sm">
              {vaultItem.user_image_url ? 'UPDATE TROPHY PHOTO' : 'UPLOAD TROPHY PHOTO'}
            </button>
          )} */}
        </div>

        {/* Right Column: Details & Form */}
        <div className="p-8 md:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-vaporBorder">
            <div>
              <h2 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink drop-shadow-[0_0_10px_rgba(1,205,254,0.3)]">
                {vaultItem.item.name}
              </h2>
              {vaultItem.item.collection_name && (
                <span className="inline-block mt-2 px-3 py-1 bg-vaporPurple/20 border border-vaporPurple/50 text-vaporText text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_8px_rgba(185,103,255,0.3)]">
                  {vaultItem.item.collection_name}
                </span>
              )}
            </div>
            
            {/* Edit Toggle for Owner */}
            {isOwner && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-transparent border-2 border-vaporCyan text-vaporCyan font-bold uppercase tracking-widest rounded-lg hover:bg-vaporCyan hover:text-[#0B0914] transition-all shadow-[0_0_10px_rgba(1,205,254,0.2)]"
              >
                EDIT DETAILS
              </button>
            )}
          </div>

          {/* VIEW MODE */}
          {!isEditing ? (
            <div className="grid grid-cols-2 gap-6 flex-grow">
              <div className="bg-[#0A0710] p-4 rounded-lg border border-vaporBorder">
                <h4 className="text-xs font-bold text-vaporPink uppercase tracking-widest mb-1">Condition</h4>
                <p className="text-vaporText font-medium">{vaultItem.condition || 'Not specified'}</p>
              </div>
              <div className="bg-[#0A0710] p-4 rounded-lg border border-vaporBorder">
                <h4 className="text-xs font-bold text-vaporCyan uppercase tracking-widest mb-1">Creator Code Used</h4>
                <p className="text-vaporText font-mono">{vaultItem.creator_code || 'None'}</p>
              </div>
              <div className="col-span-2 bg-[#0A0710] p-4 rounded-lg border border-vaporBorder">
                <h4 className="text-xs font-bold text-vaporPurple uppercase tracking-widest mb-1">Acquisition Log</h4>
                <p className="text-vaporText">
                  {vaultItem.purchase_price ? <span className="text-green-400 font-mono">${Number(vaultItem.purchase_price).toFixed(2)}</span> : ''}
                  {vaultItem.purchase_location ? ` secured from ${vaultItem.purchase_location}` : ''}
                </p>
                <p className="text-sm text-vaporMuted mt-1">{vaultItem.purchase_date}</p>
              </div>
              
              <div className="col-span-2">
                <h4 className="text-sm font-bold text-vaporMuted uppercase tracking-widest mb-2">Collector's Notes</h4>
                <div className="p-4 bg-[#0A0710] border border-vaporBorder rounded-lg text-vaporText min-h-[100px] whitespace-pre-wrap italic opacity-90">
                  {vaultItem.notes || 'No notes archived for this item.'}
                </div>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <div className="space-y-6 flex-grow">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-2">Condition</label>
                  <input 
                    type="text" 
                    value={formData.condition} 
                    onChange={e => setFormData({...formData, condition: e.target.value})}
                    className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporCyan focus:shadow-[0_0_10px_rgba(1,205,254,0.3)] transition-all"
                    placeholder="e.g., Mint in Box, Light wear"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-2">Creator Code</label>
                  <input 
                    type="text" 
                    value={formData.creator_code} 
                    onChange={e => setFormData({...formData, creator_code: e.target.value})}
                    className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporCyan focus:shadow-[0_0_10px_rgba(1,205,254,0.3)] transition-all"
                    placeholder="e.g. Smii7y"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-2">Purchase Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.purchase_price} 
                    onChange={e => setFormData({...formData, purchase_price: e.target.value})}
                    className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporCyan focus:shadow-[0_0_10px_rgba(1,205,254,0.3)] transition-all font-mono"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-2">Date Acquired</label>
                  <input 
                    type="date" 
                    value={formData.purchase_date} 
                    onChange={e => setFormData({...formData, purchase_date: e.target.value})}
                    className="w-full bg-[#0A0710] border border-vaporBorder text-vaporMuted px-4 py-3 rounded focus:outline-none focus:border-vaporCyan focus:shadow-[0_0_10px_rgba(1,205,254,0.3)] transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-2">Purchase Location</label>
                  <input 
                    type="text" 
                    value={formData.purchase_location} 
                    onChange={e => setFormData({...formData, purchase_location: e.target.value})}
                    className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporCyan focus:shadow-[0_0_10px_rgba(1,205,254,0.3)] transition-all"
                    placeholder="e.g., GamerSupps Website, eBay, Convention"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-2">Private Notes</label>
                  <textarea 
                    rows={4}
                    value={formData.notes} 
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporCyan focus:shadow-[0_0_10px_rgba(1,205,254,0.3)] transition-all resize-none"
                    placeholder="Thoughts on this item..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-vaporBorder mt-6">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-transparent text-vaporMuted hover:text-vaporText font-bold uppercase tracking-wider transition-colors"
                  disabled={isSaving}
                >
                  ABORT
                </button>
                <button 
                  onClick={handleSave}
                  className="px-8 py-3 bg-gradient-to-r from-vaporCyan to-vaporPink text-[#0B0914] rounded hover:opacity-90 font-black italic tracking-widest transition-all shadow-[0_0_15px_rgba(1,205,254,0.4)] disabled:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? 'UPLOADING...' : 'SAVE DATA'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}