import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Ship } from 'lucide-react';
import BoatCard from '../components/BoatCard';

export default function Boats() {
  const [boats, setBoats] = useState([]);
  const [filteredBoats, setFilteredBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    priceRange: '',
    capacity: ''
  });
  const [viewMode, setViewMode] = useState('grid');

  // Récupérer tous les bateaux depuis l'API
  useEffect(() => {
    fetchBoats();
  }, []);

  const fetchBoats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/boats');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des bateaux');
      }

      const data = await response.json();
      setBoats(data);
      setFilteredBoats(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    let filtered = boats;
    
    if (newFilters.type) {
      filtered = filtered.filter(boat => 
        boat.type.toLowerCase().includes(newFilters.type.toLowerCase())
      );
    }
    
    if (newFilters.priceRange) {
      const [min, max] = newFilters.priceRange.split('-').map(Number);
      filtered = filtered.filter(boat => 
        boat.prix_jour >= min && (max ? boat.prix_jour <= max : true)
      );
    }
    
    if (newFilters.capacity) {
      filtered = filtered.filter(boat => boat.capacite >= parseInt(newFilters.capacity));
    }
    
    setFilteredBoats(filtered);
  };

  const clearFilters = () => {
    setFilters({ type: '', priceRange: '', capacity: '' });
    setFilteredBoats(boats);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des bateaux...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Ship className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">Erreur de chargement</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              Nos bateaux
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredBoats.length} bateau{filteredBoats.length > 1 ? 'x' : ''} trouvé{filteredBoats.length > 1 ? 's' : ''}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Filter size={20} />
                  <span>Filtres</span>
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Effacer
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de bateau
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous les types</option>
                    <option value="voilier">Voilier</option>
                    <option value="yacht">Yacht</option>
                    <option value="catamaran">Catamaran</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fourchette de prix
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous les prix</option>
                    <option value="0-100">0€ - 100€</option>
                    <option value="100-200">100€ - 200€</option>
                    <option value="200-300">200€ - 300€</option>
                    <option value="300-500">300€ - 500€</option>
                    <option value="500-1000">500€+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacité minimale
                  </label>
                  <select
                    value={filters.capacity}
                    onChange={(e) => handleFilterChange('capacity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Toutes capacités</option>
                    <option value="2">2+ personnes</option>
                    <option value="4">4+ personnes</option>
                    <option value="6">6+ personnes</option>
                    <option value="8">8+ personnes</option>
                    <option value="10">10+ personnes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Boats Grid/List */}
          <div className="lg:w-3/4">
            {filteredBoats.length === 0 ? (
              <div className="text-center py-12">
                <Ship className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">Aucun bateau trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres ou revenez plus tard.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredBoats.map((boat) => (
                  <BoatCard key={boat._id} boat={boat} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}