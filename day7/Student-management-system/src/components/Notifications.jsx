import { useState } from 'react';
const NOTIF_DATA = [
  { id: 1, icon: '⚠️', bg: 'rgba(239,68,68,0.15)', color: '#f87171', title: 'Low Attendance Alert', text: 'Jake Smith has dropped below 80% attendance threshold. Immediate counseling session recommended.', time: '5 min ago', category: 'Alert', unread: true },
  { id: 2, icon: '🎯', bg: 'rgba(6,182,212,0.15)', color: '#22d3ee', title: 'New Event Registration', text: 'Annual Science Fair has reached 70% capacity (142/200). Registration closes in 3 days.', time: '1 hr ago', category: 'Events', unread: true },
  { id: 3, icon: '📈', bg: 'rgba(16,185,129,0.15)', color: '#34d399', title: 'Grade Improvement', text: 'Emma Davis improved her Math grade from B+ to A this semester. Great progress!', time: '3 hrs ago', category: 'Academic', unread: false },
  { id: 4, icon: '👤', bg: 'rgba(108,99,255,0.15)', color: '#8b85ff', title: 'New Student Enrolled', text: 'Welcome! 3 new students have been added to Batch 2024. Please review their profiles.', time: '6 hrs ago', category: 'System', unread: false },
  { id: 5, icon: '🏆', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', title: 'Achievement Unlocked', text: 'Zoe Chen has been added to the Honor Roll for maintaining 4.0 GPA three semesters in a row!', time: '1 day ago', category: 'Academic', unread: false },
  { id: 6, icon: '📅', bg: 'rgba(6,182,212,0.15)', color: '#22d3ee', title: 'Attendance Report Ready', text: 'Monthly attendance report for June 2026 has been generated and is ready for review.', time: '1 day ago', category: 'Report', unread: false },
  { id: 7, icon: '🔐', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', title: 'System Maintenance', text: 'Scheduled maintenance on July 10, 2026 from 2:00 AM to 4:00 AM. System will be unavailable.', time: '2 days ago', category: 'System', unread: false },
];
export default function Notifications({ addToast }) {
  const [notifications, setNotifications] = useState(NOTIF_DATA);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const categories = ['all', 'Alert', 'Events', 'Academic', 'System', 'Report'];
  const filtered = notifications
    .filter(n => filter === 'all' || n.category === filter)
    .filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.text.toLowerCase().includes(search.toLowerCase()));
  const markAllRead = () => {
    setNotifications(n => n.map(x => ({ ...x, unread: false })));
    addToast('success', '✅ All notifications marked as read');
  };
  const markRead = (id) => {
    setNotifications(n => n.map(x => x.id === id ? { ...x, unread: false } : x));
  };
  const deleteNotif = (id) => {
    setNotifications(n => n.filter(x => x.id !== id));
  };
  const unreadCount = notifications.filter(n => n.unread).length;
  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 className="page-title">🔔 Notifications</h1>
          {unreadCount > 0 && <span className="badge badge-danger">{unreadCount} unread</span>}
        </div>
        <p className="page-subtitle">Stay updated with all system alerts and activities.</p>
      </div>
      {/* Actions */}
      <div className="filter-bar">
        <div className="filter-input-wrap" style={{ flex: 1 }}>
          <span className="filter-input-icon">🔍</span>
          <input
            id="notif-search"
            className="form-input"
            style={{ paddingLeft: 42 }}
            placeholder="Search notifications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} className={`tab-btn${filter === c ? ' active' : ''}`} style={{ padding: '8px 12px', flex: 'none' }} onClick={() => setFilter(c)}>
              {c === 'all' ? '🗂 All' : c}
            </button>
          ))}
        </div>
        <button className="btn-sm btn-sm-primary" onClick={markAllRead} id="mark-all-read-btn">✓ Mark All Read</button>
      </div>
      {/* Notifications List */}
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                gap: 16,
                padding: '18px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                borderLeft: n.unread ? '3px solid var(--primary)' : '3px solid transparent',
                background: n.unread ? 'rgba(108,99,255,0.04)' : 'transparent',
                transition: 'background 0.2s',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                {n.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4, gap: 12 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{n.title}</span>
                    {n.unread && <span className="badge badge-purple" style={{ marginLeft: 8, fontSize: '0.65rem' }}>New</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {n.unread && (
                      <button className="btn-sm btn-sm-primary" onClick={() => markRead(n.id)} id={`read-${n.id}`}>Read</button>
                    )}
                    <button className="btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }} onClick={() => deleteNotif(n.id)}>✕</button>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: 8 }}>{n.text}</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className="tag">{n.category}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>🕐 {n.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
