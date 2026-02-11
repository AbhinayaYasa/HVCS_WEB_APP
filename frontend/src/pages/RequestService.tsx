import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StarRating from '../components/feedback/StarRating';
import PositiveReviewActions from '../components/feedback/PositiveReviewActions';
import IssueFeedbackForm from '../components/feedback/IssueFeedbackForm';
import { trackEvent } from '../lib/tracking';

/**
 * Validates token via backend API. Stubbed for now — returns true if token exists.
 */
async function validateToken(token: string): Promise<boolean> {
  try {
    const base = import.meta.env.VITE_API_BASE ?? '';
    const res = await fetch(`${base}/api/validate-token?token=${encodeURIComponent(token)}`);
    if (res.ok) {
      const data = await res.json();
      return data.valid === true;
    }
  } catch {
    // Backend may not exist — stub: accept any non-empty token
  }
  return token.length > 0;
}

type Step = 'form' | 'positive' | 'negative' | 'negative_done';

const inputStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  background: 'var(--color-bg-subtle)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: 8,
  color: 'var(--color-text)',
  width: '100%',
  fontFamily: 'inherit',
  fontSize: '1rem',
};

export default function RequestService() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? undefined;

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [step, setStep] = useState<Step>('form');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');

  // Step 1: Validate token and log page_open on load
  useEffect(() => {
    if (!token) {
      setTokenValid(true); // Allow access without token for flexibility
      trackEvent({ event: 'page_open', token: undefined });
      return;
    }
    validateToken(token).then((valid) => {
      setTokenValid(valid);
      trackEvent({ event: 'page_open', token });
    });
  }, [token]);

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) return;
    setStatus('submitting');

    trackEvent({
      event: 'feedback_submitted',
      token,
      rating,
      comment: comment || undefined,
    });
    trackEvent({
      event: 'rating_value',
      token,
      rating,
    });

    if (rating >= 4) {
      setStep('positive');
    } else {
      setStep('negative');
    }
    setStatus('idle');
  }

  function handleIssueFormSubmitted() {
    setStep('negative_done');
  }

  if (tokenValid === false) {
    return (
      <div className="feedback-page">
        <div className="feedback-page-content">
          <h1>Invalid Link</h1>
          <p className="feedback-muted">
            This feedback link is invalid or has expired. Please contact us if you need assistance.
          </p>
        </div>
      </div>
    );
  }

  if (tokenValid === null) {
    return (
      <div className="feedback-page">
        <div className="feedback-page-content">
          <p className="loading">Loading…</p>
        </div>
      </div>
    );
  }

  // Step 2: Feedback form (default view)
  if (step === 'form') {
    return (
      <div className="feedback-page">
        <div className="feedback-page-content">
          <h1>How was your experience?</h1>
          <p className="feedback-subtitle">
            Your feedback helps us serve you better.
          </p>
          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            <div className="feedback-rating-wrap">
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div className="form-field">
              <label htmlFor="feedback-comment">Tell us about your experience (optional)</label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="We'd love to hear from you..."
                style={{ ...inputStyle, resize: 'vertical' }}
                className="feedback-textarea"
              />
            </div>
            <button
              type="submit"
              className="btn btn-nav feedback-submit"
              disabled={rating < 1 || status === 'submitting'}
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 3a: Positive (4–5 stars) — thank you + review links
  if (step === 'positive') {
    return (
      <div className="feedback-page">
        <div className="feedback-page-content">
          <h1>Thank you!</h1>
          <p className="feedback-subtitle">
            We&apos;re glad you had a great experience.
          </p>
          <PositiveReviewActions token={token} testimonialText={comment} />
        </div>
      </div>
    );
  }

  // Step 3b: Negative (1–3 stars) — issue form
  if (step === 'negative') {
    return (
      <div className="feedback-page">
        <div className="feedback-page-content">
          <h1>We appreciate your feedback</h1>
          <IssueFeedbackForm token={token} onSubmitted={handleIssueFormSubmitted} />
        </div>
      </div>
    );
  }

  // Step 3b done — issue form submitted
  return (
    <div className="feedback-page">
      <div className="feedback-page-content">
        <h1>Thank you</h1>
        <p className="feedback-muted">
          We&apos;ve received your feedback and will use it to improve. If you requested a follow-up, we&apos;ll be in touch soon.
        </p>
      </div>
    </div>
  );
}
