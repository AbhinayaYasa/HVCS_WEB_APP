import { useEffect, useState } from 'react';
import { subscribeAuth, signOut } from '../lib/auth';
import { listGalleryItems, createGalleryItem, deleteGalleryItem } from '../lib/firestore';
import { uploadGalleryImage, deleteGalleryImage } from '../lib/storage';
import type { User } from 'firebase/auth';
import type { GalleryItem, GalleryItemCreate } from '../types/gallery';
import UploadDropzone from '../components/gallery/UploadDropzone';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeAuth(setUser);
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    listGalleryItems().then(setItems).finally(() => setLoading(false));
  }, [user]);

  async function handleUpload(file: File, data: Omit<GalleryItemCreate, 'imageUrl' | 'storagePath'>) {
    const pathSegment = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const { url, storagePath } = await uploadGalleryImage(file, pathSegment);
    await createGalleryItem({ ...data, imageUrl: url, storagePath });
    setItems(await listGalleryItems());
  }

  async function handleDelete(item: GalleryItem) {
    if (!confirm('Delete this item?')) return;
    await deleteGalleryImage(item.storagePath);
    await deleteGalleryItem(item.id);
    setItems((prev) => prev.filter((x) => x.id !== item.id));
  }

  if (loading) return <p className="loading">Loading…</p>;
  if (!user) {
    return (
      <div>
        <h1>Admin</h1>
        <p>Sign in with Email/Password to manage the gallery.</p>
        <AdminLogin />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Admin</h1>
        <button type="button" className="btn" onClick={() => signOut()} style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
          Sign Out
        </button>
      </div>
      <UploadDropzone onUpload={handleUpload} />
      <h2>Gallery Items</h2>
      <div className="gallery-grid">
        {items.map((item) => (
          <div key={item.id} className="gallery-card">
            <img src={item.imageUrl} alt={item.title} />
            <div className="gallery-card-body">
              <h3>{item.title}</h3>
              <p>{item.category}</p>
              <button
                className="btn"
                style={{ marginTop: '0.5rem', background: '#c9302c' }}
                onClick={() => handleDelete(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const { signIn } = await import('../lib/auth');
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-subtle)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: 'var(--color-text)' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-subtle)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: 'var(--color-text)' }}
      />
      {error && <p style={{ color: '#c9302c' }}>{error}</p>}
        <button type="submit" className="btn btn-nav">Sign In</button>
    </form>
  );
}
