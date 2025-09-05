import React from 'react';
import { X, AlertTriangle, Calendar, User } from 'lucide-react';

const AlertPopup = ({ isOpen, onClose, title, message, type = 'error', details = null }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'success':
        return <Calendar className="h-6 w-6 text-green-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'warning':
        return 'text-yellow-800';
      case 'success':
        return 'text-green-800';
      default:
        return 'text-red-800';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-red-600 hover:bg-red-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${getBgColor()} border rounded-lg shadow-xl max-w-md w-full mx-4`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className={`text-lg font-semibold ${getTextColor()}`}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className={`text-sm ${getTextColor()} mb-4`}>
            {message}
          </p>

          {/* Message d'alerte principal pour les dates indisponibles */}
          {type === 'error' && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800 text-sm">
                  ⚠️ ATTENTION : Ces dates ne peuvent pas être réservées
                </span>
              </div>
            </div>
          )}

          {/* Détails des réservations en conflit */}
          {details && details.conflictingBookings && details.conflictingBookings.length > 0 && (
            <div className="mb-4">
              <h4 className={`font-medium text-sm ${getTextColor()} mb-2`}>
                Périodes déjà réservées :
              </h4>
              <div className="space-y-2">
                {details.conflictingBookings.map((booking, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        Client #{booking.userId.slice(-6)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Du :</span>
                        <span className="font-medium">
                          {new Date(booking.startDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Au :</span>
                        <span className="font-medium">
                          {new Date(booking.endDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informations sur les périodes de disponibilité */}
          {details && details.availabilityPeriods && details.availabilityPeriods.length > 0 && (
            <div className="mb-4">
              <h4 className={`font-medium text-sm ${getTextColor()} mb-2`}>
                Disponibilité :
              </h4>
              <div className="space-y-2">
                {details.availabilityPeriods.map((period, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded p-3">
                    <div className="text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Du :</span>
                        <span className="font-medium">
                          {new Date(period.startDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Au :</span>
                        <span className="font-medium">
                          {new Date(period.endDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Prix :</span>
                        <span className="font-medium text-green-600">
                          {period.price}€/jour
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {type === 'error' && (
            <div className="bg-white border border-gray-200 rounded p-3">
              <h4 className="font-medium text-sm text-gray-800 mb-2">
                Que faire ?
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Choisir une autre période disponible</li>
                <li>• Contacter le propriétaire pour plus d'options</li>
                <li>• Vérifier le calendrier pour voir les disponibilités</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className={`${getButtonColor()} text-white px-4 py-2 rounded-lg font-medium transition-colors`}
          >
            Compris
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;
