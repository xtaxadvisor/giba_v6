import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientPortal from '../../pages/client/ClientPortal'; // Adjusted the path to match the correct location
import Login from '../../pages/LoginPage'; // Adjusted the path to match the correct location
import NotFound from '../../components/shared/NotFoundPage';
import Home from '../../pages/Home';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/client" element={<ClientPortal />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
