import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, maxRating = 5, size = 16, interactive = false, onRatingChange }) {
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= rating;
    const isHalfFilled = starValue - 0.5 <= rating && rating < starValue;

    return (
      <button
        key={index}
        type="button"
        onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        disabled={!interactive}
      >
        <Star
          size={size}
          className={`${
            isFilled || isHalfFilled
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      </button>
    );
  });

  return <div className="flex items-center space-x-1">{stars}</div>;
}