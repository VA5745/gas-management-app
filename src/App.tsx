import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Gas Management App</h1>
          <p className="text-sm">SAAS - Safety équipement manager</p>
        </header>
        
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Ajoute tes autres routes ici */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Composant de page d'accueil temporaire
const HomePage: React.FC = () => {
  return (
    <div className="text-center py-8">
      <h2 className="text-3xl font-semibold mb-4">Bienvenue</h2>
      <p className="text-gray-600">
        Application de gestion d'équipements de sécurité
      </p>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h3 className="text-xl font-medium mb-2">Fonctionnalités disponibles :</h3>
        <ul className="text-left space-y-2">
          <li>• Gestion des équipements</li>
          <li>• QR Code Scanner</li>
          <li>• Génération de rapports PDF</li>
          <li>• Cartographie (Leaflet)</li>
          <li>• Graphiques (Recharts)</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
