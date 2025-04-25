import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <header className={`py-4 px-6 flex justify-between items-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} border-b`}>
      <div className="flex items-center">
        <Link to="/dashboard" className="text-2xl font-bold">SentiTrack</Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleDarkMode} 
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
        
        {currentUser && (
          <div className="flex items-center space-x-2">
            <span className="hidden md:inline">{currentUser.name || currentUser.email}</span>
            <div className="relative group">
              <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                {(currentUser.name || currentUser.email || '').charAt(0).toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link to="/settings/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile Settings</Link>
                <Link to="/settings/brand" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Brand Settings</Link>
                <button 
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;