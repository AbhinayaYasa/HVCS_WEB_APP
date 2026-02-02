import type { GalleryCategory } from '../../types/gallery';
import { GALLERY_CATEGORIES } from '../../types/gallery';

export default function GalleryFilters({
  category,
  onCategoryChange,
  search,
  onSearchChange,
}: {
  category: GalleryCategory | 'All';
  onCategoryChange: (c: GalleryCategory | 'All') => void;
  search: string;
  onSearchChange: (s: string) => void;
}) {
  return (
    <div className="filters">
      <input
        type="search"
        placeholder="Search by title or tags…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value === 'All' ? 'All' : (e.target.value as GalleryCategory))}
      >
        <option value="All">All categories</option>
        {GALLERY_CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
