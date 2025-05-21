import React, { useEffect } from 'react';
import { Providers } from './Providers'; // Ensure the file exists and matches this path
import AppRoutes from './routes/AppRoutes';

const App = () => {
  useEffect(() => {
    console.log("✅ App component is rendering");
  }, []);

  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
};

export default App;Providers