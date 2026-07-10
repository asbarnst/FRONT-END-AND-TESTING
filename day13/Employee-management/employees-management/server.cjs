const express = require("express");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, "db.json");

const SALARY_RANGES = {
  Engineering: [85000, 150000],
  Operations:  [55000, 90000],
  Sales:        [50000, 85000],
  People:       [45000, 75000],
  HR:           [45000, 75000],
  Design:       [65000, 100000],
  Analytics:    [70000, 110000],
  Finance:      [75000, 120000],
  Marketing:    [55000, 85000],
  General:      [40000, 65000],
};

const generateEmpId = (n) => `EMP-${String(n).padStart(4, '0')}`;

const assignSalary = (department, numericId) => {
  const range = SALARY_RANGES[department] || [40000, 80000];
  const span = range[1] - range[0];
  const raw = range[0] + ((numericId * 7919) % span);
  return Math.round(raw / 1000) * 1000;
};

const buildSalaryRecords = (emps) => {
  const now = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear  = now.getFullYear();
  const curDay   = now.getDate();
  const records  = [];

  for (let offset = 3; offset >= 0; offset--) {
    let m = curMonth - offset;
    let y = curYear;
    if (m <= 0) { m += 12; y -= 1; }

    const isPast   = offset > 0;
    const status   = isPast ? 'Paid' : (curDay >= 3 ? 'Paid' : 'Pending');
    const paidOn   = status === 'Paid'
      ? `${y}-${String(m).padStart(2, '0')}-03`
      : null;

    emps.forEach(emp => {
      records.push({ empId: emp.empId, month: m, year: y, amount: emp.salary, status, paidOn });
    });
  }
  return records;
};

const INITIAL_EMPLOYEES = [
  { id: 1, name: 'Alicia Gomez',   role: 'Operations Lead',    department: 'Operations',  status: 'Active',   email: 'alicia.gomez@company.com',   username: 'alicia.gomez',   joiningDate: '2022-03-15', password: 'company123' },
  { id: 2, name: 'Noah Chen',      role: 'Software Engineer',  department: 'Engineering', status: 'Remote',   email: 'noah.chen@company.com',      username: 'noah.chen',      joiningDate: '2021-07-01', password: 'company123' },
  { id: 3, name: 'Liam Patel',     role: 'HR Specialist',      department: 'People',      status: 'On Leave', email: 'liam.patel@company.com',     username: 'liam.patel',     joiningDate: '2023-01-10', password: 'company123' },
  { id: 4, name: 'Sofia Rivers',   role: 'Sales Manager',      department: 'Sales',       status: 'Active',   email: 'sofia.rivers@company.com',   username: 'sofia.rivers',   joiningDate: '2020-11-20', password: 'company123' },
  { id: 5, name: 'Marcus Johnson', role: 'UI Designer',         department: 'Design',      status: 'Active',   email: 'marcus.johnson@company.com', username: 'marcus.johnson', joiningDate: '2022-08-05', password: 'company123' },
  { id: 6, name: 'Priya Sharma',   role: 'Data Analyst',       department: 'Analytics',   status: 'Remote',   email: 'priya.sharma@company.com',   username: 'priya.sharma',   joiningDate: '2023-06-12', password: 'company123' },
  { id: 7, name: 'Bala',           role: 'Software Engineer',  department: 'Engineering', status: 'Active',   email: 'bala@company.com',           username: 'bala',           joiningDate: '2024-01-10', password: 'bala123' },
  { id: 8, name: 'Asbar',          role: 'UI Designer',         department: 'Design',      status: 'Active',   email: 'asbar@company.com',          username: 'asbar',          joiningDate: '2024-02-15', password: 'asbar123' },
  { id: 9, name: 'Nithis',         role: 'Data Analyst',       department: 'Analytics',   status: 'Active',   email: 'nithis@company.com',         username: 'nithis',         joiningDate: '2024-03-20', password: 'nithis123' },
  { id: 10, name: 'Kamalesh',      role: 'HR Specialist',      department: 'People',      status: 'Active',   email: 'kamalesh@company.com',       username: 'kamalesh',       joiningDate: '2024-04-05', password: 'kamalesh123' }
].map(e => ({ ...e, empId: generateEmpId(e.id), salary: assignSalary(e.department, e.id) }));

const INITIAL_SCHEDULE = [
  { id: 1, title: 'Weekly Team Sync',    when: 'Mon 10:00 AM', icon: '🤝' },
  { id: 2, title: 'Performance Review',  when: 'Wed 2:00 PM',  icon: '📊' },
  { id: 3, title: 'Training Session',    when: 'Fri 11:00 AM', icon: '🎓' },
];

function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      employees: INITIAL_EMPLOYEES,
      attendance: {},
      schedule: INITIAL_SCHEDULE,
      salaryRecords: buildSalaryRecords(INITIAL_EMPLOYEES)
    };
    // Seed initial attendance for today
    const todayStr = new Date().toISOString().split('T')[0];
    initialData.employees.forEach((e, i) => {
      initialData.attendance[e.id] = {
        [todayStr]: { status: i % 3 === 2 ? 'Absent' : 'Present', note: i % 3 === 2 ? '' : 'Auto-recorded' }
      };
    });
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
    console.log("Database initialized & seeded with 10 employees.");
  }
}

initDB();

function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database file", error);
    return { employees: [], attendance: {}, schedule: [], salaryRecords: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing database file", error);
  }
}

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.any(), (req, res) => {
    console.log("Files:", req.files);
    console.log("Body:", req.body);

    res.json({
        files: req.files,
        body: req.body
    });
});

// Authentication Endpoint
app.post("/api/login", (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: "Missing username, password, or role." });
  }

  const normalizedUsername = username.trim().toLowerCase();

  if (role === 'admin') {
    if (normalizedUsername === 'admin' && password === 'admin123') {
      return res.json({
        success: true,
        role: 'admin',
        user: { name: 'Admin User', username: 'admin' }
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid Admin credentials." });
    }
  }

  // Employee role
  const db = readDB();
  const employee = db.employees.find(
    e => e.username.toLowerCase() === normalizedUsername && e.password === password
  );

  if (employee) {
    return res.json({
      success: true,
      role: 'employee',
      user: employee
    });
  } else {
    return res.status(401).json({ success: false, message: "Invalid Employee credentials." });
  }
});

// Employees Endpoint
app.get("/api/employees", (req, res) => {
  const db = readDB();
  res.json(db.employees);
});

app.post("/api/employees", (req, res) => {
  const { name, role, department, salary } = req.body;
  if (!name || !role || !department) {
    return res.status(400).json({ success: false, message: "Name, role, and department are required." });
  }

  const db = readDB();
  const maxId = Math.max(...db.employees.map(e => e.id), 0) + 1;
  const numSalary = parseInt(salary, 10) || assignSalary(department.trim(), maxId);
  const email = `${name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
  const username = `${name.toLowerCase().replace(/\s+/g, '.')}`;
  const defaultPassword = `${name.toLowerCase().replace(/\s+/g, '')}123`;

  const newEmp = {
    id: maxId,
    empId: generateEmpId(maxId),
    name: name.trim(),
    role: role.trim(),
    department: department.trim(),
    status: 'Active',
    email,
    username,
    password: defaultPassword,
    joiningDate: new Date().toISOString().split('T')[0],
    salary: numSalary
  };

  db.employees.push(newEmp);
  db.attendance[maxId] = {};

  // Seed salary history
  const now = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear = now.getFullYear();
  const curDay = now.getDate();

  for (let offset = 3; offset >= 0; offset--) {
    let m = curMonth - offset;
    let y = curYear;
    if (m <= 0) { m += 12; y -= 1; }
    const isPast = offset > 0;
    const status = isPast ? 'Paid' : (curDay >= 3 ? 'Paid' : 'Pending');
    const paidOn = status === 'Paid' ? `${y}-${String(m).padStart(2, '0')}-03` : null;
    db.salaryRecords.push({
      empId: newEmp.empId,
      month: m,
      year: y,
      amount: newEmp.salary,
      status,
      paidOn
    });
  }

  writeDB(db);
  res.status(201).json({ success: true, employee: newEmp });
});

app.put("/api/employees/:empId/salary", (req, res) => {
  const { empId } = req.params;
  const { salary } = req.body;
  const numSalary = parseInt(salary, 10);
  if (isNaN(numSalary) || numSalary <= 0) {
    return res.status(400).json({ success: false, message: "Invalid salary amount." });
  }

  const db = readDB();
  const employee = db.employees.find(e => e.empId === empId);
  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found." });
  }

  employee.salary = numSalary;

  // Update current month's salary record
  const now = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear = now.getFullYear();
  const salRecord = db.salaryRecords.find(
    r => r.empId === empId && r.month === curMonth && r.year === curYear
  );
  if (salRecord) {
    salRecord.amount = numSalary;
  }

  writeDB(db);
  res.json({ success: true, employee });
});

// Attendance Endpoints
app.get("/api/attendance", (req, res) => {
  const db = readDB();
  res.json(db.attendance);
});

app.post("/api/attendance", (req, res) => {
  const { empId, date, status, note } = req.body;
  if (!empId || !date || !status) {
    return res.status(400).json({ success: false, message: "Missing empId, date, or status." });
  }

  const db = readDB();
  if (!db.attendance[empId]) {
    db.attendance[empId] = {};
  }
  db.attendance[empId][date] = {
    status,
    note: (note || "").trim()
  };

  writeDB(db);
  res.json({ success: true, attendance: db.attendance[empId][date] });
});

// Schedule Endpoints
app.get("/api/schedule", (req, res) => {
  const db = readDB();
  res.json(db.schedule);
});

app.post("/api/schedule", (req, res) => {
  const { title, when } = req.body;
  if (!title || !when) {
    return res.status(400).json({ success: false, message: "Title and when are required." });
  }

  const db = readDB();
  const nextId = Math.max(...db.schedule.map(s => s.id), 0) + 1;
  const newEvent = {
    id: nextId,
    title: title.trim(),
    when: when.trim(),
    icon: '📌'
  };

  db.schedule.push(newEvent);
  writeDB(db);
  res.status(201).json({ success: true, event: newEvent });
});

// Salary Records Endpoints
app.get("/api/salary", (req, res) => {
  const db = readDB();
  res.json(db.salaryRecords);
});

app.post("/api/salary/pay", (req, res) => {
  const { empId, month, year } = req.body;
  if (!empId || !month || !year) {
    return res.status(400).json({ success: false, message: "empId, month, and year are required." });
  }

  const db = readDB();
  const rec = db.salaryRecords.find(r => r.empId === empId && r.month === month && r.year === year);
  if (!rec) {
    return res.status(404).json({ success: false, message: "Salary record not found." });
  }

  const todayD = new Date();
  rec.status = 'Paid';
  rec.paidOn = `${todayD.getFullYear()}-${String(todayD.getMonth() + 1).padStart(2, '0')}-${String(todayD.getDate()).padStart(2, '0')}`;

  writeDB(db);
  res.json({ success: true, record: rec });
});

// ─── Delete Employee ─────────────────────────────────────────────
app.delete("/api/employees/:empId", (req, res) => {
  const { empId } = req.params;
  const db = readDB();
  const idx = db.employees.findIndex(e => e.empId === empId);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Employee not found." });
  }

  const emp = db.employees[idx];
  db.employees.splice(idx, 1);
  // Remove attendance records for this employee
  delete db.attendance[String(emp.id)];
  delete db.attendance[emp.id];
  // Remove salary records for this employee
  db.salaryRecords = db.salaryRecords.filter(r => r.empId !== empId);

  writeDB(db);
  res.json({ success: true, message: "Employee deleted." });
});

// ─── Update Employee Status ───────────────────────────────────────
app.patch("/api/employees/:empId/status", (req, res) => {
  const { empId } = req.params;
  const { status } = req.body;
  const validStatuses = ['Active', 'Remote', 'On Leave'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status. Use Active, Remote, or On Leave." });
  }

  const db = readDB();
  const emp = db.employees.find(e => e.empId === empId);
  if (!emp) {
    return res.status(404).json({ success: false, message: "Employee not found." });
  }

  emp.status = status;
  writeDB(db);
  res.json({ success: true, employee: emp });
});

// ─── Export to Excel ─────────────────────────────────────────────
app.get("/api/export/excel", (req, res) => {
  const db = readDB();
  const wb = XLSX.utils.book_new();

  // Sheet 1: Employees
  const empData = db.employees.map(e => ({
    'EMP ID':              e.empId,
    'Name':               e.name,
    'Role':               e.role,
    'Department':         e.department,
    'Status':             e.status,
    'Email':              e.email,
    'Joining Date':       e.joiningDate,
    'Monthly Salary (INR)': e.salary,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(empData.length ? empData : [{}]), 'Employees');

  // Sheet 2: Attendance
  const attRows = [];
  db.employees.forEach(emp => {
    const empAtt = db.attendance[emp.id] || db.attendance[String(emp.id)] || {};
    Object.entries(empAtt).forEach(([date, rec]) => {
      attRows.push({
        'EMP ID':     emp.empId,
        'Name':       emp.name,
        'Department': emp.department,
        'Date':       date,
        'Status':     rec.status,
        'Note':       rec.note || '',
      });
    });
  });
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(attRows.length ? attRows : [{ Note: 'No attendance records found' }]),
    'Attendance'
  );

  // Sheet 3: Salary Records
  const salData = db.salaryRecords.map(r => {
    const emp = db.employees.find(e => e.empId === r.empId);
    return {
      'EMP ID':      r.empId,
      'Name':        emp ? emp.name : '',
      'Month':       r.month,
      'Year':        r.year,
      'Amount (INR)':r.amount,
      'Status':      r.status,
      'Paid On':     r.paidOn || '',
    };
  });
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(salData.length ? salData : [{ Note: 'No salary records found' }]),
    'Salary Records'
  );

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', 'attachment; filename="Ashes-Tech-Employee-Data.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});