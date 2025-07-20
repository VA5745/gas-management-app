import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import EquipmentsPage from './pages/EquipmentsPage';
import MaintenancePage from './pages/MaintenancePage';
import PlanningPage from './pages/PlanningPage';
import NotificationPage from './pages/NotificationPage';
import StockPage from './pages/StockPage';
import ClientPortalPage from './pages/ClientPortalPage';
import AnalyticsPage from './pages/AnalyticsPage';
import IoTAutomationPage from './pages/IoTAutomationPage';
import TrainingPage from './pages/TrainingPage';
import AdminFinancePage from './pages/AdminFinancePage';
import ApiIntegrationPage from './pages/ApiIntegrationPage';
import MobileAppPage from './pages/MobileAppPage';

const Navigation = () => (
  <nav className="bg-gray-100 p-4 space-x-4 text-sm">
    <Link to="/equipments">Équipements</Link>
    <Link to="/maintenance">Maintenance</Link>
    <Link to="/planning">Planning</Link>
    <Link to="/notifications">Notifications</Link>
    <Link to="/stock">Stock</Link>
    <Link to="/client">Client</Link>
    <Link to="/analytics">Rapports</Link>
    <Link to="/iot">IoT</Link>
    <Link to="/training">Formation</Link>
    <Link to="/admin">Admin</Link>
    <Link to="/api">API</Link>
    <Link to="/mobile">Mobile</Link>
  </nav>
);

const App = () => {
  return (
    <Router>
      <Navigation />
      <div className="p-6">
        <Routes>
          <Route path="/equipments" element={<EquipmentsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/client" element={<ClientPortalPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/iot" element={<IoTAutomationPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/admin" element={<AdminFinancePage />} />
          <Route path="/api" element={<ApiIntegrationPage />} />
          <Route path="/mobile" element={<MobileAppPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
