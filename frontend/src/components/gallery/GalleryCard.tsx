import type { GalleryItem } from '../../types/gallery';

export default function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick?: () => void;
}) {
  return (
    <div className="gallery-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
      <img src={item.imageUrl} alt={item.title} />
      <div className="gallery-card-body">
        <h3>{item.title}</h3>
        <p>{item.category}</p>
      </div>
    </div>
  );
}
