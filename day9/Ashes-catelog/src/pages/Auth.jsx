import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Flame, ArrowLeft, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name: formData.name || formData.email.split('@')[0], email: formData.email });
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page">
      {/* Decorative Background */}
      <div className="auth-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="auth-container">
        <Link to="/" className="back-link flex items-center">
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>

        <div className="auth-card glass-panel">
          <div className="auth-header text-center">
            <div className="brand-logo justify-center mb-4">
              <Flame className="brand-icon" size={36} />
              <span className="brand-text">Ashes</span>
            </div>
            <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="auth-subtitle">
              {isLogin ? 'Enter your details to access your premium account.' : 'Join Ashes and elevate your lifestyle.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <div className="input-wrapper">
                  <UserIcon className="input-icon" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="input-field with-icon"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div className="input-group">
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="input-field with-icon"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input-field with-icon"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="auth-options flex justify-between items-center">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="text-sm">Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="btn-primary w-full submit-btn">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer text-center">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button className="toggle-auth-btn" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
