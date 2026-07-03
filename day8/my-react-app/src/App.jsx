import { useState } from 'react';
import './App.css';

// Import Components
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Students, { startingStudents } from './components/Students';
import Attendance from './components/Attendance';

function App() {
  // State for logged in user
  const [currentUser, setCurrentUser] = useState(null);

  // State for current page (default is dashboard)
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Shared state for students (used across multiple pages)
  const [students, setStudents] = useState(startingStudents);

  // If no user is logged in, only show the login page
  if (!currentUser) {
    return <LoginPage onLogin={(user) => setCurrentUser(user)} />;
  }

  // Function to handle logout
  function handleLogout() {
    setCurrentUser(null);
  }

  // Helper function to render the correct component based on currentPage
  function renderPage() {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard totalStudents={students.length} totalEvents={3} />;
      case 'students':
        return <Students students={students} setStudents={setStudents} />;
      case 'attendance':
        return <Attendance students={students} />;
      case 'events':
        return (
          <div>
            <h1 className="page-title">📅 Events</h1>
            <div className="table-box">
              <p>Events feature coming soon...</p>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div>
            <h1 className="page-title">📊 Analysis</h1>
            <div className="analysis-grid">
              <div className="analysis-card">
                <h3>Attendance Overview</h3>
                <p>Analysis feature coming soon...</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard totalStudents={students.length} totalEvents={3} />;
    }
  }

  return (
    <div className="app-layout">
      {/* Sidebar stays fixed on the left */}
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      {/* Main content changes based on selected page */}
      <div className="main-content">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
