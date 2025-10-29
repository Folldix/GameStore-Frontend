// frontend/src/components/Navigation.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition">
            GameStore
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="hover:text-blue-200 transition font-medium"
            >
              Store
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative hover:text-blue-200 transition font-medium flex items-center"
            >
              <span className="mr-2">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Section */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="hover:text-blue-200 transition font-medium"
                >
                  Profile
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="bg-purple-600 px-3 py-1 rounded hover:bg-purple-700 transition font-medium"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-blue-200">
                  {user?.username}
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;