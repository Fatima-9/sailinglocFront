import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function FirebaseTest() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [boats, setBoats] = useState([]);
  const [newBoat, setNewBoat] = useState({
    nom: '',
    type: 'voilier',
    prix: '',
    capacite: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Écouter les changements d'authentification
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchBoats();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchBoats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'boats'));
      const boatsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBoats(boatsData);
    } catch (error) {
      setMessage(`Erreur lors de la récupération: ${error.message}`);
    }
  };

  const handleAuth = async (isLogin) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('Connexion réussie !');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('Compte créé avec succès !');
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(`Erreur: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage('Déconnexion réussie !');
    } catch (error) {
      setMessage(`Erreur lors de la déconnexion: ${error.message}`);
    }
  };

  const handleAddBoat = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Vous devez être connecté pour ajouter un bateau');
      return;
    }

    try {
      const boatData = {
        ...newBoat,
        prix: parseFloat(newBoat.prix),
        capacite: parseInt(newBoat.capacite),
        userId: user.uid,
        createdAt: new Date(),
        imageName: selectedImage ? selectedImage.name : null,
        imagePreview: imagePreview || null
      };
      
      await addDoc(collection(db, 'boats'), boatData);
      setMessage('Bateau ajouté avec succès !');
      setNewBoat({ nom: '', type: 'voilier', prix: '', capacite: '' });
      setSelectedImage(null);
      setImagePreview(null);
      fetchBoats();
    } catch (error) {
      setMessage(`Erreur lors de l'ajout: ${error.message}`);
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

  const handleDeleteBoat = async (boatId) => {
    try {
      await deleteDoc(doc(db, 'boats', boatId));
      setMessage('Bateau supprimé avec succès !');
      fetchBoats();
    } catch (error) {
      setMessage(`Erreur lors de la suppression: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Test Firebase - Nouvelle Configuration</h2>
      
      {/* Section Authentification */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">
          🔐 Authentication
        </h3>
        
        {!user ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAuth(false)}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              >
                Créer un compte
              </button>
              <button
                onClick={() => handleAuth(true)}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Se connecter
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800">
                <strong>Connecté :</strong> {user.email}
              </p>
              <p className="text-sm text-blue-600">UID: {user.uid}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>

      {/* Section Firestore */}
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3 text-green-800">
          🗄️ Firestore Database
        </h3>
        
        {user ? (
          <>
            {/* Formulaire d'ajout */}
            <form onSubmit={handleAddBoat} className="space-y-4 mb-6">
              {/* Première ligne - Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Nom du bateau"
                  value={newBoat.nom}
                  onChange={(e) => setNewBoat({...newBoat, nom: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <select
                  value={newBoat.type}
                  onChange={(e) => setNewBoat({...newBoat, type: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="voilier">Voilier</option>
                  <option value="yacht">Yacht</option>
                  <option value="catamaran">Catamaran</option>
                </select>
                <input
                  type="number"
                  placeholder="Prix/jour"
                  value={newBoat.prix}
                  onChange={(e) => setNewBoat({...newBoat, prix: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Capacité"
                  value={newBoat.capacite}
                  onChange={(e) => setNewBoat({...newBoat, capacite: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Deuxième ligne - Upload d'image */}
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
                    <div className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                      📷 Ajouter une image
                    </div>
                  </label>
                  {selectedImage && (
                    <span className="text-sm text-green-600">
                      ✓ {selectedImage.name}
                    </span>
                  )}
                </div>

                {/* Aperçu de l'image */}
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Aperçu de l'image :</p>
                    <img 
                      src={imagePreview} 
                      alt="Aperçu" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              >
                Ajouter le bateau
              </button>
            </form>

            {/* Liste des bateaux */}
            <div>
              <h4 className="font-medium mb-2">Bateaux enregistrés ({boats.length})</h4>
              {boats.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucun bateau trouvé</p>
              ) : (
                <div className="space-y-2">
                  {boats.map((boat) => (
                    <div key={boat.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Image du bateau */}
                        {boat.imagePreview && (
                          <img 
                            src={boat.imagePreview} 
                            alt={boat.nom}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        )}
                        
                        {/* Informations du bateau */}
                        <div>
                          <div className="font-medium">{boat.nom}</div>
                          <div className="text-sm text-gray-600">
                            {boat.type} • {boat.prix}€/jour • {boat.capacite} personnes
                          </div>
                          {boat.imageName && (
                            <div className="text-xs text-blue-600">
                              📷 {boat.imageName}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteBoat(boat.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-green-700">Connectez-vous pour gérer les bateaux</p>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-md">
          <p className="text-sm text-blue-800">{message}</p>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500">
        <p>✅ Firebase configuré avec le projet : mypictures-9dc8b</p>
        <p>🔐 Authentication et Firestore activés</p>
      </div>
    </div>
  );
}
