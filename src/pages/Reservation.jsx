import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Euro, MapPin, Ship, Loader2, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS, apiCall, getAuthHeaders } from '../config/api';

export default function Reservation() {
  const { boatId } = useParams();
  const navigate = useNavigate();
  
  const [boat, setBoat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [reservationData, setReservationData] = useState({
    startDate: '',
    endDate: '',
    numberOfGuests: 1,
    specialRequests: '',
    totalPrice: 0
  });

  // Récupérer les détails du bateau
  useEffect(() => {
    if (boatId) {
      fetchBoatDetails();
    }
  }, [boatId]);

  // Calculer le prix total quand les dates changent
  useEffect(() => {
    if (reservationData.startDate && reservationData.endDate && boat) {
      calculateTotalPrice();
    }
  }, [reservationData.startDate, reservationData.endDate, reservationData.numberOfGuests, boat]);

  const fetchBoatDetails = async () => {
    try {
      setLoading(true);
      console.log('🔄 Récupération des détails du bateau depuis MongoDB...');
      
      const data = await apiCall(API_ENDPOINTS.BOAT_DETAIL(boatId));
      console.log('✅ Détails du bateau récupérés:', data);
      
      setBoat(data);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des détails:', error);
      setError('Bateau non trouvé: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!reservationData.startDate || !reservationData.endDate || !boat) return;

    const start = new Date(reservationData.startDate);
    const end = new Date(reservationData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      const total = days * boat.prix_jour;
      setReservationData(prev => ({ ...prev, totalPrice: total }));
    }
  };

  const handleInputChange = (field, value) => {
    setReservationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reservationData.startDate || !reservationData.endDate) {
      setError('Veuillez sélectionner les dates de début et de fin');
      return;
    }

    const startDate = new Date(reservationData.startDate);
    const endDate = new Date(reservationData.endDate);
    
    if (startDate >= endDate) {
      setError('La date de fin doit être postérieure à la date de début');
      return;
    }

    if (startDate < new Date()) {
      setError('La date de début ne peut pas être dans le passé');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Récupérer le token d'authentification
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Vous devez être connecté pour effectuer une réservation');
        return;
      }

      console.log('🔄 Création de la réservation dans MongoDB...');
      
      const result = await apiCall(API_ENDPOINTS.BOOKINGS, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          boatId: boatId,
          startDate: reservationData.startDate,
          endDate: reservationData.endDate,
          numberOfGuests: reservationData.numberOfGuests,
          specialRequests: reservationData.specialRequests,
          totalPrice: reservationData.totalPrice
        })
      });

      console.log('✅ Réservation créée avec succès:', result);
      setSuccess(true);
      
      // Rediriger vers "Mes Réservations" après 3 secondes
      setTimeout(() => {
        navigate('/mes-reservations');
      }, 3000);

    } catch (error) {
      console.error('❌ Erreur lors de la création de la réservation:', error);
      setError('Erreur lors de la réservation: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du bateau...</p>
        </div>
      </div>
    );
  }

  if (error && !boat) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Ship className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <Link to="/bateaux" className="text-blue-600 hover:text-blue-700">
            Retourner à la liste des bateaux
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Réservation confirmée !
          </h2>
                     <p className="text-gray-600 mb-6">
             Votre réservation a été créée avec succès ! Elle apparaîtra dans votre espace "Mes Réservations".
           </p>
           <p className="text-sm text-gray-500">
             Redirection vers "Mes Réservations" dans quelques secondes...
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to={`/bateaux/${boatId}`}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Retour au bateau</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Réserver ce bateau</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de réservation */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails de la réservation</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={reservationData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={reservationData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Nombre de personnes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de personnes
                  </label>
                  <select
                    value={reservationData.numberOfGuests}
                    onChange={(e) => handleInputChange('numberOfGuests', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(boat.capacite)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} personne{i + 1 > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Demandes spéciales */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demandes spéciales (optionnel)
                  </label>
                  <textarea
                    value={reservationData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Équipements supplémentaires, préférences particulières..."
                  />
                </div>

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Création de la réservation...</span>
                    </div>
                  ) : (
                    'Confirmer la réservation'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Résumé de la réservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
              
              {/* Informations du bateau */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={boat.image}
                    alt={boat.nom}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{boat.nom}</h4>
                    <p className="text-sm text-gray-600 capitalize">{boat.type}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{boat.localisation}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} />
                    <span>Capacité : {boat.capacite} personnes</span>
                  </div>
                </div>
              </div>

              {/* Détails de la réservation */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Prix par jour</span>
                  <span className="font-medium">{boat.prix_jour}€</span>
                </div>
                
                {reservationData.startDate && reservationData.endDate && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-medium">
                        {Math.ceil((new Date(reservationData.endDate) - new Date(reservationData.startDate)) / (1000 * 60 * 60 * 24))} jours
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Nombre de personnes</span>
                      <span className="font-medium">{reservationData.numberOfGuests}</span>
                    </div>
                  </>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg text-blue-600">{reservationData.totalPrice}€</span>
                  </div>
                </div>
              </div>

              {/* Informations importantes */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-medium text-blue-900 mb-2">Informations importantes</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Réservation sécurisée</li>
                  <li>• Annulation gratuite jusqu'à 24h avant</li>
                  <li>• Paiement sécurisé</li>
                  <li>• Support client 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
