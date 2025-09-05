import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  CreditCard,
  Smartphone,
  Mail,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const userPrenom =
    typeof window !== "undefined" ? localStorage.getItem("userPrenom") : null;
  const userRole =
    typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
    alert("Inscription réussie !");
  };

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Mode de paiement */}
          <div>
            <h3 className="text-xl font-bold mb-6">MODE DE PAIEMENT</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-900" />
                </div>
                <span>Carte bancaire</span>
              </div>
            </div>
          </div>

          {/* PLAN DU SITE - Colonne 1 */}
          <div>
            <h3 className="text-xl font-bold mb-6">PLAN DU SITE</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-200 text-sm uppercase tracking-wide">
                  Pages principales
                </h4>
                <Link
                  to="/"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Accueil
                </Link>
                <Link
                  to="/bateaux"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Catalogue des bateaux
                </Link>
                <Link
                  to="/a-propos"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • À propos de SailingLoc
                </Link>
                <Link
                  to="/contact"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Contact et support
                </Link>
              </div>

              <div className="space-y-2 pt-3">
                <h4 className="font-semibold text-blue-200 text-sm uppercase tracking-wide">
                  Espace utilisateur
                </h4>
                <Link
                  to="/connexion"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Inscription
                </Link>
                <Link
                  to="/profil"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Mon profil
                </Link>
                {userRole !== 'proprietaire' && (
                  <Link
                    to="/mes-reservations"
                    className="block hover:text-blue-300 transition-colors text-sm"
                  >
                    • Mes réservations
                  </Link>
                )}
                <Link
                  to="/favoris"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Mes favoris
                </Link>
              </div>
            </div>
          </div>

          {/* PLAN DU SITE - Colonne 2 */}
          <div>
            <h3 className="text-xl font-bold mb-6"> </h3>
            <div className="space-y-3">
              <div className="space-y-2 pt-3">
                <h4 className="font-semibold text-blue-200 text-sm uppercase tracking-wide">
                  Gestion des bateaux
                </h4>
                <Link
                  to="/gestion-bateaux"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Gérer mes bateaux
                </Link>
                <Link
                  to="/gestion-reservations"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Gérer mes réservations
                </Link>
                <Link
                  to="/ajouter-bateau"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Ajouter un bateau
                </Link>
              </div>

              <div className="space-y-2 pt-3">
                <h4 className="font-semibold text-blue-200 text-sm uppercase tracking-wide">
                  Administration
                </h4>
                <Link
                  to="/admin"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Tableau de bord admin
                </Link>
              </div>

              <div className="space-y-2 pt-3">
                <h4 className="font-semibold text-blue-200 text-sm uppercase tracking-wide">
                  Légal
                </h4>
                <Link
                  to="/mentions-legales"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Mentions légales
                </Link>
                <Link
                  to="/politique-confidentialite"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • Politique de confidentialité
                </Link>
                <Link
                  to="/cgu-cgv"
                  className="block hover:text-blue-300 transition-colors text-sm"
                >
                  • CGU / CGV
                </Link>
              </div>
            </div>
          </div>

          {/* Réseaux sociaux et Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6">SUIVEZ-NOUS</h3>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61579074677515"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SailingLoc sur Facebook"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/salingloc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SailingLoc sur Instagram"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  title="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/sailingloc-equipe-0a1a5937a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SailingLoc sur LinkedIn"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>

              <div className="pt-4">
                <h4 className="font-semibold text-blue-200 text-sm uppercase tracking-wide mb-3">
                  Newsletter
                </h4>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    className="w-full px-3 py-2 bg-blue-800 border border-blue-700 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    S'abonner
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 mt-12 pt-8 text-center">
          <p className="text-blue-300 text-sm">
            © 2025 SailingLoc. Tous droits réservés. |
            <Link
              to="/mentions-legales"
              className="hover:text-white transition-colors ml-2"
            >
              Mentions légales
            </Link>{" "}
            |
            <Link
              to="/politique-confidentialite"
              className="hover:text-white transition-colors ml-2"
            >
              Politique de confidentialité
            </Link>
          </p>
          <p className="text-blue-400 text-xs mt-2">
            SailingLoc - Location de bateaux à La Rochelle et en Europe
          </p>
        </div>
      </div>
    </footer>
  );
}
