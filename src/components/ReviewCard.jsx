import React from 'react';
import { ThumbsUp, MessageSquare, Calendar } from 'lucide-react';
import StarRating from './StarRating';

export default function ReviewCard({ review, onHelpfulClick }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleHelpfulClick = () => {
    if (onHelpfulClick) {
      onHelpfulClick(review._id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* En-tête de l'avis */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {review.userId?.nom?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {review.userId?.nom} {review.userId?.prenom}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <StarRating rating={review.rating} size={20} />
          <p className="text-sm text-gray-500 mt-1">
            {review.rating === 1 && 'Très mauvais'}
            {review.rating === 2 && 'Mauvais'}
            {review.rating === 3 && 'Moyen'}
            {review.rating === 4 && 'Bon'}
            {review.rating === 5 && 'Excellent'}
          </p>
        </div>
      </div>

      {/* Commentaire */}
      <div className="mb-4">
        <div className="flex items-start space-x-2">
          <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        </div>
      </div>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {review.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleHelpfulClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm">
              Utile ({review.helpful || 0})
            </span>
          </button>
        </div>
        
        {review.bookingId && (
          <div className="text-xs text-gray-500">
            Avis basé sur une réservation
          </div>
        )}
      </div>
    </div>
  );
}
