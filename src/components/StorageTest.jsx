import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export default function StorageTest() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      console.log('Début de l\'upload...');
      console.log('Fichier:', file);
      console.log('Storage:', storage);
      
      // Créer une référence dans le dossier boats
      const storageRef = ref(storage, `boats/${Date.now()}_${file.name}`);
      console.log('Référence créée:', storageRef);
      
      // Upload du fichier
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('Upload réussi:', uploadResult);
      
      // Récupérer l'URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log('URL récupérée:', downloadURL);
      
      setResult({
        success: true,
        url: downloadURL,
        path: uploadResult.ref.fullPath
      });
      
    } catch (error) {
      console.error('Erreur upload:', error);
      setError(`Erreur: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🧪 Test Firebase Storage</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner une image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {file && (
          <div className="text-sm text-gray-600">
            Fichier sélectionné: {file.name} ({Math.round(file.size / 1024)} KB)
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {uploading ? 'Upload en cours...' : 'Tester l\'upload'}
        </button>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
            <div className="font-semibold">✅ Upload réussi !</div>
            <div className="text-sm mt-2">
              <div><strong>Chemin:</strong> {result.path}</div>
              <div><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" className="underline">{result.url}</a></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">📋 Informations de debug :</h3>
        <div className="text-sm space-y-1">
          <div>• Vérifiez la console pour les logs détaillés</div>
          <div>• Assurez-vous que les règles Storage sont configurées</div>
          <div>• Vérifiez que le dossier 'boats' existe</div>
        </div>
      </div>
    </div>
  );
}
