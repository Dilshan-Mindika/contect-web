"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { TaskStatus, ProjectPhase } from '@/lib/erp/types';
import {
  HardHat,
  Plus,
  Calendar,
  MapPin,
  User,
  Layers,
} from 'lucide-react';

const KANBAN_COLS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'BACKLOG', label: 'Engineering Backlog', color: 'border-zinc-500/40 text-zinc-300' },
  { key: 'IN_PROGRESS', label: 'Field Execution', color: 'border-blue-500/40 text-blue-300' },
  { key: 'REVIEW', label: 'BIM & QA Inspection', color: 'border-amber-500/40 text-amber-300' },
  { key: 'COMPLETED', label: 'Commissioned', color: 'border-emerald-500/40 text-emerald-300' },
];

export default function ProjectsPage() {
  const { projects, updateTaskStatus, addProject, user } = useERP();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [showNewModal, setShowNewModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState(25000000);
  const [phase, setPhase] = useState<ProjectPhase>('DESIGN');
  const siteEngineer = 'Maya Lin';

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !client) return;
    addProject({
      name,
      client,
      location: location || 'Dubai Waterfront Sector 2',
      budget: Number(budget),
      spent: 0,
      progress: 5,
      phase,
      siteEngineer: siteEngineer || user?.name || 'Maya Lin',
      startDate: new Date().toISOString().split('T')[0],
      targetCompletion: '2028-06-30',
    });
    setName('');
    setClient('');
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <HardHat className="w-4 h-4" />
            <span>Field Operations & Structural Engineering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Construction Mega-Sites & Kanban
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Monitor real-time site milestones, structural QA approvals, and budget allocation.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold shadow-lg shadow-blue-900/40 border border-blue-400/40 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#FFB800]" />
          <span>Commission New Site</span>
        </button>
      </div>

      {/* Projects Horizontal Carousel / Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((p) => {
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
                  {p.progress}%
                </span>
              </div>

              <div className="font-bold text-white text-sm mt-2 line-clamp-1">{p.name}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{p.client}</div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden">
                <div
                  className="h-full bg-[#FFB800] rounded-full"
                  style={{ width: `${p.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2">
                <span>Phase: {p.phase}</span>
                <span>${(p.budget / 1000000).toFixed(1)}M</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Project In-Depth Dashboard */}
      {activeProject && (
        <div className="p-6 rounded-2xl bg-[#080e1c]/90 border border-white/10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{activeProject.name}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30">
                  Phase: {activeProject.phase}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1 flex-wrap">
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
                  Target: {activeProject.targetCompletion}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-xs text-zinc-400">Budget Spent</span>
                <div className="text-lg font-extrabold text-white">
                  ${(activeProject.spent / 1000000).toFixed(2)}M / ${(activeProject.budget / 1000000).toFixed(2)}M
                </div>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FFB800]" />
                <span>Site Task Orchestration & QA Kanban</span>
              </h3>
              <span className="text-xs text-zinc-400">
                Change state selector to move tasks live
              </span>
            </div>

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

                          {/* Quick Stage Mover */}
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                            <span className="text-zinc-400">Move:</span>
                            <select
                              value={task.status}
                              onChange={(e) =>
                                updateTaskStatus(activeProject.id, task.id, e.target.value as TaskStatus)
                              }
                              className="bg-black/80 border border-white/15 text-[10px] rounded px-1.5 py-0.5 text-white focus:outline-none"
                            >
                              <option value="BACKLOG">Backlog</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="REVIEW">BIM Review</option>
                              <option value="COMPLETED">Completed ✓</option>
                            </select>
                          </div>
                        </div>
                      ))}

                      {colTasks.length === 0 && (
                        <div className="p-4 rounded-lg border border-dashed border-white/10 text-center text-[11px] text-zinc-400">
                          No active items
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Commission New Site */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091124] border border-white/15 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HardHat className="w-4 h-4 text-[#FFB800]" />
                <span>Commission New Construction Project</span>
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Neo-Villas Maritime Island"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Client Entity</label>
                <input
                  type="text"
                  required
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Dubai Waterfront Authority"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Total Budget ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Initial Phase</label>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value as ProjectPhase)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="DESIGN">Design & BIM</option>
                    <option value="FOUNDATION">Foundation Excavation</option>
                    <option value="STRUCTURAL">Structural Superstructure</option>
                    <option value="INTERIOR">Interior & Commissioning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Site Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Coastal Marina District 7"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0038B8] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-blue-900/40"
                >
                  Commission Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

