// frontend/src/components/Navigation.tsx - ОНОВЛЕНА ВЕРСІЯ

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, Library, User, LogOut, Home } from 'lucide-react';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold hover:text-blue-200 transition flex items-center gap-2"
          >
            <Home className="w-6 h-6" />
            GameStore
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="hover:text-blue-200 transition font-medium flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Store
            </Link>

            {/* Authenticated User Links */}
            {isAuthenticated && (
              <>
                <Link
                  to="/library"
                  className="hover:text-blue-200 transition font-medium flex items-center gap-2"
                >
                  <Library className="w-5 h-5" />
                  Library
                </Link>

                <Link
                  to="/wishlist"
                  className="hover:text-blue-200 transition font-medium flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                </Link>
              </>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative hover:text-blue-200 transition font-medium flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="hover:text-blue-200 transition font-medium flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  {user?.username}
                </Link>

                {user?.userType === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="bg-purple-600 px-3 py-1 rounded hover:bg-purple-700 transition font-medium"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="hover:text-blue-200 transition font-medium flex items-center gap-2"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;