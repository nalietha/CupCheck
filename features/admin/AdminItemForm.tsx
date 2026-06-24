'use client';

import { useRef } from 'react';
import ItemCard from '../items/ItemCard';
import AdminItemImageManager from './AdminItemImageManager';
import AdminItemMetadataForm from './AdminItemMetadataForm';
import { useAdminItemForm } from '@/hooks/useAdminItemForm';

interface AdminItemFormProps {
  initialData?: any;
  itemId?: string;
  onComplete?: () => void;
}

// Split this out into itemJsonParser.ts, useAdminItemForm.ts, and AdminItemForm.tsx for better separation of concerns. 
// The parser handles JSON, the hook manages state and logic, and the component handles rendering.

export default function AdminItemForm({ initialData, itemId, onComplete }: AdminItemFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    formData, setFormData, 
    selectedCreators, setSelectedCreators, 
    selectedArtists, setSelectedArtists, 
    itemImages, setItemImages, 
    loading, errorMsg, success, 
    handleClearForm, handleFileUpload, handleSubmit 
  } = useAdminItemForm(initialData, itemId, onComplete);

  // Constructs item object for live preview rendering
  const previewItem = {
    ...formData,
    id: itemId || 'preview',
    item_images: itemImages,
    creators: selectedCreators 
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8 w-full max-w-[1600px] mx-auto">
      <div className="w-full xl:w-1/4">
        <h2 className="text-xl font-bold text-neonPink mb-4 uppercase tracking-widest">Live Preview</h2>
        <div className="sticky top-24">
          <ItemCard item={previewItem} showAddButton={false} />
          {itemImages.length > 1 && (
            <p className="text-xs text-center text-gray-500 mt-4">Hover image registered! Mouse over the card to test.</p>
          )}
        </div>
      </div>

      <AdminItemImageManager itemImages={itemImages} setItemImages={setItemImages} />

      <div className="w-full xl:w-2/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-vaporText uppercase tracking-widest">Edit Forms</h2>
          <div className="flex gap-2">
            <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-purple-700 hover:bg-purple-600 text-vaporText px-4 py-2 rounded-lg font-bold transition-all">Upload JSON</button>
            <button type="button" onClick={handleClearForm} className="bg-gray-700 hover:bg-gray-600 text-vaporText px-4 py-2 rounded-lg font-bold transition-all">Clear</button>
            <button type="submit" disabled={loading} className="bg-neonPink hover:bg-pink-600 text-vaporText px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50">{loading ? 'Saving...' : 'Save Item'}</button>
          </div>
        </div>
        
        <AdminItemMetadataForm
          formData={formData}
          setFormData={setFormData}
          selectedCreators={selectedCreators}
          setSelectedCreators={setSelectedCreators}
          selectedArtists={selectedArtists}
          setSelectedArtists={setSelectedArtists}
        />

        {errorMsg && <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200">{errorMsg}</div>}
        {success && <div className="mt-4 p-4 bg-green-900/30 border border-green-500 rounded-lg text-green-400">Item saved successfully!</div>}
      </div>
    </form>
  );
}