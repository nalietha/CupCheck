export interface ItemImage {
  id?: string;
  image_url?: string;
  url?: string; // Sometimes APIs or local JSONs use 'url' instead of 'image_url'
  display_order?: number;
}

export interface BaseItem {
  image_url?: string;
  item_images?: ItemImage[];
}

const FALLBACK_IMAGE = 'https://placehold.co/400x600/1a1a2e/ff00ff?text=No+Image';

export const ImageService = {
  /**
   * Safely sorts an array of item images by their display_order.
   */
  sortImages(images?: ItemImage[]): ItemImage[] {
    if (!images || !Array.isArray(images)) return [];
    return [...images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },

  /**
   * Extracts the primary and hover images for card displays.
   */
  getCardImages(item: BaseItem | null | undefined): { primaryImage: string; hoverImage: string | null } {
    let primaryImage = item?.image_url || FALLBACK_IMAGE;
    let hoverImage: string | null = null;

    const sortedImages = this.sortImages(item?.item_images);
    
    if (sortedImages.length > 0) {
      primaryImage = sortedImages[0]?.image_url || sortedImages[0]?.url || primaryImage;
    }
    
    if (sortedImages.length > 1) {
      hoverImage = sortedImages[1]?.image_url || sortedImages[1]?.url || null;
    }

    return { primaryImage, hoverImage };
  },

  /**
   * Extracts all available image URLs for galleries.
   */
  getGalleryImages(item: BaseItem | null | undefined): string[] {
    const sortedImages = this.sortImages(item?.item_images);
    
    const displayImages = sortedImages
      .map(img => img.image_url || img.url)
      .filter(Boolean) as string[];

    // Fallback to the base image_url if the array is empty but a base URL exists
    if (displayImages.length === 0 && item?.image_url) {
      displayImages.push(item.image_url);
    }

    // Ultimate fallback if absolutely no images exist
    if (displayImages.length === 0) {
      displayImages.push(FALLBACK_IMAGE);
    }

    return displayImages;
  }
};