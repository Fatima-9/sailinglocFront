import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import OwnerBookingManager from '../components/OwnerBookingManager';

export default function GestionReservations() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Vous devez être connecté pour accéder à la gestion de vos réservations');
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error) {
      setError('Erreur lors de la vérification de l\'authentification');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h2>
        <p className="text-lg text-gray-800 mb-6">{error}</p>
        <Link to="/connexion">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Se connecter
          </button>
        </Link>
      </div>
    );
  }

  // Vérifier si l'utilisateur est propriétaire
  const userRole = localStorage.getItem('userRole');
  if (userRole !== 'proprietaire') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
        <p className="text-lg text-gray-800 mb-6">Vous devez être propriétaire pour accéder à la gestion des réservations</p>
        <div className="flex space-x-3">
          <Link to="/bateaux">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Voir les bateaux
            </button>
          </Link>
          <Link to="/inscription">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Inscription
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des réservations</h1>
          <p className="text-gray-600 mt-2">
            Gérez les réservations de vos bateaux et confirmez ou refusez les demandes
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informations sur le processus */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            Comment ça fonctionne ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-2">Client réserve et paie</h3>
              <p className="text-sm text-blue-700">
                Le client sélectionne ses dates, paie et la réservation passe en statut "En attente"
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-2">Dates bloquées</h3>
              <p className="text-sm text-blue-700">
                Les dates sont automatiquement bloquées (rouge) pour éviter les conflits
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-2">Vous confirmez</h3>
              <p className="text-sm text-blue-700">
                Vous confirmez ou refusez la réservation selon votre disponibilité
              </p>
            </div>
          </div>
        </div>

        {/* Gestionnaire de réservations */}
        <OwnerBookingManager />
      </div>
    </div>
  );
}
