import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, GitCompare, X, Trash2, LayoutGrid, Home, Settings, Sun, Moon, Mail } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export default function Navbar() {
  const { wishlist, compareList, toggleComparison, clearComparison, theme, toggleTheme, user, logout } = useCatalog();
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Aggregate keys for specifications comparison
  const getCompareSpecs = () => {
    const allKeys = new Set();
    compareList.forEach(p => {
      if (p.specs) {
        Object.keys(p.specs).forEach(k => allKeys.add(k));
      }
    });
    return Array.from(allKeys);
  };

  const compareSpecs = getCompareSpecs();

  return (
    <>
      <header className="glass-panel" style={{
        position: 'sticky',
        top: '16px',
        margin: '16px 24px 0 24px',
        zIndex: 100,
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              color: '#fff',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
            }}>
              A
            </div>
            <span className="gradient-text" style={{
              fontSize: '1.4rem',
              fontWeight: '800',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '1px'
            }}>
              Ashes2.0catelog
            </span>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            <Link
              to="/"
              className="btn"
              style={{
                background: isActive('/') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderColor: isActive('/') ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                color: isActive('/') ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '8px 16px',
                fontSize: '0.9rem'
              }}
            >
              <Home size={16} />
              Home
            </Link>
            <Link
              to="/catalog"
              className="btn"
              style={{
                background: isActive('/catalog') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderColor: isActive('/catalog') ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                color: isActive('/catalog') ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '8px 16px',
                fontSize: '0.9rem'
              }}
            >
              <LayoutGrid size={16} />
              Catalog
            </Link>
            <Link
              to="/contact"
              className="btn"
              style={{
                background: isActive('/contact') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderColor: isActive('/contact') ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                color: isActive('/contact') ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '8px 16px',
                fontSize: '0.9rem'
              }}
            >
              <Mail size={16} />
              Contact
            </Link>
            <Link
              to="/admin"
              className="btn"
              style={{
                background: isActive('/admin') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderColor: isActive('/admin') ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                color: isActive('/admin') ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '8px 16px',
                fontSize: '0.9rem'
              }}
            >
              <Settings size={16} />
              Manage
            </Link>
          </nav>

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/catalog?wishlist=true"
              className="btn btn-secondary"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                position: 'relative'
              }}
            >
              <Heart size={16} style={{ color: wishlist.length > 0 ? '#ef4444' : 'inherit', fill: wishlist.length > 0 ? '#ef4444' : 'none' }} />
              <span style={{ display: 'inline' }}>Wishlist</span>
              {wishlist.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  boxShadow: '0 0 5px rgba(239, 68, 68, 0.5)'
                }}>
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setShowCompareDrawer(true)}
              className="btn btn-secondary"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <GitCompare size={16} />
              <span>Compare</span>
              {compareList.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  boxShadow: '0 0 5px rgba(99, 102, 241, 0.5)'
                }}>
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Google Authentication */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--color-primary)' }} 
                  title={user.email}
                />
                <button
                  onClick={logout}
                  className="btn btn-secondary"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    borderColor: 'rgba(239,68,68,0.2)',
                    color: '#ef4444',
                    background: 'rgba(239,68,68,0.05)'
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn btn-primary"
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Comparison Drawer */}
      {showCompareDrawer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
        onClick={() => setShowCompareDrawer(false)}
        >
          <div style={{
            width: '100%',
            maxWidth: '800px',
            height: '100%',
            backgroundColor: '#0d1426',
            borderLeft: '1px solid var(--border-color)',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: '24px'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GitCompare size={20} className="gradient-text" /> Product Comparison
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Compare features, pricing, and details side by side</p>
              </div>
              <button 
                onClick={() => setShowCompareDrawer(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {compareList.length === 0 ? (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                gap: '12px'
              }}>
                <GitCompare size={48} style={{ opacity: 0.3 }} />
                <p>No products added for comparison</p>
                <Link 
                  to="/catalog" 
                  className="btn btn-primary"
                  onClick={() => setShowCompareDrawer(false)}
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '16px'
                }}>
                  <button 
                    onClick={clearComparison}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    <Trash2 size={14} /> Clear All
                  </button>
                </div>

                {/* Compare Grid Table */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `140px repeat(${compareList.length}, 1fr)`,
                  gap: '16px',
                  alignItems: 'start'
                }}>
                  {/* General Row Headers */}
                  <div style={{ fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem', alignSelf: 'center' }}>Product</div>
                  {compareList.map(p => (
                    <div key={p.id} style={{ position: 'relative', textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                      <button
                        onClick={() => toggleComparison(p)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(0,0,0,0.4)',
                          border: 'none',
                          color: '#f87171',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <X size={12} />
                      </button>
                      <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} />
                      <div style={{ fontWeight: '600', fontSize: '0.85rem', wordBreak: 'break-word', color: 'var(--text-primary)' }}>{p.name}</div>
                    </div>
                  ))}

                  <div style={{ fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Price</div>
                  {compareList.map(p => (
                    <div key={p.id} style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-secondary)' }}>${p.price}</div>
                  ))}

                  <div style={{ fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Rating</div>
                  {compareList.map(p => (
                    <div key={p.id} style={{ fontSize: '0.85rem', color: '#fbbf24' }}>★ {p.rating} <span style={{ color: 'var(--text-muted)' }}>({p.reviewsCount})</span></div>
                  ))}

                  <div style={{ fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status</div>
                  {compareList.map(p => (
                    <div key={p.id}>
                      <span className={`badge ${p.inStock ? 'badge-stock-in' : 'badge-stock-out'}`} style={{ fontSize: '0.7rem' }}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  ))}

                  <div style={{ fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Category</div>
                  {compareList.map(p => (
                    <div key={p.id} style={{ textTransform: 'capitalize', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.category}</div>
                  ))}

                  {/* Specifications header */}
                  <div style={{
                    gridColumn: `1 / span ${compareList.length + 1}`,
                    borderBottom: '1px solid var(--border-color)',
                    paddingTop: '16px',
                    margin: '8px 0',
                    fontWeight: 'bold',
                    color: 'var(--color-primary)',
                    fontSize: '0.9rem'
                  }}>
                    Specifications
                  </div>

                  {compareSpecs.map(specKey => (
                    <React.Fragment key={specKey}>
                      <div style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.8rem', wordBreak: 'break-word' }}>{specKey}</div>
                      {compareList.map(p => (
                        <div key={p.id} style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                          {p.specs?.[specKey] || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
