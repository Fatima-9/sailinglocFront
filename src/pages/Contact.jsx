import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, X } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    message: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
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
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          message: formData.message,
          email: formData.email
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur lors de l\'envoi du message.');
      
      // Afficher le message de succès moderne
      setShowSuccess(true);
      setFormData({ nom: '', prenom: '', telephone: '', message: '', email: '' });
      
      // Masquer automatiquement après 5 secondes
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      alert(error.message || 'Erreur lors de l\'envoi du message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Notification de succès moderne */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 max-w-md border border-green-400">
            <div className="animate-bounce-in">
              <CheckCircle className="h-7 w-7 text-green-100 flex-shrink-0" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Message envoyé ! 🎉</h3>
              <p className="text-green-100 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-green-100 hover:text-white transition-colors duration-200 hover:bg-green-400 hover:bg-opacity-20 rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1600)',
            opacity: 0.3
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Contact
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Nous simplifions la location de bateaux dans plus de 60 destinations, 
            pour que vous puissiez profiter à tous vos besoins de navigation.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-900 text-white p-8 rounded-2xl text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                <Phone className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold mb-4">TÉLÉPHONE</h3>
              <p className="text-blue-100 mb-2">+33 2 99 40 78 90</p>
              <p className="text-sm text-blue-200">Lun-Ven : 9h-18h</p>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-2xl text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                <Mail className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold mb-4">INFORMATIONS</h3>
              <p className="text-blue-100 mb-2">sailinglocequipe@gmail.com</p>
              <p className="text-sm text-blue-200">Réponse sous 24h</p>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-2xl text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                <MapPin className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold mb-4">ADRESSE</h3>
              <p className="text-blue-100 mb-2">12 Quai Louis Durand</p>
              <p className="text-sm text-blue-200">17000 La Rochelle</p>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-2xl text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                <Clock className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold mb-4">HORAIRES</h3>
              <p className="text-blue-100 mb-2">Lun-Sam : 9h-18h</p>
              <p className="text-sm text-blue-200">Fermé le dimanche</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Formulaire de contact
              </h2>
              <p className="text-gray-600">
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="nom" className="block text-sm font-bold text-gray-900 mb-3">
                    NOM
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nom ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Votre nom"
                  />
                  {errors.nom && (
                    <p className="mt-2 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="prenom" className="block text-sm font-bold text-gray-900 mb-3">
                    PRÉNOM
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.prenom ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Votre prénom"
                  />
                  {errors.prenom && (
                    <p className="mt-2 text-sm text-red-600">{errors.prenom}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-3">
                  EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Votre email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="telephone" className="block text-sm font-bold text-gray-900 mb-3">
                  TÉLÉPHONE
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.telephone ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Votre numéro de téléphone"
                />
                {errors.telephone && (
                  <p className="mt-2 text-sm text-red-600">{errors.telephone}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-3">
                  MESSAGE
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.message ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Votre message..."
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600">{errors.message}</p>
                )}
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center space-x-3 px-12 py-4 rounded-full font-bold text-lg transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  } text-white shadow-lg`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send size={24} />
                      <span>ENVOYER</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}