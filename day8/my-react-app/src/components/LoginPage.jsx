import { useState } from 'react';

// Simple Login Page Component
function LoginPage({ onLogin }) {
  // State for username and password inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Fake user accounts for demo
  const fakeUsers = [
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'teacher', password: 'teacher123', role: 'Teacher' },
    { username: 'student', password: 'student123', role: 'Student' },
  ];

  // Handle login button click
  function handleLogin() {
    // Check if fields are empty
    if (username === '' || password === '') {
      setError('Please enter username and password!');
      return;
    }

    // Find matching user
    let foundUser = null;
    for (let i = 0; i < fakeUsers.length; i++) {
      if (fakeUsers[i].username === username && fakeUsers[i].password === password) {
        foundUser = fakeUsers[i];
        break;
      }
    }

    if (foundUser) {
      setError('');
      onLogin(foundUser); // Pass user info to parent
    } else {
      setError('Wrong username or password!');
    }
  }

  // Allow pressing Enter key to login
  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>🎓 Student Management</h2>
        <p>Sign in to your account</p>

        {/* Show error message if any */}
        {error && <div className="login-error">❌ {error}</div>}

        {/* Username Field */}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Login Button */}
        <button className="login-btn" onClick={handleLogin}>
          Login →
        </button>

        {/* Hint for demo credentials */}
        <div className="login-hint">
          <strong>Demo Credentials:</strong><br />
          admin / admin123<br />
          teacher / teacher123<br />
          student / student123
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
