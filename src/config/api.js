// Configuration des URLs d'API
export const API_BASE_URL = 'https://sailingloc-back-lilac.vercel.app';

// Endpoints de l'API
export const API_ENDPOINTS = {
  // Authentification
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  DASHBOARD: `${API_BASE_URL}/api/auth/dashboard`,
  USERS: `${API_BASE_URL}/api/auth/users`,
  
  // Bateaux
  BOATS: `${API_BASE_URL}/api/boats`,
  BOAT_DETAIL: (id) => `${API_BASE_URL}/api/boats/${id}`,
  MY_BOATS: `${API_BASE_URL}/api/boats/my-boats`,
  
  // Réservations
  BOOKINGS: `${API_BASE_URL}/api/bookings`,
  MY_BOOKINGS: `${API_BASE_URL}/api/bookings/my-bookings`,
  
  // Avis
  REVIEWS: `${API_BASE_URL}/api/reviews`,
  BOAT_REVIEWS: (boatId) => `${API_BASE_URL}/api/reviews/boat/${boatId}`,
  FIVE_STAR_REVIEWS: `${API_BASE_URL}/api/reviews/five-stars`,
  
  // Contact
  CONTACT: `${API_BASE_URL}/api/contact`,
  
  // Favoris
  FAVORITES: `${API_BASE_URL}/api/favorites`,
};

// Configuration des headers par défaut
export const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': token ? `Bearer ${token}` : '',
});

// Fonction utilitaire pour les appels API
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};
