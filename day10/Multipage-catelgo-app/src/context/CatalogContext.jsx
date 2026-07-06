import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CatalogContext = createContext();

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('catalog_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Comparison state (up to 3 products)
  const [compareList, setCompareList] = useState([]);

  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ashes_theme');
    return saved ? saved : 'dark';
  });

  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ashes_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ashes_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('catalog_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Alert notifier function
  const triggerToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      triggerToast('Error loading categories', 'error');
    }
  }, [triggerToast]);

  // Fetch filtered products
  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (filters.category && filters.category !== 'all') {
        query.append('category', filters.category);
      }
      if (filters.search) {
        query.append('search', filters.search);
      }
      if (filters.minPrice) {
        query.append('minPrice', filters.minPrice);
      }
      if (filters.maxPrice) {
        query.append('maxPrice', filters.maxPrice);
      }
      if (filters.rating) {
        query.append('rating', filters.rating);
      }
      if (filters.sort) {
        query.append('sort', filters.sort);
      }

      const res = await fetch(`/api/products?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      triggerToast('Error updating products feed', 'error');
    } finally {
      setLoading(false);
    }
  }, [triggerToast]);

  // Add Product (Create)
  const addProduct = async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Failed to save product');
      const newProd = await res.json();
      setProducts((prev) => [...prev, newProd]);
      fetchCategories(); // Refresh category product counts
      triggerToast(`${newProd.name} added to catalog successfully.`);
      return { success: true, product: newProd };
    } catch (err) {
      triggerToast(err.message || 'Error saving new product', 'error');
      return { success: false, error: err.message };
    }
  };

  // Update Product (Edit)
  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Failed to update product details');
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      triggerToast(`${updated.name} updated successfully.`);
      return { success: true, product: updated };
    } catch (err) {
      triggerToast(err.message || 'Error updating product info', 'error');
      return { success: false, error: err.message };
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product from database');
      const data = await res.json();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setCompareList((prev) => prev.filter((p) => p.id !== id));
      setWishlist((prev) => prev.filter((item) => item.id !== id));
      fetchCategories(); // Refresh categories item counts
      triggerToast('Product deleted successfully');
      return { success: true };
    } catch (err) {
      triggerToast(err.message || 'Error removing product', 'error');
      return { success: false, error: err.message };
    }
  };

  // Toggle Wishlist
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const isExist = prev.some((item) => item.id === product.id);
      if (isExist) {
        triggerToast(`${product.name} removed from wishlist`, 'info');
        return prev.filter((item) => item.id !== product.id);
      } else {
        triggerToast(`${product.name} added to wishlist`);
        return [...prev, product];
      }
    });
  };

  // Toggle Comparison
  const toggleComparison = (product) => {
    setCompareList((prev) => {
      const isExist = prev.some((item) => item.id === product.id);
      if (isExist) {
        triggerToast(`${product.name} removed from comparison list`, 'info');
        return prev.filter((item) => item.id !== product.id);
      }
      if (prev.length >= 3) {
        triggerToast('You can compare a maximum of 3 products at a time.', 'warning');
        return prev;
      }
      triggerToast(`${product.name} added to comparison list`);
      return [...prev, product];
    });
  };

  const clearComparison = () => {
    setCompareList([]);
    triggerToast('Comparison list cleared', 'info');
  };

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const loginWithGoogle = useCallback((profile) => {
    setUser(profile);
    localStorage.setItem('ashes_user', JSON.stringify(profile));
    triggerToast(`Welcome back, ${profile.name}!`);
  }, [triggerToast]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ashes_user');
    triggerToast('Logged out successfully', 'info');
  }, [triggerToast]);

  return (
    <CatalogContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        wishlist,
        compareList,
        toasts,
        triggerToast,
        fetchProducts,
        fetchCategories,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleWishlist,
        toggleComparison,
        clearComparison,
        theme,
        toggleTheme,
        user,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
