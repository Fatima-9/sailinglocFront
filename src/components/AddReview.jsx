import React, { useState } from 'react';
import { Star, MessageSquare, Send, X } from 'lucide-react';

export default function AddReview({ isOpen, onClose, onReviewAdded, boatData, bookingId }) {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.comment.trim()) {
        throw new Error('Le commentaire est obligatoire');
      }

      if (formData.comment.trim().length < 10) {
        throw new Error('Le commentaire doit contenir au moins 10 caractères');
      }

      if (formData.comment.trim().length > 1000) {
        throw new Error('Le commentaire ne peut pas dépasser 1000 caractères');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté');
      }

      const response = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          boatId: boatData._id,
          bookingId: bookingId,
          rating: formData.rating,
          comment: formData.comment.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'ajout de l\'avis');
      }

      setSuccess('Avis ajouté avec succès !');
      
      if (onReviewAdded) {
        onReviewAdded(data.data);
      }

      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      rating: 5,
      comment: '',
      images: []
    });
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Laisser un avis
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Informations du bateau */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Bateau : {boatData?.nom}</h3>
            <p className="text-sm text-gray-600">Type : {boatData?.type}</p>
          </div>

          {/* Note avec étoiles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Note globale *
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`p-1 transition-colors ${
                    star <= formData.rating
                      ? 'text-yellow-400 hover:text-yellow-500'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {formData.rating === 1 && 'Très mauvais'}
              {formData.rating === 2 && 'Mauvais'}
              {formData.rating === 3 && 'Moyen'}
              {formData.rating === 4 && 'Bon'}
              {formData.rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Commentaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre avis *
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Partagez votre expérience avec ce bateau... (minimum 10 caractères)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.comment.length}/1000 caractères
            </p>
          </div>



          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Publier l'avis
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
