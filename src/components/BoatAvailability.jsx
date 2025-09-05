import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Check, AlertTriangle, Pencil } from 'lucide-react';

const BoatAvailability = ({ boatId, existingPeriods = [], onAvailabilityChange, isEditing = false }) => {
  const [availabilityPeriods, setAvailabilityPeriods] = useState(existingPeriods);
  const [newPeriod, setNewPeriod] = useState({
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState(null);
  const [editingPeriod, setEditingPeriod] = useState({});
  const [error, setError] = useState('');

  // Mettre à jour les périodes quand les props changent
  useEffect(() => {
    setAvailabilityPeriods(existingPeriods);
  }, [existingPeriods]);

  // Charger les disponibilités existantes seulement si pas de props
  useEffect(() => {
    if (boatId && existingPeriods.length === 0) {
      loadAvailability();
    }
  }, [boatId, existingPeriods.length]);

  const loadAvailability = async () => {
    try {
      console.log('🔄 Chargement des disponibilités pour le bateau:', boatId);
      
      const response = await fetch(`http://localhost:3001/api/boats/${boatId}/availability`);
      
      console.log('📡 Réponse du serveur:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Disponibilités chargées:', data);
        setAvailabilityPeriods(data);
      } else {
        console.error('❌ Erreur lors du chargement des disponibilités:', response.status, response.statusText);
        
        if (response.status === 404) {
          console.error('Bateau non trouvé');
        } else if (response.status === 500) {
          console.error('Erreur serveur');
        }
        
        // Essayer de récupérer le message d'erreur
        try {
          const errorData = await response.json();
          console.error('Détails de l\'erreur:', errorData);
        } catch (e) {
          console.error('Impossible de lire le message d\'erreur');
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des disponibilités:', error);
    }
  };

  const handleAddPeriod = () => {
    console.log('🔄 Ajout d\'une nouvelle période:', newPeriod);
    
    if (!newPeriod.startDate || !newPeriod.endDate) {
      setError('Veuillez remplir toutes les dates');
      return;
    }

    if (new Date(newPeriod.startDate) > new Date(newPeriod.endDate)) {
      setError('La date de fin doit être égale ou postérieure à la date de début');
      return;
    }

    console.log('✅ Validation des données réussie');

    // Vérifier s'il y a déjà une disponibilité (une seule autorisée)
    if (availabilityPeriods.length > 0) {
      setError('Une disponibilité existe déjà. Vous pouvez la modifier ou la supprimer.');
      return;
    }

    // Ajouter la nouvelle période (sans prix)
    const periodToAdd = {
      ...newPeriod,
      id: Date.now(), // ID temporaire
      boatId: boatId
    };

    console.log('📅 Période à ajouter:', periodToAdd);
    console.log('📋 Périodes existantes avant ajout:', availabilityPeriods);

    setAvailabilityPeriods([periodToAdd]);
    
    // Garder le formulaire ouvert et la prévisualisation visible
    // Ne pas réinitialiser le formulaire pour permettre de voir la prévisualisation
    setError('');

    // Notifier le composant parent
    if (onAvailabilityChange) {
      console.log('📤 Notification au composant parent avec la nouvelle disponibilité');
      onAvailabilityChange([periodToAdd]);
    }
  };

  const handleDeletePeriod = async (periodId) => {
    try {
      if (boatId) {
        const response = await fetch(`http://localhost:3001/api/boats/${boatId}/availability/${periodId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const updatedPeriods = availabilityPeriods.filter(period => period.id !== periodId && period._id !== periodId);
          setAvailabilityPeriods(updatedPeriods);
          
          // Notifier le composant parent
          if (onAvailabilityChange) {
            onAvailabilityChange(updatedPeriods);
          }
        }
      } else {
        // Si pas de boatId (bateau pas encore créé), supprimer localement
        const updatedPeriods = availabilityPeriods.filter(period => period.id !== periodId && period._id !== periodId);
        setAvailabilityPeriods(updatedPeriods);
        
        if (onAvailabilityChange) {
          onAvailabilityChange(updatedPeriods);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de la période');
    }
  };

  const handleClearAvailability = () => {
    // Permettre de supprimer la disponibilité existante
    setAvailabilityPeriods([]);
    setError('');
    
    // Notifier le composant parent
    if (onAvailabilityChange) {
      onAvailabilityChange([]);
    }
  };

  const handleEditPeriod = (period) => {
    setEditingPeriodId(period.id || period._id);
    setEditingPeriod({
      startDate: period.startDate.split('T')[0],
      endDate: period.endDate.split('T')[0],
      notes: period.notes || ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingPeriod.startDate || !editingPeriod.endDate) {
      setError('Veuillez remplir toutes les dates');
      return;
    }

    if (new Date(editingPeriod.startDate) > new Date(editingPeriod.endDate)) {
      setError('La date de fin doit être égale ou postérieure à la date de début');
      return;
    }

    // Vérifier les conflits avec les autres périodes
    const hasConflict = availabilityPeriods.some(period => {
      if (period.id === editingPeriodId || period._id === editingPeriodId) return false;
      
      const newStart = new Date(editingPeriod.startDate);
      const newEnd = new Date(editingPeriod.endDate);
      const existingStart = new Date(period.startDate);
      const existingEnd = new Date(period.endDate);

      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (hasConflict) {
      setError('Cette période chevauche une période existante');
      return;
    }

    // Mettre à jour la période (sans modifier le prix)
    const updatedPeriods = availabilityPeriods.map(period => {
      if (period.id === editingPeriodId || period._id === editingPeriodId) {
        return {
          ...period,
          startDate: editingPeriod.startDate,
          endDate: editingPeriod.endDate,
          notes: editingPeriod.notes
        };
      }
      return period;
    });

    setAvailabilityPeriods(updatedPeriods);
    setEditingPeriodId(null);
    setEditingPeriod({});
    setError('');

    // Notifier le composant parent
    if (onAvailabilityChange) {
      onAvailabilityChange(updatedPeriods);
    }
  };

  const handleCancelEdit = () => {
    setEditingPeriodId(null);
    setEditingPeriod({});
    setError('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Réinitialiser l'heure pour la comparaison des dates
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Une réservation d'un jour (même date) compte pour 1 jour
    // Une réservation de plusieurs jours compte le nombre exact de jours
    return Math.max(1, Math.ceil(diffDays));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
          Gestion de la disponibilité
        </h3>
        
        {!isAddingPeriod && availabilityPeriods.length === 0 && (
          <button
            onClick={() => setIsAddingPeriod(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter une disponibilité</span>
          </button>
        )}
      </div>

      {/* Formulaire d'ajout de période */}
      {isAddingPeriod && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Nouvelle période de disponibilité</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début *
              </label>
              <input
                type="date"
                value={newPeriod.startDate}
                onChange={(e) => setNewPeriod({...newPeriod, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin *
              </label>
              <input
                type="date"
                value={newPeriod.endDate}
                onChange={(e) => setNewPeriod({...newPeriod, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={newPeriod.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <input
                type="text"
                value={newPeriod.notes}
                onChange={(e) => setNewPeriod({...newPeriod, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Conditions spéciales..."
              />
            </div>
          </div>

          {/* Prévisualisation de la disponibilité en cours de saisie */}
          {(newPeriod.startDate || newPeriod.endDate) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                {availabilityPeriods.length > 0 ? (
                  <>
                    <span className="text-green-600 mr-2">✅</span>
                    Disponibilité confirmée et visible ci-dessous
                  </>
                ) : (
                  <>
                    <span className="text-blue-600 mr-2">👁️</span>
                    Prévisualisation de la disponibilité
                  </>
                )}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Période :</span>
                  <p className="text-blue-900">
                    {newPeriod.startDate ? formatDate(newPeriod.startDate) : 'Non définie'} - {newPeriod.endDate ? formatDate(newPeriod.endDate) : 'Non définie'}
                  </p>
                  {newPeriod.startDate && newPeriod.endDate && (
                    <span className="text-xs text-blue-600">
                      {calculateDuration(newPeriod.startDate, newPeriod.endDate)} jours
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Notes :</span>
                  <p className="text-blue-900">
                    {newPeriod.notes || 'Aucune note'}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Statut :</span>
                  <p className="text-blue-900">
                    {availabilityPeriods.length > 0 ? '✅ Confirmée et visible' : '⏳ En cours de saisie'}
                  </p>
                </div>
              </div>
              {availabilityPeriods.length > 0 && (
                <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded text-green-800 text-xs">
                  💡 La disponibilité a été confirmée ! Elle apparaît maintenant dans la section "Disponibilité actuelle" ci-dessous.
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleAddPeriod}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Confirmer</span>
            </button>
            
            <button
              onClick={() => {
                setIsAddingPeriod(false);
                setError('');
                setNewPeriod({
                  startDate: '',
                  endDate: '',
                  notes: ''
                });
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Annuler</span>
            </button>

            {/* Bouton pour fermer le formulaire après confirmation */}
            {availabilityPeriods.length > 0 && (
              <button
                onClick={() => {
                  setIsAddingPeriod(false);
                  setError('');
                  setNewPeriod({
                    startDate: '',
                    endDate: '',
                    notes: ''
                  });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Fermer le formulaire</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Affichage de la disponibilité existante */}
      {availabilityPeriods.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-green-600 mr-2" />
            Disponibilité actuelle
          </h4>
          
          <div className="space-y-3">
            {availabilityPeriods.map((period, index) => (
              <div key={period.id || period._id || index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                {editingPeriodId === (period.id || period._id) ? (
                  // Mode édition
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                      <input
                        type="date"
                        value={editingPeriod.startDate}
                        onChange={(e) => setEditingPeriod({...editingPeriod, startDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                      <input
                        type="date"
                        value={editingPeriod.endDate}
                        onChange={(e) => setEditingPeriod({...editingPeriod, endDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <input
                        type="text"
                        value={editingPeriod.notes}
                        onChange={(e) => setEditingPeriod({...editingPeriod, notes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  // Mode affichage
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                    <div>
                      <span className="text-sm font-medium text-green-700">Période</span>
                      <p className="text-green-900 font-semibold">
                        {formatDate(period.startDate)} - {formatDate(period.endDate)}
                      </p>
                      <span className="text-xs text-green-600">
                        {calculateDuration(period.startDate, period.endDate)} jours
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-green-700">Notes</span>
                      <p className="text-green-900">
                        {period.notes || 'Aucune note'}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPeriod(period)}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={handleClearAvailability}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                        title="Supprimer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Boutons d'édition */}
                {editingPeriodId === (period.id || period._id) && (
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>Sauvegarder</span>
                    </button>
                    
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Annuler</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucune disponibilité */}
      {availabilityPeriods.length === 0 && !isAddingPeriod && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium mb-2">Aucune disponibilité définie</p>
          <p className="text-sm">Cliquez sur "Ajouter une disponibilité" pour commencer</p>
        </div>
      )}

      {/* Informations sur la gestion des disponibilités */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Gestion automatique des réservations</p>
            <p>Les clients ne pourront réserver que pendant les périodes de disponibilité définies. 
            Les dates déjà réservées seront automatiquement exclues des périodes disponibles.</p>
            <p className="mt-2 text-xs italic">
              💡 <strong>Conseil :</strong> Définissez vos disponibilités avant d'ajouter le bateau pour une meilleure visibilité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoatAvailability;
