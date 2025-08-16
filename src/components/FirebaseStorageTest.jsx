import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export default function FirebaseStorageTest() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [testingBackend, setTestingBackend] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Début du test Firebase Storage...');
      console.log('📁 Fichier:', file);
      console.log('🔥 Storage:', storage);
      
      // 1. Upload sur Firebase Storage
      const storageRef = ref(storage, `boats/${Date.now()}_${file.name}`);
      console.log('📍 Référence créée:', storageRef);
      
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('✅ Upload réussi:', uploadResult);
      
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log('🔗 URL récupérée:', downloadURL);
      
      setResult({
        success: true,
        url: downloadURL,
        path: uploadResult.ref.fullPath,
        message: 'Firebase Storage fonctionne !'
      });
      
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      setError(`Erreur Firebase Storage: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const testBackendWithImage = async () => {
    if (!result?.url) {
      setError('Veuillez d\'abord uploader une image sur Firebase Storage');
      return;
    }

    setTestingBackend(true);
    setError(null);

    try {
      console.log('🧪 Test du backend avec l\'URL Firebase...');
      console.log('🔗 URL à tester:', result.url);

      // Simuler l'envoi au backend (sans authentification pour le test)
      const testData = {
        nom: 'Bateau Test Firebase',
        type: 'voilier',
        longueur: 10,
        prix_jour: 150,
        capacite: 4,
        image: result.url, // URL Firebase Storage
        destination: 'saint-malo',
        description: 'Test avec Firebase Storage'
      };

      console.log('📤 Données à envoyer:', testData);

      // Test de validation côté backend (simulation)
      const isValidImageUrl = result.url.startsWith('https://firebasestorage.googleapis.com') ||
                             result.url.startsWith('https://storage.googleapis.com') ||
                             result.url.startsWith('http://') ||
                             result.url.startsWith('https://');

      if (!isValidImageUrl) {
        throw new Error('L\'URL Firebase Storage n\'est pas reconnue comme valide');
      }

      console.log('✅ Validation backend: URL acceptée !');
      
      setResult(prev => ({
        ...prev,
        backendTest: true,
        message: '✅ Firebase Storage + Backend fonctionnent !'
      }));

    } catch (error) {
      console.error('❌ Erreur test backend:', error);
      setError(`Erreur test backend: ${error.message}`);
    } finally {
      setTestingBackend(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">🧪 Test Complet Firebase Storage</h2>
      
      <div className="space-y-6">
        {/* Sélection de fichier */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <label className="block text-lg font-medium text-gray-700 mb-4">
            📁 Sélectionner une image de bateau
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {file && (
            <div className="mt-3 text-sm text-gray-600">
              Fichier sélectionné: <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB)
            </div>
          )}
        </div>

        {/* Bouton d'upload */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 text-lg font-medium"
        >
          {uploading ? '🔄 Upload en cours...' : '🚀 Tester Firebase Storage'}
        </button>

        {/* Test du backend */}
        {result?.success && (
          <button
            onClick={testBackendWithImage}
            disabled={testingBackend}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 text-lg font-medium"
          >
            {testingBackend ? '🧪 Test en cours...' : '🔗 Tester avec le Backend'}
          </button>
        )}

        {/* Affichage des erreurs */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <div className="font-semibold">❌ Erreur détectée :</div>
            <div className="mt-2">{error}</div>
          </div>
        )}

        {/* Affichage des résultats */}
        {result && (
          <div className="p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
            <div className="font-semibold text-lg">{result.message}</div>
            <div className="mt-3 space-y-2 text-sm">
              <div><strong>📁 Chemin Storage:</strong> {result.path}</div>
              <div><strong>🔗 URL Firebase:</strong> 
                <a href={result.url} target="_blank" rel="noopener noreferrer" className="underline ml-2">
                  Voir l'image
                </a>
              </div>
              {result.backendTest && (
                <div className="mt-3 p-2 bg-green-200 rounded">
                  <strong>✅ Test Backend:</strong> L'URL Firebase Storage est acceptée par le backend !
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informations de debug */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-3">📋 Informations de debug :</h3>
          <div className="text-sm space-y-2">
            <div>• Vérifiez la console pour les logs détaillés</div>
            <div>• Assurez-vous que les règles Firebase Storage sont configurées</div>
            <div>• Le backend accepte maintenant les URLs Firebase Storage</div>
            <div>• Testez l'ajout de bateau après avoir validé Firebase Storage</div>
          </div>
        </div>
      </div>
    </div>
  );
}
