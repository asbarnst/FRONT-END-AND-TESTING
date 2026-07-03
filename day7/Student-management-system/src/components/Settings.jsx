import { useState } from 'react';
export default function Settings({ user, addToast }) {
  const [settings, setSettings] = useState({
    institutionName: 'EduSphere Academy',
    email: 'admin@edusphere.com',
    timezone: 'UTC-5 (Eastern)',
    language: 'English',
    attendanceThreshold: 80,
    gpaWarning: 3.0,
    emailNotifs: true,
    smsNotifs: false,
    aiInsights: true,
    autoReports: true,
    twoFactor: false,
    sessionTimeout: 30,
    theme: 'dark',
    accentColor: '#6c63ff',
  });
  const update = (k, v) => setSettings(s => ({ ...s, [k]: v }));
  const save = () => addToast('success', '⚙️ Settings saved successfully!');
  const Toggle = ({ value, onChange, id }) => (
    <div
      id={id}
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: 'pointer', flexShrink: 0,
        background: value ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'background 0.3s',
      }}>
      <div style={{
        position: 'absolute', top: 3, left: value ? 22 : 3,
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  );
  const SettingRow = ({ icon, label, desc, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 16 }}>
      <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: 2 }}>{label}</div>
        {desc && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
  const COLORS = ['#6c63ff', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#ec4899'];
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">⚙️ System Settings</h1>
        <p className="page-subtitle">Configure your EduSphere platform preferences.</p>
      </div>
      <div className="grid-12">
        <div>
          {/* General Settings */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <span className="card-title">🏫 Institution Settings</span>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Institution Name</label>
                <input className="form-input" value={settings.institutionName} onChange={e => update('institutionName', e.target.value)} id="institution-name" />
              </div>
              <div className="form-group">
                <label className="form-label">Admin Email</label>
                <input className="form-input" type="email" value={settings.email} onChange={e => update('email', e.target.value)} id="admin-email" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select className="form-select" value={settings.timezone} onChange={e => update('timezone', e.target.value)}>
                    {['UTC-5 (Eastern)', 'UTC-6 (Central)', 'UTC-7 (Mountain)', 'UTC-8 (Pacific)', 'UTC+0 (GMT)', 'UTC+5:30 (IST)'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select className="form-select" value={settings.language} onChange={e => update('language', e.target.value)}>
                    {['English', 'Spanish', 'French', 'German', 'Hindi'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Thresholds */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <span className="card-title">📊 Academic Thresholds</span>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Attendance Warning Threshold: <strong style={{ color: 'var(--primary-light)' }}>{settings.attendanceThreshold}%</strong></label>
                <input type="range" min={50} max={95} value={settings.attendanceThreshold} onChange={e => update('attendanceThreshold', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} id="attendance-threshold" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}><span>50%</span><span>95%</span></div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">GPA Warning Threshold: <strong style={{ color: 'var(--primary-light)' }}>{settings.gpaWarning.toFixed(1)}</strong></label>
                <input type="range" min={1.0} max={3.5} step={0.1} value={settings.gpaWarning} onChange={e => update('gpaWarning', parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} id="gpa-threshold" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}><span>1.0</span><span>3.5</span></div>
              </div>
            </div>
          </div>
          {/* Notifications */}
          <div className="card">
            <div className="card-header"><span className="card-title">🔔 Notifications</span></div>
            <SettingRow icon="📧" label="Email Notifications" desc="Receive alerts and reports via email">
              <Toggle id="toggle-email-notifs" value={settings.emailNotifs} onChange={v => update('emailNotifs', v)} />
            </SettingRow>
            <SettingRow icon="📱" label="SMS Notifications" desc="Get critical alerts via SMS">
              <Toggle id="toggle-sms-notifs" value={settings.smsNotifs} onChange={v => update('smsNotifs', v)} />
            </SettingRow>
            <SettingRow icon="🧠" label="AI Insights" desc="Receive AI-generated recommendations">
              <Toggle id="toggle-ai-insights" value={settings.aiInsights} onChange={v => update('aiInsights', v)} />
            </SettingRow>
            <SettingRow icon="📋" label="Auto-generate Reports" desc="Weekly and monthly reports automatically">
              <Toggle id="toggle-auto-reports" value={settings.autoReports} onChange={v => update('autoReports', v)} />
            </SettingRow>
          </div>
        </div>
        <div>
          {/* Profile */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><span className="card-title">👤 Your Profile</span></div>
            <div className="card-body">
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div className="user-avatar-mini" style={{ width: 72, height: 72, fontSize: '2rem', margin: '0 auto 12px', borderRadius: 18 }}>{user.avatar}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.role} · {user.email}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button className="btn-sm btn-sm-primary" onClick={() => addToast('info', '✏️ Profile editor coming soon!')}>Edit Profile</button>
                <button className="btn-sm btn-sm-primary" onClick={() => addToast('info', '🔒 Password change email sent!')}>Change Password</button>
              </div>
            </div>
          </div>
          {/* Security */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><span className="card-title">🔐 Security</span></div>
            <SettingRow icon="🔑" label="Two-Factor Authentication" desc="Add extra security to your account">
              <Toggle id="toggle-2fa" value={settings.twoFactor} onChange={v => update('twoFactor', v)} />
            </SettingRow>
            <div style={{ padding: '16px 24px' }}>
              <label className="form-label">Session Timeout: <strong style={{ color: 'var(--primary-light)' }}>{settings.sessionTimeout} min</strong></label>
              <input type="range" min={5} max={120} value={settings.sessionTimeout} onChange={e => update('sessionTimeout', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} id="session-timeout" />
            </div>
          </div>
          {/* Appearance */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><span className="card-title">🎨 Appearance</span></div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Accent Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {COLORS.map(c => (
                    <div key={c} onClick={() => { update('accentColor', c); addToast('success', '🎨 Color updated!'); }}
                      style={{
                        width: 30, height: 30, borderRadius: '50%', background: c, cursor: 'pointer',
                        border: settings.accentColor === c ? '3px solid white' : '3px solid transparent',
                        transform: settings.accentColor === c ? 'scale(1.2)' : 'scale(1)',
                        transition: 'all 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Danger Zone */}
          <div className="card" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="card-header" style={{ borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
              <span className="card-title" style={{ color: '#f87171' }}>🚨 Danger Zone</span>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: 4 }}>Export All Data</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>Download complete backup of all student data</div>
                <button className="btn-sm btn-sm-primary" onClick={() => addToast('info', '📦 Export started, will be ready in 2 minutes...')}>📥 Export Data</button>
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: 4, color: '#f87171' }}>Reset System</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>This will clear all data. Cannot be undone.</div>
                <button className="btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }} onClick={() => addToast('error', '🚨 Reset cancelled for safety. Contact super admin.')}>
                  Reset System
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <button className="btn-secondary" onClick={() => addToast('info', '↩️ Changes discarded')}>Discard Changes</button>
        <button className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }} onClick={save} id="save-settings-btn">💾 Save Settings</button>
      </div>
    </div>
  );
}
