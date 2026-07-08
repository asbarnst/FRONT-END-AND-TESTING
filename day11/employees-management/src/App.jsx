import { useState } from 'react'
import './App.css'

const employees = [
  { id: 1, name: 'Alicia Gomez', role: 'Operations Lead', department: 'Operations', status: 'Active' },
  { id: 2, name: 'Noah Chen', role: 'Software Engineer', department: 'Engineering', status: 'Remote' },
  { id: 3, name: 'Liam Patel', role: 'HR Specialist', department: 'People', status: 'On Leave' },
  { id: 4, name: 'Sofia Rivers', role: 'Sales Manager', department: 'Sales', status: 'Active' },
]

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [userName, setUserName] = useState('Alex')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (isSignup && !formData.name.trim()) {
      return
    }

    setUserName(formData.name.trim() || 'Alex')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsSignup(false)
    setFormData({ name: '', email: '', password: '' })
  }

  if (!isLoggedIn) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-copy">
            <p className="eyebrow">Employee Management</p>
            <h1>{isSignup ? 'Create your team workspace' : 'Welcome back'}</h1>
            <p>
              Manage staff records, monitor attendance, and keep your company operations running smoothly.
            </p>
            <ul>
              <li>Secure employee overview</li>
              <li>Live department insights</li>
              <li>Fast onboarding for new hires</li>
            </ul>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{isSignup ? 'Sign up' : 'Log in'}</h2>
            {isSignup && (
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit" className="primary-btn">
              {isSignup ? 'Create account' : 'Log in'}
            </button>
            <p className="toggle-text">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type="button" className="link-btn" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? 'Log in instead' : 'Create one'}
              </button>
            </p>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">HR Hub</p>
          <h3>People Portal</h3>
          <nav className="nav-links">
            <a href="#">Overview</a>
            <a href="#">Employees</a>
            <a href="#">Attendance</a>
            <a href="#">Reports</a>
          </nav>
        </div>
        <div className="sidebar-card">
          <p>Need a quick update?</p>
          <button type="button" className="primary-btn small">Add employee</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Employee overview</p>
            <h2>Hello, {userName}</h2>
          </div>
          <button type="button" className="ghost-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <section className="hero-panel">
          <div>
            <p className="eyebrow">Today at a glance</p>
            <h3>24 active team members and 3 pending approvals.</h3>
            <p>Keep everyone aligned with a central dashboard for staffing and operations.</p>
          </div>
          <button type="button" className="primary-btn">
            View schedule
          </button>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <span>Total employees</span>
            <strong>128</strong>
          </article>
          <article className="stat-card">
            <span>Active now</span>
            <strong>94</strong>
          </article>
          <article className="stat-card">
            <span>On leave</span>
            <strong>7</strong>
          </article>
          <article className="stat-card">
            <span>New hires</span>
            <strong>12</strong>
          </article>
        </section>

        <section className="table-card">
          <div className="table-header">
            <h3>Recent employees</h3>
            <button type="button" className="ghost-btn">Export</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.role}</td>
                  <td>{employee.department}</td>
                  <td>{employee.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

export default App
