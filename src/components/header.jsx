import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, User } from 'lucide-react';
import Logo from '../../assets/Logo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Bateaux', path: '/bateaux' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  const userPrenom = typeof window !== 'undefined' ? localStorage.getItem('userPrenom') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userNom');
    localStorage.removeItem('userPrenom');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userTel');
    window.location.href = '/connexion';
  };

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Logo SailingLoc" className="h-9 w-auto" />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleNavClick}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Boutons connexion/inscription */}
          <div className="hidden md:flex items-center space-x-4">
            {userPrenom ? (
              <>
                <Link
                  to="/favoris"
                  className="text-blue-600 hover:text-blue-800 px-4 py-2 text-sm font-medium transition-colors flex items-center"
                >
                  <Heart className="h-5 w-5" />
                </Link>
                {userRole === 'proprietaire' && (
                  <>
                    <Link
                      to="/gestion-bateaux"
                      className="text-blue-600 hover:text-blue-800 px-4 py-2 text-sm font-medium transition-colors flex items-center"
                    >
                      Gestion bateaux
                    </Link>
                    <Link
                      to="/gestion-reservations"
                      className="text-blue-600 hover:text-blue-800 px-4 py-2 text-sm font-medium transition-colors flex items-center"
                    >
                      Gestion réservations
                    </Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center"
                  >
                    Dashboard Admin
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowAccountMenu((v) => !v)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center focus:outline-none"
                  >
                    <User className="h-5 w-5" />
                  </button>
                  {showAccountMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-4 z-50 border border-gray-100">
                      <div className="px-4 py-2 text-gray-700 text-sm mb-2">Bienvenue <span className="font-bold text-blue-700">{userPrenom}</span></div>
                      
                      {userRole !== 'proprietaire' && userRole !== 'admin' && (
                        <Link
                          to="/mes-reservations"
                          onClick={() => setShowAccountMenu(false)}
                          className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 text-sm font-medium"
                        >
                          Mes Réservations
                        </Link>
                      )}
                      
                      <Link
                        to="/profil"
                        onClick={() => setShowAccountMenu(false)}
                        className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 text-sm font-medium flex items-center gap-2 border-t border-gray-100 mt-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
                        Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium border-t border-gray-100 mt-2"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/connexion"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors"
                  onClick={handleNavClick}
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
                  onClick={handleNavClick}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Menu mobile */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => { setIsMenuOpen(false); handleNavClick(); }}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 space-y-2">
                {userPrenom ? (
                  <>
                    {userRole === 'proprietaire' && (
                      <>
                        <Link
                          to="/gestion-bateaux"
                          className="block w-full text-center border border-blue-600 text-blue-600 px-3 py-2 rounded-full text-base font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                          onClick={() => { setIsMenuOpen(false); handleNavClick(); }}
                        >
                          Gestion bateaux
                        </Link>
                        <Link
                          to="/gestion-reservations"
                          className="block w-full text-center border border-blue-600 text-blue-600 px-3 py-2 rounded-full text-base font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                          onClick={() => { setIsMenuOpen(false); handleNavClick(); }}
                        >
                          Gestion réservations
                        </Link>
                      </>
                    )}
                    {userRole === 'admin' && (
                      <Link
                        to="/admin"
                        className="block w-full text-center bg-red-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-red-700 transition-colors"
                        onClick={() => { setIsMenuOpen(false); handleNavClick(); }}
                      >
                        Dashboard Admin
                      </Link>
                    )}
                    <Link
                      to="/favoris"
                      className="block w-full text-center border border-blue-600 text-blue-600 px-3 py-2 rounded-full text-base font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                      onClick={() => { setIsMenuOpen(false); handleNavClick(); }}
                    >
                      <Heart className="h-5 w-5" />
                    </Link>
                    
                    {userRole !== 'proprietaire' && userRole !== 'admin' && (
                      <Link
                        to="/mes-reservations"
                        className="block w-full text-center border border-blue-600 text-blue-600 px-3 py-2 rounded-full text-base font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                        onClick={() => { setIsMenuOpen(false); handleNavClick(); }}
                      >
                        Mes Réservations
                      </Link>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => setShowAccountMenu((v) => !v)}
                        className="block w-full text-center border border-blue-600 text-blue-600 px-3 py-2 rounded-full text-base font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                      >
                        <User className="h-5 w-5" />
                      </button>
                      {showAccountMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-4 z-50 border border-gray-100">
                          <div className="px-4 py-2 text-gray-700 text-sm mb-2">Bienvenue <span className="font-bold text-blue-700">{userPrenom}</span></div>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium"
                          >
                            Déconnexion
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/connexion"
                      className="block w-full text-center border border-orange-500 text-orange-500 px-3 py-2 rounded-full text-base font-medium hover:bg-orange-50 transition-colors"
                      onClick={() => { setIsMenuOpen(false); handleNavClick(); }}
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/inscription"
                      className="block w-full text-center bg-orange-500 text-white px-3 py-2 rounded-full text-base font-medium hover:bg-orange-600 transition-colors"
                      onClick={() => { setIsMenuOpen(false); handleNavClick(); }}
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}