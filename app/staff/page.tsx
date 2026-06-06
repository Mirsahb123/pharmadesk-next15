"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, Toaster } from 'sonner'
import { Auth } from '@/lib/auth'
import { db, ref, get, set, update, remove } from '@/lib/firebase'
import {
  Trash2, Edit, DollarSign, Ban, CheckCircle, Plus, FileText, Calendar,
  TrendingUp, TrendingDown, Users, UserCheck, UserX, IndianRupee,
  Shield, Award, ArrowLeft, Sparkles, Activity, Lock, Search
} from 'lucide-react'

type Staff = {
  id: string
  name: string
  phone: string
  cnic: string
  address: string
  designation: string
  salary: number
  password: string
  status: 'active' | 'blocked'
  joinDate: string
  permissions: ('billing' | 'inventory' | 'customers' | 'reports')[]
  advances: { id: string, amount: number, date: string, reason: string }[]
  attendance: { date: string, status: 'present' | 'absent' | 'half-day' | 'leave', paid: boolean }[]
  bonuses: { id: string, amount: number, date: string, reason: string }[]
  deductions: { id: string, amount: number, date: string, reason: string }[]
  payrollHistory: { month: string, paidAmount: number, paidDate: string }[]
}

export default function StaffPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [staff, setStaff] = useState<Staff[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [showAdvance, setShowAdvance] = useState<Staff | null>(null)
  const [showBonus, setShowBonus] = useState<Staff | null>(null)
  const [showDeduction, setShowDeduction] = useState<Staff | null>(null)
  const [showSalarySlip, setShowSalarySlip] = useState<Staff | null>(null)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    cnic: '',
    address: '',
    designation: '',
    salary: '',
    password: '',
    permissions: ['billing'] as string[]
  })

  useEffect(() => {
    const user = Auth.getCurrentUser()
    if (!user) return router.push('/login')
    if (user.role!== 'shop' && user.role!== 'superadmin') {
      toast.error('Access Denied! Sirf Owner access kar sakta hai')
      return router.push('/dashboard')
    }
    setCurrentUser(user)
    loadStaff()
  }, [router])

  const loadStaff = async () => {
    try {
      setLoading(true)
      const staffRef = ref(db, 'staff')
      const snapshot = await get(staffRef)

      if (snapshot.exists()) {
        const staffData = snapshot.val()
        const allStaff = Object.keys(staffData).map(key => ({
          id: key,
       ...staffData[key]
        }))
        setStaff(allStaff)
      } else {
        setStaff([])
      }
    } catch (error) {
      console.error('Load error:', error)
      toast.error('Failed to load staff')
      setStaff([])
    } finally {
      setLoading(false)
    }
  }

  const formatCNIC = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 13)
    if (numbers.length <= 5) return numbers
    if (numbers.length <= 12) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(12)}`
  }

  const resetForm = () => {
    setForm({ name: '', phone: '', cnic: '', address: '', designation: '', salary: '', password: '', permissions: ['billing'] })
    setEditingStaff(null)
  }

  const togglePermission = (perm: string) => {
    setForm(prev => ({
   ...prev,
      permissions: prev.permissions.includes(perm)
     ? prev.permissions.filter(p => p!== perm)
        : [...prev.permissions, perm]
    }))
  }

  const addOrUpdateStaff = async () => {
    if (!form.name ||!form.phone ||!form.cnic ||!form.designation ||!form.salary ||!form.password) {
      return toast.error('Name, Phone, CNIC, Designation, Salary, Password zaroori hain')
    }
    if (!editingStaff && staff.find(s => s.phone === form.phone)) {
      return toast.error('Ye phone number already exist karta hai')
    }

    const salary = parseFloat(form.salary)
    if (salary <= 0) return toast.error('Salary 0 se zyada honi chahiye')

    try {
      if (editingStaff) {
        const staffRef = ref(db, `staff/${editingStaff.id}`)
        await update(staffRef, {...form, salary})
        toast.success('Staff update ho gaya')
      } else {
        const newId = Date.now().toString()
        const newStaff: Staff = {
          id: newId,
       ...form,
          salary,
          status: 'active',
          joinDate: new Date().toISOString(),
          advances: [],
          attendance: [],
          bonuses: [],
          deductions: [],
          payrollHistory: []
        }
        const staffRef = ref(db, `staff/${newId}`)
        await set(staffRef, newStaff)
        toast.success('Staff add ho gaya! Phone + Password se login karega')
      }

      await loadStaff()
      setShowAdd(false)
      resetForm()
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Save failed')
    }
  }

  const markAttendance = async (staffId: string, status: 'present' | 'absent' | 'half-day' | 'leave') => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const paid = status === 'present' || status === 'half-day'

      const staffMember = staff.find(s => s.id === staffId)
      if (!staffMember) return

      const existingIndex = staffMember.attendance.findIndex(a => a.date === today)
      let updatedAttendance = [...staffMember.attendance]

      if (existingIndex >= 0) {
        updatedAttendance[existingIndex] = { date: today, status, paid }
      } else {
        updatedAttendance.push({ date: today, status, paid })
      }

      const staffRef = ref(db, `staff/${staffId}`)
      await update(staffRef, { attendance: updatedAttendance })

      await loadStaff()
      toast.success(`Attendance: ${status}`)
    } catch (error) {
      console.error('Attendance error:', error)
      toast.error('Failed to mark attendance')
    }
  }

  const addTransaction = async (type: 'advance' | 'bonus' | 'deduction') => {
    const staffMember = type === 'advance'? showAdvance : type === 'bonus'? showBonus : showDeduction
    if (!staffMember ||!amount) return toast.error('Amount likho')
    const amt = parseFloat(amount)
    if (amt <= 0) return toast.error('Amount 0 se zyada honi chahiye')

    try {
      const transaction = { id: Date.now().toString(), amount: amt, date: new Date().toISOString(), reason: reason || type }

      const updatedList = type === 'advance'
     ? [...staffMember.advances, transaction]
        : type === 'bonus'
     ? [...staffMember.bonuses, transaction]
        : [...staffMember.deductions, transaction]

      const staffRef = ref(db, `staff/${staffMember.id}`)
      await update(staffRef, { [type === 'advance'? 'advances' : type === 'bonus'? 'bonuses' : 'deductions']: updatedList })

      await loadStaff()
      toast.success(`${type} added: Rs. ${amt}`)
      setShowAdvance(null)
      setShowBonus(null)
      setShowDeduction(null)
      setAmount('')
      setReason('')
    } catch (error) {
      console.error('Transaction error:', error)
      toast.error('Failed to add transaction')
    }
  }

  const calculateMonthSalary = (s: Staff, month?: string) => {
    const targetMonth = month || selectedMonth
    const monthAttendances = s.attendance.filter(a => a.date.startsWith(targetMonth))

    const presentDays = monthAttendances.filter(a => a.status === 'present').length
    const halfDays = monthAttendances.filter(a => a.status === 'half-day').length
    const absentDays = monthAttendances.filter(a => a.status === 'absent').length
    const leaveDays = monthAttendances.filter(a => a.status === 'leave').length

    const perDaySalary = s.salary / 30
    const earnedSalary = (presentDays * perDaySalary) + (halfDays * perDaySalary * 0.5)

    const monthAdvances = s.advances.filter(a => a.date.startsWith(targetMonth)).reduce((sum, a) => sum + a.amount, 0)
    const monthBonuses = s.bonuses.filter(b => b.date.startsWith(targetMonth)).reduce((sum, b) => sum + b.amount, 0)
    const monthDeductions = s.deductions.filter(d => d.date.startsWith(targetMonth)).reduce((sum, d) => sum + d.amount, 0)

    return {
      basicSalary: s.salary,
      earnedSalary,
      presentDays,
      halfDays,
      absentDays,
      leaveDays,
      advances: monthAdvances,
      bonuses: monthBonuses,
      deductions: monthDeductions,
      netPayable: earnedSalary + monthBonuses - monthAdvances - monthDeductions
    }
  }

  const markSalaryPaid = async (staffId: string) => {
    try {
      const month = selectedMonth
      const staffMember = staff.find(s => s.id === staffId)
      if (!staffMember) return

      const calc = calculateMonthSalary(staffMember, month)
      const existingPayroll = staffMember.payrollHistory.find(p => p.month === month)
      let updatedPayroll = [...staffMember.payrollHistory]

      if (existingPayroll) {
        updatedPayroll = updatedPayroll.map(p =>
          p.month === month? {...p, paidAmount: calc.netPayable, paidDate: new Date().toISOString() } : p
        )
      } else {
        updatedPayroll.push({ month, paidAmount: calc.netPayable, paidDate: new Date().toISOString() })
      }

      const staffRef = ref(db, `staff/${staffId}`)
      await update(staffRef, { payrollHistory: updatedPayroll })

      await loadStaff()
      toast.success(`Salary marked as paid for ${month}`)
    } catch (error) {
      console.error('Salary pay error:', error)
      toast.error('Failed to mark salary paid')
    }
  }

  const deleteStaff = async (id: string) => {
    if (!confirm('Staff delete karna hai?')) return
    try {
      const staffRef = ref(db, `staff/${id}`)
      await remove(staffRef)
      await loadStaff()
      toast.success('Staff delete ho gaya')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Delete failed')
    }
  }

  const toggleBlockStaff = async (id: string) => {
    try {
      const staffMember = staff.find(s => s.id === id)
      if (!staffMember) return

      const newStatus = staffMember.status === 'active'? 'blocked' : 'active'
      const staffRef = ref(db, `staff/${id}`)
      await update(staffRef, { status: newStatus })

      await loadStaff()
      toast.success('Status change ho gaya')
    } catch (error) {
      console.error('Toggle error:', error)
      toast.error('Status change failed')
    }
  }

  const editStaff = (s: Staff) => {
    setEditingStaff(s)
    setForm({
      name: s.name,
      phone: s.phone,
      cnic: s.cnic,
      address: s.address,
      designation: s.designation,
      salary: s.salary.toString(),
      password: s.password,
      permissions: s.permissions
    })
    setShowAdd(true)
  }
  if (!currentUser) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  const today = new Date().toISOString().split('T')[0]
  const staffArray = Array.isArray(staff)? staff : []
  const filteredStaff = staffArray.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm) ||
    s.cnic.includes(searchTerm) ||
    s.designation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalSalary = staffArray.reduce((sum, s) => sum + s.salary, 0)
  const totalAdvance = staffArray.reduce((sum, s) => sum + s.advances.reduce((a, adv) => a + adv.amount, 0), 0)

  const stats = [
    {
      title: 'Total Staff',
      value: staffArray.length,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/50'
    },
    {
      title: 'Present Today',
      value: staffArray.filter(s => s.attendance.find(a => a.date === today)?.status === 'present').length,
      icon: UserCheck,
      gradient: 'from-green-500 to-emerald-600',
      glow: 'shadow-green-500/50'
    },
    {
      title: 'Absent Today',
      value: staffArray.filter(s => s.attendance.find(a => a.date === today)?.status === 'absent').length,
      icon: UserX,
      gradient: 'from-red-500 to-pink-600',
      glow: 'shadow-red-500/50'
    },
    {
      title: 'Monthly Salary',
      value: `Rs. ${totalSalary.toFixed(0)}`,
      icon: IndianRupee,
      gradient: 'from-purple-500 to-indigo-600',
      glow: 'shadow-purple-500/50'
    },
    {
      title: 'Total Advance',
      value: `Rs. ${totalAdvance.toFixed(0)}`,
      icon: TrendingDown,
      gradient: 'from-orange-500 to-red-600',
      glow: 'shadow-orange-500/50'
    },
    {
      title: 'Active Month',
      value: new Date(selectedMonth + '-01').toLocaleDateString('en-PK', { month: 'short', year: 'numeric' }),
      icon: Calendar,
      gradient: 'from-cyan-500 to-teal-600',
      glow: 'shadow-cyan-500/50'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold text-lg">Loading staff data...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <Toaster position="top-center" richColors />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/50 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
                Staff Management
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                {currentUser.name} - Complete HR Control Panel
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { resetForm(); setShowAdd(true) }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Staff
              </motion.button>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Dashboard
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${stat.gradient} p-5 rounded-3xl shadow-2xl ${stat.glow} text-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
              <div className="relative z-10">
                <stat.icon className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-xs opacity-90 mb-1">{stat.title}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                Search Staff
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Name, Phone, CNIC, Designation..."
                className="border-2 border-gray-200 p-3 rounded-2xl w-full focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Select Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="border-2 border-gray-200 p-3 rounded-2xl w-full focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur"
              />
            </div>
          </div>
        </motion.div>

        {/* Staff Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="text-left p-4 font-black text-gray-700">Staff</th>
                  <th className="text-left p-4 font-black text-gray-700">CNIC</th>
                  <th className="text-left p-4 font-black text-gray-700">Role</th>
                  <th className="text-left p-4 font-black text-gray-700">Access</th>
                  <th className="text-left p-4 font-black text-gray-700">Salary</th>
                  <th className="text-left p-4 font-black text-gray-700">Net Pay</th>
                  <th className="text-left p-4 font-black text-gray-700">Today</th>
                  <th className="text-left p-4 font-black text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-16 h-16 text-gray-300" />
                        <p className="text-gray-500 font-semibold text-lg">Koi staff nahi mila</p>
                        <p className="text-gray-400 text-sm">Search clear karo ya Add Staff se naya staff add karo</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((s, idx) => {
                    const calc = calculateMonthSalary(s)
                    const todayAtt = s.attendance.find(a => a.date === today)?.status
                    const isPaid = s.payrollHistory.find(p => p.month === selectedMonth)
                    return (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + idx * 0.05 }}
                        className={`border-t hover:bg-blue-50/50 transition-all ${s.status === 'blocked'? 'opacity-50' : ''}`}
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-gray-800">{s.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              {s.phone}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-mono">{s.cnic}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-black">
                            {s.designation}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {s.permissions.map(p => (
                              <span key={p} className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-black text-gray-800 flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              {s.salary}
                            </p>
                            <p className="text-xs text-gray-500">Earned: {calc.earnedSalary.toFixed(0)}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-black text-green-600 flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              {calc.netPayable.toFixed(0)}
                            </p>
                            {isPaid && <p className="text-xs text-blue-600 font-semibold">✓ Paid</p>}
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={todayAtt || ''}
                            onChange={e => markAttendance(s.id, e.target.value as any)}
                            className="text-xs border-2 border-gray-200 rounded-xl p-2 font-semibold focus:border-blue-500 outline-none bg-white/50"
                            disabled={s.status === 'blocked'}
                          >
                            <option value="">Mark</option>
                            <option value="present">✅ Present</option>
                            <option value="absent">❌ Absent</option>
                            <option value="half-day">🕐 Half Day</option>
                            <option value="leave">🏖️ Leave</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1 flex-wrap">
                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => setShowSalarySlip(s)} title="Salary Slip" className="text-purple-600 p-2 hover:bg-purple-100 rounded-lg transition-all"><FileText className="w-4 h-4" /></motion.button>
                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => markSalaryPaid(s.id)} title="Mark Paid" className="text-green-600 p-2 hover:bg-green-100 rounded-lg transition-all"><CheckCircle className="w-4 h-4" /></motion.button>
                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => setShowAdvance(s)} title="Advance" className="text-orange-600 p-2 hover:bg-orange-100 rounded-lg transition-all"><TrendingDown className="w-4 h-4" /></motion.button>
                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => setShowBonus(s)} title="Bonus" className="text-green-600 p-2 hover:bg-green-100 rounded-lg transition-all"><TrendingUp className="w-4 h-4" /></motion.button>
                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => setShowDeduction(s)} title="Deduction" className="text-red-600 p-2 hover:bg-red-100 rounded-lg transition-all"><DollarSign className="w-4 h-4" /></motion.button>
                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => editStaff(s)} title="Edit" className="text-blue-600 p-2 hover:bg-blue-100 rounded-lg transition-all"><Edit className="w-4 h-4" /></motion.button>
                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => toggleBlockStaff(s.id)} title={s.status === 'active'? 'Block' : 'Unblock'} className={s.status === 'active'? 'text-orange-600 p-2 hover:bg-orange-100 rounded-lg transition-all' : 'text-green-600 p-2 hover:bg-green-100 rounded-lg transition-all'}>
                              {s.status === 'active'? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => deleteStaff(s.id)} title="Delete" className="text-red-600 p-2 hover:bg-red-100 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
              onClick={() => { setShowAdd(false); resetForm() }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-2xl w-full my-8"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-3xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {editingStaff? 'Edit Staff' : 'Add New Staff'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full Name *" className="border-2 p-3 rounded-2xl w-full focus:border-blue-500 outline-none" />
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone * (Login)" className="border-2 p-3 rounded-2xl w-full focus:border-blue-500 outline-none" />
                  <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password * (Staff Login)" className="border-2 p-3 rounded-2xl w-full focus:border-blue-500 outline-none" />
                  <input value={form.cnic} onChange={e => setForm({...form, cnic: formatCNIC(e.target.value)})} placeholder="CNIC * 35202-1234567-1" maxLength={15} className="border-2 p-3 rounded-2xl w-full focus:border-blue-500 outline-none" />
                  <input value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} placeholder="Designation * (Cashier/Sweeper)" className="border-2 p-3 rounded-2xl w-full focus:border-blue-500 outline-none" />
                  <input type="number" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} placeholder="Monthly Salary Rs. *" className="border-2 p-3 rounded-2xl w-full focus:border-blue-500 outline-none" />
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Address" className="border-2 p-3 rounded-2xl w-full col-span-1 md:col-span-2 focus:border-blue-500 outline-none" />
                </div>
                <div className="mt-6">
                  <label className="text-sm font-black text-gray-700 mb-3 block flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Permissions - Staff kya kar sakta hai?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['billing', 'inventory', 'customers', 'reports'].map(perm => (
                      <label key={perm} className="flex items-center gap-2 cursor-pointer p-3 border-2 border-gray-200 rounded-2xl hover:bg-blue-50 hover:border-blue-300 transition-all">
                        <input type="checkbox" checked={form.permissions.includes(perm)} onChange={() => togglePermission(perm)} className="w-5 h-5 accent-blue-600" />
                        <span className="capitalize text-sm font-semibold">{perm === 'billing'? 'Billing - Bill banana' : perm === 'inventory'? 'Inventory - Stock manage' : perm === 'customers'? 'Customers - Customer data' : 'Reports - Sales dekhna'}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addOrUpdateStaff} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-black hover:shadow-xl transition-all">
                    {editingStaff? 'Update Staff' : 'Save Staff'}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setShowAdd(false); resetForm() }} className="flex-1 bg-gray-500 text-white py-4 rounded-2xl font-black hover:shadow-xl transition-all">Cancel</motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction Modals */}
        <AnimatePresence>
          {(showAdvance || showBonus || showDeduction) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => { setShowAdvance(null); setShowBonus(null); setShowDeduction(null) }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-3xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {showAdvance? 'Give Advance' : showBonus? 'Give Bonus' : 'Add Deduction'}
                </h3>
                <p className="text-gray-600 mb-4 font-semibold">{(showAdvance || showBonus || showDeduction)?.name}</p>
                <div className="space-y-4">
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount *" className="border-2 p-4 rounded-2xl w-full focus:border-blue-500 outline-none font-bold text-lg" />
                  <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (Optional)" className="border-2 p-4 rounded-2xl w-full focus:border-blue-500 outline-none" />
                </div>
                <div className="flex gap-3 mt-8">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => addTransaction(showAdvance? 'advance' : showBonus? 'bonus' : 'deduction')} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-black hover:shadow-xl transition-all">
                    Save
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setShowAdvance(null); setShowBonus(null); setShowDeduction(null) }} className="flex-1 bg-gray-500 text-white py-4 rounded-2xl font-black hover:shadow-xl transition-all">
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Salary Slip Modal */}
        <AnimatePresence>
          {showSalarySlip && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowSalarySlip(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full print:shadow-none"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Salary Slip</h2>
                  <p className="text-gray-500 font-semibold">{new Date(selectedMonth + '-01').toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })}</p>
                </div>
                {(() => {
                  const calc = calculateMonthSalary(showSalarySlip, selectedMonth)
                  return (
                    <>
                      <div className="space-y-3 text-sm border-t-2 border-b-2 border-gray-200 py-6">
                        <div className="flex justify-between"><span className="font-semibold">Name:</span><span className="font-black">{showSalarySlip.name}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Designation:</span><span>{showSalarySlip.designation}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">CNIC:</span><span>{showSalarySlip.cnic}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Phone:</span><span>{showSalarySlip.phone}</span></div>
                      </div>
                      <div className="space-y-3 text-sm py-6">
                        <div className="flex justify-between"><span className="font-semibold">Basic Salary:</span><span className="font-bold">Rs. {calc.basicSalary}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Present Days:</span><span className="font-bold text-green-600">{calc.presentDays} days</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Half Days:</span><span className="font-bold text-yellow-600">{calc.halfDays} days</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Absent:</span><span className="font-bold text-red-600">{calc.absentDays} days</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Leave:</span><span className="font-bold">{calc.leaveDays} days</span></div>
                        <div className="flex justify-between font-bold"><span>Earned Salary:</span><span>Rs. {calc.earnedSalary.toFixed(0)}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Bonus:</span><span className="font-bold text-green-600">+ Rs. {calc.bonuses}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Advance:</span><span className="font-bold text-red-600">- Rs. {calc.advances}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Deductions:</span><span className="font-bold text-red-600">- Rs. {calc.deductions}</span></div>
                        <div className="flex justify-between border-t-2 border-gray-300 pt-4 font-black text-xl"><span>Net Payable:</span><span className="text-green-600">Rs. {calc.netPayable.toFixed(0)}</span></div>
                      </div>
                    </>
                  )
                })()}
                <div className="flex gap-3 mt-8 print:hidden">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => window.print()} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-black hover:shadow-xl transition-all">
                    Print
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowSalarySlip(null)} className="flex-1 bg-gray-500 text-white py-4 rounded-2xl font-black hover:shadow-xl transition-all">
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}