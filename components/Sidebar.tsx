
import React from 'react';
import type { View } from '../types';
import { NAVIGATION_ITEMS } from '../constants';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="w-64 bg-gradient-to-b from-indigo-600 to-purple-700 text-white flex flex-col shadow-lg">
      <div className="p-6 flex items-center space-x-3 border-b border-white/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
        <h1 className="text-xl font-bold">Journal FLE</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              activeView === item.view
                ? 'bg-white/20 text-white font-semibold shadow-md'
                : 'hover:bg-white/10'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/20 text-center text-sm text-gray-300">
        <p>&copy; 2024 Prof du FLE</p>
      </div>
    </div>
  );
};

export default Sidebar;
