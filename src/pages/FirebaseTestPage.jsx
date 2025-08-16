import React from 'react';
import FirebaseTest from '../components/FirebaseTest';
import FirebaseStorageTest from '../components/FirebaseStorageTest';

export default function FirebaseTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Test Firebase - Configuration Complète
          </h1>
          <p className="text-lg text-gray-600">
            Projet : mypictures-9dc8b - Firebase Storage + Backend
          </p>
        </div>
        
        {/* Test Firebase Storage */}
        <div className="mb-12">
          <FirebaseStorageTest />
        </div>
        
        {/* Test Firebase Auth + Firestore */}
        <div className="mb-12">
          <FirebaseTest />
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">📋 Instructions de test</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">1.</span>
              <p><strong>🔥 Firebase Storage :</strong> Testez d'abord l'upload d'images sur Firebase Storage</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">2.</span>
              <p><strong>🔗 Backend :</strong> Vérifiez que le backend accepte les URLs Firebase Storage</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">3.</span>
              <p><strong>👤 Authentication :</strong> Testez l'authentification Firebase</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">4.</span>
              <p><strong>📊 Firestore :</strong> Testez l'ajout de bateaux avec images Firebase Storage</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-semibold text-green-800 mb-2">✅ Configuration Complète :</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Project ID: mypictures-9dc8b</li>
              <li>• Authentication: Activé</li>
              <li>• Firestore Database: Activé</li>
              <li>• Firebase Storage: Activé</li>
              <li>• Backend: Modifié pour accepter URLs Firebase Storage</li>
              <li>• Frontend: Configuré pour upload sur Firebase Storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
