// frontend/src/pages/CartPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { Trash2 } from 'lucide-react';

const CartPage: React.FC = () => {
  const { items, removeFromCart, clearCart, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const checkoutItems = items.map((item) => ({ gameId: item.game.id }));
      await orderService.checkout(checkoutItems);
      
      clearCart();
      alert('Order placed successfully!');
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8" style={{display: 'flex', justifyContent: 'center', margin: 10}}>Shopping Cart</h1>
        <div className="text-center py-12"style={{height: '80vh'}}>
          <p className="text-xl text-gray-600 mb-6" style={{margin: 10}}>Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-glow btn-primary"
            style={{margin: 10}}
          >
            Browse Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8"  style={{ position: 'relative', zIndex: 10, margin: 10 }}>
      <style>{`
        .cart-items-scroll {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          scroll-behavior: smooth;
        }
        
        .cart-items-scroll::-webkit-scrollbar {
          height: 10px;
        }
        
        .cart-items-scroll::-webkit-scrollbar-track {
          background: rgba(26, 31, 58, 0.5);
          border-radius: 10px;
        }
        
        .cart-items-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 10px;
        }
        
        .cart-items-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #7b8ff0, #8557b0);
        }
        
        .cart-item-card {
          min-width: 350px;
          max-width: 350px;
          flex-shrink: 0;
        }
        
        .summary-container {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .summary-card {
          width: 100%;
          max-width: 500px;
        }
      `}</style>
      <h1 className="text-4xl font-bold mb-8 gradient-text">Shopping Cart</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items - Horizontal Scroll */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">
          Your Games ({items.length})
        </h2>
        <div className="cart-items-scroll">
          {items.map((item) => (
            <div
              key={item.game.id}
              className="cart-item-card glass-card hover-lift p-4"
              style={{ borderRadius: '16px' }}
            >
              <div className="flex flex-col h-full">
                {/* Image */}
                <div className="image-zoom mb-4" style={{ height: '200px', overflow: 'hidden', borderRadius: '12px' }}>
                  <img
                    src={item.game.coverImage || item.game.coverImageUrl}
                    alt={item.game.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                
                {/* Game Info */}
                <div className="flex-1" style={{margin: 10}}>
                  <h3 className="text-xl font-bold mb-2 text-white truncate">
                    {item.game.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {typeof item.game.genre === 'string' ? item.game.genre : item.game.genre}
                  </p>
                  <p className="text-blue-600">
                    {item.game.price}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.game.id)}
                  className="w-full text-center bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition duration-200 font-semibold flex items-center justify-center gap-2"
                  style={{marginTop: 20 }}
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* Order Summary */}
        <div className="summary-container">
          <div className="summary-card glass-card p-8" style={{ borderRadius: '24px'}}>
            <h2 className="text-3xl font-bold mb-6 text-center gradient-text" style={{marginTop: 10}}>Order Summary</h2>
            
            <div className="space-y-2 mb-4" style={{marginLeft: 10}}>
              <div className="flex justify-between text-gray-600">
                <span>Items ({items.length}) </span>
                {items.map((v) => (
                  v.game.id == items[items.length - 1].game.id?
                  <span>${v.game.price}</span>
                  :
                  <span>${v.game.price} + </span>
                ))}
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600" style={{margin: 5}}>${total}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-center">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full btn-glow btn-success bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl text-lg font-bold hover:from-green-700 hover:to-emerald-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>


              {!isAuthenticated && (
                <p className="text-sm text-gray-400 text-center" style={{margin: 10}}>
                  You need to login to complete your purchase
                </p>
              )}

              <div className="text-center" style={{margin: 10}}>
                <button
                  onClick={() => navigate('/')}
                  className="w-full btn-primary bg-gray-700 text-gray-200 py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;