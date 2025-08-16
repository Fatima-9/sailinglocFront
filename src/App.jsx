import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Boats from './pages/Boats';
import About from './pages/About';
import Contact from './pages/Contact';
import BoatDetail from './pages/BoatDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Favoris from './pages/Favoris';
import GestionBateaux from './pages/GestionBateaux';
import AdminDashboard from './pages/AdminDashboard';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import Profil from './pages/Profil';
import CGU_CGV from './pages/CGU_CGV';
import MentionsLegales from './pages/MentionsLegales';
import Reservation from './pages/Reservation';
import MesReservations from './pages/MesReservations';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bateaux" element={<Boats />} />
            <Route path="/bateaux/:id" element={<BoatDetail />} />
            <Route path="/reservation/:boatId" element={<Reservation />} />
            <Route path="/mes-reservations" element={<MesReservations />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/favoris" element={<Favoris />} />
            <Route path="/gestion-bateaux" element={<GestionBateaux />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/cgu-cgv" element={<CGU_CGV />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;