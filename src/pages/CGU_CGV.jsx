import React from "react";
import Header from "../components/header";
// import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function CGU_CGV() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Conditions Générales d’Utilisation (CGU) et de Vente (CGV)</h2>
          <p className="mb-4 text-gray-700 text-center">Dernière mise à jour : 01/04/2025</p>

          <section className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">1. Présentation de la plateforme</h3>
            <p className="text-gray-700">SailingLoc est une plateforme de mise en relation entre propriétaires de bateaux et particuliers souhaitant louer un voilier ou yacht en Europe. La société est basée à La Rochelle, sous le statut SAS (RCS La Rochelle B 923 456 789).</p>
          </section>

          <section className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">2. Acceptation des CGU/CGV</h3>
            <p className="text-gray-700">En accédant ou en utilisant le site SailingLoc, tout utilisateur reconnaît avoir lu, compris et accepté les présentes CGU/CGV sans réserve.</p>
          </section>

          <section className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">3. Obligations des parties</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-2">
              <li><strong>Propriétaires :</strong> doivent fournir des informations exactes sur leur bateau (entretien, assurance, équipements).</li>
              <li><strong>Locataires :</strong> s’engagent à utiliser les bateaux de manière responsable et à respecter les conditions de location.</li>
              <li><strong>SailingLoc :</strong> s’assure de la conformité juridique des contrats et du respect du RGPD.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">4. Réservation et Paiement</h3>
            <p className="text-gray-700">Les réservations sont effectuées directement via la plateforme, avec paiement sécurisé via Stripe ou PayPal. Des frais de service peuvent s’appliquer.</p>
          </section>

          <section className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">5. Droit de rétractation et annulation</h3>
            <p className="text-gray-700">Les conditions d’annulation sont définies dans chaque annonce. SailingLoc permet l’annulation selon les délais spécifiés par le propriétaire.</p>
          </section>

          <section className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">6. Données personnelles</h3>
            <p className="text-gray-700">
              Les données collectées (nom, email, numéro, localisation, etc.) sont utilisées dans le cadre de la mise en relation et sont traitées conformément au RGPD. Consultez notre {" "}
              <Link to="/politique-confidentialite" className="text-orange-500 underline">politique de confidentialité</Link>.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">7. Responsabilité</h3>
            <p className="text-gray-700">SailingLoc décline toute responsabilité en cas de litige entre les utilisateurs. Toutefois, une équipe de modération peut intervenir en cas de signalement.</p>
          </section>

          <section className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">8. Modification des CGU/CGV</h3>
            <p className="text-gray-700">SailingLoc se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront notifiés lors de la mise à jour.</p>
          </section>

          <section className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">9. Contact</h3>
            <p className="text-gray-700">Pour toute question, vous pouvez contacter l’équipe via : <a href="mailto:sailinglocequipe@gmail.com" className="text-orange-500 underline">sailinglocequipe@gmail.com</a>.</p>
          </section>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
} 