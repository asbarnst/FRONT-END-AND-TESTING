import { useEffect, useState } from 'react';

const BAR_DATA = [
  { label: 'Mon', val: 88 },
  { label: 'Tue', val: 92 },
  { label: 'Wed', val: 78 },
  { label: 'Thu', val: 95 },
  { label: 'Fri', val: 85 },
  { label: 'Sat', val: 60 },
  { label: 'Sun', val: 45 },
];

const DONUT_DATA = [
  { label: 'Science', value: 35, color: '#6c63ff' },
  { label: 'Arts', value: 25, color: '#06b6d4' },
  { label: 'Commerce', value: 22, color: '#f59e0b' },
  { label: 'Engineering', value: 18, color: '#10b981' },
];

const RECENT_STUDENTS = [
  { id: 'STU-001', name: 'Alex Johnson', email: 'alex.j@edusphere.com', grade: 'A+', attendance: 98, status: 'active', color: '#6c63ff' },
  { id: 'STU-002', name: 'Emma Davis', email: 'emma.d@edusphere.com', grade: 'A', attendance: 94, status: 'active', color: '#06b6d4' },
  { id: 'STU-003', name: 'Chris Lee', email: 'chris.l@edusphere.com', grade: 'B+', attendance: 87, status: 'active', color: '#f59e0b' },
  { id: 'STU-004', name: 'Mia Rodriguez', email: 'mia.r@edusphere.com', grade: 'A', attendance: 96, status: 'active', color: '#10b981' },
  { id: 'STU-005', name: 'Jake Smith', email: 'jake.s@edusphere.com', grade: 'B', attendance: 79, status: 'at-risk', color: '#ef4444' },
];

const ACTIVITIES = [
  { icon: '👤', color: '#6c63ff', bg: 'rgba(108,99,255,0.15)', title: 'New student enrolled', text: 'Emma Davis joined Batch 2024-CS', time: '5 min ago' },
  { icon: '📋', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', title: 'Attendance marked', text: 'CS-101 morning session completed', time: '1 hr ago' },
  { icon: '🎯', color: '#10b981', bg: 'rgba(16,185,129,0.15)', title: 'Event registered', text: '12 students joined Science Fair', time: '2 hrs ago' },
  { icon: '📝', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', title: 'Grades updated', text: 'Mid-term results published for Grade 10', time: '4 hrs ago' },
  { icon: '🧠', color: '#8b85ff', bg: 'rgba(108,99,255,0.1)', title: 'AI Report ready', text: 'Weekly performance analysis generated', time: '1 day ago' },
];

function DonutChart({ data }) {
  const size = 120;
  const cx = size / 2, cy = size / 2;
  const r = 40;
  const strokeWidth = 18;
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="donut-chart-wrap">
      <svg width={size} height={size} className="donut-svg" viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const dashArray = (d.value / total) * circumference;
          const dashOffset = circumference - (cumulative / total) * circumference;
          cumulative += d.value;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashArray} ${circumference - dashArray}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px`, transition: 'stroke-dasharray 1s ease' }}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r - strokeWidth / 2 - 2} fill="var(--bg-card)" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="800" fontFamily="Space Grotesk">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="8">
          students
        </text>
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={i} className="donut-legend-item">
            <div className="donut-dot" style={{ background: d.color }} />
            <span className="donut-legend-label">{d.label}</span>
            <span className="donut-legend-value" style={{ color: d.color }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart() {
  const data = [65, 72, 68, 80, 77, 85, 88, 82, 91, 87, 93, 96];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const w = 500, h = 120, padX = 10, padY = 10;
  const minV = Math.min(...data) - 5;
  const maxV = Math.max(...data) + 5;
  const xStep = (w - padX * 2) / (data.length - 1);
  const yScale = (v) => padY + (h - padY * 2) * (1 - (v - minV) / (maxV - minV));

  const points = data.map((v, i) => [padX + i * xStep, yScale(v)]);
  const polyline = points.map(p => p.join(',')).join(' ');
  const area = `M${points[0][0]},${h} ` + points.map(p => `L${p[0]},${p[1]}`).join(' ') + ` L${points[points.length - 1][0]},${h} Z`;

  return (
    <div className="line-chart-wrap">
      <svg viewBox={`0 0 ${w} ${h + 20}`} className="line-chart-svg" style={{ height: 140 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#lineGrad)" />
        <polyline points={polyline} fill="none" stroke="#6c63ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#6c63ff" stroke="var(--bg-card)" strokeWidth="2" />
        ))}
        {months.map((m, i) => (
          <text key={i} x={padX + i * xStep} y={h + 16} textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="Inter">
            {m}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function Dashboard({ students }) {
  const [animBars, setAnimBars] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimBars(true), 300);
    return () => clearTimeout(t);
  }, []);

  const totalStudents = students.length || 2487;
  const activeStudents = students.filter(s => s.status === 'active').length || 2341;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">📊 Dashboard Overview</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening at EduSphere today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {[
          { color: 'purple', icon: '👥', val: totalStudents.toLocaleString(), label: 'Total Students', change: '+12 this month', up: true },
          { color: 'green', icon: '✅', val: '96.2%', label: 'Avg Attendance', change: '+1.2% from last week', up: true },
          { color: 'amber', icon: '🎯', val: '48', label: 'Active Events', change: '5 this week', up: true },
          { color: 'cyan', icon: '📈', val: '87.4', label: 'Avg GPA', change: '-0.3 from last term', up: false },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`}>
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-value">{s.val}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className={`stat-card-change ${s.up ? 'change-up' : 'change-down'}`}>
              {s.up ? '↑' : '↓'} {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-12" style={{ marginBottom: 20 }}>
        {/* Attendance Line Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📈 Attendance Trend (2024)</span>
            <button className="card-action-btn">Export</button>
          </div>
          <div className="card-body">
            <LineChart />
          </div>
        </div>

        {/* Enrollment Donut */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🎓 Enrollment by Stream</span>
          </div>
          <div className="card-body">
            <DonutChart data={DONUT_DATA} />
          </div>
        </div>
      </div>

      {/* Weekly Attendance Bar + Activity */}
      <div className="grid-12" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">📅 Weekly Attendance</span>
            <span className="badge badge-success">This Week</span>
          </div>
          <div className="card-body">
            <div className="bar-chart">
              {BAR_DATA.map((b, i) => (
                <div key={i} className="bar-item">
                  <div className="bar-val">{animBars ? b.val : 0}%</div>
                  <div
                    className="bar"
                    style={{
                      height: animBars ? `${b.val}%` : '0%',
                      background: b.val >= 90
                        ? 'linear-gradient(to top, #10b981, #34d399)'
                        : b.val >= 75
                        ? 'linear-gradient(to top, #6c63ff, #8b85ff)'
                        : 'linear-gradient(to top, #f59e0b, #fbbf24)',
                    }}
                  />
                  <div className="bar-label">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">⚡ Recent Activity</span>
            <button className="card-action-btn">View All</button>
          </div>
          <div className="card-body" style={{ padding: '12px 20px' }}>
            <div className="timeline">
              {ACTIVITIES.map((a, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" style={{ background: a.color }} />
                  <div className="timeline-content">
                    <h4>{a.title}</h4>
                    <p>{a.text}</p>
                    <div className="timeline-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">👥 Recent Students</span>
          <button className="card-action-btn">View All</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Grade</th>
                <th>Attendance</th>
                <th>Status</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_STUDENTS.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar" style={{ background: s.color + '30', color: s.color }}>
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="student-name">{s.name}</div>
                        <div className="student-email">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><code style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-glass)', padding: '2px 8px', borderRadius: 4 }}>{s.id}</code></td>
                  <td><span style={{ fontWeight: 700, fontFamily: 'Space Grotesk', color: s.color }}>{s.grade}</span></td>
                  <td><span style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{s.attendance}%</span></td>
                  <td>
                    <span className={`badge ${s.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {s.status === 'active' ? '✓ Active' : '⚠ At Risk'}
                    </span>
                  </td>
                  <td style={{ minWidth: 100 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${s.attendance}%`, background: s.attendance > 90 ? '#10b981' : s.attendance > 80 ? '#6c63ff' : '#f59e0b' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
