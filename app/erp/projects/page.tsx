"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { TaskStatus, ProjectPhase } from '@/lib/erp/types';
import { formatLKR, formatLKRFull } from '@/lib/erp/currency';
import {
  HardHat,
  Plus,
  Calendar,
  MapPin,
  User,
  Layers,
  Building2,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Award,
} from 'lucide-react';

const KANBAN_COLS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'BACKLOG', label: 'Engineering Backlog', color: 'border-zinc-500/40 text-zinc-300' },
  { key: 'IN_PROGRESS', label: 'Field Execution', color: 'border-blue-500/40 text-blue-300' },
  { key: 'REVIEW', label: 'BIM & QA Inspection', color: 'border-amber-500/40 text-amber-300' },
  { key: 'COMPLETED', label: 'Commissioned', color: 'border-emerald-500/40 text-emerald-300' },
];

export default function ProjectsPage() {
  const { projects, updateTaskStatus, addProject, user, activeCompany, companies } = useERP();
  
  const filteredProjects = projects.filter(
    (p) => activeCompany === 'CONSOLIDATED' || !p.companyId || p.companyId === activeCompany
  );

  const [selectedProjectId, setSelectedProjectId] = useState(filteredProjects[0]?.id || projects[0]?.id || '');
  const [showNewModal, setShowNewModal] = useState(false);
  const [projectDetailTab, setProjectDetailTab] = useState<'KANBAN' | 'COCKPIT_360' | 'TEAM' | 'HANDOVER'>('KANBAN');

  // Form State in LKR
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState(2450000000); // LKR 2.45 Billion default
  const [phase, setPhase] = useState<ProjectPhase>('FOUNDATION');
  const [category, setCategory] = useState<'GOVERNMENT' | 'PRIVATE'>('GOVERNMENT');
  const [cidaClassification, setCidaClassification] = useState('Building & Heavy Civil (CIDA Grade CS2)');
  const siteEngineer = 'Eng. Maya Lin (Chartered Structural Eng)';

  const activeProject = filteredProjects.find((p) => p.id === selectedProjectId) || filteredProjects[0] || projects[0];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !client) return;
    addProject({
      name,
      client,
      location: location || 'Colombo Financial Centre, Sri Lanka',
      budget: Number(budget),
      spent: 0,
      progress: 5,
      phase,
      category,
      siteEngineer: siteEngineer || user?.name || 'Eng. Maya Lin',
      projectManager: 'Eng. Marcus Chen (VP Operations)',
      startDate: new Date().toISOString().split('T')[0],
      targetCompletion: '2028-06-30',
      cidaClassification,
      plannedValueLkr: Math.round(Number(budget) * 0.05),
      earnedValueLkr: 0,
      cpi: 1.0,
      spi: 1.0,
      ladAmountPerDayLkr: 250000,
      retentionHeldLkr: 0,
      originalContractSumLkr: Number(budget),
      approvedVariationsLkr: 0,
    });
    setName('');
    setClient('');
    setShowNewModal(false);
  };

  const currentComp = companies.find((c) => c.id === (activeProject?.companyId || 'COMP_A'));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <HardHat className="w-4 h-4" />
            <span>Module 02 • Project Management & 360° Site Monitoring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Sites, Contract Deliverables & BIM Kanban
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Monitor contract execution, approved variations, EVM cost telemetry, and milestones for {activeCompany === 'CONSOLIDATED' ? 'All Companies' : currentComp?.tradeName}.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold shadow-lg shadow-blue-900/40 border border-blue-400/40 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#FFB800]" />
          <span>Register New Mega-Project</span>
        </button>
      </div>

      {/* Projects Grid Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProjects.map((p) => {
          const isSelected = p.id === activeProject?.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`p-4 rounded-2xl text-left transition-all border ${
                isSelected
                  ? 'bg-[#091536] border-[#FFB800]/60 shadow-xl shadow-blue-950/50'
                  : 'bg-[#080e1c]/80 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {p.code}
                </span>
                <span className="text-xs font-mono font-bold text-[#FFB800]">
                  {p.progress}% Done
                </span>
              </div>

              <div className="font-bold text-white text-sm mt-2 line-clamp-1">{p.name}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{p.client}</div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0038B8] to-[#FFB800] rounded-full"
                  style={{ width: `${p.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2 font-mono">
                <span>Phase: {p.phase}</span>
                <span className="text-white font-bold">{formatLKR(p.budget, true)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Project In-Depth Dashboard */}
      {activeProject && (
        <div className="p-6 rounded-2xl bg-[#080e1c]/90 border border-white/10 space-y-6">
          {/* Top Project Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">{activeProject.name}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30 font-bold">
                  Phase: {activeProject.phase}
                </span>
                {activeProject.cidaClassification && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {activeProject.cidaClassification}
                  </span>
                )}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {activeProject.category || 'GOVERNMENT'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {activeProject.location}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Site Lead: {activeProject.siteEngineer}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Target Handover: {activeProject.targetCompletion}
                </span>
              </div>
            </div>

            {/* EVM & Financial Execution in LKR */}
            <div className="flex items-center gap-6 text-right">
              <div>
                <span className="text-xs text-zinc-400">Budget Executed</span>
                <div className="text-lg font-extrabold text-white font-mono">
                  {formatLKR(activeProject.spent, true)} / {formatLKR(activeProject.budget, true)}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono">
                  {Math.round((activeProject.spent / activeProject.budget) * 100)}% Financial Burn
                </div>
              </div>

              {activeProject.cpi && (
                <div className="border-l border-white/10 pl-4 hidden sm:block">
                  <span className="text-xs text-zinc-400">EVM Metrics</span>
                  <div className="text-xs font-mono font-bold text-blue-300">
                    CPI: {activeProject.cpi.toFixed(2)} • SPI: {(activeProject.spi || 1.0).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    LAD: {formatLKR(activeProject.ladAmountPerDayLkr || 250000)}/day
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project View Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            {[
              { key: 'KANBAN', label: 'Field Execution Kanban', icon: Layers },
              { key: 'COCKPIT_360', label: 'Project 360° Cost & Contract Cockpit', icon: Activity },
              { key: 'TEAM', label: 'Project Team & Key Roles', icon: User },
              { key: 'HANDOVER', label: 'Handover & Practical Completion Checklist', icon: CheckCircle2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = projectDetailTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setProjectDetailTab(tab.key as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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

          {/* TAB 1: KANBAN */}
          {projectDetailTab === 'KANBAN' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {KANBAN_COLS.map((col) => {
                  const colTasks = activeProject.tasks.filter((t) => t.status === col.key);

                  return (
                    <div
                      key={col.key}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                          {col.label}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                          {colTasks.length}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {colTasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 space-y-2 transition-all shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-medium text-white leading-snug">
                                {task.title}
                              </span>
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                                  task.priority === 'CRITICAL'
                                    ? 'bg-red-500/20 text-red-300'
                                    : task.priority === 'HIGH'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-blue-500/20 text-blue-300'
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                              <span>{task.assignee}</span>
                              <span className="font-mono">Due: {task.dueDate}</span>
                            </div>

                            {/* Move Action buttons */}
                            <div className="pt-2 border-t border-white/5 flex items-center gap-1 justify-end">
                              {col.key !== 'BACKLOG' && (
                                <button
                                  onClick={() => {
                                    const prevStatus: Record<TaskStatus, TaskStatus> = {
                                      IN_PROGRESS: 'BACKLOG',
                                      REVIEW: 'IN_PROGRESS',
                                      COMPLETED: 'REVIEW',
                                      BACKLOG: 'BACKLOG',
                                    };
                                    updateTaskStatus(activeProject.id, task.id, prevStatus[col.key]);
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[9px] text-zinc-400 hover:text-white"
                                >
                                  ← Back
                                </button>
                              )}
                              {col.key !== 'COMPLETED' && (
                                <button
                                  onClick={() => {
                                    const nextStatus: Record<TaskStatus, TaskStatus> = {
                                      BACKLOG: 'IN_PROGRESS',
                                      IN_PROGRESS: 'REVIEW',
                                      REVIEW: 'COMPLETED',
                                      COMPLETED: 'COMPLETED',
                                    };
                                    updateTaskStatus(activeProject.id, task.id, nextStatus[col.key]);
                                  }}
                                  className="px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600/50 text-[9px] font-bold text-blue-300"
                                >
                                  Advance →
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {colTasks.length === 0 && (
                          <div className="py-8 text-center text-zinc-400 text-xs italic">
                            No active tasks in this stage
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PROJECT 360 COCKPIT */}
          {projectDetailTab === 'COCKPIT_360' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-zinc-400 text-xs">Original Contract Value</span>
                  <div className="text-xl font-bold text-white font-mono">{formatLKRFull(activeProject.originalContractSumLkr || activeProject.budget)}</div>
                  <span className="text-[10px] text-zinc-400">Signed FIDIC Red Book Baseline</span>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-zinc-400 text-xs">Approved Variations</span>
                  <div className="text-xl font-bold text-emerald-400 font-mono">+{formatLKRFull(activeProject.approvedVariationsLkr || 125000000)}</div>
                  <span className="text-[10px] text-emerald-400/80">3 Engineer Variation Orders (VO)</span>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-zinc-400 text-xs">Current Effective Contract Sum</span>
                  <div className="text-xl font-extrabold text-[#FFB800] font-mono">
                    {formatLKRFull((activeProject.originalContractSumLkr || activeProject.budget) + (activeProject.approvedVariationsLkr || 125000000))}
                  </div>
                  <span className="text-[10px] text-blue-300">Revised Budget Execution Ceiling</span>
                </div>
              </div>

              {/* Cost Integration Breakdown Table */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Integrated Multi-Module Project Cost Real-Time Feed
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-zinc-400 text-[10px] uppercase">Materials Cost (MIN)</span>
                    <div className="font-bold text-white font-mono text-sm mt-1">{formatLKR(Math.round(activeProject.spent * 0.45))}</div>
                    <span className="text-[9px] text-zinc-400">Rebar, Cement, Sand</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-zinc-400 text-[10px] uppercase">Site Labour Wages</span>
                    <div className="font-bold text-white font-mono text-sm mt-1">{formatLKR(Math.round(activeProject.spent * 0.22))}</div>
                    <span className="text-[9px] text-zinc-400">15-Day Muster Rolls</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-zinc-400 text-[10px] uppercase">Machinery & Fleet</span>
                    <div className="font-bold text-white font-mono text-sm mt-1">{formatLKR(Math.round(activeProject.spent * 0.18))}</div>
                    <span className="text-[9px] text-zinc-400">Fuel & Daily Hire</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-zinc-400 text-[10px] uppercase">Subcontractors & Other</span>
                    <div className="font-bold text-white font-mono text-sm mt-1">{formatLKR(Math.round(activeProject.spent * 0.15))}</div>
                    <span className="text-[9px] text-zinc-400">Piling & MEP Specialists</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEAM */}
          {projectDetailTab === 'TEAM' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-[10px] font-mono uppercase text-blue-300">Project Director</span>
                <div className="font-bold text-white text-sm">Elena Vance (CEO)</div>
                <p className="text-xs text-zinc-400">Corporate sponsor & employer liaison</p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-[10px] font-mono uppercase text-amber-300">Project Manager</span>
                <div className="font-bold text-white text-sm">Eng. Marcus Chen</div>
                <p className="text-xs text-zinc-400">Daily site operations & contractor control</p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-[10px] font-mono uppercase text-emerald-300">Lead Structural Engineer</span>
                <div className="font-bold text-white text-sm">{activeProject.siteEngineer}</div>
                <p className="text-xs text-zinc-400">Quality control, concrete cubes & QA</p>
              </div>
            </div>
          )}

          {/* TAB 4: HANDOVER */}
          {projectDetailTab === 'HANDOVER' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#080e1c] border border-white/10 space-y-2 text-xs">
                <h4 className="font-bold text-white text-sm">Handover Checklist & Acceptance Conditions</h4>
                <div className="space-y-2 pt-2">
                  {[
                    'As-Built Drawings (BIM LOD 500) Certified by Consulting Engineer',
                    'Concrete Cube Test Break Registers (28-Day Strength Pass Rate 100%)',
                    'Operation & Maintenance Manuals (MEP, Chiller Plant, Elevators)',
                    'Joint Snagging List Rectification & Sign-off by Client Representative',
                    'Initial 50% Retention Release Interim Certificate Generation',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded bg-white/[0.02]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-zinc-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HardHat className="w-4 h-4 text-[#FFB800]" />
                <span>Register New Mega-Project</span>
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Colombo Port City Mixed-Use Development"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Employer / Client</label>
                  <input
                    type="text"
                    placeholder="e.g. UDA / Private Developer"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Project Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-white"
                  >
                    <option value="GOVERNMENT">Government (CIDA / FIDIC)</option>
                    <option value="PRIVATE">Private Commercial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Site Location</label>
                <input
                  type="text"
                  placeholder="e.g. Marine Drive, Colombo 01"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Contract Budget Sum (LKR)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Initial Phase</label>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-white"
                  >
                    <option value="DESIGN">Design & Feasibility</option>
                    <option value="PILING">Piling & Shoring</option>
                    <option value="FOUNDATION">Substructure Foundation</option>
                    <option value="STRUCTURAL">Superstructure Casting</option>
                    <option value="MEP_ENVELOPE">MEP & Façade</option>
                    <option value="INTERIOR">Interior Finishes</option>
                    <option value="HANDOVER">Handover & Commissioning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">CIDA Classification</label>
                <input
                  type="text"
                  value={cidaClassification}
                  onChange={(e) => setCidaClassification(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
