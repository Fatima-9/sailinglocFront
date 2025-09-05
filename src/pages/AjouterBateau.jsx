import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/Footer';
import AddBoat from '../components/AddBoat';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function AjouterBateau() {
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
        setError('Vous devez être connecté pour ajouter un bateau');
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error) {
      setError('Erreur lors de la vérification de l\'authentification');
      setLoading(false);
    }
  };

  const handleBoatAdded = (newBoat) => {
    // Rediriger vers la page de gestion des bateaux après ajout réussi
    console.log('Nouveau bateau ajouté:', newBoat);
    navigate('/gestion-bateaux');
  };

  const handleClose = () => {
    // Rediriger vers la page de gestion des bateaux quand l'utilisateur annule
    navigate('/gestion-bateaux');
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Ajouter un nouveau bateau</h2>
          <p className="text-gray-600 text-center mb-8">
            Remplissez le formulaire ci-dessous pour ajouter votre bateau à notre plateforme de location.
          </p>
          
          <AddBoat 
            isOpen={true}
            onClose={handleClose}
            onBoatAdded={handleBoatAdded}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
