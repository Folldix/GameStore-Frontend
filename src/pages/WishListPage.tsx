// frontend/src/pages/WishlistPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { WishlistItem } from '../types';
import { wishlistService } from '../services/api';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

const WishlistPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [isAuthenticated, navigate]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (gameId: string) => {
    try {
      await wishlistService.removeFromWishlist(gameId);
      await loadWishlist();
    } catch (err) {
      alert('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart(item.game);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-xl">Loading wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
        <div>
          <h1 className="text-4xl font-bold">My Wishlist</h1>
          <p className="text-gray-600 mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'game' : 'games'} on your wishlist
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-6">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Browse Games
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
            >
              <div className="relative">
                <img
                  src={item.game.coverImage}
                  alt={item.game.title}
                  className="w-full h-64 object-cover"
                />
                {item.game.discountPrice && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                    -{Math.round((1 - item.game.discountPrice / item.game.price) * 100)}%
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 truncate">{item.game.title}</h2>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">{item.game.genre}</p>
                  {item.game.discountPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        ${item.game.discountPrice}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ${item.game.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      ${item.game.price}
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Added {new Date(item.addedDate).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/game/${item.game.id}`)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    View
                  </button>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={isInCart(item.game.id)}
                    className={`px-4 py-2 rounded-lg transition duration-200 ${
                      isInCart(item.game.id)
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    title={isInCart(item.game.id) ? 'Already in cart' : 'Add to cart'}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleRemove(item.game.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;