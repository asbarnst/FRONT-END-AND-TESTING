import { useState } from 'react';

const COLORS = ['#6c63ff', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#f97316', '#ec4899'];
const STREAMS = ['Computer Science', 'Arts & Humanities', 'Commerce', 'Engineering', 'Medical', 'Mathematics'];
const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];
const BATCHES = ['2024', '2023', '2022', '2021'];

const INITIAL_STUDENTS = [
  { id: 'STU-001', name: 'Alex Johnson', email: 'alex.j@edusphere.com', phone: '+1 555-0101', stream: 'Computer Science', batch: '2024', grade: 'A+', attendance: 98, gpa: 3.9, status: 'active', color: '#6c63ff', gender: 'Male', dob: '2005-03-15', address: '123 Oak Street, NY' },
  { id: 'STU-002', name: 'Emma Davis', email: 'emma.d@edusphere.com', phone: '+1 555-0102', stream: 'Arts & Humanities', batch: '2024', grade: 'A', attendance: 94, gpa: 3.7, status: 'active', color: '#06b6d4', gender: 'Female', dob: '2005-07-22', address: '456 Elm Ave, CA' },
  { id: 'STU-003', name: 'Chris Lee', email: 'chris.l@edusphere.com', phone: '+1 555-0103', stream: 'Engineering', batch: '2023', grade: 'B+', attendance: 87, gpa: 3.3, status: 'active', color: '#f59e0b', gender: 'Male', dob: '2004-11-08', address: '789 Pine Rd, TX' },
  { id: 'STU-004', name: 'Mia Rodriguez', email: 'mia.r@edusphere.com', phone: '+1 555-0104', stream: 'Medical', batch: '2024', grade: 'A', attendance: 96, gpa: 3.8, status: 'active', color: '#10b981', gender: 'Female', dob: '2005-01-30', address: '321 Maple Dr, FL' },
  { id: 'STU-005', name: 'Jake Smith', email: 'jake.s@edusphere.com', phone: '+1 555-0105', stream: 'Commerce', batch: '2022', grade: 'B', attendance: 79, gpa: 3.0, status: 'at-risk', color: '#ef4444', gender: 'Male', dob: '2003-09-14', address: '654 Cedar Ln, WA' },
  { id: 'STU-006', name: 'Zoe Chen', email: 'zoe.c@edusphere.com', phone: '+1 555-0106', stream: 'Mathematics', batch: '2023', grade: 'A+', attendance: 99, gpa: 4.0, status: 'active', color: '#8b5cf6', gender: 'Female', dob: '2004-05-17', address: '987 Birch Ct, IL' },
  { id: 'STU-007', name: 'Liam Taylor', email: 'liam.t@edusphere.com', phone: '+1 555-0107', stream: 'Engineering', batch: '2021', grade: 'A-', attendance: 92, gpa: 3.6, status: 'active', color: '#f97316', gender: 'Male', dob: '2002-12-03', address: '159 Walnut St, OH' },
  { id: 'STU-008', name: 'Ava Martinez', email: 'ava.m@edusphere.com', phone: '+1 555-0108', stream: 'Computer Science', batch: '2024', grade: 'B+', attendance: 88, gpa: 3.4, status: 'active', color: '#ec4899', gender: 'Female', dob: '2005-08-25', address: '753 Spruce Way, GA' },
];

function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState(student || {
    name: '', email: '', phone: '', stream: 'Computer Science', batch: '2024',
    grade: 'B', attendance: 85, gpa: 3.0, status: 'active', gender: 'Male',
    dob: '', address: '', color: COLORS[Math.floor(Math.random() * COLORS.length)],
  });

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = (e) => { e.preventDefault(); onSave(form); };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{student ? '✏️ Edit Student' : '➕ Add New Student'}</h3>
          <button className="modal-close" onClick={onClose} id="modal-close-btn">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Enter full name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="email@edusphere.com" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+1 555-0000" />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-input" type="date" value={form.dob} onChange={e => handleChange('dob', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stream</label>
                <select className="form-select" value={form.stream} onChange={e => handleChange('stream', e.target.value)}>
                  {STREAMS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Batch</label>
                <select className="form-select" value={form.batch} onChange={e => handleChange('batch', e.target.value)}>
                  {BATCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Grade</label>
                <select className="form-select" value={form.grade} onChange={e => handleChange('grade', e.target.value)}>
                  {GRADES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                  <option value="active">Active</option>
                  <option value="at-risk">At Risk</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="form-textarea" value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="Enter address" rows={2} />
            </div>
            <div className="form-group">
              <label className="form-label">Avatar Color</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <div
                    key={c}
                    onClick={() => handleChange('color', c)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                      border: form.color === c ? '3px solid white' : '3px solid transparent',
                      transition: 'transform 0.15s',
                      transform: form.color === c ? 'scale(1.25)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} id="save-student-btn">
              {student ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ student, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h3>🗑️ Delete Student</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center', padding: '32px 28px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
            Are you sure you want to remove <strong style={{ color: 'var(--text-primary)' }}>{student.name}</strong>?
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} id="confirm-delete-btn">Delete Student</button>
        </div>
      </div>
    </div>
  );
}

export default function Students({ students, setStudents, addToast }) {
  const [search, setSearch] = useState('');
  const [filterStream, setFilterStream] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  const filtered = students
    .filter(s => {
      const q = search.toLowerCase();
      return (s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.id?.toLowerCase().includes(q));
    })
    .filter(s => filterStream === 'all' || s.stream === filterStream)
    .filter(s => filterStatus === 'all' || s.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'attendance') return b.attendance - a.attendance;
      if (sortBy === 'gpa') return b.gpa - a.gpa;
      return 0;
    });

  const handleSave = (form) => {
    if (editStudent) {
      setStudents(s => s.map(x => x.id === editStudent.id ? { ...x, ...form } : x));
      addToast('success', '✅ Student updated successfully!');
    } else {
      const newId = `STU-${String(students.length + 1).padStart(3, '0')}`;
      setStudents(s => [...s, { ...form, id: newId }]);
      addToast('success', '✅ Student added successfully!');
    }
    setShowModal(false);
    setEditStudent(null);
  };

  const handleDelete = () => {
    setStudents(s => s.filter(x => x.id !== deleteStudent.id));
    addToast('error', '🗑️ Student removed.');
    setDeleteStudent(null);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">👥 Student Management</h1>
        <p className="page-subtitle">Manage and track all enrolled students.</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', val: students.length, color: '#6c63ff' },
          { label: 'Active', val: students.filter(s => s.status === 'active').length, color: '#10b981' },
          { label: 'At Risk', val: students.filter(s => s.status === 'at-risk').length, color: '#ef4444' },
          { label: 'Avg GPA', val: (students.reduce((a, s) => a + s.gpa, 0) / students.length).toFixed(1), color: '#f59e0b' },
        ].map((m, i) => (
          <div key={i} className="metric-card" style={{ flex: '1 1 160px' }}>
            <div className="metric-icon" style={{ color: m.color, fontSize: '1.5rem' }}>
              {['👥', '✅', '⚠️', '📊'][i]}
            </div>
            <div className="metric-info">
              <h3 style={{ color: m.color }}>{m.val}</h3>
              <p>{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-input-wrap">
          <span className="filter-input-icon">🔍</span>
          <input
            id="student-search"
            className="form-input"
            style={{ paddingLeft: 42 }}
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={filterStream} onChange={e => setFilterStream(e.target.value)} id="stream-filter">
          <option value="all">All Streams</option>
          {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} id="status-filter">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="at-risk">At Risk</option>
          <option value="inactive">Inactive</option>
        </select>
        <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)} id="sort-filter">
          <option value="name">Sort: Name</option>
          <option value="attendance">Sort: Attendance</option>
          <option value="gpa">Sort: GPA</option>
        </select>
        <button
          className="add-btn"
          id="add-student-btn"
          onClick={() => { setEditStudent(null); setShowModal(true); }}
        >
          ➕ Add Student
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Students ({filtered.length})</span>
          <button className="card-action-btn">📥 Export CSV</button>
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No students found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>ID</th>
                  <th>Stream</th>
                  <th>Batch</th>
                  <th>GPA</th>
                  <th>Attendance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar" style={{ background: s.color + '25', color: s.color }}>
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="student-name">{s.name}</div>
                          <div className="student-email">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><code style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-glass)', padding: '2px 8px', borderRadius: 4 }}>{s.id}</code></td>
                    <td><span className="tag">{s.stream}</span></td>
                    <td>{s.batch}</td>
                    <td><span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: s.gpa >= 3.7 ? '#10b981' : s.gpa >= 3.0 ? '#6c63ff' : '#f59e0b' }}>{s.gpa}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${s.attendance}%`, background: s.attendance >= 90 ? '#10b981' : '#f59e0b' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{s.attendance}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'active' ? 'badge-success' : s.status === 'at-risk' ? 'badge-danger' : 'badge-warning'}`}>
                        {s.status === 'active' ? '✓ Active' : s.status === 'at-risk' ? '⚠ At Risk' : '○ Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-sm btn-sm-primary" onClick={() => setViewStudent(s)} title="View">👁</button>
                        <button className="btn-sm btn-sm-primary" onClick={() => { setEditStudent(s); setShowModal(true); }} title="Edit">✏️</button>
                        <button className="btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }} onClick={() => setDeleteStudent(s)} title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && <StudentModal student={editStudent} onClose={() => { setShowModal(false); setEditStudent(null); }} onSave={handleSave} />}
      {deleteStudent && <DeleteConfirm student={deleteStudent} onClose={() => setDeleteStudent(null)} onConfirm={handleDelete} />}

      {/* View Student Modal */}
      {viewStudent && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewStudent(null)}>
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>👤 Student Profile</h3>
              <button className="modal-close" onClick={() => setViewStudent(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div className="student-avatar" style={{ width: 72, height: 72, fontSize: '1.8rem', background: viewStudent.color + '25', color: viewStudent.color, margin: '0 auto 12px', borderRadius: '50%' }}>
                  {viewStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem' }}>{viewStudent.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{viewStudent.id}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Email', val: viewStudent.email },
                  { label: 'Phone', val: viewStudent.phone },
                  { label: 'Stream', val: viewStudent.stream },
                  { label: 'Batch', val: viewStudent.batch },
                  { label: 'GPA', val: viewStudent.gpa },
                  { label: 'Attendance', val: `${viewStudent.attendance}%` },
                  { label: 'Grade', val: viewStudent.grade },
                  { label: 'Status', val: viewStudent.status },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.val}</div>
                  </div>
                ))}
              </div>
              {viewStudent.address && (
                <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', marginTop: 12 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>Address</div>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{viewStudent.address}</div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setViewStudent(null)}>Close</button>
              <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => { setEditStudent(viewStudent); setViewStudent(null); setShowModal(true); }}>Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { INITIAL_STUDENTS };
