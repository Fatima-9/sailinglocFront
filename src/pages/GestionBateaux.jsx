import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Pencil, Plus, X, Image as ImageIcon, Ship, MapPin, Euro, Users, Ruler, AlertCircle, Loader2 } from 'lucide-react';
import AddBoat from '../components/AddBoat';
import EditBoat from '../components/EditBoat';
import { API_ENDPOINTS, apiCall, getAuthHeaders } from '../config/api';

export default function GestionBateaux() {
  const [boats, setBoats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Récupérer les bateaux depuis l'API
  useEffect(() => {
    fetchBoats();
  }, []);

  const fetchBoats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Vous devez être connecté pour accéder à la gestion de vos bateaux');
        return;
      }

      console.log('🔄 Récupération des bateaux depuis MongoDB...');
      
      const data = await apiCall(API_ENDPOINTS.MY_BOATS, {
        headers: getAuthHeaders(token)
      });
      
      console.log('📊 Structure de la réponse API:', data);
      
      // Gérer différentes structures de réponse
      const boats = data.data || data.boats || data || [];
      console.log(`✅ ${boats.length || 0} bateaux récupérés depuis MongoDB`);
      
      setBoats(boats);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce bateau ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('🔄 Suppression du bateau depuis MongoDB...');
      
      await apiCall(API_ENDPOINTS.BOAT_DETAIL(id), {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });
      
      console.log('✅ Bateau supprimé avec succès');

      // Mettre à jour la liste locale
      setBoats(boats.filter(b => b._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (boat) => {
    setSelectedBoat(boat);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleBoatAdded = (newBoat) => {
    setBoats([...boats, newBoat]);
  };

  const handleBoatUpdated = (updatedBoat) => {
    setBoats(boats.map(boat => 
      boat._id === updatedBoat._id ? updatedBoat : boat
    ));
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedBoat(null);
  };

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  // Afficher le message d'authentification si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h2>
        <p className="text-lg text-gray-800 mb-6">Vous devez être connecté pour accéder à la gestion de vos bateaux</p>
        <Link to="/connexion">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Se connecter
          </button>
        </Link>
      </div>
    );
  }

  // Vérifier si l'utilisateur est propriétaire
  if (userRole !== 'proprietaire') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
        <p className="text-lg text-gray-800 mb-6">Vous devez être propriétaire pour accéder à la gestion des bateaux</p>
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
    <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
            <Ship className="h-8 w-8" />
            Gestion de mes bateaux
          </h2>
          <button
            onClick={handleAdd}
            className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Ajouter un bateau
          </button>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Liste des bateaux */}
        {boats.length === 0 ? (
          <div className="text-center py-12">
            <Ship className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Aucun bateau trouvé</h3>
            <p className="text-gray-500">Commencez par ajouter votre premier bateau !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boats.map((boat) => (
              <div key={boat._id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                {/* Image du bateau */}
                <div className="h-48 bg-gray-200 rounded-t-xl flex items-center justify-center">
                  {boat.image ? (
                    <img 
                      src={boat.image} 
                      alt={boat.nom}
                      className="w-full h-full object-cover rounded-t-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="hidden items-center justify-center text-gray-400">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                </div>

                {/* Informations du bateau */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{boat.nom}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Ship className="h-4 w-4" />
                      <span className="capitalize">{boat.type}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Ruler className="h-4 w-4" />
                      <span>{boat.longueur}m</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{boat.capacite} personnes</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Euro className="h-4 w-4" />
                      <span>{boat.prix_jour}€/jour</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{boat.localisation}</span>
                    </div>
                  </div>

                  {boat.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {boat.description}
                    </p>
                  )}

                  {boat.equipements && boat.equipements.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Équipements :</p>
                      <div className="flex flex-wrap gap-1">
                        {boat.equipements.slice(0, 3).map((equipment, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {equipment}
                          </span>
                        ))}
                        {boat.equipements.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{boat.equipements.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Boutons d'action */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(boat)}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      Modifier
                    </button>
                    
                    <button
                      onClick={() => handleDelete(boat._id)}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'ajout de bateau */}
      <AddBoat 
        isOpen={showModal}
        onClose={handleModalClose}
        onBoatAdded={handleBoatAdded}
      />

      {/* Modal de modification de bateau */}
      <EditBoat 
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        onBoatUpdated={handleBoatUpdated}
        boatData={selectedBoat}
      />
    </div>
  );
} 