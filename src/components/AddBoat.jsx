import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { API_ENDPOINTS, apiCall, getAuthHeaders } from '../config/api';

export default function AddBoat({ isOpen, onClose, onBoatAdded }) {
  console.log('🔍 AddBoat render - isOpen:', isOpen);
  
  // Vérification de sécurité
  if (!isOpen) {
    console.log('🔍 AddBoat: Modal fermé, pas de rendu');
    return null;
  }

  const [formData, setFormData] = useState({
    nom: '',
    type: 'voilier',
    longueur: '',
    prix_jour: '',
    capacite: '',
    image: '',
    localisation: '',
    description: '',
    equipements: []
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageURL = '';
      
      if (selectedImage) {
        console.log('🔄 Upload de l\'image vers Firebase Storage...');
        const storageRef = ref(storage, `boats/${Date.now()}_${selectedImage.name}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        imageURL = await getDownloadURL(snapshot.ref);
        console.log('✅ Image uploadée:', imageURL);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour ajouter un bateau');
      }

      console.log('🔄 Ajout du bateau dans MongoDB...');
      
      const data = await apiCall(API_ENDPOINTS.BOATS, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          nom: formData.nom,
          type: formData.type,
          longueur: Number(formData.longueur),
          prix_jour: Number(formData.prix_jour),
          capacite: Number(formData.capacite),
          image: imageURL, // URL Firebase Storage au lieu de Base64
          destination: formData.localisation,
          description: formData.description,
          equipements: formData.equipements
        })
      });

      console.log('✅ Bateau ajouté avec succès:', data);

      setSuccess('Bateau ajouté avec succès !');
      
      // Réinitialiser le formulaire seulement après succès
      setFormData({
        nom: '',
        type: 'voilier',
        longueur: '',
        prix_jour: '',
        capacite: '',
        image: '',
        localisation: '',
        description: '',
        equipements: []
      });
      setSelectedImage(null);
      setImagePreview(null);

      if (onBoatAdded) {
        onBoatAdded(data.data || data); // Gérer les deux formats de réponse possibles
      }

      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du bateau:', error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        stack: error.stack,
        formData: formData
      });
      setError('Erreur lors de l\'ajout du bateau: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nom: '',
      type: 'voilier',
      longueur: '',
      prix_jour: '',
      capacite: '',
      image: '',
      localisation: '',
      description: '',
      equipements: []
    });
    setSelectedImage(null);
    setImagePreview(null);
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-blue-600" />
            Ajouter un bateau
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du bateau *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Le Grand Bleu"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="voilier">Voilier</option>
                <option value="bateau à moteur">Bateau à moteur</option>
                <option value="catamaran">Catamaran</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Longueur (m) *
              </label>
              <input
                type="number"
                name="longueur"
                value={formData.longueur}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12.5"
                min="2"
                max="100"
                step="0.1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Prix/jour (€) *
              </label>
              <input
                type="number"
                name="prix_jour"
                value={formData.prix_jour}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="150"
                min="1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Capacité *
              </label>
              <input
                type="number"
                name="capacite"
                value={formData.capacite}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="8"
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Image *
              </label>
              
              {/* Sélecteur de fichier */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <div className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Choisir une image
                    </div>
                  </label>
                  {selectedImage && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Upload className="h-4 w-4" />
                      {selectedImage.name}
                    </span>
                  )}
                </div>

                {/* Aperçu de l'image */}
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Aperçu de l'image :</p>
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu" 
                        className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                        title="Supprimer l'image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Destination *
              </label>
              <select
                name="localisation"
                value={formData.localisation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choisir une destination</option>
                <option value="saint-malo">Saint-Malo</option>
                <option value="les-glenan">Les Glénan</option>
                <option value="crozon">Crozon</option>
                <option value="la-rochelle">La Rochelle</option>
                <option value="marseille">Marseille</option>
                <option value="cannes">Cannes</option>
                <option value="ajaccio">Ajaccio</option>
                <option value="barcelone">Barcelone</option>
                <option value="palma">Palma de Majorque</option>
                <option value="athenes">Athènes</option>
                <option value="venise">Venise</option>
                <option value="amsterdam">Amsterdam</option>
                <option value="split">Split</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description détaillée du bateau..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Équipements disponibles</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  Ajouter le bateau
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
