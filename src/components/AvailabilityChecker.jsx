import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import AlertPopup from './AlertPopup';
import { API_ENDPOINTS, apiCall, getAuthHeaders } from '../config/api';

const AvailabilityChecker = ({ boatId, selectedStartDate, selectedEndDate, onAvailabilityChange }) => {
  const [availabilityPeriods, setAvailabilityPeriods] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityDetails, setAvailabilityDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertPopup, setAlertPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
    details: null
  });

  useEffect(() => {
    if (boatId) {
      loadAvailabilityData();
    }
  }, [boatId]);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      checkAvailability();
    }
  }, [selectedStartDate, selectedEndDate, availabilityPeriods, existingBookings]);

  // Vérifier la disponibilité dès qu'une date est sélectionnée
  useEffect(() => {
    if (selectedStartDate || selectedEndDate) {
      checkAvailabilityImmediate();
    }
  }, [selectedStartDate, selectedEndDate]);

  const loadAvailabilityData = async () => {
    setLoading(true);
    try {
      // Charger les périodes de disponibilité
      console.log('🔄 Chargement des disponibilités depuis MongoDB...');
      try {
        const availabilityData = await apiCall(`${API_ENDPOINTS.BOAT_DETAIL(boatId)}/availability`);
        setAvailabilityPeriods(availabilityData);
        console.log('✅ Disponibilités chargées:', availabilityData);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des disponibilités:', error.message);
      }

      // Charger les réservations existantes
      console.log('🔄 Chargement des réservations depuis MongoDB...');
      try {
        const bookingsData = await apiCall(`${API_ENDPOINTS.BOOKINGS}/boat/${boatId}`);
        if (bookingsData.success) {
          setExistingBookings(bookingsData.data);
          console.log('✅ Réservations chargées:', bookingsData.data);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vérification immédiate de la disponibilité (pour afficher le popup rapidement)
  const checkAvailabilityImmediate = () => {
    if (!selectedStartDate || !selectedEndDate || availabilityPeriods.length === 0) {
      return;
    }

    const startDate = new Date(selectedStartDate);
    const endDate = new Date(selectedEndDate);

    // Vérifier si la période est dans une période de disponibilité
    const matchingPeriod = availabilityPeriods.find(period => {
      const periodStart = new Date(period.startDate);
      const periodEnd = new Date(period.endDate);
      return startDate >= periodStart && endDate <= periodEnd;
    });

    if (!matchingPeriod) {
      // Afficher immédiatement le popup d'alerte
      setAlertPopup({
        isOpen: true,
        title: 'Période non disponible',
        message: 'La période sélectionnée n\'est pas dans la disponibilité générale du bateau.',
        type: 'error',
        details: {
          availabilityPeriods: availabilityPeriods
        }
      });
    }
  };

  const checkAvailability = () => {
    if (!selectedStartDate || !selectedEndDate) {
      setIsAvailable(false);
      setAvailabilityDetails(null);
      return;
    }

    const startDate = new Date(selectedStartDate);
    const endDate = new Date(selectedEndDate);

    // Vérifier que la date de fin est égale ou après la date de début (permet la réservation d'un seul jour)
    if (startDate > endDate) {
      setIsAvailable(false);
      setAvailabilityDetails({
        available: false,
        reason: 'La date de fin doit être égale ou postérieure à la date de début'
      });
      return;
    }

    // Vérifier que les dates ne sont pas dans le passé (mais accepter aujourd'hui)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      setIsAvailable(false);
      setAvailabilityDetails({
        available: false,
        reason: 'Les dates de réservation ne peuvent pas être dans le passé'
      });
      return;
    }

    // Vérifier si la période est dans une période de disponibilité
    const matchingPeriod = availabilityPeriods.find(period => {
      const periodStart = new Date(period.startDate);
      const periodEnd = new Date(period.endDate);
      return startDate >= periodStart && endDate <= periodEnd;
    });

    if (!matchingPeriod) {
      setIsAvailable(false);
      setAvailabilityDetails({
        available: false,
        reason: 'Cette période n\'est pas dans les disponibilités du bateau'
      });
      return;
    }

    // Vérifier les conflits avec les réservations existantes (pending et confirmed)
    const hasConflict = existingBookings.some(booking => {
      // Ignorer les réservations annulées
      if (booking.status === 'cancelled') return false;
      
      const bookingStart = new Date(booking.dateDebut);
      const bookingEnd = new Date(booking.dateFin);
      
      // Vérifier si les périodes se chevauchent
      return (startDate < bookingEnd && endDate > bookingStart);
    });

    if (hasConflict) {
      setIsAvailable(false);
      setAvailabilityDetails({
        available: false,
        reason: 'Cette période chevauche une réservation existante'
      });
      return;
    }

    // Calculer le prix total (minimum 1 jour pour les réservations d'un jour)
    const duration = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const totalPrice = duration * matchingPeriod.price;

    setIsAvailable(true);
    setAvailabilityDetails({
      available: true,
      period: matchingPeriod,
      duration: duration,
      totalPrice: totalPrice,
      pricePerDay: matchingPeriod.price
    });

    // Notifier le composant parent
    if (onAvailabilityChange) {
      onAvailabilityChange({
        available: true,
        period: matchingPeriod,
        duration: duration,
        totalPrice: totalPrice,
        pricePerDay: matchingPeriod.price
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const closeAlertPopup = () => {
    setAlertPopup({ ...alertPopup, isOpen: false });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
        <p className="text-gray-600">Vérification de la disponibilité...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
        Vérification de la disponibilité
      </h3>

      {/* Sélection des dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de début
          </label>
          <input
            type="date"
            value={selectedStartDate || ''}
            onChange={(e) => onAvailabilityChange && onAvailabilityChange({ startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de fin
          </label>
          <input
            type="date"
            value={selectedEndDate || ''}
            onChange={(e) => onAvailabilityChange && onAvailabilityChange({ endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={selectedStartDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Résultat de la vérification */}
      {selectedStartDate && selectedEndDate && (
        <div className="mb-6">
          {isAvailable ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800 mb-3">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Disponible pour cette période !</span>
              </div>
              
              {availabilityDetails && (
                <div className="space-y-2 text-sm text-green-700">
                  <p><span className="font-medium">Période:</span> {formatDate(selectedStartDate)} - {formatDate(selectedEndDate)}</p>
                  <p><span className="font-medium">Durée:</span> {availabilityDetails.duration} jour(s)</p>
                  <p><span className="font-medium">Prix par jour:</span> {availabilityDetails.pricePerDay}€</p>
                  <p className="text-lg font-semibold">
                    <span className="font-medium">Prix total:</span> {availabilityDetails.totalPrice}€
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800 mb-3">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">Non disponible pour cette période</span>
              </div>
              
              {availabilityDetails && (
                <p className="text-sm text-red-700">
                  <span className="font-medium">Raison:</span> {availabilityDetails.reason}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Périodes de disponibilité */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Périodes de disponibilité</h4>
        
        {availabilityPeriods.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune période de disponibilité définie</p>
        ) : (
          <div className="space-y-2">
            {availabilityPeriods.map((period) => (
              <div
                key={period.id}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">
                    {formatDate(period.startDate)} - {formatDate(period.endDate)}
                  </span>
                  <span className="font-semibold text-blue-900">
                    {period.price}€/jour
                  </span>
                </div>
                {period.notes && (
                  <p className="text-blue-600 text-xs mt-1">{period.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Réservations existantes */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Réservations existantes</h4>
        
        {existingBookings.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune réservation existante</p>
        ) : (
          <div className="space-y-2">
            {existingBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="text-orange-800">
                    {formatDate(booking.dateDebut)} - {formatDate(booking.dateFin)}
                  </span>
                  <span className="text-orange-600">
                    Réservé
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informations */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Comment ça fonctionne ?</p>
            <p>1. Sélectionnez vos dates de début et de fin</p>
            <p>2. Le système vérifie automatiquement la disponibilité</p>
            <p>3. Si disponible, vous pouvez procéder à la réservation</p>
            <p>4. Les dates déjà réservées sont automatiquement exclues</p>
          </div>
                 </div>
       </div>

       {/* Popup d'alerte */}
       <AlertPopup
         isOpen={alertPopup.isOpen}
         onClose={closeAlertPopup}
         title={alertPopup.title}
         message={alertPopup.message}
         type={alertPopup.type}
         details={alertPopup.details}
       />
     </div>
   );
 };

export default AvailabilityChecker;
