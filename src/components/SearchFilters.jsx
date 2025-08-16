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
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={filters.destination}
            onChange={(e) => handleInputChange('destination', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Destination</option>
            <option value="saint-malo">Saint-Malo</option>
            <option value="les-glenan">Les Glénan</option>
            <option value="crozon">Crozon</option>
          </select>
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={filters.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Durée</option>
            <option value="demi-journee">Demi-journée</option>
            <option value="journee">Journée</option>
            <option value="weekend">Weekend</option>
            <option value="semaine">Semaine</option>
          </select>
        </div>

        <div className="relative">
          <Ship className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={filters.boatType}
            onChange={(e) => handleInputChange('boatType', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Type de bateau</option>
            <option value="voilier">Voilier</option>
            <option value="yacht">Yacht</option>
            <option value="catamaran">Catamaran</option>
            <option value="moteur">Bateau à moteur</option>
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