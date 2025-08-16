import React from 'react';
import { Ship, Shield, CreditCard, Users, MapPin, Clock } from 'lucide-react';
import AproposImg from '../../assets/apropos.png';
import { Link } from 'react-router-dom';

export default function About() {
  const pillars = [
    {
      icon: Ship,
      title: 'Large choix de bateaux',
      description: 'Une sélection rigoureuse de bateaux entretenus et vérifiés pour votre sécurité et votre confort.'
    },
    {
      icon: Clock,
      title: 'Réservation facile et rapide',
      description: 'Réservez en quelques clics avec notre système de réservation en ligne simple et intuitif.'
    },
    {
      icon: Shield,
      title: 'Paiements sécurisés et service fiable',
      description: 'Transactions 100% sécurisées et équipe disponible 7j/7 pour vous accompagner.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1600)',
            opacity: 0.3
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            À propos
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Une question ? Écrivez-nous, on vous répond en et si bien !
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="bg-blue-900 text-white p-8 rounded-2xl">
                <h2 className="text-3xl font-bold mb-6">À PROPOS</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-gray-800)', marginBottom: '1.5rem' }}>
                  SailingLoc est une start-up innovante fondée par M. Voisin, spécialisée dans la mise en relation pour la location de voiliers et de bateaux à moteur. Basée à La Rochelle (Charente-Maritime), SailingLoc propose une plateforme collaborative, sécurisée et centrée sur l’expérience utilisateur.<br /><br />
                  Notre service s’adresse aussi bien aux passionnés de navigation qu’aux vacanciers occasionnels, en facilitant la location de bateaux auprès de particuliers ou de professionnels partout en Europe. Que ce soit pour une sortie en mer, une croisière en famille, entre amis ou en couple, SailingLoc vous invite à vivre des aventures maritimes authentiques et inoubliables.
                </p>
                <h2 className="text-orange-500 text-[1.3rem] mb-4 font-bold">Informations légales</h2>
                <ul style={{ fontSize: '1.08rem', color: 'var(--color-gray-800)', listStyle: 'none', padding: 0, lineHeight: 1.8 }}>
                  <li><b>Dénomination sociale</b> : SailingLoc</li>
                  <li><b>Date de création</b> : 15/03/2024</li>
                  <li><b>Siège social</b> : 12 Quai Louis Durand, 17000 La Rochelle</li>
                  <li><b>Statut juridique</b> : Société par Actions Simplifiée (SAS)</li>
                  <li><b>Capital social</b> : 15 000 €</li>
                  <li><b>Numéro RCS</b> : LA ROCHELLE B 923 456 789</li>
                  <li><b>SIREN</b> : 923 456 789</li>
                  <li><b>SIRET</b> : 923 456 789 00014</li>
                  <li><b>Code APE/NAF</b> : 7990Z – Services de réservation et activités connexes</li>
                  <li><b>TVA intracommunautaire</b> : FR42923456789</li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <img
                src={AproposImg}
                alt="À propos SailingLoc"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Text */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            Notre <strong>mission</strong> rendre la navigation <strong>accessible</strong>, <strong>simple</strong> et <strong>sécurisée</strong> 
            pour tous les passionnés de mer.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nos trois piliers
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-600 transition-colors">
                  <pillar.icon className="h-10 w-10 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à naviguer avec nous ?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Découvrez notre sélection de bateaux et réservez votre prochaine aventure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/bateaux" className="bg-white text-blue-600 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors text-center">
              Voir les bateaux
            </Link>
            <Link to="/contact" className="bg-orange-500 text-white px-8 py-4 rounded-full font-medium hover:bg-orange-600 transition-colors text-center">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}