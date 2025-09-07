import React, { useState, useEffect } from 'react';
import { Pencil, X, Upload, MapPin, Ship, Users, Euro, Ruler, Settings, Plus, Calendar } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { API_ENDPOINTS, apiCall, getAuthHeaders } from '../config/api';
import BoatAvailability from './BoatAvailability';

export default function EditBoat({ isOpen, onClose, onBoatUpdated, boatData }) {
  const [formData, setFormData] = useState({
    nom: '',
    type: 'voilier',
    longueur: '',
    prix_jour: '',
    capacite: '',
    image: '',
    destination: '',
    description: '',
    equipements: []
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const [customEquipment, setCustomEquipment] = useState('');
  const [showAvailability, setShowAvailability] = useState(false);
  const [availabilityPeriods, setAvailabilityPeriods] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Vérifier l'état de connexion
  const isAuthenticated = !!localStorage.getItem('token');

  const equipmentOptions = [
    'Climatisation',
    'Wifi',
    'Cuisine équipée',
    'Salle de bain',
    'Pont solarium',
    'GPS',
    'Radio VHF',
    'Gilets de sauvetage',
    'Équipement de pêche',
    'Panneaux solaires'
  ];

  // Initialiser le formulaire avec les données du bateau quand le composant s'ouvre
  useEffect(() => {
    if (boatData && isOpen) {
      console.log('🔄 Initialisation du formulaire avec les données du bateau:', boatData);
      console.log('📍 Destination actuelle du bateau:', boatData.destination);
      console.log('📍 Type de la destination:', typeof boatData.destination);
      
      // Normaliser la destination pour s'assurer qu'elle correspond aux options
      const normalizeDestination = (dest) => {
        if (!dest) return '';
        
        // Mapping des destinations pour s'assurer de la correspondance
        const destinationMap = {
          'saint-malo': 'Saint-malo',
          'Saint-malo': 'Saint-malo',
          'les-glenan': 'Les Glénan',
          'Les Glénan': 'Les Glénan',
          'crozon': 'Crozon',
          'Crozon': 'Crozon',
          'la-rochelle': 'La Rochelle',
          'La Rochelle': 'La Rochelle',
          'rochelle': 'La Rochelle',
          'marseille': 'Marseille',
          'Marseille': 'Marseille',
          'cannes': 'Cannes',
          'Cannes': 'Cannes',
          'ajaccio': 'Ajaccio',
          'Ajaccio': 'Ajaccio',
          'barcelone': 'Barcelone',
          'Barcelone': 'Barcelone',
          'palma': 'Palma de Majorque',
          'Palma de Majorque': 'Palma de Majorque',
          'athenes': 'Athènes',
          'Athènes': 'Athènes',
          'venise': 'Venise',
          'Venise': 'Venise',
          'amsterdam': 'Amsterdam',
          'Amsterdam': 'Amsterdam',
          'split': 'Split',
          'Split': 'Split'
        };
        
        return destinationMap[dest] || dest;
      };
      
      const normalizedDestination = normalizeDestination(boatData.destination);
      console.log('🎯 Destination normalisée:', normalizedDestination);
      
      setFormData({
        nom: boatData.nom || '',
        type: boatData.type || 'voilier',
        longueur: boatData.longueur || '',
        prix_jour: boatData.prix_jour || '',
        capacite: boatData.capacite || '',
        image: boatData.image || '',
        destination: normalizedDestination,
        description: boatData.description || '',
        equipements: boatData.equipements || []
      });
      
      // Initialiser l'aperçu de l'image existante
      if (boatData.image) {
        setImagePreview(boatData.image);
      }
      setSelectedImage(null);
      setHasImageChanged(false);
      setCustomEquipment('');
      
      // Charger les disponibilités existantes directement depuis le bateau
      if (boatData.availability && boatData.availability.startDate) {
        console.log('📋 Disponibilité trouvée dans le bateau:', boatData.availability);
        // Convertir la disponibilité unique en tableau pour la compatibilité avec BoatAvailability
        setAvailabilityPeriods([{
          startDate: boatData.availability.startDate.split('T')[0],
          endDate: boatData.availability.endDate.split('T')[0],
          price: boatData.availability.price,
          notes: boatData.availability.notes || ''
        }]);
      } else {
        console.log('ℹ️ Aucune disponibilité trouvée dans le bateau');
        setAvailabilityPeriods([]);
      }
    }
  }, [boatData, isOpen]);

  const loadExistingAvailability = async (boatId) => {
    try {
      console.log('🔄 Chargement des disponibilités pour le bateau:', boatId);
      
      console.log('🔄 Chargement des disponibilités depuis MongoDB...');
      
      try {
        const data = await apiCall(`${API_ENDPOINTS.BOAT_DETAIL(boatId)}/availability`);
        console.log('✅ Disponibilités chargées depuis MongoDB:', data);
        setAvailabilityPeriods(data);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des disponibilités:', error.message);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des disponibilités:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          equipements: [...prev.equipements, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          equipements: prev.equipements.filter(eq => eq !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddCustomEquipment = () => {
    if (customEquipment.trim() && !formData.equipements.includes(customEquipment.trim())) {
      setFormData(prev => ({
        ...prev,
        equipements: [...prev.equipements, customEquipment.trim()]
      }));
      setCustomEquipment('');
    }
  };

  const handleRemoveEquipment = (equipmentToRemove) => {
    setFormData(prev => ({
      ...prev,
      equipements: prev.equipements.filter(eq => eq !== equipmentToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomEquipment();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setHasImageChanged(true);
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvailabilityChange = (periods) => {
    setAvailabilityPeriods(periods);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Vérifier l'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour modifier un bateau');
      }

      // Validation des données
      if (!formData.nom || !formData.type || !formData.longueur || !formData.prix_jour || !formData.capacite || !formData.destination) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Convertir la destination au format attendu par l'API
      const convertDestinationForAPI = (dest) => {
        const destinationMap = {
          'Saint-malo': 'saint-malo',
          'Les Glénan': 'les-glenan',
          'Crozon': 'crozon',
          'La Rochelle': 'la-rochelle',
          'Marseille': 'marseille',
          'Cannes': 'cannes',
          'Ajaccio': 'ajaccio',
          'Barcelone': 'barcelone',
          'Palma de Majorque': 'palma',
          'Athènes': 'athenes',
          'Venise': 'venise',
          'Amsterdam': 'amsterdam',
          'Split': 'split'
        };
        
        return destinationMap[dest] || dest;
      };

      const apiDestination = convertDestinationForAPI(formData.destination);
      console.log('🔄 Destination convertie pour l\'API:', apiDestination);

      // Préparer les données du bateau
      const boatDataToUpdate = {
        nom: formData.nom,
        type: formData.type,
        longueur: parseFloat(formData.longueur),
        prix_jour: parseFloat(formData.prix_jour),
        capacite: parseInt(formData.capacite),
        destination: apiDestination,
        description: formData.description,
        equipements: formData.equipements,
        // Inclure les disponibilités mises à jour
        availability: availabilityPeriods.length > 0 ? {
          startDate: availabilityPeriods[0].startDate,
          endDate: availabilityPeriods[0].endDate,
          price: parseFloat(availabilityPeriods[0].price),
          notes: availabilityPeriods[0].notes || ''
        } : null
      };

      console.log('🔍 Données à envoyer pour la mise à jour:', boatDataToUpdate);
      console.log('🎯 Destination sélectionnée:', formData.destination);
      console.log('📤 Destination envoyée à l\'API:', apiDestination);

      // Mettre à jour l'image si elle a changé
      if (hasImageChanged && selectedImage) {
        const imageRef = ref(storage, `boats/${Date.now()}_${selectedImage.name}`);
        const snapshot = await uploadBytes(imageRef, selectedImage);
        const imageUrl = await getDownloadURL(snapshot.ref);
        boatDataToUpdate.image = imageUrl;
      }

      // Mettre à jour le bateau
      console.log('🔄 Modification du bateau dans MongoDB...');
      
      const data = await apiCall(API_ENDPOINTS.BOAT_DETAIL(boatData._id), {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(boatDataToUpdate)
      });
      
      console.log('✅ Bateau modifié avec succès:', data);
      
      // Les disponibilités sont maintenant incluses directement dans la mise à jour du bateau
      console.log('📋 Disponibilités mises à jour:', data.availability);

      setSuccess('Bateau modifié avec succès !');
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        type: 'voilier',
        longueur: '',
        prix_jour: '',
        capacite: '',
        image: '',
        destination: '',
        description: '',
        equipements: []
      });
      setSelectedImage(null);
      setImagePreview(null);
      setHasImageChanged(false);
      setCustomEquipment('');
      setAvailabilityPeriods([]);
      setShowAvailability(false);

      // Notifier le composant parent
      if (onBoatUpdated) {
        onBoatUpdated(data);
      }

      // Fermer le modal après un délai
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Vérifier si l'utilisateur est connecté
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connexion requise</h3>
          <p className="text-gray-600 mb-4">
            Vous devez être connecté pour modifier un bateau.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  // Vérifier si les données du bateau sont disponibles
  if (!boatData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Données manquantes</h3>
          <p className="text-gray-600 mb-4">
            Les données du bateau ne sont pas disponibles.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Pencil className="h-6 w-6 text-blue-600 mr-2" />
              Modifier le bateau : {boatData.nom}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du bateau *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du bateau"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de bateau *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="voilier">Voilier</option>
                  <option value="yacht">Yacht</option>
                  <option value="catamaran">Catamaran</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longueur (mètres) *
                </label>
                <input
                  type="number"
                  name="longueur"
                  value={formData.longueur}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Longueur en mètres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacité (personnes) *
                </label>
                <input
                  type="number"
                  name="capacite"
                  value={formData.capacite}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre de personnes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix par jour (€) *
                </label>
                <input
                  type="number"
                  name="prix_jour"
                  value={formData.prix_jour}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Prix en euros"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une destination</option>
                  <option value="Saint-malo">Saint-Malo</option>
                  <option value="Les Glénan">Les Glénan</option>
                  <option value="Crozon">Crozon</option>
                  <option value="La Rochelle">La Rochelle</option>
                  <option value="Marseille">Marseille</option>
                  <option value="Cannes">Cannes</option>
                  <option value="Ajaccio">Ajaccio</option>
                  <option value="Barcelone">Barcelone</option>
                  <option value="Palma de Majorque">Palma de Majorque</option>
                  <option value="Athènes">Athènes</option>
                  <option value="Venise">Venise</option>
                  <option value="Amsterdam">Amsterdam</option>
                  <option value="Split">Split</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description détaillée du bateau..."
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image du bateau *
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload-edit"
                />
                <label
                  htmlFor="image-upload-edit"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{hasImageChanged ? 'Changer l\'image' : 'Modifier l\'image'}</span>
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    {hasImageChanged && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(boatData.image);
                          setHasImageChanged(false);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              {!hasImageChanged && boatData.image && (
                <p className="text-sm text-gray-500 mt-2">
                  Image actuelle conservée. Cliquez sur "Modifier l'image" pour la changer.
                </p>
              )}
            </div>

            {/* Équipements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Équipements disponibles
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {equipmentOptions.map((equipment) => (
                  <label key={equipment} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={equipment}
                      checked={formData.equipements.includes(equipment)}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{equipment}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ajouter un équipement personnalisé"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomEquipment}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
              
              {formData.equipements.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.equipements.map((equipment) => (
                    <span
                      key={equipment}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {equipment}
                      <button
                        type="button"
                        onClick={() => handleRemoveEquipment(equipment)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Section Gestion des disponibilités */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowAvailability(!showAvailability)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Calendar className="h-5 w-5" />
                <span>Gestion des disponibilités</span>
              </button>
              
              {showAvailability && (
                <div className="mt-4">
                  <BoatAvailability
                    boatId={boatData._id}
                    existingPeriods={availabilityPeriods}
                    onAvailabilityChange={handleAvailabilityChange}
                    isEditing={true}
                  />
                </div>
              )}
            </div>

            {/* Messages d'erreur et de succès */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Mise à jour en cours...</span>
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                    <span>Mettre à jour le bateau</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
