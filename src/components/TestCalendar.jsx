import React, { useState } from 'react';
import BoatCalendar from './BoatCalendar';
import AlertPopup from './AlertPopup';

const TestCalendar = () => {
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [alertPopup, setAlertPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
    details: null
  });

  // Données de test pour un bateau avec disponibilité
  const testBoatAvailability = {
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    price: 150,
    notes: 'Disponible pendant les vacances de Noël'
  };

  // Réservations existantes de test
  const testExistingBookings = [
    {
      startDate: '2024-12-05',
      endDate: '2024-12-10',
      userId: 'user1',
      status: 'confirmed'
    },
    {
      startDate: '2024-12-20',
      endDate: '2024-12-25',
      userId: 'user2',
      status: 'confirmed'
    },
    {
      startDate: '2024-12-15',
      endDate: '2024-12-17',
      userId: 'user3',
      status: 'cancelled' // Cette réservation annulée ne bloque pas
    }
  ];

  const handleDateSelect = (startDate, endDate) => {
    console.log('📅 Dates sélectionnées:', { startDate, endDate });
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  };

  const handleDateChange = (field, value) => {
    if (field === 'startDate') {
      setSelectedStartDate(value);
    } else if (field === 'endDate') {
      setSelectedEndDate(value);
    }
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 Test du Calendrier</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendrier */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendrier de disponibilité</h2>
          <BoatCalendar
            boatAvailability={testBoatAvailability}
            existingBookings={testExistingBookings}
            onDateSelect={handleDateSelect}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
          />
        </div>

        {/* Informations de sélection */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sélection des dates</h2>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={selectedStartDate}
                  onChange={(e) => setSelectedStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={selectedEndDate}
                  onChange={(e) => setSelectedEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Calcul du prix */}
              {selectedStartDate && selectedEndDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Calcul du prix</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div>
                      Date de début : {new Date(selectedStartDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      Date de fin : {new Date(selectedEndDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      Durée : {calculateDuration(selectedStartDate, selectedEndDate)} jours
                    </div>
                    <div className="font-semibold">
                      Prix total : {calculateDuration(selectedStartDate, selectedEndDate) * testBoatAvailability.price}€
                    </div>
                  </div>
                </div>
              )}

              {/* Informations de test */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Données de test</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>Bateau disponible du {new Date(testBoatAvailability.startDate).toLocaleDateString('fr-FR')}</div>
                  <div>Au {new Date(testBoatAvailability.endDate).toLocaleDateString('fr-FR')}</div>
                  <div>Prix : {testBoatAvailability.price}€ par jour</div>
                  <div>Notes : {testBoatAvailability.notes}</div>
                </div>
              </div>

              {/* Réservations existantes */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-2">Réservations existantes</h3>
                <div className="text-sm text-red-700 space-y-1">
                  {testExistingBookings.map((booking, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {new Date(booking.startDate).toLocaleDateString('fr-FR')} - {new Date(booking.endDate).toLocaleDateString('fr-FR')}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'confirmed' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmée' : 'Annulée'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton de test pour le popup */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Test du popup d'alerte</h3>
                <button
                  onClick={() => setAlertPopup({
                    isOpen: true,
                    title: 'Dates indisponibles',
                    message: 'Ces dates sont déjà réservées par un autre client.',
                    type: 'error',
                    details: { 
                      conflictingBookings: testExistingBookings.filter(b => b.status === 'confirmed')
                    }
                  })}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  🧪 Tester le popup "Dates indisponibles"
                </button>
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
};

export default TestCalendar;
