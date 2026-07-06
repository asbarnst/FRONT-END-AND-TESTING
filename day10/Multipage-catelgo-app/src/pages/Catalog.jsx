import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Heart, Filter, LayoutGrid } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';

export default function Catalog() {
  const { products, wishlist, loading, error, fetchProducts, fetchCategories } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();

  // Local filter states initialized from URL Search Params
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || 'featured'
  });

  const isWishlistMode = searchParams.get('wishlist') === 'true';

  // Sync state with URL params
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || 'all',
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      rating: searchParams.get('rating') || '',
      sort: searchParams.get('sort') || 'featured'
    });
  }, [searchParams]);

  // Load products whenever active filter states change (unless in Wishlist mode)
  useEffect(() => {
    fetchCategories();
    if (!isWishlistMode) {
      fetchProducts(filters);
    }
  }, [filters, isWishlistMode, fetchProducts, fetchCategories]);

  // Handle updates to specific filters
  const handleChangeFilters = (name, value) => {
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    // Write to URL search params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    
    // Always preserve wishlist param if present
    if (isWishlistMode) {
      newParams.set('wishlist', 'true');
    }
    
    setSearchParams(newParams);
  };

  // Reset filters
  const handleResetFilters = () => {
    const defaultFilters = {
      category: 'all',
      search: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: 'featured'
    };
    setFilters(defaultFilters);
    
    const newParams = new URLSearchParams();
    if (isWishlistMode) {
      newParams.set('wishlist', 'true');
    }
    setSearchParams(newParams);
  };

  // Determine what products to display
  const displayedProducts = isWishlistMode ? wishlist : products;

  return (
    <main className="container animate-fade-in" style={{ paddingBlock: '40px' }}>
      {/* Title / Banner Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        paddingBottom: '20px'
      }}>
        <div>
          {isWishlistMode ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={28} style={{ color: '#ef4444', fill: '#ef4444' }} />
              <h1 style={{ fontSize: '2.5rem', margin: 0, display: 'inline-block' }}>My Wishlist Collection</h1>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LayoutGrid size={28} className="gradient-text" />
              <h1 style={{ fontSize: '2.5rem', margin: 0, display: 'inline-block' }}>Products Catalog</h1>
            </div>
          )}
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            {isWishlistMode 
              ? 'Your liked products stored locally in your session' 
              : 'Explore cutting-edge hardware, monitors, and lighting equipment.'
            }
          </p>
        </div>

        {/* Wishlist Back shortcut */}
        {isWishlistMode && (
          <Link to="/catalog" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        )}

        {/* Sort drop down list */}
        {!isWishlistMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Sort By</span>
            <select
              value={filters.sort}
              onChange={(e) => handleChangeFilters('sort', e.target.value)}
              className="form-input"
              style={{
                width: '180px',
                padding: '8px 12px',
                fontSize: '0.875rem',
                borderRadius: '8px',
                background: 'rgba(22, 28, 45, 0.95)',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        )}
      </div>

      {/* Catalog Split Grid */}
      <div className="grid-catalog">
        {/* Sidebar Filters */}
        {!isWishlistMode ? (
          <Filters
            activeFilters={filters}
            onChangeFilters={handleChangeFilters}
            onResetFilters={handleResetFilters}
          />
        ) : (
          /* Mini Help card in Wishlist Mode */
          <aside className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '12px' }}>Personal Vault</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              Items are saved securely in your browser's LocalStorage. They will persist even if the Express API server restarts!
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Wishlist contains: <strong>{wishlist.length} items</strong>
            </div>
          </aside>
        )}

        {/* Products Grid Content */}
        <section>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              color: 'var(--text-secondary)'
            }}>
              Loading catalog items...
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="glass-panel" style={{
              padding: '60px 40px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <Filter size={48} style={{ opacity: 0.3, color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>No Products Found</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {isWishlistMode
                  ? 'Your wishlist is currently empty. Browse the catalog and click the heart icon to save products.'
                  : 'We could not find any products matching your query or filter configurations.'
                }
              </p>
              {!isWishlistMode && (
                <button onClick={handleResetFilters} className="btn btn-primary" style={{ marginTop: '8px' }}>
                  <RotateCcw size={16} /> Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div>
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '16px',
                textAlign: 'left'
              }}>
                Showing <strong>{displayedProducts.length}</strong> products
              </div>
              <div className="product-grid">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
