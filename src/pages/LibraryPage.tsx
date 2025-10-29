// frontend/src/pages/LibraryPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Library } from '../types';
import { libraryService } from '../services/api';
import { Download, Play, Trash2, Clock } from 'lucide-react';

const LibraryPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [library, setLibrary] = useState<Library | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'playtime'>('date');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadLibrary();
  }, [isAuthenticated, navigate]);

  const loadLibrary = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await libraryService.getLibrary();
      setLibrary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load library');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleInstall = async (gameId: string) => {
    try {
      await libraryService.toggleInstall(gameId);
      await loadLibrary();
    } catch (err) {
      alert('Failed to toggle install status');
    }
  };

  const formatPlayTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getSortedGames = () => {
    if (!library) return [];
    
    const games = [...library.games];
    
    switch (sortBy) {
      case 'name':
        return games.sort((a, b) => a.game.title.localeCompare(b.game.title));
      case 'playtime':
        return games.sort((a, b) => b.playTime - a.playTime);
      case 'date':
      default:
        return games.sort((a, b) => 
          new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
        );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-xl">Loading library...</div>
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

  const sortedGames = getSortedGames();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">My Library</h1>
        <p className="text-gray-600">
          {sortedGames.length} {sortedGames.length === 1 ? 'game' : 'games'} in your library
        </p>
      </div>

      {/* Sort Controls */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-gray-700 font-semibold">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date">Purchase Date</option>
          <option value="name">Name</option>
          <option value="playtime">Play Time</option>
        </select>
      </div>

      {sortedGames.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-6">Your library is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Browse Games
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGames.map((libraryGame) => (
            <div
              key={libraryGame.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
            >
              <img
                src={libraryGame.game.coverImage}
                alt={libraryGame.game.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{libraryGame.game.title}</h2>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Play Time: {formatPlayTime(libraryGame.playTime)}</span>
                  </div>
                  
                  {libraryGame.lastPlayedDate && (
                    <div>
                      Last played: {new Date(libraryGame.lastPlayedDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div>
                    Purchased: {new Date(libraryGame.purchaseDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/game/${libraryGame.game.id}`)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Details
                  </button>
                  
                  <button
                    onClick={() => handleToggleInstall(libraryGame.game.id)}
                    className={`px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2 ${
                      libraryGame.isInstalled
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {libraryGame.isInstalled ? (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Uninstall
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Install
                      </>
                    )}
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

export default LibraryPage;