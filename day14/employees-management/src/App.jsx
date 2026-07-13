import { useEffect, useRef, useState, useCallback } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : 'http://localhost:5000'

// ─── SALARY CONFIG ────────────────────────────────────────────────
const SALARY_RANGES = {
  Engineering: [85000, 150000], Operations: [55000, 90000], Sales: [50000, 85000],
  People: [45000, 75000], HR: [45000, 75000], Design: [65000, 100000],
  Analytics: [70000, 110000], Finance: [75000, 120000], Marketing: [55000, 85000], General: [40000, 65000],
}
const generateEmpId = (n) => `EMP-${String(n).padStart(4, '0')}`
const assignSalary = (department, numericId) => {
  const range = SALARY_RANGES[department] || [40000, 80000]
  const span = range[1] - range[0]
  return Math.round((range[0] + ((numericId * 7919) % span)) / 1000) * 1000
}
const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const BASE_EMPLOYEES = [
  { id: 1,  name: 'Alicia Gomez',   role: 'Operations Lead',   department: 'Operations',  status: 'Active',   email: 'alicia.gomez@company.com',   joiningDate: '2022-03-15', avatarPreset: 1, avatar: null },
  { id: 2,  name: 'Noah Chen',      role: 'Software Engineer', department: 'Engineering', status: 'Remote',   email: 'noah.chen@company.com',      joiningDate: '2021-07-01', avatarPreset: 2, avatar: null },
  { id: 3,  name: 'Liam Patel',     role: 'HR Specialist',     department: 'People',      status: 'On Leave', email: 'liam.patel@company.com',     joiningDate: '2023-01-10', avatarPreset: 3, avatar: null },
  { id: 4,  name: 'Sofia Rivers',   role: 'Sales Manager',     department: 'Sales',       status: 'Active',   email: 'sofia.rivers@company.com',   joiningDate: '2020-11-20', avatarPreset: 4, avatar: null },
  { id: 5,  name: 'Marcus Johnson', role: 'UI Designer',       department: 'Design',      status: 'Active',   email: 'marcus.johnson@company.com', joiningDate: '2022-08-05', avatarPreset: 1, avatar: null },
  { id: 6,  name: 'Priya Sharma',   role: 'Data Analyst',      department: 'Analytics',   status: 'Remote',   email: 'priya.sharma@company.com',   joiningDate: '2023-06-12', avatarPreset: 2, avatar: null },
  { id: 7,  name: 'Bala',           role: 'Software Engineer', department: 'Engineering', status: 'Active',   email: 'bala@company.com',           joiningDate: '2024-01-10', avatarPreset: 3, avatar: null },
  { id: 8,  name: 'Asbar',          role: 'UI Designer',       department: 'Design',      status: 'Active',   email: 'asbar@company.com',          joiningDate: '2024-02-15', avatarPreset: 4, avatar: null },
  { id: 9,  name: 'Nithis',         role: 'Data Analyst',      department: 'Analytics',   status: 'Active',   email: 'nithis@company.com',         joiningDate: '2024-03-20', avatarPreset: 1, avatar: null },
  { id: 10, name: 'Kamalesh',       role: 'HR Specialist',     department: 'People',      status: 'Active',   email: 'kamalesh@company.com',       joiningDate: '2024-04-05', avatarPreset: 2, avatar: null },
].map(e => ({ ...e, empId: generateEmpId(e.id), salary: assignSalary(e.department, e.id) }))

const INITIAL_SCHEDULE = [
  { id: 1, title: 'Weekly Team Sync',   when: 'Mon 10:00 AM', icon: 'sync' },
  { id: 2, title: 'Performance Review', when: 'Wed 2:00 PM',  icon: 'chart' },
  { id: 3, title: 'Training Session',   when: 'Fri 11:00 AM', icon: 'book' },
]

const AVATAR_GRADS = [
  'linear-gradient(135deg,#a855f7,#06b6d4)',
  'linear-gradient(135deg,#ec4899,#f97316)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#3b82f6,#a855f7)',
]

const getAvatarGrad = (preset) => AVATAR_GRADS[(preset - 1) % AVATAR_GRADS.length] || AVATAR_GRADS[0]
const getInitials   = (name) => (name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
const formatTime    = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const buildSalaryRecords = (emps) => {
  const now = new Date()
  const curMonth = now.getMonth() + 1, curYear = now.getFullYear(), curDay = now.getDate()
  const records = []
  for (let offset = 3; offset >= 0; offset--) {
    let m = curMonth - offset, y = curYear
    if (m <= 0) { m += 12; y -= 1 }
    const isPast = offset > 0
    const status = isPast ? 'Paid' : (curDay >= 3 ? 'Paid' : 'Pending')
    const paidOn = status === 'Paid' ? `${y}-${String(m).padStart(2,'0')}-03` : null
    emps.forEach(emp => records.push({ empId: emp.empId, month: m, year: y, amount: emp.salary, status, paidOn }))
  }
  return records
}

const getSalaryRecord = (records, empId, month, year) =>
  records.find(r => r.empId === empId && r.month === month && r.year === year) || null

const calcPaySlip = (salary) => {
  const basic = Math.round(salary * 0.50), hra = Math.round(salary * 0.20)
  const transport = Math.round(salary * 0.10), special = salary - basic - hra - transport
  const grossPay = salary, pfDed = Math.round(basic * 0.12), profTax = 200
  const incomeTax = Math.round(salary * 0.05), totalDed = pfDed + profTax + incomeTax
  return { basic, hra, transport, special, grossPay, pfDed, profTax, incomeTax, totalDed, netPay: grossPay - totalDed }
}

// ─── SVG ICON COMPONENTS ──────────────────────────────────────────
const Icons = {
  Home:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Users:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Calendar:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  DollarSign: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  Clipboard:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  LogOut:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Lock:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Sun:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  Bell:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Bot:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  Download:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  FileText:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Check:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:          () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  HalfCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a10 10 0 010 20"/><line x1="12" y1="2" x2="12" y2="22"/></svg>,
  Eye:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Camera:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  User:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Briefcase:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
  Building:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22V12h6v10"/><path d="M8 7h.01"/><path d="M12 7h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/></svg>,
  Plus:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  Send:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Search:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Pin:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  CreditCard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Save:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  ChevronDown:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Upload:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
  Crop:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.13 1L6 16a2 2 0 002 2h15"/><path d="M1 6.13L16 6a2 2 0 012 2v15"/></svg>,
  Admin:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/><path d="M16 11l1.5 1.5L20 10"/></svg>,
  Zap:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Award:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
}

// ─── AVATAR SVG PRESETS ───────────────────────────────────────────
const AvatarPresets = [
  { id: 1, grad: 'linear-gradient(135deg,#a855f7,#06b6d4)', svg: (
    <svg viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="32" r="16" fill="rgba(255,255,255,0.9)"/>
      <ellipse cx="40" cy="72" rx="26" ry="18" fill="rgba(255,255,255,0.7)"/>
      <circle cx="40" cy="32" r="10" fill="rgba(168,85,247,0.8)"/>
    </svg>
  )},
  { id: 2, grad: 'linear-gradient(135deg,#ec4899,#f97316)', svg: (
    <svg viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="30" r="15" fill="rgba(255,255,255,0.9)"/>
      <ellipse cx="40" cy="70" rx="25" ry="17" fill="rgba(255,255,255,0.7)"/>
      <rect x="30" y="22" width="20" height="8" rx="4" fill="rgba(236,72,153,0.8)"/>
    </svg>
  )},
  { id: 3, grad: 'linear-gradient(135deg,#10b981,#06b6d4)', svg: (
    <svg viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="31" r="15" fill="rgba(255,255,255,0.9)"/>
      <ellipse cx="40" cy="71" rx="25" ry="17" fill="rgba(255,255,255,0.7)"/>
      <path d="M32 28 Q40 20 48 28 Q48 36 40 38 Q32 36 32 28Z" fill="rgba(16,185,129,0.8)"/>
    </svg>
  )},
  { id: 4, grad: 'linear-gradient(135deg,#3b82f6,#a855f7)', svg: (
    <svg viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="30" r="15" fill="rgba(255,255,255,0.9)"/>
      <ellipse cx="40" cy="70" rx="25" ry="17" fill="rgba(255,255,255,0.7)"/>
      <polygon points="40,20 50,34 30,34" fill="rgba(59,130,246,0.8)"/>
    </svg>
  )},
]

// ─── AVATAR COMPONENT ─────────────────────────────────────────────
function EmployeeAvatar({ emp, size = 44, className = '' }) {
  const s = { width: size, height: size, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }
  if (emp?.avatar) {
    return <div style={s} className={`emp-avatar ${className}`}><img src={emp.avatar} alt={emp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
  }
  const preset = AvatarPresets.find(p => p.id === (emp?.avatarPreset || 1)) || AvatarPresets[0]
  return (
    <div style={{ ...s, background: preset.grad }} className={`emp-avatar ${className}`}>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {preset.svg}
      </div>
    </div>
  )
}

// ─── CHAT BOT RESPONSE ────────────────────────────────────────────
const generateChatResponse = (message, role, employees, schedule, attendanceRecords, selectedDate, salaryRecords) => {
  const text = message.toLowerCase().trim(), isAdmin = role === 'admin'
  const now = new Date(), month = now.getMonth() + 1, year = now.getFullYear(), day = now.getDate()

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|yo)\b/.test(text))
    return `Hey there! I'm **EmpBot**, your AI HR assistant. ${isAdmin ? `You manage **${employees.length} employees** today.` : 'How can I help you?'} Ask me anything about salary, attendance, leave, policies!`

  if (/\b(how are you|how r u|what's up|wassup)\b/.test(text))
    return `Running at 100%, thank you! Ready to assist with all your HR needs. What can I do for you?`

  if (/\b(bye|goodbye|see you|later|cya)\b/.test(text))
    return `Goodbye! Have a productive day. I'm always here when you need HR help.`

  if (/\b(thank|thanks|thx|ty|great|awesome|perfect|wonderful)\b/.test(text))
    return `You're very welcome! Anything else I can help you with?`

  if (/\b(salary|pay|payroll|paycheck|wage|compensation|monthly pay|income)\b/.test(text)) {
    if (isAdmin) {
      const totalPayroll = employees.reduce((s, e) => s + e.salary, 0)
      const paidCount = employees.filter(e => getSalaryRecord(salaryRecords, e.empId, month, year)?.status === 'Paid').length
      return `**Payroll Summary — ${MONTH_NAMES[month-1]} ${year}:**\n• Total Monthly Payroll: **${formatCurrency(totalPayroll)}**\n• Salaries Paid: ${paidCount}/${employees.length}\n• Salary Day: Every **3rd of the month**\n${day === 3 ? 'Today IS Salary Day!' : day < 3 ? `${3 - day} days until Salary Day` : 'This month\'s salaries processed'}\n\nGo to the **Salary** section to manage records!`
    }
    return `Your salary details are managed by your admin. Check the Attendance section for your records. Salary Day is the **3rd of every month**.`
  }

  if (/\b(attendance|present|absent|mark|check in|half day)\b/.test(text)) {
    if (isAdmin) {
      const presentCount = employees.filter(e => attendanceRecords[e.id]?.[selectedDate]?.status === 'Present').length
      const absentCount  = employees.filter(e => attendanceRecords[e.id]?.[selectedDate]?.status === 'Absent').length
      const halfCount    = employees.filter(e => attendanceRecords[e.id]?.[selectedDate]?.status === 'Half Day').length
      return `**Today's Attendance (${selectedDate}):**\nPresent: ${presentCount} | Absent: ${absentCount} | Half Day: ${halfCount}\nUnmarked: ${employees.length - presentCount - absentCount - halfCount}\n\nUse the Attendance section to mark records.`
    }
    return `Your attendance is tracked daily. Use the date picker to view your history. Contact admin for corrections.`
  }

  if (/\b(leave|vacation|holiday|time off|sick|medical|half)\b/.test(text))
    return isAdmin
      ? `Mark leave as "Absent" or "Half Day" in Attendance. You can also add notes for approved leave reasons!`
      : `To request leave, contact your HR admin. They'll update your attendance with the approved leave status.`

  if (/\b(schedule|meeting|event|calendar|upcoming)\b/.test(text)) {
    const list = schedule.slice(0, 3).map(s => `• ${s.title} — ${s.when}`).join('\n')
    return `**Upcoming Schedule:**\n${list}\n\n${isAdmin ? 'Add new events from the Schedule section.' : 'Contact admin to update schedule items.'}`
  }

  if (/\b(employee|staff|team|member|headcount)\b/.test(text)) {
    if (isAdmin) {
      const depts = [...new Set(employees.map(e => e.department))]
      return `**Team Overview:**\n• Total: ${employees.length} employees\n• Departments: ${depts.join(', ')}\n\nEach employee has a unique **EMP-XXXX** ID!`
    }
    return `View your profile, EMP ID, and attendance from the dashboard.`
  }

  if (/\b(password|change password|reset)\b/.test(text))
    return isAdmin
      ? `You can change your admin password from the **Change Password** button in the sidebar footer. Employees can also change theirs from their profile!`
      : `You can change your password from the sidebar. Click "Change Password" to update your credentials.`

  if (/\b(avatar|photo|picture|profile pic)\b/.test(text))
    return `You can update your profile avatar! Choose from **4 preset avatars** or upload and crop your own photo. Click your avatar in the sidebar to change it.`

  if (/\b(help|what can|feature|guide)\b/.test(text))
    return `**I can help with:**\n\nSalary & Payroll\nEmployee IDs\nAttendance & Half Day\nSchedules\nLeave Policy\nAvatars & Photos\nPassword Changes\n\nJust ask naturally!`

  return isAdmin
    ? `I can help with **salary**, **attendance**, **employee IDs**, **schedules**, **payroll**, and much more. Try asking about any HR topic!`
    : `Ask me about your **attendance**, **schedule**, **leave**, or **employee ID**. I'm here to help!`
}

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  // Auth
  const [isLoggedIn,   setIsLoggedIn]   = useState(false)
  const [role,         setRole]         = useState('admin')
  const [formData,     setFormData]     = useState({ username: '', password: '' })
  const [userName,     setUserName]     = useState('')
  const [authError,    setAuthError]    = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showCreds,    setShowCreds]    = useState(false)
  const [loggedInEmployee, setLoggedInEmployee] = useState(null)

  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('ems-theme') || 'dark')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ems-theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  // Data
  const [employees,         setEmployees]         = useState([])
  const [salaryRecords,     setSalaryRecords]     = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState({})
  const [schedule,          setSchedule]          = useState(INITIAL_SCHEDULE)

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
  const [searchQuery,     setSearchQuery]     = useState('')

  // Pay Slip Modal
  const [showPaySlipModal, setShowPaySlipModal] = useState(false)
  const [paySlipEmployee,  setPaySlipEmployee]  = useState(null)

  // Salary editing
  const [editSalaryId,  setEditSalaryId]  = useState(null)
  const [editSalaryVal, setEditSalaryVal] = useState('')

  // Change Password Modal
  const [showPwModal,  setShowPwModal]  = useState(false)
  const [pwForm,       setPwForm]       = useState({ current: '', newPw: '', confirm: '' })
  const [pwShowStates, setPwShowStates] = useState({ current: false, newPw: false, confirm: false })
  const [pwError,      setPwError]      = useState('')
  const [pwSuccess,    setPwSuccess]    = useState('')
  const [pwLoading,    setPwLoading]    = useState(false)

  // Avatar Modal
  const [showAvatarModal,  setShowAvatarModal]  = useState(false)
  const [avatarEditEmp,    setAvatarEditEmp]    = useState(null)
  const [selectedPreset,   setSelectedPreset]   = useState(1)
  const [uploadedImage,    setUploadedImage]    = useState(null) // raw data URL
  const [croppedImage,     setCroppedImage]     = useState(null) // cropped base64
  const [cropMode,         setCropMode]         = useState(false)
  const [cropRect,         setCropRect]         = useState({ x: 50, y: 50, size: 120 })
  const [isDragging,       setIsDragging]       = useState(false)
  const [dragStart,        setDragStart]        = useState({ x: 0, y: 0 })
  const cropCanvasRef = useRef(null)
  const cropImgRef    = useRef(null)
  const fileInputRef  = useRef(null)

  // Chatbot
  const [chatOpen,     setChatOpen]     = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Hi! I'm **EmpBot** — your AI HR assistant. Ask me about **salary**, **attendance**, **employee IDs**, leave, and more!", time: formatTime() },
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping,  setIsTyping]  = useState(false)
  const chatLogRef = useRef(null)

  const quickPrompts = ['My salary', 'Attendance today', 'Schedule', 'Leave policy', 'Change password', 'Avatar help']

  // Date calculations
  const todayD     = new Date()
  const todayDay   = todayD.getDate()
  const todayMonth = todayD.getMonth() + 1
  const todayYear  = todayD.getFullYear()
  const isSalaryDay = todayDay === 3

  const getNextSalaryDate = () => {
    const d = new Date()
    if (d.getDate() <= 3) { d.setDate(3) } else { d.setMonth(d.getMonth() + 1); d.setDate(3) }
    d.setHours(0, 0, 0, 0); return d
  }
  const daysUntilSalary = isSalaryDay ? 0 : Math.ceil((getNextSalaryDate() - new Date()) / 86400000)

  // ── API fetch ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return
    const controller = new AbortController()
    const fetchData = async () => {
      setLoading(true); setApiError(''); setApiSuccess(false)
      try {
        const empRes  = await fetch(`${API_BASE_URL}/api/employees`,  { signal: controller.signal })
        if (!empRes.ok) throw new Error(`HTTP ${empRes.status}`)
        setEmployees(await empRes.json())

        const attRes  = await fetch(`${API_BASE_URL}/api/attendance`,  { signal: controller.signal })
        if (attRes.ok)  setAttendanceRecords(await attRes.json())

        const schedRes = await fetch(`${API_BASE_URL}/api/schedule`,   { signal: controller.signal })
        if (schedRes.ok) setSchedule(await schedRes.json())

        const salRes  = await fetch(`${API_BASE_URL}/api/salary`,      { signal: controller.signal })
        if (salRes.ok)  setSalaryRecords(await salRes.json())

        setApiSuccess(true)
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error(err)
        setApiError('Could not reach backend. Showing sample data.')
        setEmployees(BASE_EMPLOYEES)
        if (salaryRecords.length === 0) setSalaryRecords(buildSalaryRecords(BASE_EMPLOYEES))
      } finally { setLoading(false) }
    }
    fetchData()
    return () => controller.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  useEffect(() => {
    if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
  }, [chatMessages, isTyping])

  // ── Crop Canvas Drawing ──────────────────────────────────────────
  const drawCrop = useCallback(() => {
    const canvas = cropCanvasRef.current, img = cropImgRef.current
    if (!canvas || !img || !img.complete) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    ctx.drawImage(img, 0, 0, W, H)
    // Dim overlay
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, W, H)
    // Crop circle
    const { x, y, size } = cropRect
    ctx.save()
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(img, 0, 0, W, H)
    ctx.restore()
    // Circle border
    ctx.strokeStyle = '#a855f7'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
    ctx.stroke()
  }, [cropRect])

  useEffect(() => { if (cropMode && uploadedImage) drawCrop() }, [cropMode, uploadedImage, cropRect, drawCrop])

  const handleCropMouseDown = (e) => {
    const rect = cropCanvasRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const { x, y, size } = cropRect
    if (mx >= x && mx <= x + size && my >= y && my <= y + size) {
      setIsDragging(true); setDragStart({ x: mx - x, y: my - y })
    }
  }
  const handleCropMouseMove = (e) => {
    if (!isDragging) return
    const rect = cropCanvasRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const W = cropCanvasRef.current.width, H = cropCanvasRef.current.height
    const { size } = cropRect
    const nx = Math.max(0, Math.min(mx - dragStart.x, W - size))
    const ny = Math.max(0, Math.min(my - dragStart.y, H - size))
    setCropRect(prev => ({ ...prev, x: nx, y: ny }))
  }
  const handleCropMouseUp = () => setIsDragging(false)

  const applyCrop = () => {
    const canvas = cropCanvasRef.current, img = cropImgRef.current
    if (!canvas || !img) return
    const { x, y, size } = cropRect
    const scaleX = img.naturalWidth / canvas.width, scaleY = img.naturalHeight / canvas.height
    const out = document.createElement('canvas')
    out.width = out.height = 200
    const ctx = out.getContext('2d')
    ctx.drawImage(img, x * scaleX, y * scaleY, size * scaleX, size * scaleY, 0, 0, 200, 200)
    const b64 = out.toDataURL('image/jpeg', 0.9)
    setCroppedImage(b64); setCropMode(false)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setUploadedImage(ev.target.result); setCropMode(true); setCroppedImage(null) }
    reader.readAsDataURL(file)
  }

  const handleSaveAvatar = async () => {
    if (!avatarEditEmp) return
    const payload = {}
    if (croppedImage) { payload.avatarBase64 = croppedImage }
    else { payload.avatarPreset = selectedPreset }
    try {
      await axios.put(`${API_BASE_URL}/api/employees/${avatarEditEmp.empId}/avatar`, payload)
      const empsRes = await axios.get(`${API_BASE_URL}/api/employees`)
      setEmployees(empsRes.data)
      if (loggedInEmployee && loggedInEmployee.empId === avatarEditEmp.empId) {
        const updated = empsRes.data.find(e => e.empId === avatarEditEmp.empId)
        if (updated) setLoggedInEmployee(updated)
      }
    } catch (err) {
      console.error(err)
      // Apply locally
      setEmployees(prev => prev.map(e => e.empId === avatarEditEmp.empId
        ? { ...e, ...(croppedImage ? { avatar: croppedImage, avatarPreset: 0 } : { avatarPreset: selectedPreset, avatar: null }) }
        : e
      ))
    }
    setShowAvatarModal(false); setUploadedImage(null); setCroppedImage(null); setCropMode(false)
  }

  const openAvatarModal = (emp) => {
    setAvatarEditEmp(emp)
    setSelectedPreset(emp.avatarPreset || 1)
    setUploadedImage(null); setCroppedImage(null); setCropMode(false)
    setShowAvatarModal(true)
  }

  // ── Handlers ────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault(); setAuthError('')
    const { username, password } = formData
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, { username, password, role })
      if (res.data.success) {
        setIsLoggedIn(true)
        setUserName(res.data.role === 'admin' ? 'Admin User' : res.data.user.name)
        if (res.data.role === 'employee') setLoggedInEmployee(res.data.user)
        else setLoggedInEmployee(null)
        setFormData({ username: '', password: '' })
        setActiveSection('home')
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Invalid credentials or backend offline.')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false); setAuthError(''); setApiError(''); setApiSuccess(false)
    setLoggedInEmployee(null)
    setChatMessages([{ sender: 'bot', text: "Hi! I'm **EmpBot** — ask me about salary, attendance, and more!", time: formatTime() }])
    setChatOpen(false)
  }

  const handleAddEmployee = async (e) => {
    e.preventDefault()
    if (!newEmployee.name.trim() || !newEmployee.role.trim() || !newEmployee.department.trim()) return
    const salary = parseInt(newEmployee.salary, 10) || ''
    try {
      const res = await axios.post(`${API_BASE_URL}/api/employees`, { name: newEmployee.name.trim(), role: newEmployee.role.trim(), department: newEmployee.department.trim(), salary })
      if (res.data.success) {
        const [empsRes, salRes, attRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/employees`),
          axios.get(`${API_BASE_URL}/api/salary`),
          axios.get(`${API_BASE_URL}/api/attendance`),
        ])
        setEmployees(empsRes.data); setSalaryRecords(salRes.data); setAttendanceRecords(attRes.data)
        setNewEmployee({ name: '', role: '', department: '', salary: '' })
      }
    } catch (err) { console.error(err); alert('Failed to add employee') }
  }

  const handleAttendanceMark = async (empId, status) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/attendance`, { empId, date: selectedDate, status, note: attendanceNote.trim() })
      if (res.data.success) {
        const attRes = await axios.get(`${API_BASE_URL}/api/attendance`)
        setAttendanceRecords(attRes.data); setAttendanceNote('')
      }
    } catch (err) { console.error(err); alert('Failed to update attendance') }
  }

  const handleScheduleAdd = async (e) => {
    e.preventDefault()
    if (!newScheduleItem.title.trim() || !newScheduleItem.when.trim()) return
    try {
      const res = await axios.post(`${API_BASE_URL}/api/schedule`, { title: newScheduleItem.title.trim(), when: newScheduleItem.when.trim() })
      if (res.data.success) {
        const schedRes = await axios.get(`${API_BASE_URL}/api/schedule`)
        setSchedule(schedRes.data); setNewScheduleItem({ title: '', when: '' })
      }
    } catch (err) { console.error(err); alert('Failed to add schedule item') }
  }

  const handleMarkPaid = async (empId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/salary/pay`, { empId, month: todayMonth, year: todayYear })
      if (res.data.success) { const salRes = await axios.get(`${API_BASE_URL}/api/salary`); setSalaryRecords(salRes.data) }
    } catch (err) { console.error(err); alert('Failed to mark salary paid') }
  }

  const handleSalaryUpdate = async (empId, newSalary) => {
    const sal = parseInt(newSalary, 10)
    if (isNaN(sal) || sal <= 0) return
    try {
      const res = await axios.put(`${API_BASE_URL}/api/employees/${empId}/salary`, { salary: sal })
      if (res.data.success) {
        const [empsRes, salRes] = await Promise.all([axios.get(`${API_BASE_URL}/api/employees`), axios.get(`${API_BASE_URL}/api/salary`)])
        setEmployees(empsRes.data); setSalaryRecords(salRes.data); setEditSalaryId(null)
      }
    } catch (err) { console.error(err); alert('Failed to update salary') }
  }

  const handleDeleteEmployee = async (empId) => {
    if (!window.confirm(`Delete employee ${empId}? This cannot be undone.`)) return
    try {
      await axios.delete(`${API_BASE_URL}/api/employees/${empId}`)
      const [empsRes, salRes, attRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/employees`),
        axios.get(`${API_BASE_URL}/api/salary`),
        axios.get(`${API_BASE_URL}/api/attendance`),
      ])
      setEmployees(empsRes.data); setSalaryRecords(salRes.data); setAttendanceRecords(attRes.data)
    } catch (err) { console.error(err); alert('Failed to delete employee') }
  }

  const handleStatusChange = async (empId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/employees/${empId}/status`, { status: newStatus })
      const empsRes = await axios.get(`${API_BASE_URL}/api/employees`)
      setEmployees(empsRes.data)
    } catch (err) { console.error(err); alert('Failed to update status') }
  }

  const handleExportExcel = () => window.open(`${API_BASE_URL}/api/export/excel`, '_blank')

  const handleDownloadPaySlip = () => window.print()

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault(); setPwError(''); setPwSuccess('')
    if (pwForm.newPw !== pwForm.confirm) { setPwError('New passwords do not match.'); return }
    if (pwForm.newPw.length < 6) { setPwError('New password must be at least 6 characters.'); return }
    setPwLoading(true)
    try {
      let url, payload
      if (role === 'admin') {
        url = `${API_BASE_URL}/api/admin/password`
        payload = { currentPassword: pwForm.current, newPassword: pwForm.newPw }
      } else {
        url = `${API_BASE_URL}/api/employees/${loggedInEmployee?.empId}/password`
        payload = { currentPassword: pwForm.current, newPassword: pwForm.newPw }
      }
      const res = await axios.put(url, payload)
      if (res.data.success) {
        setPwSuccess('Password changed successfully!')
        setPwForm({ current: '', newPw: '', confirm: '' })
        setTimeout(() => { setShowPwModal(false); setPwSuccess('') }, 2000)
      }
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password.')
    } finally { setPwLoading(false) }
  }

  // Chat
  const sendChatMessage = (msg) => {
    const message = msg || chatInput.trim(); if (!message) return
    setChatMessages(prev => [...prev, { sender: 'user', text: message, time: formatTime() }])
    setChatInput(''); setIsTyping(true)
    setTimeout(() => {
      const reply = generateChatResponse(message, role, employees, schedule, attendanceRecords, selectedDate, salaryRecords)
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply, time: formatTime() }])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  // ── Derived State ────────────────────────────────────────────────
  const myEmployee     = role === 'employee' ? (employees.find(e => e.id === loggedInEmployee?.id) ?? loggedInEmployee ?? employees[0]) : employees[0]
  const myAttendance   = Object.entries(attendanceRecords[myEmployee?.id] || {}).map(([date, rec]) => ({ date, ...rec })).sort((a, b) => b.date.localeCompare(a.date))
  const todayStatus    = attendanceRecords[myEmployee?.id]?.[selectedDate]?.status || 'Not Marked'
  const todayNote      = attendanceRecords[myEmployee?.id]?.[selectedDate]?.note   || ''
  const presentCount   = employees.filter(e => attendanceRecords[e.id]?.[selectedDate]?.status === 'Present').length
  const absentCount    = employees.filter(e => attendanceRecords[e.id]?.[selectedDate]?.status === 'Absent').length
  const halfDayCount   = employees.filter(e => attendanceRecords[e.id]?.[selectedDate]?.status === 'Half Day').length
  const remoteCount    = employees.filter(e => e.status === 'Remote').length
  const totalPayroll   = employees.reduce((s, e) => s + (e.salary || 0), 0)
  const paidThisMonth  = salaryRecords.filter(r => r.month === todayMonth && r.year === todayYear && r.status === 'Paid').length
  const filteredEmployees = employees.filter(emp =>
    !searchQuery ||
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadgeClass = (s) => {
    if (!s || s === 'Not Marked') return 'unmarked'
    if (s === 'Half Day') return 'half-day'
    return s.toLowerCase().replace(/\s+/, '-')
  }

  const getStatusIcon = (s) => {
    if (s === 'Present') return <Icons.Check />
    if (s === 'Absent')  return <Icons.X />
    if (s === 'Half Day') return <Icons.HalfCircle />
    return null
  }

  const renderBotText = (text) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1
        ? <strong key={i}>{part}</strong>
        : part.split('\n').flatMap((line, j, arr) => j < arr.length - 1 ? [line, <br key={`br-${j}`} />] : [line])
    )

  // ── Pay Slip Render ──────────────────────────────────────────────
  const renderPaySlip = (emp, salRecord) => {
    const ps = calcPaySlip(emp.salary)
    return (
      <div className="pay-slip-card">
        <div className="pay-slip-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src="/assist/hicas_logo-removebg-preview.png" alt="Logo" className="pay-slip-logo" />
            <div>
              <div className="pay-slip-company-name">Ashes Tech Pvt Limited</div>
              <div className="pay-slip-company-addr">Chennai, Tamil Nadu · India</div>
            </div>
          </div>
          <div className="pay-slip-month-badge">
            <div className="pay-slip-month-label">PAY SLIP</div>
            <div className="pay-slip-month-val">{MONTH_NAMES[todayMonth - 1]} {todayYear}</div>
          </div>
        </div>

        <div className="pay-slip-info-grid">
          {[
            { label: 'Employee Name', val: emp.name },
            { label: 'Employee ID',   val: emp.empId },
            { label: 'Designation',   val: emp.role },
            { label: 'Department',    val: emp.department },
            { label: 'Date of Joining', val: emp.joiningDate },
            { label: 'Email',         val: emp.email },
          ].map(({ label, val }) => (
            <div className="pay-slip-info-item" key={label}>
              <div className="pay-slip-info-label">{label}</div>
              <div className="pay-slip-info-val">{val}</div>
            </div>
          ))}
        </div>

        <div className="pay-slip-earnings-wrap">
          <table className="pay-slip-breakdown-table">
            <thead>
              <tr>
                <th colSpan="2" className="earn-head">Earnings</th>
                <th colSpan="2" className="deduct-head">Deductions</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Basic Pay <span className="ps-pct">(50%)</span></td><td className="ps-amt">{formatCurrency(ps.basic)}</td><td>Provident Fund <span className="ps-pct">(12% of Basic)</span></td><td className="ps-deduct">{formatCurrency(ps.pfDed)}</td></tr>
              <tr><td>House Rent Allow. <span className="ps-pct">(20%)</span></td><td className="ps-amt">{formatCurrency(ps.hra)}</td><td>Professional Tax</td><td className="ps-deduct">{formatCurrency(ps.profTax)}</td></tr>
              <tr><td>Transport Allow. <span className="ps-pct">(10%)</span></td><td className="ps-amt">{formatCurrency(ps.transport)}</td><td>Income Tax <span className="ps-pct">(5%)</span></td><td className="ps-deduct">{formatCurrency(ps.incomeTax)}</td></tr>
              <tr><td>Special Allowance</td><td className="ps-amt">{formatCurrency(ps.special)}</td><td></td><td></td></tr>
            </tbody>
            <tfoot>
              <tr className="ps-total-row">
                <td><strong>Gross Pay</strong></td><td className="ps-amt ps-total">{formatCurrency(ps.grossPay)}</td>
                <td><strong>Total Deductions</strong></td><td className="ps-deduct ps-total">{formatCurrency(ps.totalDed)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="pay-slip-net-row">
          <div>
            <div className="net-pay-label">Net Take Home Pay</div>
            <div className="net-pay-note">{formatCurrency(ps.grossPay)} − {formatCurrency(ps.totalDed)} deductions</div>
          </div>
          <div className="net-pay-amount">{formatCurrency(ps.netPay)}</div>
        </div>

        <div className="pay-slip-footer-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>Payment Status:</span>
            <span className={`sal-badge ${salRecord?.status?.toLowerCase() || 'pending'}`}>
              {salRecord?.status === 'Paid' ? <Icons.Check /> : <Icons.Clock />} {salRecord?.status || 'Pending'}
            </span>
            {salRecord?.paidOn && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>· Paid on {salRecord.paidOn}</span>}
          </div>
          <div className="pay-slip-disclaimer">Computer-generated pay slip · No signature required</div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════
  //  LOGIN PAGE
  // ══════════════════════════════════════════
  if (!isLoggedIn) {
    return (
      <div className="aurora-shell">
        {/* Theme toggle on login */}
        <button onClick={toggleTheme} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '8px 14px', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', zIndex: 20, backdropFilter: 'blur(10px)' }}>
          <span style={{ width: 18, height: 18 }}>{theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}</span>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className="aurora-blob aurora-blob-1" /><div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" /><div className="aurora-blob aurora-blob-4" />
        <div className="aurora-blob aurora-blob-5" />
        <div className="aurora-stars" aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="aurora-star" style={{ width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, '--dur': `${2 + Math.random() * 4}s`, '--delay': `${Math.random() * 3}s` }} />
          ))}
        </div>

        <div className="login-card">
          <div className="login-logo-wrap">
            <div className="login-logo-ring">
              <div className="login-logo-ring-border" />
              <img src="/assist/hicas_logo-removebg-preview.png" alt="Ashes Tech Pvt Limited" className="login-logo-inner" />
            </div>
            <h1 className="login-title">Ashes Tech Pvt Limited</h1>
            <p className="login-subtitle">Employee Management System v2.0</p>
          </div>

          <div className="role-cards-grid">
            <button type="button" className={`role-card-item admin ${role === 'admin' ? 'active' : ''}`} onClick={() => { setRole('admin'); setAuthError('') }}>
              <div className="role-card-svg"><Icons.Admin /></div>
              <div className="role-card-label">Admin</div>
              <div className="role-card-desc">Full control & management</div>
            </button>
            <button type="button" className={`role-card-item employee ${role === 'employee' ? 'active' : ''}`} onClick={() => { setRole('employee'); setAuthError('') }}>
              <div className="role-card-svg"><Icons.User /></div>
              <div className="role-card-label">Employee</div>
              <div className="role-card-desc">View your portal & records</div>
            </button>
          </div>

          {authError && (
            <div className="aurora-form-error">
              <span style={{ width: 16, height: 16 }}><Icons.X /></span> {authError}
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="on">
            <div className="float-group">
              <input id="login-username" type="text" name="username" placeholder="Username" value={formData.username} onChange={e => setFormData(p => ({ ...p, username: e.target.value }))} autoComplete="username" required />
              <label htmlFor="login-username" className="float-label"><span style={{ width: 14, height: 14 }}><Icons.User /></span> Username</label>
            </div>
            <div className="float-group">
              <input id="login-password" type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} autoComplete="current-password" required />
              <label htmlFor="login-password" className="float-label"><span style={{ width: 14, height: 14 }}><Icons.Lock /></span> Password</label>
              <button type="button" className="float-suffix" onClick={() => setShowPassword(p => !p)}>
                <span style={{ width: 16, height: 16 }}>{showPassword ? <Icons.EyeOff /> : <Icons.Eye />}</span>
              </button>
            </div>
            <button type="submit" className="aurora-login-btn">
              <span style={{ width: 18, height: 18 }}><Icons.Zap /></span>
              Sign In to {role === 'admin' ? 'Admin Portal' : 'Employee Portal'}
            </button>
          </form>

          <button type="button" className="cred-toggle-btn" onClick={() => setShowCreds(p => !p)}>
            <span style={{ width: 14, height: 14 }}><Icons.ChevronDown /></span> {showCreds ? 'Hide' : 'Show'} sample credentials
          </button>
          {showCreds && (
            <div className="cred-box" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="cred-row">
                <span className="cred-role"><Icons.Admin style={{ width: 12, height: 12 }} /> Admin</span>
                <span className="cred-val">admin / admin123</span>
              </div>
              <div className="cred-row" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, display: 'block' }}>
                <span className="cred-role" style={{ display: 'block', marginBottom: 5 }}><span style={{ width: 12, height: 12, display: 'inline-block' }}><Icons.Users /></span> Employees</span>
                <div style={{ display: 'grid', gap: '4px', fontSize: '0.8rem', textAlign: 'left' }}>
                  <div>• <strong>Bala:</strong> bala / bala123</div>
                  <div>• <strong>Asbar:</strong> asbar / asbar123</div>
                  <div>• <strong>Nithis:</strong> nithis / nithis123</div>
                  <div>• <strong>Kamalesh:</strong> kamalesh / kamalesh123</div>
                </div>
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

  // Nav items — employees don't see Salary
  const navItems = [
    { id: 'home',       icon: <Icons.Home />,      label: 'Dashboard' },
    { id: 'employees',  icon: <Icons.Users />,     label: 'Employees',  badge: employees.length },
    { id: 'attendance', icon: <Icons.Clipboard />, label: 'Attendance' },
    { id: 'schedule',   icon: <Icons.Calendar />,  label: 'Schedule',   badge: schedule.length },
    ...(role === 'admin' ? [{ id: 'salary', icon: <Icons.DollarSign />, label: 'Salary' }] : []),
  ]

  return (
    <div className="dashboard-shell">
      <div className="mesh-bg" aria-hidden="true">
        <div className="mesh-orb mesh-orb-1" /><div className="mesh-orb mesh-orb-2" />
      </div>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <img src="/assist/hicas_logo-removebg-preview.png" alt="Ashes Tech" />
            </div>
            <div className="sidebar-logo-text">Ashes Tech Pvt Ltd<span>v2.0 Premium</span></div>
          </div>

          <div className="sidebar-profile">
            <div style={{ cursor: 'pointer', flexShrink: 0 }} title="Change Avatar" onClick={() => openAvatarModal(myEmployee || employees[0])}>
              <EmployeeAvatar emp={role === 'employee' ? myEmployee : { avatarPreset: 1, avatar: null, name: userName }} size={42} />
            </div>
            <div>
              <div className="sidebar-user-name">{userName}</div>
              <div className="sidebar-user-role"><span className="role-dot" />{role === 'admin' ? 'Administrator' : 'Employee'}</div>
              {role === 'employee' && myEmployee && <div className="sidebar-emp-id">{myEmployee.empId}</div>}
            </div>
          </div>

          <div className="nav-section-label">Navigation</div>
          <nav className="nav-links">
            {navItems.map(({ id, icon, label, badge }) => (
              <button key={id} type="button" className={`nav-link-btn ${activeSection === id ? 'active-link' : ''}`} onClick={() => setActiveSection(id)}>
                <span className="nav-icon">{icon}</span>
                {label}
                {badge != null && <span className="nav-badge">{badge}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button type="button" className="change-pw-btn" onClick={() => { setPwError(''); setPwSuccess(''); setPwForm({ current: '', newPw: '', confirm: '' }); setShowPwModal(true) }}>
            <span style={{ width: 18, height: 18 }}><Icons.Lock /></span> Change Password
          </button>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            <span style={{ width: 18, height: 18 }}><Icons.LogOut /></span> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="portal-main">
        <header className="topbar">
          <div className="topbar-left">
            <h2>
              <span style={{ width: 22, height: 22, color: 'var(--neon-purple)' }}>
                {activeSection === 'home'       && <Icons.Home />}
                {activeSection === 'employees'  && <Icons.Users />}
                {activeSection === 'attendance' && <Icons.Clipboard />}
                {activeSection === 'schedule'   && <Icons.Calendar />}
                {activeSection === 'salary'     && <Icons.DollarSign />}
              </span>
              {activeSection === 'home'       && 'Dashboard'}
              {activeSection === 'employees'  && 'Employees'}
              {activeSection === 'attendance' && 'Attendance'}
              {activeSection === 'schedule'   && 'Schedule'}
              {activeSection === 'salary'     && 'Salary Management'}
            </h2>
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="topbar-actions">
            {role === 'admin' && (
              <button type="button" className="export-excel-btn" title="Export to Excel" onClick={handleExportExcel}>
                <Icons.Download /> Export Excel
              </button>
            )}
            {/* Theme Toggle */}
            <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              <div className="theme-toggle-knob">
                <span style={{ width: 12, height: 12, color: '#fff' }}>
                  {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
                </span>
              </div>
            </button>
            <button type="button" className="icon-btn" title="AI Chatbot" onClick={() => setChatOpen(o => !o)}>
              <Icons.Bot />
            </button>
            <button type="button" className="icon-btn" title="Notifications"><Icons.Bell /></button>
          </div>
        </header>

        <div className="page-content">
          {/* API Banner */}
          {(apiError || apiSuccess) && (
            <div className={`api-status-bar ${apiError ? 'error' : ''}`}>
              <span className={`api-dot ${apiError ? 'error' : ''}`} />
              {apiError || 'Live data loaded from backend API — all employees connected to database!'}
            </div>
          )}

          {/* ── STATS ROW ── */}
          {(activeSection === 'home' || activeSection === 'attendance') && (
            <div className="stats-row">
              {[
                { icon: <Icons.Users />,      label: 'Total Employees', val: loading ? '–' : employees.length, cls: 'purple' },
                { icon: <Icons.Check />,      label: 'Present Today',   val: loading ? '–' : presentCount,     cls: 'green' },
                { icon: <Icons.X />,          label: 'Absent Today',    val: loading ? '–' : absentCount,      cls: 'pink' },
                { icon: <Icons.HalfCircle />, label: 'Half Day',        val: loading ? '–' : halfDayCount,     cls: 'orange' },
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

          {activeSection === 'salary' && role === 'admin' && (
            <div className="stats-row">
              {[
                { icon: <Icons.DollarSign />, label: 'Monthly Payroll',  val: formatCurrency(totalPayroll),         cls: 'teal' },
                { icon: <Icons.Check />,      label: 'Salaries Paid',    val: `${paidThisMonth}/${employees.length}`, cls: 'green' },
                { icon: <Icons.Clock />,      label: 'Pending Payments', val: employees.length - paidThisMonth,     cls: 'orange' },
                { icon: <Icons.Calendar />,   label: 'Salary Day',       val: isSalaryDay ? 'TODAY!' : `In ${daysUntilSalary}d`, cls: isSalaryDay ? 'green' : 'purple' },
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

          {/* ══ HOME — Admin ══ */}
          {activeSection === 'home' && role === 'admin' && (
            <div className="panel-grid">
              <div className="panel-card">
                <div className="panel-header">
                  <h3><Icons.Clipboard /> Quick Attendance</h3>
                  <span className="status-chip live">Live</span>
                </div>
                <div className="attendance-date-row">
                  <div className="date-input-wrapper">
                    <span className="date-label-icon"><Icons.Calendar /></span>
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                  </div>
                  <div className="date-badge">{selectedDate}</div>
                </div>
                <label className="field-label">Attendance Note</label>
                <div className="input-group" style={{ marginBottom: 16 }}>
                  <span className="input-icon"><Icons.Edit /></span>
                  <input value={attendanceNote} onChange={e => setAttendanceNote(e.target.value)} placeholder="Optional note..." />
                </div>
                {loading ? [1,2,3].map(i => <div key={i} className="skeleton skeleton-card" />) : (
                  <div className="attendance-list">
                    {employees.slice(0, 6).map(emp => {
                      const rec = attendanceRecords[emp.id]?.[selectedDate]
                      return (
                        <div key={emp.id} className="attendance-item">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <EmployeeAvatar emp={emp} size={36} />
                            <div>
                              <div className="att-name">{emp.name}</div>
                              <span className="emp-id-tag">{emp.empId}</span>
                              {rec ? <span className={`att-status-badge ${getStatusBadgeClass(rec.status)}`} style={{ marginTop: 4, display: 'inline-flex' }}>{getStatusIcon(rec.status)} {rec.status}{rec.note && ` · ${rec.note}`}</span>
                                   : <span className="att-status-badge unmarked" style={{ marginTop: 4, display: 'inline-flex' }}>Not Marked</span>}
                            </div>
                          </div>
                          <div className="att-actions">
                            <button type="button" className="att-btn present" onClick={() => handleAttendanceMark(emp.id, 'Present')}><Icons.Check /> Present</button>
                            <button type="button" className="att-btn absent"  onClick={() => handleAttendanceMark(emp.id, 'Absent')}><Icons.X /> Absent</button>
                            <button type="button" className="att-btn halfday" onClick={() => handleAttendanceMark(emp.id, 'Half Day')}><Icons.HalfCircle /> Half</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="panel-card">
                  <div className="panel-header"><h3><Icons.Calendar /> Schedule</h3><span className="status-chip upcoming">Upcoming</span></div>
                  <div className="schedule-timeline">
                    {schedule.map(item => (
                      <div key={item.id} className="schedule-item">
                        <div className="schedule-icon"><Icons.Pin /></div>
                        <div className="schedule-info">
                          <div className="schedule-title">{item.title}</div>
                          <div className="schedule-time"><Icons.Clock /> {item.when}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="panel-card">
                  <div className="panel-header"><h3><Icons.Plus /> Add Employee</h3><span className="status-chip admin-only">Admin Only</span></div>
                  <form className="add-emp-form" onSubmit={handleAddEmployee}>
                    {[
                      { key: 'name',       icon: <Icons.User />,      placeholder: 'Full Name' },
                      { key: 'role',       icon: <Icons.Briefcase />, placeholder: 'Role / Title' },
                      { key: 'department', icon: <Icons.Building />,  placeholder: 'Department' },
                      { key: 'salary',     icon: <Icons.DollarSign />,placeholder: 'Monthly Salary (₹) — optional' },
                    ].map(({ key, icon, placeholder }) => (
                      <div className="input-group" key={key}>
                        <span className="input-icon">{icon}</span>
                        <input value={newEmployee[key]} onChange={e => setNewEmployee(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} type={key === 'salary' ? 'number' : 'text'} min={key === 'salary' ? 1 : undefined} />
                      </div>
                    ))}
                    <button type="submit" className="primary-btn"><Icons.Plus /> Add Employee</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ══ HOME — Employee ══ */}
          {activeSection === 'home' && role === 'employee' && (
            <div className="panel-grid">
              <div className="panel-card">
                <div className="panel-header"><h3><Icons.Clipboard /> My Attendance</h3><span className="status-chip live">Tracked</span></div>
                <div className="my-attendance-summary">
                  <div className="my-att-avatar" style={{ background: getAvatarGrad(myEmployee?.avatarPreset || 1) }}>
                    <EmployeeAvatar emp={myEmployee} size={48} />
                  </div>
                  <div className="my-att-info">
                    <strong>{myEmployee?.name || userName}</strong>
                    <span><Icons.Briefcase style={{ width: 12, height: 12 }} /> {myEmployee?.role} · <Icons.Building style={{ width: 12, height: 12 }} /> {myEmployee?.department}</span>
                    <span><span className="emp-id-tag">{myEmployee?.empId}</span></span>
                  </div>
                  <div className={`today-status-pill att-status-badge ${getStatusBadgeClass(todayStatus)}`}>
                    {getStatusIcon(todayStatus)} {todayStatus}
                  </div>
                </div>
                <div className="attendance-date-row">
                  <div className="date-input-wrapper">
                    <span className="date-label-icon"><Icons.Calendar /></span>
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                  </div>
                  <div className="date-badge">Selected: {selectedDate}</div>
                </div>
                {todayNote && <div className="att-note-summary">Note for {selectedDate}: <strong>{todayNote}</strong></div>}
                <div className="att-log-list">
                  {myAttendance.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>No records yet.</div>}
                  {myAttendance.map((entry, i) => (
                    <div key={i} className="att-log-item">
                      <div>
                        <div className="att-log-date"><Icons.Calendar style={{ width: 12, height: 12 }} /> {entry.date}</div>
                        {entry.note && <div className="att-log-note">{entry.note}</div>}
                      </div>
                      <span className={`att-status-badge ${getStatusBadgeClass(entry.status)}`}>{getStatusIcon(entry.status)} {entry.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="panel-card">
                  <div className="panel-header"><h3><Icons.Calendar /> My Schedule</h3><span className="status-chip upcoming">Upcoming</span></div>
                  <div className="schedule-timeline">
                    {schedule.map(item => (
                      <div key={item.id} className="schedule-item">
                        <div className="schedule-icon"><Icons.Pin /></div>
                        <div className="schedule-info">
                          <div className="schedule-title">{item.title}</div>
                          <div className="schedule-time"><Icons.Clock /> {item.when}</div>
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
                <div className="panel-header">
                  <h3><Icons.Users /> All Employees ({filteredEmployees.length}{searchQuery ? ` of ${employees.length}` : ''})</h3>
                  <span className="status-chip live">Live</span>
                </div>
                <div className="emp-search-bar">
                  <span className="input-icon"><Icons.Search /></span>
                  <input type="text" placeholder="Search by name, role, or department..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  {searchQuery && <button type="button" className="search-clear-btn" onClick={() => setSearchQuery('')}><Icons.X /></button>}
                </div>
                {loading ? [1,2,3,4,5].map(i => <div key={i} className="skeleton skeleton-card" />) : (
                  <div className="employees-grid">
                    {filteredEmployees.map(emp => (
                      <div key={emp.id} className="employee-card">
                        <EmployeeAvatar emp={emp} size={44} />
                        <div className="emp-info">
                          <div className="emp-name">{emp.name}</div>
                          <div className="emp-meta">{emp.role} · {emp.department}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <span className="emp-id-tag">{emp.empId}</span>
                            <span className="emp-salary">{formatCurrency(emp.salary)}/mo</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                          <span className={`att-status-badge ${emp.status === 'Active' ? 'present' : emp.status === 'Remote' ? 'remote' : 'unmarked'}`}>
                            {emp.status}
                          </span>
                          {role === 'admin' && (
                            <div className="emp-card-actions">
                              <select className="status-select-mini" value={emp.status} onChange={e => handleStatusChange(emp.empId, e.target.value)}>
                                <option value="Active">Active</option>
                                <option value="Remote">Remote</option>
                                <option value="On Leave">On Leave</option>
                              </select>
                              <button type="button" className="slip-mini-btn" title="Edit Avatar" onClick={() => openAvatarModal(emp)}><Icons.Camera /></button>
                              <button type="button" className="slip-mini-btn" title="View Pay Slip" onClick={() => { setPaySlipEmployee(emp); setShowPaySlipModal(true) }}><Icons.FileText /></button>
                              <button type="button" className="delete-mini-btn" title="Delete Employee" onClick={() => handleDeleteEmployee(emp.empId)}><Icons.Trash /></button>
                            </div>
                          )}
                          {role === 'employee' && emp.id === myEmployee?.id && (
                            <button type="button" className="slip-mini-btn" title="Edit Avatar" onClick={() => openAvatarModal(emp)}><Icons.Camera /></button>
                          )}
                        </div>
                      </div>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0', gridColumn: '1/-1' }}>
                        No employees match <strong>"{searchQuery}"</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {role === 'admin' && (
                <div className="panel-card">
                  <div className="panel-header"><h3><Icons.Plus /> Add Employee</h3><span className="status-chip admin-only">Admin Only</span></div>
                  <form className="add-emp-form" onSubmit={handleAddEmployee}>
                    {[
                      { key: 'name',       icon: <Icons.User />,      placeholder: 'Full Name' },
                      { key: 'role',       icon: <Icons.Briefcase />, placeholder: 'Role / Title' },
                      { key: 'department', icon: <Icons.Building />,  placeholder: 'Department' },
                      { key: 'salary',     icon: <Icons.DollarSign />,placeholder: 'Monthly Salary (₹) — optional' },
                    ].map(({ key, icon, placeholder }) => (
                      <div className="input-group" key={key}>
                        <span className="input-icon">{icon}</span>
                        <input value={newEmployee[key]} onChange={e => setNewEmployee(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} type={key === 'salary' ? 'number' : 'text'} />
                      </div>
                    ))}
                    <button type="submit" className="primary-btn"><Icons.Plus /> Add Employee</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ══ ATTENDANCE ══ */}
          {activeSection === 'attendance' && (
            <div className="panel-card">
              <div className="panel-header">
                <h3><Icons.Clipboard /> {role === 'admin' ? 'Team Attendance Management' : 'My Attendance Record'}</h3>
                <span className="status-chip live">Live</span>
              </div>
              <div className="attendance-date-row">
                <div className="date-input-wrapper">
                  <span className="date-label-icon"><Icons.Calendar /></span>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                </div>
                <div className="date-badge">Viewing: {selectedDate}</div>
              </div>
              {role === 'admin' && (
                <>
                  <div className="attendance-note-field">
                    <label className="field-label">Attendance Note</label>
                    <div className="input-group">
                      <span className="input-icon"><Icons.Edit /></span>
                      <input value={attendanceNote} onChange={e => setAttendanceNote(e.target.value)} placeholder="Optional note (e.g. approved leave, half day, WFH...)" />
                    </div>
                  </div>
                  <div className="attendance-list">
                    {loading ? [1,2,3,4].map(i => <div key={i} className="skeleton skeleton-card" />) :
                      employees.map(emp => {
                        const rec = attendanceRecords[emp.id]?.[selectedDate]
                        return (
                          <div key={emp.id} className="attendance-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <EmployeeAvatar emp={emp} size={38} />
                              <div>
                                <div className="att-name">{emp.name}</div>
                                <span className="emp-id-tag">{emp.empId}</span>
                                <div className="att-dept">{emp.role} · {emp.department}</div>
                                {rec ? <span className={`att-status-badge ${getStatusBadgeClass(rec.status)}`} style={{ marginTop: 4, display: 'inline-flex' }}>{getStatusIcon(rec.status)} {rec.status}{rec.note && ` · ${rec.note}`}</span>
                                     : <span className="att-status-badge unmarked" style={{ marginTop: 4, display: 'inline-flex' }}>Not Marked</span>}
                              </div>
                            </div>
                            <div className="att-actions">
                              <button type="button" className="att-btn present" onClick={() => handleAttendanceMark(emp.id, 'Present')}><Icons.Check /> Present</button>
                              <button type="button" className="att-btn absent"  onClick={() => handleAttendanceMark(emp.id, 'Absent')}><Icons.X /> Absent</button>
                              <button type="button" className="att-btn halfday" onClick={() => handleAttendanceMark(emp.id, 'Half Day')}><Icons.HalfCircle /> Half Day</button>
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
                    <EmployeeAvatar emp={myEmployee} size={48} />
                    <div className="my-att-info">
                      <strong>{myEmployee?.name || userName}</strong>
                      <span>{myEmployee?.role} · {myEmployee?.department}</span>
                      <span><span className="emp-id-tag">{myEmployee?.empId}</span></span>
                    </div>
                    <div className={`today-status-pill att-status-badge ${getStatusBadgeClass(todayStatus)}`}>{getStatusIcon(todayStatus)} {todayStatus}</div>
                  </div>
                  <div className="att-log-list">
                    {myAttendance.map((entry, i) => (
                      <div key={i} className="att-log-item">
                        <div>
                          <div className="att-log-date"><Icons.Calendar style={{ width: 12, height: 12 }} /> {entry.date}</div>
                          {entry.note && <div className="att-log-note">{entry.note}</div>}
                        </div>
                        <span className={`att-status-badge ${getStatusBadgeClass(entry.status)}`}>{getStatusIcon(entry.status)} {entry.status}</span>
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
                <div className="panel-header"><h3><Icons.Calendar /> All Events ({schedule.length})</h3><span className="status-chip upcoming">Team Plan</span></div>
                <div className="schedule-timeline">
                  {schedule.map(item => (
                    <div key={item.id} className="schedule-item">
                      <div className="schedule-icon"><Icons.Pin /></div>
                      <div className="schedule-info">
                        <div className="schedule-title">{item.title}</div>
                        <div className="schedule-time"><Icons.Clock /> {item.when}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {role === 'admin' && (
                <div className="panel-card">
                  <div className="panel-header"><h3><Icons.Plus /> Add Event</h3><span className="status-chip admin-only">Admin Only</span></div>
                  <form className="panel-form" onSubmit={handleScheduleAdd}>
                    <div className="input-group"><span className="input-icon"><Icons.Clipboard /></span><input placeholder="Event title" value={newScheduleItem.title} onChange={e => setNewScheduleItem(p => ({ ...p, title: e.target.value }))} /></div>
                    <div className="input-group"><span className="input-icon"><Icons.Clock /></span><input placeholder="When? (e.g. Tue 2:00 PM)" value={newScheduleItem.when} onChange={e => setNewScheduleItem(p => ({ ...p, when: e.target.value }))} /></div>
                    <button type="submit" className="primary-btn"><Icons.Pin /> Add Event</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ══ SALARY (Admin only) ══ */}
          {activeSection === 'salary' && role === 'admin' && (
            <>
              <div className={`salary-day-banner ${isSalaryDay ? 'is-today' : 'upcoming'}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="sal-banner-icon">{isSalaryDay ? <Icons.Award /> : <Icons.DollarSign />}</div>
                  <div>
                    <div className="sal-banner-title">{isSalaryDay ? 'Today is Salary Day!' : `Next Salary Day — ${MONTH_NAMES[daysUntilSalary <= 3 ? todayMonth - 1 : todayMonth % 12]} 3rd`}</div>
                    <div className="sal-banner-sub">{isSalaryDay ? `Processing ${formatCurrency(totalPayroll)} for ${employees.length} employees` : `${paidThisMonth}/${employees.length} salaries disbursed · Payroll: ${formatCurrency(totalPayroll)}`}</div>
                  </div>
                </div>
                <div className="sal-banner-right">
                  {isSalaryDay ? <div className="sal-countdown-num"><Icons.Award /></div> : <>
                    <div className="sal-countdown-num">{daysUntilSalary}</div>
                    <div className="sal-countdown-label">days to go</div>
                  </>}
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <h3><Icons.DollarSign /> Salary Records — {MONTH_NAMES[todayMonth - 1]} {todayYear}</h3>
                  <span className="status-chip salary">{paidThisMonth}/{employees.length} Paid</span>
                </div>
                <div className="salary-table-wrap">
                  <table className="salary-table">
                    <thead>
                      <tr>
                        <th>EMP ID</th><th>Name</th><th>Department</th><th>Role</th><th>Monthly Salary</th><th>Status</th><th>Paid On</th><th>Actions</th>
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
                                <EmployeeAvatar emp={emp} size={30} />
                                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{emp.name}</span>
                              </div>
                            </td>
                            <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{emp.department}</td>
                            <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{emp.role}</td>
                            <td>
                              {isEditing
                                ? <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                    <input className="salary-edit-input" type="number" value={editSalaryVal} onChange={e => setEditSalaryVal(e.target.value)} />
                                    <button type="button" className="save-sal-btn" onClick={() => handleSalaryUpdate(emp.empId, editSalaryVal)}><Icons.Save /></button>
                                    <button type="button" className="save-sal-btn" style={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5' }} onClick={() => setEditSalaryId(null)}><Icons.X /></button>
                                  </div>
                                : <span className="salary-amount-cell" onClick={() => { setEditSalaryId(emp.empId); setEditSalaryVal(emp.salary) }}>{formatCurrency(emp.salary)} <Icons.Edit /></span>
                              }
                            </td>
                            <td>
                              <span className={`sal-badge ${rec?.status?.toLowerCase() || 'pending'}`}>
                                {rec?.status === 'Paid' ? <Icons.Check /> : <Icons.Clock />} {rec?.status || 'Pending'}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{rec?.paidOn || '—'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                {rec?.status !== 'Paid' && (
                                  <button type="button" className="mark-paid-btn" onClick={() => handleMarkPaid(emp.empId)}>
                                    <Icons.CreditCard /> Mark Paid
                                  </button>
                                )}
                                {rec?.status === 'Paid' && <span style={{ color: '#34d399', fontSize: '0.78rem', fontWeight: 600 }}>Paid</span>}
                                <button type="button" className="view-slip-btn" onClick={() => { setPaySlipEmployee(emp); setShowPaySlipModal(true) }}>
                                  <Icons.FileText /> Slip
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ══ CHATBOT ══ */}
      <div className="chatbot-fab">
        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <div className="chat-bot-avatar"><Icons.Bot /></div>
              <div className="chat-header-info">
                <strong>EmpBot AI</strong>
                <span><span className="chat-online-dot" /> Online · HR Assistant</span>
              </div>
              <button type="button" className="chat-close" onClick={() => setChatOpen(false)}><Icons.X /></button>
            </div>
            <div className="chat-log" ref={chatLogRef}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-message-wrapper ${msg.sender}`}>
                  <div className={`chat-bubble ${msg.sender}`}>{msg.sender === 'bot' ? renderBotText(msg.text) : msg.text}</div>
                  <div className="chat-time">{msg.time}</div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-message-wrapper bot">
                  <div className="typing-indicator"><div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" /></div>
                </div>
              )}
            </div>
            <div className="chat-quick-prompts">
              {quickPrompts.map(p => <button key={p} type="button" className="quick-prompt" onClick={() => sendChatMessage(p)}>{p}</button>)}
            </div>
            <form className="chat-input-area" onSubmit={e => { e.preventDefault(); sendChatMessage() }}>
              <input className="chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask about salary, attendance..." />
              <button type="submit" className="chat-send-btn" disabled={isTyping}><Icons.Send /></button>
            </form>
          </div>
        )}
        <button type="button" className="chat-fab-btn" onClick={() => setChatOpen(o => !o)} title="AI HR Chatbot">
          {chatOpen ? <Icons.X /> : <Icons.Bot />}
        </button>
      </div>

      {/* ══ PAY SLIP MODAL ══ */}
      {showPaySlipModal && paySlipEmployee && (
        <div className="payslip-modal-overlay" onClick={() => setShowPaySlipModal(false)}>
          <div className="payslip-modal-content" onClick={e => e.stopPropagation()}>
            <div className="payslip-modal-header">
              <h3><Icons.FileText /> Pay Slip — {paySlipEmployee.name}</h3>
              <button type="button" className="chat-close" onClick={() => setShowPaySlipModal(false)} style={{ color: 'var(--text)' }}><Icons.X /></button>
            </div>
            <div className="payslip-modal-body">
              {renderPaySlip(paySlipEmployee, getSalaryRecord(salaryRecords, paySlipEmployee.empId, todayMonth, todayYear))}
            </div>
            <div className="payslip-modal-actions">
              <button type="button" className="download-btn" onClick={handleDownloadPaySlip}>
                <span style={{ width: 16, height: 16, flexShrink: 0 }}><Icons.Download /></span> Download PDF
              </button>
              <button type="button" className="logout-btn" style={{ minWidth: 100, width: 'auto' }} onClick={() => setShowPaySlipModal(false)}>
                <span style={{ width: 16, height: 16, flexShrink: 0 }}><Icons.X /></span> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CHANGE PASSWORD MODAL ══ */}
      {showPwModal && (
        <div className="pw-modal-overlay" onClick={() => setShowPwModal(false)}>
          <div className="pw-modal" onClick={e => e.stopPropagation()}>
            <div className="pw-modal-header">
              <h3><Icons.Lock /> Change Password</h3>
              <button type="button" className="chat-close" onClick={() => setShowPwModal(false)} style={{ color: 'var(--text)', background: 'var(--surface)' }}><Icons.X /></button>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="pw-modal-body">
                {pwError   && <div className="pw-error"><Icons.X /> {pwError}</div>}
                {pwSuccess && <div className="pw-success"><Icons.Check /> {pwSuccess}</div>}
                {[
                  { field: 'current', label: 'Current Password',  placeholder: 'Enter current password' },
                  { field: 'newPw',   label: 'New Password',      placeholder: 'Enter new password (min 6 chars)' },
                  { field: 'confirm', label: 'Confirm Password',  placeholder: 'Re-enter new password' },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <label className="field-label">{label}</label>
                    <div className="pw-input-group">
                      <input
                        type={pwShowStates[field] ? 'text' : 'password'}
                        value={pwForm[field]}
                        onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                        placeholder={placeholder}
                        required
                      />
                      <button type="button" className="pw-show-btn" onClick={() => setPwShowStates(p => ({ ...p, [field]: !p[field] }))}>
                        {pwShowStates[field] ? <Icons.EyeOff /> : <Icons.Eye />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pw-modal-footer">
                <button type="button" className="logout-btn" style={{ width: 'auto', minWidth: 90 }} onClick={() => setShowPwModal(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={pwLoading}>
                  {pwLoading ? 'Saving...' : <><Icons.Save /> Save Password</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ AVATAR MODAL ══ */}
      {showAvatarModal && avatarEditEmp && (
        <div className="avatar-modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="avatar-modal" onClick={e => e.stopPropagation()}>
            <div className="avatar-modal-header">
              <h3><Icons.Camera /> Edit Avatar — {avatarEditEmp.name}</h3>
              <button type="button" className="chat-close" onClick={() => setShowAvatarModal(false)} style={{ color: 'var(--text)', background: 'var(--surface)' }}><Icons.X /></button>
            </div>
            <div className="avatar-modal-body">
              {/* Current Preview */}
              <div className="avatar-current-preview">
                <div className="avatar-current-img">
                  <EmployeeAvatar emp={croppedImage ? { ...avatarEditEmp, avatar: croppedImage, avatarPreset: 0 } : { ...avatarEditEmp, avatarPreset: selectedPreset, avatar: null }} size={64} />
                </div>
                <div className="avatar-current-info">
                  <strong>Current Selection</strong>
                  <span>{croppedImage ? 'Custom Photo (Cropped)' : `Preset Avatar ${selectedPreset}`}</span>
                </div>
              </div>

              {/* Crop Mode */}
              {cropMode && uploadedImage ? (
                <div>
                  <div className="avatar-section-label">Crop Your Photo</div>
                  <div className="crop-container">
                    <img ref={cropImgRef} src={uploadedImage} alt="Upload" style={{ display: 'none' }} onLoad={drawCrop} />
                    <canvas
                      ref={cropCanvasRef}
                      width={400} height={280}
                      className="crop-canvas"
                      onMouseDown={handleCropMouseDown}
                      onMouseMove={handleCropMouseMove}
                      onMouseUp={handleCropMouseUp}
                      onMouseLeave={handleCropMouseUp}
                      style={{ width: '100%', height: 'auto', cursor: isDragging ? 'grabbing' : 'grab' }}
                    />
                  </div>
                  <p className="crop-hint">Drag the circle to position your crop area</p>
                  <div className="crop-controls">
                    <button type="button" className="primary-btn" onClick={applyCrop}><Icons.Crop /> Apply Crop</button>
                    <button type="button" className="ghost-btn" onClick={() => { setCropMode(false); setUploadedImage(null) }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Presets */}
                  <div>
                    <div className="avatar-section-label">Choose Preset Avatar</div>
                    <div className="avatar-presets-grid">
                      {AvatarPresets.map(preset => (
                        <div
                          key={preset.id}
                          className={`avatar-preset-option ${selectedPreset === preset.id && !croppedImage ? 'selected' : ''}`}
                          style={{ background: preset.grad }}
                          onClick={() => { setSelectedPreset(preset.id); setCroppedImage(null) }}
                          title={`Preset ${preset.id}`}
                        >
                          {preset.svg}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload */}
                  <div>
                    <div className="avatar-section-label">Or Upload a Photo</div>
                    <div className="avatar-upload-zone" onClick={() => fileInputRef.current?.click()}>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} />
                      <div className="avatar-upload-zone-icon"><Icons.Upload /></div>
                      <div className="avatar-upload-text">{croppedImage ? 'Photo uploaded & cropped!' : 'Click to upload a photo'}</div>
                      <div className="avatar-upload-sub">JPG, PNG, GIF up to 5MB</div>
                    </div>
                    {croppedImage && (
                      <button type="button" className="ghost-btn" style={{ marginTop: 8 }} onClick={() => setCroppedImage(null)}>
                        <Icons.X /> Remove Photo, Use Preset
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="avatar-modal-footer">
              <button type="button" className="logout-btn" style={{ width: 'auto' }} onClick={() => setShowAvatarModal(false)}>Cancel</button>
              <button type="button" className="primary-btn" onClick={handleSaveAvatar}><Icons.Save /> Save Avatar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
