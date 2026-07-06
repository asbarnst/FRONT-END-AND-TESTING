import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, Star } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export default function Filters({ activeFilters, onChangeFilters, onResetFilters }) {
  const { categories } = useCatalog();

  const handleTextChange = (e) => {
    onChangeFilters(e.target.name, e.target.value);
  };

  const handleCategorySelect = (slug) => {
    onChangeFilters('category', slug);
  };

  const handleRatingSelect = (rating) => {
    onChangeFilters('rating', rating);
  };

  return (
    <aside className="glass-panel" style={{
      padding: '24px',
      position: 'sticky',
      top: '104px',
      alignSelf: 'start',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      height: 'fit-content'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px'
      }}>
        <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
          <SlidersHorizontal size={18} className="gradient-text" /> Filters
        </h3>
        <button
          onClick={onResetFilters}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Reset All"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="form-label">Search Catalog</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            name="search"
            value={activeFilters.search || ''}
            onChange={handleTextChange}
            placeholder="Type search terms..."
            className="form-input"
            style={{ paddingLeft: '40px' }}
          />
          <Search size={16} style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
        </div>
      </div>

      {/* Category Choices */}
      <div>
        <label className="form-label">Category</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => handleCategorySelect('all')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: activeFilters.category === 'all' ? 'var(--color-primary)' : 'var(--border-color)',
              background: activeFilters.category === 'all' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(0,0,0,0.15)',
              color: activeFilters.category === 'all' ? '#fff' : 'var(--text-secondary)',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: activeFilters.category === 'all' ? '600' : 'normal',
              fontSize: '0.875rem'
            }}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategorySelect(cat.slug)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeFilters.category === cat.slug ? 'var(--color-primary)' : 'var(--border-color)',
                background: activeFilters.category === cat.slug ? 'rgba(99, 102, 241, 0.12)' : 'rgba(0,0,0,0.15)',
                color: activeFilters.category === cat.slug ? '#fff' : 'var(--text-secondary)',
                textAlign: 'left',
                cursor: 'pointer',
                fontWeight: activeFilters.category === cat.slug ? '600' : 'normal',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ textTransform: 'capitalize' }}>{cat.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="form-label">Price Range ($)</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="number"
            name="minPrice"
            value={activeFilters.minPrice || ''}
            onChange={handleTextChange}
            placeholder="Min"
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          />
          <span style={{ color: 'var(--text-muted)' }}>–</span>
          <input
            type="number"
            name="maxPrice"
            value={activeFilters.maxPrice || ''}
            onChange={handleTextChange}
            placeholder="Max"
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="form-label">Minimum Rating</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 3, 4, 4.5].map((stars) => {
            const isSelected = activeFilters.rating === stars.toString() || (stars === 0 && !activeFilters.rating);
            return (
              <button
                key={stars}
                onClick={() => handleRatingSelect(stars === 0 ? '' : stars.toString())}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(0,0,0,0.15)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px'
                }}
              >
                {stars === 0 ? 'Any' : (
                  <>
                    {stars} <Star size={10} fill="#fbbf24" stroke="none" style={{ transform: 'translateY(-1px)' }} />
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
