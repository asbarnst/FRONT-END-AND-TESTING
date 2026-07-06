import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, GitCompare, Star, Calendar, MessageSquare, Table, Code, Eye } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { wishlist, compareList, toggleWishlist, toggleComparison, products, fetchProducts } = useCatalog();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'reviews', 'api'

  // Form states for new review
  const [reviewUser, setReviewUser] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product detail on mount/id change
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Product not found in Nexus catalog');
          throw new Error('Failed to retrieve product details');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  // Make sure full products are loaded for recommendations
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products, fetchProducts]);

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: 'var(--text-secondary)' }}>
        Fetching product specifications...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container animate-fade-in" style={{ paddingBlock: '80px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', borderColor: 'rgba(239,68,68,0.2)' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Catalog Resolution Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'The requested product could not be located.'}</p>
          <Link to="/catalog" className="btn btn-primary">
            <ArrowLeft size={16} /> Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Check state status
  const isWishlisted = wishlist.some(item => item.id === product.id);
  const isCompared = compareList.some(item => item.id === product.id);

  // Retrieve related products in same category (excluding current)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Star drawing helper
  const renderStars = (rating, size = 14) => {
    const stars = [];
    const full = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={size} 
          style={{ 
            color: i <= full ? '#fbbf24' : 'var(--text-muted)',
            fill: i <= full ? '#fbbf24' : 'none' 
          }} 
        />
      );
    }
    return stars;
  };

  // Review submission handler
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewUser.trim() || !reviewComment.trim()) return;
    setSubmittingReview(true);

    try {
      const newReview = {
        id: `rev-${Date.now()}`,
        user: reviewUser.trim(),
        rating: Number(reviewRating),
        comment: reviewComment.trim(),
        date: new Date().toISOString().split('T')[0]
      };

      const updatedReviews = [newReview, ...product.reviews];
      // Compute new average rating
      const sum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
      const avg = Number((sum / updatedReviews.length).toFixed(1));

      // Put API request to update product on backend
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviews: updatedReviews,
          rating: avg,
          reviewsCount: updatedReviews.length
        })
      });

      if (!res.ok) throw new Error('Failed to post review');
      const updatedProduct = await res.json();
      
      setProduct(updatedProduct);
      setReviewUser('');
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBlock: '40px' }}>
      {/* Back button link */}
      <div style={{ marginBottom: '24px', textAlign: 'left' }}>
        <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      {/* Main Grid View */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1.2fr) 1.5fr',
        gap: '48px',
        marginBottom: '60px'
      }}>
        {/* Left Side: Product Image Panel */}
        <div>
          <div className="glass-panel" style={{
            padding: '24px',
            position: 'relative',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.01)'
          }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: '16px'
              }} 
            />
            {!product.inStock && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(11, 15, 25, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#ef4444',
                fontSize: '1.2rem',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                Temporarily Sold Out
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Primary info details */}
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-category" style={{ fontSize: '0.75rem' }}>{product.category}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SKU: {product.id}</span>
          </div>

          <h1 style={{ fontSize: '3rem', color: '#fff', marginBottom: '16px', lineHeight: '1.2' }}>{product.name}</h1>

          {/* Rating aggregate display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>{renderStars(product.rating, 18)}</div>
            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff' }}>{product.rating}</span>
            <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} customer reviews)</span>
          </div>

          {/* Pricing Box */}
          <div className="glass-panel" style={{
            padding: '20px 24px',
            borderRadius: '16px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(16, 185, 129, 0.05)',
            borderColor: 'rgba(16, 185, 129, 0.2)'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MSRP Value</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-secondary)' }}>${product.price.toFixed(2)}</div>
            </div>
            <div>
              <span className={`badge ${product.inStock ? 'badge-stock-in' : 'badge-stock-out'}`} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                {product.inStock ? 'Available to Ship' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.7',
            marginBottom: '36px'
          }}>
            {product.description}
          </p>

          {/* User Operations */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => toggleWishlist(product)}
              className="btn btn-secondary"
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '12px',
                borderColor: isWishlisted ? '#ef4444' : 'var(--border-color)',
                background: isWishlisted ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                color: isWishlisted ? '#ef4444' : '#fff',
                cursor: 'pointer'
              }}
            >
              <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} />
              {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            </button>

            <button
              onClick={() => toggleComparison(product)}
              className="btn btn-secondary"
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '12px',
                borderColor: isCompared ? 'var(--color-primary)' : 'var(--border-color)',
                background: isCompared ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                color: isCompared ? 'var(--color-primary)' : '#fff',
                cursor: 'pointer'
              }}
            >
              <GitCompare size={18} />
              {isCompared ? 'Comparing Product' : 'Add to Compare'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs navigation panel */}
      <section className="glass-panel" style={{ borderRadius: '20px', padding: '32px', marginBottom: '60px' }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '28px',
          gap: '24px'
        }}>
          <button
            onClick={() => setActiveTab('specs')}
            style={{
              paddingBottom: '16px',
              border: 'none',
              background: 'none',
              color: activeTab === 'specs' ? 'var(--color-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'specs' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Table size={16} /> Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              paddingBottom: '16px',
              border: 'none',
              background: 'none',
              color: activeTab === 'reviews' ? 'var(--color-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'reviews' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <MessageSquare size={16} /> Customer Reviews ({product.reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('api')}
            style={{
              paddingBottom: '16px',
              border: 'none',
              background: 'none',
              color: activeTab === 'api' ? 'var(--color-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'api' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Code size={16} /> Developer REST Sandbox
          </button>
        </div>

        {/* Tab content renderer */}
        <div style={{ textAlign: 'left' }}>
          {activeTab === 'specs' && (
            <div>
              {Object.keys(product.specs || {}).length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No technical specifications defined for this product.</p>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px'
                }}>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div 
                      key={key} 
                      style={{
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {key}
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: '500' }}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Review Input Form */}
              <form onSubmit={handleAddReview} className="glass-panel" style={{
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '32px',
                background: 'rgba(0,0,0,0.15)',
              }}>
                <h4 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.1rem' }}>Write a Review</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 150px',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      value={reviewUser}
                      onChange={(e) => setReviewUser(e.target.value)}
                      placeholder="e.g. Isaac Newton"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(e.target.value)}
                      className="form-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Review Details</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe your experience with this device..."
                    className="form-input"
                    rows={3}
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }} disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>

              {/* Reviews Feed list */}
              {product.reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No customer reviews yet. Be the first to share your thoughts!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {product.reviews.map((rev) => (
                    <div 
                      key={rev.id} 
                      style={{
                        paddingBottom: '20px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' }}>{rev.user}</span>
                          <span style={{ display: 'flex', gap: '1px' }}>{renderStars(rev.rating, 12)}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'api' && (
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                You can query this product directly using standard fetch operations. The JSON catalog supports CORS out of the box.
              </p>
              <div style={{ marginBottom: '16px' }}>
                <span className="badge badge-category" style={{ background: '#2563eb', color: '#fff', border: 'none', marginRight: '8px' }}>GET</span>
                <code style={{ fontSize: '0.9rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', color: '#a5b4fc', border: '1px solid rgba(255,255,255,0.05)' }}>
                  http://localhost:5000/api/products/{product.id}
                </code>
              </div>

              {/* Code block output */}
              <div style={{
                position: 'relative',
                background: '#090d16',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  <span>RESPONSE HEADER: application/json</span>
                  <span>STATUS: 200 OK</span>
                </div>
                <pre style={{
                  margin: 0,
                  padding: '16px',
                  overflowX: 'auto',
                  fontSize: '0.825rem',
                  color: '#34d399',
                  fontFamily: 'monospace',
                  lineHeight: '1.5'
                }}>
                  {JSON.stringify(product, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Related Items Section */}
      {relatedProducts.length > 0 && (
        <section style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '48px' }}>
          <h2 style={{ fontSize: '1.8rem', textAlign: 'left', marginBottom: '24px', color: '#fff' }}>Recommended Products</h2>
          <div className="product-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
