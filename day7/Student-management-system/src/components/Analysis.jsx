import { useState, useEffect } from 'react';

function RadarChart({ data }) {
  const size = 200;
  const cx = size / 2, cy = size / 2;
  const r = 70;
  const n = data.length;

  const getPoint = (i, radius) => {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  };

  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const dataPoints = data.map((d, i) => getPoint(i, (d.value / 100) * r));
  const dataPath = dataPoints.map(p => p.join(',')).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: 200, margin: '0 auto', display: 'block' }}>
      {/* Grid */}
      {levels.map((level, li) => {
        const pts = data.map((_, i) => getPoint(i, level * r).join(','));
        return <polygon key={li} points={pts.join(' ')} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}
      {/* Axes */}
      {data.map((_, i) => {
        const [x, y] = getPoint(i, r);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}
      {/* Data polygon */}
      <polygon points={dataPath} fill="rgba(108,99,255,0.2)" stroke="#6c63ff" strokeWidth="2" />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#6c63ff" stroke="var(--bg-card)" strokeWidth="2" />
      ))}
      {/* Labels */}
      {data.map((d, i) => {
        const [x, y] = getPoint(i, r + 18);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="var(--text-muted)" fontSize="8" fontFamily="Inter">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

function ScoreGauge({ score, color, size = 80 }) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = score / 100;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${pct * circumference} ${circumference}`}
        strokeDashoffset={circumference * 0.25}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1.5s ease' }}
      />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="var(--text-primary)" fontSize="13" fontWeight="800" fontFamily="Space Grotesk">
        {score}
      </text>
    </svg>
  );
}

const AI_INSIGHTS = [
  {
    icon: '⚠️',
    title: 'At-Risk Students Detected',
    text: 'AI identified 3 students showing declining attendance (>15% drop) and grade deterioration. Immediate counseling recommended.',
    severity: 'warning',
    action: 'View Students',
  },
  {
    icon: '🚀',
    title: 'High Achievers Identified',
    text: '12 students consistently scoring above 95% across all subjects. Consider advanced placement or enrichment programs.',
    severity: 'success',
    action: 'View Report',
  },
  {
    icon: '📈',
    title: 'Attendance Improvement Trend',
    text: 'Overall attendance has improved by 4.2% over the last 3 months. Monday attendance is weakest — scheduling adjustments may help.',
    severity: 'info',
    action: 'Analyze Trend',
  },
  {
    icon: '🎯',
    title: 'Event Engagement Peak',
    text: 'Tech-related events show 94% registration fill rate vs 67% for other categories. Students prefer hands-on experiences.',
    severity: 'success',
    action: 'View Events',
  },
  {
    icon: '🔄',
    title: 'Grade Distribution Anomaly',
    text: 'CS-101 shows unusually high F rate (18%) this semester. Curriculum review or additional support sessions recommended.',
    severity: 'danger',
    action: 'Investigate',
  },
];

function PredictionCard({ title, value, trend, description, color }) {
  return (
    <div className="card" style={{ border: `1px solid ${color}30` }}>
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{title}</div>
          <span style={{ fontSize: '0.75rem', color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
            {trend === 'up' ? '↑ Rising' : trend === 'down' ? '↓ Falling' : '→ Stable'}
          </span>
        </div>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.8rem', fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{description}</div>
      </div>
    </div>
  );
}

export default function Analysis({ students }) {
  const [tab, setTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [animDone, setAnimDone] = useState(false);

  useEffect(() => { setTimeout(() => setAnimDone(true), 500); }, []);

  const radarData = [
    { label: 'Attendance', value: 88 },
    { label: 'GPA', value: 85 },
    { label: 'Events', value: 72 },
    { label: 'Grades', value: 91 },
    { label: 'Behavior', value: 78 },
    { label: 'Engage', value: 84 },
  ];

  const avgGpa = (students.reduce((a, s) => a + s.gpa, 0) / students.length).toFixed(2);
  const avgAttendance = Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length);
  const atRisk = students.filter(s => s.status === 'at-risk' || s.attendance < 85).length;
  const topStudents = students.filter(s => s.gpa >= 3.7).length;

  const gradeDistribution = [
    { label: 'A+', count: students.filter(s => s.grade === 'A+').length, color: '#10b981' },
    { label: 'A', count: students.filter(s => s.grade === 'A').length, color: '#6c63ff' },
    { label: 'A-', count: students.filter(s => s.grade === 'A-').length, color: '#06b6d4' },
    { label: 'B+', count: students.filter(s => s.grade === 'B+').length, color: '#f59e0b' },
    { label: 'B', count: students.filter(s => s.grade === 'B').length, color: '#f97316' },
    { label: 'B-', count: students.filter(s => s.grade === 'B-').length || 1, color: '#ef4444' },
  ];
  const maxCount = Math.max(...gradeDistribution.map(g => g.count), 1);

  const streamData = [
    { stream: 'CS', avg: 88, count: students.filter(s => s.stream === 'Computer Science').length },
    { stream: 'Arts', avg: 82, count: students.filter(s => s.stream === 'Arts & Humanities').length },
    { stream: 'Eng', avg: 85, count: students.filter(s => s.stream === 'Engineering').length },
    { stream: 'Med', avg: 91, count: students.filter(s => s.stream === 'Medical').length },
    { stream: 'Com', avg: 79, count: students.filter(s => s.stream === 'Commerce').length },
    { stream: 'Math', avg: 95, count: students.filter(s => s.stream === 'Mathematics').length },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 className="page-title">🧠 AI-Powered Analysis</h1>
          <div className="ai-badge">BETA</div>
        </div>
        <p className="page-subtitle">Advanced analytics and machine learning insights for smarter decisions.</p>
      </div>

      <div className="tabs">
        {['overview', 'students', 'predictions', 'insights'].map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)} id={`analysis-tab-${t}`}>
            {t === 'overview' ? '📊 Overview' : t === 'students' ? '👤 Student Deep Dive' : t === 'predictions' ? '🔮 Predictions' : '💡 AI Insights'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="analysis-metrics" style={{ marginBottom: 24 }}>
            {[
              { title: 'Avg GPA', val: avgGpa, color: '#6c63ff', icon: '📊', sub: 'Across all students' },
              { title: 'Avg Attendance', val: `${avgAttendance}%`, color: '#10b981', icon: '✅', sub: 'Current semester' },
              { title: 'At Risk', val: atRisk, color: '#ef4444', icon: '⚠️', sub: 'Need attention' },
              { title: 'Top Performers', val: topStudents, color: '#f59e0b', icon: '🌟', sub: 'GPA ≥ 3.7' },
              { title: 'Total Students', val: students.length, color: '#06b6d4', icon: '👥', sub: 'Enrolled' },
            ].map((m, i) => (
              <div key={i} className="metric-card">
                <div className="metric-icon">{m.icon}</div>
                <div className="metric-info">
                  <h3 style={{ color: m.color }}>{m.val}</h3>
                  <p>{m.title}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{m.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid-12" style={{ marginBottom: 20 }}>
            {/* Grade Distribution */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">📊 Grade Distribution</span>
                <span className="badge badge-purple">All Students</span>
              </div>
              <div className="card-body">
                {gradeDistribution.map((g, i) => (
                  <div key={g.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.82rem' }}>
                      <span style={{ color: g.color, fontWeight: 700 }}>{g.label}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{g.count} student{g.count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="progress-bar" style={{ height: 10 }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: animDone ? `${(g.count / maxCount) * 100}%` : '0%',
                          background: g.color,
                          transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar + Score Cards */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">🎯 Institution Health Score</span>
              </div>
              <div className="card-body">
                <RadarChart data={radarData} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
                  {[
                    { label: 'Overall', score: 86, color: '#6c63ff' },
                    { label: 'Academic', score: 91, color: '#10b981' },
                    { label: 'Social', score: 78, color: '#f59e0b' },
                    { label: 'Wellness', score: 84, color: '#06b6d4' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <ScoreGauge score={s.score} color={s.color} size={50} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{s.label}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Score: {s.score}/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stream Performance */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">📚 Stream Performance Analysis</span>
              <span className="badge badge-info">Current Semester</span>
            </div>
            <div className="card-body">
              <div className="bar-chart" style={{ height: 140 }}>
                {streamData.map((s, i) => (
                  <div key={i} className="bar-item">
                    <div className="bar-val">{animDone ? s.avg : 0}%</div>
                    <div
                      className="bar"
                      style={{
                        height: animDone ? `${s.avg}%` : '0%',
                        background: `linear-gradient(to top, ${['#6c63ff', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'][i]}, ${['#8b85ff', '#22d3ee', '#fbbf24', '#34d399', '#f87171', '#a78bfa'][i]})`,
                        transition: `height 1s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
                      }}
                    />
                    <div className="bar-label">{s.stream}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.count} stu.</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'students' && (
        <div className="grid-21">
          {/* Student List */}
          <div className="card" style={{ maxHeight: 600, overflowY: 'auto' }}>
            <div className="card-header">
              <span className="card-title">Select Student</span>
            </div>
            {students.map(s => (
              <div
                key={s.id}
                className={`notif-item${selectedStudent?.id === s.id ? ' unread' : ''}`}
                onClick={() => setSelectedStudent(s)}
                style={{ cursor: 'pointer' }}
              >
                <div className="student-avatar" style={{ background: s.color + '25', color: s.color, width: 40, height: 40, fontSize: '0.9rem' }}>
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.stream} · GPA {s.gpa}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <span className={`badge ${s.gpa >= 3.7 ? 'badge-success' : s.gpa >= 3.0 ? 'badge-info' : 'badge-warning'}`}>{s.grade}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Student Detail */}
          {selectedStudent && (
            <div>
              <div className="ai-panel" style={{ marginBottom: 20 }}>
                <div className="ai-panel-header">
                  <div className="student-avatar" style={{ width: 56, height: 56, fontSize: '1.3rem', background: selectedStudent.color + '25', color: selectedStudent.color, borderRadius: 16 }}>
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>{selectedStudent.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{selectedStudent.stream} · Batch {selectedStudent.batch}</p>
                  </div>
                  <div className="ai-badge" style={{ marginLeft: 'auto' }}>AI Score: {Math.round(selectedStudent.gpa * 25)}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {[
                    { label: 'GPA', val: selectedStudent.gpa, color: '#6c63ff' },
                    { label: 'Attendance', val: `${selectedStudent.attendance}%`, color: '#10b981' },
                    { label: 'Grade', val: selectedStudent.grade, color: '#f59e0b' },
                    { label: 'Status', val: selectedStudent.status === 'active' ? '✓ Good' : '⚠ Risk', color: selectedStudent.status === 'active' ? '#10b981' : '#ef4444' },
                  ].map((m, i) => (
                    <div key={i} style={{ textAlign: 'center', background: 'var(--bg-glass)', borderRadius: 10, padding: 12 }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.2rem', color: m.color }}>{m.val}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><span className="card-title">🎯 Performance Radar</span></div>
                <div className="card-body">
                  <RadarChart data={[
                    { label: 'Attend.', value: selectedStudent.attendance },
                    { label: 'GPA', value: selectedStudent.gpa * 25 },
                    { label: 'Grades', value: selectedStudent.grade === 'A+' ? 100 : selectedStudent.grade === 'A' ? 90 : 80 },
                    { label: 'Events', value: 70 + Math.random() * 25 },
                    { label: 'Engage', value: 65 + Math.random() * 30 },
                    { label: 'Social', value: 70 + Math.random() * 25 },
                  ]} />
                </div>
              </div>

              <div className="card">
                <div className="card-header"><span className="card-title">🤖 AI Recommendations</span></div>
                <div className="card-body">
                  {[
                    selectedStudent.attendance < 85
                      ? { icon: '⚠️', title: 'Attendance Alert', text: 'Attendance below threshold. Schedule a counseling session.' }
                      : { icon: '✅', title: 'Attendance Excellent', text: 'Great consistency! Maintain momentum.' },
                    selectedStudent.gpa >= 3.7
                      ? { icon: '🌟', title: 'Advanced Placement', text: 'Consider honors or advanced courses for this student.' }
                      : { icon: '📚', title: 'Academic Support', text: 'Additional tutoring may help improve performance.' },
                    { icon: '🎯', title: 'Event Participation', text: 'Encourage participation in 2+ events per semester.' },
                  ].map((ins, i) => (
                    <div key={i} className="ai-insight">
                      <div className="ai-insight-icon">{ins.icon}</div>
                      <div className="ai-insight-text">
                        <h4>{ins.title}</h4>
                        <p>{ins.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'predictions' && (
        <>
          <div className="ai-panel" style={{ marginBottom: 24 }}>
            <div className="ai-panel-header">
              <div className="ai-badge">🔮 AI Predictions</div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, marginLeft: 4 }}>Next Semester Forecast</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Based on historical trends, event participation, and attendance patterns, our AI model predicts the following outcomes for the next semester.
              Model accuracy: <strong style={{ color: '#10b981' }}>87.3%</strong>
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: 20 }}>
            <PredictionCard title="Predicted Avg Attendance" value="94.1%" trend="up" description="+1.8% from current semester" color="#10b981" />
            <PredictionCard title="Predicted Avg GPA" value="3.52" trend="up" description="+0.12 from current term" color="#6c63ff" />
            <PredictionCard title="At-Risk Students" value={atRisk - 1} trend="down" description="1 student likely to recover" color="#f59e0b" />
            <PredictionCard title="Event Participation" value="78%" trend="up" description="Trending upward" color="#06b6d4" />
            <PredictionCard title="Dropout Risk" value="2.1%" trend="down" description="Below national average" color="#ef4444" />
            <PredictionCard title="Honor Roll" value={topStudents + 2} trend="up" description="2 new students expected" color="#8b5cf6" />
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">📈 12-Month Enrollment Trend Prediction</span>
              <span className="badge badge-purple">AI Generated</span>
            </div>
            <div className="card-body">
              <div className="bar-chart" style={{ height: 150 }}>
                {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => {
                  const val = 80 + Math.sin(i * 0.5) * 10 + i * 0.8;
                  const isPast = i < 6;
                  return (
                    <div key={m} className="bar-item">
                      <div className="bar-val">{Math.round(animDone ? val : 0)}%</div>
                      <div className="bar" style={{
                        height: animDone ? `${val}%` : '0%',
                        background: isPast
                          ? 'linear-gradient(to top, #6c63ff, #8b85ff)'
                          : 'linear-gradient(to top, rgba(108,99,255,0.4), rgba(108,99,255,0.2))',
                        border: isPast ? 'none' : '1px dashed rgba(108,99,255,0.5)',
                        transition: `height 1s cubic-bezier(0.4,0,0.2,1) ${i * 0.06}s`,
                      }} />
                      <div className="bar-label">{m}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 14, height: 8, background: '#6c63ff', borderRadius: 2 }} />
                  Actual
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 14, height: 8, background: 'rgba(108,99,255,0.3)', border: '1px dashed rgba(108,99,255,0.5)', borderRadius: 2 }} />
                  Predicted
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'insights' && (
        <>
          <div className="ai-panel" style={{ marginBottom: 24 }}>
            <div className="ai-panel-header">
              <div className="ai-badge">🤖 AI Insights Engine</div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Powered by machine learning models analyzing over 50 data points per student in real-time.
            </p>
          </div>

          {AI_INSIGHTS.map((ins, i) => (
            <div key={i} className="ai-insight" style={{ marginBottom: 12, padding: 20 }}>
              <div className="ai-insight-icon">{ins.icon}</div>
              <div className="ai-insight-text" style={{ flex: 1 }}>
                <h4 style={{ marginBottom: 6 }}>{ins.title}</h4>
                <p>{ins.text}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                <span className={`badge ${ins.severity === 'warning' ? 'badge-warning' : ins.severity === 'success' ? 'badge-success' : ins.severity === 'danger' ? 'badge-danger' : 'badge-info'}`}>
                  {ins.severity.toUpperCase()}
                </span>
                <button className="btn-sm btn-sm-primary" id={`insight-action-${i}`}>{ins.action} →</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
