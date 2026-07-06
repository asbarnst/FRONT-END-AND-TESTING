import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';

const MOCK_GOOGLE_ACCOUNTS = [
  {
    name: 'Mohammed Asbarnst',
    email: 'asbarnstmohammed@gmail.com',
    picture: 'https://ui-avatars.com/api/?name=Mohammed+Asbarnst&background=6366f1&color=fff&size=64&font-size=0.4',
    isDefault: true,
  },
  {
    name: 'Alex Developer',
    email: 'alexdev@gmail.com',
    picture: 'https://ui-avatars.com/api/?name=Alex+Developer&background=ec4899&color=fff&size=64&font-size=0.4',
    isDefault: false,
  },
  {
    name: 'Demo User',
    email: 'demo@gmail.com',
    picture: 'https://ui-avatars.com/api/?name=Demo+User&background=10b981&color=fff&size=64&font-size=0.4',
    isDefault: false,
  },
];

export default function Login() {
  const { loginWithGoogle, user } = useCatalog();
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Redirect already-logged-in users away from the login page
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (user) return null;

  const handleSelectAccount = async (account) => {
    setSelectedAccount(account);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // Realistic auth delay
    loginWithGoogle(account);
    setLoading(false);
    navigate(-1); // Go back to where user came from
  };

  return (
    <div className="animate-fade-in" style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '40px 24px',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Card */}
        <div className="glass-panel" style={{
          padding: '48px 40px',
          borderRadius: '24px',
          textAlign: 'center',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1.4rem',
              color: '#fff',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)'
            }}>A</div>
            <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
              Ashes2.0catelog
            </span>
          </Link>

          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: '1.5' }}>
            Sign in to access your wishlist, compare products, and manage the catalog.
          </p>

          {/* Google Sign-In Button */}
          {!showPicker && !loading && (
            <button
              onClick={() => setShowPicker(true)}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.borderColor = 'var(--border-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Google Logo SVG */}
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              Continue with Google
            </button>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--color-primary)',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 16px auto'
              }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Signing in as <strong>{selectedAccount?.name}</strong>...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Google Account Chooser */}
          {showPicker && !loading && (
            <div style={{
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.2)'
            }}>
              {/* Picker Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Choose an account
                </span>
              </div>

              {MOCK_GOOGLE_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleSelectAccount(account)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    textAlign: 'left',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <img
                    src={account.picture}
                    alt={account.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {account.name}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {account.email}
                    </div>
                  </div>
                  {account.isDefault && (
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '0.7rem',
                      background: 'rgba(99,102,241,0.15)',
                      color: '#a5b4fc',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      border: '1px solid rgba(99,102,241,0.3)',
                      fontWeight: '600'
                    }}>Default</span>
                  )}
                </button>
              ))}

              <button
                onClick={() => setShowPicker(false)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Divider */}
          {!showPicker && !loading && (
            <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              By signing in, you agree to our{' '}
              <a href="#" style={{ color: 'var(--color-primary)' }}>Privacy Policy</a>
            </div>
          )}
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
