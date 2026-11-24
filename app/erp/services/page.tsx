"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  DEFAULT_SERVICES,
  PublicService,
  savePublicServices,
} from '@/lib/publicData';
import ModuleAnalytics from '@/components/erp/ModuleAnalytics';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Download,
  Search,
  Check,
  X,
  CheckCircle2,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export default function WebsiteServicesManagerPage() {
  const [publicServices, setPublicServices] = useState<PublicService[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<PublicService | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<PublicService>>({
    badge: 'STAGE 01',
    title: '',
    desc: '',
    image: '/images/hero-main.jpg',
    features: ['Professional consultation', 'Council approvals', 'Guaranteed fixed BOQ'],
    startingPrice: 'From LKR 4,500/sqft',
    timeline: '3 - 8 Months',
    cidaStandard: 'CIDA CS-2 / SLS 107',
    warranty: '20-Year Structural Guarantee',
    featured: true,
  });

  useEffect(() => {
    async function loadFromDb() {
      try {
        const res = await fetch('/api/erp/public-content');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.services)) {
            setPublicServices(data.services);
            savePublicServices(data.services);
          }
        }
      } catch {
        // Fallback already in state
      } finally {
        setLoading(false);
      }
    }
    loadFromDb();
  }, []);

  const persistService = async (serv: PublicService, order = 0) => {
    setSaving(true);
    try {
      const res = await fetch('/api/erp/public-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'SERVICE', item: serv, order }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.services) {
          setPublicServices(data.services);
          savePublicServices(data.services);
        }
      }
    } catch {
      // Fallback
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setServiceForm({
      badge: `STAGE 0${publicServices.length + 1}`,
      title: '',
      desc: '',
      image: '/images/hero-main.jpg',
      features: ['Professional consultation', 'Council approvals', 'Guaranteed fixed BOQ', '1-year free maintenance'],
      startingPrice: 'From LKR 4,500/sqft',
      timeline: '3 - 8 Months',
      cidaStandard: 'CIDA CS-2 / SLS 107',
      warranty: '20-Year Structural Guarantee',
      featured: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: PublicService) => {
    setEditingService(s);
    setServiceForm({
      ...s,
      features: s.features?.length ? s.features : ['Chartered architectural design'],
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title) return;
    const cleanFeatures = (serviceForm.features || []).filter((f) => f.trim().length > 0);
    const idx = editingService
      ? publicServices.findIndex((s) => s.id === editingService.id)
      : publicServices.length;

    const item: PublicService = {
      id: editingService ? editingService.id : `serv-${Date.now()}`,
      badge: serviceForm.badge || `STAGE 0${publicServices.length + 1}`,
      title: serviceForm.title,
      desc: serviceForm.desc || 'Turnkey service delivered by CONTEC Design & Build.',
      image: serviceForm.image || '/images/hero-main.jpg',
      features: cleanFeatures.length ? cleanFeatures : ['Certified engineering'],
      startingPrice: serviceForm.startingPrice || '',
      timeline: serviceForm.timeline || '',
      cidaStandard: serviceForm.cidaStandard || 'CIDA CS-2 / SLS 107',
      warranty: serviceForm.warranty || '20-Year Structural Guarantee',
      featured: serviceForm.featured ?? true,
    };

    const next = editingService
      ? publicServices.map((s) => (s.id === item.id ? item : s))
      : [...publicServices, item];
    setPublicServices(next);
    savePublicServices(next);
    setShowModal(false);
    await persistService(item, idx >= 0 ? idx : 0);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this service from the public website and MySQL database?')) return;
    const next = publicServices.filter((s) => s.id !== id);
    setPublicServices(next);
    savePublicServices(next);
    await fetch(`/api/erp/public-content?type=SERVICE&id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch(() => {});
  };

  const handleDuplicate = async (s: PublicService) => {
    const cloned: PublicService = {
      ...s,
      id: `serv-${Date.now()}`,
      title: `${s.title} (Clone)`,
      badge: `STAGE 0${publicServices.length + 1}`,
    };
    const next = [...publicServices, cloned];
    setPublicServices(next);
    savePublicServices(next);
    await persistService(cloned, next.length - 1);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(publicServices, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contec-public-services-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = publicServices.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = publicServices.map((s) => ({
    label: s.badge,
    value: s.features.length,
    unit: 'deliverables',
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-emerald-400" />
            <span>Website Services Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Dedicated MySQL-backed service offerings manager for <span className="text-emerald-400 font-semibold">/services</span>.
            {saving && <span className="ml-2 text-emerald-400 font-semibold">• Syncing to database...</span>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Public Service</span>
          </button>
        </div>
      </div>

      {/* Stat Boxes, Graph View & CSV/Print Reports */}
      <ModuleAnalytics
        title="Service Catalog Analytics & Reports"
        stats={[
          {
            label: 'Active Service Stages',
            value: publicServices.length,
            subtitle: 'Live in MySQL public_services',
            accent: 'emerald',
            icon: <Layers className="w-4 h-4" />,
          },
          {
            label: 'Total Deliverables',
            value: publicServices.reduce((acc, s) => acc + s.features.length, 0),
            subtitle: 'Checklist items across services',
            accent: 'blue',
            icon: <CheckCircle2 className="w-4 h-4" />,
          },
          {
            label: 'CIDA / SLS Certified',
            value: publicServices.filter((s) => s.cidaStandard).length,
            subtitle: 'Standards-compliant offerings',
            accent: 'gold',
            icon: <ShieldCheck className="w-4 h-4" />,
          },
          {
            label: 'Warranty-Backed',
            value: publicServices.filter((s) => s.warranty).length,
            subtitle: 'Covered by structural guarantee',
            accent: 'purple',
            icon: <Clock className="w-4 h-4" />,
          },
        ]}
        reportFilename="contec-website-services"
        showModeToggle={false}
        reportRows={publicServices.map((s) => ({
          ID: s.id,
          Badge: s.badge,
          Title: s.title,
          StartingPrice: s.startingPrice || '',
          Timeline: s.timeline || '',
          CIDAStandard: s.cidaStandard || '',
          Warranty: s.warranty || '',
          DeliverablesCount: s.features.length,
        }))}
      />

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#080e1c]/80 border border-white/10">
        <div className="relative min-w-[240px] max-w-sm flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services by title, stage..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
          />
        </div>
        <span className="text-xs text-zinc-400 font-medium">
          {loading ? 'Loading from MySQL...' : `Showing ${filtered.length} of ${publicServices.length} services`}
        </span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl bg-[#080e1c]/90 border border-white/10 p-5 shadow-lg flex flex-col justify-between hover:border-emerald-500/40 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  {s.badge}
                </span>
                {s.timeline && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                    {s.timeline}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{s.desc}</p>

              <div className="flex flex-wrap gap-1.5">
                {s.startingPrice && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FFB800]/10 border border-[#FFB800]/20 text-[#FFB800] font-semibold">
                    {s.startingPrice}
                  </span>
                )}
                {s.cidaStandard && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 font-semibold">
                    {s.cidaStandard}
                  </span>
                )}
              </div>

              <div className="space-y-1 pt-2 border-t border-white/5">
                {s.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-blue-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDuplicate(s)}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Clone</span>
                </button>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#080f24] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>{editingService ? 'Edit Public Service (MySQL)' : 'Add New Public Service (MySQL)'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Stage Badge *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.badge || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-zinc-300 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.desc || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Starting Price Tier</label>
                  <input
                    type="text"
                    value={serviceForm.startingPrice || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, startingPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Estimated Timeline</label>
                  <input
                    type="text"
                    value={serviceForm.timeline || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, timeline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">CIDA / SLS Standard</label>
                  <input
                    type="text"
                    value={serviceForm.cidaStandard || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, cidaStandard: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Warranty</label>
                  <input
                    type="text"
                    value={serviceForm.warranty || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, warranty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-zinc-300 mb-1">Image URL *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.image || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="relative h-20 w-full rounded-xl bg-zinc-900 border border-white/15 overflow-hidden">
                  {serviceForm.image && (
                    <Image src={serviceForm.image} alt="Preview" fill className="object-cover" unoptimized />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-300">Features &amp; Deliverables</label>
                  <button
                    type="button"
                    onClick={() =>
                      setServiceForm({
                        ...serviceForm,
                        features: [...(serviceForm.features || []), ''],
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add Feature</span>
                  </button>
                </div>
                {(serviceForm.features || []).map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={f}
                      onChange={(e) => {
                        const next = [...(serviceForm.features || [])];
                        next[idx] = e.target.value;
                        setServiceForm({ ...serviceForm, features: next });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setServiceForm({
                          ...serviceForm,
                          features: (serviceForm.features || []).filter((_, i) => i !== idx),
                        })
                      }
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save to MySQL &amp; Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
