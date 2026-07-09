import { useEffect, useRef, useState } from 'react'
import './App.css'

const API_URL = "https://dummyjson.com/users?limit=12"

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
}
const generateEmpId = (n) => `EMP-${String(n).padStart(4, '0')}`
const assignSalary = (department, numericId) => {
  const range = SALARY_RANGES[department] || [40000, 80000]
  const span = range[1] - range[0]
  const raw = range[0] + ((numericId * 7919) % span)
  return Math.round(raw / 1000) * 1000
}

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const ADMIN_CREDS    = { email: 'admin@example.com',    password: 'admin123' }
const EMPLOYEE_CREDS = { email: 'employee@example.com', password: 'employee123' }
const BASE_EMPLOYEES = [
  { id: 1, name: 'Alicia Gomez',   role: 'Operations Lead',    department: 'Operations',  status: 'Active',   email: 'alicia.gomez@company.com',   joiningDate: '2022-03-15' },
  { id: 2, name: 'Noah Chen',      role: 'Software Engineer',  department: 'Engineering', status: 'Remote',   email: 'noah.chen@company.com',      joiningDate: '2021-07-01' },
  { id: 3, name: 'Liam Patel',     role: 'HR Specialist',      department: 'People',      status: 'On Leave', email: 'liam.patel@company.com',     joiningDate: '2023-01-10' },
  { id: 4, name: 'Sofia Rivers',   role: 'Sales Manager',      department: 'Sales',       status: 'Active',   email: 'sofia.rivers@company.com',   joiningDate: '2020-11-20' },
  { id: 5, name: 'Marcus Johnson', role: 'UI Designer',         department: 'Design',      status: 'Active',   email: 'marcus.johnson@company.com', joiningDate: '2022-08-05' },
  { id: 6, name: 'Priya Sharma',   role: 'Data Analyst',       department: 'Analytics',   status: 'Remote',   email: 'priya.sharma@company.com',   joiningDate: '2023-06-12' },
].map(e => ({ ...e, empId: generateEmpId(e.id), salary: assignSalary(e.department, e.id) }))

const INITIAL_SCHEDULE = [
  { id: 1, title: 'Weekly Team Sync',    when: 'Mon 10:00 AM', icon: '🤝' },
  { id: 2, title: 'Performance Review',  when: 'Wed 2:00 PM',  icon: '📊' },
  { id: 3, title: 'Training Session',    when: 'Fri 11:00 AM', icon: '🎓' },
]

const AVATAR_GRADS = [
  'linear-gradient(135deg,#a855f7,#06b6d4)',
  'linear-gradient(135deg,#ec4899,#f97316)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#3b82f6,#a855f7)',
  'linear-gradient(135deg,#f97316,#eab308)',
  'linear-gradient(135deg,#ec4899,#a855f7)',
  'linear-gradient(135deg,#06b6d4,#10b981)',
  'linear-gradient(135deg,#eab308,#f97316)',
]

const getAvatarGrad = (id) => AVATAR_GRADS[(id - 1) % AVATAR_GRADS.length]
const getInitials   = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
const formatTime    = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

// ─── SALARY RECORD HELPERS ───────────────────────────────────────

const buildSalaryRecords = (emps) => {
  const now = new Date()
  const curMonth = now.getMonth() + 1
  const curYear  = now.getFullYear()
  const curDay   = now.getDate()
  const records  = []

  for (let offset = 3; offset >= 0; offset--) {
    let m = curMonth - offset
    let y = curYear
    if (m <= 0) { m += 12; y -= 1 }

    const isPast   = offset > 0
    const status   = isPast ? 'Paid' : (curDay >= 3 ? 'Paid' : 'Pending')
    const paidOn   = status === 'Paid'
      ? `${y}-${String(m).padStart(2, '0')}-03`
      : null

    emps.forEach(emp => {
      records.push({ empId: emp.empId, month: m, year: y, amount: emp.salary, status, paidOn })
    })
  }
  return records
}

const getSalaryRecord = (records, empId, month, year) =>
  records.find(r => r.empId === empId && r.month === month && r.year === year) || null

// ─── CHATBOT RESPONSE ENGINE ─────────────────────────────────────

const generateChatResponse = (message, role, employees, schedule, attendanceRecords, selectedDate, salaryRecords) => {
  const text    = message.toLowerCase().trim()
  const isAdmin = role === 'admin'
  const now     = new Date()
  const month   = now.getMonth() + 1
  const year    = now.getFullYear()
  const day     = now.getDate()

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|yo)\b/.test(text))
    return `👋 Hey there! I'm **EmpBot**, your AI HR assistant. ${isAdmin ? `You manage **${employees.length} employees** today.` : 'How can I help you?'} Ask me anything — salary, attendance, leave, payroll, policies!`

  if (/\b(how are you|how r u|what's up|wassup)\b/.test(text))
    return `I'm running at 100%, thank you! 🚀 Ready to assist with all your HR needs. What can I do for you?`

  if (/\b(bye|goodbye|see you|later|cya)\b/.test(text))
    return `Goodbye! 👋 Have a productive day. I'm always here when you need HR help. ✨`

  if (/\b(thank|thanks|thx|ty|great|awesome|perfect|wonderful)\b/.test(text))
    return `You're very welcome! 😊 Anything else I can help you with?`

  if (/\b(salary|pay|payroll|paycheck|wage|compensation|monthly pay|income)\b/.test(text)) {
    const nextSalDay = day <= 3 ? 3 : 3
    const daysLeft = day < 3 ? 3 - day : day === 3 ? 0 : (new Date(year, month, 3) - now) / 86400000
    if (isAdmin) {
      const totalPayroll = employees.reduce((s, e) => s + e.salary, 0)
      const paidCount = employees.filter(e => getSalaryRecord(salaryRecords, e.empId, month, year)?.status === 'Paid').length
      return `💰 **Payroll Summary — ${MONTH_NAMES[month-1]} ${year}:**\n• Total Monthly Payroll: **${formatCurrency(totalPayroll)}**\n• Salaries Paid: ✅ ${paidCount}/${employees.length}\n• Salary Day: Every **3rd of the month**\n${day === 3 ? '🎉 Today IS Salary Day!' : day < 3 ? `⏳ ${3 - day} days until Salary Day` : '✅ This month\'s salaries have been processed'}\n\nGo to the **Salary** section to manage all records!`
    }
    const myRecord = salaryRecords.find(r => r.empId === 'EMP-0002' && r.month === month && r.year === year)
    const myEmp = employees.find(e => e.id === 2) || employees[0]
    return `💳 **Your Salary Info:**\n• Employee ID: **${myEmp?.empId || 'EMP-0002'}**\n• Monthly Salary: **${formatCurrency(myEmp?.salary || 0)}**\n• This Month Status: **${myRecord?.status || 'Pending'}**\n• Paid On: ${myRecord?.paidOn || 'Not yet'}\n\nSalary Day is the **3rd of every month**. Check the Salary section for full history!`
  }

  if (/\b(attendance|present|absent|mark|check in|check out|late)\b/.test(text)) {
    if (isAdmin) {
      const presentCount = employees.filter(e => attendanceRecords[e.id]?.[selectedDate]?.status === 'Present').length
      const absentCount  = employees.filter(e => attendanceRecords[e.id]?.[selectedDate]?.status === 'Absent').length
      return `📋 **Today's Attendance (${selectedDate}):**\n✅ Present: ${presentCount}\n❌ Absent: ${absentCount}\n⬜ Unmarked: ${employees.length - presentCount - absentCount}\n\nUse the Attendance section to mark records and add notes.`
    }
    return `📅 Your attendance is tracked daily. Use the date picker to view your history. Contact admin if any records need correction.`
  }

  if (/\b(schedule|meeting|event|shift|calendar|upcoming)\b/.test(text)) {
    const list = schedule.slice(0, 3).map(s => `• ${s.icon} ${s.title} — ${s.when}`).join('\n')
    return `📅 **Upcoming Schedule:**\n${list}\n\n${isAdmin ? 'Add new events from the Schedule section.' : 'Contact admin to update schedule items.'}`
  }

  if (/\b(employee|staff|team|member|roster|headcount)\b/.test(text)) {
    if (isAdmin) {
      const depts = [...new Set(employees.map(e => e.department))]
      return `👥 **Team Overview:**\n• Total: ${employees.length} employees\n• Departments: ${depts.join(', ')}\n\nEach employee has a unique **EMP-XXXX** ID linked to their name and salary!`
    }
    return `👤 View your profile, EMP ID, attendance, and salary slip from the dashboard.`
  }

  if (/\b(leave|vacation|holiday|time off|pto|sick|medical)\b/.test(text)) {
    return isAdmin
      ? `🏖️ Mark leave as "Absent" in the Attendance section with a note like "Approved Leave". Extended leave tracking is coming soon!`
      : `🏖️ To request leave, contact your HR admin or manager. They'll update your attendance record with the approved leave reason.`
  }

  if (/\b(emp id|employee id|id number|staff id|unique id)\b/.test(text)) {
    if (isAdmin)
      return `🪪 Every employee has a unique **EMP-XXXX** ID:\n${employees.slice(0, 4).map(e => `• ${e.empId} → ${e.name}`).join('\n')}\n...and ${Math.max(0, employees.length - 4)} more.\n\nIDs are auto-generated in order and permanently linked to salary records!`
    const myEmp = employees.find(e => e.id === 2) || employees[0]
    return `🪪 Your unique Employee ID is **${myEmp?.empId || 'EMP-0002'}**. This ID is permanently linked to your name, role, and salary records.`
  }

  if (/\b(benefit|perk|insurance|health|dental|gym|allowance)\b/.test(text))
    return `🎁 **Benefits Package:**\n• Health & Dental Insurance 🏥\n• Flexible Work Hours ⏰\n• Learning Budget 📚\n• Gym Membership 💪\n• Annual Bonus 🏆\n\nContact HR for detailed benefits info!`

  if (/\b(performance|review|appraisal|goal|kpi|rating|feedback)\b/.test(text))
    return isAdmin
      ? `📊 Schedule performance reviews via the Schedule Manager. Document feedback in attendance notes until the Performance module launches!`
      : `🌟 Check your Schedule tab for upcoming reviews. Maintain good attendance and complete tasks on time for great ratings!`

  if (/\b(remote|wfh|work from home|hybrid|office)\b/.test(text)) {
    const remoteCount = employees.filter(e => e.status === 'Remote').length
    return isAdmin
      ? `🏠 Currently **${remoteCount}** employees are working remotely. Remote status is shown on each employee card.`
      : `🏠 Your work arrangement is shown on your profile. For changes, discuss with your manager.`
  }

  if (/\b(it|tech|laptop|password|software|access|vpn|account)\b/.test(text))
    return `💻 **IT Support:**\n• Email: it@company.com\n• Password Reset → IT Self-Service Portal\n• VPN Issues → Reinstall VPN client\n• Access Requests → Submit form in IT portal`

  if (/\b(training|learn|course|certif|skill|workshop)\b/.test(text))
    return isAdmin
      ? `🎓 Schedule training sessions from the Schedule section. Support online certifications and cross-team learning programs!`
      : `📚 Check Schedule for training sessions. Ask your manager about the learning budget for external certifications!`

  if (/\b(stat|analytic|report|summary|overview|total|count)\b/.test(text)) {
    if (isAdmin) {
      const presentCount = employees.filter(e => attendanceRecords[e.id]?.[selectedDate]?.status === 'Present').length
      const totalPayroll = employees.reduce((s, e) => s + e.salary, 0)
      return `📊 **Dashboard Stats:**\n👥 Employees: ${employees.length}\n✅ Present Today: ${presentCount}\n💰 Monthly Payroll: ${formatCurrency(totalPayroll)}\n📅 Scheduled Events: ${schedule.length}`
    }
    return `📊 Your personal stats are on the dashboard — attendance history, schedule, and salary slip.`
  }

  if (/\b(time|today|date|day|week|month|current|now)\b/.test(text))
    return `📅 Today is **${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**\n⏰ Time: ${formatTime()}\n💰 ${day === 3 ? '🎉 TODAY IS SALARY DAY!' : day < 3 ? `Salary Day is in ${3 - day} days` : 'This month\'s salaries have been processed'}`

  if (/\b(help|what can|command|feature|guide)\b/.test(text))
    return `🤖 **I can help with:**\n\n💰 Salary & Payroll\n🪪 Employee IDs\n📋 Attendance\n📅 Schedules\n🏖️ Leave\n🎁 Benefits\n📊 Performance\n🏠 Remote Work\n💻 IT Support\n🎓 Training\n\nJust ask naturally! 😊`

  return isAdmin
    ? `🤖 I can help with **salary**, **attendance**, **employee IDs**, **schedules**, **payroll**, and much more. Try asking about any HR topic!`
    : `🤖 Ask me about your **salary**, **attendance**, **schedule**, **leave**, **benefits**, or **employee ID**. I'm here to help! 😊`
}

// ─── MAIN APP ────────────────────────────────────────────────────
export default function App() {
  // Auth
  const [isLoggedIn,   setIsLoggedIn]   = useState(false)
  const [role,         setRole]         = useState('admin')
  const [formData,     setFormData]     = useState({ email: '', password: '' })
  const [userName,     setUserName]     = useState('')
  const [authError,    setAuthError]    = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showCreds,    setShowCreds]    = useState(false)

  // Data
  const [employees,       setEmployees]       = useState(BASE_EMPLOYEES)
  const [salaryRecords,   setSalaryRecords]   = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState({})
  const [schedule,        setSchedule]        = useState(INITIAL_SCHEDULE)

  // API
  const [loading,    setLoading]    = useState(false)
  const [apiError,   setApiError]   = useState('')
  const [apiSuccess, setApiSuccess] = useState(false)

  // UI
  const [activeSection,   setActiveSection]   = useState('home')
  const [selectedDate,    setSelectedDate]    = useState(new Date().toISOString().split('T')[0])
  const [attendanceNote,  setAttendanceNote]  = useState('')
  const [newEmployee,     setNewEmployee]     = useState({ name: '', role: '', department: '', salary: '' })
  const [newScheduleItem, setNewScheduleItem] = useState({ title: '', when: '' })

  // Salary edit state
  const [editSalaryId, setEditSalaryId] = useState(null)
  const [editSalaryVal, setEditSalaryVal] = useState('')

  // Chatbot
  const [chatOpen,    setChatOpen]    = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "👋 Hi! I'm **EmpBot** — your AI HR assistant. Ask me about **salary**, **attendance**, **employee IDs**, leave, payroll, policies and much more!", time: formatTime() },
  ])
  const [chatInput, setChatInput]   = useState('')
  const [isTyping,  setIsTyping]    = useState(false)
  const chatLogRef = useRef(null)

  const quickPrompts = ['💰 My salary', '🪪 Employee IDs', '📋 Attendance today', '📅 Schedule', '🏖️ Leave policy', '📊 Team stats']

  // ── Date/Salary-day calculations ──────────────────────────────
  const todayD    = new Date()
  const todayDay  = todayD.getDate()
  const todayMonth = todayD.getMonth() + 1
  const todayYear = todayD.getFullYear()
  const isSalaryDay = todayDay === 3

  const getNextSalaryDate = () => {
    const d = new Date()
    if (d.getDate() <= 3) { d.setDate(3) }
    else { d.setMonth(d.getMonth() + 1); d.setDate(3) }
    d.setHours(0, 0, 0, 0)
    return d
  }
  const daysUntilSalary = isSalaryDay
    ? 0
    : Math.ceil((getNextSalaryDate() - new Date()) / 86400000)

  // ── Persist ────────────────────────────────────────────────────
  useEffect(() => {
    const savedAtt  = localStorage.getItem('em2_attendance')
    const savedEmps = localStorage.getItem('em2_employees')
    const savedSal  = localStorage.getItem('em2_salary')
    if (savedAtt)  setAttendanceRecords(JSON.parse(savedAtt))
    if (savedEmps) setEmployees(JSON.parse(savedEmps))
    if (savedSal)  setSalaryRecords(JSON.parse(savedSal))
  }, [])

  useEffect(() => { localStorage.setItem('em2_attendance', JSON.stringify(attendanceRecords)) }, [attendanceRecords])
  useEffect(() => { localStorage.setItem('em2_employees',  JSON.stringify(employees)) }, [employees])
  useEffect(() => { localStorage.setItem('em2_salary',     JSON.stringify(salaryRecords)) }, [salaryRecords])

  // ── API fetch after login ──────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return
    const controller = new AbortController()
    const fetchEmployees = async () => {
      setLoading(true); setApiError(''); setApiSuccess(false)
      try {
        const res  = await fetch(API_URL, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const fetched = (data?.users ?? []).map((item, i) => {
          const id   = item.id ?? i + 1
          const dept = item.company?.department || 'General'
          return {
            id,
            empId:       generateEmpId(id),
            name:        `${item.firstName ?? 'User'} ${item.lastName ?? ''}`.trim(),
            role:        item.company?.title || 'Team Member',
            department:  dept,
            status:      ['Active', 'Remote', 'On Leave', 'Active', 'Active', 'Remote'][i % 6],
            email:       item.email || `emp${id}@company.com`,
            joiningDate: `202${(i % 3) + 1}-${String((i % 12) + 1).padStart(2, '0')}-01`,
            salary:      assignSalary(dept, id),
          }
        })
        const next = fetched.length ? fetched : BASE_EMPLOYEES
        setEmployees(next)
        setApiSuccess(true)

        // Seed attendance
        setAttendanceRecords(prev => {
          const updated = { ...prev }
          next.forEach((e, i) => {
            if (!updated[e.id]) {
              updated[e.id] = {
                [selectedDate]: { status: i % 3 === 2 ? 'Absent' : 'Present', note: i % 3 === 2 ? '' : 'Auto-recorded' },
              }
            }
          })
          return updated
        })

        // Seed salary records
        setSalaryRecords(prev => {
          if (prev.length === 0) return buildSalaryRecords(next)
          // Add missing records for new employees
          const newRecs = [...prev]
          next.forEach(emp => {
            const has = newRecs.some(r => r.empId === emp.empId && r.month === todayMonth && r.year === todayYear)
            if (!has) {
              newRecs.push({ empId: emp.empId, month: todayMonth, year: todayYear, amount: emp.salary, status: todayDay >= 3 ? 'Paid' : 'Pending', paidOn: todayDay >= 3 ? `${todayYear}-${String(todayMonth).padStart(2,'0')}-03` : null })
            }
          })
          return newRecs
        })
      } catch {
        setApiError('Could not reach API. Showing sample data.')
        setEmployees(BASE_EMPLOYEES)
        if (salaryRecords.length === 0) setSalaryRecords(buildSalaryRecords(BASE_EMPLOYEES))
      } finally {
        setLoading(false)
      }
    }
    fetchEmployees()
    return () => controller.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  // ── Chat scroll ───────────────────────────────────────────────
  useEffect(() => {
    if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
  }, [chatMessages, isTyping])

  // ── Handlers ──────────────────────────────────────────────────
  const handleLogin = (e) => {
    e.preventDefault()
    setAuthError('')
    const { email, password } = formData
    const validAdmin = role === 'admin'    && email.trim() === ADMIN_CREDS.email    && password === ADMIN_CREDS.password
    const validEmp   = role === 'employee' && email.trim() === EMPLOYEE_CREDS.email && password === EMPLOYEE_CREDS.password
    if (!validAdmin && !validEmp) { setAuthError('Invalid credentials. See hints below.'); return }
    setUserName(validAdmin ? 'Admin User' : 'Employee')
    setIsLoggedIn(true)
    setFormData({ email: '', password: '' })
    setActiveSection('home')
    if (salaryRecords.length === 0) setSalaryRecords(buildSalaryRecords(employees))
  }

  const handleLogout = () => {
    setIsLoggedIn(false); setAuthError(''); setApiError(''); setApiSuccess(false)
    setChatMessages([{ sender: 'bot', text: "👋 Hi! I'm **EmpBot** — ask me about **salary**, **attendance**, **employee IDs** and more!", time: formatTime() }])
    setChatOpen(false)
  }

  const handleAddEmployee = (e) => {
    e.preventDefault()
    if (!newEmployee.name.trim() || !newEmployee.role.trim() || !newEmployee.department.trim()) return
    const maxId  = Math.max(...employees.map(e => e.id), 0) + 1
    const salary = parseInt(newEmployee.salary, 10) || assignSalary(newEmployee.department.trim(), maxId)
    const created = {
      id:          maxId,
      empId:       generateEmpId(maxId),
      name:        newEmployee.name.trim(),
      role:        newEmployee.role.trim(),
      department:  newEmployee.department.trim(),
      status:      'Active',
      email:       `${newEmployee.name.toLowerCase().replace(/\s+/, '.')}@company.com`,
      joiningDate: new Date().toISOString().split('T')[0],
      salary,
    }
    setEmployees(prev => [...prev, created])
    setAttendanceRecords(prev => ({ ...prev, [maxId]: {} }))
    setSalaryRecords(prev => [...prev, { empId: created.empId, month: todayMonth, year: todayYear, amount: salary, status: todayDay >= 3 ? 'Paid' : 'Pending', paidOn: todayDay >= 3 ? `${todayYear}-${String(todayMonth).padStart(2,'0')}-03` : null }])
    setNewEmployee({ name: '', role: '', department: '', salary: '' })
  }

  const handleAttendanceMark = (empId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [empId]: { ...prev[empId], [selectedDate]: { status, note: attendanceNote.trim() } },
    }))
    setAttendanceNote('')
  }

  const handleScheduleAdd = (e) => {
    e.preventDefault()
    if (!newScheduleItem.title.trim() || !newScheduleItem.when.trim()) return
    const nextId = Math.max(...schedule.map(s => s.id), 0) + 1
    setSchedule(prev => [...prev, { id: nextId, title: newScheduleItem.title.trim(), when: newScheduleItem.when.trim(), icon: '📌' }])
    setNewScheduleItem({ title: '', when: '' })
  }

  const handleMarkPaid = (empId) => {
    setSalaryRecords(prev => prev.map(r =>
      r.empId === empId && r.month === todayMonth && r.year === todayYear
        ? { ...r, status: 'Paid', paidOn: `${todayYear}-${String(todayMonth).padStart(2,'0')}-${String(todayDay).padStart(2,'0')}` }
        : r
    ))
  }

  const handleSalaryUpdate = (empId, newSalary) => {
    const sal = parseInt(newSalary, 10)
    if (isNaN(sal) || sal <= 0) return
    setEmployees(prev => prev.map(e => e.empId === empId ? { ...e, salary: sal } : e))
    setSalaryRecords(prev => prev.map(r => r.empId === empId && r.month === todayMonth && r.year === todayYear ? { ...r, amount: sal } : r))
    setEditSalaryId(null)
  }

  // Chat
  const sendChatMessage = (msg) => {
    const message = msg || chatInput.trim()
    if (!message) return
    setChatMessages(prev => [...prev, { sender: 'user', text: message, time: formatTime() }])
    setChatInput('')
    setIsTyping(true)
    setTimeout(() => {
      const reply = generateChatResponse(message, role, employees, schedule, attendanceRecords, selectedDate, salaryRecords)
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply, time: formatTime() }])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  const handleChatSubmit = (e) => { e.preventDefault(); sendChatMessage() }

  // ── Derived state ─────────────────────────────────────────────
  const myEmployee      = role === 'employee' ? (employees.find(e => e.id === 2) ?? employees[0]) : employees[0]
  const myAttendance    = Object.entries(attendanceRecords[myEmployee?.id] || {})
    .map(([date, rec]) => ({ date, ...rec })).sort((a, b) => b.date.localeCompare(a.date))
  const todayStatus     = attendanceRecords[myEmployee?.id]?.[selectedDate]?.status || 'Not Marked'
  const todayNote       = attendanceRecords[myEmployee?.id]?.[selectedDate]?.note   || ''
  const presentCount    = employees.filter(e => attendanceRecords[e.id]?.[selectedDate]?.status === 'Present').length
  const absentCount     = employees.filter(e => attendanceRecords[e.id]?.[selectedDate]?.status === 'Absent').length
  const remoteCount     = employees.filter(e => e.status === 'Remote').length
  const totalPayroll    = employees.reduce((s, e) => s + (e.salary || 0), 0)
  const paidThisMonth   = salaryRecords.filter(r => r.month === todayMonth && r.year === todayYear && r.status === 'Paid').length

  const getStatusBadgeClass = (s) => {
    if (!s || s === 'Not Marked') return 'unmarked'
    return s.toLowerCase().replace(/\s+/, '-')
  }

  const renderBotText = (text) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1
        ? <strong key={i}>{part}</strong>
        : part.split('\n').flatMap((line, j, arr) => j < arr.length - 1 ? [line, <br key={`br-${j}`} />] : [line])
    )

  // ══════════════════════════════════════════
  //  AURORA LOGIN PAGE
  // ══════════════════════════════════════════
  if (!isLoggedIn) {
    return (
      <div className="aurora-shell">
        {/* Aurora blobs */}
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
        <div className="aurora-blob aurora-blob-4" />
        <div className="aurora-blob aurora-blob-5" />

        {/* Twinkling stars */}
        <div className="aurora-stars" aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="aurora-star"
              style={{
                width:  `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                top:  `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                '--dur':   `${2 + Math.random() * 4}s`,
                '--delay': `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Centered login card */}
        <div className="login-card">
          {/* Logo */}
          <div className="login-logo-wrap">
            <div className="login-logo-ring">
              <div className="login-logo-ring-border" />
              <img src="/assist/hicas_logo-removebg-preview.png" alt="Ashes Tech Pvt Limited" className="login-logo-inner" />
            </div>
            <h1 className="login-title">Ashes Tech Pvt Limited</h1>
            <p className="login-subtitle">Employee Management System v2.0</p>
          </div>

          {/* Role cards */}
          <div className="role-cards-grid">
            <button
              type="button"
              className={`role-card-item admin ${role === 'admin' ? 'active' : ''}`}
              onClick={() => { setRole('admin'); setAuthError('') }}
            >
              <span className="role-card-icon" style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.4))' }}>⚙️</span>
              <div className="role-card-label">Admin</div>
              <div className="role-card-desc">Full control & management</div>
            </button>
            <button
              type="button"
              className={`role-card-item employee ${role === 'employee' ? 'active' : ''}`}
              onClick={() => { setRole('employee'); setAuthError('') }}
            >
              <span className="role-card-icon">👤</span>
              <div className="role-card-label">Employee</div>
              <div className="role-card-desc">View your portal & records</div>
            </button>
          </div>

          {/* Form */}
          {authError && (
            <div className="aurora-form-error">
              <span>⚠️</span> {authError}
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="on">
            {/* Email */}
            <div className="float-group">
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                autoComplete="email"
                required
              />
              <label htmlFor="login-email" className="float-label">📧 Email address</label>
            </div>

            {/* Password */}
            <div className="float-group">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                autoComplete="current-password"
                required
              />
              <label htmlFor="login-password" className="float-label">🔒 Password</label>
              <button type="button" className="float-suffix" onClick={() => setShowPassword(p => !p)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button type="submit" className="aurora-login-btn">
              Sign In to {role === 'admin' ? 'Admin Portal' : 'Employee Portal'}
            </button>
          </form>

          {/* Credentials hint */}
          <button type="button" className="cred-toggle-btn" onClick={() => setShowCreds(p => !p)}>
            {showCreds ? '🔼' : '🔽'} {showCreds ? 'Hide' : 'Show'} sample credentials
          </button>
          {showCreds && (
            <div className="cred-box">
              <div className="cred-row">
                <span className="cred-role">🛡️ Admin</span>
                <span className="cred-val">admin@example.com / admin123</span>
              </div>
              <div className="cred-row">
                <span className="cred-role">👤 Employee</span>
                <span className="cred-val">employee@example.com / employee123</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════
  //  DASHBOARD
  // ══════════════════════════════════════════
  const myEmpSalaryRecord = salaryRecords.find(r => r.empId === myEmployee?.empId && r.month === todayMonth && r.year === todayYear)
  const mySalaryHistory   = salaryRecords.filter(r => r.empId === myEmployee?.empId).sort((a, b) => b.year - a.year || b.month - a.month)

  return (
    <div className="dashboard-shell">
      <div className="mesh-bg" aria-hidden="true">
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
      </div>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            <img src="/assist/hicas_logo-removebg-preview.png" alt="Ashes Tech Pvt Limited" className="sidebar-logo-icon" />
            <div className="sidebar-logo-text">Ashes Tech Pvt Limited<span>v2.0 Premium</span></div>
          </div>

          <div className="sidebar-profile">
            <div className="sidebar-avatar" style={{ background: getAvatarGrad(1) }}>
              {getInitials(userName)}
            </div>
            <div>
              <div className="sidebar-user-name">{userName}</div>
              <div className="sidebar-user-role"><span className="role-dot" />{role === 'admin' ? 'Administrator' : 'Employee'}</div>
              {role === 'employee' && myEmployee && (
                <div className="sidebar-emp-id">{myEmployee.empId}</div>
              )}
            </div>
          </div>

          <div className="nav-section-label">Navigation</div>
          <nav className="nav-links">
            {[
              { id: 'home',       icon: '🏠', label: 'Dashboard' },
              { id: 'employees',  icon: '👥', label: 'Employees',  badge: employees.length },
              { id: 'attendance', icon: '📋', label: 'Attendance' },
              { id: 'schedule',   icon: '📅', label: 'Schedule',   badge: schedule.length },
              { id: 'salary',     icon: '💰', label: 'Salary',     badge: null },
            ].map(({ id, icon, label, badge }) => (
              <button
                key={id}
                type="button"
                className={`nav-link-btn ${activeSection === id ? 'active-link' : ''}`}
                onClick={() => setActiveSection(id)}
              >
                <span className="nav-icon">{icon}</span>
                {label}
                {badge != null && <span className="nav-badge">{badge}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button type="button" className="logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="portal-main">
        <header className="topbar">
          <div className="topbar-left">
            <h2>
              {activeSection === 'home'       && '🏠 Dashboard'}
              {activeSection === 'employees'  && '👥 Employees'}
              {activeSection === 'attendance' && '📋 Attendance'}
              {activeSection === 'schedule'   && '📅 Schedule'}
              {activeSection === 'salary'     && '💰 Salary Management'}
            </h2>
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="topbar-actions">
            <button type="button" className="icon-btn" title="AI Chatbot" onClick={() => setChatOpen(o => !o)}>🤖</button>
            <button type="button" className="icon-btn" title="Notifications">🔔</button>
          </div>
        </header>

        <div className="page-content">
          {/* API banner */}
          {(apiError || apiSuccess) && (
            <div className={`api-status-bar ${apiError ? 'error' : ''}`}>
              <span className={`api-dot ${apiError ? 'error' : ''}`} />
              {apiError || '✅ Live data loaded from DummyJSON API — 12 employees with unique IDs and salary data!'}
            </div>
          )}

          {/* ── STATS ROW ── */}
          {(activeSection === 'home' || activeSection === 'attendance') && (
            <div className="stats-row">
              {[
                { icon: '👥', label: 'Total Employees',    val: loading ? '–' : employees.length,  cls: 'purple' },
                { icon: '✅', label: 'Present Today',       val: loading ? '–' : presentCount,      cls: 'green' },
                { icon: '❌', label: 'Absent Today',        val: loading ? '–' : absentCount,       cls: 'pink' },
                { icon: '🏠', label: 'Working Remote',      val: loading ? '–' : remoteCount,       cls: 'cyan' },
              ].map(({ icon, label, val, cls }, i) => (
                <div className="stat-card" key={label} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className={`stat-icon ${cls}`}>{icon}</div>
                  <div className="stat-info">
                    <div className="stat-value">{val}</div>
                    <div className="stat-label">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'salary' && (
            <div className="stats-row">
              {[
                { icon: '💰', label: 'Monthly Payroll',  val: formatCurrency(totalPayroll),   cls: 'teal' },
                { icon: '✅', label: 'Salaries Paid',    val: `${paidThisMonth}/${employees.length}`, cls: 'green' },
                { icon: '⏳', label: 'Pending Payments', val: employees.length - paidThisMonth, cls: 'orange' },
                { icon: '📅', label: 'Salary Day',        val: isSalaryDay ? 'TODAY!' : `In ${daysUntilSalary}d`, cls: isSalaryDay ? 'green' : 'purple' },
              ].map(({ icon, label, val, cls }, i) => (
                <div className="stat-card" key={label} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className={`stat-icon ${cls}`}>{icon}</div>
                  <div className="stat-info">
                    <div className="stat-value" style={{ fontSize: typeof val === 'string' && val.length > 8 ? '1.2rem' : undefined }}>{val}</div>
                    <div className="stat-label">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ HOME ══ */}
          {activeSection === 'home' && role === 'admin' && (
            <div className="panel-grid">
              {/* Quick Attendance */}
              <div className="panel-card">
                <div className="panel-header"><h3>📋 Quick Attendance</h3><span className="status-chip live">Live</span></div>
                <div className="attendance-date-row">
                  <div className="date-input-wrapper">
                    <span className="date-label-icon">📅</span>
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                  </div>
                  <div className="date-badge">{selectedDate}</div>
                </div>
                <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>📝 Note</label>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>✏️</span>
                  <input
                    style={{ padding: '10px 14px 10px 40px', width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--text)', fontFamily: 'inherit' }}
                    value={attendanceNote}
                    onChange={e => setAttendanceNote(e.target.value)}
                    placeholder="Optional note..."
                  />
                </div>
                {loading ? [1,2,3].map(i => <div key={i} className="skeleton skeleton-card" />) : (
                  <div className="attendance-list">
                    {employees.slice(0, 6).map(emp => {
                      const rec = attendanceRecords[emp.id]?.[selectedDate]
                      return (
                        <div key={emp.id} className="attendance-item">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="emp-avatar" style={{ width: 36, height: 36, fontSize: '0.76rem', background: getAvatarGrad(emp.id) }}>{getInitials(emp.name)}</div>
                            <div>
                              <div className="att-name">{emp.name}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                                <span className="emp-id-tag">{emp.empId}</span>
                              </div>
                              {rec
                                ? <span className={`att-status-badge ${getStatusBadgeClass(rec.status)}`} style={{ marginTop: 4, display: 'inline-flex' }}>{rec.status === 'Present' ? '✅' : '❌'} {rec.status}{rec.note && ` · ${rec.note}`}</span>
                                : <span className="att-status-badge unmarked" style={{ marginTop: 4, display: 'inline-flex' }}>⬜ Not Marked</span>
                              }
                            </div>
                          </div>
                          <div className="att-actions">
                            <button type="button" className="att-btn present" onClick={() => handleAttendanceMark(emp.id, 'Present')}>✅</button>
                            <button type="button" className="att-btn absent"  onClick={() => handleAttendanceMark(emp.id, 'Absent')}>❌</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Right column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="panel-card">
                  <div className="panel-header"><h3>📅 Schedule</h3><span className="status-chip upcoming">Upcoming</span></div>
                  <div className="schedule-timeline">
                    {schedule.map(item => (
                      <div key={item.id} className="schedule-item">
                        <div className="schedule-icon">{item.icon || '📌'}</div>
                        <div className="schedule-info">
                          <div className="schedule-title">{item.title}</div>
                          <div className="schedule-time">⏰ {item.when}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="panel-card">
                  <div className="panel-header"><h3>➕ Add Employee</h3><span className="status-chip admin-only">Admin Only</span></div>
                  <form className="add-emp-form" onSubmit={handleAddEmployee}>
                    {[
                      { key: 'name',       icon: '👤', placeholder: 'Full Name' },
                      { key: 'role',       icon: '💼', placeholder: 'Role / Title' },
                      { key: 'department', icon: '🏢', placeholder: 'Department' },
                      { key: 'salary',     icon: '💰', placeholder: 'Monthly Salary (₹) — optional' },
                    ].map(({ key, icon, placeholder }) => (
                      <div className="input-group" key={key}>
                        <span className="input-icon">{icon}</span>
                        <input
                          value={newEmployee[key]}
                          onChange={e => setNewEmployee(p => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          type={key === 'salary' ? 'number' : 'text'}
                          min={key === 'salary' ? 1 : undefined}
                        />
                      </div>
                    ))}
                    <button type="submit" className="primary-btn">➕ Add Employee</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Home — Employee view */}
          {activeSection === 'home' && role === 'employee' && (
            <div className="panel-grid">
              <div className="panel-card">
                <div className="panel-header"><h3>📋 My Attendance</h3><span className="status-chip live">Tracked</span></div>
                <div className="my-attendance-summary">
                  <div className="my-att-avatar" style={{ background: getAvatarGrad(myEmployee?.id || 1) }}>{getInitials(myEmployee?.name || userName)}</div>
                  <div className="my-att-info">
                    <strong>{myEmployee?.name || userName}</strong>
                    <span>💼 {myEmployee?.role} · 🏢 {myEmployee?.department}</span>
                    <span style={{ marginTop: 3 }}><span className="emp-id-tag">{myEmployee?.empId}</span></span>
                  </div>
                  <div className={`today-status-pill att-status-badge ${getStatusBadgeClass(todayStatus)}`}>
                    {todayStatus === 'Present' ? '✅' : todayStatus === 'Absent' ? '❌' : '⬜'} {todayStatus}
                  </div>
                </div>
                <div className="attendance-date-row">
                  <div className="date-input-wrapper">
                    <span className="date-label-icon">📅</span>
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                  </div>
                  <div className="date-badge">Selected: {selectedDate}</div>
                </div>
                {todayNote && <div className="att-note-summary">📝 Note for {selectedDate}: <strong>{todayNote}</strong></div>}
                <div className="att-log-list">
                  {myAttendance.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>No records yet.</div>}
                  {myAttendance.map((entry, i) => (
                    <div key={i} className="att-log-item">
                      <div>
                        <div className="att-log-date">📅 {entry.date}</div>
                        {entry.note && <div className="att-log-note">📝 {entry.note}</div>}
                      </div>
                      <span className={`att-status-badge ${getStatusBadgeClass(entry.status)}`}>{entry.status === 'Present' ? '✅' : '❌'} {entry.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="panel-card">
                  <div className="panel-header"><h3>📅 My Schedule</h3><span className="status-chip upcoming">Upcoming</span></div>
                  <div className="schedule-timeline">
                    {schedule.map(item => (
                      <div key={item.id} className="schedule-item">
                        <div className="schedule-icon">{item.icon || '📌'}</div>
                        <div className="schedule-info">
                          <div className="schedule-title">{item.title}</div>
                          <div className="schedule-time">⏰ {item.when}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ EMPLOYEES ══ */}
          {activeSection === 'employees' && (
            <div className="panel-grid">
              <div className="panel-card">
                <div className="panel-header"><h3>👥 All Employees ({employees.length})</h3><span className="status-chip live">Live</span></div>
                {loading ? [1,2,3,4,5].map(i => <div key={i} className="skeleton skeleton-card" />) : (
                  <div className="employees-grid">
                    {employees.map(emp => (
                      <div key={emp.id} className="employee-card">
                        <div className="emp-avatar" style={{ background: getAvatarGrad(emp.id) }}>{getInitials(emp.name)}</div>
                        <div className="emp-info">
                          <div className="emp-name">{emp.name}</div>
                          <div className="emp-meta">💼 {emp.role} · 🏢 {emp.department}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <span className="emp-id-tag">{emp.empId}</span>
                            <span className="emp-salary">{formatCurrency(emp.salary)}/mo</span>
                          </div>
                        </div>
                        <span className={`att-status-badge ${emp.status === 'Active' ? 'present' : emp.status === 'Remote' ? 'remote' : 'unmarked'}`}>
                          {emp.status === 'Active' ? '🟢' : emp.status === 'Remote' ? '🔵' : '🟡'} {emp.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {role === 'admin' && (
                <div className="panel-card">
                  <div className="panel-header"><h3>➕ Add Employee</h3><span className="status-chip admin-only">Admin Only</span></div>
                  <form className="add-emp-form" onSubmit={handleAddEmployee}>
                    {[
                      { key: 'name',       icon: '👤', placeholder: 'Full Name' },
                      { key: 'role',       icon: '💼', placeholder: 'Role / Title' },
                      { key: 'department', icon: '🏢', placeholder: 'Department' },
                      { key: 'salary',     icon: '💰', placeholder: 'Monthly Salary (₹) — optional' },
                    ].map(({ key, icon, placeholder }) => (
                      <div className="input-group" key={key}>
                        <span className="input-icon">{icon}</span>
                        <input value={newEmployee[key]} onChange={e => setNewEmployee(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} type={key === 'salary' ? 'number' : 'text'} />
                      </div>
                    ))}
                    <button type="submit" className="primary-btn">➕ Add Employee</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ══ ATTENDANCE ══ */}
          {activeSection === 'attendance' && (
            <div className="panel-card">
              <div className="panel-header">
                <h3>📋 {role === 'admin' ? 'Team Attendance Management' : 'My Attendance Record'}</h3>
                <span className="status-chip live">Live</span>
              </div>
              <div className="attendance-date-row">
                <div className="date-input-wrapper">
                  <span className="date-label-icon">📅</span>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                </div>
                <div className="date-badge">Viewing: {selectedDate}</div>
              </div>
              {role === 'admin' && (
                <>
                  <div className="attendance-note-field">
                    <label className="field-label">📝 Attendance Note</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>✏️</span>
                      <input
                        style={{ padding: '10px 14px 10px 40px', width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--text)', fontFamily: 'inherit' }}
                        value={attendanceNote} onChange={e => setAttendanceNote(e.target.value)} placeholder="Optional note (e.g. approved leave, half day...)"
                      />
                    </div>
                  </div>
                  <div className="attendance-list">
                    {loading ? [1,2,3,4].map(i => <div key={i} className="skeleton skeleton-card" />) :
                      employees.map(emp => {
                        const rec = attendanceRecords[emp.id]?.[selectedDate]
                        return (
                          <div key={emp.id} className="attendance-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div className="emp-avatar" style={{ width: 38, height: 38, fontSize: '0.8rem', background: getAvatarGrad(emp.id) }}>{getInitials(emp.name)}</div>
                              <div>
                                <div className="att-name">{emp.name}</div>
                                <div style={{ display: 'flex', gap: 6, marginTop: 3 }}><span className="emp-id-tag">{emp.empId}</span></div>
                                <div className="att-dept" style={{ marginTop: 3 }}>💼 {emp.role} · 🏢 {emp.department}</div>
                                {rec ? <span className={`att-status-badge ${getStatusBadgeClass(rec.status)}`} style={{ marginTop: 4, display: 'inline-flex' }}>{rec.status === 'Present' ? '✅' : '❌'} {rec.status}{rec.note && ` · ${rec.note}`}</span>
                                     : <span className="att-status-badge unmarked" style={{ marginTop: 4, display: 'inline-flex' }}>⬜ Not Marked</span>}
                              </div>
                            </div>
                            <div className="att-actions">
                              <button type="button" className="att-btn present" onClick={() => handleAttendanceMark(emp.id, 'Present')}>✅ Present</button>
                              <button type="button" className="att-btn absent"  onClick={() => handleAttendanceMark(emp.id, 'Absent')}>❌ Absent</button>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </>
              )}
              {role === 'employee' && (
                <>
                  <div className="my-attendance-summary">
                    <div className="my-att-avatar" style={{ background: getAvatarGrad(myEmployee?.id || 1) }}>{getInitials(myEmployee?.name || userName)}</div>
                    <div className="my-att-info">
                      <strong>{myEmployee?.name || userName}</strong>
                      <span>💼 {myEmployee?.role} · 🏢 {myEmployee?.department}</span>
                      <span><span className="emp-id-tag">{myEmployee?.empId}</span></span>
                    </div>
                    <div className={`today-status-pill att-status-badge ${getStatusBadgeClass(todayStatus)}`}>{todayStatus === 'Present' ? '✅' : '❌'} {todayStatus}</div>
                  </div>
                  <div className="att-log-list">
                    {myAttendance.map((entry, i) => (
                      <div key={i} className="att-log-item">
                        <div><div className="att-log-date">📅 {entry.date}</div>{entry.note && <div className="att-log-note">📝 {entry.note}</div>}</div>
                        <span className={`att-status-badge ${getStatusBadgeClass(entry.status)}`}>{entry.status === 'Present' ? '✅' : '❌'} {entry.status}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ SCHEDULE ══ */}
          {activeSection === 'schedule' && (
            <div className="panel-grid">
              <div className="panel-card">
                <div className="panel-header"><h3>📅 All Events ({schedule.length})</h3><span className="status-chip upcoming">Team Plan</span></div>
                <div className="schedule-timeline">
                  {schedule.map(item => (
                    <div key={item.id} className="schedule-item">
                      <div className="schedule-icon">{item.icon || '📌'}</div>
                      <div className="schedule-info"><div className="schedule-title">{item.title}</div><div className="schedule-time">⏰ {item.when}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              {role === 'admin' && (
                <div className="panel-card">
                  <div className="panel-header"><h3>➕ Add Event</h3><span className="status-chip admin-only">Admin Only</span></div>
                  <form className="panel-form" onSubmit={handleScheduleAdd}>
                    <div className="input-group"><span className="input-icon">📋</span><input placeholder="Event title" value={newScheduleItem.title} onChange={e => setNewScheduleItem(p => ({ ...p, title: e.target.value }))} /></div>
                    <div className="input-group"><span className="input-icon">⏰</span><input placeholder="When? (e.g. Tue 2:00 PM)" value={newScheduleItem.when} onChange={e => setNewScheduleItem(p => ({ ...p, when: e.target.value }))} /></div>
                    <button type="submit" className="primary-btn">📌 Add Event</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ══ SALARY ══ */}
          {activeSection === 'salary' && (
            <>
              {/* Salary Day Banner */}
              <div className={`salary-day-banner ${isSalaryDay ? 'is-today' : 'upcoming'}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="sal-banner-icon">{isSalaryDay ? '🎉' : '💰'}</div>
                  <div>
                    <div className="sal-banner-title">
                      {isSalaryDay ? '🎉 Today is Salary Day!' : `Next Salary Day — ${MONTH_NAMES[daysUntilSalary <= 3 ? todayMonth - 1 : todayMonth % 12]} 3rd`}
                    </div>
                    <div className="sal-banner-sub">
                      {isSalaryDay
                        ? `Processing ${formatCurrency(totalPayroll)} in salaries for ${employees.length} employees`
                        : `${paidThisMonth}/${employees.length} salaries disbursed this month · Payroll: ${formatCurrency(totalPayroll)}`
                      }
                    </div>
                  </div>
                </div>
                <div className="sal-banner-right">
                  {isSalaryDay
                    ? <div className="sal-countdown-num">🎊</div>
                    : <>
                        <div className="sal-countdown-num">{daysUntilSalary}</div>
                        <div className="sal-countdown-label">days to go</div>
                      </>
                  }
                </div>
              </div>

              {/* Admin salary table */}
              {role === 'admin' && (
                <div className="panel-card">
                  <div className="panel-header">
                    <h3>💰 Salary Records — {MONTH_NAMES[todayMonth - 1]} {todayYear}</h3>
                    <span className="status-chip salary">{paidThisMonth}/{employees.length} Paid</span>
                  </div>
                  <div className="salary-table-wrap">
                    <table className="salary-table">
                      <thead>
                        <tr>
                          <th>EMP ID</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Role</th>
                          <th>Monthly Salary</th>
                          <th>Status</th>
                          <th>Paid On</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map(emp => {
                          const rec = getSalaryRecord(salaryRecords, emp.empId, todayMonth, todayYear)
                          const isEditing = editSalaryId === emp.empId
                          return (
                            <tr key={emp.empId}>
                              <td><span className="emp-id-tag">{emp.empId}</span></td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <div className="emp-avatar" style={{ width: 30, height: 30, fontSize: '0.7rem', flexShrink: 0, background: getAvatarGrad(emp.id) }}>{getInitials(emp.name)}</div>
                                  <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{emp.name}</span>
                                </div>
                              </td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{emp.department}</td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{emp.role}</td>
                              <td>
                                {isEditing
                                  ? <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                      <input className="salary-edit-input" type="number" value={editSalaryVal} onChange={e => setEditSalaryVal(e.target.value)} />
                                      <button type="button" className="save-sal-btn" onClick={() => handleSalaryUpdate(emp.empId, editSalaryVal)}>💾</button>
                                      <button type="button" className="save-sal-btn" style={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5' }} onClick={() => setEditSalaryId(null)}>✕</button>
                                    </div>
                                  : <span className="salary-amount-cell" style={{ cursor: 'pointer' }} onClick={() => { setEditSalaryId(emp.empId); setEditSalaryVal(emp.salary) }}>{formatCurrency(emp.salary)} ✏️</span>
                                }
                              </td>
                              <td>
                                <span className={`sal-badge ${rec?.status?.toLowerCase() || 'pending'}`}>
                                  {rec?.status === 'Paid' ? '✅' : rec?.status === 'Processing' ? '🔄' : '⏳'} {rec?.status || 'Pending'}
                                </span>
                              </td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{rec?.paidOn || '—'}</td>
                              <td>
                                {rec?.status !== 'Paid' && (
                                  <button type="button" className="mark-paid-btn" onClick={() => handleMarkPaid(emp.empId)}>
                                    💳 Mark Paid
                                  </button>
                                )}
                                {rec?.status === 'Paid' && <span style={{ color: 'var(--text-disabled)', fontSize: '0.78rem' }}>✓ Done</span>}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Employee salary slip */}
              {role === 'employee' && myEmployee && (
                <div className="panel-grid">
                  <div className="emp-salary-slip">
                    <div className="slip-header">
                      <div>
                        <div className="slip-label">Monthly Salary</div>
                        <div className="slip-amount">{formatCurrency(myEmployee.salary)}</div>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span className="emp-id-tag">{myEmployee.empId}</span>
                          <span className={`sal-badge ${myEmpSalaryRecord?.status?.toLowerCase() || 'pending'}`}>
                            {myEmpSalaryRecord?.status === 'Paid' ? '✅' : '⏳'} {myEmpSalaryRecord?.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="slip-label">Month</div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>{MONTH_NAMES[todayMonth - 1]} {todayYear}</div>
                        {myEmpSalaryRecord?.paidOn && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Paid: {myEmpSalaryRecord.paidOn}</div>}
                      </div>
                    </div>

                    <div className="slip-grid">
                      {[
                        { label: 'Employee ID', value: myEmployee.empId },
                        { label: 'Name', value: myEmployee.name },
                        { label: 'Role', value: myEmployee.role },
                        { label: 'Department', value: myEmployee.department },
                        { label: 'Joining Date', value: myEmployee.joiningDate },
                        { label: 'Email', value: myEmployee.email },
                      ].map(({ label, value }) => (
                        <div className="slip-item" key={label}>
                          <div className="slip-item-label">{label}</div>
                          <div className="slip-item-value" style={{ fontSize: label === 'Email' ? '0.78rem' : undefined }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="panel-card">
                    <div className="panel-header"><h3>📜 Salary History</h3><span className="status-chip salary">Last 4 Months</span></div>
                    <div className="salary-history-list">
                      {mySalaryHistory.map((rec, i) => (
                        <div key={i} className="salary-history-item">
                          <div>
                            <div className="sal-month">{MONTH_NAMES[rec.month - 1]} {rec.year}</div>
                            {rec.paidOn && <div className="sal-paid-on">📅 Paid: {rec.paidOn}</div>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span className="sal-hist-amount">{formatCurrency(rec.amount)}</span>
                            <span className={`sal-badge ${rec.status.toLowerCase()}`}>{rec.status === 'Paid' ? '✅' : '⏳'} {rec.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ══ FLOATING CHATBOT ══ */}
      <div className="chatbot-fab">
        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <div className="chat-bot-avatar">🤖</div>
              <div className="chat-header-info">
                <strong>EmpBot AI</strong>
                <span><span className="chat-online-dot" /> Online · 25+ HR Topics</span>
              </div>
              <button type="button" className="chat-close" onClick={() => setChatOpen(false)}>✕</button>
            </div>

            <div className="chat-log" ref={chatLogRef}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-message-wrapper ${msg.sender}`}>
                  <div className={`chat-bubble ${msg.sender}`}>
                    {msg.sender === 'bot' ? renderBotText(msg.text) : msg.text}
                  </div>
                  <div className="chat-time">{msg.time}</div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-message-wrapper bot">
                  <div className="typing-indicator">
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  </div>
                </div>
              )}
            </div>

            <div className="chat-quick-prompts">
              {quickPrompts.map(p => (
                <button key={p} type="button" className="quick-prompt" onClick={() => sendChatMessage(p)}>{p}</button>
              ))}
            </div>

            <form className="chat-input-area" onSubmit={handleChatSubmit}>
              <input className="chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask about salary, IDs, attendance..." />
              <button type="submit" className="chat-send-btn" disabled={isTyping}>➤</button>
            </form>
          </div>
        )}

        <button type="button" className="chat-fab-btn" onClick={() => setChatOpen(o => !o)} title="AI HR Chatbot">
          {chatOpen ? '✕' : '🤖'}
        </button>
      </div>
    </div>
  )
}
