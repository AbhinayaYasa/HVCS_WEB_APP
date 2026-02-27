import { trackEvent } from '../../lib/tracking';

interface PositiveReviewActionsProps {
  token?: string;
  testimonialText?: string;
}

// Business social and review URLs. Override via env if needed.
// Google: place URL with place ID ensures HVCS opens (not current location). Sign-in handled by Google when user clicks "Write a review".
const REVIEW_LINKS = {
  google: import.meta.env.VITE_GOOGLE_REVIEW_URL ?? 'https://www.google.com/maps/place/Hudson+Valley+Concierge+Service/@41.642971,-73.9232181,17z/data=!4m6!3m5!1s0x89dd3dade96d39b3:0x585e3b3bf2f0e949!8m2!3d41.642971!4d-73.9232181!16s%2Fg%2F1260z3mc_',
  facebook: import.meta.env.VITE_FACEBOOK_PAGE_URL ?? 'https://www.facebook.com/hvconcierge/reviews',
  instagram: 'https://www.instagram.com/hvconcierge/',
  linkedin: 'https://www.linkedin.com/company/28609293/',
};

export default function PositiveReviewActions({ token, testimonialText }: PositiveReviewActionsProps) {
  const handleClick = (platform: 'click_google' | 'click_facebook' | 'click_social_share') => {
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
          <span className="review-btn-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </span>
          Leave a Google Review
        </a>
        <a
          href={REVIEW_LINKS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="review-btn"
          onClick={() => handleClick('click_facebook')}
        >
          <span className="review-btn-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </span>
          Leave a Facebook Review
        </a>
        <a
          href={REVIEW_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="review-btn"
          onClick={() => handleClick('click_social_share')}
        >
          <span className="review-btn-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="url(#ig-gradient)" aria-hidden>
              <defs>
                <linearGradient id="ig-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </span>
          Find us on Instagram
        </a>
        <a
          href={REVIEW_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="review-btn"
          onClick={() => handleClick('click_social_share')}
        >
          <span className="review-btn-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="#0A66C2" aria-hidden>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </span>
          Find us on LinkedIn
        </a>
        <button
          type="button"
          className="review-btn review-btn-share"
          onClick={handleShare}
        >
          <span className="review-btn-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
          </span>
          Copy testimonial to share
        </button>
      </div>
    </div>
  );
}
