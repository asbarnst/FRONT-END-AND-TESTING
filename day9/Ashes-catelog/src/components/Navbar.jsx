import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Moon, Sun, Flame } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import './Navbar.css';

const Navbar = () => {
  const { isDarkMode, toggleTheme, cart, isAuthenticated, user, logout } = useAppContext();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar glass-panel">
      <div className="container flex items-center justify-between navbar-inner">
        {/* Logo */}
        <Link to="/" className="brand-logo">
          <Flame className="brand-icon" size={28} />
          <span>Ashes</span>
        </Link>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search premium products..."
          />
          <Search className="search-icon" size={18} />
        </div>

        {/* Actions */}
        <div className="nav-actions flex items-center gap-4">
          <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle Theme">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="cart-container">
            <button className="icon-btn" aria-label="Cart">
              <ShoppingCart size={20} />
            </button>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>

          {isAuthenticated ? (
            <div className="user-menu flex items-center gap-4">
              <span className="user-greeting">Hi, {user?.name || 'User'}</span>
              <button onClick={logout} className="btn-secondary logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary auth-link">
              <User size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
