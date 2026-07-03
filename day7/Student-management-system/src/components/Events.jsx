import { useState } from 'react';

const EVENT_BANNERS = [
  { emoji: '🔬', bg: 'linear-gradient(135deg, #1a1a4e, #2a1a5e)' },
  { emoji: '🎨', bg: 'linear-gradient(135deg, #1a0a2e, #2a0a3e)' },
  { emoji: '🏆', bg: 'linear-gradient(135deg, #1a2e0a, #2a3e0a)' },
  { emoji: '💻', bg: 'linear-gradient(135deg, #0a1a2e, #0a2a3e)' },
  { emoji: '🎭', bg: 'linear-gradient(135deg, #2e0a1a, #3e0a2a)' },
  { emoji: '📚', bg: 'linear-gradient(135deg, #1a2e2a, #0a2e2e)' },
];

const INITIAL_EVENTS = [
  {
    id: 'EVT-001', title: 'Annual Science Fair', category: 'Academic', date: '2026-07-15', time: '09:00',
    venue: 'Main Auditorium', desc: 'Showcase of student science projects and innovations from all departments.',
    capacity: 200, registered: 142, status: 'upcoming', banner: 0, organizer: 'Dr. Smith',
    tags: ['Science', 'Innovation', 'Exhibition'],
    colors: ['#6c63ff', '#06b6d4', '#10b981'],
  },
  {
    id: 'EVT-002', title: 'Art & Culture Week', category: 'Cultural', date: '2026-07-20', time: '10:00',
    venue: 'Arts Block', desc: 'A week-long celebration of art, music, dance and cultural heritage.',
    capacity: 150, registered: 98, status: 'upcoming', banner: 1, organizer: 'Ms. Rodriguez',
    tags: ['Arts', 'Music', 'Dance'],
    colors: ['#f59e0b', '#ec4899', '#8b5cf6'],
  },
  {
    id: 'EVT-003', title: 'Inter-School Sports Meet', category: 'Sports', date: '2026-08-05', time: '08:00',
    venue: 'Sports Complex', desc: 'Annual sports competition featuring 12 schools and 30+ events.',
    capacity: 500, registered: 387, status: 'upcoming', banner: 2, organizer: 'Mr. Thompson',
    tags: ['Sports', 'Athletics', 'Competition'],
    colors: ['#10b981', '#f59e0b', '#6c63ff'],
  },
  {
    id: 'EVT-004', title: 'Hackathon 2026', category: 'Tech', date: '2026-08-12', time: '09:00',
    venue: 'Computer Lab A & B', desc: '24-hour coding challenge. Build innovative solutions for real-world problems.',
    capacity: 120, registered: 120, status: 'full', banner: 3, organizer: 'Prof. Chen',
    tags: ['Coding', 'Innovation', 'Tech'],
    colors: ['#06b6d4', '#6c63ff', '#10b981'],
  },
  {
    id: 'EVT-005', title: 'Drama & Theatre Night', category: 'Cultural', date: '2026-06-15', time: '18:00',
    venue: 'Open Air Theatre', desc: 'Annual theatre showcase featuring original student plays and performances.',
    capacity: 300, registered: 298, status: 'completed', banner: 4, organizer: 'Ms. Williams',
    tags: ['Theatre', 'Drama', 'Performance'],
    colors: ['#ec4899', '#f97316', '#8b5cf6'],
  },
  {
    id: 'EVT-006', title: 'Book Fair & Reading Marathon', category: 'Academic', date: '2026-09-01', time: '10:00',
    venue: 'Library Hall', desc: 'Annual book fair with over 500 titles and a 12-hour reading marathon challenge.',
    capacity: 100, registered: 34, status: 'upcoming', banner: 5, organizer: 'Ms. Brown',
    tags: ['Reading', 'Books', 'Literature'],
    colors: ['#10b981', '#06b6d4', '#f59e0b'],
  },
];

const CATEGORIES = ['Academic', 'Cultural', 'Sports', 'Tech', 'Health', 'Workshop'];

function EventModal({ event, onClose, onSave }) {
  const [form, setForm] = useState(event || {
    title: '', category: 'Academic', date: '', time: '09:00',
    venue: '', desc: '', capacity: 100, organizer: '', tags: [], status: 'upcoming', banner: 0,
    colors: ['#6c63ff', '#06b6d4', '#10b981'], registered: 0,
  });
  const [tagInput, setTagInput] = useState('');

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const addTag = () => { if (tagInput.trim() && !form.tags.includes(tagInput.trim())) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(''); } };
  const removeTag = (tag) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{event ? '✏️ Edit Event' : '🎯 Create New Event'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input className="form-input" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="Enter event title" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => handleChange('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="full">Full</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input className="form-input" type="date" value={form.date} onChange={e => handleChange('date', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input className="form-input" type="time" value={form.time} onChange={e => handleChange('time', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Venue</label>
                <input className="form-input" value={form.venue} onChange={e => handleChange('venue', e.target.value)} placeholder="Event location" />
              </div>
              <div className="form-group">
                <label className="form-label">Capacity</label>
                <input className="form-input" type="number" value={form.capacity} onChange={e => handleChange('capacity', Number(e.target.value))} min={1} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Organizer</label>
              <input className="form-input" value={form.organizer} onChange={e => handleChange('organizer', e.target.value)} placeholder="Event organizer name" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={form.desc} onChange={e => handleChange('desc', e.target.value)} placeholder="Event description..." rows={3} />
            </div>
            <div className="form-group">
              <label className="form-label">Tags</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                {form.tags.map(t => (
                  <span key={t} className="tag" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {t}
                    <span onClick={() => removeTag(t)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>✕</span>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="form-input" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add tag..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                <button type="button" className="btn-sm btn-sm-primary" onClick={addTag}>Add</button>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} id="save-event-btn">
              {event ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EventCard({ event, onEdit, onDelete, onRegister, students }) {
  const b = EVENT_BANNERS[event.banner % EVENT_BANNERS.length];
  const fillPct = Math.round((event.registered / event.capacity) * 100);
  const displayStudents = students.slice(0, 3);

  const statusBadge = {
    upcoming: 'badge-info',
    ongoing: 'badge-success',
    completed: 'badge-purple',
    full: 'badge-warning',
    cancelled: 'badge-danger',
  };

  return (
    <div className="event-card">
      <div className="event-card-banner" style={{ background: b.bg }}>
        <span style={{ fontSize: '3.5rem', zIndex: 1 }}>{b.emoji}</span>
      </div>
      <div className="event-card-body">
        <div className="event-tags">
          <span className={`badge ${statusBadge[event.status] || 'badge-info'}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
          <span className="badge badge-purple">{event.category}</span>
        </div>
        <div className="event-title">{event.title}</div>
        <div className="event-desc">{event.desc}</div>
        <div className="event-meta">
          <div className="event-meta-item">📅 {new Date(event.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
          <div className="event-meta-item">⏰ {event.time}</div>
          <div className="event-meta-item">📍 {event.venue}</div>
          <div className="event-meta-item">👤 {event.organizer}</div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {event.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>

        {/* Capacity */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 5 }}>
            <span>Registered</span>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{event.registered}/{event.capacity}</span>
          </div>
          <div className="progress-bar" style={{ height: 5 }}>
            <div className="progress-fill" style={{
              width: `${fillPct}%`,
              background: fillPct >= 90 ? '#ef4444' : fillPct >= 70 ? '#f59e0b' : '#10b981'
            }} />
          </div>
        </div>

        <div className="event-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: -4 }}>
            {displayStudents.map((s, i) => (
              <div key={s.id} className="event-attendee-avatar" style={{ background: s.color + '25', color: s.color, zIndex: displayStudents.length - i }}>
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
            <span className="event-count-badge">+{event.registered - 3}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {event.status === 'upcoming' && event.registered < event.capacity && (
              <button className="btn-sm btn-sm-success" onClick={() => onRegister(event.id)} id={`register-${event.id}`}>Register</button>
            )}
            <button className="btn-sm btn-sm-primary" onClick={() => onEdit(event)} id={`edit-${event.id}`}>✏️</button>
            <button className="btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }} onClick={() => onDelete(event.id)}>🗑</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Events({ students, addToast }) {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = events
    .filter(e => filter === 'all' || e.status === filter || e.category === filter)
    .filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.desc.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (form) => {
    if (editEvent) {
      setEvents(evs => evs.map(e => e.id === editEvent.id ? { ...e, ...form } : e));
      addToast('success', '✅ Event updated!');
    } else {
      const newId = `EVT-${String(events.length + 1).padStart(3, '0')}`;
      setEvents(evs => [...evs, { ...form, id: newId, registered: 0, banner: Math.floor(Math.random() * 6) }]);
      addToast('success', '🎯 Event created successfully!');
    }
    setShowModal(false);
    setEditEvent(null);
  };

  const handleDelete = (id) => {
    setEvents(evs => evs.filter(e => e.id !== id));
    addToast('error', '🗑️ Event removed.');
  };

  const handleRegister = (id) => {
    setEvents(evs => evs.map(e => {
      if (e.id === id) {
        const newReg = e.registered + 1;
        const newStatus = newReg >= e.capacity ? 'full' : e.status;
        return { ...e, registered: newReg, status: newStatus };
      }
      return e;
    }));
    addToast('success', '🎉 Successfully registered for event!');
  };

  const filterOptions = [
    { val: 'all', label: '🗂 All Events' },
    { val: 'upcoming', label: '🔜 Upcoming' },
    { val: 'ongoing', label: '▶️ Ongoing' },
    { val: 'completed', label: '✅ Completed' },
    { val: 'Academic', label: '📚 Academic' },
    { val: 'Cultural', label: '🎨 Cultural' },
    { val: 'Sports', label: '🏆 Sports' },
    { val: 'Tech', label: '💻 Tech' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">🎯 Events Management</h1>
        <p className="page-subtitle">Organize and track all school events and activities.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Events', val: events.length, color: '#6c63ff', icon: '🎯' },
          { label: 'Upcoming', val: events.filter(e => e.status === 'upcoming').length, color: '#06b6d4', icon: '🔜' },
          { label: 'Completed', val: events.filter(e => e.status === 'completed').length, color: '#10b981', icon: '✅' },
          { label: 'Total Registered', val: events.reduce((a, e) => a + e.registered, 0), color: '#f59e0b', icon: '👥' },
        ].map((m, i) => (
          <div key={i} className="metric-card" style={{ flex: '1 1 160px' }}>
            <div className="metric-icon">{m.icon}</div>
            <div className="metric-info">
              <h3 style={{ color: m.color }}>{m.val}</h3>
              <p>{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <div className="filter-input-wrap" style={{ flex: '1 1 200px' }}>
          <span className="filter-input-icon">🔍</span>
          <input
            id="event-search"
            className="form-input"
            style={{ paddingLeft: 42 }}
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {filterOptions.map(f => (
            <button
              key={f.val}
              className={`tab-btn${filter === f.val ? ' active' : ''}`}
              style={{ flex: 'none', padding: '8px 12px' }}
              onClick={() => setFilter(f.val)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="add-btn" id="add-event-btn" onClick={() => { setEditEvent(null); setShowModal(true); }}>
          ➕ Add Event
        </button>
      </div>

      {/* Events Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3>No events found</h3>
          <p>Create your first event or adjust filters</p>
        </div>
      ) : (
        <div className="events-grid">
          {filtered.map(event => (
            <EventCard
              key={event.id}
              event={event}
              students={students}
              onEdit={e => { setEditEvent(e); setShowModal(true); }}
              onDelete={handleDelete}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}

      {showModal && <EventModal event={editEvent} onClose={() => { setShowModal(false); setEditEvent(null); }} onSave={handleSave} />}
    </div>
  );
}
