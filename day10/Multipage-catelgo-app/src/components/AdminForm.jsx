import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';

export default function AdminForm({ product, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('audio');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [inStock, setInStock] = useState(true);

  // Dynamic spec list: array of { key, value }
  const [specsList, setSpecsList] = useState([]);

  // Populate fields if editing an existing product
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setPrice(product.price || '');
      setDescription(product.description || '');
      setCategory(product.category || 'audio');
      setImage(product.image || '');
      setFeatured(!!product.featured);
      setInStock(product.inStock !== false);
      
      const formattedSpecs = Object.entries(product.specs || {}).map(([k, v]) => ({
        key: k,
        value: v
      }));
      setSpecsList(formattedSpecs);
    } else {
      // Clear form for new product
      setName('');
      setPrice('');
      setDescription('');
      setCategory('audio');
      setImage('');
      setFeatured(false);
      setInStock(true);
      setSpecsList([
        { key: 'Weight', value: '' },
        { key: 'Connectivity', value: '' }
      ]);
    }
  }, [product]);

  // Manage specs
  const handleAddSpecRow = () => {
    setSpecsList([...specsList, { key: '', value: '' }]);
  };

  const handleRemoveSpecRow = (index) => {
    setSpecsList(specsList.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specsList];
    updated[index][field] = value;
    setSpecsList(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !description) return;

    // Convert spec array back into a key-value object
    const specsObject = {};
    specsList.forEach(item => {
      if (item.key.trim() && item.value.trim()) {
        specsObject[item.key.trim()] = item.value.trim();
      }
    });

    const payload = {
      name: name.trim(),
      price: parseFloat(price),
      description: description.trim(),
      category,
      image: image.trim() || undefined,
      featured,
      inStock,
      specs: specsObject
    };

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {/* Name */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Product Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mechanical Workmate Keyboard"
            className="form-input"
            required
          />
        </div>

        {/* Price */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">MSRP Price ($) *</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="99.99"
            className="form-input"
            required
          />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {/* Category */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
            style={{ cursor: 'pointer' }}
          >
            <option value="audio">Audio</option>
            <option value="wearables">Wearables</option>
            <option value="workspace">Workspace</option>
            <option value="smart-home">Smart Home</option>
          </select>
        </div>

        {/* Image URL */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Product Image URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="form-input"
          />
        </div>
      </div>

      {/* Description */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed paragraph explaining features and construction..."
          className="form-input"
          rows={3}
          style={{ resize: 'vertical' }}
          required
        />
      </div>

      {/* Switches Grid */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              accentColor: 'var(--color-primary)'
            }}
          />
          <span style={{ color: '#fff', fontWeight: '600' }}>Mark as Featured item</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              accentColor: 'var(--color-secondary)'
            }}
          />
          <span style={{ color: '#fff', fontWeight: '600' }}>Item In-Stock</span>
        </label>
      </div>

      {/* Technical Specs List */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '8px',
          marginBottom: '12px'
        }}>
          <span className="form-label" style={{ marginBottom: 0 }}>Technical Specifications</span>
          <button
            type="button"
            onClick={handleAddSpecRow}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px' }}
          >
            <Plus size={12} /> Add Row
          </button>
        </div>

        {specsList.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', italic: true }}>No custom specs defined yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {specsList.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="e.g. Battery Life"
                  value={item.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
                <input
                  type="text"
                  placeholder="e.g. Up to 40 Hours"
                  value={item.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecRow(idx)}
                  className="btn btn-secondary"
                  style={{
                    padding: '8px 10px',
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.05)'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '20px',
        marginTop: '10px'
      }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          style={{ padding: '10px 20px' }}
        >
          <X size={16} /> Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '10px 24px' }}
        >
          <Save size={16} /> Save Product
        </button>
      </div>
    </form>
  );
}
