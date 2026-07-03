import { useState } from 'react';

// Students Page - Add, View, Delete students

// Starting list of students
const startingStudents = [
  { id: 1, name: 'Alice Johnson', grade: '10th', section: 'A', email: 'alice@school.com', phone: '555-0101' },
  { id: 2, name: 'Bob Smith', grade: '11th', section: 'B', email: 'bob@school.com', phone: '555-0102' },
  { id: 3, name: 'Carol Davis', grade: '9th', section: 'A', email: 'carol@school.com', phone: '555-0103' },
  { id: 4, name: 'David Wilson', grade: '12th', section: 'C', email: 'david@school.com', phone: '555-0104' },
  { id: 5, name: 'Emma Brown', grade: '10th', section: 'B', email: 'emma@school.com', phone: '555-0105' },
  { id: 6, name: 'Frank Lee', grade: '9th', section: 'C', email: 'frank@school.com', phone: '555-0106' },
  { id: 7, name: 'Grace Kim', grade: '11th', section: 'A', email: 'grace@school.com', phone: '555-0107' },
];

function Students({ students, setStudents }) {
  // State for showing/hiding the add student modal
  const [showModal, setShowModal] = useState(false);

  // State for search text
  const [searchText, setSearchText] = useState('');

  // State for the new student form fields
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '',
    section: '',
    email: '',
    phone: '',
  });

  // Filter students based on search text
  let filteredStudents = students.filter(function(student) {
    return student.name.toLowerCase().includes(searchText.toLowerCase());
  });

  // Handle adding a new student
  function handleAddStudent() {
    // Simple validation
    if (newStudent.name === '' || newStudent.grade === '' || newStudent.section === '') {
      alert('Please fill in Name, Grade, and Section!');
      return;
    }

    // Create new student object
    const student = {
      id: students.length + 1 + Math.floor(Math.random() * 100),
      name: newStudent.name,
      grade: newStudent.grade,
      section: newStudent.section,
      email: newStudent.email,
      phone: newStudent.phone,
    };

    // Add to list
    setStudents([...students, student]);

    // Reset form and close modal
    setNewStudent({ name: '', grade: '', section: '', email: '', phone: '' });
    setShowModal(false);
  }

  // Handle deleting a student
  function handleDeleteStudent(id) {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updated = students.filter(function(s) {
        return s.id !== id;
      });
      setStudents(updated);
    }
  }

  return (
    <div>
      {/* Page header with search and add button */}
      <div className="top-bar">
        <h2 className="section-header" style={{ margin: 0 }}>
          <span>👨‍🎓 Students</span>
          <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal', marginLeft: '10px' }}>
            ({filteredStudents.length} students)
          </span>
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Search box */}
          <input
            className="search-input"
            type="text"
            placeholder="🔍 Search by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {/* Add new student button */}
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Add Student
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Section</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: '#999', padding: '30px' }}>
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map(function(student, index) {
                return (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td><strong>{student.name}</strong></td>
                    <td>{student.grade}</td>
                    <td>{student.section}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>➕ Add New Student</h3>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Enter student name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Grade *</label>
              <select
                value={newStudent.grade}
                onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
              >
                <option value="">-- Select Grade --</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>
            </div>

            <div className="form-group">
              <label>Section *</label>
              <select
                value={newStudent.section}
                onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
              >
                <option value="">-- Select Section --</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="student@email.com"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                placeholder="Phone number"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddStudent}>
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { startingStudents };
export default Students;
