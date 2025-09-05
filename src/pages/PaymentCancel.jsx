import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState('Paiement annulé. Annulation de la réservation en cours...');
  const [error, setError] = useState('');

  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    async function cancelBooking() {
      try {
        if (!bookingId) {
          setInfo('Paiement annulé.');
          return;
        }
        if (!token) {
          setError('Veuillez vous connecter pour annuler la réservation.');
          return;
        }

        const res = await fetch(`http://localhost:3001/api/bookings/${bookingId}/cancel`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Impossible d’annuler la réservation.');
        }

        setInfo('Réservation annulée suite à l’annulation du paiement.');
      } catch (e) {
        setError(e.message);
      }
    }

    cancelBooking();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="bg-white shadow-sm rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-3">Paiement annulé</h1>
        {error ? (
          <p className="text-red-600 mb-6">{error}</p>
        ) : (
          <p className="text-gray-700 mb-6">{info}</p>
        )}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700">
            Revenir en arrière
          </button>
          <Link to="/bateaux" className="text-blue-600 hover:text-blue-700">
            Voir les bateaux
          </Link>
        </div>
      </div>
    </div>
  );
}
