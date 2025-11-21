import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Gamepad2,Lock, Mail } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Validate username length
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center px-4 py-8" style={{ display: 'flex', position: 'relative', zIndex: 10 }}>

      <div className="login-form-container glass-card p-8" style={{ borderRadius: '24px' }}>
        {/* Logo & Title */}
        <div className="logo-container">
          <Gamepad2 className="w-10 h-10 text-cyan-400" />
          <h2 className="text-4xl font-bold gradient-text">Register</h2>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border-2 border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="block text-gray-300 font-semibold mb-2 text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="input-field input-with-icon"
              placeholder="username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email" className="block text-gray-300 font-semibold mb-2 text-sm">
              Email Address
            </label>
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

          <div className="input-group">
            <label htmlFor="email" className="block text-gray-300 font-semibold mb-2 text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-field input-with-icon"
              placeholder="••••••"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email" className="block text-gray-300 font-semibold mb-2 text-sm">
              Confirm password
            </label>        
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="input-field input-with-icon"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="block w-full text-center px-6 py-3 bg-gray-800/50 text-cyan-400 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 border-2 border-cyan-500/20 hover:border-cyan-500/50">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;