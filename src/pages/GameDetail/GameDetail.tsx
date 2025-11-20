// frontend/src/pages/GameDetailPage.tsx - ПЕРЕРОБЛЕНА ВЕРСІЯ

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Game, Review } from '../../types';
import { gameService, reviewService, wishlistService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import { Heart, Star, Calendar, Download, Monitor, Cpu, HardDrive, MemoryStick, CpuIcon } from 'lucide-react';
import ReviewsList from '../../components/ReviewsList';
import ReviewForm from '../../components/ReviewForm';

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
  const { isGameOwned } = useLibrary();

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
      if (isGameOwned(game.id)) {
        alert('Ви вже маєте цю гру в бібліотеці!');
        return;
      }
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

    if (isGameOwned(game.id)) {
      alert('Ви вже маєте цю гру в бібліотеці!');
      return;
    }

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
      loadGame(id);
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

  // Збираємо всі зображення для горизонтального скролу
  const allImages = [game.coverImage, ...(game.screenshots || [])].filter(Boolean);

  const SpecItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="p-3">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
          <p className="text-gray-800 text-sm">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back to Store
      </button>

      {showAddedMessage && (
        <div className="mb-4 bg-green-600 text-white px-4 py-3 rounded-lg">
          Game added to cart!
        </div>
      )}

      {/* Назва гри зверху */}
      <h1 className="text-4xl font-bold mb-6">{game.title}</h1>

      {/* Основна секція: фотографії та інформація про гру */}
      <div className="grid grid-cols-1 lg-grid-cols-3 gap-6 mb-8 items-start">
        {/* Ліва частина: горизонтальний скролл фотографій */}
        <div className="lg-col-span-2">
          <div className="screenshots-scroll overflow-x-auto" style={{ height: '500px' }}>
            <div className="flex gap-4 h-full">
              {allImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={index === 0 ? game.title : `Screenshot ${index}`}
                  className="h-full object-cover rounded-lg flex-shrink-0"
                  style={{ minWidth: '800px' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Права частина: інформація про гру */}
        <div className="lg-col-span-1 lg-top-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">About game</h2>
            
            {/* Теги та жанр */}
            <div className="mb-4">
              <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2">
                {game.genre}
              </span>
              <span className="inline-block bg-gray-600 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2">
                {game.ageRating}
              </span>
            </div>

            {/* Рейтинг */}
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(game.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg text-gray-800">
                  {game.rating} ({reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Developer & Publisher */}
            <div className="mb-4 space-y-2 text-sm">
              <p className="text-gray-800">
                <span className="font-semibold text-gray-600">Developer:</span>{' '}
                {game.developer}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold text-gray-600">Publisher:</span>{' '}
                {game.publisher}
              </p>
            </div>

            {/* Release Date */}
            <div className="mb-4 text-sm">
              <div className="flex gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-800">Released: {releaseDate}</span>
              </div>
            </div>

            {/* Download Size */}
            <div className="mb-4 text-sm">
              <div className="flex gap-2">
                <Download className="w-4 h-4 text-gray-600" />
                <span className="text-gray-800">
                  Size: {(Number(game.downloadSize) / 1_000_000_000).toFixed(2)} GB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки та вартість під фотографіями */}
      <div className="mb-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {isGameOwned(game.id) ? (
            <button
              disabled
              style={{
                padding: '0.75rem 1.5rem',
                cursor: 'not-allowed',
              }}
              className='.btn .btn:disabled font-semibold text-lg text-gray-300 rounded-lg'
            >
              In Cart
            </button>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                disabled={isInCart(game.id)}
                className='w-full btn-glow btn-success bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl text-lg font-bold hover:from-green-700 hover:to-emerald-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isInCart(game.id) ? 'In Cart' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleToggleWishlist}
                disabled={isInWishlist || isGameOwned(game.id)}
                className='w-full bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition duration-200 font-semibold flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Heart
                  className='w-5 h-5'
                />
              </button>
            </>
          )}

          {isInCart(game.id) && !isGameOwned(game.id) && (
            <button
              onClick={() => navigate('/cart')}
              className='w-full btn-primary bg-gray-700 text-gray-200 py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition duration-200'
            >
              Go to Cart
            </button>
          )}
        </div>

        {/* Вартість */}
        <div>
          {game.discountPrice ? (
            <div className="flex items-center gap-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded text-lg font-bold">
                -{discountPercentage}%
              </span>
              <div>
                <div className="text-gray-400 line-through text-lg">
                  ${game.price}
                </div>
                <div className="text-3xl font-bold text-green-600">
                  ${finalPrice}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-3xl font-bold">${finalPrice}</div>
          )}
        </div>
      </div>

      {/* Блок про гру (розтягнутий) */}
      <div className="mb-8 p-6">
        <h2 className="text-2xl font-bold mb-4">About This Game</h2>
        <p className="text-gray-700 leading-relaxed text-lg">{game.description}</p>
      </div>

      {/* Системні вимоги: мінімальні зліва, рекомендовані справа */}
      {game.systemRequirements && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md-grid-cols-2 gap-6">
            {/* Мінімальні вимоги */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Minimum system requirements</h3>
              <div className="space-y-2">
                <SpecItem icon={Monitor} label="Operating system" value={game.systemRequirements.minOS} />
                <SpecItem icon={Cpu} label="Processor" value={game.systemRequirements.minProcessor} />
                <SpecItem icon={MemoryStick} label="RAM" value={game.systemRequirements.minRAM} />
                <SpecItem icon={HardDrive} label="Storage" value={game.systemRequirements.minStorage} />
                <SpecItem icon={CpuIcon} label="Gpu" value={game.systemRequirements.minGraphics} />
              </div>
            </div>

            {/* Рекомендовані вимоги */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Recommended system requirements</h3>
              <div className="space-y-2">
                <SpecItem icon={Monitor} label="Operating system" value={game.systemRequirements.recOS} />
                <SpecItem icon={Cpu} label="Processor" value={game.systemRequirements.recProcessor} />
                <SpecItem icon={MemoryStick} label="RAM" value={game.systemRequirements.recRAM} />
                <SpecItem icon={HardDrive} label="Storage" value={game.systemRequirements.recStorage} />
                <SpecItem icon={CpuIcon} label="Gpu" value={game.systemRequirements.recGraphics} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Блок переглядів */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        {isAuthenticated && (
          <div className="mb-8">
            <ReviewForm gameId={game.id} onReviewSubmitted={handleReviewSubmitted} />
          </div>
        )}
        
        <ReviewsList reviews={reviews} onReviewDeleted={handleReviewSubmitted} />
      </div>
    </div>
  );
};

export default GameDetailPage;
