"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import CustomSelect from '@/components/erp/CustomSelect';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Users,
  HardHat,
  Award,
  Building2,
  FileText,
} from 'lucide-react';

export default function HealthSafetyPage() {
  const {
    safetyInspections,
    ppeRecords,
    safetyIncidents,
    addSafetyInspection,
    addSafetyIncident,
    activeCompany,
    projects,
    companies,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'INSPECTIONS' | 'PPE' | 'INCIDENTS' | 'TOOLBOX' | 'INSURANCE'>('INSPECTIONS');
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  // Incident form
  const [incSeverity, setIncSeverity] = useState<'NEAR_MISS' | 'FIRST_AID' | 'MEDICAL_TREATMENT' | 'LOST_TIME_INJURY_LTIR'>('NEAR_MISS');
  const [incLocation, setIncLocation] = useState('Core Shear Wall Formwork Deck Level 3');
  const [incDesc, setIncDesc] = useState('Scaffold toe-board dislodged by wind; fell into catch net without contact.');
  const [incRootCause, setIncRootCause] = useState('Missing secondary locking pin on toe-board clamp.');
  const [incAction, setIncAction] = useState('Immediate stand-down for perimeter check and clamp replacement.');

  const filteredInspections = safetyInspections.filter(
    (si) => activeCompany === 'CONSOLIDATED' || si.companyId === activeCompany
  );

  const filteredPpe = ppeRecords.filter(
    (p) => activeCompany === 'CONSOLIDATED' || p.companyId === activeCompany
  );

  const filteredIncidents = safetyIncidents.filter(
    (inc) => activeCompany === 'CONSOLIDATED' || inc.companyId === activeCompany
  );

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    addSafetyIncident({
      companyId: activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany,
      projectId: projects[0]?.id || 'prj-01',
      projectCode: projects[0]?.code || 'CNT-PRJ-241',
      incidentDate: new Date().toISOString().split('T')[0],
      severity: incSeverity,
      location: incLocation,
      description: incDesc,
      rootCause: incRootCause,
      immediateCorrectiveAction: incAction,
      managementNotified: true,
    });
    setShowIncidentModal(false);
  };

  const currentComp = companies.find((c) => c.id === activeCompany);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Site Safety & Quality Compliance
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            OSHA and Sri Lanka Factories Ordinance compliance, green-tag scaffolding audits, PPE issuance registers, and LTIR monitoring for {activeCompany === 'CONSOLIDATED' ? 'All Companies' : currentComp?.tradeName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIncidentModal(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-300 text-xs font-bold border border-red-500/30 flex items-center gap-2 transition-all"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Report HSE Incident</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Lost Time Injury Rate (LTIR)</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            0.00 LTIR
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            1,480,000 Safe Man-Hours Worked
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Average Safety Audit Score</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            96.5% Score
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Green-Tag Scaffolding Standard
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">PPE Mandatory Compliance</span>
          <div className="text-2xl font-extrabold text-blue-300 mt-1">
            98.5% Checked
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Helmets, Boots, Vests, Harnesses
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Toolbox Briefing Frequency</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            Daily 100%
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Conducted Every Morning Shift
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {[
          { key: 'INSPECTIONS', label: '01. Safety Inspections & Green Tags', icon: ShieldCheck },
          { key: 'PPE', label: '02. PPE Issuing Register', icon: HardHat },
          { key: 'INCIDENTS', label: '03. Incident & Accident Logbook', icon: AlertTriangle },
          { key: 'TOOLBOX', label: '04. Daily Safety Toolbox Talks', icon: Users },
          { key: 'INSURANCE', label: '05. Workmen\'s Compensation Insurance', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
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

      {/* TAB 1: SAFETY INSPECTIONS */}
      {activeTab === 'INSPECTIONS' && (
        <div className="space-y-4">
          <UniversalRecordManager
            title="HSE Inspections Directory (Create, View, Edit, Delete & View Modes)"
            items={safetyInspections as unknown as Record<string, unknown>[]}
            createLabel="New HSE Inspection"
            searchPlaceholder="Search inspections by site, inspector..."
            sortOptions={[
              { value: 'projectCode', label: 'Project Code' },
              { value: 'scorePct', label: 'Safety Score %' },
              { value: 'status', label: 'Status' },
            ]}
            fields={[
              { key: 'projectCode', label: 'Project Code', isTitle: true, required: true },
              { key: 'inspectorName', label: 'Inspector', required: true },
              { key: 'inspectionDate', label: 'Date', type: 'date' },
              { key: 'scorePct', label: 'Score (%)', type: 'number' },
              { key: 'scaffoldingStatus', label: 'Scaffolding Green-Tag Status', type: 'select', options: ['GREEN_TAG_VERIFIED', 'INSPECTION_DUE', 'RED_TAG_LOCKED'], showInTable: false, optional: true },
              { key: 'electricalEarthingStatus', label: 'Electrical Earthing & RCD', showInTable: false, optional: true },
              { key: 'excavationShoringStatus', label: 'Excavation & Shoring Stability', showInTable: false, optional: true },
              { key: 'ppeCompliancePct', label: 'PPE Compliance (%)', type: 'number', showInTable: false, optional: true },
              { key: 'permitToWorkRef', label: 'Permit-to-Work (PTW) Ref #', showInTable: false, optional: true },
              { key: 'correctiveDueDate', label: 'Corrective Action Deadline', type: 'date', showInTable: false, optional: true },
              { key: 'status', label: 'Status', type: 'select', options: ['PASS', 'CONDITIONAL', 'FAIL'], isBadge: true },
              { key: 'findings', label: 'Findings & Action Plan', type: 'textarea', showInTable: false, optional: true },
              { key: 'images', label: 'HSE Audit & Green-Tag Photos', type: 'images', showInTable: false, optional: true },
            ]}
          />
        </div>
      )}

      {/* TAB 2: PPE REGISTER */}
      {activeTab === 'PPE' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#080e1c] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5 text-zinc-400 border-b border-white/10 font-mono">
                  <tr>
                    <th className="p-3">Worker Name</th>
                    <th className="p-3">Trade Craft</th>
                    <th className="p-3">PPE Equipment Type</th>
                    <th className="p-3">Serial / Tag No</th>
                    <th className="p-3">Date Issued</th>
                    <th className="p-3">Worker Signed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredPpe.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-sans font-bold text-white">{p.workerName}</td>
                      <td className="p-3 text-zinc-300">{p.trade}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-bold">
                          {p.itemType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-white font-bold">{p.serialOrTagNo}</td>
                      <td className="p-3 text-zinc-400">{p.issueDate}</td>
                      <td className="p-3 text-emerald-400 font-sans font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Acknowledged</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INCIDENTS */}
      {activeTab === 'INCIDENTS' && (
        <div className="space-y-4">
          {filteredIncidents.map((inc) => (
            <div key={inc.id} className="p-5 rounded-2xl bg-[#080e1c] border border-red-500/20 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    SEVERITY: {inc.severity}
                  </span>
                  <span className="font-bold text-white text-sm">{inc.projectCode}</span>
                  <span className="text-xs text-zinc-400 font-mono">({inc.incidentDate})</span>
                </div>
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Management Notified</span>
                </span>
              </div>

              <div className="text-xs text-zinc-300">
                <strong>Location:</strong> {inc.location}
              </div>
              <p className="text-xs text-zinc-300 bg-black/40 p-3 rounded-xl border border-white/5">
                {inc.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Root Cause Analysis</span>
                  <span className="text-zinc-200 mt-0.5 block">{inc.rootCause}</span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-[10px] font-mono text-emerald-400 block uppercase">Immediate Corrective Action</span>
                  <span className="text-emerald-200 mt-0.5 block">{inc.immediateCorrectiveAction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: TOOLBOX TALKS */}
      {activeTab === 'TOOLBOX' && (
        <div className="p-6 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-base">Daily Morning HSE Toolbox Talk Register</h3>
          <p className="text-xs text-zinc-400">
            Conducted by Site Safety Officers before work starts every shift across all active sites.
          </p>
          <div className="space-y-2.5 text-xs">
            {[
              { topic: 'Scaffolding Safety, Green Tag Inspection & Fall Arrest Protocols', date: '2026-10-28', attendees: 86, trainer: 'S. Ratnayake (HSE)' },
              { topic: 'Hot Works & Electrical Arc Welding Hazard Mitigation', date: '2026-10-27', attendees: 54, trainer: 'Eng. Marcus Chen' },
              { topic: 'Crane Tagline Clearance & Exclusion Zone Enforcement', date: '2026-10-26', attendees: 92, trainer: 'Plant Safety Officer' },
            ].map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <div className="font-bold text-white text-sm">{t.topic}</div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Conducted by: {t.trainer} • {t.attendees} Personnel Attended</div>
                </div>
                <span className="text-xs font-mono text-blue-300 font-bold">{t.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INSURANCE */}
      {activeTab === 'INSURANCE' && (
        <div className="p-6 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-base">Workmen's Compensation & Contractor's All Risks (CAR)</h3>
          <p className="text-xs text-zinc-400">
            Comprehensive statutory policies underwritten by Sri Lanka Insurance Corporation (SLIC) covering all engineering workforce and third-party liabilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs font-mono">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-zinc-400 text-[10px] uppercase">Workmen's Compensation Policy</span>
              <div className="text-base font-bold text-white">Policy #SLIC-WC-2026-0814</div>
              <div className="text-emerald-400">Coverage: LKR 500,000,000 • Valid to 2027-06-30</div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-zinc-400 text-[10px] uppercase">Contractor's All Risks (CAR) Policy</span>
              <div className="text-base font-bold text-white">Policy #SLIC-CAR-2026-4412</div>
              <div className="text-emerald-400">Coverage: LKR 10,000,000,000 • Valid to 2028-12-31</div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT INCIDENT MODAL */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>File HSE Incident Report</span>
              </h3>
              <button onClick={() => setShowIncidentModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateIncident} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Severity Classification</label>
                <CustomSelect
                  value={incSeverity}
                  onChange={(val) => setIncSeverity(val as typeof incSeverity)}
                  options={[
                    { value: 'NEAR_MISS', label: 'Near Miss (No Injury / Property Safe)' },
                    { value: 'FIRST_AID', label: 'First Aid Treatment' },
                    { value: 'MEDICAL_TREATMENT', label: 'Medical Treatment Case (MTC)' },
                    { value: 'LOST_TIME_INJURY_LTIR', label: 'Lost Time Injury (LTIR)' },
                  ]}
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Exact Site Location</label>
                <input
                  type="text"
                  value={incLocation}
                  onChange={(e) => setIncLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Incident Description</label>
                <textarea
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white resize-none"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Root Cause</label>
                <input
                  type="text"
                  value={incRootCause}
                  onChange={(e) => setIncRootCause(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Immediate Corrective Action</label>
                <input
                  type="text"
                  value={incAction}
                  onChange={(e) => setIncAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Broadcast HSE Alert &amp; Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
