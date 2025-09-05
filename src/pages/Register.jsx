import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, Anchor } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Captcha from '../components/Captcha';

export default function Register() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    userType: 'client', // valeur par défaut corrigée
    isProfessionnel: false,
    siret: '',
    siren: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaData, setCaptchaData] = useState({});
  const [isCaptchaCorrect, setIsCaptchaCorrect] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    // Validation SIRET et SIREN pour les propriétaires
    if (formData.userType === 'proprietaire' && formData.isProfessionnel) {
      if (!formData.siret.trim()) {
        newErrors.siret = 'Le SIRET est requis pour les professionnels';
      } else if (!/^\d{14}$/.test(formData.siret)) {
        newErrors.siret = 'Le SIRET doit contenir exactement 14 chiffres';
      }
      
      if (!formData.siren.trim()) {
        newErrors.siren = 'Le SIREN est requis pour les professionnels';
      } else if (!/^\d{9}$/.test(formData.siren)) {
        newErrors.siren = 'Le SIREN doit contenir exactement 9 chiffres';
      }
    }
    
    if (!isCaptchaCorrect) {
      newErrors.captcha = 'Veuillez résoudre le CAPTCHA correctement';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.password,
          tel: formData.telephone.replace(/\D/g, ''),
          role: formData.userType,
          ...(formData.userType === 'proprietaire' && {
            isProfessionnel: formData.isProfessionnel,
            ...(formData.isProfessionnel && {
              siret: formData.siret,
              siren: formData.siren
            })
          }),
          captchaQuestion: captchaData.question,
          captchaAnswer: captchaData.answer,
          userAnswer: captchaData.userAnswer
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Inscription échouée');
      }
      const data = await response.json();
      localStorage.setItem('userNom', data.user.nom);
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 22, marginRight: 10 }}>✅</span>
          <div>
            <strong style={{ color: '#16a34a' }}>Inscription réussie !</strong><br />
            Bienvenue <span style={{ color: '#16a34a' }}>{data.user.nom}</span> 👋
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
      setTimeout(() => navigate('/connexion'), 3100);
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'inscription.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        style: { background: '#fde6e6', color: '#991b1b', fontWeight: 500, fontSize: 18, border: '2px solid #991b1b' },
        icon: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <ToastContainer />
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-800">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1600)',
            opacity: 0.3
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Anchor className="h-12 w-12 text-white mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider">
              SAILINGLOC
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Rejoignez la communauté des passionnés de navigation
          </p>
        </div>
      </section>

      {/* Register Form */}
      <section className="py-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                INSCRIPTION
              </h2>
              <p className="text-gray-600">
                Créez votre compte SailingLoc
              </p>
            </div>
            
            {/* User Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                TYPE DE COMPTE
              </label>
              <div className="grid grid-cols-3 gap-4">
                <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.userType === 'client' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="client"
                    checked={formData.userType === 'client'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <User className="h-8 w-8 mx-auto mb-2" />
                    <span className="font-semibold">CLIENT</span>
                    <p className="text-xs mt-1">Louer des bateaux</p>
                  </div>
                </label>
                
                <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.userType === 'proprietaire' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="proprietaire"
                    checked={formData.userType === 'proprietaire'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <Anchor className="h-8 w-8 mx-auto mb-2" />
                    <span className="font-semibold">PROPRIÉTAIRE</span>
                    <p className="text-xs mt-1">Mettre en location</p>
                  </div>
                </label>


              </div>
            </div>

            {/* Champs SIRET et SIREN pour les propriétaires */}
            {formData.userType === 'proprietaire' && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Anchor className="h-5 w-5" />
                  Statut du propriétaire
                </h3>
                
                {/* Boutons radio pour le statut */}
                <div className="space-y-3 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isProfessionnel"
                      value="false"
                      checked={formData.isProfessionnel === false}
                      onChange={(e) => setFormData({...formData, isProfessionnel: e.target.value === 'true'})}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Particulier</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isProfessionnel"
                      value="true"
                      checked={formData.isProfessionnel === true}
                      onChange={(e) => setFormData({...formData, isProfessionnel: e.target.value === 'true'})}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Professionnel</span>
                  </label>
                </div>
                
                {/* Champs SIRET/SIREN uniquement pour les professionnels */}
                {formData.isProfessionnel && (
                  <>
                    <div className="border-t border-blue-300 pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-blue-900 mb-3">Informations professionnelles</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="siret" className="block text-sm font-bold text-gray-900 mb-2">
                            SIRET *
                          </label>
                          <input
                            type="text"
                            id="siret"
                            name="siret"
                            value={formData.siret}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.siret ? 'border-red-500' : 'border-gray-200'
                            }`}
                            placeholder="12345678901234"
                            maxLength="14"
                          />
                          {errors.siret && (
                            <p className="mt-2 text-sm text-red-600">{errors.siret}</p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">14 chiffres sans espaces</p>
                        </div>
                        
                        <div>
                          <label htmlFor="siren" className="block text-sm font-bold text-gray-900 mb-2">
                            SIREN *
                          </label>
                          <input
                            type="text"
                            id="siren"
                            name="siren"
                            value={formData.siren}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.siren ? 'border-red-500' : 'border-gray-200'
                            }`}
                            placeholder="123456789"
                            maxLength="9"
                          />
                          {errors.siren && (
                            <p className="mt-2 text-sm text-red-600">{errors.siren}</p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">9 chiffres sans espaces</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prenom" className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    PRÉNOM
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.prenom ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Prénom"
                    />
                  </div>
                  {errors.prenom && (
                    <p className="mt-2 text-sm text-red-600">{errors.prenom}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="nom" className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    NOM
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.nom ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Nom"
                    />
                  </div>
                  {errors.nom && (
                    <p className="mt-2 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                  EMAIL
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="telephone" className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                  TÉLÉPHONE
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.telephone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                {errors.telephone && (
                  <p className="mt-2 text-sm text-red-600">{errors.telephone}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                  MOT DE PASSE
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                  CONFIRMER LE MOT DE PASSE
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Confirmer le mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
              
              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">
                    J'accepte les{' '}
                    <Link to="/conditions" className="text-blue-600 hover:text-blue-700">
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link to="/confidentialite" className="text-blue-600 hover:text-blue-700">
                      politique de confidentialité
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-2 text-sm text-red-600">{errors.acceptTerms}</p>
                )}
              </div>
              
              {/* CAPTCHA */}
              <Captcha
                onCaptchaChange={setCaptchaData}
                isCorrect={isCaptchaCorrect}
                setIsCorrect={setIsCaptchaCorrect}
              />
              {errors.captcha && (
                <p className="mt-2 text-sm text-red-600">{errors.captcha}</p>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-full font-bold text-lg transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600'
                } text-white shadow-lg`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>INSCRIPTION...</span>
                  </div>
                ) : (
                  'CRÉER MON COMPTE'
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Déjà un compte ?{' '}
                <Link to="/connexion" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}