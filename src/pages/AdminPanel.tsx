// frontend/src/pages/AdminPanel.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/api';
import { adminService } from '../services/api';
import { Game, User, AccountStatus } from '../types';
import { Trash2, Edit2, Plus, Search, Ban, Save, X } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'games' | 'users'>('games');
  
  // Games state
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [showAddGame, setShowAddGame] = useState(false);
  const [gameForm, setGameForm] = useState<Partial<Game>>({});
  
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [banEmail, setBanEmail] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    
    if (activeTab === 'games') {
      loadGames();
    } else {
      loadUsers();
    }
  }, [isAuthenticated, isAdmin, activeTab, navigate]);

  const loadGames = async () => {
    setGamesLoading(true);
    setError('');
    try {
      const data = await gameService.getAll();
      // Transform releasedAt to releaseDate for consistency
      const transformedGames = data.map((game: any) => ({
        ...game,
        releaseDate: game.releaseDate || game.releasedAt,
      }));
      setGames(transformedGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setGamesLoading(false);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    setError('');
    try {
      // If search is empty, load all users; otherwise search
      const data = await adminService.searchUsers(userSearch.trim() || undefined);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleSearchUsers = () => {
    if (userSearch.trim() || userSearch === '') {
      loadUsers();
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return;
    }
    
    try {
      await gameService.delete(id);
      setSuccess('Game deleted successfully');
      loadGames();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete game');
    }
  };

  const handleSaveGame = async () => {
    if (!gameForm.title || !gameForm.description || !gameForm.price) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Prepare the game data for API
      const gameData: any = {
        title: gameForm.title,
        description: gameForm.description,
        price: Number(gameForm.price),
        genre: gameForm.genre || '',
        developer: gameForm.developer || '',
        publisher: gameForm.publisher || '',
        downloadSize: gameForm.downloadSize ? Number(gameForm.downloadSize) : 0,
        coverImage: gameForm.coverImage || '',
        screenshots: gameForm.screenshots || [],
        videoTrailer: gameForm.videoTrailer || undefined,
        ageRating: gameForm.ageRating || '',
      };

      // Convert datetime-local format to ISO datetime string
      if (gameForm.releaseDate) {
        // If it's already in ISO format, use it; otherwise convert from datetime-local
        if (gameForm.releaseDate.includes('T') && gameForm.releaseDate.includes('Z')) {
          gameData.releaseDate = gameForm.releaseDate;
        } else {
          // Convert from datetime-local format (YYYY-MM-DDTHH:mm) to ISO string
          gameData.releaseDate = new Date(gameForm.releaseDate).toISOString();
        }
      }

      if (editingGame) {
        await gameService.update(editingGame.id, gameData);
        setSuccess('Game updated successfully');
      } else {
        await gameService.create(gameData);
        setSuccess('Game created successfully');
      }
      setEditingGame(null);
      setShowAddGame(false);
      setGameForm({});
      loadGames();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save game');
    }
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    const releaseDate = game.releaseDate || (game as any).releasedAt;
    
    // Convert ISO date to datetime-local format for the input
    let dateValue = '';
    if (releaseDate) {
      const date = new Date(releaseDate);
      // Format as YYYY-MM-DDTHH:mm for datetime-local input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      dateValue = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    setGameForm({
      title: game.title,
      description: game.description,
      price: game.price,
      genre: game.genre,
      developer: game.developer,
      publisher: game.publisher,
      releaseDate: dateValue,
      downloadSize: game.downloadSize,
      coverImage: game.coverImage || game.coverImageUrl,
      screenshots: game.screenshots || [],
      videoTrailer: game.videoTrailer,
      ageRating: game.ageRating,
    });
    setShowAddGame(true);
  };

  const handleAddGame = () => {
    setEditingGame(null);
    setGameForm({});
    setShowAddGame(true);
  };

  const handleUpdateUser = async (userId: string, data: Partial<User>) => {
    try {
      await adminService.updateUser(userId, data);
      setSuccess('User updated successfully');
      loadUsers();
      setEditingUser(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleBanUser = async () => {
    if (!banEmail) {
      setError('Please enter an email address');
      return;
    }

    if (!window.confirm(`Are you sure you want to ban user with email: ${banEmail}?`)) {
      return;
    }

    try {
      await adminService.banUser(banEmail);
      setSuccess('User banned successfully');
      setBanEmail('');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ban user');
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8" style={{ position: 'relative', zIndex: 10 }}>
      <h1 className="text-4xl font-bold mb-8 gradient-text">Admin Panel</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('games')}
          className={`category-chip ${activeTab === 'games' ? 'active' : ''}`}
        >
          Games Management
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`category-chip ${activeTab === 'users' ? 'active' : ''}`}
        >
          Users Management
        </button>
      </div>

      {/* Games Tab */}
      {activeTab === 'games' && (
        <div>
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-300">Games</h2>
            <button
              onClick={handleAddGame}
              className="btn-glow btn-primary flex gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Game
            </button>
          </div>

          {showAddGame && (
            <div className="glass-card p-6 mb-6 rounded-lg">
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-bold">
                  {editingGame ? 'Edit Game' : 'Add New Game'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddGame(false);
                    setEditingGame(null);
                    setGameForm({});
                  }}
                  className="text-gray-400 hover:text-white btn-danger"
                >
                  <X className="w-5 h-5 " />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='input-group-admin'>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">Title *</label>
                  <input
                    type="text"
                    value={gameForm.title || ''}
                    onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className='input-group-admin'>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={gameForm.price || ''}
                    onChange={(e) => setGameForm({ ...gameForm, price: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div className='input-group-admin'>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">Genre *</label>
                  <input
                    type="text"
                    value={gameForm.genre || ''}
                    onChange={(e) => setGameForm({ ...gameForm, genre: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className='input-group-admin'>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">Developer *</label>
                  <input
                    type="text"
                    value={gameForm.developer || ''}
                    onChange={(e) => setGameForm({ ...gameForm, developer: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className='input-group-admin'>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">Publisher *</label>
                  <input
                    type="text"
                    value={gameForm.publisher || ''}
                    onChange={(e) => setGameForm({ ...gameForm, publisher: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className='input-group-admin'>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">Release Date *</label>
                  <input
                    type="datetime-local"
                    value={gameForm.releaseDate || ''}
                    onChange={(e) => setGameForm({ ...gameForm, releaseDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className='input-group-admin'>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">Download Size (bytes) *</label>
                  <input
                    type="number"
                    min="1"
                    value={gameForm.downloadSize || ''}
                    onChange={(e) => setGameForm({ ...gameForm, downloadSize: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    required
                  />
                </div>
                <div className='input-group-admin'>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">Age Rating *</label>
                  <input
                    type="text"
                    value={gameForm.ageRating || ''}
                    onChange={(e) => setGameForm({ ...gameForm, ageRating: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">Description *</label>
                  <textarea
                    value={gameForm.description || ''}
                    onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                    rows={4}
                    className="input-field"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">Cover Image URL *</label>
                  <input
                    type="url"
                    value={gameForm.coverImage || ''}
                    onChange={(e) => setGameForm({ ...gameForm, coverImage: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">Video Trailer URL</label>
                  <input
                    type="url"
                    value={gameForm.videoTrailer || ''}
                    onChange={(e) => setGameForm({ ...gameForm, videoTrailer: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              
              <button
                onClick={handleSaveGame}
                className=" btn-glow btn-success items-center"
                style={{marginTop: '15px'}}
              >
                <Save className="w-5 h-5" />
                {editingGame ? 'Update Game' : 'Create Game'}
              </button>
            </div>
          )}

          {gamesLoading ? (
            <div className="text-center py-12">Loading games...</div>
          ) : games.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No games found</p>
            </div>
          ) : (
            <div className="games-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '1.5rem' 
            }}>
              {games.map((game) => (
                <div key={game.id} className="game-card-cyber glass-card hover-lift rounded-lg overflow-hidden">
                  <div className="image-zoom rounded-lg overflow-hidden" style={{ height: '280px', overflow: 'hidden' }}>
                    <img
                      src={game.coverImage || game.coverImageUrl}
                      alt={game.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white"  style={{  padding: 5}}>{game.title}</h3>
                  <p className="text-gray-400 text-sm mb-2"  style={{  padding: 5}}>${game.price}</p>
                  <div className="flex gap-2"  style={{  padding: 5}}>
                    <button
                      onClick={() => handleEditGame(game)}
                      className=" btn-primary"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game.id)}
                      className="btn-danger"
                      style={{float:'right'}}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-300 mb-4">Users</h2>
            
            {/* Search and Ban */}
            <div className="glass-card p-4 mb-4 rounded-lg">
              <div className="flex gap-4 flex-wrap" style={{margin: '10px'}}>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search by email or username..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchUsers()}
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                    <button
                      onClick={handleSearchUsers}
                      className="btn-primary flex gap-2"
                    >
                      <Search className="w-5 h-5" />
                      Search
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email to ban..."
                    value={banEmail}
                    onChange={(e) => setBanEmail(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                  <button
                    onClick={handleBanUser}
                    className="btn-glow bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex  gap-2"
                  >
                    <Ban className="w-5 h-5" />
                    Ban User
                  </button>
                </div>
              </div>
            </div>
          </div>

          {usersLoading ? (
            <div className="text-center py-12">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {userSearch ? 'No users found matching your search' : 'No users found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full glass-card rounded-lg overflow-hidden">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Username</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Balance</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                      <td className="px-4 py-3">{user.username}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.userType || user.role}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.accountStatus === 'BANNED' ? 'bg-red-600' :
                          user.accountStatus === 'ACTIVE' ? 'bg-green-600' :
                          'bg-yellow-600'
                        }`}
                        style={{ padding:'4px', borderRadius: '5px'}}>
                          {user.accountStatus || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-4 py-3">${user.balance || 0}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="btn-primary"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit User Modal */}
          {editingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{marginTop: '20px'}}>
              <div className="glass-card p-6 rounded-lg max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Edit User</h3>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="btn-danger text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2 text-sm">Username</label>
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2 text-sm">Balance</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingUser.balance || 0}
                      onChange={(e) => setEditingUser({ ...editingUser, balance: parseFloat(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2 text-sm">Account Status</label>
                    <select
                      value={editingUser.accountStatus || 'ACTIVE'}
                      onChange={(e) => setEditingUser({ ...editingUser, accountStatus: e.target.value as AccountStatus })}
                      className="input-field"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                      <option value="BANNED">BANNED</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                  {editingUser.userType === 'CUSTOMER' && (
                    <>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-2 text-sm">Customer Level</label>
                        <select
                          value={editingUser.customerLevel || 'NONE'}
                          onChange={(e) => setEditingUser({ ...editingUser, customerLevel: e.target.value })}
                          className="input-field"
                        >
                          <option value="NONE">NONE</option>
                          <option value="BRONZE">BRONZE</option>
                          <option value="SILVER">SILVER</option>
                          <option value="GOLD">GOLD</option>
                          <option value="PLATINUM">PLATINUM</option>
                          <option value="DIAMOND">DIAMOND</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-2 text-sm">Loyalty Points</label>
                        <input
                          type="number"
                          value={editingUser.loyaltyPoints || 0}
                          onChange={(e) => setEditingUser({ ...editingUser, loyaltyPoints: parseInt(e.target.value) })}
                          className="input-field"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => {
                      // Exclude id and email from update data (as per requirements)
                      const { id, email, ...updateData } = editingUser;
                      handleUpdateUser(id, updateData);
                    }}
                    className="flex-1 btn-glow btn-success flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

