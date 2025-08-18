import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Anchor, ArrowLeft, Ship, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icône et titre principal */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Ship className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">!</span>
              </div>
            </div>
            <h1 className="text-8xl md:text-9xl font-bold text-blue-600 mb-4 tracking-wider">
              404
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Page introuvable
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Oups ! Il semble que vous ayez navigué vers des eaux inconnues. 
              Cette page n'existe pas ou a été déplacée.
            </p>
          </div>

          {/* Message d'erreur stylisé */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Compass className="h-8 w-8 text-blue-500" />
              <h3 className="text-2xl font-bold text-gray-800">
                Navigation perdue
              </h3>
            </div>
            <p className="text-gray-600 text-lg mb-6">
              Ne vous inquiétez pas, même les meilleurs navigateurs peuvent se perdre ! 
              Utilisez la boussole ci-dessous pour retrouver votre route.
            </p>
            
            {/* Statistiques amusantes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">🌊</div>
                <div className="text-sm text-gray-600">Océans explorés</div>
                <div className="text-2xl font-bold text-blue-800">7</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">⚓</div>
                <div className="text-sm text-gray-600">Ports visités</div>
                <div className="text-2xl font-bold text-green-800">42</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">🧭</div>
                <div className="text-sm text-gray-600">Direction trouvée</div>
                <div className="text-2xl font-bold text-orange-800">100%</div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/"
              className="inline-flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Home size={24} />
              <span>Retour à l'accueil</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-3 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft size={24} />
              <span>Page précédente</span>
            </button>
          </div>

          {/* Liens utiles */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Destinations populaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/bateaux"
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
              >
                <Anchor className="h-6 w-6 text-blue-500 group-hover:text-blue-600" />
                <span className="font-medium text-gray-700 group-hover:text-blue-700">
                  Nos bateaux
                </span>
              </Link>
              
              <Link
                to="/a-propos"
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
              >
                <Ship className="h-6 w-6 text-blue-500 group-hover:text-blue-600" />
                <span className="font-medium text-gray-700 group-hover:text-blue-700">
                  À propos
                </span>
              </Link>
              
              <Link
                to="/contact"
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
              >
                <Compass className="h-6 w-6 text-blue-500 group-hover:text-blue-600" />
                <span className="font-medium text-gray-700 group-hover:text-blue-700">
                  Contact
                </span>
              </Link>
              
              <Link
                to="/inscription"
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
              >
                <Anchor className="h-6 w-6 text-blue-500 group-hover:text-blue-600" />
                <span className="font-medium text-gray-700 group-hover:text-blue-700">
                  S'inscrire
                </span>
              </Link>
            </div>
          </div>

          {/* Message d'encouragement */}
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-4">
              💡 <strong>Conseil de navigateur :</strong> 
              Gardez toujours un œil sur votre boussole !
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Anchor className="h-5 w-5" />
              <span className="font-medium">SailingLoc - Votre boussole vers l'aventure</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
