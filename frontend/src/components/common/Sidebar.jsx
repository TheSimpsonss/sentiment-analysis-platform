import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = () => {
  const { darkMode } = useTheme();
  
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/analysis/sentiment', label: 'Sentiment Analysis', icon: '😊' },
    { to: '/analysis/aspect', label: 'Aspect Analysis', icon: '🔍' },
    { to: '/analysis/demographic', label: 'Demographics', icon: '👥' },
    { to: '/analysis/influencer', label: 'Influencers', icon: '⭐' },
    { to: '/reports', label: 'Reports', icon: '📝' },
    { to: '/alerts', label: 'Alerts', icon: '🔔' },
    { to: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside className={`w-64 h-screen fixed left-0 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'} p-4`}>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg ${isActive 
                    ? (darkMode ? 'bg-blue-800' : 'bg-blue-500 text-white') 
                    : (darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200')}`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;