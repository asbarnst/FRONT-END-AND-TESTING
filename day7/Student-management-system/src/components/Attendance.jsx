import { useState, useEffect } from 'react';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function generateAttendance() {
  const statuses = ['present', 'present', 'present', 'present', 'absent', 'late', 'present', 'present', 'present', 'absent'];
  return Array.from({ length: 28 }, () => statuses[Math.floor(Math.random() * statuses.length)]);
}

function generateHeatmap() {
  const heat = ['h0', 'h1', 'h2', 'h3', 'h4'];
  return Array.from({ length: 52 }, () => heat[Math.floor(Math.random() * heat.length)]);
}

export default function Attendance({ students, addToast }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('CS-101');
  const [attendanceData, setAttendanceData] = useState({});
  const [tab, setTab] = useState('mark');
  const [animBars, setAnimBars] = useState(false);

  const classes = ['CS-101', 'CS-102', 'MATH-201', 'ENG-301', 'PHY-101', 'ARTS-150'];
  const key = `${selectedDate}_${selectedClass}`;

  useEffect(() => {
    const t = setTimeout(() => setAnimBars(true), 300);
    return () => clearTimeout(t);
  }, [tab]);

  useEffect(() => {
    if (!attendanceData[key]) {
      const initial = {};
      students.forEach(s => {
        const r = Math.random();
        initial[s.id] = r > 0.85 ? 'absent' : r > 0.75 ? 'late' : 'present';
      });
      setAttendanceData(prev => ({ ...prev, [key]: initial }));
    }
  }, [key, students]);

  const today = attendanceData[key] || {};

  const markAll = (status) => {
    const newData = {};
    students.forEach(s => newData[s.id] = status);
    setAttendanceData(prev => ({ ...prev, [key]: { ...prev[key], ...newData } }));
    addToast('success', `✅ All students marked as ${status}`);
  };

  const toggleStatus = (studentId) => {
    const statuses = ['present', 'absent', 'late'];
    const current = today[studentId] || 'present';
    const nextIdx = (statuses.indexOf(current) + 1) % statuses.length;
    setAttendanceData(prev => ({
      ...prev,
      [key]: { ...prev[key], [studentId]: statuses[nextIdx] },
    }));
  };

  const saveAttendance = () => {
    addToast('success', `✅ Attendance saved for ${selectedClass} on ${selectedDate}`);
  };

  const presentCount = Object.values(today).filter(v => v === 'present').length;
  const absentCount = Object.values(today).filter(v => v === 'absent').length;
  const lateCount = Object.values(today).filter(v => v === 'late').length;
  const total = students.length;
  const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  // Monthly overview data
  const monthlyData = students.slice(0, 6).map(s => ({
    ...s,
    history: generateAttendance(),
    heatmap: generateHeatmap(),
    presentDays: Math.floor(Math.random() * 10) + 18,
    absentDays: Math.floor(Math.random() * 4),
    lateDays: Math.floor(Math.random() * 3),
  }));

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">📅 Attendance Tracking</h1>
        <p className="page-subtitle">Mark and monitor student attendance with precision.</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['mark', 'overview', 'heatmap'].map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)} id={`tab-${t}`}>
            {t === 'mark' ? '✏️ Mark Attendance' : t === 'overview' ? '📊 Student Overview' : '🔥 Heatmap'}
          </button>
        ))}
      </div>

      {tab === 'mark' && (
        <>
          {/* Controls */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body">
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
                  <label className="form-label">Date</label>
                  <input type="date" className="form-input" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} id="attendance-date" />
                </div>
                <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
                  <label className="form-label">Class / Subject</label>
                  <select className="form-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} id="class-select">
                    {classes.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button className="btn-sm btn-sm-success" onClick={() => markAll('present')} id="mark-all-present">✓ All Present</button>
                  <button className="btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }} onClick={() => markAll('absent')}>✗ All Absent</button>
                  <button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: '0.875rem' }} onClick={saveAttendance} id="save-attendance-btn">💾 Save</button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Present', val: presentCount, color: '#10b981', pct: total > 0 ? (presentCount / total * 100).toFixed(0) : 0 },
              { label: 'Absent', val: absentCount, color: '#ef4444', pct: total > 0 ? (absentCount / total * 100).toFixed(0) : 0 },
              { label: 'Late', val: lateCount, color: '#f59e0b', pct: total > 0 ? (lateCount / total * 100).toFixed(0) : 0 },
              { label: 'Total', val: total, color: '#6c63ff', pct: 100 },
            ].map((m, i) => (
              <div key={i} className="metric-card" style={{ flex: '1 1 150px' }}>
                <div style={{ fontSize: '1.5rem' }}>{['✅', '❌', '⏰', '👥'][i]}</div>
                <div className="metric-info">
                  <h3 style={{ color: m.color }}>{m.val}</h3>
                  <p>{m.label} ({m.pct}%)</p>
                </div>
              </div>
            ))}
          </div>

          {/* Attendance Rate Visual */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
                    <svg viewBox="0 0 100 100" width={100} height={100}>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
                      <circle
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke={pct >= 90 ? '#10b981' : pct >= 75 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="12"
                        strokeDasharray={`${pct * 2.513} 251.3`}
                        strokeDashoffset="62.8"
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1s ease', transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.4rem', color: pct >= 90 ? '#10b981' : '#f59e0b' }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Attendance Rate</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                    <span className="badge badge-success">Class: {selectedClass}</span>
                    <span className="badge badge-info">Date: {selectedDate}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {pct >= 90 ? '🎉 Excellent attendance today! Great engagement from the class.' :
                      pct >= 75 ? '📊 Moderate attendance. Follow up with absent students.' :
                        '⚠️ Low attendance today. Immediate action recommended.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Student Attendance — {selectedClass}</span>
              <span className="badge badge-info">{selectedDate}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>ID</th>
                    <th>Overall %</th>
                    <th>Today's Status</th>
                    <th>Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => {
                    const status = today[s.id] || 'present';
                    return (
                      <tr key={s.id}>
                        <td>
                          <div className="student-cell">
                            <div className="student-avatar" style={{ background: s.color + '25', color: s.color }}>
                              {s.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="student-name">{s.name}</div>
                              <div className="student-email">{s.stream}</div>
                            </div>
                          </div>
                        </td>
                        <td><code style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-glass)', padding: '2px 8px', borderRadius: 4 }}>{s.id}</code></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="progress-bar" style={{ width: 50 }}>
                              <div className="progress-fill" style={{ width: `${s.attendance}%`, background: s.attendance >= 90 ? '#10b981' : '#f59e0b' }} />
                            </div>
                            <span style={{ fontSize: '0.8rem' }}>{s.attendance}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${status === 'present' ? 'badge-success' : status === 'absent' ? 'badge-danger' : 'badge-warning'}`}>
                            {status === 'present' ? '✓ Present' : status === 'absent' ? '✗ Absent' : '⏰ Late'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-sm"
                            onClick={() => toggleStatus(s.id)}
                            style={{
                              background: status === 'present' ? 'rgba(16,185,129,0.1)' : status === 'absent' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                              color: status === 'present' ? '#34d399' : status === 'absent' ? '#f87171' : '#fbbf24',
                              border: `1px solid ${status === 'present' ? 'rgba(16,185,129,0.3)' : status === 'absent' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                            }}
                            id={`toggle-${s.id}`}
                          >
                            Toggle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'overview' && (
        <div className="attendance-grid">
          {monthlyData.map(s => {
            const present = s.history.filter(h => h === 'present').length;
            const absent = s.history.filter(h => h === 'absent').length;
            const late = s.history.filter(h => h === 'late').length;
            const pct = Math.round((present / s.history.length) * 100);
            return (
              <div key={s.id} className="attendance-card">
                <div className="attendance-header">
                  <div className="att-avatar" style={{ background: s.color + '25', color: s.color }}>
                    {s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="att-info">
                    <h3>{s.name}</h3>
                    <p>{s.stream} · {s.batch}</p>
                  </div>
                  <span className={`badge ${pct >= 90 ? 'badge-success' : pct >= 75 ? 'badge-warning' : 'badge-danger'}`}>{pct}%</span>
                </div>
                <div className="attendance-stats-row">
                  <div className="att-stat">
                    <div className="att-stat-val" style={{ color: '#10b981' }}>{present}</div>
                    <div className="att-stat-label">Present</div>
                  </div>
                  <div className="att-stat">
                    <div className="att-stat-val" style={{ color: '#ef4444' }}>{absent}</div>
                    <div className="att-stat-label">Absent</div>
                  </div>
                  <div className="att-stat">
                    <div className="att-stat-val" style={{ color: '#f59e0b' }}>{late}</div>
                    <div className="att-stat-label">Late</div>
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>Monthly Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 8 }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 90 ? 'linear-gradient(to right,#10b981,#34d399)' : pct >= 75 ? 'linear-gradient(to right,#f59e0b,#fbbf24)' : 'linear-gradient(to right,#ef4444,#f87171)' }} />
                  </div>
                </div>
                <div className="att-calendar">
                  {s.history.map((h, i) => (
                    <div key={i} className={`att-day ${h}`} title={h} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'heatmap' && (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <span className="card-title">🔥 Annual Attendance Heatmap</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {['h0', 'h1', 'h2', 'h3', 'h4'].map((h, i) => (
                  <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div className={`heatmap-cell ${h}`} style={{ width: 12, height: 12, display: 'inline-block', borderRadius: 2 }} />
                    {['0%', '25%', '50%', '75%', '100%'][i]}
                  </div>
                ))}
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                {MONTHS.map(m => <span key={m} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flex: 1, textAlign: 'center', minWidth: 30 }}>{m}</span>)}
              </div>
              <div className="heatmap-grid">
                {generateHeatmap().concat(generateHeatmap()).map((h, i) => (
                  <div key={i} className={`heatmap-cell ${h}`} title={`Week ${i + 1}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">📊 Monthly Breakdown</span>
            </div>
            <div className="card-body">
              <div className="bar-chart" style={{ height: 160 }}>
                {MONTHS.map((m, i) => {
                  const val = 75 + Math.floor(Math.random() * 25);
                  return (
                    <div key={m} className="bar-item">
                      <div className="bar-val">{animBars ? val : 0}%</div>
                      <div className="bar" style={{
                        height: animBars ? `${val}%` : '0%',
                        background: val >= 90 ? 'linear-gradient(to top,#10b981,#34d399)' : val >= 80 ? 'linear-gradient(to top,#6c63ff,#8b85ff)' : 'linear-gradient(to top,#f59e0b,#fbbf24)',
                        transition: `height 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.05}s`,
                      }} />
                      <div className="bar-label">{m}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
