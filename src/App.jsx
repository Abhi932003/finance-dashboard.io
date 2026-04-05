import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { NotificationProvider } from './context/NotificationContext';

import DashboardHome from './pages/DashboardHome';

import TransactionsPage from './pages/TransactionsPage';

import InsightsPage from './pages/InsightsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const { activePage } = useDashboard();

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard': return <DashboardHome />;
      case 'Transactions': return <TransactionsPage />;
      case 'Insights': return <InsightsPage />;
      case 'Settings': return <SettingsPage />;
      case 'Profile': return <ProfilePage />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="page-wrapper">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <DashboardProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </DashboardProvider>
  );
}

export default App;
