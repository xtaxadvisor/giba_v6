import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t text-sm text-gray-500 py-4 px-6 text-center shadow-inner">
      <p>
        © {currentYear} XTaXAdvisors. All rights reserved.
      </p>
      <p className="mt-1">
        Built with ❤️ by Giba.
      </p>
    </footer>
  );
};