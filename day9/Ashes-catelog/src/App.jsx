import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import Catalog from './pages/Catalog';
import Auth from './pages/Auth';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
