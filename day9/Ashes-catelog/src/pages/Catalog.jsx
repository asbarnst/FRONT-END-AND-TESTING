import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import SidebarFilter from '../components/SidebarFilter';
import ProductCard from '../components/ProductCard';
import './Catalog.css';

// Mock Data
const MOCK_PRODUCTS = [
  { id: 1, name: 'Obsidian Smart Watch', category: 'Electronics', price: 299.99, rating: 5, reviews: 124, isNew: true, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Ashes Signature Backpack', category: 'Accessories', price: 89.00, rating: 4, reviews: 89, isNew: false, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Minimalist Desk Lamp', category: 'Home', price: 45.50, rating: 4, reviews: 32, isNew: false, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Ergonomic Office Chair', category: 'Furniture', price: 450.00, rating: 5, reviews: 210, isNew: true, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Wireless Earbuds Pro', category: 'Electronics', price: 159.99, rating: 5, reviews: 450, isNew: false, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'Matte Black Coffee Mug', category: 'Home', price: 18.00, rating: 4, reviews: 56, isNew: false, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80' },
];

const CATEGORIES = ['Electronics', 'Accessories', 'Home', 'Furniture'];

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="catalog-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content flex justify-between items-center">
          <div className="hero-text">
            <h1 className="hero-title">Elevate Your Everyday.</h1>
            <p className="hero-subtitle">Discover premium, thoughtfully designed products built for the modern era.</p>
            <button className="btn-primary hero-btn">Shop the Collection</button>
          </div>
          <div className="hero-image-container">
            {/* abstract shapes or gradient orb */}
            <div className="gradient-orb"></div>
          </div>
        </div>
      </section>

      {/* Main Catalog Layout */}
      <main className="container catalog-layout">
        <SidebarFilter 
          categories={CATEGORIES} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        <div className="product-grid-container">
          <div className="catalog-header flex justify-between items-center">
            <h2 className="section-title">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory} 
              <span className="product-count">({filteredProducts.length})</span>
            </h2>
            <div className="sort-dropdown">
              <select className="input-field select-field">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Catalog;
