import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, GitCompare, ArrowUpRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export default function ProductCard({ product }) {
  const { wishlist, compareList, toggleWishlist, toggleComparison } = useCatalog();

  const isWishlisted = wishlist.some(item => item.id === product.id);
  const isCompared = compareList.some(item => item.id === product.id);

  // Generate review stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} style={{ color: '#fbbf24' }}>★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} style={{ color: '#fbbf24' }}>★</span>); // Custom star
      } else {
        stars.push(<span key={i} style={{ color: 'var(--text-muted)' }}>☆</span>);
      }
    }
    return stars;
  };

  return (
    <div 
      className="glass-panel glass-panel-hover" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        padding: '16px',
        animation: 'fadeInCard 0.4s ease forwards',
      }}
    >
      {/* Quick Action Floating Row */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 10
      }}>
        {/* Wishlist toggle */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className="btn-icon-only"
          style={{
            width: '34px',
            height: '34px',
            background: isWishlisted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 0, 0, 0.5)',
            borderColor: isWishlisted ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)',
            color: isWishlisted ? '#ef4444' : '#fff',
            cursor: 'pointer'
          }}
          title="Add to Wishlist"
        >
          <Heart size={15} fill={isWishlisted ? '#ef4444' : 'none'} />
        </button>

        {/* Compare toggle */}
        <button
          onClick={(e) => { e.preventDefault(); toggleComparison(product); }}
          className="btn-icon-only"
          style={{
            width: '34px',
            height: '34px',
            background: isCompared ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0, 0, 0, 0.5)',
            borderColor: isCompared ? 'rgba(99, 102, 241, 0.3)' : 'var(--border-color)',
            color: isCompared ? 'var(--color-primary)' : '#fff',
            cursor: 'pointer'
          }}
          title="Add to Compare"
        >
          <GitCompare size={15} />
        </button>
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.id}`} style={{ display: 'block', overflow: 'hidden', borderRadius: '10px', height: '200px', marginBottom: '16px', position: 'relative' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.02)',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1.02)'}
        />
        {!product.inStock && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(11, 15, 25, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#ef4444',
            fontSize: '0.9rem',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Sold Out
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
        {/* Category Badge & Code */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-category" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
            {product.category}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {product.id}</span>
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} style={{ hover: { color: 'var(--color-primary)' } }}>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#fff',
            lineHeight: '1.4',
            marginBottom: '8px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '44px'
          }}>
            {product.name}
          </h4>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginBottom: '16px' }}>
          <div style={{ display: 'flex' }}>{renderStars(product.rating)}</div>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>{product.rating}</span>
          <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount})</span>
        </div>

        {/* Price & View Actions Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-secondary)' }}>
              ${product.price.toFixed(2)}
            </div>
          </div>

          <Link 
            to={`/product/${product.id}`} 
            className="btn btn-secondary"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Specs <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
