import React, { useState, FormEvent } from 'react';
import './assets.css'
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ marginTop: '45vh', display: 'flex', position: 'relative', zIndex: 10 }}>
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
              <span className="flex  gap-2">
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
        {/* <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
          >
            ← Back to Store
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;