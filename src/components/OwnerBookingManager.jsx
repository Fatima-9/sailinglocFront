import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, Ship, Calendar, Euro } from 'lucide-react';

const OwnerBookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOwnerBookings();
  }, []);

  const loadOwnerBookings = async () => {
    try {
      setLoading(true);
      setError(''); // Réinitialiser les erreurs
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      
      const response = await fetch('http://localhost:3001/api/bookings/owner', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      if (data.success) {
        setBookings(data.data);
        if (data.message) {
          console.log(data.message);
        }
      } else {
        throw new Error(data.message || 'Erreur lors du chargement des réservations');
      }
    } catch (error) {
      console.error('Erreur loadOwnerBookings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerAction = async (bookingId, action) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      
      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}/owner-action`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      if (data.success) {
        // Recharger les données pour avoir les informations à jour
        await loadOwnerBookings();
        alert(data.message);
      } else {
        throw new Error(data.message || 'Erreur lors de l\'action');
      }
    } catch (error) {
      console.error('Erreur handleOwnerAction:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmée
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Annulée
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Terminée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Réinitialiser l'heure pour la comparaison des dates
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Une réservation d'un jour (même date) compte pour 1 jour
    // Une réservation de plusieurs jours compte le nombre exact de jours
    return Math.max(1, Math.ceil(diffDays));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Erreur: {error}</p>
      </div>
    );
  }

  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const otherBookings = bookings.filter(booking => booking.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Réservations en attente */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 text-yellow-600 mr-2" />
          Réservations en attente de confirmation ({pendingBookings.length})
        </h3>
        
        {pendingBookings.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune réservation en attente</p>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <div key={booking._id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <User className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.userId?.nom} {booking.userId?.prenom}
                        </p>
                        <p className="text-sm text-gray-600">{booking.userId?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <Ship className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{booking.boatId?.nom}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Du {formatDate(booking.startDate)} au {formatDate(booking.endDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <Euro className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Total: {booking.totalPrice}€ ({calculateDuration(booking.startDate, booking.endDate)} jours)
                      </span>
                    </div>
                    
                    {booking.numberOfGuests && (
                      <p className="text-sm text-gray-600">
                        Nombre de personnes: {booking.numberOfGuests}
                      </p>
                    )}
                    
                    {booking.specialRequests && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Demandes spéciales:</span> {booking.specialRequests}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    {getStatusBadge(booking.status)}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOwnerAction(booking._id, 'confirm')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirmer
                      </button>
                      
                      <button
                        onClick={() => handleOwnerAction(booking._id, 'refuse')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Refuser
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Autres réservations */}
      {otherBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Autres réservations</h3>
          <div className="space-y-4">
            {otherBookings.map((booking) => (
              <div key={booking._id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <User className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.userId?.nom} {booking.userId?.prenom}
                        </p>
                        <p className="text-sm text-gray-600">{booking.userId?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <Ship className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{booking.boatId?.nom}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Du {formatDate(booking.startDate)} au {formatDate(booking.endDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <Euro className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Total: {booking.totalPrice}€
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerBookingManager;
