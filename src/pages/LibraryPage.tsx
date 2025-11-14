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
          new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
        );
    }
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
          onClick={loadLibrary}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const sortedGames = getSortedGames();

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
      <div className="mb-8" style={{margin: 10}}>
        <h1 className="text-3xl font-bold mb-4 gradient-text">My Library</h1>
        <p className="text-gray-400">
          {sortedGames.length} {sortedGames.length === 1 ? 'game' : 'games'} in your library
        </p>
      </div>

      {/* Sort Controls */}
      <div className="mb-6 flex items-center gap-4" style={{margin: 10}}>
        <label className="text-white font-semibold">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date">Purchase Date</option>
          <option value="name">Name</option>
          <option value="playtime">Play Time</option>
        </select>
      </div>

      {sortedGames.length === 0 ? (
        <div className="text-center py-12" style={{margin: 10}}>
          <p className="text-xl text-gray-400 mb-6">Your library is empty</p>
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
          {sortedGames.map((libraryGame) => (
            <div
              key={libraryGame.id}
              className="game-card-cyber glass-card hover-lift rounded-lg overflow-hidden"
              style={{margin: 10}}
            >
              <div className="image-zoom rounded-lg overflow-hidden" style={{ height: '280px', overflow: 'hidden' }}>
                <img
                  src={libraryGame.game.coverImage || libraryGame.game.coverImageUrl || '/placeholder-game.jpg'}
                  alt={libraryGame.game.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                  style={{ minHeight: '100%', minWidth: '100%' }}
                />
              </div>
              
              <div className="p-5" style={{  margin: 20}}>
                <h2 className="text-xl font-bold mb-2 truncate text-white" style={{  padding: 5}}>{libraryGame.game.title}</h2>
                
                <div className="mb-3" style={{  padding: 5}}>
                  <span className="genre-tag text-xs">
                    {libraryGame.game.genre}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4 text-sm text-gray-400" style={{  padding: 5}}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Play Time: {formatPlayTime(libraryGame.playTime)}</span>
                  </div>
                  
                  {libraryGame.lastPlayedAt && (
                    <div>
                      Last played: {new Date(libraryGame.lastPlayedAt).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div>
                    Purchased: {new Date(libraryGame.purchasedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2" style={{  padding: 5}}>
                  <button
                    onClick={() => navigate(`/game/${libraryGame.game.id}`)}
                    className="flex-1 btn btn-primary"
                  >
                    <Play className="w-4 h-4 inline mr-2" />
                    Details
                  </button>
                  
                  <button
                    onClick={() => handleToggleInstall(libraryGame.game.id)}
                    className={`btn ${
                      libraryGame.isInstalled
                        ? 'btn-danger'
                        : 'btn-success'
                    }`}
                  >
                    {libraryGame.isInstalled ? (
                      <>
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        Uninstall
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 inline mr-2" />
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