import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserFromToken, logout } from '../../utils/authHeader';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserFromToken();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-white text-xl font-bold">
            SatisfyMe
          </Link>

          <div className="flex items-center space-x-4">
            {!authenticated ? (
              <>
                <Link
                  to="/"
                  className={`text-white hover:text-blue-200 ${
                    location.pathname === '/' ? 'font-semibold' : ''
                  }`}
                >
                  Enquête
                </Link>
                <Link
                  to="/login"
                  className={`bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded ${
                    location.pathname === '/login' ? 'bg-blue-700' : ''
                  }`}
                >
                  Connexion Admin
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`text-white hover:text-blue-200 ${
                    location.pathname.includes('/admin') ? 'font-semibold' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <span className="text-blue-200">
                  Bonjour, {user?.username} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;