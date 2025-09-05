import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { API_ENDPOINTS, apiCall, getAuthHeaders } from '../config/api';
import { toast } from 'react-toastify';

export default function HeartButton({ boatId, className = "" }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [boatId]);

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const data = await apiCall(`${API_ENDPOINTS.FAVORITES}/check/${boatId}`, {
        headers: getAuthHeaders(token)
      });
      
      setIsFavorite(data.isFavorite);
    } catch (error) {
      console.error('Erreur vérification favori:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        toast.error('Vous devez être connecté pour ajouter des favoris');
        return;
      }

      if (isFavorite) {
        // Supprimer des favoris
        await apiCall(`${API_ENDPOINTS.FAVORITES}/${boatId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(token)
        });
        
        setIsFavorite(false);
        toast.success('Bateau retiré des favoris');
      } else {
        // Ajouter aux favoris
        await apiCall(API_ENDPOINTS.FAVORITES, {
          method: 'POST',
          headers: getAuthHeaders(token),
          body: JSON.stringify({ boatId })
        });
        
        setIsFavorite(true);
        toast.success('Bateau ajouté aux favoris !');
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la gestion des favoris');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
        isFavorite 
          ? 'bg-red-500 text-white shadow-lg' 
          : 'bg-white/90 text-gray-600 hover:bg-white'
      } ${className}`}
      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart 
        size={20} 
        className={`transition-all duration-200 ${
          isFavorite ? 'fill-current' : ''
        }`}
      />
    </button>
  );
}
