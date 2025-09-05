import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const BookingConflictChecker = ({ startDate, endDate, boatAvailability, existingBookings, onConflictDetected }) => {
  useEffect(() => {
    // Vérifier les conflits et déclencher le popup si nécessaire
    if (startDate && endDate && onConflictDetected) {
      const conflicts = hasConflicts();
      if (conflicts) {
        const conflictingBookings = getConflictingBookings();
        onConflictDetected({
          title: 'Conflit de réservation détecté',
          message: 'La période sélectionnée chevauche des réservations existantes.',
          type: 'error',
          details: { conflictingBookings }
        });
      }
    }
  }, [startDate, endDate, existingBookings, onConflictDetected]);

  if (!startDate || !endDate) {
    return null;
  }

  // Vérifier si la période est dans la disponibilité générale
  const isInAvailability = () => {
    if (!boatAvailability || !boatAvailability.startDate || !boatAvailability.endDate) {
      return false;
    }
    
    const availabilityStart = new Date(boatAvailability.startDate);
    const availabilityEnd = new Date(boatAvailability.endDate);
    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);
    
    // Réinitialiser l'heure pour la comparaison
    availabilityStart.setHours(0, 0, 0, 0);
    availabilityEnd.setHours(0, 0, 0, 0);
    requestedStart.setHours(0, 0, 0, 0);
    requestedEnd.setHours(0, 0, 0, 0);
    
    return requestedStart >= availabilityStart && requestedEnd <= availabilityEnd;
  };

  // Vérifier les conflits avec les réservations existantes
  const hasConflicts = () => {
    if (!existingBookings || existingBookings.length === 0) {
      return false;
    }
    
    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);
    
    requestedStart.setHours(0, 0, 0, 0);
    requestedEnd.setHours(0, 0, 0, 0);
    
    return existingBookings.some(booking => {
      if (booking.status === 'cancelled') return false;
      
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      bookingStart.setHours(0, 0, 0, 0);
      bookingEnd.setHours(0, 0, 0, 0);
      
      // Vérifier s'il y a un chevauchement
      return !(requestedEnd <= bookingStart || requestedStart >= bookingEnd);
    });
  };

  // Trouver les réservations en conflit
  const getConflictingBookings = () => {
    if (!existingBookings || existingBookings.length === 0) {
      return [];
    }
    
    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);
    
    requestedStart.setHours(0, 0, 0, 0);
    requestedEnd.setHours(0, 0, 0, 0);
    
    return existingBookings.filter(booking => {
      if (booking.status === 'cancelled') return false;
      
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      bookingStart.setHours(0, 0, 0, 0);
      bookingEnd.setHours(0, 0, 0, 0);
      
      // Vérifier s'il y a un chevauchement
      return !(requestedEnd <= bookingStart || requestedStart >= bookingEnd);
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

  const inAvailability = isInAvailability();
  const conflicts = hasConflicts();
  const conflictingBookings = getConflictingBookings();

  if (!inAvailability) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 text-red-800 mb-2">
          <XCircle className="h-5 w-5" />
          <span className="font-medium">Période non disponible</span>
        </div>
        <p className="text-sm text-red-700">
          La période sélectionnée n'est pas dans la disponibilité générale du bateau.
        </p>
        <p className="text-sm text-red-600 mt-1">
          Disponibilité : du {new Date(boatAvailability?.startDate).toLocaleDateString('fr-FR')} 
          au {new Date(boatAvailability?.endDate).toLocaleDateString('fr-FR')}
        </p>
      </div>
    );
  }

  if (conflicts) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 text-red-800 mb-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">⚠️ DATES INDISPONIBLES</span>
        </div>
        <p className="text-sm text-red-700 mb-3">
          La période sélectionnée chevauche des réservations existantes :
        </p>
        <div className="space-y-2">
          {conflictingBookings.map((booking, index) => (
            <div key={index} className="bg-red-100 border border-red-200 rounded p-2">
              <div className="text-sm text-red-800">
                <span className="font-medium">Réservé du :</span> {new Date(booking.startDate).toLocaleDateString('fr-FR')}
              </div>
              <div className="text-sm text-red-800">
                <span className="font-medium">Au :</span> {new Date(booking.endDate).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-red-600 mt-3">
          Veuillez sélectionner une autre période ou contacter le propriétaire.
        </p>
      </div>
    );
  }

  // Aucun conflit - période disponible
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2 text-green-800 mb-2">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Période disponible</span>
      </div>
      <p className="text-sm text-green-700">
        La période sélectionnée est disponible et peut être réservée.
      </p>
      <div className="mt-2 text-sm text-green-600">
        <div>Du : {new Date(startDate).toLocaleDateString('fr-FR')}</div>
        <div>Au : {new Date(endDate).toLocaleDateString('fr-FR')}</div>
        <div className="font-medium mt-1">
          Durée : {calculateDuration(startDate, endDate)} jours
        </div>
      </div>
    </div>
  );
};

export default BookingConflictChecker;
