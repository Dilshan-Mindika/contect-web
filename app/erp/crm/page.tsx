"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { LeadStage } from '@/lib/erp/types';
import {
  TrendingUp,
  Plus,
  Search,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';

const STAGES: { key: LeadStage; label: string; color: string }[] = [
  { key: 'NEW', label: 'Inbound Inquiry', color: 'border-zinc-500/40 text-zinc-300' },
  { key: 'QUALIFIED', label: 'BIM Feasibility', color: 'border-blue-500/40 text-blue-300' },
  { key: 'PROPOSAL', label: 'Commercial Proposal', color: 'border-purple-500/40 text-purple-300' },
  { key: 'NEGOTIATION', label: 'Contract Negotiation', color: 'border-amber-500/40 text-amber-300' },
  { key: 'WON', label: 'Commissioned (Won)', color: 'border-emerald-500/40 text-emerald-300' },
];

export default function CRMPage() {
  const { leads, updateLeadStage, addLead, user } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(15000000);
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

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
      contactEmail: contactEmail || `procurement@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      phone: phone || '+1 (555) 019-2000',
      assignedTo: user?.name || 'Julian Voss',
      notes: notes || 'New engineering tender opportunity recorded.',
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
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Commercial Business Development & CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Contract Pipeline & Client Deals
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Manage multi-million dollar structural tenders, commercial feasibility, and turnkey awards.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold shadow-lg shadow-blue-900/40 border border-blue-400/40 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#FFB800]" />
          <span>Register New Tender</span>
        </button>
      </div>

      {/* Metrics Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Unweighted Pipeline</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            ${(totalPipeline / 1000000).toFixed(1)}M
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Across {leads.length} active enterprise proposals
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Probability-Weighted Revenue</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            ${(weightedPipeline / 1000000).toFixed(1)}M
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Projected EBITDA forecast
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Awarded Contracts (Won)</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            $
            {(
              leads
                .filter((l) => l.stage === 'WON')
                .reduce((acc, l) => acc + l.estimatedValue, 0) / 1000000
            ).toFixed(1)}
            M
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Successfully transferred to Field Operations
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by developer, typology, or client..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFB800]"
        />
      </div>

      {/* Pipeline Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {STAGES.map((col) => {
          const colLeads = filteredLeads.filter((l) => l.stage === col.key);
          const colValue = colLeads.reduce((acc, l) => acc + l.estimatedValue, 0);

          return (
            <div
              key={col.key}
              className="p-3.5 rounded-2xl bg-[#080e1c]/70 border border-white/10 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-zinc-300">
                    {colLeads.length}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  ${(colValue / 1000000).toFixed(1)}M Total
                </div>

                {/* Cards */}
                <div className="space-y-3 mt-3">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 space-y-2.5 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-xs line-clamp-1">
                          {lead.company}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FFB800]/15 text-[#FFB800] shrink-0 font-bold">
                          {lead.probability}%
                        </span>
                      </div>

                      <p className="text-[11px] text-blue-300 font-medium line-clamp-2">
                        {lead.projectType}
                      </p>

                      <div className="text-sm font-extrabold text-white">
                        ${(lead.estimatedValue / 1000000).toFixed(2)}M
                      </div>

                      <div className="text-[10px] text-zinc-400 space-y-1 pt-1 border-t border-white/5">
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-zinc-400" />
                          <span className="truncate">{lead.contactEmail}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-zinc-400" />
                          <span>{lead.phone}</span>
                        </div>
                      </div>

                      {/* Stage Mover Selector */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400">Advance Stage:</span>
                        <select
                          value={lead.stage}
                          onChange={(e) => updateLeadStage(lead.id, e.target.value as LeadStage)}
                          className="bg-black/60 border border-white/15 text-[10px] rounded px-1.5 py-1 text-white focus:outline-none"
                        >
                          <option value="NEW">New</option>
                          <option value="QUALIFIED">Qualified</option>
                          <option value="PROPOSAL">Proposal</option>
                          <option value="NEGOTIATION">Negotiate</option>
                          <option value="WON">Won ✓</option>
                          <option value="LOST">Lost ✕</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {colLeads.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-zinc-400">
                      No proposals in this phase
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Register New Tender */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091124] border border-white/15 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFB800]" />
                <span>Register Prospective Commercial Tender</span>
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
                  placeholder="e.g. Pacific Trans-Urban Consortium"
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
                  placeholder="e.g. Geothermal Luxury High-Rise"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Estimated Value ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Client Contact Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@corp.com"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
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
                  Commit Tender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

