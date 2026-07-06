import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-color)',
      padding: '48px 0 24px 0',
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Brand block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                A
              </div>
              <span className="gradient-text" style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '1px'
              }}>
                Ashes2.0catelog
              </span>
            </Link>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Curated hardware and intelligent devices designed to elevate your lifestyle, workspace, and digital efficiency.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <a href="mailto:asbarnstmohammed@gmail.com" className="btn-icon-only" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={16} />
              </a>
              <a href="#" className="btn-icon-only" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="#" className="btn-icon-only" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>Shop Catalog</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/catalog?category=audio">Audio Gear</Link></li>
              <li><Link to="/catalog?category=wearables">Wearable Tech</Link></li>
              <li><Link to="/catalog?category=workspace">Smart Workspace</Link></li>
              <li><Link to="/catalog?category=smart-home">Home Automation</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/catalog">Browse Products</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>Get In Touch</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <a href="mailto:asbarnstmohammed@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
                <Mail size={14} /> asbarnstmohammed@gmail.com
              </a>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                📞 992034901
              </span>
            </div>
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Mail size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>© 2026 Ashes2.0catelog. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/contact">Contact Us</Link>
            <a href="#">Terms of Use</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
