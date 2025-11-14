// frontend/src/pages/StorePage.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../types';
import { gameService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart } from 'lucide-react';

const StorePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  
  const { addToCart, isInCart } = useCart();
  const { isGameOwned } = useLibrary();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadGames();
  }, [selectedGenre]);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await gameService.getAll(selectedGenre || undefined);
      setGames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (game: Game) => {
    if (isGameOwned(game.id)) {
      alert('Ви вже маєте цю гру в бібліотеці!');
      return;
    }
    addToCart(game);
  };

  // Extract unique genres from games
  const genres = Array.from(new Set(games.map(game => 
    typeof game.genre === 'string' ? game.genre : game.genre
  )));

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
          onClick={loadGames}
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
        <h1 className="text-3xl font-bold mb-4 gradient-text">Discover and purchase the latest games</h1>
      </div>

      {/* Genre Filter */}
      <div className="mb-8" style={{margin: 10}}>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedGenre('')}
            className={`category-chip ${selectedGenre === '' ? 'active' : ''}`}
          >
            All Genres
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`category-chip ${selectedGenre === genre ? 'active' : ''}`}
              style={{  marginLeft: 5}}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      {games.length === 0 ? (
        <div className="text-center text-gray-600 py-12" style={{margin: 10}}>
          <p className="text-xl">No games found</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1.5rem' 
        }}>
          {games.map((game) => (
            <div key={game.id} className="game-card-cyber glass-card hover-lift rounded-lg overflow-hidden" style={{margin: 10}}>
              <div className="image-zoom rounded-lg overflow-hidden" style={{ height: '280px', overflow: 'hidden' }}>
                <img
                  src={game.coverImage}
                  alt={game.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                  style={{ minHeight: '100%', minWidth: '100%' }}
                />
              </div>
              
              {/* Discount Badge */}
              {game.discountPrice && (
                <div className="discount-badge-shine absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-lg font-bold">
                  -{Math.round((1 - game.discountPrice / game.price) * 100)}%
                </div>
              )}

              <div className="p-5" style={{  margin: 20}}>
                 {/* Title */}
                <h2 className="text-xl font-bold mb-2 truncate text-white" style={{  padding: 5}}>
                  {game.title}
                </h2>
                
                {/* Genre Badge */}
                <div className="mb-3" style={{  padding: 5}}>
                  <span className="genre-tag text-xs">
                    {game.genre}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 pd-5" style={{  padding: 5}}>
                  {game.description}
                </p>
                
                {/* Rating (if available) */}
                {game.rating && (
                  <div className="flex gap-2 mb-3" style={{  padding: 5}}>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(game.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {game.rating}
                    </span>
                  </div>
                )}
                
                {/* Price */}
                <div className="flex justify-between mb-4" style={{  padding: 5}}>
                  {game.discountPrice ? (
                    <div className="flex gap-2">
                  <span className="text-2xl font-bold text-blue-600">                        
                        ${game.discountPrice}
                      </span>
                      <span className="text-gray-500 line-through text-sm" style={{ paddingLeft: 10}}>
                        ${game.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      ${game.price}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2" style={{  padding: 5}}>
                  <Link
                    to={`/game/${game.id}`}
                    className="btn btn-primary flex-1"
                  >
                    View Details
                  </Link>
                  
                  {isGameOwned(game.id) ? (
                    <button
                      disabled
                      className="btn btn-disabled bg-gray-600 text-gray-400 cursor-not-allowed"
                      style={{  float: 'right', marginRight: 20, marginBottom: 20}}
                    >
                      In Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(game)}
                      disabled={isInCart(game.id)}
                      className={`btn ${isInCart(game.id) ? 'btn-disabled' : 'btn-success'}`}
                      style={{  float: 'right', marginRight: 20, marginBottom: 20}}
                    >
                      {isInCart(game.id) ? 'In Cart' : 'Add'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StorePage;