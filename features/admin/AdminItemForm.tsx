'use client';

import { useRef, useState } from 'react';
import ItemCard from '../items/ItemCard';
import AdminItemImageManager from './AdminItemImageManager';
import AdminItemMetadataForm from './AdminItemMetadataForm';
import { useAdminItemForm } from '@/hooks/useAdminItemForm';
import { scrapeGamersuppsProduct } from '@/lib/actions/scraper';

interface AdminItemFormProps {
  initialData?: any;
  itemId?: string;
  onComplete?: () => void;
}

export default function AdminItemForm({ initialData, itemId, onComplete }: AdminItemFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Scraper State
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  
  const { 
    formData, setFormData, 
    selectedCreators, setSelectedCreators, 
    selectedArtists, setSelectedArtists, 
    itemImages, setItemImages, 
    loading, errorMsg, success, 
    handleClearForm, handleFileUpload, handleSubmit 
  } = useAdminItemForm(initialData, itemId, onComplete);

  // --- Scraper Logic ---
  const handleScrape = async () => {
    if (!scrapeUrl) return;
    setIsScraping(true);
    
    try {
      const result = await scrapeGamersuppsProduct(scrapeUrl);
      
      if (result.success && result.data) {
        // 1. Merge form text data
        setFormData((prev: any) => ({
          ...prev,
          name: result.data.name || prev.name,
          description: result.data.description || prev.description,
          retail_price: result.data.retail_price || prev.retail_price,
          item_type: result.data.item_type || prev.item_type,
          // Merge unique tags
          tags: Array.from(new Set([...(prev.tags || []), ...(result.data.tags || [])]))
        }));

        // 2. Inject Hotlinked Images into the Image Manager
        if (result.data.images && result.data.images.length > 0) {
          const newImages = result.data.images.map((url: string, idx: number) => ({
            url: url, // For local UI preview
            image_url: url, // For saving to database
            display_order: itemImages.length + idx,
            isNew: false // False means it won't attempt to upload to your Supabase bucket
          }));
          setItemImages((prev: any[]) => [...prev, ...newImages]);
        }
      } else {
        alert(`Scrape failed: ${result.error}\nEnsure it is a valid Gamersupps product URL.`);
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred while communicating with the scraper.');
    } finally {
      setIsScraping(false);
      setScrapeUrl('');
    }
  };

  // Constructs item object for live preview rendering
  const previewItem = {
    ...formData,
    id: itemId || 'preview',
    item_images: itemImages,
    creators: selectedCreators 
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto">
      
      {/* --- Gamersupps Auto-Fill Utility --- */}
      <div className="bg-black/30 p-6 rounded-xl border border-vaporCyan/50 flex flex-col md:flex-row gap-4 items-end shadow-lg">
        <div className="flex-grow w-full">
          <label className="block text-xs font-black text-vaporCyan uppercase tracking-widest mb-2">
            Auto-Fill Scraper (Gamersupps Store URL)
          </label>
          <input 
            type="url" 
            value={scrapeUrl} 
            onChange={(e) => setScrapeUrl(e.target.value)} 
            className="w-full bg-black/60 border border-vaporCyan/30 p-4 rounded-lg text-sm text-vaporText focus:border-vaporCyan outline-none transition-colors" 
            placeholder="https://gamersupps.gg/products/..." 
          />
        </div>
        <button 
          type="button" 
          onClick={handleScrape}
          disabled={isScraping || !scrapeUrl}
          className="bg-vaporCyan text-black font-black italic uppercase tracking-widest text-sm md:text-base px-8 py-4 rounded-lg disabled:opacity-50 hover:bg-cyan-300 transition-colors w-full md:w-auto shadow-[0_0_15px_rgba(1,205,254,0.3)]"
        >
          {isScraping ? 'FETCHING DATA...' : 'QUICK FETCH'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8 w-full">
        
        {/* Left Column: Live Preview */}
        <div className="w-full xl:w-1/4">
          <h2 className="text-xl font-bold text-neonPink mb-4 uppercase tracking-widest">Live Preview</h2>
          <div className="sticky top-24">
            <ItemCard item={previewItem} showAddButton={false} />
            {itemImages.length > 1 && (
              <p className="text-xs text-center text-gray-500 mt-4">Hover image registered! Mouse over the card to test.</p>
            )}
          </div>
        </div>

        {/* Middle Column: Images */}
        <AdminItemImageManager itemImages={itemImages} setItemImages={setItemImages} />

        {/* Right Column: Data Entry */}
        <div className="w-full xl:w-2/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-vaporText uppercase tracking-widest">Edit Forms</h2>
            <div className="flex gap-2">
              <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-purple-700 hover:bg-purple-600 text-vaporText px-4 py-2 rounded-lg font-bold transition-all">Upload JSON</button>
              <button type="button" onClick={handleClearForm} className="bg-gray-700 hover:bg-gray-600 text-vaporText px-4 py-2 rounded-lg font-bold transition-all">Clear</button>
              <button type="submit" disabled={loading} className="bg-neonPink hover:bg-pink-600 text-vaporText px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 shadow-neon">
                {loading ? 'Saving...' : 'Save Item'}
              </button>
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
    </div>
  );
}