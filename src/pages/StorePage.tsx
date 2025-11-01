// frontend/src/pages/StorePage.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../types';
import { gameService } from '../services/api';
import { useCart } from '../context/CartContext';

const StorePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  
  const { addToCart, isInCart } = useCart();

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
    addToCart(game);
  };

  // Extract unique genres from games
  const genres = Array.from(new Set(games.map(game => 
    typeof game.genre === 'string' ? game.genre : game.genre
  )));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-xl">Loading games...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Game Store</h1>

      {/* Genre Filter */}
      <div className="mb-6">
        <label htmlFor="genre" className="block text-gray-700 font-semibold mb-2">
          Filter by Genre:
        </label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Games Grid */}
      {games.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          <p className="text-xl">No games found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
            >
              <img
                src={game.coverImageUrl}
                alt={game.title}
                className="w-full h-64 object-cover"
              />
              
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 truncate">{game.title}</h2>
                
                <p className="text-gray-600 text-sm mb-2">{game.genre}</p>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {game.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ${game.price}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    to={`/game/${game.id}`}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition duration-200"
                  >
                    View Details
                  </Link>
                  
                  <button
                    onClick={() => handleAddToCart(game)}
                    disabled={isInCart(game.id)}
                    className={`px-4 py-2 rounded-lg transition duration-200 ${
                      isInCart(game.id)
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isInCart(game.id) ? 'In Cart' : 'Add'}
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

export default StorePage;