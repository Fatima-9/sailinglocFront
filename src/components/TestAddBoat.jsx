import React, { useState } from 'react';
import AddBoat from './AddBoat';

const TestAddBoat = () => {
  const [isAddBoatOpen, setIsAddBoatOpen] = useState(false);

  const handleBoatAdded = (newBoat) => {
    console.log('🎉 Nouveau bateau ajouté:', newBoat);
    setIsAddBoatOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 Test AddBoat</h1>
      
      <button
        onClick={() => setIsAddBoatOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Ouvrir AddBoat
      </button>

      <AddBoat
        isOpen={isAddBoatOpen}
        onClose={() => setIsAddBoatOpen(false)}
        onBoatAdded={handleBoatAdded}
      />
    </div>
  );
};

export default TestAddBoat;
