"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import CustomSelect from '@/components/erp/CustomSelect';
import { formatLKR, formatLKRFull } from '@/lib/erp/currency';
import { Employee, LeaveStatus } from '@/lib/erp/types';
import {
  Users,
  Search,
  Calendar,
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  Award,
  FileText,
  DollarSign,
} from 'lucide-react';

export default function HRPage() {
  const { employees, leaves, updateLeaveStatus, addEmployee, activeCompany, companies } = useERP();
  const [hrTab, setHrTab] = useState<'DIRECTORY' | 'ATTENDANCE' | 'PAYROLL' | 'LEAVE' | 'ONBOARD'>('DIRECTORY');
  const todayStr = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState(todayStr);
  const [attendanceSavedMsg, setAttendanceSavedMsg] = useState(false);

  // Quick-add temp worker inline state
  const [showQuickTemp, setShowQuickTemp] = useState(false);
  const [quickTempName, setQuickTempName] = useState('');
  const [quickTempRole, setQuickTempRole] = useState('Site Helper / Mason');
  const [quickTempRate, setQuickTempRate] = useState(1250);

  type SimpleAttendanceEntry = {
    status: 'PRESENT' | 'ON_SITE' | 'HALF_DAY' | 'ABSENT';
    hoursWorked: number;
    otHours: number;
  };

  const [attendanceMap, setAttendanceMap] = useState<Record<string, SimpleAttendanceEntry>>({});

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(`contec_hr_attendance_${attendanceDate}`);
      if (saved) {
        setAttendanceMap(JSON.parse(saved));
        return;
      }
    } catch {}
    const defaults: Record<string, SimpleAttendanceEntry> = {};
    employees.forEach((emp, idx) => {
      defaults[emp.id] = {
        status: emp.department === 'Field Operations' || idx % 4 === 0 ? 'ON_SITE' : 'PRESENT',
        hoursWorked: 8,
        otHours: 0,
      };
    });
    setAttendanceMap(defaults);
  }, [attendanceDate, employees]);

  const updateEmpAttendance = (empId: string, patch: Partial<SimpleAttendanceEntry>) => {
    setAttendanceSavedMsg(false);
    setAttendanceMap((prev) => {
      const current = prev[empId] || { status: 'PRESENT', hoursWorked: 8, otHours: 0 };
      const updated = { ...current, ...patch };
      const next = { ...prev, [empId]: updated };
      try {
        localStorage.setItem(`contec_hr_attendance_${attendanceDate}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleMarkAllPresent = () => {
    setAttendanceSavedMsg(false);
    setAttendanceMap((prev) => {
      const next = { ...prev };
      filteredEmployees.forEach((emp) => {
        next[emp.id] = {
          status: emp.department === 'Field Operations' ? 'ON_SITE' : 'PRESENT',
          hoursWorked: 8,
          otHours: prev[emp.id]?.otHours || 0,
        };
      });
      try {
        localStorage.setItem(`contec_hr_attendance_${attendanceDate}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSaveAttendance = () => {
    try {
      localStorage.setItem(`contec_hr_attendance_${attendanceDate}`, JSON.stringify(attendanceMap));
    } catch {}
    setAttendanceSavedMsg(true);
    setTimeout(() => setAttendanceSavedMsg(false), 3000);
  };

  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<Employee | null>(null);

  // New Employee Form
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Field Operations');
  const [employmentType, setEmploymentType] = useState<'PERMANENT' | 'TEMP_HOURLY'>('PERMANENT');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+94 77 ');
  const [nic, setNic] = useState('');
  const [salary, setSalary] = useState(250000);
  const [hourlyRateLkr, setHourlyRateLkr] = useState(1250);
  const [tradeCertification, setTradeCertification] = useState('IESL Chartered Engineer / CIDA Card');

  const departments = [
    'ALL',
    'Executive Board',
    'Corporate Finance',
    'Field Operations',
    'Structural Engineering',
    'Quantity Surveying & Contracts',
    'Safety & Quality Assurance',
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesCompany = activeCompany === 'CONSOLIDATED' || !emp.companyId || emp.companyId === activeCompany;
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCompany && matchesDept && matchesSearch;
  });

  const totalMonthlyPayroll = filteredEmployees.reduce((acc, emp) => acc + emp.salary, 0);
  const totalEPFEmployer = Math.round(totalMonthlyPayroll * 0.12);
  const totalEPFEmployee = Math.round(totalMonthlyPayroll * 0.08);
  const totalETFEmployer = Math.round(totalMonthlyPayroll * 0.03);

  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING');

  const handleEnrollEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;
    const isTemp = employmentType === 'TEMP_HOURLY';
    const baseSalary = isTemp ? 0 : Number(salary);
    addEmployee({
      name,
      role,
      department,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@contec.lk`,
      phone,
      nic,
      employmentType,
      hourlyRateLkr: isTemp ? Number(hourlyRateLkr) : undefined,
      salary: baseSalary,
      fixedAllowancesLkr: isTemp ? 0 : Math.round(baseSalary * 0.2),
      epfEmployeeLkr: isTemp ? 0 : Math.round(baseSalary * 0.08),
      epfEmployerLkr: isTemp ? 0 : Math.round(baseSalary * 0.12),
      etfEmployerLkr: isTemp ? 0 : Math.round(baseSalary * 0.03),
      annualPackageLkr: isTemp ? 0 : baseSalary * 12,
      epfNo: isTemp ? 'TEMP-HOURLY' : `EPF-${Math.floor(1000 + Math.random() * 9000)}`,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      attendanceRate: 98,
      tradeCertification,
    });
    setName('');
    setRole('');
    setHrTab('DIRECTORY');
  };

  const handleQuickAddTempWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTempName.trim()) return;
    addEmployee({
      name: quickTempName.trim(),
      role: quickTempRole.trim() || 'Temp Site Worker',
      department: 'Field Operations',
      email: `${quickTempName.trim().toLowerCase().replace(/\s+/g, '.')}@contec.lk`,
      phone: '+94 77 000 0000',
      employmentType: 'TEMP_HOURLY',
      hourlyRateLkr: Number(quickTempRate) || 1250,
      salary: 0,
      fixedAllowancesLkr: 0,
      epfEmployeeLkr: 0,
      epfEmployerLkr: 0,
      etfEmployerLkr: 0,
      annualPackageLkr: 0,
      epfNo: 'TEMP-HOURLY',
      joinDate: attendanceDate,
      status: 'ACTIVE',
      attendanceRate: 100,
    });
    setQuickTempName('');
    setShowQuickTemp(false);
  };

  const currentComp = companies.find((c) => c.id === activeCompany);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Team Directory & Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Oversee staff profiles, statutory Central Bank EPF (12% + 8%) & ETF (3%), leave approvals, and monthly payslips for {activeCompany === 'CONSOLIDATED' ? 'All Companies' : currentComp?.tradeName}.
          </p>
        </div>

        <button
          onClick={() => setHrTab('ONBOARD')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold shadow-lg shadow-blue-900/40 border border-blue-400/40 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#FFB800]" />
          <span>Onboard New Employee</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Workforce Strength</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {filteredEmployees.length} Personnel
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Across {departments.length - 1} Engineering Divisions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Monthly Gross Payroll</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatLKR(totalMonthlyPayroll, true)}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            Annualized: {formatLKR(totalMonthlyPayroll * 12, true)}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Statutory EPF & ETF (Monthly)</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            {formatLKR(totalEPFEmployer + totalETFEmployer, true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            EPF 12% + ETF 3% Employer Share
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Pending Leave Requests</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            {pendingLeaves.length} Requests
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Awaiting HOD / PM Approval
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {[
          { key: 'DIRECTORY', label: 'Staff Directory', icon: Users },
          { key: 'ATTENDANCE', label: 'Quick Attendance & Hours', icon: Clock },
          { key: 'PAYROLL', label: 'Salary & Hourly Payouts', icon: CreditCard },
          { key: 'LEAVE', label: 'Leave Requests', icon: Calendar },
          { key: 'ONBOARD', label: 'Add Staff Member', icon: Plus },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = hrTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setHrTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600/30 border border-blue-400 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFB800]' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EMPLOYEE DIRECTORY */}
      {hrTab === 'DIRECTORY' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedDept === dept
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <UniversalRecordManager
            title="Staff Directory"
            defaultViewMode="DETAILED"
            items={(selectedDept === 'ALL' ? employees : employees.filter((e) => e.department === selectedDept)) as unknown as Record<string, unknown>[]}
            createLabel="Add Staff Member"
            searchPlaceholder="Search staff by name, role, NIC, department..."
            sortOptions={[
              { value: 'name', label: 'Full Name' },
              { value: 'department', label: 'Department' },
              { value: 'salary', label: 'Salary (LKR)' },
            ]}
            fields={[
              { key: 'name', label: 'Full Name', isTitle: true, required: true },
              { key: 'empId', label: 'Employee ID', required: true },
              { key: 'role', label: 'Designation / Role', required: true },
              { key: 'department', label: 'Department', isBadge: true },
              { key: 'email', label: 'Email' },
              { key: 'salary', label: 'Monthly Salary (LKR)', type: 'number', isCurrency: true },
              { key: 'nicNumber', label: 'NIC Number', showInTable: false, optional: true },
              { key: 'phone', label: 'Mobile Phone', showInTable: false, optional: true },
              { key: 'epfNumber', label: 'EPF Member Number', showInTable: false, optional: true },
              { key: 'tradeCertification', label: 'CIDA / IESL / Chartered Reg #', showInTable: false, optional: true },
              { key: 'joinDate', label: 'Date Joined', type: 'date', showInTable: false, optional: true },
              { key: 'fixedAllowancesLkr', label: 'Fixed Allowances (LKR)', type: 'number', isCurrency: true, showInTable: false, optional: true },
              { key: 'employmentType', label: 'Employment Type', type: 'select', options: ['PERMANENT', 'TEMP_HOURLY', 'CONTRACT', 'CONSULTANT'], showInTable: false, optional: true },
              { key: 'hourlyRateLkr', label: 'Hourly Rate (LKR/hr)', type: 'number', isCurrency: true, showInTable: false, optional: true },
              { key: 'bankDetails', label: 'Salary Bank & Account #', showInTable: false, optional: true },
              { key: 'images', label: 'Staff Photo, NIC & Engineering Certs', type: 'images', showInTable: false, optional: true },
            ]}
            renderRowActions={(item) => (
              <button
                type="button"
                onClick={() => setSelectedPayslipEmp(item as unknown as (typeof employees)[number])}
                className="px-2 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-[11px] font-bold text-blue-300 border border-blue-500/30 flex items-center gap-1 cursor-pointer"
                title="View Official Payslip"
              >
                <Printer className="w-3 h-3" />
                <span>Payslip</span>
              </button>
            )}
          />
        </div>
      )}

      {/* TAB 2: FEW-CLICK EMPLOYEE ATTENDANCE & HOURLY PAYOUTS */}
      {hrTab === 'ATTENDANCE' && (() => {
        const presentCount = filteredEmployees.filter((e) => {
          const st = attendanceMap[e.id]?.status || 'PRESENT';
          return st !== 'ABSENT';
        }).length;
        const totalHours = filteredEmployees.reduce((sum, e) => {
          const entry = attendanceMap[e.id] || { status: 'PRESENT', hoursWorked: 8, otHours: 0 };
          return sum + (entry.status === 'ABSENT' ? 0 : entry.hoursWorked + entry.otHours);
        }, 0);
        const tempPayoutDue = filteredEmployees
          .filter((e) => e.employmentType === 'TEMP_HOURLY' || (e.hourlyRateLkr && e.hourlyRateLkr > 0))
          .reduce((sum, e) => {
            const entry = attendanceMap[e.id] || { status: 'PRESENT', hoursWorked: 8, otHours: 0 };
            if (entry.status === 'ABSENT') return sum;
            const rate = e.hourlyRateLkr || 1250;
            return sum + (entry.hoursWorked + entry.otHours) * rate;
          }, 0);

        return (
          <div className="space-y-4">
            {/* Simple Top Control Bar */}
            <div className="p-4 rounded-2xl bg-[#080e1c]/90 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-400 font-semibold mb-1">Attendance Date</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div className="flex items-center gap-4 pl-2 border-l border-white/10 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Present Today</span>
                    <span className="font-bold text-emerald-400">{presentCount} / {filteredEmployees.length}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Total Hours</span>
                    <span className="font-bold text-white">{totalHours} hrs</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Temp Hourly Payout</span>
                    <span className="font-bold text-[#FFB800]">{formatLKR(tempPayoutDue)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 cursor-pointer transition-colors"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuickTemp((v) => !v)}
                  className="px-3 py-2 rounded-xl bg-[#FFB800]/15 hover:bg-[#FFB800]/25 border border-[#FFB800]/30 text-xs font-bold text-[#FFB800] cursor-pointer transition-colors"
                >
                  + Add Temp Hourly Worker
                </button>
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{attendanceSavedMsg ? 'Saved!' : 'Save Attendance'}</span>
                </button>
              </div>
            </div>

            {/* Quick Inline Add Temp Hourly Worker */}
            {showQuickTemp && (
              <form
                onSubmit={handleQuickAddTempWorker}
                className="p-4 rounded-2xl bg-[#091536] border border-[#FFB800]/30 flex flex-col sm:flex-row items-end gap-3 animate-fadeIn"
              >
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Temp Worker Name *</label>
                  <input
                    type="text"
                    value={quickTempName}
                    onChange={(e) => setQuickTempName(e.target.value)}
                    placeholder="e.g. Sunil Jayasinghe"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Trade / Role</label>
                  <input
                    type="text"
                    value={quickTempRole}
                    onChange={(e) => setQuickTempRole(e.target.value)}
                    placeholder="e.g. Mason / Helper"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                  />
                </div>
                <div className="w-full sm:w-40">
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Hourly Rate (LKR)</label>
                  <input
                    type="number"
                    min={100}
                    value={quickTempRate}
                    onChange={(e) => setQuickTempRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white font-mono"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#FFB800] text-black text-xs font-bold cursor-pointer"
                  >
                    Add Worker
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickTemp(false)}
                    className="px-3 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* 1-Click Attendance Cards/Rows */}
            <div className="rounded-2xl bg-[#080e1c]/90 border border-white/10 divide-y divide-white/5">
              {filteredEmployees.map((emp) => {
                const entry = attendanceMap[emp.id] || { status: 'PRESENT', hoursWorked: 8, otHours: 0 };
                const isTemp = emp.employmentType === 'TEMP_HOURLY' || Boolean(emp.hourlyRateLkr);
                const hourlyRate = emp.hourlyRateLkr || 1250;
                const dailyPay = entry.status === 'ABSENT' ? 0 : (entry.hoursWorked + entry.otHours) * hourlyRate;

                return (
                  <div
                    key={emp.id}
                    className="p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Employee Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{emp.name}</span>
                        {isTemp ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30">
                            Temp • {formatLKR(hourlyRate)}/hr
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                            {emp.empId}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {emp.role} • {emp.department}
                      </div>
                    </div>

                    {/* 1-Click Status Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(
                        [
                          { id: 'PRESENT', label: 'Present', active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                          { id: 'ON_SITE', label: 'On Site', active: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
                          { id: 'HALF_DAY', label: 'Half Day', active: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                          { id: 'ABSENT', label: 'Absent', active: 'bg-red-500/20 text-red-300 border-red-500/40' },
                        ] as const
                      ).map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() =>
                            updateEmpAttendance(emp.id, {
                              status: st.id,
                              hoursWorked: st.id === 'ABSENT' ? 0 : st.id === 'HALF_DAY' ? 4 : 8,
                            })
                          }
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                            entry.status === st.id
                              ? st.active
                              : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>

                    {/* Hours & OT + Live Temp Payout */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-zinc-400 text-[11px]">Hrs:</span>
                        <input
                          type="number"
                          min={0}
                          max={24}
                          step={0.5}
                          disabled={entry.status === 'ABSENT'}
                          value={entry.status === 'ABSENT' ? 0 : entry.hoursWorked}
                          onChange={(e) => updateEmpAttendance(emp.id, { hoursWorked: Number(e.target.value) })}
                          className="w-16 px-2 py-1 rounded-lg bg-white/5 border border-white/15 text-center text-white font-mono disabled:opacity-40"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-zinc-400 text-[11px]">OT:</span>
                        <input
                          type="number"
                          min={0}
                          max={12}
                          step={0.5}
                          disabled={entry.status === 'ABSENT'}
                          value={entry.status === 'ABSENT' ? 0 : entry.otHours}
                          onChange={(e) => updateEmpAttendance(emp.id, { otHours: Number(e.target.value) })}
                          className="w-14 px-2 py-1 rounded-lg bg-white/5 border border-white/15 text-center text-white font-mono disabled:opacity-40"
                        />
                      </div>

                      {isTemp && (
                        <div className="min-w-[100px] text-right">
                          <span className="text-[10px] text-zinc-400 block">Day Payout</span>
                          <span className="text-xs font-bold text-[#FFB800] font-mono">
                            {formatLKR(dailyPay)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* TAB 3: PAYROLL ENGINE & STATUTORY EPF/ETF + TEMP HOURLY PAYOUTS */}
      {hrTab === 'PAYROLL' && (() => {
        const permEmployees = filteredEmployees.filter((e) => e.employmentType !== 'TEMP_HOURLY' && !e.hourlyRateLkr);
        const tempEmployees = filteredEmployees.filter((e) => e.employmentType === 'TEMP_HOURLY' || Boolean(e.hourlyRateLkr));
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300">
              <strong>Payroll &amp; Hourly Payouts:</strong> Permanent staff include 8% Employee EPF, 12% Employer EPF, and 3% Employer ETF. Temporary hourly staff are paid directly by hours logged.
            </div>

            {/* Permanent Monthly Payroll */}
            <div className="rounded-2xl bg-[#080e1c] border border-white/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Permanent Staff Monthly Payroll</h3>
                <span className="text-xs text-zinc-400">{permEmployees.length} Staff</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white/5 text-zinc-400 border-b border-white/10 font-mono">
                    <tr>
                      <th className="p-3">Staff ID</th>
                      <th className="p-3">Employee</th>
                      <th className="p-3 text-right">Basic (LKR)</th>
                      <th className="p-3 text-right">Allowances</th>
                      <th className="p-3 text-right">EPF 8% (Emp)</th>
                      <th className="p-3 text-right">EPF 12% (Co)</th>
                      <th className="p-3 text-right">ETF 3% (Co)</th>
                      <th className="p-3 text-right">Net Take-Home</th>
                      <th className="p-3 text-right">Payslip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {permEmployees.map((emp) => {
                      const basic = emp.salary;
                      const allow = emp.fixedAllowancesLkr || Math.round(basic * 0.2);
                      const epf8 = Math.round(basic * 0.08);
                      const epf12 = Math.round(basic * 0.12);
                      const etf3 = Math.round(basic * 0.03);
                      const net = basic + allow - epf8;

                      return (
                        <tr key={emp.id} className="hover:bg-white/[0.02]">
                          <td className="p-3 text-blue-300 font-bold">{emp.empId}</td>
                          <td className="p-3 font-sans font-medium text-white">{emp.name}</td>
                          <td className="p-3 text-right text-zinc-200">{formatLKR(basic)}</td>
                          <td className="p-3 text-right text-emerald-400">+{formatLKR(allow)}</td>
                          <td className="p-3 text-right text-red-400">-{formatLKR(epf8)}</td>
                          <td className="p-3 text-right text-[#FFB800]">{formatLKR(epf12)}</td>
                          <td className="p-3 text-right text-purple-300">{formatLKR(etf3)}</td>
                          <td className="p-3 text-right font-bold text-white text-sm">{formatLKR(net)}</td>
                          <td className="p-3 text-right font-sans">
                            <button
                              onClick={() => setSelectedPayslipEmp(emp)}
                              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px] cursor-pointer"
                            >
                              Print
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Temporary Hourly Staff Payouts */}
            <div className="rounded-2xl bg-[#080e1c] border border-[#FFB800]/25 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Temporary Hourly Staff Payouts ({attendanceDate})</h3>
                  <p className="text-[11px] text-zinc-400">Calculated automatically from hours &amp; OT marked in Quick Attendance</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHrTab('ATTENDANCE')}
                  className="px-3 py-1.5 rounded-lg bg-[#FFB800]/15 hover:bg-[#FFB800]/25 text-[#FFB800] text-xs font-semibold cursor-pointer"
                >
                  Edit Hours
                </button>
              </div>
              {tempEmployees.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400">
                  No temporary hourly workers added yet. Click <strong>+ Add Temp Hourly Worker</strong> in Quick Attendance or Add Staff Member.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-white/5 text-zinc-400 border-b border-white/10">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Role</th>
                        <th className="p-3 text-right">Hourly Rate</th>
                        <th className="p-3 text-right">Hours + OT</th>
                        <th className="p-3 text-right">Net Payout (LKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {tempEmployees.map((emp) => {
                        const entry = attendanceMap[emp.id] || { status: 'PRESENT', hoursWorked: 8, otHours: 0 };
                        const hrs = entry.status === 'ABSENT' ? 0 : entry.hoursWorked + entry.otHours;
                        const rate = emp.hourlyRateLkr || 1250;
                        return (
                          <tr key={emp.id} className="hover:bg-white/[0.02]">
                            <td className="p-3 font-bold text-white">{emp.name}</td>
                            <td className="p-3 text-zinc-300">{emp.role}</td>
                            <td className="p-3 text-right font-mono text-zinc-300">{formatLKR(rate)}/hr</td>
                            <td className="p-3 text-right font-mono text-blue-300">{hrs} hrs</td>
                            <td className="p-3 text-right font-mono font-bold text-[#FFB800] text-sm">{formatLKR(hrs * rate)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 3: LEAVE MANAGEMENT */}
      {hrTab === 'LEAVE' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#080e1c] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5 text-zinc-400 border-b border-white/10 font-mono">
                  <tr>
                    <th className="p-4">Employee Name</th>
                    <th className="p-4">Division</th>
                    <th className="p-4">Leave Type</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Days</th>
                    <th className="p-4">Reason / Notes</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leaves.map((l) => (
                    <tr key={l.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-bold text-white">{l.employeeName}</td>
                      <td className="p-4 text-zinc-300">{l.department}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 font-bold">
                          {l.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-zinc-400">{l.startDate} to {l.endDate}</td>
                      <td className="p-4 font-mono font-bold text-white">{l.days} Days</td>
                      <td className="p-4 text-zinc-400 italic">{l.reason}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            l.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : l.status === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {l.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => updateLeaveStatus(l.id, 'APPROVED')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[11px] font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateLeaveStatus(l.id, 'REJECTED')}
                              className="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 text-[11px]"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ONBOARD NEW EMPLOYEE */}
      {hrTab === 'ONBOARD' && (
        <div className="p-6 rounded-2xl bg-[#080e1c] border border-white/10 max-w-2xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#FFB800]" />
            <span>Add Staff Member</span>
          </h3>
          <form onSubmit={handleEnrollEmployee} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Employment Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEmploymentType('PERMANENT')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    employmentType === 'PERMANENT'
                      ? 'bg-[#0038B8] border-blue-400 text-white'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  Permanent (Monthly Salary)
                </button>
                <button
                  type="button"
                  onClick={() => setEmploymentType('TEMP_HOURLY')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    employmentType === 'TEMP_HOURLY'
                      ? 'bg-[#FFB800] border-[#FFB800] text-black'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  Temporary (Paid Per Hour)
                </button>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Eng. K. L. Wickramasinghe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Designation / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Quantity Surveyor"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Department</label>
                <CustomSelect
                  value={department}
                  onChange={setDepartment}
                  options={departments.filter((d) => d !== 'ALL')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">NIC Number</label>
                <input
                  type="text"
                  placeholder="e.g. 198522004812"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                />
              </div>
              {employmentType === 'TEMP_HOURLY' ? (
                <div>
                  <label className="block font-semibold text-[#FFB800] mb-1">Hourly Rate (LKR / hr)</label>
                  <input
                    type="number"
                    min={100}
                    value={hourlyRateLkr}
                    onChange={(e) => setHourlyRateLkr(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-[#FFB800]/40 text-white font-mono"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Basic Monthly Salary (LKR)</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">CIDA / Trade Certification</label>
              <input
                type="text"
                value={tradeCertification}
                onChange={(e) => setTradeCertification(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setHrTab('DIRECTORY')}
                className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Enroll Staff & Generate ID
              </button>
            </div>
          </form>
        </div>
      )}

      {/* OFFICIAL PAYSLIP MODAL */}
      {selectedPayslipEmp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white text-zinc-900 rounded-2xl p-6 space-y-4 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-zinc-200">
              <div>
                <div className="text-[10px] font-mono uppercase text-blue-900 font-bold">
                  {selectedPayslipEmp.companyId === 'COMP_B'
                    ? 'Contec Heavy Infra & Equipment (Pvt) Ltd'
                    : 'Contec Engineering & Construction (Pvt) Ltd'}
                </div>
                <h3 className="text-lg font-extrabold text-zinc-900">Official Monthly Pay-Advice</h3>
                <span className="text-[11px] text-zinc-500 font-mono">Period: October 2026 (EPF Reg: {selectedPayslipEmp.epfNo || 'EPF-8921'})</span>
              </div>
              <button onClick={() => setSelectedPayslipEmp(null)} className="text-zinc-500 hover:text-black">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-zinc-50 rounded-xl border border-zinc-200 font-mono">
              <div>Employee: <strong>{selectedPayslipEmp.name}</strong></div>
              <div>Staff ID: <strong>{selectedPayslipEmp.empId}</strong></div>
              <div>Designation: <strong>{selectedPayslipEmp.role}</strong></div>
              <div>NIC: <strong>{selectedPayslipEmp.nic || '198421004812'}</strong></div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold border-b pb-1 text-zinc-800">Earnings & Allowances</div>
              <div className="flex justify-between py-1">
                <span>Basic Salary:</span>
                <span className="font-mono font-bold">{formatLKR(selectedPayslipEmp.salary)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Site Technical & Travel Allowance:</span>
                <span className="font-mono">{formatLKR(selectedPayslipEmp.fixedAllowancesLkr || Math.round(selectedPayslipEmp.salary * 0.2))}</span>
              </div>
              <div className="font-bold border-b pb-1 pt-2 text-zinc-800">Statutory Deductions (Central Bank of Sri Lanka)</div>
              <div className="flex justify-between py-1 text-red-600">
                <span>Employee EPF (8%):</span>
                <span className="font-mono font-bold">-{formatLKR(Math.round(selectedPayslipEmp.salary * 0.08))}</span>
              </div>
              <div className="font-bold border-b pb-1 pt-2 text-zinc-800">Employer Contributions (Not Deducted)</div>
              <div className="flex justify-between py-1 text-zinc-600">
                <span>Employer EPF (12%):</span>
                <span className="font-mono">{formatLKR(Math.round(selectedPayslipEmp.salary * 0.12))}</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-600">
                <span>Employer ETF (3%):</span>
                <span className="font-mono">{formatLKR(Math.round(selectedPayslipEmp.salary * 0.03))}</span>
              </div>

              <div className="border-t-2 border-zinc-900 pt-3 flex justify-between items-center text-sm font-extrabold text-blue-900">
                <span>Net Bank Remittance:</span>
                <span className="font-mono text-base">
                  {formatLKRFull(
                    selectedPayslipEmp.salary +
                      (selectedPayslipEmp.fixedAllowancesLkr || Math.round(selectedPayslipEmp.salary * 0.2)) -
                      Math.round(selectedPayslipEmp.salary * 0.08)
                  )}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedPayslipEmp(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Pay-Advice</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
