"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import {
  Users,
  Search,
  Calendar,
} from 'lucide-react';

export default function HRPage() {
  const { employees, leaves, updateLeaveStatus } = useERP();
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const departments = [
    'ALL',
    'Executive Board',
    'Corporate Finance',
    'Field Operations',
    'People & Culture',
    'Commercial & CRM',
    'Structural Engineering',
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const totalPayroll = employees.reduce((acc, emp) => acc + emp.salary, 0);
  const avgAttendance = Math.round(
    employees.reduce((acc, emp) => acc + emp.attendanceRate, 0) / (employees.length || 1)
  );
  const pendingLeavesCount = leaves.filter((l) => l.status === 'PENDING').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Human Resource Management (HRMS) & Workforce</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Workforce Directory & Leave Approvals
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Oversee corporate talent, structural engineering assignments, and annual payroll.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Annual Corporate Payroll</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            ${(totalPayroll / 1000000).toFixed(2)}M
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Across {employees.length} core leadership & engineering positions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Workforce Attendance Index</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {avgAttendance}%
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            Consistent site & headquarter check-ins
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Pending Leave Approvals</span>
          <div
            className={`text-2xl font-extrabold mt-1 ${
              pendingLeavesCount > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {pendingLeavesCount} Requests
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Workflow review required
          </span>
        </div>
      </div>

      {/* Section 1: Leave Management Workflow */}
      <div className="p-5 rounded-2xl bg-[#080e1c]/85 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FFB800]" />
            <span>Leave Requests & Absence Approvals</span>
          </h2>
          <span className="text-xs font-mono text-zinc-400">
            {leaves.length} Submissions
          </span>
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-zinc-400 font-mono text-[11px] border-b border-white/10 uppercase">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Type & Duration</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {leave.employeeName}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{leave.department}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-white">{leave.days} Days</span> ({leave.type})
                      <div className="text-[10px] text-zinc-400">
                        {leave.startDate} to {leave.endDate}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 max-w-xs">{leave.reason}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          leave.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : leave.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {leave.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'APPROVED')}
                            className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'REJECTED')}
                            className="px-2.5 py-1 rounded bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-[11px] font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-400">Recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 2: Employee Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDept === dept
                    ? 'bg-[#0038B8] text-white'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff by name or ID..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFB800]"
            />
          </div>
        </div>

        {/* Employees Table */}
        <div className="rounded-2xl bg-[#080e1c]/85 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-zinc-400 font-mono text-[11px] border-b border-white/10 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Staff Member & ID</th>
                  <th className="py-3.5 px-4">Role & Department</th>
                  <th className="py-3.5 px-4">Direct Contact</th>
                  <th className="py-3.5 px-4 text-right">Compensation</th>
                  <th className="py-3.5 px-4 text-center">Attendance</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{emp.name}</div>
                      <div className="text-[10px] font-mono text-zinc-400">{emp.empId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{emp.role}</div>
                      <div className="text-[11px] text-blue-300">{emp.department}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-zinc-300 font-mono text-[11px]">{emp.email}</div>
                      <div className="text-zinc-400 text-[10px]">{emp.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      ${emp.salary.toLocaleString()}/yr
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">
                      {emp.attendanceRate}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          emp.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

