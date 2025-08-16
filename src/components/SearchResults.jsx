import React, { useState } from 'react';
import { Filter, SortAsc, SortDesc, X } from 'lucide-react';
import BoatCard from './BoatCard';

export default function SearchResults({ boats, onReset, searchFilters }) {
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation d'apparition
  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fonction de tri
  const sortedBoats = [...boats].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'prix_jour':
        aValue = a.prix_jour;
        bValue = b.prix_jour;
        break;
      case 'longueur':
        aValue = a.longueur;
        bValue = b.longueur;
        break;
      case 'capacite':
        aValue = a.capacite;
        bValue = b.capacite;
        break;
      case 'nom':
      default:
        aValue = a.nom.toLowerCase();
        bValue = b.nom.toLowerCase();
        break;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />;
  };

  const formatFilterValue = (key, value) => {
    if (!value) return '';
    
    switch (key) {
      case 'destination':
        return value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');
      case 'type':
        return value.charAt(0).toUpperCase() + value.slice(1);
      case 'dateDebut':
      case 'dateFin':
        return new Date(value).toLocaleDateString('fr-FR');
      default:
        return value;
    }
  };

  const activeFilters = Object.entries(searchFilters).filter(([_, value]) => value);

  return (
    <section 
      id="search-results" 
      className={`py-20 bg-white scroll-mt-20 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      ref={(el) => {
        // Ajouter une référence pour un scroll plus précis
        if (el) {
          el.scrollIntoView = (options) => {
            const headerOffset = 80; // Hauteur du header
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: options?.behavior || 'smooth'
            });
          };
        }
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête avec résultats et bouton réinitialiser */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Résultats de votre recherche
              </h2>
              <p className="text-xl text-gray-600">
                {boats.length} bateau{boats.length > 1 ? 'x' : ''} trouvé{boats.length > 1 ? 's' : ''} pour vos critères
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X size={20} />
            <span>Réinitialiser</span>
          </button>
        </div>

        {/* Filtres actifs */}
        {activeFilters.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-pulse">
            <h3 className="text-sm font-medium text-blue-800 mb-3">Filtres actifs :</h3>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {key === 'destination' ? '📍' : key === 'type' ? '🚢' : key.includes('date') ? '📅' : '🔍'}
                  {formatFilterValue(key, value)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Barre d'outils : tri et filtres */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          {/* Bouton filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={16} />
            <span>Filtres avancés</span>
          </button>

          {/* Options de tri */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Trier par :</span>
            <div className="flex gap-2">
              {[
                { key: 'nom', label: 'Nom' },
                { key: 'prix_jour', label: 'Prix' },
                { key: 'longueur', label: 'Longueur' },
                { key: 'capacite', label: 'Capacité' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    sortBy === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {label}
                  {getSortIcon(key)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres avancés</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix maximum par jour</label>
                <input
                  type="number"
                  placeholder="€"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longueur minimum</label>
                <input
                  type="number"
                  placeholder="mètres"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacité minimum</label>
                <input
                  type="number"
                  placeholder="personnes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Grille des bateaux */}
        {sortedBoats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBoats.map((boat) => (
              <BoatCard key={boat._id} boat={boat} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter size={64} />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Aucun résultat</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </section>
  );
}
