import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Loader2, CreditCard } from 'lucide-react';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const params = new URLSearchParams(location.search);
  const boatId = params.get('boatId');
  const startDate = params.get('startDate');
  const endDate = params.get('endDate');
  const numberOfGuests = params.get('numberOfGuests') ? parseInt(params.get('numberOfGuests'), 10) : 1;
  const specialRequests = params.get('specialRequests') || '';

  const createCheckout = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour payer.');
      }

      if (!boatId || !startDate || !endDate) {
        throw new Error('Paramètres de réservation manquants.');
      }

      const res = await fetch('http://localhost:3001/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          boatId,
          startDate,
          endDate,
          numberOfGuests,
          specialRequests
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Échec de l’initiation du paiement.');
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Si tous les paramètres sont fournis, on lance directement le Checkout
    if (boatId && startDate && endDate) {
      createCheckout();
    } else {
      setLoading(false);
      setError('Paramètres manquants. Veuillez recommencer la réservation.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700">Redirection vers le paiement sécurisé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="bg-white shadow-sm rounded-lg p-8 max-w-md w-full text-center">
        <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold mb-2">Paiement</h1>

        {error ? (
          <>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-3">
              <Link to="/bateaux" className="text-blue-600 hover:text-blue-700">
                Retour aux bateaux
              </Link>
              {boatId && startDate && endDate && (
                <button
                  onClick={createCheckout}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Réessayer le paiement
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-4">Cliquez sur le bouton ci-dessous si vous n’avez pas été redirigé automatiquement.</p>
            <button
              onClick={createCheckout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Continuer vers Stripe
            </button>
          </>
        )}
      </div>
    </div>
  );
}
