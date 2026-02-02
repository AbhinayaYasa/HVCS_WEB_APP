import { useState } from 'react';
import type { GalleryItemCreate, GalleryCategory } from '../../types/gallery';
import { GALLERY_CATEGORIES } from '../../types/gallery';

type UploadData = Omit<GalleryItemCreate, 'imageUrl' | 'storagePath'>;

export default function UploadDropzone({
  onUpload,
}: {
  onUpload: (file: File, data: UploadData) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('Transportation');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError('Select an image');
      return;
    }
    setError('');
    setUploading(true);
    try {
      await onUpload(file, {
        title,
        description,
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        featured,
      });
      setFile(null);
      setTitle('');
      setDescription('');
      setTags('');
      setFeatured(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <div
        className="upload-zone"
        onClick={() => document.getElementById('file-input')?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f?.type.startsWith('image/')) setFile(f);
        }}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file ? file.name : 'Drop image or click to select'}
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 400 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '0.5rem 1rem', background: 'var(--color-surface)', border: '1px solid rgba(201,169,98,0.3)', borderRadius: 4, color: 'var(--color-text)' }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          style={{ padding: '0.5rem 1rem', background: 'var(--color-surface)', border: '1px solid rgba(201,169,98,0.3)', borderRadius: 4, color: 'var(--color-text)' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as GalleryCategory)}
          style={{ padding: '0.5rem 1rem', background: 'var(--color-surface)', border: '1px solid rgba(201,169,98,0.3)', borderRadius: 4, color: 'var(--color-text)' }}
        >
          {GALLERY_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ padding: '0.5rem 1rem', background: 'var(--color-surface)', border: '1px solid rgba(201,169,98,0.3)', borderRadius: 4, color: 'var(--color-text)' }}
        />
        <label>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          {' '}Featured
        </label>
      </div>
      {error && <p style={{ color: '#c9302c', marginTop: '0.5rem' }}>{error}</p>}
      <button type="submit" className="btn" disabled={uploading} style={{ marginTop: '1rem' }}>
        {uploading ? 'Uploading…' : 'Upload'}
      </button>
    </form>
  );
}
