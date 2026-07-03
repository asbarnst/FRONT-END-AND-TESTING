import { useState } from 'react';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'History'];

export default function Grades({ students, addToast }) {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('all');

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const getSubjectGrade = (studentId, sub) => {
    const seed = (studentId?.charCodeAt(4) || 0) + sub.length;
    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];
    return grades[seed % grades.length];
  };

  const gradeColor = (g) => {
    if (g === 'A+' || g === 'A') return '#10b981';
    if (g === 'A-' || g === 'B+') return '#6c63ff';
    if (g === 'B' || g === 'B-') return '#f59e0b';
    return '#ef4444';
  };

  const gradeToGpa = (g) => {
    const map = { 'A+': 4.0, 'A': 3.7, 'A-': 3.3, 'B+': 3.0, 'B': 2.7, 'B-': 2.3, 'C+': 2.0, 'C': 1.7 };
    return map[g] || 2.0;
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">📝 Grades & Performance</h1>
        <p className="page-subtitle">Track and manage student grades across all subjects.</p>
      </div>

      {/* GPA Distribution */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Honor Roll (≥3.7)', val: students.filter(s => s.gpa >= 3.7).length, color: '#10b981', icon: '🌟' },
          { label: 'Good Standing (3.0-3.7)', val: students.filter(s => s.gpa >= 3.0 && s.gpa < 3.7).length, color: '#6c63ff', icon: '✅' },
          { label: 'Academic Probation (<3.0)', val: students.filter(s => s.gpa < 3.0).length, color: '#f59e0b', icon: '⚠️' },
          { label: 'Class Average GPA', val: (students.reduce((a, s) => a + s.gpa, 0) / students.length).toFixed(2), color: '#06b6d4', icon: '📊' },
        ].map((m, i) => (
          <div key={i} className="metric-card" style={{ flex: '1 1 180px' }}>
            <div className="metric-icon">{m.icon}</div>
            <div className="metric-info">
              <h3 style={{ color: m.color }}>{m.val}</h3>
              <p>{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-input-wrap" style={{ flex: 1 }}>
          <span className="filter-input-icon">🔍</span>
          <input
            id="grades-search"
            className="form-input"
            style={{ paddingLeft: 42 }}
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={subject} onChange={e => setSubject(e.target.value)}>
          <option value="all">All Subjects</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="add-btn" onClick={() => addToast('success', '📊 Grade report exported!')}>📥 Export</button>
      </div>

      {/* Grades Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Grade Sheet ({filtered.length} students)</span>
          <span className="badge badge-info">Current Semester</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>GPA</th>
                {(subject === 'all' ? SUBJECTS : [subject]).map(s => (
                  <th key={s}>{s.length > 8 ? s.slice(0, 8) + '.' : s}</th>
                ))}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const subs = subject === 'all' ? SUBJECTS : [subject];
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar" style={{ background: s.color + '25', color: s.color, width: 32, height: 32, fontSize: '0.8rem' }}>
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="student-name" style={{ fontSize: '0.82rem' }}>{s.name}</div>
                          <div className="student-email">{s.batch}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: s.gpa >= 3.7 ? '#10b981' : s.gpa >= 3.0 ? '#6c63ff' : '#f59e0b' }}>
                        {s.gpa}
                      </span>
                    </td>
                    {subs.map(sub => {
                      const g = getSubjectGrade(s.id, sub);
                      return (
                        <td key={sub}>
                          <span style={{ fontWeight: 700, color: gradeColor(g), fontFamily: 'Space Grotesk' }}>{g}</span>
                        </td>
                      );
                    })}
                    <td>
                      <span className={`badge ${s.gpa >= 3.7 ? 'badge-success' : s.gpa >= 3.0 ? 'badge-info' : 'badge-warning'}`}>
                        {s.gpa >= 3.7 ? '🌟 Honor' : s.gpa >= 3.0 ? '✓ Good' : '⚠ Probation'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Performance Cards */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, marginBottom: 16, fontSize: '1.1rem' }}>Subject-wise Performance</h2>
        <div className="grid-3">
          {SUBJECTS.map((sub, i) => {
            const avg = 72 + (i * 7 + 3) % 25;
            const passRate = 88 + i % 12;
            return (
              <div key={sub} className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, marginBottom: 3 }}>{sub}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{students.length} students</div>
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.4rem', color: avg >= 85 ? '#10b981' : avg >= 75 ? '#6c63ff' : '#f59e0b' }}>
                      {avg}%
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>Class Average</span>
                      <span>{avg}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 6 }}>
                      <div className="progress-fill" style={{
                        width: `${avg}%`,
                        background: avg >= 85 ? '#10b981' : avg >= 75 ? '#6c63ff' : '#f59e0b'
                      }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Pass Rate</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>{passRate}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
