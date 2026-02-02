import { useEffect } from 'react';
import type { GalleryItem } from '../../types/gallery';

export default function LightboxModal({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const item = items[index];
  const prev = index > 0 ? index - 1 : null;
  const next = index < items.length - 1 ? index + 1 : null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prev !== null) onNavigate(prev);
      if (e.key === 'ArrowRight' && next !== null) onNavigate(next);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, onClose, onNavigate]);

  if (!item) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">×</button>
        {prev !== null && (
          <button
            className="lightbox-nav prev"
            onClick={() => onNavigate(prev)}
            aria-label="Previous"
          >
            ←
          </button>
        )}
        <img src={item.imageUrl} alt={item.title} />
        {next !== null && (
          <button
            className="lightbox-nav next"
            onClick={() => onNavigate(next)}
            aria-label="Next"
          >
            →
          </button>
        )}
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>{item.title}</p>
      </div>
    </div>
  );
}
