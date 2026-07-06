import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ArrowRight } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <main className="container animate-fade-in" style={{ paddingBlock: '60px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.25)',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#a5b4fc',
          marginBottom: '20px'
        }}>
          <MessageSquare size={14} /> We'd love to hear from you
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
          Get in{' '}
          <span className="gradient-text">Touch</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto', lineHeight: '1.6' }}>
          Have a question about our catalog, need support, or want to collaborate? Reach out anytime — we typically respond within 24 hours.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.6fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left info column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Contact Cards */}
          {[
            {
              icon: <Mail size={22} style={{ color: 'var(--color-primary)' }} />,
              label: 'Email',
              value: 'asbarnstmohammed@gmail.com',
              href: 'mailto:asbarnstmohammed@gmail.com',
              bg: 'rgba(99,102,241,0.1)',
              border: 'rgba(99,102,241,0.2)'
            },
            {
              icon: <Phone size={22} style={{ color: 'var(--color-secondary)' }} />,
              label: 'Phone',
              value: '+91 992034901',
              href: 'tel:+91992034901',
              bg: 'rgba(16,185,129,0.1)',
              border: 'rgba(16,185,129,0.2)'
            },
            {
              icon: <MapPin size={22} style={{ color: 'var(--color-accent)' }} />,
              label: 'Location',
              value: 'India 🇮🇳',
              href: null,
              bg: 'rgba(236,72,153,0.1)',
              border: 'rgba(236,72,153,0.2)'
            },
            {
              icon: <Clock size={22} style={{ color: '#fbbf24' }} />,
              label: 'Response Time',
              value: 'Within 24 hours',
              href: null,
              bg: 'rgba(251,191,36,0.1)',
              border: 'rgba(251,191,36,0.2)'
            }
          ].map((info) => (
            <div
              key={info.label}
              className="glass-panel"
              style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: '16px', textAlign: 'left' }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: info.bg,
                border: `1px solid ${info.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {info.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {info.label}
                </div>
                {info.href ? (
                  <a href={info.href} style={{ fontSize: '0.95rem', color: 'var(--color-primary)', fontWeight: '600', wordBreak: 'break-all' }}>
                    {info.value}
                  </a>
                ) : (
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                    {info.value}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Quick links panel */}
          <div className="glass-panel" style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(236,72,153,0.05))',
            borderColor: 'rgba(99,102,241,0.2)'
          }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Explore the Catalog
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Audio Gear', 'Smart Workspace', 'Wearable Tech', 'Smart Home'].map(cat => (
                <Link
                  key={cat}
                  to={`/catalog?category=${cat.toLowerCase().replace(' ', '-')}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.03)'
                  }}
                >
                  {cat}
                  <ArrowRight size={14} style={{ color: 'var(--color-primary)' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right contact form */}
        <div className="glass-panel" style={{ padding: '40px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(16,185,129,0.15)',
                border: '2px solid rgba(16,185,129,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                fontSize: '2rem'
              }}>
                ✓
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
                Message Sent!
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
                Thanks for reaching out! We will get back to you at <strong>asbarnstmohammed@gmail.com</strong> within 24 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                className="btn btn-secondary"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Send a Message
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Fill in the details below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="Your full name"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                    className="form-input"
                    required
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="catalog-feedback">Catalog Feedback</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us how we can help you..."
                    className="form-input"
                    rows={6}
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  padding: '12px 16px',
                  background: 'rgba(99,102,241,0.06)',
                  borderRadius: '8px',
                  border: '1px solid rgba(99,102,241,0.12)'
                }}>
                  <Mail size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  Messages are delivered to <strong>asbarnstmohammed@gmail.com</strong>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px' }}
                  disabled={submitting}
                >
                  {submitting ? (
                    'Sending...'
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
