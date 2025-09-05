import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? window.localStorage.getItem("cookieConsent")
          : null;
      if (!stored) {
        setIsVisible(true);
      }
    } catch (e) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isVisible) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isVisible]);

  const handleChoice = (value) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("cookieConsent", value);
        window.localStorage.setItem(
          "cookieConsentAt",
          new Date().toISOString()
        );
      }
    } catch (e) {
      // noop
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <div className="min-h-full flex items-end md:items-center justify-center p-4">
        <div className="w-full md:max-w-3xl rounded-2xl bg-white shadow-2xl border border-gray-200 p-6 md:p-8">
          <h2
            id="cookie-consent-title"
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
          >
            Gestion des cookies
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
            Nous utilisons des cookies pour assurer le bon fonctionnement du
            site, améliorer votre expérience, mesurer l'audience et sécuriser
            votre session. Vous pouvez{" "}
            <span className="font-semibold">refuser</span> les cookies non
            essentiels ou <span className="font-semibold">accepter</span> tous
            les cookies. Pour en savoir plus, consultez notre
            <Link
              to="/politique-confidentialite"
              className="text-blue-600 underline hover:text-blue-700"
            >
              {" "}
              politique de confidentialité
            </Link>
            .
          </p>
          <ul className="text-sm md:text-base text-gray-600 list-disc pl-5 space-y-1 mb-6">
            <li>
              Cookies essentiels: nécessaires au fonctionnement et à la sécurité
              (toujours actifs).
            </li>
            <li>
              Cookies de mesure d’audience et de personnalisation: activés
              uniquement si vous acceptez.
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => handleChoice("rejected")}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 text-base font-medium"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={() => handleChoice("accepted")}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-base font-semibold"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
