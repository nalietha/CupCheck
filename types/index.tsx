 // The main types
 export interface Item {
  id: string;
  name: string;
  item_type: string;
  collection_id?: string | null;
  description?: string | null;
  retail_price?: number | string | null;
  limited?: boolean | null;
  image_url?: string | null;
}

export interface SearchResult {
  id: string;
  name: string;
}
