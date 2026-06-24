// lib/utils/itemJsonParser.ts
import { debug } from '@/lib/debug';

export const parseItemJson = (jsonString: string) => {
  try {
    const json = JSON.parse(jsonString);
    
    // Maps raw JSON to database schema
    const formData = {
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
      is_special_edition: Boolean(json.isSpecialEdition),
      image_url: json.url || '',
      parent_item_id: json.parentId || '',
      variant_type: json.variantType || 'standard',
      flavor_profile: json.flavorProfile || '',
      tags: Array.isArray(json.tags) ? json.tags : [],
    };

    let selectedCreators: { name: string }[] = [];
    if (json.creators) {
      if (Array.isArray(json.creators)) {
        selectedCreators = json.creators.map((c: any) => ({ name: typeof c === 'string' ? c : c.name }));
      } else if (typeof json.creators === 'string' && json.creators.trim() !== '') {
        selectedCreators = json.creators.split(',').map((c: string) => ({ name: c.trim() })).filter((c: { name: string }) => c.name.length > 0);
      }
    }

    let selectedArtists: { name: string, role: string }[] = [];
    if (json.artists && Array.isArray(json.artists)) {
      selectedArtists = json.artists.map((a: any) => ({ name: typeof a === 'string' ? a : a.name, role: a.role || 'Artist' }));
    }

    return { formData, selectedCreators, selectedArtists, error: null };
  } catch (err) {
    debug.error("Failed to parse JSON metadata", err);
    return { formData: null, selectedCreators: [], selectedArtists: [], error: 'Invalid JSON file. Please ensure it is formatted correctly.' };
  }
};