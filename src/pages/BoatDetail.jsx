import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Calendar, Star, Check, Ship, Ruler, Euro, Loader2, MessageSquare } from 'lucide-react';
import StarRating from '../components/StarRating';
import AddReview from '../components/AddReview';
import ReviewCard from '../components/ReviewCard';
import HeartButton from '../components/HeartButton';
import { API_ENDPOINTS, apiCall } from '../config/api';

export default function BoatDetail() {
  const { id } = useParams();
  const [boat, setBoat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Récupérer les détails du bateau depuis l'API
  useEffect(() => {
    fetchBoatDetails();
    fetchReviews();
  }, [id]);

  const fetchBoatDetails = async () => {
    try {
      setLoading(true);
      console.log('🔄 Récupération des détails du bateau depuis MongoDB...');
      
      const data = await apiCall(API_ENDPOINTS.BOAT_DETAIL(id));
      console.log('✅ Détails du bateau récupérés:', data);
      
      setBoat(data);
    } catch (error) {
      setError('Bateau non trouvé: ' + error.message);
      console.error('❌ Erreur lors de la récupération des détails:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      console.log('🔄 Récupération des avis du bateau depuis MongoDB...');
      
      const data = await apiCall(API_ENDPOINTS.BOAT_REVIEWS(id));
      console.log('✅ Avis du bateau récupérés:', data);
      
      setReviews(data.data || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.total || 0);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des avis:', error);
    }
  };

  const handleAddReview = () => {
    setShowReviewModal(true);
  };

  const handleReviewAdded = (review) => {
    // Rafraîchir la liste des avis
    fetchReviews();
    setShowReviewModal(false);
  };

  const handleReviewModalClose = () => {
    setShowReviewModal(false);
  };

  const handleHelpfulClick = async (reviewId) => {
    try {
      console.log('🔄 Mise à jour du vote utile...');
      
      await apiCall(`${API_ENDPOINTS.REVIEWS}/${reviewId}/helpful`, {
        method: 'PUT'
      });
      
      console.log('✅ Vote utile mis à jour');
      // Rafraîchir la liste des avis pour mettre à jour le compteur
      fetchReviews();
    } catch (error) {
      console.error('Erreur lors du marquage utile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du bateau...</p>
        </div>
      </div>
    );
  }

  if (error || !boat) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Ship className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Bateau non trouvé'}
          </h2>
          <Link to="/bateaux" className="text-blue-600 hover:text-blue-700">
            Retourner à la liste des bateaux
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
          <Link
            to="/bateaux"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Retour aux bateaux</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{boat.nom}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <StarRating rating={boat.rating || 0} />
              <span className="text-sm text-gray-600">({boat.reviews || 0} avis)</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin size={16} />
              <span className="capitalize">{boat.destination}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            <div className="relative">
              <img
                src={boat.image}
                alt={boat.nom}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md font-medium">
                {boat.type}
              </div>
              <HeartButton boatId={boat._id} />
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              {boat.description ? (
                <p className="text-gray-600 mb-6">{boat.description}</p>
              ) : (
                <p className="text-gray-500 italic mb-6">Aucune description disponible pour ce bateau.</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Caractéristiques</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-blue-600" />
                      <span>Capacité : {boat.capacite} personnes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Ruler size={16} className="text-blue-600" />
                      <span>Longueur : {boat.longueur}m</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-blue-600" />
                      <span>Localisation : {boat.localisation}</span>
                    </div>
                  </div>
                </div>

                {boat.equipements && boat.equipements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Équipements</h3>
                    <div className="space-y-2 text-sm">
                      {boat.equipements.map((equipment, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check size={16} className="text-green-600" />
                          <span>{equipment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Réservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {boat.prix_jour}€
                </div>
                <div className="text-gray-600">par jour</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Capacité</span>
                  <span className="font-medium">{boat.capacite} personnes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium capitalize">{boat.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Longueur</span>
                  <span className="font-medium">{boat.longueur}m</span>
                </div>
              </div>

              <Link
                to={`/reservation/${id}`}
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                Réserver ce bateau
              </Link>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  Réservation sécurisée • Annulation gratuite
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section des avis */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  Avis des clients
                </h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <StarRating rating={averageRating} size={20} />
                    <span className="text-sm text-gray-600">({totalReviews} avis)</span>
                  </div>
                  {averageRating > 0 && (
                    <span className="text-sm text-gray-500">
                      Note moyenne : {averageRating.toFixed(1)}/5
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleAddReview}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Laisser un avis
              </button>
            </div>

            {/* Liste des avis existants */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>Aucun avis pour le moment</p>
                  <p className="text-sm">Soyez le premier à laisser un avis !</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    onHelpfulClick={handleHelpfulClick}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'avis */}
      <AddReview
        isOpen={showReviewModal}
        onClose={handleReviewModalClose}
        onReviewAdded={handleReviewAdded}
        boatData={boat}
      />
    </div>
  );
}