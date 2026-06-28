import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadItemImages, saveItem, syncItemRelationships } from '@/lib/itemActions';
import { debug } from '@/lib/debug';
import { parseItemJson } from '@/lib/utils/itemJsonParser';

const DEFAULT_PRICES: Record<string, number> = { cup: 25.00, tub: 40.00, shirt: 25.00, merch: 20.00, apparel: 40.00 };

const normalizeCreators = (creatorsData: any[]) => {
  if (!Array.isArray(creatorsData)) return [];
  return creatorsData.map((c: any) => {
    if (typeof c === 'string') return { name: c };      
    if (c.creators) return { id: c.creators.id, name: c.creators.name }; 
    if (c.creator) return { id: c.creator.id, name: c.creator.name };      
    return { id: c.id || '', name: c.name || 'Unknown' }; 
  }).filter((c) => c.name !== 'Unknown');
};

export const useAdminItemForm = (initialData: any, itemId?: string, onComplete?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    item_type: initialData?.item_type || 'cup',
    collection_id: initialData?.collection_id || '',
    description: initialData?.description || '',
    retail_price: initialData?.retail_price || DEFAULT_PRICES['cup'],
    season: initialData?.season || '',
    release_date: initialData?.release_date || '',
    shipping_status: initialData?.shipping_status || 'released', // Added status
    expected_ship_date: initialData?.expected_ship_date || '',   // Added date
    material: initialData?.material || '',
    limited: initialData?.limited || false,
    retired: initialData?.retired || false,
    is_special_edition: initialData?.is_special_edition || false,
    image_url: initialData?.image_url || '',
    parent_item_id: initialData?.parent_item_id || '',
    variant_type: initialData?.variant_type || 'standard',
    flavor_profile: initialData?.flavor_profile || '',
    tags: initialData?.tags || [],
  });

  const [selectedCreators, setSelectedCreators] = useState<{ id?: string, name: string }[]>(normalizeCreators(initialData?.creators));
  const [selectedArtists, setSelectedArtists] = useState<{ id?: string, name: string, role: string }[]>(
    initialData?.artists?.map((a: any) => ({ id: a.id, name: a.name, role: a.role || 'Artist' })) || []
  );
  const [itemImages, setItemImages] = useState<any[]>(
    Array.isArray(initialData?.item_images) ? [...initialData.item_images].sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)) : []
  );

  const handleClearForm = () => {
    setFormData({
      name: '', item_type: 'cup', collection_id: '', description: '', retail_price: '25', season: '', 
      release_date: '', shipping_status: 'released', expected_ship_date: '', material: '',
      limited: true, retired: true, is_special_edition: false, image_url: '', parent_item_id: '', variant_type: 'standard', flavor_profile: '', tags: [],
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
      const { formData: parsedData, selectedCreators: parsedCreators, selectedArtists: parsedArtists, error } = parseItemJson(e.target?.result as string);
      if (error) {
        setErrorMsg(error);
        return;
      }
      if (parsedData) setFormData(parsedData as any);
      setSelectedCreators(parsedCreators);
      setSelectedArtists(parsedArtists);
      setErrorMsg('');
    };
    reader.readAsText(file);
    event.target.value = '';
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
        expected_ship_date: formData.expected_ship_date?.trim() === "" ? null : formData.expected_ship_date, // Cleaned empty dates
      };

      let finalItemId: string | null = itemId || null;
      
      if (!finalItemId) {
        finalItemId = await saveItem(null, { ...cleanedData, image_url: formData.image_url });
      }

      // Upload images without the extra finalItemId parameter
      const processedImages = await uploadItemImages(itemImages);
      const primaryImageUrl = processedImages.length > 0 ? processedImages[0].image_url : formData.image_url;

      if (itemId) {
        await saveItem(finalItemId, { ...cleanedData, image_url: primaryImageUrl });
      } else {
        if (primaryImageUrl !== formData.image_url) {
          await saveItem(finalItemId, { image_url: primaryImageUrl });
        }
      }

      const finalCreatorIds: string[] = [];
      for (const creator of selectedCreators) {
        if (creator.id) {
          finalCreatorIds.push(creator.id);
        } else {
          const { data } = await supabase.from('creators').insert([{ name: creator.name }]).select('id').single();
          if (data) finalCreatorIds.push(data.id);
        }
      }

      const finalArtistData: { artist_id: string, role: string }[] = [];
      for (const artist of selectedArtists) {
        let artistId = artist.id;
        if (!artistId) {
          const { data } = await supabase.from('artists').insert([{ name: artist.name }]).select('id').single();
          if (data) artistId = data.id;
        }
        if (artistId) finalArtistData.push({ artist_id: artistId, role: artist.role || 'Artist' });
      }

      await syncItemRelationships(finalItemId as string, processedImages, finalCreatorIds);

      if (finalItemId) {
        await supabase.from('item_artist').delete().eq('item_id', finalItemId);
        if (finalArtistData.length > 0) {
          await supabase.from('item_artist').insert(finalArtistData.map(a => ({ item_id: finalItemId, artist_id: a.artist_id, role: a.role })));
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

  return { formData, setFormData, selectedCreators, setSelectedCreators, selectedArtists, setSelectedArtists, itemImages, setItemImages, loading, errorMsg, success, handleClearForm, handleFileUpload, handleSubmit };
};