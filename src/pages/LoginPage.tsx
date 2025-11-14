// frontend/src/pages/LoginPage.tsx - Cyber Theme

import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Gamepad2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ marginTop: '50vh', display: 'flex', position: 'relative', zIndex: 10 }}>
      <style>{`
        .login-form-container {
          width: 100%;
          max-width: 480px;
        }
        
        .input-group {
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #718096;
          pointer-events: none;
        }
        
        .input-with-icon {
          padding-left: 3rem;
        }
        
        .input-field {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(26, 31, 58, 0.6);
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 12px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .input-field:focus {
          outline: none;
          border-color: #00d9ff;
          background: rgba(26, 31, 58, 0.8);
          box-shadow: 0 0 0 4px rgba(0, 217, 255, 0.1), 0 0 20px rgba(0, 217, 255, 0.2);
        }
        
        .input-field::placeholder {
          color: #718096;
        }
        
        .login-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.125rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        }
        
        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
        }
        
        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
      `}</style>

      <div className="login-form-container glass-card p-8" style={{ borderRadius: '24px' }}>
        {/* Logo & Title */}
        <div className="logo-container">
          <Gamepad2 className="w-10 h-10 text-cyan-400" />
          <h2 className="text-4xl font-bold gradient-text">Login</h2>
        </div>

        <p className="text-center text-gray-400 mb-8">
          Welcome back! Sign in to your account
        </p>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border-2 border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="input-group">
            <label htmlFor="email" className="block text-gray-300 font-semibold mb-2 text-sm">
              Email Address
            </label>
            <div className="relative">
              <Mail className="input-icon w-5 h-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field input-with-icon"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="password" className="block text-gray-300 font-semibold mb-2 text-sm">
              Password
            </label>
            <div className="relative">
              <Lock className="input-icon w-5 h-5" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-field input-with-icon"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" />
                Login
              </span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-500">Don't have an account?</span>
          </div>
        </div>

        {/* Register Link */}
        <Link
          to="/register"
          className="block w-full text-center px-6 py-3 bg-gray-800/50 text-cyan-400 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 border-2 border-cyan-500/20 hover:border-cyan-500/50"
        >
          Create New Account
        </Link>

        {/* Back to Store */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;