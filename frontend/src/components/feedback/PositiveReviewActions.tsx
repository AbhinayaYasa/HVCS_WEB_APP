import { trackEvent } from '../../lib/tracking';

interface PositiveReviewActionsProps {
  token?: string;
  testimonialText?: string;
}

// Business social and review URLs. Override via env if needed.
const REVIEW_LINKS = {
  google: import.meta.env.VITE_GOOGLE_REVIEW_URL ?? 'https://search.google.com/local/writereview?placeid=',
  facebook: import.meta.env.VITE_FACEBOOK_PAGE_URL ?? 'https://www.facebook.com/hvconcierge/reviews',
  yelp: import.meta.env.VITE_YELP_REVIEW_URL ?? 'https://www.yelp.com/writeareview',
  instagram: 'https://www.instagram.com/hvconcierge/',
  linkedin: 'https://www.linkedin.com/company/28609293/',
};

export default function PositiveReviewActions({ token, testimonialText }: PositiveReviewActionsProps) {
  const handleClick = (platform: 'click_google' | 'click_facebook' | 'click_yelp' | 'click_social_share') => {
    trackEvent({ event: platform, token });
  };

  const handleShare = async () => {
    trackEvent({ event: 'click_social_share', token });
    const text = testimonialText || 'I had a wonderful experience with Hudson Valley Concierge Service. Highly recommend!';
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="positive-review-actions">
      <p className="positive-review-message">
        We&apos;re glad you had a great experience. Would you like to share it publicly?
      </p>
      <p className="positive-review-hint">
        You may need to be logged into Facebook or Instagram to view our pages.
      </p>
      <div className="review-buttons">
        <a
          href={REVIEW_LINKS.google}
          target="_blank"
          rel="noopener noreferrer"
          className="review-btn"
          onClick={() => handleClick('click_google')}
        >
          <span className="review-btn-icon" aria-hidden>⭐</span>
          Leave a Google Review
        </a>
        <a
          href={REVIEW_LINKS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="review-btn"
          onClick={() => handleClick('click_facebook')}
        >
          <span className="review-btn-icon" aria-hidden>👍</span>
          Leave a Facebook Review
        </a>
        <a
          href={REVIEW_LINKS.yelp}
          target="_blank"
          rel="noopener noreferrer"
          className="review-btn"
          onClick={() => handleClick('click_yelp')}
        >
          <span className="review-btn-icon" aria-hidden>📍</span>
          Find us on Yelp
        </a>
        <a
          href={REVIEW_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="review-btn"
          onClick={() => handleClick('click_social_share')}
        >
          <span className="review-btn-icon" aria-hidden>📷</span>
          Find us on Instagram
        </a>
        <a
          href={REVIEW_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="review-btn"
          onClick={() => handleClick('click_social_share')}
        >
          <span className="review-btn-icon" aria-hidden>💼</span>
          Find us on LinkedIn
        </a>
        <button
          type="button"
          className="review-btn review-btn-share"
          onClick={handleShare}
        >
          <span className="review-btn-icon" aria-hidden>📲</span>
          Copy testimonial to share
        </button>
      </div>
    </div>
  );
}
