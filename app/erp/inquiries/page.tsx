"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import ModuleAnalytics from '@/components/erp/ModuleAnalytics';
import {
  Mail,
  Phone,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  Archive,
  Users,
} from 'lucide-react';

export default function ClientInquiriesPage() {
  const { websiteInquiries, updateInquiryStatus } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'CONVERTED_TO_QUOTE' | 'ARCHIVED'>('ALL');

  const filtered = websiteInquiries.filter((inq) => {
    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    const matchesSearch =
      inq.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const newCount = websiteInquiries.filter((i) => i.status === 'NEW').length;
  const contactedCount = websiteInquiries.filter((i) => i.status === 'CONTACTED').length;
  const convertedCount = websiteInquiries.filter((i) => i.status === 'CONVERTED_TO_QUOTE').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-emerald-400" />
            <span>Client Inquiries</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Dedicated MySQL-backed inbox for consultation requests submitted via <span className="text-[#FFB800]">/contact</span>.
          </p>
        </div>
      </div>

      <ModuleAnalytics
        title="Inbound Inquiry Analytics & Reports"
        stats={[
          {
            label: 'Total Inquiries',
            value: websiteInquiries.length,
            subtitle: 'Stored in MySQL website_inquiries',
            accent: 'blue',
            icon: <Mail className="w-4 h-4" />,
          },
          {
            label: 'New / Unread',
            value: newCount,
            subtitle: 'Awaiting initial response',
            accent: 'gold',
            icon: <Clock className="w-4 h-4" />,
          },
          {
            label: 'Contacted',
            value: contactedCount,
            subtitle: 'Active engineering follow-up',
            accent: 'purple',
            icon: <Phone className="w-4 h-4" />,
          },
          {
            label: 'Converted to Quote',
            value: convertedCount,
            subtitle: 'Moved to BOQ & estimation',
            accent: 'emerald',
            icon: <CheckCircle2 className="w-4 h-4" />,
          },
        ]}
        reportFilename="contec-client-inquiries"
        showModeToggle={false}
        reportRows={websiteInquiries.map((q) => ({
          ID: q.id,
          ClientName: q.clientName,
          Email: q.email,
          Phone: q.phone,
          ProjectType: q.projectType,
          BudgetRange: q.budgetRange,
          Status: q.status,
          Date: q.date,
        }))}
      />

      {/* Search & Status Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#080e1c]/80 border border-white/10">
        <div className="relative min-w-[240px] max-w-sm flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email, phone, project..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {(['ALL', 'NEW', 'CONTACTED', 'CONVERTED_TO_QUOTE', 'ARCHIVED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                statusFilter === st
                  ? 'bg-[#0038B8] text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {filtered.map((inq) => (
          <div
            key={inq.id}
            className="p-5 rounded-2xl bg-[#080e1c]/90 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-bold text-white">{inq.clientName}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold">
                  {inq.projectType}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFB800]/15 border border-[#FFB800]/30 text-[#FFB800] font-bold">
                  {inq.budgetRange}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                  {inq.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{inq.message}</p>
              <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-3 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-blue-400" />
                  {inq.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#FFB800]" />
                  {inq.phone}
                </span>
                <span>Received: {inq.date}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href={`tel:${inq.phone}`}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Call</span>
              </a>
              <select
                value={inq.status}
                onChange={(e) => updateInquiryStatus(inq.id, e.target.value as typeof inq.status)}
                className="px-3 py-1.5 rounded-xl bg-[#050811] border border-white/15 text-xs text-white font-semibold focus:outline-none focus:border-[#FFB800] cursor-pointer"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="CONVERTED_TO_QUOTE">CONVERTED TO QUOTE</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-10 rounded-2xl bg-[#080e1c]/60 border border-white/10 text-center text-xs text-zinc-400">
            No client inquiries match your current search or filter.
          </div>
        )}
      </div>
    </div>
  );
}
