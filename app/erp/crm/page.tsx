"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { LeadStage } from '@/lib/erp/types';
import { formatLKR } from '@/lib/erp/currency';
import ModuleAnalytics from '@/components/erp/ModuleAnalytics';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import {
  TrendingUp,
  Plus,
  Search,
  Mail,
  Phone,
  Sparkles,
  Award,
} from 'lucide-react';

const STAGES: { key: LeadStage; label: string; color: string }[] = [
  { key: 'NEW', label: 'Inbound Inquiry', color: 'border-zinc-500/40 text-zinc-300' },
  { key: 'QUALIFIED', label: 'BIM Feasibility', color: 'border-blue-500/40 text-blue-300' },
  { key: 'PROPOSAL', label: 'Commercial BOQ', color: 'border-purple-500/40 text-purple-300' },
  { key: 'NEGOTIATION', label: 'Contract Negotiation', color: 'border-amber-500/40 text-amber-300' },
  { key: 'WON', label: 'Awarded / Won', color: 'border-emerald-500/40 text-emerald-300' },
];

export default function CRMPage() {
  const { leads, updateLeadStage, addLead, user } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State in LKR
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(1850000000); // LKR 1.85 Billion default
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [cidaCategory, setCidaCategory] = useState('Building & Civil (CIDA CS2)');

  const filteredLeads = leads.filter(
    (l) =>
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPipeline = leads.reduce((acc, l) => acc + l.estimatedValue, 0);
  const weightedPipeline = leads.reduce(
    (acc, l) => acc + (l.estimatedValue * l.probability) / 100,
    0
  );

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !projectType) return;
    addLead({
      clientName: clientName || company,
      company,
      projectType,
      estimatedValue: Number(estimatedValue),
      stage: 'NEW',
      probability: 30,
      contactEmail: contactEmail || `tenders@${company.toLowerCase().replace(/[^a-z]/g, '')}.lk`,
      phone: phone || '+94 11 234 5678',
      assignedTo: user?.name || 'Tharindu Fernando (Commercial Director)',
      notes: notes || 'New engineering tender opportunity recorded in CRM pipeline.',
      cidaCategory,
      tenderDeadline: '2026-11-30',
    });
    setClientName('');
    setCompany('');
    setProjectType('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Client Inquiries & CRM Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Manage multi-billion rupee infrastructure tenders, CIDA CS2 feasibility assessments, and turnkey project awards.
          </p>
        </div>
      </div>

      {/* Stat Boxes, Graph View & CSV/Print Reports */}
      <ModuleAnalytics
        title="CRM Pipeline & Tender Analytics"
        stats={[
          {
            label: 'Unweighted Pipeline',
            value: formatLKR(totalPipeline, true),
            subtitle: `${leads.length} active proposals`,
            accent: 'blue',
            icon: <TrendingUp className="w-4 h-4" />,
          },
          {
            label: 'Weighted Forecast',
            value: formatLKR(weightedPipeline, true),
            subtitle: 'Probability-adjusted LKR',
            accent: 'emerald',
            icon: <Sparkles className="w-4 h-4" />,
          },
          {
            label: 'Awarded Contracts',
            value: formatLKR(leads.filter((l) => l.stage === 'WON').reduce((a, l) => a + l.estimatedValue, 0), true),
            subtitle: `${leads.filter((l) => l.stage === 'WON').length} won tenders`,
            accent: 'gold',
            icon: <Award className="w-4 h-4" />,
          },
          {
            label: 'Active Tender Stages',
            value: STAGES.length,
            subtitle: 'Inquiry to Contract Award',
            accent: 'purple',
            icon: <Search className="w-4 h-4" />,
          },
        ]}
        reportFilename="contec-crm-pipeline"
        showModeToggle={false}
        reportRows={leads.map((l) => ({
          Company: l.company,
          Client: l.clientName,
          ProjectType: l.projectType,
          Stage: l.stage,
          ProbabilityPct: l.probability,
          EstimatedValueLKR: l.estimatedValue,
          AssignedTo: l.assignedTo,
        }))}
      />

      {/* Metrics Header Cards in LKR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Unweighted Pipeline</span>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">
            {formatLKR(totalPipeline, true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Across {leads.length} active enterprise proposals
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Probability-Weighted Forecast</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
            {formatLKR(weightedPipeline, true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Weighted conversion projection in LKR
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Awarded Contracts (Won)</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1 font-mono">
            {formatLKR(
              leads
                .filter((l) => l.stage === 'WON')
                .reduce((acc, l) => acc + l.estimatedValue, 0),
              true
            )}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Transferred to Field Site Operations
          </span>
        </div>
      </div>

      {/* Modal: Register New Tender in LKR */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091124] border border-white/15 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFB800]" />
                <span>Register Prospective Commercial Tender (LKR)</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Company / Developer Entity</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Port City Luxury Developments PLC"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Project Scope & Typology</label>
                <input
                  type="text"
                  required
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="e.g. 36-Story High-Rise Ocean Suites & Marina"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Estimated Tender Value (LKR)</label>
                  <input
                    type="number"
                    required
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800] font-mono"
                  />
                  <span className="text-[10px] text-[#FFB800] font-mono mt-0.5 block">
                    {formatLKR(estimatedValue)}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">CIDA Category</label>
                  <input
                    type="text"
                    value={cidaCategory}
                    onChange={(e) => setCidaCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Corporate Tender Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="tenders@developer.lk"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 11 200 0000"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0038B8] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-blue-900/40"
                >
                  Commit Tender to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UniversalRecordManager
        title="CRM Tender Directory (Create, View, Edit, Delete & View Modes)"
        items={leads as unknown as Record<string, unknown>[]}
        createLabel="New Tender Lead"
        searchPlaceholder="Search CRM tenders..."
        sortOptions={[
          { value: 'company', label: 'Company' },
          { value: 'estimatedValue', label: 'Contract Value' },
          { value: 'probability', label: 'Win Probability' },
          { value: 'stage', label: 'Stage' },
        ]}
        fields={[
          { key: 'company', label: 'Company / Authority', isTitle: true, required: true },
          { key: 'clientName', label: 'Contact Person', required: true },
          { key: 'projectType', label: 'Project Scope', required: true },
          { key: 'estimatedValue', label: 'Value (LKR)', type: 'number', isCurrency: true },
          { key: 'stage', label: 'Stage', type: 'select', options: ['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON'], isBadge: true },
          { key: 'probability', label: 'Win %', type: 'number' },
          { key: 'contactEmail', label: 'Email', showInTable: false, optional: true },
          { key: 'phone', label: 'Phone', showInTable: false, optional: true },
          { key: 'cidaCategory', label: 'CIDA Grade Required', type: 'select', options: ['CS2', 'CS1', 'C1', 'C2', 'C3', 'EM1'], showInTable: false, optional: true },
          { key: 'tenderDeadline', label: 'Tender Submission Deadline', type: 'date', showInTable: false, optional: true },
          { key: 'bidBondLkr', label: 'Bid Bond Required (LKR)', type: 'number', isCurrency: true, showInTable: false, optional: true },
          { key: 'tenderSource', label: 'Lead / Tender Source', type: 'select', options: ['PRIVATE_RFP', 'GOV_GAZETTE', 'ARCHITECT_REFERRAL', 'WEBSITE_INQUIRY'], showInTable: false, optional: true },
          { key: 'siteLocation', label: 'Site Location', showInTable: false, optional: true },
          { key: 'notes', label: 'Engineering & Competitor Notes', type: 'textarea', showInTable: false, optional: true },
          { key: 'images', label: 'Site Visit & Concept Photos', type: 'images', showInTable: false, optional: true },
        ]}
        onCreate={(d) => addLead({ ...(d as Parameters<typeof addLead>[0]), stage: (d.stage as LeadStage) || 'NEW', probability: Number(d.probability || 30), assignedTo: user?.name || 'Director' })}
      />
    </div>
  );
}
