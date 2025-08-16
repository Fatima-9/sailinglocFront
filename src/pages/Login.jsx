import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_ENDPOINTS, apiCall } from '../config/api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
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
      console.log('🔄 Connexion en cours...');
      
      const data = await apiCall(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      console.log('✅ Connexion réussie:', data);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userPrenom', data.user.prenom);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userNom', data.user.nom);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userTel', data.user.tel);
      
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 22, marginRight: 10 }}>✅</span>
          <div>
            <strong style={{ color: '#16a34a' }}>Connexion réussie !</strong><br />
            Bienvenue <span style={{ color: '#16a34a' }}>{data.user.prenom}</span> 👋
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
      
      // Redirection selon le rôle de l'utilisateur
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      alert(error.message || 'Erreur lors de la connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
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
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider">
              SAILINGLOC
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Connectez-vous pour accéder à votre espace personnel
          </p>
        </div>
      </section>

      {/* Login Form */}
      <section className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                CONNEXION
              </h2>
              <p className="text-gray-600">
                Accédez à votre compte SailingLoc
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                  EMAIL
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                  MOT DE PASSE
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Votre mot de passe"
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
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <Link to="/mot-de-passe-oublie" className="text-sm text-blue-600 hover:text-blue-700">
                  Mot de passe oublié ?
                </Link>
              </div>
              
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
                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                    <span>CONNEXION...</span>
                  </div>
                ) : (
                  'SE CONNECTER'
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Pas encore de compte ?{' '}
                <Link to="/inscription" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}