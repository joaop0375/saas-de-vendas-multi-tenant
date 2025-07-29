import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Sales } from './components/Sales';
import { Users } from './components/Users';
import { Blog } from './components/Blog';
import { Chat } from './components/Chat';
import { Profile } from './components/Profile';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  console.log('🏠 App render - State:', { 
    user: user?.name, 
    isAuthenticated, 
    loading,
    userRole: user?.role 
  });

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('⏳ Showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando sistema...</p>
          <p className="text-gray-500 text-sm mt-2">Verificando autenticação</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('❌ User not authenticated or no user data, showing login');
    return <Login />;
  }

  console.log('✅ User authenticated, showing main app for:', user.name);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'sales': return <Sales />;
      case 'users': return <Users />;
      case 'blog': return <Blog />;
      case 'chat': return <Chat />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;