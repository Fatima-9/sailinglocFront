import React from "react";
import Header from "../components/header";
// import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Building2, Calendar, MapPin, Mail, Phone, Globe } from 'lucide-react';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Mentions légales</h2>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
              <Building2 className="h-6 w-6 mr-2" />
              1. Éditeur du site
            </h3>
            <p className="text-gray-700 mb-3">Le site SailingLoc est édité par :</p>
            <ul className="list-disc pl-6 text-gray-700 mb-3 space-y-1">
              <li>SailingLoc SAS</li>
              <li>Société par actions simplifiée au capital de [à compléter] €</li>
              <li>RCS La Rochelle B 923 456 789</li>
              <li>Siège social : 12 Rue du Port, 17000 La Rochelle, France</li>
              <li>Email : <a href="mailto:sailinglocequipe@gmail.com" className="text-orange-500 underline hover:text-orange-600 transition-colors">sailinglocequipe@gmail.com</a></li>
              <li>Directeur de la publication : [Nom du responsable légal ou fondateur]</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
              <Globe className="h-6 w-6 mr-2" />
              2. Hébergement
            </h3>
            <ul className="list-disc pl-6 text-gray-700 mb-3 space-y-1">
              <li>Le site est hébergé par :</li>
              <li><strong>Vercel Inc.</strong></li>
              <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
              <li><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 underline hover:text-orange-600 transition-colors">vercel.com</a></li>
              <li>Le prestataire assure un niveau de sécurité conforme aux exigences du RGPD.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
              <Building2 className="h-6 w-6 mr-2" />
              3. Conception et développement
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">Agence Pandawan</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Dénomination sociale :</strong> Pandawan</p>
                <p><strong>Date de création :</strong> 14/03/2014</p>
                <p><strong>Siège social :</strong> 25 Rue du Faubourg Saint-Antoine, 75011 Paris</p>
                <p><strong>Statut juridique :</strong> SAS</p>
              </div>
              <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100">
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong>Présentation :</strong> Pandawan est une agence digitale internationale fondée en 2014, 
                  spécialisée dans le développement web, l'intelligence artificielle, le UX design et le référencement performant. 
                  Experte dans la création de contenus digitaux, tant pour le web que pour le mobile, l'agence poursuit son expansion 
                  dans plusieurs grandes villes à travers le monde.
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">
                  <strong>Son ambition :</strong> offrir des services et produits de haute qualité, en valorisant l'identité de ses clients 
                  tout en y apportant une véritable valeur ajoutée à travers l'innovation et la créativité.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-blue-700">4. Propriété intellectuelle</h3>
            <p className="text-gray-700 leading-relaxed">
              L'ensemble des éléments du site (textes, images, graphismes, logo, vidéos, base de données, etc.) est protégé par le Code de la propriété intellectuelle.<br />
              Toute reproduction, représentation, modification ou extraction, totale ou partielle, sans autorisation écrite de SailingLoc est interdite.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-blue-700">5. Responsabilité</h3>
            <p className="text-gray-700 leading-relaxed">
              SailingLoc met tout en œuvre pour assurer l'exactitude des informations diffusées, mais ne saurait être tenue responsable des erreurs ou omissions.<br />
              SailingLoc décline toute responsabilité quant à l'utilisation du site ou aux dommages directs ou indirects pouvant en résulter.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-blue-700">6. Données personnelles</h3>
            <p className="text-gray-700 leading-relaxed">
              Pour consulter notre politique de confidentialité, veuillez vous rendre sur la page dédiée :<br />
              <Link to="/politique-confidentialite" className="text-orange-500 underline hover:text-orange-600 transition-colors inline-flex items-center mt-2">
                <span>👉 Politique de confidentialité</span>
              </Link>
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-blue-700">7. Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              Lors de votre navigation, des cookies peuvent être déposés sur votre terminal. Vous pouvez à tout moment gérer vos préférences via notre bandeau dédié.<br />
              Pour plus d'informations, consultez notre <Link to="/politique-confidentialite" className="text-orange-500 underline hover:text-orange-600 transition-colors">politique de confidentialité</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
              <Mail className="h-6 w-6 mr-2" />
              8. Contact
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question ou signalement, vous pouvez nous écrire à :<br />
              <a href="mailto:sailinglocequipe@gmail.com" className="text-orange-500 underline hover:text-orange-600 transition-colors inline-flex items-center mt-2">
                <Mail className="h-4 w-4 mr-1" />
                <span>📧 sailinglocequipe@gmail.com</span>
              </a>
            </p>
          </section>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
} 