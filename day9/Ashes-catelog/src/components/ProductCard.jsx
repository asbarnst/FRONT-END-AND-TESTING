import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useAppContext();

  return (
    <div className="product-card glass-panel">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        {product.isNew && <span className="badge-new">New</span>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        
        <div className="product-rating flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < product.rating ? '#fbbf24' : 'transparent'}
              color={i < product.rating ? '#fbbf24' : 'var(--text-secondary)'}
            />
          ))}
          <span className="rating-count">({product.reviews})</span>
        </div>

        <div className="product-footer flex items-center justify-between">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button 
            className="add-to-cart-btn"
            onClick={() => addToCart(product)}
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
