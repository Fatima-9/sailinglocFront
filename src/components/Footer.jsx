import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Linkedin, CreditCard, Smartphone, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const userPrenom = typeof window !== 'undefined' ? localStorage.getItem('userPrenom') : null;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
    alert('Inscription réussie !');
  };

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Mode de paiement */}
          <div>
            <h3 className="text-xl font-bold mb-6">MODE DE PAIEMENT</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-900" />
                </div>
                <span>Carte bancaire</span>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-xl font-bold mb-6">INFORMATIONS</h3>
            <div className="space-y-3">
              <Link to="/" className="block hover:text-blue-300 transition-colors">
                Accueil
              </Link>
              <Link to="/bateaux" className="block hover:text-blue-300 transition-colors">
                Bateaux
              </Link>
              <Link to="/a-propos" className="block hover:text-blue-300 transition-colors">
                À propos
              </Link>
              <Link to="/contact" className="block hover:text-blue-300 transition-colors">
                Contact
              </Link>
              <Link to="/mentions-legales" className="block hover:text-blue-300 transition-colors">
                Mentions légales
              </Link>
              <Link to="/politique-confidentialite" className="block hover:text-blue-300 transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/cgu-cgv" className="block hover:text-blue-300 transition-colors">
                CGU / CGV
              </Link>
              {userPrenom ? (
                <>
                  <Link to="/connexion" className="block hover:text-blue-300 transition-colors">
                    Connexion
                  </Link>
                  <Link to="/inscription" className="block hover:text-blue-300 transition-colors">
                    Inscription
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/connexion" className="block hover:text-blue-300 transition-colors">
                    Connexion
                  </Link>
                  <Link to="/inscription" className="block hover:text-blue-300 transition-colors">
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6">RECEVEZ NOTRE NEWSLETTER</h3>
            <p className="text-blue-200 mb-6 leading-relaxed">
              Recevez nos offres et actualités directement dans votre boîte mail pour ne rien manquer de nos nouveautés.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                ENVOYER
              </button>
            </form>
          </div>
        </div>

        {/* Réseaux sociaux et copyright */}
        <div className="border-t border-blue-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-6 sm:mb-0">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Facebook size={28} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Instagram size={28} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Youtube size={28} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Linkedin size={28} />
              </a>
            </div>
            <p className="text-blue-200">
              © 2025 SailingLoc - Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}