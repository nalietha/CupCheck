'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import ItemCard from '../items/ItemCard';
import AdminItemImageManager from './AdminItemImageManager';
import AdminItemMetadataForm from './AdminItemMetadataForm';
import { uploadItemImages, saveItem, syncItemRelationships } from '@/lib/itemActions';
import { debug } from '@/lib/debug';

interface AdminItemFormProps {
  initialData?: any;
  itemId?: string;
  onComplete?: () => void;
}

const DEFAULT_PRICES: Record<string, number> = {
  cup: 25.00,
  tub: 40.00,
  shirt: 25.00, 
  merch: 20.00, 
  apparel: 40.00,
};

interface CreatorJoin {
  creators?: { id: string; name: string };
  creator?: { id: string; name: string };
  id?: string;
  name?: string;
}

const normalizeCreators = (creatorsData: CreatorJoin[]) => {
  if (!Array.isArray(creatorsData)) return [];
  return creatorsData.map((c: CreatorJoin) => {
    if (typeof c === 'string') return { name: c };      
    if (c.creators) return { id: c.creators.id, name: c.creators.name }; 
    if (c.creator) return { id: c.creator.id, name: c.creator.name };      
    return { id: c.id || '', name: c.name || 'Unknown' }; 
  }).filter((c) => c.name !== 'Unknown');
};

export default function AdminItemForm({ initialData, itemId, onComplete }: AdminItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    item_type: initialData?.item_type || 'cup',
    collection_id: initialData?.collection_id || '',
    description: initialData?.description || '',
    retail_price: initialData?.retail_price || DEFAULT_PRICES['cup'],
    season: initialData?.season || '',
    release_date: initialData?.release_date || '',
    material: initialData?.material || '',
    limited: initialData?.limited || false,
    retired: initialData?.retired || false,
    image_url: initialData?.image_url || '',
    parent_item_id: initialData?.parent_item_id || '',
    variant_type: initialData?.variant_type || 'standard',
    flavor_profile: initialData?.flavor_profile || '',
  });

  const [selectedCreators, setSelectedCreators] = useState<{ id?: string, name: string }[]>(
    normalizeCreators(initialData?.creators)
  );

  // New Artists Array State
  const [selectedArtists, setSelectedArtists] = useState<{ id?: string, name: string, role: string }[]>(
    initialData?.artists?.map((a: any) => ({
      id: a.id,
      name: a.name,
      role: a.role || 'Artist'
    })) || []
  );

  const [itemImages, setItemImages] = useState<any[]>(
    Array.isArray(initialData?.item_images)
      ? [...initialData.item_images].sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
      : []
  );

  const handleClearForm = () => {
    setFormData({
      name: '', item_type: 'cup', collection_id: '', description: '',
      retail_price: '25', season: '', release_date: '', material: '',
      limited: true, retired: true, image_url: '', parent_item_id: '',
      variant_type: 'standard', flavor_profile: '',
    });
    setSelectedCreators([]);
    setSelectedArtists([]);
    setItemImages([]);
    setErrorMsg('');
    setSuccess(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setFormData({
          name: json.name || '',
          item_type: json.type || 'cup',
          collection_id: json.collection || '',
          description: json.description || '',
          retail_price: json.releasePrice !== undefined && json.releasePrice !== null ? String(json.releasePrice) : '',
          season: json.season || '',
          release_date: json.releaseDate || '',
          material: json.material || '',
          limited: Boolean(json.limited),
          retired: Boolean(json.retired),
          image_url: json.url || '',
          parent_item_id: json.parentId || '',
          variant_type: json.variantType || 'standard',
          flavor_profile: json.flavorProfile || '',                   
        });

        if (json.creators) {
          let parsedCreators: { name: string }[] = [];
          if (Array.isArray(json.creators)) {
            parsedCreators = json.creators.map((c: any) => ({ name: typeof c === 'string' ? c : c.name }));
          } else if (typeof json.creators === 'string' && json.creators.trim() !== '') {
            parsedCreators = json.creators.split(',').map((c: string) => ({ name: c.trim() })).filter((c: { name: string }) => c.name.length > 0);
          }
          setSelectedCreators(parsedCreators);
        } else {
          setSelectedCreators([]);
        }

        if (json.artists) {
           // Handle basic artist array mapping if provided via JSON
           let parsedArtists: { name: string, role: string }[] = [];
           if (Array.isArray(json.artists)) {
               parsedArtists = json.artists.map((a: any) => ({ name: typeof a === 'string' ? a : a.name, role: a.role || 'Artist' }));
           }
           setSelectedArtists(parsedArtists);
        }

        setErrorMsg('');
      } catch (err) {
        debug.error("Failed to parse JSON metadata", err);
        setErrorMsg('Invalid JSON file. Please ensure it is formatted correctly.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      const cleanedData = {
        ...formData,
        season: formData.season || null,
        collection_id: formData.collection_id || null,
        description: formData.description || null,
        material: formData.material || null,
        retail_price: formData.retail_price ? parseFloat(formData.retail_price as string) : null,
        parent_item_id: formData.parent_item_id.trim() === "" ? null : formData.parent_item_id,
        release_date: formData.release_date?.trim() === "" ? null : formData.release_date,
      };

      const processedImages = await uploadItemImages(itemImages);
      const primaryImageUrl = processedImages.length > 0 ? processedImages[0].url : formData.image_url;

      // Handle Creators
      const finalCreatorIds: string[] = [];
      for (const creator of selectedCreators) {
        if (creator.id) {
          finalCreatorIds.push(creator.id);
        } else {
          const { data: newCreator } = await supabase.from('creators').insert([{ name: creator.name }]).select('id').single();
          if (newCreator) finalCreatorIds.push(newCreator.id);
        }
      }

      // Handle Artists
      const finalArtistData: { artist_id: string, role: string }[] = [];
      for (const artist of selectedArtists) {
        let artistId = artist.id;
        if (!artistId) {
          const { data: newArtist } = await supabase.from('artists').insert([{ name: artist.name }]).select('id').single();
          if (newArtist) artistId = newArtist.id;
        }
        if (artistId) finalArtistData.push({ artist_id: artistId, role: artist.role || 'Artist' });
      }

      const savedItemId = await saveItem(itemId ?? null, { ...cleanedData, image_url: primaryImageUrl });
      const finalItemId = savedItemId?.id || savedItemId;

      // Sync Relationships
      await syncItemRelationships(finalItemId, processedImages, finalCreatorIds);

      // Sync Artists Junction
      if (finalItemId) {
        await supabase.from('item_artist').delete().eq('item_id', finalItemId);
        if (finalArtistData.length > 0) {
          await supabase.from('item_artist').insert(
            finalArtistData.map(a => ({ item_id: finalItemId, artist_id: a.artist_id, role: a.role }))
          );
        }
      }

      setSuccess(true);
      if (onComplete) onComplete();
    } catch (err: any) {
      debug.error("Form submission failed", err);
      setErrorMsg(err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

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