
import React from 'react';

interface NavigationProps {
  onNavigate: (view: 'upload' | 'dashboard') => void;
  activeView: string;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate, activeView }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span className="font-bold text-xl tracking-tight">SnapGuard</span>
      </div>
      <div className="flex space-x-1 bg-white/5 p-1 rounded-full">
        <button
          onClick={() => onNavigate('upload')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeView === 'upload' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Upload
        </button>
        <button
          onClick={() => onNavigate('dashboard')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Tracking
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
