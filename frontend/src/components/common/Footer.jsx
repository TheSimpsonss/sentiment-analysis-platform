import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 px-6 bg-gray-100 text-gray-600 text-center">
      <p>© {new Date().getFullYear()} SentiTrack - Social Media Sentiment Analysis Platform</p>
    </footer>
  );
};

export default Footer;