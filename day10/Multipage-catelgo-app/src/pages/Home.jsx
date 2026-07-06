import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Star, Search, Heart, GitCompare, ShieldCheck } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { products, categories, fetchProducts, fetchCategories, loading } = useCatalog();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div style={{ paddingBottom: '80px' }} className="animate-fade-in">

      {/* ── Hero ────────────────────────────────── */}
      <section style={{
        padding: '100px 24px 80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute', top: '-20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.06) 50%, transparent 100%)',
          filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>

          {/* Trusted badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '6px 16px', borderRadius: '999px',
            fontSize: '0.85rem', fontWeight: '600', color: '#a5b4fc',
            marginBottom: '28px'
          }}>
            <Star size={14} fill="#a5b4fc" /> Ashes2.0catelog — Premium Tech Picks
          </div>

          <h1 style={{
            fontSize: '4rem', lineHeight: '1.1', fontWeight: '800',
            fontFamily: 'var(--font-heading)', marginBottom: '24px',
            letterSpacing: '-0.03em'
          }}>
            Shop Smarter with <br />
            <span className="gradient-text">Ashes2.0catelog</span>
          </h1>

          <p style={{
            fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.7',
            marginBottom: '40px', maxWidth: '680px', marginInline: 'auto'
          }}>
            Explore {products.length}+ carefully curated tech products — audio gear, wearables, smart workspaces, and home automation — all in one place.
          </p>

          {/* Search */}
          <form onSubmit={handleQuickSearch} style={{
            maxWidth: '560px', margin: '0 auto 48px auto',
            display: 'flex', gap: '8px',
            background: 'rgba(0,0,0,0.3)', padding: '6px',
            borderRadius: '14px', border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, paddingLeft: '12px' }}>
              <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                name="search"
                type="text"
                placeholder="Search headphones, keyboards, smartwatches..."
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', width: '100%', fontSize: '0.95rem'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '10px' }}>
              Search
            </button>
          </form>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
            {[
              { value: `${products.length}+`, label: 'Products Listed' },
              { value: '4', label: 'Top Categories' },
              { value: '4.5★', label: 'Average Rating' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────── */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'left', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Browse by Category</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Discover devices across our four premium collections
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalog?category=${cat.slug}`}
                className="glass-panel glass-panel-hover"
                style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', cursor: 'pointer', minHeight: '200px' }}
              >
                <div style={{
                  padding: '12px', borderRadius: '12px',
                  background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)',
                  border: '1px solid rgba(99,102,241,0.2)', marginBottom: '20px'
                }}>
                  <Cpu size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'auto', lineHeight: '1.5' }}>
                  {cat.description}
                </p>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', marginTop: '24px', paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.count} Products</span>
                  <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    Shop <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ───────────────────── */}
      <section style={{ padding: '60px 0', background: 'rgba(255,255,255,0.01)', borderBlock: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Featured Products</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Editor's picks — highest rated and most loved by our community
              </p>
            </div>
            <Link to="/catalog" className="btn btn-secondary" style={{ display: 'flex', gap: '8px' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Loading products...
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Ashes2.0catelog ─────────────────── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
              Why <span className="gradient-text">Ashes2.0catelog</span>?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Built for enthusiasts who care about specs, quality, and experience
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: <Star size={28} />, color: 'var(--color-primary)',
                title: 'Curated Selection',
                desc: 'Every product is hand-selected for quality, value, and innovation. Only the best tech makes it into our catalog.'
              },
              {
                icon: <GitCompare size={28} />, color: 'var(--color-secondary)',
                title: 'Side-by-Side Compare',
                desc: 'Compare up to 3 products instantly — specs, pricing, ratings, and availability in a clean side-by-side panel.'
              },
              {
                icon: <Heart size={28} />, color: 'var(--color-accent)',
                title: 'Personal Wishlist',
                desc: 'Save your favorite items to revisit later. Your wishlist is persisted locally so it is always available.'
              },
              {
                icon: <ShieldCheck size={28} />, color: '#fbbf24',
                title: 'Trusted Reviews',
                desc: 'Real customer reviews and ratings to help you make confident purchase decisions every time.'
              }
            ].map(feature => (
              <div key={feature.title} className="glass-panel" style={{ padding: '28px', textAlign: 'left' }}>
                <div style={{ color: feature.color, marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
