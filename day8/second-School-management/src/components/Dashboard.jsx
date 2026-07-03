// Dashboard Page - Shows overview stats and recent info

// Sample data for the dashboard
const recentStudents = [
  { id: 1, name: 'Alice Johnson', grade: '10th', section: 'A', status: 'Active' },
  { id: 2, name: 'Bob Smith', grade: '11th', section: 'B', status: 'Active' },
  { id: 3, name: 'Carol Davis', grade: '9th', section: 'A', status: 'Active' },
  { id: 4, name: 'David Wilson', grade: '12th', section: 'C', status: 'Inactive' },
  { id: 5, name: 'Emma Brown', grade: '10th', section: 'B', status: 'Active' },
];

const upcomingEvents = [
  { id: 1, title: 'Annual Sports Day', date: '2026-07-10', type: 'Sports' },
  { id: 2, title: 'Science Fair', date: '2026-07-15', type: 'Academic' },
  { id: 3, title: 'Parent-Teacher Meeting', date: '2026-07-20', type: 'Meeting' },
];

function Dashboard({ totalStudents, totalEvents }) {
  return (
    <div>
      <h1 className="page-title">📊 Dashboard</h1>

      {/* Stats cards at the top */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{totalStudents}</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Total Events</div>
          <div className="stat-value">{totalEvents}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Avg Attendance</div>
          <div className="stat-value">87%</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">📚</div>
          <div className="stat-label">Total Classes</div>
          <div className="stat-value">12</div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="dashboard-grid">
        {/* Recent Students Table */}
        <div className="table-box">
          <h3>👨‍🎓 Recent Students</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Section</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map(function(student) {
                return (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.grade}</td>
                    <td>{student.section}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Upcoming Events */}
        <div className="table-box">
          <h3>📅 Upcoming Events</h3>
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map(function(event) {
                return (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>
                      <span className="badge upcoming">{event.type}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
