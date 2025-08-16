import React from "react";
import Header from "../components/header";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Mail, Building2, Globe, Calendar, MapPin } from 'lucide-react';

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
    <Header />
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700 mb-4">Politique de confidentialité</h1>
            <p className="text-gray-600 text-lg">Dernière mise à jour : 01/01/2025</p>
      </header>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
              <Shield className="h-7 w-7 mr-3" />
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              La présente politique de confidentialité a pour but d'expliquer comment SailingLoc collecte, utilise, protège et partage les données personnelles de ses utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>
      </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
              <Eye className="h-7 w-7 mr-3" />
              2. Données collectées
            </h2>
            <p className="text-gray-700 mb-4 text-lg">Lors de l'utilisation de la plateforme SailingLoc, nous pouvons collecter les données suivantes :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Nom, prénom</li>
          <li>Adresse e-mail</li>
          <li>Numéro de téléphone</li>
          <li>Adresse IP et données de navigation</li>
              </ul>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Données de géolocalisation (si autorisées)</li>
          <li>Informations de paiement (via Stripe ou PayPal)</li>
                <li>Historique des réservations</li>
                <li>Préférences de navigation</li>
        </ul>
            </div>
      </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">3. Finalités de la collecte</h2>
            <p className="text-gray-700 mb-4 text-lg">Les données collectées ont pour objectif :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>La création et la gestion du compte utilisateur</li>
          <li>La mise en relation entre propriétaires et locataires</li>
          <li>Le traitement des paiements</li>
          <li>La gestion des réservations</li>
              </ul>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Le service client</li>
                <li>L'envoi de notifications ou emails (rappels, suggestions, sécurité)</li>
                <li>L'amélioration continue de nos services</li>
                <li>La personnalisation de l'expérience utilisateur</li>
        </ul>
            </div>
      </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">4. Consentement</h2>
            <p className="text-gray-700 mb-4 text-lg">Le consentement est obtenu explicitement via :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Case à cocher lors de la création de compte</li>
          <li>Bandeau cookie au premier accès au site</li>
          <li>Formulaires spécifiques pour la newsletter ou contact</li>
              <li>Paramètres de confidentialité dans le profil utilisateur</li>
        </ul>
      </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">5. Cookies</h2>
            <p className="text-gray-700 mb-4 text-lg">Le site utilise des cookies pour :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Analyser la fréquentation (Google Analytics)</li>
          <li>Optimiser les performances du site</li>
          <li>Mémoriser vos préférences de navigation</li>
              <li>Assurer la sécurité de votre session</li>
        </ul>
            <p className="text-gray-700 mt-4 text-lg">Vous pouvez configurer les cookies à tout moment via notre bandeau de gestion (outil : Axeptio, Cookiebot...)</p>
      </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">6. Durée de conservation</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Les données sont conservées pour une durée maximale de 3 ans après la dernière interaction. Les données liées aux paiements sont conservées selon les obligations fiscales et légales.
            </p>
      </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">7. Vos droits</h2>
            <p className="text-gray-700 mb-4 text-lg">Conformément au RGPD, vous disposez des droits suivants :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Droit d'accès à vos données</li>
          <li>Droit de rectification</li>
                <li>Droit à l'effacement ("droit à l'oubli")</li>
          <li>Droit à la portabilité</li>
              </ul>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Droit d'opposition et de retrait du consentement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit de réclamation auprès de la CNIL</li>
                <li>Droit à la notification des violations</li>
        </ul>
            </div>
            <p className="text-gray-700 mt-4 text-lg">Pour exercer vos droits, envoyez un e-mail à : <a href="mailto:sailinglocequipe@gmail.com" className="text-orange-500 underline hover:text-orange-600 transition-colors">sailinglocequipe@gmail.com</a></p>
      </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
              <Lock className="h-7 w-7 mr-3" />
              8. Sécurité des données
            </h2>
            <p className="text-gray-700 mb-4 text-lg">SailingLoc utilise les technologies suivantes pour assurer la sécurité des données :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Hachage des mots de passe via bcryptjs</li>
              <li>Token d'authentification sécurisés (JWT)</li>
          <li>Certificat SSL (HTTPS)</li>
          <li>Accès limité au personnel autorisé</li>
              <li>Chiffrement des données sensibles</li>
              <li>Audit de sécurité régulier</li>
        </ul>
      </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
              <Globe className="h-7 w-7 mr-3" />
              9. Hébergement
            </h2>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Vercel Inc.</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
              <p><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 underline hover:text-orange-600 transition-colors">vercel.com</a></p>
              <p><strong>Conformité :</strong> RGPD, SOC 2 Type II, ISO 27001</p>
              <p><strong>Sécurité :</strong> Infrastructure cloud sécurisée avec chiffrement des données en transit et au repos</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
              <Building2 className="h-7 w-7 mr-3" />
              10. Développement et maintenance
            </h2>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Agence Pandawan</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Dénomination sociale :</strong> Pandawan</p>
              <p><strong>Date de création :</strong> 14/03/2014</p>
              <p><strong>Siège social :</strong> 25 Rue du Faubourg Saint-Antoine, 75011 Paris</p>
              <p><strong>Statut juridique :</strong> SAS</p>
              <p><strong>Expertise :</strong> Développement web, IA, UX design, référencement</p>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Présentation :</strong> Pandawan est une agence digitale internationale spécialisée dans la création de contenus digitaux de haute qualité, 
                valorisant l'identité de ses clients à travers l'innovation et la créativité.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">11. Modifications</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Cette politique peut être modifiée à tout moment. Les utilisateurs seront informés des changements par notification sur le site ou par e-mail.
            </p>
      </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
              <Mail className="h-7 w-7 mr-3" />
              12. Contact
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
              contactez-nous à : <a href="mailto:sailinglocequipe@gmail.com" className="text-orange-500 underline hover:text-orange-600 transition-colors">sailinglocequipe@gmail.com</a>
            </p>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">
                <strong>Note :</strong> Cette politique est conforme au RGPD et aux dernières recommandations de la CNIL. 
                Pour plus d'informations sur vos droits, consultez le site de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700 transition-colors">CNIL</a>.
              </p>
            </div>
      </section>
        </div>
    </main>
  </div>
);
} 