
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import UploadView from './components/UploadView';
import DashboardView from './components/DashboardView';
import SecureImageView from './components/SecureImageView';

const App: React.FC = () => {
  const [view, setView] = useState<'upload' | 'dashboard' | 'view'>('upload');
  const [viewId, setViewId] = useState<string | null>(null);

  // Simple hash-based router
  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/view/')) {
        const id = hash.replace('#/view/', '');
        setViewId(id);
        setView('view');
      } else if (hash === '#/dashboard') {
        setView('dashboard');
      } else {
        setView('upload');
      }
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Initial route

    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  const navigateTo = (newView: 'upload' | 'dashboard') => {
    window.location.hash = newView === 'upload' ? '/' : '#/' + newView;
  };

  if (view === 'view' && viewId) {
    return <SecureImageView imageId={viewId} />;
  }

  return (
    <div className="min-h-screen pb-20">
      <Navigation onNavigate={navigateTo} activeView={view} />
      
      <main>
        {view === 'upload' ? (
          <UploadView />
        ) : (
          <DashboardView />
        )}
      </main>

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default App;
