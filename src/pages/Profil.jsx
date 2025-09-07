import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Trash2, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { API_ENDPOINTS, apiCall, getAuthHeaders } from '../config/api';

export default function Profil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Préremplir depuis le localStorage si dispo (sinon vide)
  const [formData, setFormData] = useState(() => {
    const siret = localStorage.getItem('userSiret') || '';
    const siren = localStorage.getItem('userSiren') || '';
    
    console.log('🔍 Chargement initial du profil:');
    console.log('📋 SIRET depuis localStorage:', siret);
    console.log('📋 SIREN depuis localStorage:', siren);
    console.log('📋 Toutes les clés localStorage:', Object.keys(localStorage));
    
    return {
      nom: localStorage.getItem('userNom') || '',
      prenom: localStorage.getItem('userPrenom') || '',
      email: localStorage.getItem('userEmail') || '',
      telephone: localStorage.getItem('userTel') || '',
      password: '',
      siret: siret,
      siren: siren
    };
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  // Recharger les données depuis localStorage à chaque ouverture de la page
  useEffect(() => {
    const siret = localStorage.getItem('userSiret') || '';
    const siren = localStorage.getItem('userSiren') || '';
    
    console.log('🔄 Rechargement des données SIRET/SIREN:');
    console.log('📋 SIRET:', siret);
    console.log('📋 SIREN:', siren);
    
    setFormData(prev => ({
      ...prev,
      siret: siret,
      siren: siren
    }));
  }, []);

  const checkAuthentication = () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Vous devez être connecté pour voir votre profil');
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error) {
      setError('Erreur lors de la vérification de l\'authentification');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const userId = localStorage.getItem('userId');
      console.log('🔄 Mise à jour du profil dans MongoDB...');
      
      const data = await apiCall('https://sailingloc-back-lilac.vercel.app/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          password: formData.password,
          siret: formData.siret,
          siren: formData.siren
        })
      });
      
      console.log('✅ Profil mis à jour avec succès:', data);
      // Met à jour le localStorage
      localStorage.setItem('userNom', data.user.nom);
      localStorage.setItem('userPrenom', data.user.prenom);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userTel', data.user.tel);
      if (data.user.siret) localStorage.setItem('userSiret', data.user.siret);
      if (data.user.siren) localStorage.setItem('userSiren', data.user.siren);

      // Mettre à jour le formulaire avec les nouvelles données
      setFormData({
        nom: data.user.nom || '',
        prenom: data.user.prenom || '',
        email: data.user.email || '',
        telephone: data.user.tel || '',
        password: '', // Ne pas afficher le mot de passe
        siret: data.user.siret || '',
        siren: data.user.siren || ''
      });
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 22, marginRight: 10 }}>✅</span>
          <div>
            <strong style={{ color: '#16a34a' }}>Profil mis à jour avec succès !</strong>
          </div>
        </div>,
        {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          style: { background: '#e6f9ec', color: '#16a34a', fontWeight: 500, fontSize: 18, border: '2px solid #16a34a' },
          icon: false
        }
      );
      setMessage('');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté');
      }

      console.log('🔄 Suppression du compte depuis MongoDB...');
      
      await apiCall('https://sailingloc-back-lilac.vercel.app/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Compte supprimé avec succès');

      // Supprimer toutes les données du localStorage
      localStorage.clear();
      
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 22, marginRight: 10 }}>✅</span>
          <div>
            <strong style={{ color: '#16a34a' }}>Compte supprimé avec succès</strong>
            <br />
            <span style={{ fontSize: 14 }}>Vous allez être redirigé vers l'accueil</span>
          </div>
        </div>,
        {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          style: { background: '#e6f9ec', color: '#16a34a', fontWeight: 500, fontSize: 18, border: '2px solid #16a34a' },
          icon: false
        }
      );

      // Rediriger vers l'accueil après 3 secondes
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 22, marginRight: 10 }}>❌</span>
          <div>
            <strong style={{ color: '#dc2626' }}>Erreur</strong>
            <br />
            <span style={{ fontSize: 14 }}>{error.message}</span>
          </div>
        </div>,
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          style: { background: '#fef2f2', color: '#dc2626', fontWeight: 500, fontSize: 18, border: '2px solid #dc2626' },
          icon: false
        }
      );
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Chargement du profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg text-gray-800 mb-2">{error}</p>
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
      <ToastContainer />
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Mon profil</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                placeholder="Votre prénom"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                placeholder="Votre email"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                placeholder="Votre téléphone"
              />
            </div>

            {/* Champs SIRET et SIREN pour les propriétaires */}
            {localStorage.getItem('userRole') === 'proprietaire' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    SIRET
                  </label>
                  <input
                    type="text"
                    name="siret"
                    value={formData.siret}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                    placeholder="12345678901234"
                    maxLength="14"
                  />
                  <p className="mt-1 text-xs text-gray-500">14 chiffres sans espaces</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    SIREN
                  </label>
                  <input
                    type="text"
                    name="siren"
                    value={formData.siren}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                    placeholder="123456789"
                    maxLength="9"
                  />
                  <p className="mt-1 text-xs text-gray-500">9 chiffres sans espaces</p>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 pr-12"
                  placeholder="Nouveau mot de passe (laisser vide pour ne pas changer)"
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={0}
                  role="button"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-full font-bold text-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-lg"
            >
              Enregistrer
            </button>
            {message && <div className="text-green-600 text-center mt-2">{message}</div>}
          </form>

          {/* Séparateur */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Zone dangereuse</h3>
              <p className="text-sm text-gray-600 mb-4">
                La suppression de votre compte est irréversible. Toutes vos données, 
                réservations et bateaux seront définitivement supprimés.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Trash2 className="h-5 w-5" />
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Supprimer votre compte ?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Cette action est irréversible. Toutes vos données seront définitivement supprimées.
              </p>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Supprimer définitivement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 