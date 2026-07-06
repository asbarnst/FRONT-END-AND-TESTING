import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Database, Sliders, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import AdminForm from '../components/AdminForm';

export default function Admin() {
  const { products, loading, fetchProducts, addProduct, updateProduct, deleteProduct } = useCatalog();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Open form for creating
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  // Handle Cancel
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // Handle Save
  const handleSave = async (formData) => {
    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, formData);
    } else {
      result = await addProduct(formData);
    }

    if (result.success) {
      setIsFormOpen(false);
      setEditingProduct(null);
    }
  };

  // Stats computation
  const totalItems = products.length;
  const featuredItems = products.filter(p => p.featured).length;
  const outOfStockItems = products.filter(p => !p.inStock).length;

  return (
    <main className="container animate-fade-in" style={{ paddingBlock: '40px' }}>
      {/* Title Panel */}
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
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={28} className="gradient-text-accent" /> Nexus Database
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            Manage catalog entries, define hardware parameters, and sync database JSON structures.
          </p>
        </div>

        {!isFormOpen && (
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <Plus size={16} /> Add New Entry
          </button>
        )}
      </div>

      {/* Aggregate Stats Cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
            <Database size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL CATALOG ITEMS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{totalItems}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-secondary)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>FEATURED COLLECTIONS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{featuredItems}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>STOCK OUTS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{outOfStockItems}</div>
          </div>
        </div>
      </section>

      {/* Editor Drawer / Form Card */}
      {isFormOpen && (
        <section className="glass-panel animate-fade-in" style={{
          padding: '32px',
          marginBottom: '40px',
          borderColor: 'var(--color-primary)',
          background: 'rgba(13, 20, 38, 0.75)',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '8px' }}>
            {editingProduct ? `Edit Listing: ${editingProduct.name}` : 'Create New Hardware Catalog Entry'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Fill out standard parameters. Custom spec rows will map into key-value entries in products.json.
          </p>

          <AdminForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </section>
      )}

      {/* Products Grid database View */}
      <section className="glass-panel" style={{
        overflowX: 'auto',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'rgba(22, 28, 45, 0.2)'
      }}>
        {loading && !isFormOpen ? (
          <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>Loading catalog database...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: '60px 40px', color: 'var(--text-muted)' }}>
            <HelpCircle size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>Database is empty. Click "Add New Entry" to populate details.</p>
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.9rem',
            color: 'var(--text-primary)',
            minWidth: '700px'
          }}>
            <thead>
              <tr style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderBottom: '1px solid var(--border-color)',
                color: 'var(--text-muted)'
              }}>
                <th style={{ padding: '16px 20px', fontWeight: 'bold' }}>Device</th>
                <th style={{ padding: '16px 20px', fontWeight: 'bold' }}>Category</th>
                <th style={{ padding: '16px 20px', fontWeight: 'bold' }}>MSRP Value</th>
                <th style={{ padding: '16px 20px', fontWeight: 'bold' }}>Status</th>
                <th style={{ padding: '16px 20px', fontWeight: 'bold' }}>Featured</th>
                <th style={{ padding: '16px 20px', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    background: editingProduct?.id === product.id ? 'rgba(99, 102, 241, 0.05)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (editingProduct?.id !== product.id) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (editingProduct?.id !== product.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {/* Info details */}
                  <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                        borderRadius: '6px'
                      }} 
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: '#fff' }}>{product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {product.id}</div>
                    </div>
                  </td>
                  
                  {/* Category */}
                  <td style={{ padding: '16px 20px', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                    {product.category}
                  </td>
                  
                  {/* Price */}
                  <td style={{ padding: '16px 20px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                    ${product.price.toFixed(2)}
                  </td>
                  
                  {/* Stock */}
                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge ${product.inStock ? 'badge-stock-in' : 'badge-stock-out'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                      {product.inStock ? 'In Stock' : 'Stock Out'}
                    </span>
                  </td>

                  {/* Featured */}
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      background: product.featured ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255,255,255,0.05)',
                      color: product.featured ? '#f472b6' : 'var(--text-muted)',
                      border: product.featured ? '1px solid rgba(236,72,153,0.3)' : '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {product.featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  
                  {/* Action buttons */}
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleOpenEdit(product)}
                        className="btn-icon-only"
                        style={{ width: '32px', height: '32px' }}
                        title="Edit entry"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="btn-icon-only"
                        style={{ width: '32px', height: '32px', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                        title="Delete entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
