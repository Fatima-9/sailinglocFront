import React, { useState } from 'react';

const TestAvailability = () => {
  const [boatId, setBoatId] = useState('');
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testGetAvailability = async () => {
    if (!boatId) {
      setError('Veuillez entrer un ID de bateau');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🧪 Test de récupération des disponibilités pour le bateau:', boatId);
      
      const response = await fetch(`http://localhost:3001/api/boats/${boatId}/availability`);
      
      console.log('📡 Réponse du serveur:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Disponibilités récupérées:', data);
        setAvailabilities(data);
      } else {
        console.error('❌ Erreur:', response.status, response.statusText);
        
        try {
          const errorData = await response.json();
          console.error('Détails de l\'erreur:', errorData);
          setError(`Erreur ${response.status}: ${errorData.message || 'Erreur inconnue'}`);
        } catch (e) {
          setError(`Erreur ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      setError(`Erreur de connexion: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetBoat = async () => {
    if (!boatId) {
      setError('Veuillez entrer un ID de bateau');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🧪 Test de récupération du bateau:', boatId);
      
      const response = await fetch(`http://localhost:3001/api/boats/${boatId}`);
      
      console.log('📡 Réponse du serveur:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Bateau récupéré:', data);
      } else {
        console.error('❌ Erreur:', response.status, response.statusText);
        
        try {
          const errorData = await response.json();
          console.error('Détails de l\'erreur:', errorData);
          setError(`Erreur ${response.status}: ${errorData.message || 'Erreur inconnue'}`);
        } catch (e) {
          setError(`Erreur ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      setError(`Erreur de connexion: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🧪 Test des Disponibilités</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ID du bateau à tester
        </label>
        <input
          type="text"
          value={boatId}
          onChange={(e) => setBoatId(e.target.value)}
          placeholder="Entrez l'ID du bateau"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={testGetBoat}
          disabled={loading || !boatId}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Chargement...' : 'Tester GET /boats/:id'}
        </button>
        
        <button
          onClick={testGetAvailability}
          disabled={loading || !boatId}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Chargement...' : 'Tester GET /boats/:id/availability'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {availabilities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Disponibilités trouvées ({availabilities.length})</h3>
          
          <div className="space-y-3">
            {availabilities.map((availability, index) => (
              <div key={availability._id || index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Période:</span>
                    <p className="text-gray-900">
                      {new Date(availability.startDate).toLocaleDateString()} - {new Date(availability.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Prix:</span>
                    <p className="text-gray-900 font-semibold">{availability.price} €</p>
                  </div>
                  
                  {availability.notes && (
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Notes:</span>
                      <p className="text-gray-900">{availability.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p><strong>Instructions :</strong></p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Entrez l'ID d'un bateau existant</li>
          <li>Testez d'abord la récupération du bateau</li>
          <li>Puis testez la récupération des disponibilités</li>
          <li>Vérifiez la console pour les logs détaillés</li>
        </ol>
      </div>
    </div>
  );
};

export default TestAvailability;
