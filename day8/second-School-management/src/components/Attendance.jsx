import { useState } from 'react';

// Attendance Page - Track student attendance daily

// Some sample attendance data to start with
const sampleAttendance = [
  { id: 1, studentName: 'Alice Johnson', date: '2026-07-01', status: 'Present', subject: 'Math' },
  { id: 2, studentName: 'Bob Smith', date: '2026-07-01', status: 'Absent', subject: 'Math' },
  { id: 3, studentName: 'Carol Davis', date: '2026-07-01', status: 'Present', subject: 'Math' },
  { id: 4, studentName: 'David Wilson', date: '2026-07-01', status: 'Late', subject: 'Math' },
  { id: 5, studentName: 'Emma Brown', date: '2026-07-01', status: 'Present', subject: 'Math' },
  { id: 6, studentName: 'Alice Johnson', date: '2026-07-02', status: 'Present', subject: 'Science' },
  { id: 7, studentName: 'Bob Smith', date: '2026-07-02', status: 'Present', subject: 'Science' },
  { id: 8, studentName: 'Carol Davis', date: '2026-07-02', status: 'Absent', subject: 'Science' },
  { id: 9, studentName: 'Frank Lee', date: '2026-07-02', status: 'Present', subject: 'Science' },
  { id: 10, studentName: 'Grace Kim', date: '2026-07-02', status: 'Late', subject: 'Science' },
];

function Attendance({ students }) {
  // All attendance records stored here
  const [attendanceList, setAttendanceList] = useState(sampleAttendance);

  // Filter by date
  const [filterDate, setFilterDate] = useState('');

  // Filter by status
  const [filterStatus, setFilterStatus] = useState('All');

  // State for mark attendance modal
  const [showModal, setShowModal] = useState(false);

  // New attendance record form data
  const [newRecord, setNewRecord] = useState({
    studentName: '',
    date: '',
    status: 'Present',
    subject: '',
  });

  // Filter the attendance list based on selected filters
  let filtered = attendanceList;

  if (filterDate !== '') {
    filtered = filtered.filter(function(record) {
      return record.date === filterDate;
    });
  }

  if (filterStatus !== 'All') {
    filtered = filtered.filter(function(record) {
      return record.status === filterStatus;
    });
  }

  // Function to add a new attendance record
  function handleAddAttendance() {
    if (newRecord.studentName === '' || newRecord.date === '' || newRecord.subject === '') {
      alert('Please fill all fields!');
      return;
    }

    const record = {
      id: attendanceList.length + 1 + Math.floor(Math.random() * 100),
      studentName: newRecord.studentName,
      date: newRecord.date,
      status: newRecord.status,
      subject: newRecord.subject,
    };

    setAttendanceList([...attendanceList, record]);
    setNewRecord({ studentName: '', date: '', status: 'Present', subject: '' });
    setShowModal(false);
  }

  // Function to delete an attendance record
  function handleDelete(id) {
    const updated = attendanceList.filter(function(r) {
      return r.id !== id;
    });
    setAttendanceList(updated);
  }

  // Calculate quick summary numbers
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;

  for (let i = 0; i < attendanceList.length; i++) {
    if (attendanceList[i].status === 'Present') presentCount++;
    else if (attendanceList[i].status === 'Absent') absentCount++;
    else if (attendanceList[i].status === 'Late') lateCount++;
  }

  return (
    <div>
      {/* Header */}
      <div className="top-bar">
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333' }}>
          📋 Attendance Tracking
        </h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Mark Attendance
        </button>
      </div>

      {/* Summary stats */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Present</div>
          <div className="stat-value">{presentCount}</div>
        </div>
        <div className="stat-card" style={{ border: '1px solid #f0f0f0' }}>
          <div className="stat-icon">❌</div>
          <div className="stat-label">Absent</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>{absentCount}</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">⏰</div>
          <div className="stat-label">Late</div>
          <div className="stat-value">{lateCount}</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Total Records</div>
          <div className="stat-value">{attendanceList.length}</div>
        </div>
      </div>

      {/* Filters Row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={{ fontSize: '13px', color: '#555', marginRight: '6px' }}>Date:</label>
          <input
            type="date"
            className="filter-select"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: '#555', marginRight: '6px' }}>Status:</label>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>
        {/* Button to clear filters */}
        <button
          style={{ padding: '8px 14px', background: '#f0f0f0', border: 'none', borderRadius: '7px', fontSize: '13px', cursor: 'pointer' }}
          onClick={() => { setFilterDate(''); setFilterStatus('All'); }}
        >
          Clear Filters
        </button>
      </div>

      {/* Attendance Table */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Date</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#999', padding: '30px' }}>
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map(function(record, index) {
                // Pick row color based on status
                let rowClass = '';
                if (record.status === 'Present') rowClass = 'att-present';
                else if (record.status === 'Absent') rowClass = 'att-absent';
                else if (record.status === 'Late') rowClass = 'att-late';

                return (
                  <tr key={record.id} className={rowClass}>
                    <td>{index + 1}</td>
                    <td><strong>{record.studentName}</strong></td>
                    <td>{record.date}</td>
                    <td>{record.subject}</td>
                    <td>
                      {/* Color-coded status badge */}
                      {record.status === 'Present' && <span className="badge present">✅ Present</span>}
                      {record.status === 'Absent' && <span className="badge absent">❌ Absent</span>}
                      {record.status === 'Late' && <span className="badge late">⏰ Late</span>}
                    </td>
                    <td>
                      <button className="btn-danger" onClick={() => handleDelete(record.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mark Attendance Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>📋 Mark Attendance</h3>

            <div className="form-group">
              <label>Student Name *</label>
              {/* Dropdown list from students prop */}
              <select
                value={newRecord.studentName}
                onChange={(e) => setNewRecord({ ...newRecord, studentName: e.target.value })}
              >
                <option value="">-- Select Student --</option>
                {students.map(function(s) {
                  return (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <select
                value={newRecord.subject}
                onChange={(e) => setNewRecord({ ...newRecord, subject: e.target.value })}
              >
                <option value="">-- Select Subject --</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Computer">Computer</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                value={newRecord.status}
                onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value })}
              >
                <option value="Present">✅ Present</option>
                <option value="Absent">❌ Absent</option>
                <option value="Late">⏰ Late</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddAttendance}>
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
