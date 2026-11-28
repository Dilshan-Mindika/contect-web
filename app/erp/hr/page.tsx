"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
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
  const [hrTab, setHrTab] = useState<'DIRECTORY' | 'PAYROLL' | 'LEAVE' | 'ONBOARD'>('DIRECTORY');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<Employee | null>(null);

  // New Employee Form
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Field Operations');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+94 77 ');
  const [nic, setNic] = useState('');
  const [salary, setSalary] = useState(250000);
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
    addEmployee({
      name,
      role,
      department,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@contec.lk`,
      phone,
      nic,
      salary: Number(salary),
      fixedAllowancesLkr: Math.round(Number(salary) * 0.2),
      epfEmployeeLkr: Math.round(Number(salary) * 0.08),
      epfEmployerLkr: Math.round(Number(salary) * 0.12),
      etfEmployerLkr: Math.round(Number(salary) * 0.03),
      annualPackageLkr: Number(salary) * 12,
      epfNo: `EPF-${Math.floor(1000 + Math.random() * 9000)}`,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      attendanceRate: 98,
      tradeCertification,
    });
    setName('');
    setRole('');
    setHrTab('DIRECTORY');
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
          { key: 'DIRECTORY', label: '01. Employee Master Directory', icon: Users },
          { key: 'PAYROLL', label: '02. Sri Lankan Payroll (EPF/ETF Engine)', icon: CreditCard },
          { key: 'LEAVE', label: '03. Leave Applications & Approvals', icon: Calendar },
          { key: 'ONBOARD', label: '04. Onboard New Employee', icon: Plus },
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
            title="Team & Staff Directory (Create, View, Edit, Delete & View Modes)"
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
              { key: 'employmentType', label: 'Employment Type', type: 'select', options: ['PERMANENT', 'CONTRACT', 'CONSULTANT'], showInTable: false, optional: true },
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

      {/* TAB 2: PAYROLL ENGINE & STATUTORY EPF/ETF */}
      {hrTab === 'PAYROLL' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300">
            <strong>Sri Lankan Statutory Payroll Compliance:</strong> Basic Salary subject to <strong>8% Employee EPF</strong> deduction, <strong>12% Employer EPF</strong> contribution, and <strong>3% Employer ETF</strong> contribution remitted monthly to Central Bank of Sri Lanka.
          </div>

          <div className="rounded-2xl bg-[#080e1c] border border-white/10 overflow-hidden">
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
                  {filteredEmployees.map((emp) => {
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
                            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px]"
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
        </div>
      )}

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
            <span>Onboard New Construction Professional</span>
          </h3>
          <form onSubmit={handleEnrollEmployee} className="space-y-3.5 text-xs">
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
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080f24] border border-white/15 text-white"
                >
                  {departments.filter((d) => d !== 'ALL').map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
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
                  required
                />
              </div>
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
