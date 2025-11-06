// frontend/src/pages/GameDetailPage.tsx - ОНОВЛЕНА ВЕРСІЯ

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Game, Review } from '../types';
import { gameService, reviewService, wishlistService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Heart, Star, Calendar, Download } from 'lucide-react';
import SystemRequirements from '../components/SystemRequirements';
import ReviewsList from '../components/ReviewsList';
import ReviewForm from '../components/ReviewForm';

const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (id) {
      loadGame(id);
      loadReviews(id);
      checkWishlistStatus(id);
    }
  }, [id]);

  const loadGame = async (gameId: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await gameService.getById(gameId);
      setGame(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (gameId: string) => {
    try {
      const data = await reviewService.getGameReviews(gameId);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews');
    }
  };

  const checkWishlistStatus = async (gameId: string) => {
    if (!isAuthenticated) return;
    
    try {
      const wishlist = await wishlistService.getWishlist();
      setIsInWishlist(wishlist.some(item => item.gameId === gameId));
    } catch (err) {
      console.error('Failed to check wishlist status');
    }
  };

  const handleAddToCart = () => {
    if (game) {
      addToCart(game);
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!game) return;

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(game.id);
        setIsInWishlist(false);
      } else {
        await wishlistService.addToWishlist(game.id);
        setIsInWishlist(true);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    if (id) {
      loadReviews(id);
      loadGame(id); // Reload to get updated rating
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-xl">Loading game details...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Game not found'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Store
        </button>
      </div>
    );
  }

  const releaseDate = new Date(game.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const discountPercentage = game.discountPrice
    ? Math.round((1 - game.discountPrice / game.price) * 100)
    : 0;

  const finalPrice = game.discountPrice || game.price;

  return (
    <div className="glass-card p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary btn-glow"
          >
            ← Back to Store
          </button>

          {showAddedMessage && (
            <div className="mb-4 bg-green-600 text-white px-4 py-3 rounded-lg">
              Game added to cart!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Image */}
            <div>
              <img
                src={game.coverImage}
                alt={game.title}
                className="w-full rounded-lg shadow-2xl"
              />
              
              {/* Screenshots */}
              {game.screenshots && game.screenshots.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {game.screenshots.map((screenshot, index) => (
                    <img
                      key={index}
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{game.title}</h1>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-blue-600 px-3 py-1 rounded-full">
                      {game.genre}
                    </span>
                    <span>{game.ageRating}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  className="btn btn-danger btn-glow"
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    className={`w-8 h-8 ${
                      isInWishlist ? 'fill-red-500 text-red-500' : 'text-white'
                    }`}
                  />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(game.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-500'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg">
                  {game.rating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>

              {/* Developer & Publisher */}
              <div className="mb-4 space-y-1 text-gray-300">
                <p>
                  <span className="font-semibold">Developer:</span> {game.developer}
                </p>
                <p>
                  <span className="font-semibold">Publisher:</span> {game.publisher}
                </p>
              </div>

              {/* Release Date */}
              <div className="flex items-center gap-2 mb-4 text-gray-300">
                <Calendar className="w-5 h-5" />
                <span>Released: {releaseDate}</span>
              </div>

              {/* Download Size */}
              <div className="flex items-center gap-2 mb-6 text-gray-300">
                <Download className="w-5 h-5" />
                <span>Size: {(Number(game.downloadSize) / 1_000_000_000).toFixed(2)} GB</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {game.discountPrice ? (
                  <div className="flex items-center gap-4">
                    <span className="bg-red-600 px-3 py-1 rounded text-xl font-bold">
                      -{discountPercentage}%
                    </span>
                    <div>
                      <div className="text-gray-400 line-through text-lg">
                        ${game.price}
                      </div>
                      <div className="text-4xl font-bold text-green-400">
                        ${finalPrice}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-4xl font-bold">${finalPrice}</div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart(game.id)}
                  className={`flex-1 py-4 px-6 rounded-lg text-lg font-semibold transition duration-200 ${
                    isInCart(game.id)
                      ? 'btn btn-disabled'
                      : 'btn btn-success text-center btn-glow bg-green-600'
                  }`}
                >
                  {isInCart(game.id) ? 'Already in Cart' : 'Add to Cart'}
                </button>

                {isInCart(game.id) && (
                  <button
                    onClick={() => navigate('/cart')}
                    className="btn btn-primary"
                  >
                    Go to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About This Game</h2>
              <p className="text-gray-700 leading-relaxed">{game.description}</p>
            </div>

            {/* System Requirements */}
            {game.systemRequirements && (
              <SystemRequirements requirements={game.systemRequirements} />
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              
              {isAuthenticated && (
                <div className="mb-8">
                  <ReviewForm gameId={game.id} onReviewSubmitted={handleReviewSubmitted} />
                </div>
              )}
              
              <ReviewsList reviews={reviews} onReviewDeleted={handleReviewSubmitted} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Game Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-600">Genre:</span>
                  <p className="text-gray-800">{game.genre}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Developer:</span>
                  <p className="text-gray-800">{game.developer}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Publisher:</span>
                  <p className="text-gray-800">{game.publisher}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Release Date:</span>
                  <p className="text-gray-800">{releaseDate}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Age Rating:</span>
                  <p className="text-gray-800">{game.ageRating}</p>
                </div>
              </div>
            </div>

            {/* Video Trailer */}
            {game.videoTrailer && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Trailer</h3>
                <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                  <a
                    href={game.videoTrailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Watch Trailer
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;