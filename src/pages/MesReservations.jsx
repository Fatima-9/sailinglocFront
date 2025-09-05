import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Euro, MapPin, Ship, Loader2, Clock, XCircle, AlertCircle } from 'lucide-react';

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      
      // Récupérer le token d'authentification
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Vous devez être connecté pour voir vos réservations');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des réservations');
      }

      const data = await response.json();
      setReservations(data.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: <Clock size={20} className="text-blue-600" />,
          label: 'Confirmée',
          color: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'pending':
        return {
          icon: <Clock size={20} className="text-yellow-600" />,
          label: 'En attente',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'cancelled':
        return {
          icon: <XCircle size={20} className="text-red-600" />,
          label: 'Annulée',
          color: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          icon: <AlertCircle size={20} className="text-gray-600" />,
          label: status,
          color: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/connexion" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Réservations</h1>
              <p className="text-gray-600 mt-2">
                Gérez et suivez toutes vos réservations de bateaux
              </p>
            </div>
            <Link
              to="/bateaux"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réserver un bateau
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reservations.length === 0 ? (
          <div className="text-center py-16">
            <Ship className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Aucune réservation pour le moment
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Vous n'avez pas encore de réservations. Commencez par explorer nos bateaux disponibles et réservez votre première sortie en mer !
            </p>
            <Link
              to="/bateaux"
              className="inline-block bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Découvrir nos bateaux
            </Link>
          </div>
        ) : (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Confirmées</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reservations.filter(r => r.status === 'confirmed').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En attente</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reservations.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des réservations */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Toutes vos réservations</h2>
              
              {reservations.map((reservation) => {
                const statusInfo = getStatusInfo(reservation.status);
                const duration = calculateDuration(reservation.startDate, reservation.endDate);
                
                return (
                  <div key={reservation._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {reservation.boatId?.nom || 'Bateau'}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                              {statusInfo.icon}
                              <span className="ml-1">{statusInfo.label}</span>
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                Du {formatDate(reservation.startDate)} au {formatDate(reservation.endDate)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{duration} jour{duration > 1 ? 's' : ''}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{reservation.numberOfGuests} personne{reservation.numberOfGuests > 1 ? 's' : ''}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Euro className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600 font-medium">{reservation.totalPrice}€</span>
                            </div>
                          </div>
                          
                          {reservation.specialRequests && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-600">
                                <strong>Demandes spéciales :</strong> {reservation.specialRequests}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <Link
                            to={`/bateaux/${reservation.boatId?._id || reservation.boatId}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Voir le bateau
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal d'ajout d'avis */}
      {/* The AddReview component is no longer used here as per the edit hint. */}
    </div>
  );
}
