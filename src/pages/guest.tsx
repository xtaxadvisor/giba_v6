

import React from 'react';

const Guest = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">👤 Welcome to the Guest Portal</h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-xl">
        This is a basic guest view. From here, guests can explore limited features of the platform,
        access public content, and get an overview of available services.
      </p>
      <div className="space-x-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          View Services
        </button>
        <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Guest;