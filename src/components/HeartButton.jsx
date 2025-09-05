import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
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

      const response = await fetch(`http://localhost:3001/api/favorites/check/${boatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      }
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
        const response = await fetch(`http://localhost:3001/api/favorites/${boatId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setIsFavorite(false);
          toast.success('Bateau retiré des favoris');
        } else {
          throw new Error('Erreur lors de la suppression');
        }
      } else {
        // Ajouter aux favoris
        const response = await fetch('http://localhost:3001/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ boatId })
        });

        if (response.ok) {
          setIsFavorite(true);
          toast.success('Bateau ajouté aux favoris !');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de l\'ajout');
        }
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
