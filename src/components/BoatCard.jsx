import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Euro, Ruler } from 'lucide-react';
import StarRating from './StarRating';
import HeartButton from './HeartButton';

export default function BoatCard({ boat, viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-6">
          {/* Image */}
          <div className="flex-shrink-0 relative">
            <img
              src={boat.image}
              alt={boat.nom}
              className="w-32 h-24 object-cover rounded-lg"
            />
            <HeartButton boatId={boat._id} className="top-2 right-2" />
          </div>
          
          {/* Informations */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{boat.nom}</h3>
              <div className="flex items-center space-x-1 ml-2">
                <StarRating rating={boat.rating || 0} size={16} />
                <span className="text-sm text-gray-600">({boat.reviews || 0})</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span className="capitalize">{boat.destination}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Ruler size={16} />
                <span>{boat.longueur}m</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={16} />
                <span>{boat.capacite} pers.</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>{boat.destination}</span>
              </div>
            </div>
            
            {boat.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {boat.description}
              </p>
            )}
          </div>
          
          {/* Prix et bouton */}
          <div className="flex-shrink-0 text-right">
            <div className="text-2xl font-bold text-blue-600 mb-3">
              {boat.prix_jour}€<span className="text-base font-normal text-gray-600">/jour</span>
            </div>
            <Link
              to={`/bateaux/${boat._id}`}
              className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
            >
              Réserver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Mode grille (par défaut)
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={boat.image}
          alt={boat.nom}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {boat.type}
        </div>
        <HeartButton boatId={boat._id} />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{boat.nom}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <StarRating rating={boat.rating || 0} size={16} />
            <span className="text-sm text-gray-600">({boat.reviews || 0})</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin size={16} />
            <span className="capitalize">{boat.destination}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{boat.capacite} pers.</span>
          </div>
        </div>
        
        {boat.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {boat.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            {boat.prix_jour}€<span className="text-base font-normal text-gray-600">/jour</span>
          </div>
          <Link
            to={`/bateaux/${boat._id}`}
            className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
          >
            Réserver
          </Link>
        </div>
      </div>
    </div>
  );
}