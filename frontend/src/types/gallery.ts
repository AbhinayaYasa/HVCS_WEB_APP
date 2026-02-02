/**
 * Central category constants for gallery items.
 */
export const GALLERY_CATEGORIES = [
  'Transportation',
  'HOP',
  'Personal Services',
  'Events',
  'Other',
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: GalleryCategory;
  imageUrl: string;
  storagePath: string;
  tags: string[];
  createdAt: { seconds: number; nanoseconds: number };
  featured: boolean;
}

export interface GalleryItemCreate {
  title: string;
  description: string;
  category: GalleryCategory;
  imageUrl: string;
  storagePath: string;
  tags: string[];
  featured: boolean;
}

export function isGalleryCategory(value: string): value is GalleryCategory {
  return GALLERY_CATEGORIES.includes(value as GalleryCategory);
}
