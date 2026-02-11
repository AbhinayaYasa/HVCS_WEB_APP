import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

const STAR_COUNT = 5;

export default function StarRating({ value, onChange, disabled }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className="star-rating" role="group" aria-label="Rate your experience">
      {Array.from({ length: STAR_COUNT }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= display;
        return (
          <button
            key={starValue}
            type="button"
            className={`star-btn ${filled ? 'filled' : ''}`}
            onClick={() => !disabled && onChange(starValue)}
            onMouseEnter={() => !disabled && setHover(starValue)}
            onMouseLeave={() => !disabled && setHover(null)}
            disabled={disabled}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            aria-pressed={value === starValue}
          >
            <span className="star-icon" aria-hidden>{filled ? '★' : '☆'}</span>
          </button>
        );
      })}
    </div>
  );
}
