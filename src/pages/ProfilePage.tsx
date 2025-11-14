// frontend/src/pages/ProfilePage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { Order, User } from '../types';
import { orderService, authService } from '../services/api';
import { Wallet, Calendar, Gamepad2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user: contextUser, isAuthenticated, logout } = useAuth();
  const { library } = useLibrary();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(contextUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadUserData();
    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadUserData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      // Оновити дані в localStorage
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch (err) {
      console.error('Failed to load user data:', err);
      // Якщо не вдалося завантажити, використовуємо дані з контексту
      setUser(contextUser);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8 page-transition" style={{ maxWidth: '1400px' }}>
        <div className="text-center">
          <div className="cyber-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 page-transition">
      <style>{`
        .order-items-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        
        @media (max-width: 1024px) {
          .order-items-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .order-items-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        {/* User Info */}
        <div className="glass-card rounded-lg p-6 mb-8" style={{margin: 10}}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4 gradient-text">My Profile</h1>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold text-white">Username:</span> <span className="text-gray-400">{user.username}</span>
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold text-white">Email:</span> <span className="text-gray-400">{user.email}</span>
              </p>
              <p className="text-gray-300 mb-4">
                <span className="font-semibold text-white">Role:</span>{' '}
                <span
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    user.role === 'ADMIN' || user.userType === 'ADMIN'
                      ? 'bg-purple-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {user.role || user.userType || 'USER'}
                </span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="glass-card rounded-lg p-6 mb-8" style={{margin: 10}}>
          <h2 className="text-2xl font-bold mb-6 gradient-text">Account Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 hover-lift">
              <div className="flex gap-4 mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Balance</p>
                  <p className="text-3xl font-bold text-white">
                    ${(user.balance || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Created Date */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 hover-lift">
              <div className="flex gap-4 mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Account Created</p>
                  <p className="text-lg font-bold text-white">
                    {user.createdAt || user.registrationDate
                      ? new Date(user.createdAt || user.registrationDate || '').toLocaleDateString('uk-UA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Purchased Games Count */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 hover-lift">
              <div className="flex gap-4 mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Purchased Games</p>
                  <p className="text-3xl font-bold text-white">
                    {library?.games?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="glass-card rounded-lg p-6" style={{margin: 10}}>
          <h2 className="text-2xl font-bold mb-6 gradient-text">Order History</h2>

          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12" style={{margin: 10}}>
              <p className="text-xl text-gray-400 mb-6">You haven't placed any orders yet</p>
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="glass-card rounded-lg p-4 hover-lift"
                  style={{margin: 10}}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Order ID: <span className="font-mono text-white">{order.id.slice(0, 8)}</span>
                      </p>
                      <p className="text-sm text-gray-400">
                        Date:{' '}
                        <span className="text-white">
                          {new Date(order.orderedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-400">
                        ${typeof order.totalAmount === 'string' ? order.totalAmount : Number(order.totalAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold text-white mb-3">Items:</p>
                    {order.items && order.items.length > 0 ? (
                      <div className="order-items-grid" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '1.5rem' 
                      }}>
                        {order.items.map((item) => {
                          if (!item.game) {
                            console.error('Missing game data for item:', item);
                            return (
                              <div key={item.id} className="bg-yellow-900 bg-opacity-50 p-3 rounded text-yellow-300">
                                Game data not available (ID: {item.gameId})
                              </div>
                            );
                          }
                          return (
                            <div
                              key={item.id}
                              className="game-card-cyber glass-card hover-lift rounded-lg overflow-hidden"
                              style={{margin: 10}}
                            >
                              <div className="image-zoom rounded-lg overflow-hidden" style={{ height: '280px', overflow: 'hidden' }}>
                                <img
                                  src={item.game.coverImageUrl || item.game.coverImage || '/placeholder-game.jpg'}
                                  alt={item.game.title}
                                  loading="lazy"
                                  className="w-full h-full object-cover object-top"
                                  style={{ minHeight: '100%', minWidth: '100%' }}
                                />
                              </div>
                              <div className="p-5" style={{  margin: 20}}>
                                <h3 className="text-xl font-bold mb-2 truncate text-white" style={{  padding: 5}}>{item.game.title}</h3>
                                <div className="mb-3" style={{  padding: 5}}>
                                  <span className="genre-tag text-xs">
                                    {item.game.genre}
                                  </span>
                                </div>
                                {item.game.description && (
                                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 pd-5" style={{  padding: 5}}>
                                    {item.game.description}
                                  </p>
                                )}
                                <div className="flex justify-between mb-4" style={{  padding: 5}}>
                                  <span className="text-2xl font-bold text-blue-600">
                                    ${typeof item.price === 'string' ? item.price : Number(item.price).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400">No items in this order</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;