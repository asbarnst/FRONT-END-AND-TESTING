import { useState, useEffect } from 'react';

const USERS = [
  { id: 1, email: 'admin@edusphere.com', password: 'admin123', role: 'admin', name: 'Dr. Sarah Mitchell', avatar: '👩‍💼' },
  { id: 2, email: 'teacher@edusphere.com', password: 'teacher123', role: 'teacher', name: 'Prof. James Wilson', avatar: '👨‍🏫' },
  { id: 3, email: 'student@edusphere.com', password: 'student123', role: 'student', name: 'Alex Johnson', avatar: '👨‍🎓' },
];

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('admin@edusphere.com');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('edusphere_user');
    if (saved) onLogin(JSON.parse(saved));
  }, []);

  const roleDefaults = {
    admin: { email: 'admin@edusphere.com', password: 'admin123' },
    teacher: { email: 'teacher@edusphere.com', password: 'teacher123' },
    student: { email: 'student@edusphere.com', password: 'student123' },
  };

  const handleRoleChange = (r) => {
    setRole(r);
    setEmail(roleDefaults[r].email);
    setPassword(roleDefaults[r].password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      if (remember) localStorage.setItem('edusphere_user', JSON.stringify(user));
      onLogin(user);
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
    setLoading(false);
  };

  const roles = [
    { key: 'admin', icon: '👩‍💼', label: 'Admin' },
    { key: 'teacher', icon: '👨‍🏫', label: 'Teacher' },
    { key: 'student', icon: '👨‍🎓', label: 'Student' },
  ];

  return (
    <div className="login-page">
      <div className="login-bg-orb orb1" />
      <div className="login-bg-orb orb2" />
      <div className="login-bg-orb orb3" />

      {/* Left Panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-logo">🎓</div>
          <h1><span className="gradient-text">EduSphere</span></h1>
          <p>Next-Generation Student Management Platform</p>
        </div>
        <div className="login-stats">
          {[
            { val: '2,400+', label: 'Students', color: '#6c63ff' },
            { val: '96.2%', label: 'Attendance', color: '#10b981' },
            { val: '48', label: 'Events', color: '#f59e0b' },
          ].map((s, i) => (
            <div className="login-stat" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="login-stat-value" style={{ color: s.color }}>{s.val}</div>
              <div className="login-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-card">
          <h2>Welcome back 👋</h2>
          <p>Sign in to access your dashboard</p>

          {/* Role Selector */}
          <div className="role-selector">
            {roles.map(r => (
              <button
                key={r.key}
                className={`role-btn${role === r.key ? ' active' : ''}`}
                onClick={() => handleRoleChange(r.key)}
                type="button"
                id={`role-${r.key}`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="password-wrapper">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-footer">
              <label className="checkbox-label">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember me
              </label>
              <a href="#" className="forgot-link" onClick={e => e.preventDefault()}>Forgot password?</a>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <span className="spinner" /> Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: 20, fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Demo credentials auto-filled</strong><br />
            Switch roles above to auto-fill credentials
          </div>
        </div>
      </div>
    </div>
  );
}
