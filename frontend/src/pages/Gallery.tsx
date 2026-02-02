import { useEffect, useState, useMemo } from 'react';
import { listGalleryItems } from '../lib/firestore';
import type { GalleryItem, GalleryCategory } from '../types/gallery';
import GalleryGrid from '../components/gallery/GalleryGrid';
import GalleryFilters from '../components/gallery/GalleryFilters';
import LightboxModal from '../components/gallery/LightboxModal';

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<GalleryCategory | 'All'>('All');
  const [search, setSearch] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    listGalleryItems().then(setItems).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCat = category === 'All' || item.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [items, category, search]);

  return (
    <>
      <h1>Gallery</h1>
      <GalleryFilters
        category={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
      />
      {loading ? (
        <p className="loading">Loading…</p>
      ) : (
        <GalleryGrid
          items={filtered}
          onItemClick={(idx) => setLightboxIndex(idx)}
        />
      )}
      {lightboxIndex !== null && (
        <LightboxModal
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(i) => setLightboxIndex(i)}
        />
      )}
    </>
  );
}
