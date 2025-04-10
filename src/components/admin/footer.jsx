import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t py-4">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Shirva Census Admin Portal. All rights reserved.</p>
        <p className="mt-1">Version 1.0.0</p>
      </div>
    </footer>
  );
};

export default Footer;
