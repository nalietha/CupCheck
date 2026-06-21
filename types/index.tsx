 // The main types
 export interface ItemImage {
  id: string;
  item_id?: string;
  image_url: string;      
  display_order?: number;
}
 
export interface Item {
  id: string;
  name?: string;
  image_url?: string;
  release_date?: string;
  item_type: string;
  collection_id?: string;
  description?: string;
  limited?: boolean;
  retired?: boolean;
  retail_price?: number;
  material?: string;
  external_id?: string;
  created_at?: string;
  updated_at?: string;
  season?: string;
  is_special_edition?: boolean;
  variant_type?: string;
  flavor_profile?: string;
  
  // FK relational data
  item_images?: ItemImage[]; 
}

export interface SearchResult {
  id: string;
  name: string;
}

export interface VaultItem extends Item {
  quantity: number;
  added_at: string;
  is_favorite?: boolean;
  record_id?: number;
}

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  created_at: string;
  banner_url?: string;
  is_public: boolean;
}