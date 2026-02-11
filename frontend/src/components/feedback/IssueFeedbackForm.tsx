import { useState } from 'react';
import { trackEvent } from '../../lib/tracking';

export type IssueCategory = 'Driver experience' | 'Scheduling' | 'Communication' | 'Vehicle' | 'Other';

const ISSUE_CATEGORIES: IssueCategory[] = [
  'Driver experience',
  'Scheduling',
  'Communication',
  'Vehicle',
  'Other',
];

interface IssueFeedbackFormProps {
  token?: string;
  onSubmitted: () => void;
}

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

export default function IssueFeedbackForm({ token, onSubmitted }: IssueFeedbackFormProps) {
  const [category, setCategory] = useState<IssueCategory>('Driver experience');
  const [comment, setComment] = useState('');
  const [followUp, setFollowUp] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');

    trackEvent({
      event: 'feedback_submitted',
      token,
      rating: 0,
      issue_category: category,
      follow_up_request: followUp,
      comment: comment || undefined,
    });

    // Stub: assume success (backend would persist)
    setStatus('idle');
    onSubmitted();
  }

  return (
    <form onSubmit={handleSubmit} className="issue-feedback-form">
      <p className="issue-feedback-message">
        We&apos;re sorry — your feedback helps us improve.
      </p>
      <div className="form-field">
        <label htmlFor="issue-category">What could we improve?</label>
        <select
          id="issue-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as IssueCategory)}
          required
          style={inputStyle}
          className="issue-select"
        >
          {ISSUE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="issue-comment">Additional details (optional)</label>
        <textarea
          id="issue-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Tell us more..."
          style={{ ...inputStyle, resize: 'vertical' }}
          className="issue-textarea"
        />
      </div>
      <label className="issue-checkbox-label">
        <input
          type="checkbox"
          checked={followUp}
          onChange={(e) => setFollowUp(e.target.checked)}
          className="issue-checkbox"
        />
        I&apos;d like someone from HVCS to follow up
      </label>
      <button
        type="submit"
        className="btn btn-nav issue-submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  );
}
