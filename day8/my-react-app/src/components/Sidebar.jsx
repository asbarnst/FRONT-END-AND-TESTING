import { useState } from 'react';

// Sidebar navigation component
function Sidebar({ currentPage, onPageChange, currentUser, onLogout }) {
  // List of navigation menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'students', label: 'Students', icon: '👨‍🎓' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'analysis', label: 'Analysis', icon: '📊' },
  ];

  return (
    <div className="sidebar">
      {/* Sidebar Header - show app name and logged in user */}
      <div className="sidebar-header">
        <h3>🎓 SMS</h3>
        <p>Welcome, {currentUser.username}!</p>
        <p style={{ fontSize: '11px', color: '#a78bfa', marginTop: '2px' }}>
          Role: {currentUser.role}
        </p>
      </div>

      {/* Navigation Menu */}
      <div className="sidebar-nav">
        {menuItems.map(function(item) {
          return (
            <button
              key={item.id}
              className={currentPage === item.id ? 'active' : ''}
              onClick={() => onPageChange(item.id)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Logout Button at bottom */}
      <button className="logout-btn" onClick={onLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

export default Sidebar;
