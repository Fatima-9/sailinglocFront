import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Euro, MapPin, Ship, Loader2, CheckCircle } from 'lucide-react';
import BoatCalendar from '../components/BoatCalendar';
import BookingConflictChecker from '../components/BookingConflictChecker';
import AlertPopup from '../components/AlertPopup';

export default function Reservation() {
  const { boatId } = useParams();
  const navigate = useNavigate();
  
  const [boat, setBoat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [existingBookings, setExistingBookings] = useState([]);
  const [alertPopup, setAlertPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
    details: null
  });
  
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

  // Vérifier la validité des dates et effacer l'erreur si nécessaire
  useEffect(() => {
    if (reservationData.startDate && reservationData.endDate && boat) {
      const startDate = new Date(reservationData.startDate);
      const endDate = new Date(reservationData.endDate);
      
      // Vérifier si les dates sont valides (accepter aujourd'hui)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate <= endDate && startDate >= today) {
        // Si les dates sont valides, effacer l'erreur
        setError('');
      }
    }
  }, [reservationData.startDate, reservationData.endDate, boat]);

  const fetchBoatDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/boats/${boatId}`);
      
      if (!response.ok) {
        throw new Error('Bateau non trouvé');
      }

      const data = await response.json();
      setBoat(data);
      
      // Récupérer les réservations existantes depuis la nouvelle route
      const bookingsResponse = await fetch(`http://localhost:3001/api/bookings/boat/${boatId}`);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        if (bookingsData.success) {
          setExistingBookings(bookingsData.data);
          console.log('Réservations existantes chargées:', bookingsData.data);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!reservationData.startDate || !reservationData.endDate || !boat) return;

    const start = new Date(reservationData.startDate);
    const end = new Date(reservationData.endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    
    const total = days * boat.prix_jour;
    setReservationData(prev => ({ ...prev, totalPrice: total }));
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

  const handleInputChange = (field, value) => {
    setReservationData(prev => ({ ...prev, [field]: value }));
    
    // Réinitialiser l'erreur quand une date est modifiée
    if (field === 'startDate' || field === 'endDate') {
      setError('');
    }
  };

  const handleDateSelect = (startDate, endDate) => {
    setReservationData(prev => ({
      ...prev,
      startDate: startDate || '',
      endDate: endDate || ''
    }));
    
    // Réinitialiser l'erreur dès qu'une date est modifiée
    setError('');
  };

  const handleConflictDetected = (alertData) => {
    setAlertPopup(alertData);
    
    // Si c'est une période non disponible, mettre à jour l'état d'erreur
    if (alertData.title === 'Période non disponible') {
      setError('Période non disponible - Veuillez sélectionner des dates valides');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reservationData.startDate || !reservationData.endDate) {
      setError('Veuillez sélectionner les dates de début et de fin');
      return;
    }

    const startDate = new Date(reservationData.startDate);
    const endDate = new Date(reservationData.endDate);
    
    if (startDate > endDate) {
      setError('La date de fin doit être égale ou postérieure à la date de début');
      return;
    }

    // Vérifier que la date de début n'est pas dans le passé (mais accepter aujourd'hui)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer seulement les dates
    
    if (startDate < today) {
      setError('La date de début ne peut pas être dans le passé');
      return;
    }

    // Vérifier les conflits de réservation
    if (existingBookings && existingBookings.length > 0) {
      const hasConflicts = existingBookings.some(booking => {
        if (booking.status === 'cancelled') return false;
        
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);
        
        // Réinitialiser l'heure pour la comparaison
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        bookingStart.setHours(0, 0, 0, 0);
        bookingEnd.setHours(0, 0, 0, 0);
        
        // Vérifier s'il y a un chevauchement
        return !(endDate <= bookingStart || startDate >= bookingEnd);
      });
      
      if (hasConflicts) {
        setError('La période sélectionnée chevauche des réservations existantes. Veuillez choisir une autre période.');
        return;
      }
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

      // Démarrer un paiement Stripe Checkout et rediriger
      const response = await fetch('http://localhost:3001/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          boatId: boatId,
          startDate: reservationData.startDate,
          endDate: reservationData.endDate,
          numberOfGuests: reservationData.numberOfGuests,
          specialRequests: reservationData.specialRequests
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l’initiation du paiement');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      setError(error.message);
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

                                 {/* Bouton de soumission - caché si période non disponible */}
                 {!error && (
                   <button
                     type="submit"
                     disabled={submitting}
                     className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     {submitting ? (
                       <div className="flex items-center justify-center space-x-2">
                         <Loader2 className="h-5 w-5 animate-spin" />
                         <span>Redirection vers le paiement...</span>
                       </div>
                     ) : (
                       'Confirmer la réservation'
                     )}
                   </button>
                 )}
              </form>

              {/* Vérificateur de conflits */}
              {reservationData.startDate && reservationData.endDate && (
                <BookingConflictChecker
                  startDate={reservationData.startDate}
                  endDate={reservationData.endDate}
                  boatAvailability={boat?.availability}
                  existingBookings={existingBookings}
                  onConflictDetected={handleConflictDetected}
                />
              )}
            </div>

            {/* Calendrier de disponibilité */}
            {boat && boat.availability && boat.availability.startDate && (
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendrier de disponibilité</h3>
                <BoatCalendar
                  boatAvailability={boat.availability}
                  existingBookings={existingBookings}
                  onDateSelect={handleDateSelect}
                  selectedStartDate={reservationData.startDate}
                  selectedEndDate={reservationData.endDate}
                />
              </div>
            )}
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

                {/* Informations de disponibilité */}
                {boat.availability && boat.availability.startDate && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center space-x-2 text-green-800 mb-2">
                      <Calendar size={16} />
                      <span className="font-medium text-sm">Disponibilité</span>
                    </div>
                    <div className="text-xs text-green-700 space-y-1">
                      <div>
                        Du {new Date(boat.availability.startDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div>
                        Au {new Date(boat.availability.endDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="font-medium">
                        Prix : {boat.availability.price}€ par jour
                      </div>
                      {boat.availability.notes && (
                        <div className="italic">
                          {boat.availability.notes}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                        {calculateDuration(reservationData.startDate, reservationData.endDate)} jours
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

      {/* Popup d'alerte */}
      <AlertPopup
        isOpen={alertPopup.isOpen}
        onClose={() => setAlertPopup({ ...alertPopup, isOpen: false })}
        title={alertPopup.title}
        message={alertPopup.message}
        type={alertPopup.type}
        details={alertPopup.details}
      />
    </div>
  );
}