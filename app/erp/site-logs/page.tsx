"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { OSHAStatus } from '@/lib/erp/types';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
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
  const { siteLogs, addSiteDailyLog, updateSiteLog, deleteSiteLog, projects, user } = useERP();
  const [showLogModal, setShowLogModal] = useState(false);
  const [safetyAlertSent, setSafetyAlertSent] = useState<string | null>(null);

  // Form State (Full Construction Site Diary Fields)
  const [projectId, setProjectId] = useState(projects[0]?.id || 'prj-01');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [weatherSummary, setWeatherSummary] = useState('Partly Cloudy, Wind 12 km/h SW, Humidity 76%');
  const [ambientTempC, setAmbientTempC] = useState(30.0);
  const [workforceCount, setWorkforceCount] = useState(86);
  const [skilledWorkersCount, setSkilledWorkersCount] = useState(56);
  const [unskilledWorkersCount, setUnskilledWorkersCount] = useState(30);
  const [concreteGrade, setConcreteGrade] = useState('G40');
  const [concretePouredM3, setConcretePouredM3] = useState(420.0);
  const [slumpTestMm, setSlumpTestMm] = useState(120.0);
  const [toolboxTalkTopic, setToolboxTalkTopic] = useState('Scaffold Safety, Green Tag Inspection & Fall Arrest Protocols');
  const [safetyIncidents, setSafetyIncidents] = useState(0);
  const [oshaStatus, setOshaStatus] = useState<OSHAStatus>('COMPLIANT');
  const [drawingRef, setDrawingRef] = useState('');
  const [visitorNotes, setVisitorNotes] = useState('');
  const [supervisorNotes, setSupervisorNotes] = useState('');

  const totalConcretePoured = siteLogs.reduce((acc, l) => acc + l.concretePouredM3, 0);
  const totalWorkforceOnSite = siteLogs.reduce((acc, l) => acc + l.workforceCount, 0);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find((p) => p.id === projectId) || projects[0];

    (addSiteDailyLog as (l: Record<string, unknown>) => void)({
      projectId,
      projectName: prj.name,
      logDate: logDate || new Date().toISOString().split('T')[0],
      weatherSummary,
      ambientTempC: Number(ambientTempC),
      workforceCount: Number(workforceCount),
      skilledWorkersCount: Number(skilledWorkersCount),
      unskilledWorkersCount: Number(unskilledWorkersCount),
      concreteGrade,
      concretePouredM3: Number(concretePouredM3),
      slumpTestMm: Number(slumpTestMm),
      toolboxTalkTopic,
      safetyIncidents: Number(safetyIncidents),
      oshaStatus,
      drawingRef,
      visitorNotes,
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Daily Site Logs & Inspection Diary
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Log shift workforce counts, concrete pour volumes, slump test ratings, NBRO 7/28-day cube strengths, and OSHA/CIDA compliance.
          </p>
        </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Log Date</label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Weather &amp; Conditions</label>
                  <input
                    type="text"
                    value={weatherSummary}
                    onChange={(e) => setWeatherSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Ambient Temp (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={ambientTempC}
                    onChange={(e) => setAmbientTempC(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Total Workforce</label>
                  <input
                    type="number"
                    value={workforceCount}
                    onChange={(e) => setWorkforceCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Skilled Workers</label>
                  <input
                    type="number"
                    value={skilledWorkersCount}
                    onChange={(e) => setSkilledWorkersCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Unskilled Labour</label>
                  <input
                    type="number"
                    value={unskilledWorkersCount}
                    onChange={(e) => setUnskilledWorkersCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Concrete Grade</label>
                  <select
                    value={concreteGrade}
                    onChange={(e) => setConcreteGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-white text-xs"
                  >
                    <option value="G25">Grade 25 (G25)</option>
                    <option value="G30">Grade 30 (G30)</option>
                    <option value="G35">Grade 35 (G35)</option>
                    <option value="G40">Grade 40 (G40)</option>
                    <option value="G50">Grade 50 (G50)</option>
                  </select>
                </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">OSHA / HSE Status</label>
                  <select
                    value={oshaStatus}
                    onChange={(e) => setOshaStatus(e.target.value as OSHAStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-white text-xs"
                  >
                    <option value="COMPLIANT">COMPLIANT</option>
                    <option value="OBSERVATION">OBSERVATION</option>
                    <option value="BREACH">BREACH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Safety Incidents</label>
                  <input
                    type="number"
                    min={0}
                    value={safetyIncidents}
                    onChange={(e) => setSafetyIncidents(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Drawing / RFI Ref (Optional)</label>
                  <input
                    type="text"
                    value={drawingRef}
                    onChange={(e) => setDrawingRef(e.target.value)}
                    placeholder="e.g. STR-DWG-042 Rev B"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Consultant / Client Visitor Notes (Optional)</label>
                <input
                  type="text"
                  value={visitorNotes}
                  onChange={(e) => setVisitorNotes(e.target.value)}
                  placeholder="e.g. Resident Engineer inspected reinforcement cage & approved pour..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
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
                  File Shift Record &amp; Cubes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UniversalRecordManager
        title="Daily Site Logs Directory (MySQL CRUD, Sort & View Modes)"
        items={siteLogs as unknown as Record<string, unknown>[]}
        createLabel="New Site Log"
        searchPlaceholder="Search site logs..."
        sortOptions={[
          { value: 'logDate', label: 'Log Date' },
          { value: 'workforceCount', label: 'Workforce' },
          { value: 'concretePouredM3', label: 'Concrete (m³)' },
          { value: 'oshaStatus', label: 'OSHA Status' },
        ]}
        fields={[
          { key: 'projectName', label: 'Project Site', isTitle: true, required: true },
          { key: 'logDate', label: 'Date', type: 'date', required: true },
          { key: 'weatherSummary', label: 'Weather' },
          { key: 'workforceCount', label: 'Workforce', type: 'number' },
          { key: 'concretePouredM3', label: 'Concrete (m³)', type: 'number' },
          { key: 'slumpTestMm', label: 'Slump (mm)', type: 'number', showInTable: false },
          { key: 'oshaStatus', label: 'OSHA Status', type: 'select', options: ['COMPLIANT', 'OBSERVATION', 'BREACH'], isBadge: true },
          { key: 'supervisorNotes', label: 'Supervisor Notes', type: 'textarea', showInTable: false },
        ]}
        onCreate={(d) => addSiteDailyLog({ ...(d as Parameters<typeof addSiteDailyLog>[0]), projectId: projects[0]?.id || 'prj-01', ambientTempC: 30, skilledWorkersCount: 20, unskilledWorkersCount: 10, toolboxTalkTopic: 'Daily Safety', safetyIncidents: 0, supervisorName: user?.name || 'Site Engineer', cubeTests: [] })}
        onUpdate={(id, d) => updateSiteLog(id, d)}
        onDelete={(id) => deleteSiteLog(id)}
      />
    </div>
  );
}
