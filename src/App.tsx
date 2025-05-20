import React from 'react';
import { Providers } from './Providers'; // Ensure the file exists and matches this path
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <>
      {console.log("✅ App component is rendering")}
      <Providers>
        <AppRoutes />
      </Providers>
    </>
  );
};

export default App;