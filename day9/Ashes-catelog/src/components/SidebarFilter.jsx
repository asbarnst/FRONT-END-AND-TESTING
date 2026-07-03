import React from 'react';
import './SidebarFilter.css';

const SidebarFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <aside className="sidebar-filter glass-panel">
      <div className="filter-section">
        <h3 className="filter-title">Categories</h3>
        <ul className="filter-list">
          <li className="filter-item">
            <button 
              className={`filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => onSelectCategory('All')}
            >
              All Products
            </button>
          </li>
          {categories.map((category, index) => (
            <li key={index} className="filter-item">
              <button 
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => onSelectCategory(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Price Range</h3>
        <div className="price-range">
          <input type="range" min="0" max="1000" className="range-slider" />
          <div className="price-labels flex justify-between">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilter;
