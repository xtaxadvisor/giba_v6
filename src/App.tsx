import React from 'react';
import { BrowserRouter } from 'react-router-dom';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

export { Providers };