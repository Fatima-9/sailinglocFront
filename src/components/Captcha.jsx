import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

const Captcha = ({ onCaptchaChange, isCorrect, setIsCorrect }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [captchaCanvas, setCaptchaCanvas] = useState(null);
  const canvasRef = useRef(null);

  // Générer un texte CAPTCHA aléatoire
  const generateCaptchaText = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Dessiner le CAPTCHA sur le canvas
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);

    // Fond dégradé
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Ajouter du bruit (points aléatoires)
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`;
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        1,
        1
      );
    }

    // Ajouter des lignes de distraction
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Dessiner le texte principal
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Position de départ
    let x = width / 2;
    let y = height / 2;

    // Dessiner chaque caractère avec des effets
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // Couleur aléatoire pour chaque caractère
      ctx.fillStyle = `rgb(${Math.random() * 100 + 50}, ${Math.random() * 100 + 50}, ${Math.random() * 100 + 50})`;
      
      // Sauvegarder le contexte
      ctx.save();
      
      // Position avec légère variation
      const charX = x + (i - text.length / 2) * 35 + (Math.random() - 0.5) * 10;
      const charY = y + (Math.random() - 0.5) * 15;
      
      // Rotation aléatoire
      const rotation = (Math.random() - 0.5) * 0.4;
      ctx.translate(charX, charY);
      ctx.rotate(rotation);
      
      // Dessiner le caractère
      ctx.fillText(char, 0, 0);
      
      // Restaurer le contexte
      ctx.restore();
    }

    // Ajouter des cercles de distraction
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 10 + 5,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  // Générer un nouveau CAPTCHA
  const generateCaptcha = () => {
    const text = generateCaptchaText();
    setCaptchaText(text);
    setUserAnswer('');
    setIsCorrect(false);
    
    // Dessiner le CAPTCHA après un court délai pour s'assurer que le canvas est prêt
    setTimeout(() => {
      drawCaptcha(text);
    }, 100);
    
    // Notifier le composant parent du changement
    if (onCaptchaChange) {
      onCaptchaChange({ question: text, answer: text });
    }
  };

  // Vérifier la réponse
  const checkAnswer = (value) => {
    setUserAnswer(value);
    const correct = value.toUpperCase() === captchaText;
    setIsCorrect(correct);
    
    if (onCaptchaChange) {
      onCaptchaChange({ question: captchaText, answer: captchaText, userAnswer: value, isCorrect: correct });
    }
  };

  // Générer le premier CAPTCHA au chargement
  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Vérification de sécurité *
      </label>
      
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
            <canvas
              ref={canvasRef}
              width={300}
              height={80}
              className="mx-auto border border-gray-200 rounded"
              style={{ imageRendering: 'pixelated' }}
            />
            <p className="text-xs text-gray-500 mt-2">
              Recopiez les lettres et chiffres affichés ci-dessus
            </p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Nouveau CAPTCHA"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => checkAnswer(e.target.value)}
        placeholder="Tapez le code ci-dessus"
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          userAnswer && !isCorrect
            ? 'border-red-300 focus:ring-red-500'
            : userAnswer && isCorrect
            ? 'border-green-300 focus:ring-green-500'
            : 'border-gray-300'
        }`}
        required
        maxLength={6}
      />

      {userAnswer && (
        <div className={`text-sm ${
          isCorrect ? 'text-green-600' : 'text-red-600'
        }`}>
          {isCorrect ? (
            <span className="flex items-center gap-1">
              ✅ Code correct
            </span>
          ) : (
            <span className="flex items-center gap-1">
              ❌ Code incorrect, réessayez
            </span>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Recopiez le code affiché pour vérifier que vous êtes humain
      </p>
    </div>
  );
};

export default Captcha;
