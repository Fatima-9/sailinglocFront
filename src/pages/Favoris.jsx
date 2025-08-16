import React from 'react';

export default function Favoris() {
  let favoris = [];
  if (typeof window !== 'undefined') {
    try {
      favoris = JSON.parse(localStorage.getItem('favorisBoats')) || [];
    } catch {
      favoris = [];
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Mes favoris</h2>
        {favoris.length === 0 ? (
          <p className="text-gray-600">Aucun bateau en favori pour le moment.</p>
        ) : (
          <ul className="space-y-4">
            {favoris.map((boat, idx) => (
              <li key={idx} className="border-b pb-4 text-left">
                <strong>{boat.name}</strong> — {boat.location}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 