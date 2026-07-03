import { useState, useRef, useEffect } from 'react';
const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard', section: 'main' },
  { id: 'students', icon: '👥', label: 'Students', section: 'main', badge: null },
  { id: 'attendance', icon: '📅', label: 'Attendance', section: 'main' },
  { id: 'events', icon: '🎯', label: 'Events', section: 'main' },
  { id: 'analysis', icon: '🧠', label: 'AI Analysis', section: 'advanced' },
  { id: 'grades', icon: '📝', label: 'Grades', section: 'advanced' },
  { id: 'notifications', icon: '🔔', label: 'Notifications', section: 'advanced' },
  { id: 'settings', icon: '⚙️', label: 'Settings', section: 'system' },
];
const NOTIFICATIONS = [
  { id: 1, icon: '📋', color: 'rgba(108,99,255,0.15)', title: 'Attendance Alert', text: '5 students absent today in CS-101', time: '2 min ago', unread: true },
  { id: 2, icon: '🎯', color: 'rgba(245,158,11,0.15)', title: 'New Event Added', text: 'Annual Science Fair scheduled for July 15', time: '1 hr ago', unread: true },
  { id: 3, icon: '📈', color: 'rgba(16,185,129,0.15)', title: 'Grade Update', text: 'Mid-term results are now available', time: '3 hrs ago', unread: false },
  { id: 4, icon: '👤', color: 'rgba(6,182,212,0.15)', title: 'New Student', text: 'Emma Davis enrolled in Batch 2024', time: '1 day ago', unread: false },
];
export default function Sidebar({ activePage, setActivePage, user, onLogout, studentCount }) {
  const [showNotif, setShowNotif] = useState(false);
  const [unreadCount, setUnreadCount] = useState(NOTIFICATIONS.filter(n => n.unread).length);
  const notifRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const sections = {
    main: navItems.filter(n => n.section === 'main'),
    advanced: navItems.filter(n => n.section === 'advanced'),
    system: navItems.filter(n => n.section === 'system'),
  };
  const sectionLabels = { main: 'Main Menu', advanced: 'Advanced', system: 'System' };
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">🎓</div>
          <div className="sidebar-brand">
            <h2>EduSphere</h2>
            <p>Management System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {Object.entries(sections).map(([key, items]) => (
            <div key={key}>
              <div className="sidebar-section-label">{sectionLabels[key]}</div>
              {items.map(item => (
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
                  {item.id === 'students' && studentCount && (
                    <span className="nav-badge">{studentCount}</span>
                  )}
                  {item.id === 'notifications' && unreadCount > 0 && (
                    <span className="nav-badge">{unreadCount}</span>
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
              <div className="user-role-mini">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
            </div>
            <button
              className="logout-btn-mini"
              onClick={onLogout}
              title="Logout"
              id="logout-btn"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>
      {/* Topbar */}
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <header className="topbar">
          <div className="topbar-search">
            <span className="topbar-search-icon">🔍</span>
            <input
              id="global-search"
              type="search"
              placeholder="Search students, events, courses..."
            />
          </div>
          <div className="topbar-actions">
            <div className="topbar-date">{dateStr}</div>

            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                className="topbar-btn"
                id="notif-btn"
                onClick={() => { setShowNotif(!showNotif); setUnreadCount(0); }}
                title="Notifications"
              >
                🔔
                {unreadCount > 0 && <span className="notif-dot" />}
              </button>
              {showNotif && (
                <div className="notif-panel">
                  <div className="notif-header">
                    <strong style={{ fontSize: '0.875rem' }}>Notifications</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}>Mark all read</span>
                  </div>
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className={`notif-item${n.unread ? ' unread' : ''}`}>
                      <div className="notif-icon-wrap" style={{ background: n.color }}>
                        {n.icon}
                      </div>
                      <div className="notif-text">
                        <h4>{n.title}</h4>
                        <p>{n.text}</p>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="topbar-btn" id="theme-btn" title="Toggle Theme">🌙</button>
            <div className="user-avatar-mini" style={{ cursor: 'pointer', flexShrink: 0 }}>{user.avatar}</div>
          </div>
        </header>
      </div>
    </>
  );
}
