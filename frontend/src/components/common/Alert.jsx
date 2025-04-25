import React, { useEffect, useState } from 'react';

const Alert = ({ type = 'info', message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  if (!visible) return null;
  
  const typeStyles = {
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300',
  };
  
  return (
    <div className={`p-4 rounded border ${typeStyles[type]} flex justify-between items-center`}>
      <div>{message}</div>
      <button 
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
  );
};

export default Alert;