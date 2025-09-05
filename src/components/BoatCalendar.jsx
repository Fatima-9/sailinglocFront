import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, AlertTriangle } from 'lucide-react';
import AlertPopup from './AlertPopup';

const BoatCalendar = ({ boatAvailability, existingBookings = [], onDateSelect, selectedStartDate, selectedEndDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [alertPopup, setAlertPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
    details: null
  });

  // Fonction pour obtenir le premier jour du mois
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Fonction pour obtenir le dernier jour du mois
  const getLastDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // Fonction pour obtenir le nombre de jours dans le mois
  const getDaysInMonth = (date) => {
    return getLastDayOfMonth(date).getDate();
  };

  // Fonction pour obtenir le jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
  const getFirstDayOfWeek = (date) => {
    return getFirstDayOfMonth(date).getDay();
  };

  // Fonction pour vérifier si une date est dans la disponibilité
  const isDateInAvailability = (date) => {
    if (!boatAvailability || !boatAvailability.startDate || !boatAvailability.endDate) {
      return false;
    }
    
    const startDate = new Date(boatAvailability.startDate);
    const endDate = new Date(boatAvailability.endDate);
    const checkDate = new Date(date);
    
    // Réinitialiser l'heure pour la comparaison
    checkDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    return checkDate >= startDate && checkDate <= endDate;
  };

  // Fonction pour vérifier si une date est réservée (pending ou confirmed)
  const isDateBooked = (date) => {
    if (!existingBookings || existingBookings.length === 0) {
      return false;
    }
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return existingBookings.some(booking => {
      // Ignorer les réservations annulées
      if (booking.status === 'cancelled') return false;
      
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      bookingStart.setHours(0, 0, 0, 0);
      bookingEnd.setHours(0, 0, 0, 0);
      
      return checkDate >= bookingStart && checkDate <= bookingEnd;
    });
  };

  // Fonction pour obtenir les réservations en conflit pour une date donnée
  const getConflictingBookings = (date) => {
    if (!existingBookings || existingBookings.length === 0) {
      return [];
    }
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return existingBookings.filter(booking => {
      if (booking.status === 'cancelled') return false;
      
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      bookingStart.setHours(0, 0, 0, 0);
      bookingEnd.setHours(0, 0, 0, 0);
      
      return checkDate >= bookingStart && checkDate <= bookingEnd;
    });
  };

  // Fonction pour vérifier si une date est sélectionnée
  const isDateSelected = (date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    
    const checkDate = new Date(date);
    const startDate = new Date(selectedStartDate);
    const endDate = new Date(selectedEndDate);
    
    // Réinitialiser l'heure pour la comparaison
    checkDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    return checkDate >= startDate && checkDate <= endDate;
  };

  // Fonction pour vérifier si une date est la date de début sélectionnée
  const isStartDate = (date) => {
    if (!selectedStartDate) return false;
    
    const checkDate = new Date(date);
    const startDate = new Date(selectedStartDate);
    
    checkDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    
    return checkDate.getTime() === startDate.getTime();
  };

  // Fonction pour vérifier si une date est la date de fin sélectionnée
  const isEndDate = (date) => {
    if (!selectedEndDate) return false;
    
    const checkDate = new Date(date);
    const endDate = new Date(selectedEndDate);
    
    checkDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    return checkDate.getTime() === endDate.getTime();
  };

  // Fonction pour vérifier si une date est cliquable (disponible ET non réservée ET pas dans le passé)
  const isDateClickable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // La date doit être disponible, non réservée, et pas dans le passé (mais accepter aujourd'hui)
    return isDateInAvailability(date) && !isDateBooked(date) && checkDate >= today;
  };

  // Fonction pour gérer le clic sur une date
  const handleDateClick = (date) => {
    // Si la date est réservée, afficher le popup d'alerte
    if (isDateBooked(date)) {
      const conflictingBookings = getConflictingBookings(date);
      setAlertPopup({
        isOpen: true,
        title: 'Dates indisponibles',
        message: 'Ces dates sont déjà réservées par un autre client.',
        type: 'error',
        details: { conflictingBookings }
      });
      return;
    }

    // Si la date n'est pas dans la disponibilité générale, afficher le popup
    if (!isDateInAvailability(date)) {
      setAlertPopup({
        isOpen: true,
        title: 'Période non disponible',
        message: 'Cette date n\'est pas dans la disponibilité générale du bateau.',
        type: 'error',
        details: null
      });
      return;
    }

    // Si la date n'est pas cliquable, ne rien faire
    if (!isDateClickable(date)) return;
    
    const dateStr = date.toISOString().split('T')[0];
    
    if (!selectedStartDate) {
      // Première sélection : date de début
      onDateSelect(dateStr, null);
    } else if (!selectedEndDate) {
      // Deuxième sélection : date de fin
      if (new Date(dateStr) > new Date(selectedStartDate)) {
        onDateSelect(selectedStartDate, dateStr);
      } else {
        // Si la date de fin est avant la date de début, on inverse
        onDateSelect(dateStr, selectedStartDate);
      }
    } else {
      // Nouvelle sélection : on recommence
      onDateSelect(dateStr, null);
    }
  };

  // Fonction pour aller au mois précédent
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Fonction pour aller au mois suivant
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Fonction pour aller au mois actuel
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  // Générer le calendrier
  const generateCalendar = () => {
    const firstDay = getFirstDayOfMonth(currentMonth);
    const lastDay = getLastDayOfMonth(currentMonth);
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfWeek = getFirstDayOfWeek(currentMonth);
    
    const calendar = [];
    
    // Ajouter les jours du mois précédent pour remplir la première semaine
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
      calendar.push({
        date,
        isCurrentMonth: false,
        isClickable: false
      });
    }
    
    // Ajouter les jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      calendar.push({
        date,
        isCurrentMonth: true,
        isClickable: isDateClickable(date)
      });
    }
    
    // Ajouter les jours du mois suivant pour remplir la dernière semaine
    const remainingDays = 42 - calendar.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day);
      calendar.push({
        date,
        isCurrentMonth: false,
        isClickable: false
      });
    }
    
    return calendar;
  };

  // Formater le nom du mois
  const formatMonth = (date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  // Formater le nom du jour
  const formatDayName = (dayIndex) => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days[dayIndex];
  };

  const calendar = generateCalendar();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
          Calendrier de disponibilité
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          
          <button
            onClick={goToCurrentMonth}
            className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Aujourd'hui
          </button>
          
          <button
            onClick={goToNextMonth}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Informations sur la disponibilité */}
      {boatAvailability && boatAvailability.startDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-blue-800 mb-2">
            <Check className="h-4 w-4" />
            <span className="font-medium">Disponibilité du bateau</span>
          </div>
          <p className="text-sm text-blue-700">
            Du {new Date(boatAvailability.startDate).toLocaleDateString('fr-FR')} 
            au {new Date(boatAvailability.endDate).toLocaleDateString('fr-FR')}
          </p>
          <p className="text-sm text-blue-700">
            Prix : {boatAvailability.price}€ par jour
          </p>
          {boatAvailability.notes && (
            <p className="text-sm text-blue-600 mt-1">
              Notes : {boatAvailability.notes}
            </p>
          )}
        </div>
      )}

      {/* En-têtes des jours */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1">
        {calendar.map((day, index) => {
          const isInAvailability = isDateInAvailability(day.date);
          const isBooked = isDateBooked(day.date);
          const isSelected = isDateSelected(day.date);
          const isStart = isStartDate(day.date);
          const isEnd = isEndDate(day.date);
          const isToday = day.date.toDateString() === new Date().toDateString();
          
          let bgColor = 'bg-white';
          let textColor = 'text-gray-400';
          let borderColor = 'border-gray-200';
          
          if (day.isCurrentMonth) {
            if (isSelected) {
              if (isStart || isEnd) {
                bgColor = 'bg-blue-600';
                textColor = 'text-white';
                borderColor = 'border-blue-600';
              } else {
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                borderColor = 'border-blue-200';
              }
            } else if (isBooked) {
              // Date réservée - en rouge
              bgColor = 'bg-red-100';
              textColor = 'text-red-800';
              borderColor = 'border-red-200';
            } else if (isInAvailability) {
              // Date disponible et non réservée - en vert
              bgColor = 'bg-green-50';
              textColor = 'text-green-800';
              borderColor = 'border-green-200';
            } else {
              textColor = 'text-gray-900';
            }
          }
          
          if (isToday) {
            borderColor = 'border-blue-500';
          }
          
          return (
            <div
              key={index}
              className={`
                ${bgColor} ${textColor} ${borderColor}
                border rounded-lg p-2 text-center text-sm cursor-pointer
                transition-all duration-200 hover:shadow-md
                ${day.isClickable ? 'hover:scale-105' : ''}
                ${!day.isCurrentMonth ? 'opacity-50' : ''}
                ${!day.isClickable ? 'cursor-not-allowed' : ''}
              `}
              onClick={() => handleDateClick(day.date)}
              onMouseEnter={() => setHoveredDate(day.date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <div className="font-medium">
                {day.date.getDate()}
              </div>
              
              {/* Indicateurs visuels */}
              {isToday && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
              )}
              
              {isInAvailability && !isSelected && !isBooked && (
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
              )}
              
              {isBooked && (
                <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-1"></div>
              )}
              
              {isStart && (
                <div className="text-xs font-bold mt-1">Début</div>
              )}
              
              {isEnd && (
                <div className="text-xs font-bold mt-1">Fin</div>
              )}
              
              {isBooked && (
                <div className="text-xs font-bold text-red-700 bg-red-200 px-2 py-1 rounded-full mt-1">
                   ❌ RÉSERVÉ
                 </div>
               )}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span>Réservé</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Sélectionné</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Début/Fin</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-blue-500 rounded"></div>
            <span>Aujourd'hui</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Instructions :</strong> Cliquez sur une date disponible pour sélectionner le début de votre réservation, 
          puis cliquez sur une autre date pour sélectionner la fin.
        </p>
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
};

export default BoatCalendar;
