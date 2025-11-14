// frontend/src/pages/WishlistPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLibrary } from '../context/LibraryContext';
import { WishlistItem } from '../types';
import { wishlistService } from '../services/api';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';

const WishlistPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { isGameOwned, refreshLibrary } = useLibrary();
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
    if (isGameOwned(item.gameId)) {
      alert('Ви вже маєте цю гру в бібліотеці!');
      return;
    }
    addToCart(item.game);
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8 page-transition" style={{ maxWidth: '1400px' }}>
        <div className="text-center">
          <div className="cyber-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto px-4 py-8 page-transition" style={{ maxWidth: '1400px' }}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={loadWishlist}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 page-transition">
      <style>{`
        .games-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        
        @media (max-width: 1024px) {
          .games-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .games-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      {/* Header */}
      <div className="mb-8" style={{margin: 10}}>
        <h1 className="text-3xl font-bold mb-4 gradient-text">My Wishlist</h1>
        <p className="text-gray-400">
          {wishlist.length} {wishlist.length === 1 ? 'game' : 'games'} on your wishlist
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12" style={{margin: 10}}>
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-6">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Browse Games
          </button>
        </div>
      ) : (
        <div className="games-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1.5rem' 
        }}>
          {wishlist.map((item) => (
            <div key={item.id} className="game-card-cyber glass-card hover-lift rounded-lg overflow-hidden" style={{margin: 10}}>
              <div className="image-zoom rounded-lg overflow-hidden" style={{ height: '280px', overflow: 'hidden' }}>
                <img
                  src={item.game.coverImage || item.game.coverImageUrl}
                  alt={item.game.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                  style={{ minHeight: '100%', minWidth: '100%' }}
                />
              </div>
              
              {/* Discount Badge */}
              {item.game.discountPrice && (
                <div className="discount-badge-shine absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-lg font-bold">
                  -{Math.round((1 - item.game.discountPrice / item.game.price) * 100)}%
                </div>
              )}

              <div className="p-5" style={{  margin: 20}}>
                 {/* Title */}
                <h2 className="text-xl font-bold mb-2 truncate text-white" style={{  padding: 5}}>
                  {item.game.title}
                </h2>
                
                {/* Genre Badge */}
                <div className="mb-3" style={{  padding: 5}}>
                  <span className="genre-tag text-xs">
                    {item.game.genre}
                  </span>
                </div>
                
                {/* Description */}
                {item.game.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 pd-5" style={{  padding: 5}}>
                    {item.game.description}
                  </p>
                )}
                
                {/* Rating (if available) */}
                {item.game.rating && (
                  <div className="flex gap-2 mb-3" style={{  padding: 5}}>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(item.game.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {item.game.rating}
                    </span>
                  </div>
                )}
                
                {/* Price */}
                <div className="flex justify-between mb-4" style={{  padding: 5}}>
                  {item.game.discountPrice ? (
                    <div className="flex gap-2">
                  <span className="text-2xl font-bold text-blue-600">                        
                        ${item.game.discountPrice}
                      </span>
                      <span className="text-gray-500 line-through text-sm" style={{ paddingLeft: 10}}>
                        ${item.game.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      ${item.game.price}
                    </span>
                  )}
                </div>

                {/* Added Date */}
                <div className="text-xs text-gray-500 mb-4" style={{  padding: 5}}>
                  Added {new Date(item.addedDate).toLocaleDateString()}
                </div>
                
                <div className="flex gap-2" style={{  padding: 5}}>
                  <button
                    onClick={() => navigate(`/game/${item.game.id}`)}
                    className="btn btn-primary flex-1"
                  >
                    View Details
                  </button>
                  
                  {isGameOwned(item.gameId) ? (
                    <button
                      disabled
                      className="btn btn-disabled flex-1"
                      style={{  float: 'right', marginRight: 20, marginBottom: 20}}
                      title="Ви вже маєте цю гру"
                    >
                      Вже в бібліотеці
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isInCart(item.game.id)}
                      className={`btn ${isInCart(item.game.id) ? 'btn-disabled' : 'btn-success'}`}
                      style={{  float: 'right', marginRight: 20, marginBottom: 20}}
                      title={isInCart(item.game.id) ? 'Already in cart' : 'Add to cart'}
                    >
                      {isInCart(item.game.id) ? 'In Cart' : 'Add'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleRemove(item.game.id)}
                    className="btn btn-danger"
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