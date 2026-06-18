'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

// Pass in the data we got from the server, plus a boolean for ownership
export default function VaultItemDetails({ vaultItem, isOwner }: { vaultItem: any, isOwner: boolean }) {
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3">
        
        {/* Left Column: Image */}
        <div className="bg-gray-100 p-6 flex flex-col items-center justify-center border-r border-gray-200">
          <img 
            src={displayImage} 
            alt={vaultItem.item.name} 
            className="w-full max-w-sm aspect-square object-contain rounded-lg bg-white shadow-sm"
          />
          {isOwner && (
            <button className="mt-4 text-sm text-blue-600 hover:underline">
              {vaultItem.user_image_url ? 'Update Custom Photo' : 'Upload Custom Photo'}
            </button>
          )}
        </div>

        {/* Right Column: Details & Form */}
        <div className="p-6 md:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{vaultItem.item.name}</h2>
              {vaultItem.item.collection_name && (
                <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  {vaultItem.item.collection_name}
                </span>
              )}
            </div>
            
            {/* Edit Toggle for Owner */}
            {isOwner && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Edit Details
              </button>
            )}
          </div>

          {/* VIEW MODE */}
          {!isEditing ? (
            <div className="grid grid-cols-2 gap-6 flex-grow">
              <div>
                <h4 className="text-sm font-semibold text-vaporMuted uppercase tracking-wider mb-1">Condition</h4>
                <p className="text-gray-900">{vaultItem.condition || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-vaporMuted uppercase tracking-wider mb-1">Creator Code Used</h4>
                <p className="text-gray-900">{vaultItem.creator_code || 'None'}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-vaporMuted uppercase tracking-wider mb-1">Purchase Info</h4>
                <p className="text-gray-900">
                  {vaultItem.purchase_price ? `$${vaultItem.purchase_price} ` : ''}
                  {vaultItem.purchase_location ? `from ${vaultItem.purchase_location}` : ''}
                </p>
                <p className="text-sm text-gray-500">{vaultItem.purchase_date}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-semibold text-vaporMuted uppercase tracking-wider mb-1">My Notes</h4>
                <div className="p-4 bg-gray-50 rounded-lg text-gray-700 min-h-[100px] whitespace-pre-wrap">
                  {vaultItem.notes || 'No notes added.'}
                </div>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <div className="space-y-4 flex-grow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <input 
                    type="text" 
                    value={formData.condition} 
                    onChange={e => setFormData({...formData, condition: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Mint in Box, Light wear"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Creator Code</label>
                  <input 
                    type="text" 
                    value={formData.creator_code} 
                    onChange={e => setFormData({...formData, creator_code: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.purchase_price} 
                    onChange={e => setFormData({...formData, purchase_price: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                  <input 
                    type="date" 
                    value={formData.purchase_date} 
                    onChange={e => setFormData({...formData, purchase_date: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Location</label>
                  <input 
                    type="text" 
                    value={formData.purchase_location} 
                    onChange={e => setFormData({...formData, purchase_location: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., GamerSupps Website, eBay, Convention"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Private Notes</label>
                  <textarea 
                    rows={4}
                    value={formData.notes} 
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Thoughts on this item..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-vaporText rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}