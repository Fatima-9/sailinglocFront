import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Validation du paiement en cours...');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session_id = params.get('session_id');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    async function confirm() {
      try {
        if (!session_id) {
          throw new Error('Identifiant de session Stripe manquant.');
        }
        if (!token) {
          throw new Error("Vous devez être connecté pour finaliser la réservation.");
        }

        const res = await fetch('http://localhost:3001/api/payment/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ session_id })
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Échec de la confirmation du paiement.');
        }

        setMessage('Paiement confirmé ! Votre réservation est en attente de confirmation par le propriétaire.');
        setTimeout(() => navigate('/mes-reservations'), 4000);
      } catch (e) {
        setError(e.message);
      }
    }

    confirm();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            Retour à l’accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <p className="text-gray-800">{message}</p>
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mt-4" />
        <div className="mt-6">
          <button
            onClick={() => navigate('/mes-reservations')}
            className="text-blue-600 hover:text-blue-700"
          >
            Aller à mes réservations
          </button>
        </div>
      </div>
    </div>
  );
}
