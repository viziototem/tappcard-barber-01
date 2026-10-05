/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicCard } from './components/public/PublicCard';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainRouter: React.FC = () => {
  const { currentView, setCurrentView, isAdminLoggedIn } = useApp();

  // Listen to initial URL pathname and popstate events
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin/login')) {
        setCurrentView('admin-login');
      } else if (path.startsWith('/admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('public');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, [setCurrentView]);

  // Sync state changes with URL history
  useEffect(() => {
    const currentPath = window.location.pathname;
    let targetPath = '/';
    if (currentView === 'admin-login') {
      targetPath = '/admin/login';
    } else if (currentView === 'admin') {
      targetPath = '/admin';
    }

    if (currentPath !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, [currentView]);

  if (currentView === 'admin-login') {
    return <AdminLogin />;
  }

  if (currentView === 'admin') {
    return isAdminLoggedIn ? <AdminDashboard /> : <AdminLogin />;
  }

  return <PublicCard />;
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
