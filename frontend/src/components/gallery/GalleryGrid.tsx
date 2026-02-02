import type { GalleryItem } from '../../types/gallery';
import GalleryCard from './GalleryCard';

export default function GalleryGrid({
  items,
  onItemClick,
}: {
  items: GalleryItem[];
  onItemClick?: (index: number) => void;
}) {
  return (
    <div className="gallery-grid">
      {items.map((item, idx) => (
        <GalleryCard
          key={item.id}
          item={item}
          onClick={() => onItemClick?.(idx)}
        />
      ))}
    </div>
  );
}
