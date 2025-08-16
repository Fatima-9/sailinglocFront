import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Profil() {
  // Préremplir depuis le localStorage si dispo (sinon vide)
  const [formData, setFormData] = useState({
    nom: localStorage.getItem('userNom') || '',
    prenom: localStorage.getItem('userPrenom') || '',
    email: localStorage.getItem('userEmail') || '',
    telephone: localStorage.getItem('userTel') || '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('sailingloc-back-lilac.vercel.app/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          password: formData.password
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur lors de la mise à jour');
      // Met à jour le localStorage
      localStorage.setItem('userNom', data.user.nom);
      localStorage.setItem('userPrenom', data.user.prenom);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userTel', data.user.tel);
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
        </div>
      </main>
    </div>
  );
} 