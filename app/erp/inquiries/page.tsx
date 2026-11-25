"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { WebsiteInquiry } from '@/lib/erp/types';
import ModuleAnalytics from '@/components/erp/ModuleAnalytics';
import DataViewToolbar, { ViewMode } from '@/components/erp/DataViewToolbar';
import {
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Users,
  Eye,
  Edit3,
  Trash2,
  X,
  Check,
} from 'lucide-react';

export default function ClientInquiriesPage() {
  const { websiteInquiries, addInquiry, updateInquiry, deleteInquiry, updateInquiryStatus } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'CONVERTED_TO_QUOTE' | 'ARCHIVED'>('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');

  const [viewingInquiry, setViewingInquiry] = useState<WebsiteInquiry | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<WebsiteInquiry | null>(null);
  const [formState, setFormState] = useState({
    clientName: '',
    email: '',
    phone: '',
    projectType: 'Hillside Villa',
    budgetRange: 'LKR 100M - 200M',
    message: '',
    status: 'NEW' as WebsiteInquiry['status'],
  });

  const handleOpenCreate = () => {
    setEditingInquiry(null);
    setFormState({
      clientName: '',
      email: '',
      phone: '',
      projectType: 'Hillside Villa',
      budgetRange: 'LKR 100M - 200M',
      message: '',
      status: 'NEW',
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (inq: WebsiteInquiry) => {
    setEditingInquiry(inq);
    setFormState({
      clientName: inq.clientName,
      email: inq.email,
      phone: inq.phone,
      projectType: inq.projectType,
      budgetRange: inq.budgetRange,
      message: inq.message,
      status: inq.status,
    });
    setShowFormModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.clientName) return;
    if (editingInquiry) {
      updateInquiry(editingInquiry.id, formState);
    } else {
      addInquiry(formState);
    }
    setShowFormModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this client inquiry permanently from MySQL?')) {
      deleteInquiry(id);
    }
  };

  const filtered = websiteInquiries
    .filter((inq) => {
      const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
      const matchesSearch =
        inq.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.phone.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'clientName') return a.clientName.localeCompare(b.clientName) * mul;
      if (sortBy === 'status') return a.status.localeCompare(b.status) * mul;
      return a.date.localeCompare(b.date) * mul;
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
            Full Create, View, Edit &amp; Delete management for consultation requests in MySQL.
          </p>
        </div>
      </div>

      <ModuleAnalytics
        title="Inbound Inquiry Analytics"
        showModeToggle={false}
        stats={[
          { label: 'Total Inquiries', value: websiteInquiries.length, subtitle: 'Stored in MySQL', accent: 'blue', icon: <Mail className="w-4 h-4" /> },
          { label: 'New / Unread', value: newCount, subtitle: 'Awaiting response', accent: 'gold', icon: <Clock className="w-4 h-4" /> },
          { label: 'Contacted', value: contactedCount, subtitle: 'Active follow-up', accent: 'purple', icon: <Phone className="w-4 h-4" /> },
          { label: 'Converted to Quote', value: convertedCount, subtitle: 'Moved to BOQ', accent: 'emerald', icon: <CheckCircle2 className="w-4 h-4" /> },
        ]}
        reportFilename="contec-client-inquiries"
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

      {/* Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        {(['ALL', 'NEW', 'CONTACTED', 'CONVERTED_TO_QUOTE', 'ARCHIVED'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
              statusFilter === st ? 'bg-[#0038B8] text-white' : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            {st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <DataViewToolbar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search inquiries by client, email, phone..."
        sortOptions={[
          { value: 'date', label: 'Date Received' },
          { value: 'clientName', label: 'Client Name' },
          { value: 'status', label: 'Status' },
        ]}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDir={sortDir}
        onSortDirToggle={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={websiteInquiries.length}
        filteredCount={filtered.length}
        onCreateClick={handleOpenCreate}
        createLabel="New Inquiry"
      />

      {/* DETAILED TABLE VIEW */}
      {viewMode === 'DETAILED' ? (
        <div className="rounded-2xl bg-[#080e1c]/90 border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-[10px] uppercase text-zinc-400">
              <tr>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Project Type</th>
                <th className="p-3.5">Budget</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((inq) => (
                <tr key={inq.id} className="hover:bg-white/[0.03]">
                  <td className="p-3.5 font-bold text-white">{inq.clientName}</td>
                  <td className="p-3.5 text-blue-300">{inq.projectType}</td>
                  <td className="p-3.5 text-[#FFB800] font-semibold">{inq.budgetRange}</td>
                  <td className="p-3.5 text-zinc-400">{inq.phone} • {inq.email}</td>
                  <td className="p-3.5">
                    <select
                      value={inq.status}
                      onChange={(e) => updateInquiryStatus(inq.id, e.target.value as WebsiteInquiry['status'])}
                      className="px-2 py-1 rounded-lg bg-[#050811] border border-white/15 text-[11px] text-white"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="CONVERTED_TO_QUOTE">QUOTED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-zinc-400">{inq.date}</td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => setViewingInquiry(inq)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 cursor-pointer" title="View"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleOpenEdit(inq)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-blue-400 cursor-pointer" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(inq.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={
            viewMode === 'TILE'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'
              : viewMode === 'COMPACT'
              ? 'space-y-2'
              : 'grid grid-cols-1 lg:grid-cols-2 gap-4'
          }
        >
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className={`rounded-2xl bg-[#080e1c]/90 border border-white/10 hover:border-blue-500/30 transition-all flex ${
                viewMode === 'COMPACT' ? 'p-3 items-center justify-between gap-3' : 'p-4 flex-col justify-between gap-3'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white truncate">{inq.clientName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold">
                    {inq.projectType}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold">
                    {inq.status}
                  </span>
                </div>
                {viewMode !== 'COMPACT' && (
                  <p className="text-xs text-zinc-400 line-clamp-2">{inq.message}</p>
                )}
                <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-2">
                  <span className="text-[#FFB800] font-semibold">{inq.budgetRange}</span>
                  <span>•</span>
                  <span>{inq.phone}</span>
                  <span>•</span>
                  <span>{inq.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 shrink-0">
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewingInquiry(inq)} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                    <Eye className="w-3 h-3 text-emerald-400" />
                    <span>View</span>
                  </button>
                  <button onClick={() => handleOpenEdit(inq)} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                    <Edit3 className="w-3 h-3 text-blue-400" />
                    <span>Edit</span>
                  </button>
                </div>
                <button onClick={() => handleDelete(inq.id)} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW DETAIL MODAL */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">{viewingInquiry.clientName}</h3>
              <button onClick={() => setViewingInquiry(null)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5"><span className="text-zinc-400 block text-[10px]">Email</span><strong className="text-white">{viewingInquiry.email}</strong></div>
              <div className="p-3 rounded-xl bg-white/5"><span className="text-zinc-400 block text-[10px]">Phone</span><strong className="text-white">{viewingInquiry.phone}</strong></div>
              <div className="p-3 rounded-xl bg-white/5"><span className="text-zinc-400 block text-[10px]">Project Type</span><strong className="text-blue-300">{viewingInquiry.projectType}</strong></div>
              <div className="p-3 rounded-xl bg-white/5"><span className="text-zinc-400 block text-[10px]">Budget</span><strong className="text-[#FFB800]">{viewingInquiry.budgetRange}</strong></div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 text-xs text-zinc-200 leading-relaxed">{viewingInquiry.message}</div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setViewingInquiry(null); handleOpenEdit(viewingInquiry); }} className="px-4 py-2 rounded-xl bg-[#0038B8] text-white text-xs font-bold cursor-pointer">Edit Inquiry</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">{editingInquiry ? 'Edit Client Inquiry' : 'Create Client Inquiry'}</h3>
              <button onClick={() => setShowFormModal(false)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Client Name *</label>
                  <input type="text" required value={formState.clientName} onChange={(e) => setFormState({ ...formState, clientName: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white" />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Phone</label>
                  <input type="text" value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Email</label>
                  <input type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white" />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Status</label>
                  <select value={formState.status} onChange={(e) => setFormState({ ...formState, status: e.target.value as WebsiteInquiry['status'] })} className="w-full px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-white">
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="CONVERTED_TO_QUOTE">CONVERTED TO QUOTE</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Project Type</label>
                  <input type="text" value={formState.projectType} onChange={(e) => setFormState({ ...formState, projectType: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white" />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Budget Range</label>
                  <input type="text" value={formState.budgetRange} onChange={(e) => setFormState({ ...formState, budgetRange: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white" />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Inquiry Notes</label>
                <textarea rows={3} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0038B8] text-white font-bold flex items-center gap-1 cursor-pointer"><Check className="w-4 h-4" /> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
