import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock, Ship } from 'lucide-react';

export default function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    destination: '',
    date: '',
    duration: '',
    boatType: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleInputChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Destination
            </label>
          </div>
          <select
            value={filters.destination}
            onChange={(e) => handleInputChange('destination', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
          >
            <option value="">Destination</option>
            <option value="saint-malo">Saint-Malo</option>
            <option value="les-glenan">Les Glénan</option>
            <option value="crozon">Crozon</option>
          </select>
        </div>

        <div className="relative">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Date de départ
            </label>
          </div>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
          />
        </div>

        <div className="relative">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Durée du séjour
            </label>
          </div>
          <select
            value={filters.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
          >
            <option value="">Choisir la durée</option>
            <option value="demi-journee">Demi-journée</option>
            <option value="journee">Journée</option>
            <option value="weekend">Weekend</option>
            <option value="semaine">Semaine</option>
          </select>
        </div>

        <div className="relative">
          <div className="flex items-center space-x-2">
            <Ship className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Type de bateau
            </label>
          </div>
          <select
            value={filters.boatType}
            onChange={(e) => handleInputChange('boatType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2 min-w-[140px]"
          >
            <option value="">Choisir un type</option>
            <option value="voilier">Voilier</option>
            <option value="yacht">Yacht</option>
            <option value="catamaran">Catamaran</option>
          </select>
        </div>

        <div className="md:col-span-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Search size={20} />
            <span>Rechercher</span>
          </button>
        </div>
      </form>
    </div>
  );
}