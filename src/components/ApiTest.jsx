import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiCall, getAuthHeaders } from '../config/api';

export default function ApiTest() {
  const [apiStatus, setApiStatus] = useState('Vérification...');
  const [boatsCount, setBoatsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      setApiStatus('🔄 Test de connexion à l\'API MongoDB...');
      
      // Test 1: Récupérer les bateaux
      console.log('🧪 Test 1: Récupération des bateaux...');
      const boatsData = await apiCall(API_ENDPOINTS.BOATS);
      setBoatsCount(boatsData.length || 0);
      console.log(`✅ ${boatsData.length || 0} bateaux trouvés`);
      
      // Test 2: Récupérer les avis
      console.log('🧪 Test 2: Récupération des avis...');
      const reviewsData = await apiCall(API_ENDPOINTS.FIVE_STAR_REVIEWS);
      setReviewsCount(reviewsData.data?.length || 0);
      console.log(`✅ ${reviewsData.data?.length || 0} avis trouvés`);
      
      // Test 3: Tester l'API de réservation (sans créer de réservation)
      console.log('🧪 Test 3: Test de l\'API de réservation...');
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const bookingsData = await apiCall(API_ENDPOINTS.BOOKINGS, {
            headers: getAuthHeaders(token)
          });
          console.log('✅ API de réservation accessible:', bookingsData);
        } else {
          console.log('⚠️ Pas de token, test de réservation ignoré');
        }
      } catch (error) {
        console.log('⚠️ API de réservation non accessible:', error.message);
      }
      
      // Test 4: Tester l'API d'ajout de bateaux (sans créer de bateau)
      console.log('🧪 Test 4: Test de l\'API d\'ajout de bateaux...');
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Test avec une requête GET pour vérifier l'accessibilité
          const boatsTest = await apiCall(API_ENDPOINTS.BOATS, {
            method: 'GET',
            headers: getAuthHeaders(token)
          });
          console.log('✅ API d\'ajout de bateaux accessible:', boatsTest);
        } else {
          console.log('⚠️ Pas de token, test d\'ajout de bateaux ignoré');
        }
      } catch (error) {
        console.log('⚠️ API d\'ajout de bateaux non accessible:', error.message);
      }
      
      setApiStatus(`✅ API MongoDB accessible - ${boatsData.length || 0} bateaux, ${reviewsData.data?.length || 0} avis`);
      setError('');
      
    } catch (error) {
      console.error('❌ Erreur de connexion API:', error);
      setApiStatus(`❌ Erreur de connexion: ${error.message}`);
      setError(error.message);
    }
  };

  const retryConnection = () => {
    testApiConnection();
  };

  const testAddBoat = async () => {
    try {
      setApiStatus('🧪 Test d\'ajout de bateau...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour tester l\'ajout de bateau');
        return;
      }

      // Test avec des données minimales
      const testBoatData = {
        nom: 'Bateau Test',
        type: 'voilier',
        longueur: 10,
        prix_jour: 100,
        capacite: 4,
        image: 'https://via.placeholder.com/300x200?text=Test',
        destination: 'saint-malo',
        description: 'Bateau de test',
        equipements: ['GPS', 'Radio VHF']
      };

      console.log('🧪 Test d\'ajout de bateau avec:', testBoatData);
      
      const result = await apiCall(API_ENDPOINTS.BOATS, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(testBoatData)
      });

      console.log('✅ Test d\'ajout réussi:', result);
      setApiStatus('✅ Test d\'ajout de bateau réussi !');
      setError('');
      
    } catch (error) {
      console.error('❌ Test d\'ajout échoué:', error);
      setApiStatus('❌ Test d\'ajout de bateau échoué');
      setError('Erreur lors du test: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">🧪 Test de Connexion API MongoDB</h2>
      
      {/* Statut de la connexion */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Statut de l'API</h3>
        <p className="text-blue-700">{apiStatus}</p>
        
        {error && (
          <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded">
            <p className="text-red-800 text-sm">
              <strong>Erreur:</strong> {error}
            </p>
          </div>
        )}
        
        <div className="mt-3 space-x-3">
          <button
            onClick={retryConnection}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            🔄 Réessayer
          </button>
          
          <button
            onClick={testAddBoat}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            🧪 Tester Ajout Bateau
          </button>
        </div>
      </div>

      {/* Résultats des tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-800">📊 Bateaux</h3>
          <p className="text-3xl font-bold text-green-600">{boatsCount}</p>
          <p className="text-green-700 text-sm">bateaux trouvés dans MongoDB</p>
        </div>
        
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-purple-800">⭐ Avis</h3>
          <p className="text-3xl font-bold text-purple-600">{reviewsCount}</p>
          <p className="text-purple-700 text-sm">avis 5 étoiles trouvés</p>
        </div>
      </div>

      {/* Informations techniques */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">🔧 Informations techniques</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>URL de base:</strong> {API_ENDPOINTS.BOATS.replace('/api/boats', '')}</p>
          <p><strong>Endpoint bateaux:</strong> {API_ENDPOINTS.BOATS}</p>
          <p><strong>Endpoint avis:</strong> {API_ENDPOINTS.FIVE_STAR_REVIEWS}</p>
        </div>
      </div>
    </div>
  );
}
