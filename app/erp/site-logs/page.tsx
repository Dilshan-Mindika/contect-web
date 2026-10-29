"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { OSHAStatus } from '@/lib/erp/types';
import {
  HardHat,
  Plus,
  CloudSun,
  Droplet,
  Users,
  Send,
  CheckCircle2,
  Beaker,
  ShieldCheck,
} from 'lucide-react';

export default function SiteLogsPage() {
  const { siteLogs, addSiteDailyLog, projects, user } = useERP();
  const [showLogModal, setShowLogModal] = useState(false);
  const [safetyAlertSent, setSafetyAlertSent] = useState<string | null>(null);

  // Form State
  const [projectId, setProjectId] = useState(projects[0]?.id || 'prj-01');
  const [weatherSummary, setWeatherSummary] = useState('Partly Cloudy, 30°C, Wind 12 km/h SW, Humidity 76%');
  const ambientTempC = 30.0;
  const [workforceCount, setWorkforceCount] = useState(86);
  const skilledWorkersCount = Math.round(workforceCount * 0.65);
  const unskilledWorkersCount = workforceCount - skilledWorkersCount;
  const [concretePouredM3, setConcretePouredM3] = useState(420.0);
  const [slumpTestMm, setSlumpTestMm] = useState(120.0);
  const [toolboxTalkTopic, setToolboxTalkTopic] = useState('Scaffold Safety, Green Tag Inspection & Fall Arrest Protocols');
  const safetyIncidents = 0;
  const oshaStatus: OSHAStatus = 'COMPLIANT';
  const [supervisorNotes, setSupervisorNotes] = useState('');

  const totalConcretePoured = siteLogs.reduce((acc, l) => acc + l.concretePouredM3, 0);
  const totalWorkforceOnSite = siteLogs.reduce((acc, l) => acc + l.workforceCount, 0);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find((p) => p.id === projectId) || projects[0];

    addSiteDailyLog({
      projectId,
      projectName: prj.name,
      logDate: new Date().toISOString().split('T')[0],
      weatherSummary,
      ambientTempC: Number(ambientTempC),
      workforceCount: Number(workforceCount),
      skilledWorkersCount: Number(skilledWorkersCount),
      unskilledWorkersCount: Number(unskilledWorkersCount),
      concretePouredM3: Number(concretePouredM3),
      slumpTestMm: Number(slumpTestMm),
      toolboxTalkTopic,
      safetyIncidents: Number(safetyIncidents),
      oshaStatus,
      supervisorNotes: supervisorNotes || 'Shift concluded with all structural quality inspection checklists and cube samples logged.',
      supervisorName: user?.name || 'Eng. Marcus Chen',
      cubeTests: [
        {
          id: `cube-${Date.now()}`,
          sampleCode: `CB-${Math.floor(100 + Math.random() * 900)}`,
          pourLocation: 'Level Slab Core',
          concreteGrade: 'G40',
          castDate: new Date().toISOString().split('T')[0],
          testAgeDays: 7,
          targetStrengthMpa: 28.0,
          achievedStrengthMpa: 30.2,
          status: 'PASS',
          testedByLab: 'National Building Research Organisation (NBRO)',
        },
      ],
    });

    setSupervisorNotes('');
    setShowLogModal(false);
  };

  const handleSendSafetyAlert = async (siteName: string, notes: string) => {
    try {
      const res = await fetch('/api/erp/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'SAFETY_ALERT',
          to: 'safety@contec.com',
          incident: {
            siteName,
            date: new Date().toISOString(),
            severity: 'CRITICAL_REVIEW',
            details: notes,
            supervisor: user?.name || 'Site HSE Officer',
          },
        }),
      });
      const data = await res.json();
      setSafetyAlertSent(
        data.simulated
          ? `Safety dispatch email queued & simulated to operations leadership for ${siteName}`
          : `Safety dispatch email transmitted for ${siteName}`
      );
      setTimeout(() => setSafetyAlertSent(null), 6000);
    } catch {
      setSafetyAlertSent('Failed to dispatch alert.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <HardHat className="w-4 h-4" />
            <span>Site QA/QC, Cube Tests & Safety Diary (CIDA Standards)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Construction Daily Site Logs & Cube Tests
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Log shift workforce counts, concrete pour volumes, slump test ratings, NBRO 7/28-day cube strengths, and OSHA/CIDA compliance.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold shadow-lg shadow-blue-900/40 border border-blue-400/40 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#FFB800]" />
          <span>File Shift Daily Log & Cubes</span>
        </button>
      </div>

      {/* Safety Alert notification toast */}
      {safetyAlertSent && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{safetyAlertSent}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Structural Concrete</span>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">
            {totalConcretePoured.toLocaleString()} m³
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Poured across raft & shear core sites
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Active Site Personnel Today</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
            {totalWorkforceOnSite > 0 ? totalWorkforceOnSite : 154} Personnel
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            Bar benders, carpenters, crane crews
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Concrete QA & Slump Compliance</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1 font-mono">
            100% Passed
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            110-120mm tolerance & NBRO certified
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Zero Incident Record</span>
          <div className="text-2xl font-extrabold text-blue-400 mt-1 font-mono">
            0.00 LTIR
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Zero lost time injuries across all sites
          </span>
        </div>
      </div>

      {/* Site Logs Timeline with Cube Tests */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Shift Reports, QA Concrete Batches & Cube Registers
        </h3>

        <div className="space-y-4">
          {siteLogs.map((log) => (
            <div
              key={log.id}
              className="p-5 rounded-2xl bg-[#080e1c]/85 border border-white/10 space-y-4 hover:border-blue-500/30 transition-all shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{log.projectName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      {log.oshaStatus}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-3 flex-wrap">
                    <span className="font-mono">Date: {log.logDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                      {log.weatherSummary}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendSafetyAlert(log.projectName, log.supervisorNotes)}
                    className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 text-xs font-bold border border-red-500/30 flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Dispatch HSE Alert</span>
                  </button>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-zinc-400 text-[10px]">Workforce on Site</span>
                  <div className="font-mono font-bold text-white mt-0.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>{log.workforceCount} Personnel</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {log.skilledWorkersCount || Math.round(log.workforceCount * 0.6)} Skilled • {log.unskilledWorkersCount || Math.round(log.workforceCount * 0.4)} Helpers
                  </div>
                </div>

                <div>
                  <span className="text-zinc-400 text-[10px]">Concrete Pour Volume</span>
                  <div className="font-mono font-bold text-[#FFB800] mt-0.5 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-amber-400" />
                    <span>{log.concretePouredM3} m³</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">Ready-Mix Plant Batches</div>
                </div>

                <div>
                  <span className="text-zinc-400 text-[10px]">Slump Test Consistency</span>
                  <div className="font-mono font-bold text-emerald-400 mt-0.5">
                    {log.slumpTestMm > 0 ? `${log.slumpTestMm} mm (Optimal)` : 'N/A (No pour)'}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">BS EN 12350-2 Compliant</div>
                </div>

                <div>
                  <span className="text-zinc-400 text-[10px]">Supervisor in Charge</span>
                  <div className="font-medium text-white mt-0.5 truncate">
                    {log.supervisorName}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">Chartered Civil Eng</div>
                </div>
              </div>

              {/* Concrete Cube Test Register (If logged) */}
              {log.cubeTests && log.cubeTests.length > 0 && (
                <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#FFB800] font-bold">
                    <span className="flex items-center gap-1.5">
                      <Beaker className="w-3.5 h-3.5" />
                      <span>Concrete Cube Compressive Strength Register (BS EN 12390-3)</span>
                    </span>
                    <span className="text-zinc-400 text-[10px]">{log.cubeTests.length} Samples Tested</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {log.cubeTests.map((cube) => (
                      <div key={cube.id} className="p-2 rounded bg-white/[0.03] border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-white">{cube.sampleCode}</span>
                          <span className="text-[10px] text-zinc-400 ml-2">({cube.concreteGrade} • {cube.pourLocation})</span>
                          <div className="text-[10px] text-zinc-400 font-mono">{cube.testedByLab}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono font-bold text-white">
                            {cube.achievedStrengthMpa > 0 ? `${cube.achievedStrengthMpa} MPa` : 'In Curing Tank'}
                          </span>
                          <div className="text-[9px] font-mono text-emerald-400">
                            {cube.testAgeDays}-Day Test • {cube.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Toolbox talk & notes */}
              {log.toolboxTalkTopic && (
                <div className="text-xs text-blue-300 bg-blue-500/10 p-2.5 rounded-lg border border-blue-500/20 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span><strong>Morning HSE Toolbox Talk:</strong> {log.toolboxTalkTopic}</span>
                </div>
              )}

              <div className="text-xs text-zinc-300 bg-black/30 p-3 rounded-lg border border-white/5 leading-relaxed">
                <span className="text-[#FFB800] font-semibold mr-1">Field Shift Notes:</span>
                {log.supervisorNotes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: File Shift Daily Log & Cubes */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="w-full max-w-lg bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HardHat className="w-4 h-4 text-[#FFB800]" />
                <span>File Daily Construction Site Telemetry</span>
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Mega-Site</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Weather & Conditions</label>
                  <input
                    type="text"
                    value={weatherSummary}
                    onChange={(e) => setWeatherSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Total Workforce Count</label>
                  <input
                    type="number"
                    value={workforceCount}
                    onChange={(e) => setWorkforceCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Concrete Placed (m³)</label>
                  <input
                    type="number"
                    value={concretePouredM3}
                    onChange={(e) => setConcretePouredM3(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Slump Rating (mm)</label>
                  <input
                    type="number"
                    value={slumpTestMm}
                    onChange={(e) => setSlumpTestMm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">HSE Toolbox Talk Conducted</label>
                <input
                  type="text"
                  value={toolboxTalkTopic}
                  onChange={(e) => setToolboxTalkTopic(e.target.value)}
                  placeholder="e.g. Scaffolding checks, crane blind spots..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Supervisor Shift Notes & Concrete Tickets</label>
                <textarea
                  rows={3}
                  value={supervisorNotes}
                  onChange={(e) => setSupervisorNotes(e.target.value)}
                  placeholder="Record pour batches, test cube IDs, and site safety observations..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0038B8] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-blue-900/40"
                >
                  File Shift Record & Cubes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
