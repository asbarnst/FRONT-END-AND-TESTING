import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Contact from './pages/Contact';

// Toast notifications wrapper
function ToastNotificationOutlet() {
  const { toasts } = useCatalog();
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast"
          style={{
            borderLeftColor:
              toast.type === 'error' ? '#ef4444' :
              toast.type === 'warning' ? '#f59e0b' :
              toast.type === 'info' ? '#3b82f6' : 'var(--color-primary)'
          }}
        >
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

// Protected route — redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { user } = useCatalog();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        {/* Sticky Navbar */}
        <Navbar />

        {/* Page Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />

        {/* Toast Alerts */}
        <ToastNotificationOutlet />
      </div>
    </Router>
  );
}

function App() {
  return (
    <CatalogProvider>
      <AppContent />
    </CatalogProvider>
  );
}

export default App;
