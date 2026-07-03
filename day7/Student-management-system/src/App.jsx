import { useState, useEffect, useCallback } from 'react';
import './index.css';

import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Students, { INITIAL_STUDENTS } from './components/Students';
import Attendance from './components/Attendance';
import Events from './components/Events';
import Analysis from './components/Analysis';
import Grades from './components/Grades';
import Notifications from './components/Notifications';
import Settings from './components/Settings';

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard', section: 'Main Menu' },
  { id: 'students', icon: '👥', label: 'Students', section: 'Main Menu' },
  { id: 'attendance', icon: '📅', label: 'Attendance', section: 'Main Menu' },
  { id: 'events', icon: '🎯', label: 'Events', section: 'Main Menu' },
  { id: 'analysis', icon: '🧠', label: 'AI Analysis', section: 'Advanced' },
  { id: 'grades', icon: '📝', label: 'Grades', section: 'Advanced' },
  { id: 'notifications', icon: '🔔', label: 'Notifications', section: 'Advanced' },
  { id: 'settings', icon: '⚙️', label: 'Settings', section: 'System' },
];

function Sidebar({ activePage, setActivePage, user, onLogout, studentCount, unreadNotifs }) {
  const sections = [...new Set(NAV_ITEMS.map(n => n.section))];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">🎓</div>
        <div className="sidebar-brand">
          <h2>Student management system</h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => (
          <div key={section}>
            <div className="sidebar-section-label">{section}</div>
            {NAV_ITEMS.filter(n => n.section === section).map(item => (
              <div
                key={item.id}
                id={`nav-${item.id}`}
                className={`nav-item${activePage === item.id ? ' active' : ''}`}
                onClick={() => setActivePage(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setActivePage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.id === 'students' && (
                  <span className="nav-badge">{studentCount}</span>
                )}
                {item.id === 'notifications' && unreadNotifs > 0 && (
                  <span className="nav-badge">{unreadNotifs}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-mini">
          <div className="user-avatar-mini">{user.avatar}</div>
          <div className="user-info-mini">
            <div className="user-name-mini">{user.name}</div>
            <div className="user-role-mini">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          </div>
          <button className="logout-btn-mini" onClick={onLogout} title="Logout" id="logout-btn">
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ activePage, user, notifications, onNotifClick, showNotif, notifRef }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  const pageTitles = {
    dashboard: 'Dashboard',
    students: 'Students',
    attendance: 'Attendance',
    events: 'Events',
    analysis: 'AI Analysis',
    grades: 'Grades',
    notifications: 'Notifications',
    settings: 'Settings',
  };

  return (
    <header className="topbar">
      <div className="topbar-search">
        <span className="topbar-search-icon">🔍</span>
        <input id="global-search" type="search" placeholder={`Search in ${pageTitles[activePage]}...`} />
      </div>

      <div className="topbar-actions">
        <div className="topbar-date">📅 {dateStr}</div>

        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="topbar-btn"
            id="notif-topbar-btn"
            onClick={onNotifClick}
            title="Notifications"
          >
            🔔
            {notifications > 0 && <span className="notif-dot" />}
          </button>
          {showNotif && (
            <div className="notif-panel">
              <div className="notif-header">
                <strong style={{ fontSize: '0.875rem' }}>Notifications</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)' }}>{notifications} unread</span>
              </div>
              <div className="notif-item unread">
                <div className="notif-icon-wrap" style={{ background: 'rgba(239,68,68,0.15)' }}>⚠️</div>
                <div className="notif-text">
                  <h4>Attendance Alert</h4>
                  <p>5 students below threshold today</p>
                  <div className="notif-time">2 min ago</div>
                </div>
              </div>
              <div className="notif-item unread">
                <div className="notif-icon-wrap" style={{ background: 'rgba(245,158,11,0.15)' }}>🎯</div>
                <div className="notif-text">
                  <h4>New Event</h4>
                  <p>Science Fair — Registration open</p>
                  <div className="notif-time">1 hr ago</div>
                </div>
              </div>
              <div className="notif-item">
                <div className="notif-icon-wrap" style={{ background: 'rgba(16,185,129,0.15)' }}>📈</div>
                <div className="notif-text">
                  <h4>Grade Update</h4>
                  <p>Mid-term results published</p>
                  <div className="notif-time">3 hrs ago</div>
                </div>
              </div>
              <div style={{ padding: '12px 20px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--primary-light)', cursor: 'pointer' }}>View all notifications →</span>
              </div>
            </div>
          )}
        </div>

        <div
          className="user-avatar-mini"
          style={{ cursor: 'pointer', flexShrink: 0, width: 36, height: 36, fontSize: '1rem' }}
          title={user.name}
        >
          {user.avatar}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [toasts, setToasts] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = { current: null };

  // Toast system
  const addToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    addToast('success', `🎉 Welcome back, ${u.name.split(' ')[0]}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('edusphere_user');
    setUser(null);
    addToast('info', '👋 You have been logged out.');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (!user) return;
      if (e.altKey) {
        const map = { '1': 'dashboard', '2': 'students', '3': 'attendance', '4': 'events', '5': 'analysis' };
        if (map[e.key]) { e.preventDefault(); setActivePage(map[e.key]); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [user]);

  if (!user) return (
    <>
      <LoginPage onLogin={handleLogin} />
      <Toast toasts={toasts} />
    </>
  );

  const pageProps = { students, setStudents, addToast, user };
  const pages = {
    dashboard: <Dashboard {...pageProps} />,
    students: <Students {...pageProps} />,
    attendance: <Attendance {...pageProps} />,
    events: <Events {...pageProps} />,
    analysis: <Analysis {...pageProps} />,
    grades: <Grades {...pageProps} />,
    notifications: <Notifications {...pageProps} />,
    settings: <Settings {...pageProps} />,
  };

  return (
    <>
      <div className="app-layout">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          user={user}
          onLogout={handleLogout}
          studentCount={students.length}
          unreadNotifs={2}
        />

        <div className="main-content">
          <Topbar
            activePage={activePage}
            user={user}
            notifications={2}
            onNotifClick={() => setShowNotif(!showNotif)}
            showNotif={showNotif}
            notifRef={notifRef}
          />

          <main>
            {pages[activePage] || pages.dashboard}
          </main>
        </div>
      </div>

      <Toast toasts={toasts} />
    </>
  );
}
