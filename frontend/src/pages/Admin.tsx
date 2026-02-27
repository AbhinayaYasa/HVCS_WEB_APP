import { useEffect, useState } from 'react';
import { subscribeAuth, signOut } from '../lib/auth';
import { listGalleryItems, createGalleryItem, deleteGalleryItem } from '../lib/firestore';
import { uploadGalleryImage, deleteGalleryImage } from '../lib/storage';
import { listFeedback, type FeedbackDoc } from '../lib/feedback';
import type { User } from 'firebase/auth';
import type { GalleryItem, GalleryItemCreate } from '../types/gallery';
import UploadDropzone from '../components/gallery/UploadDropzone';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [feedback, setFeedback] = useState<FeedbackDoc[]>([]);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeAuth(setUser);
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setFeedbackError(null);
    Promise.all([
      listGalleryItems().catch(() => []),
      listFeedback().catch((err) => {
        setFeedbackError(err instanceof Error ? err.message : 'Failed to load feedback');
        return [];
      }),
    ])
      .then(([galleryItems, feedbackItems]) => {
        setItems(galleryItems);
        setFeedback(feedbackItems);
      })
      .finally(() => setLoading(false));
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h2 style={{ margin: 0 }}>Feedback</h2>
        <button
          type="button"
          className="btn"
          style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', background: 'var(--color-surface)' }}
          onClick={() => {
            setFeedbackError(null);
            listFeedback()
              .then(setFeedback)
              .catch((err) => setFeedbackError(err instanceof Error ? err.message : 'Failed to load'));
          }}
        >
          Refresh
        </button>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        {feedbackError && (
          <p style={{ color: '#c9302c', marginBottom: '0.5rem' }}>
            {feedbackError}
            <button
              type="button"
              className="btn"
              style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
              onClick={() => {
                setFeedbackError(null);
                listFeedback()
                  .then(setFeedback)
                  .catch((err) => setFeedbackError(err instanceof Error ? err.message : 'Failed to load'));
              }}
            >
              Retry
            </button>
          </p>
        )}
        {feedback.length === 0 && !feedbackError ? (
          <p style={{ color: 'var(--color-text-muted)' }}>
            No feedback submitted yet. Submit feedback at <a href="/request" style={{ color: 'var(--color-text)' }}>/request</a> to see it here.
          </p>
        ) : feedback.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedback.map((f) => (
              <FeedbackCard key={f.id} feedback={f} />
            ))}
          </div>
        ) : null}
      </div>
      <h2>Gallery Items</h2>
      <UploadDropzone onUpload={handleUpload} />
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

function FeedbackCard({ feedback }: { feedback: FeedbackDoc }) {
  const date = feedback.createdAt?.seconds
    ? new Date(feedback.createdAt.seconds * 1000).toLocaleString()
    : '—';
  const r = feedback.rating ?? 0;
  const stars = '★'.repeat(r) + '☆'.repeat(5 - r);
  const isIssue = (feedback.rating ?? 0) < 4 || feedback.issue_category;

  return (
    <div
      style={{
        padding: '1rem',
        background: 'var(--color-bg-subtle)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <strong>{feedback.name || 'Anonymous'}</strong>
          <span style={{ marginLeft: '0.5rem', color: 'var(--color-text-muted)' }}>{stars}</span>
        </div>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{date}</span>
      </div>
      {feedback.comment && <p style={{ margin: '0.5rem 0 0', whiteSpace: 'pre-wrap' }}>{feedback.comment}</p>}
      {feedback.initial_comment && feedback.initial_comment !== feedback.comment && (
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Initial: {feedback.initial_comment}
        </p>
      )}
      {isIssue && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
          {feedback.issue_category && <span>Category: {feedback.issue_category}</span>}
          {feedback.follow_up_request && <span style={{ marginLeft: '1rem' }}>Follow-up requested</span>}
        </div>
      )}
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
