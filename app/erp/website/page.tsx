"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  DEFAULT_PROJECTS,
  PublicProject,
  savePublicProjects,
} from '@/lib/publicData';
import ModuleAnalytics from '@/components/erp/ModuleAnalytics';
import {
  Globe,
  Plus,
  Trash2,
  Edit3,
  MapPin,
  Star,
  Copy,
  Download,
  RotateCcw,
  Search,
  Check,
  X,
  CheckCircle2,
  Building2,
  Sun,
} from 'lucide-react';

export default function WebsiteProjectsManagerPage() {
  const [publicProjects, setPublicProjects] = useState<PublicProject[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [projectSearch, setProjectSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<PublicProject | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<PublicProject>>({
    title: '',
    category: 'Hillside',
    location: 'Kandy, Sri Lanka',
    year: new Date().getFullYear().toString(),
    area: '5,000 sq ft',
    solarCapacity: '30 kW Rooftop Solar',
    energyRating: 'Eco-Friendly Living',
    image: '/images/project-alpine.jpg',
    tagline: '',
    description: '',
    highlights: ['Reinforced concrete foundation', 'Hillside slope protection', 'Turnkey luxury finishes'],
    status: 'COMPLETED',
    featured: true,
    contractValue: 'LKR 165M',
    structuralWarranty: '25-Year Foundation Warranty',
    leadArchitect: 'Chartered Structural Engineering Team',
    foundationType: 'Rock-Anchored Reinforced Concrete Grade 35',
    clientPrivacy: 'PUBLIC',
  });

  // Load live projects from MySQL API
  useEffect(() => {
    async function loadFromDb() {
      try {
        const res = await fetch('/api/erp/public-content');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.projects)) {
            setPublicProjects(data.projects);
            savePublicProjects(data.projects);
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

  const persistProject = async (proj: PublicProject) => {
    setSaving(true);
    try {
      const res = await fetch('/api/erp/public-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'PROJECT', item: proj }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.projects) {
          setPublicProjects(data.projects);
          savePublicProjects(data.projects);
          return;
        }
      }
    } catch {
      // Fallback to local state
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      category: 'Hillside',
      location: 'Kandy, Sri Lanka',
      year: new Date().getFullYear().toString(),
      area: '5,000 sq ft',
      solarCapacity: '30 kW Solar Array',
      energyRating: 'Eco-Friendly Living',
      image: '/images/project-alpine.jpg',
      tagline: 'Modern hillside home designed with scenic views.',
      description: 'Engineered with reinforced rock-anchored foundations, panoramic glass windows, and natural ventilation.',
      highlights: ['Reinforced foundation on slope', 'Integrated solar power system', 'Turnkey luxury finishes'],
      status: 'COMPLETED',
      featured: true,
      contractValue: 'LKR 165M',
      structuralWarranty: '25-Year Foundation Warranty',
      leadArchitect: 'Chartered Structural Engineering Team',
      foundationType: 'Rock-Anchored Reinforced Concrete Grade 35',
      clientPrivacy: 'PUBLIC',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: PublicProject) => {
    setEditingProject(p);
    setProjectForm({
      ...p,
      highlights: p.highlights?.length ? p.highlights : ['Reinforced concrete foundation'],
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title) return;
    const cleanHighlights = (projectForm.highlights || []).filter((h) => h.trim().length > 0);
    const item: PublicProject = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      title: projectForm.title,
      category: projectForm.category || 'Hillside',
      location: projectForm.location || 'Kandy, Sri Lanka',
      year: projectForm.year || '2026',
      area: projectForm.area || '4,500 sq ft',
      solarCapacity: projectForm.solarCapacity || '25 kW Solar',
      energyRating: projectForm.energyRating || 'Eco-Friendly Living',
      image: projectForm.image || '/images/project-alpine.jpg',
      tagline: projectForm.tagline || 'Custom project engineered by CONTEC Design & Build.',
      description: projectForm.description || 'Engineered with certified structural foundations.',
      highlights: cleanHighlights.length ? cleanHighlights : ['Reinforced concrete foundation'],
      status: projectForm.status || 'COMPLETED',
      featured: projectForm.featured ?? false,
      contractValue: projectForm.contractValue || '',
      structuralWarranty: projectForm.structuralWarranty || '25-Year Foundation Warranty',
      leadArchitect: projectForm.leadArchitect || 'Chartered Structural Engineering Team',
      foundationType: projectForm.foundationType || 'Rock-Anchored Reinforced Concrete Grade 35',
      clientPrivacy: projectForm.clientPrivacy || 'PUBLIC',
    };

    const next = editingProject
      ? publicProjects.map((p) => (p.id === item.id ? item : p))
      : [item, ...publicProjects];
    setPublicProjects(next);
    savePublicProjects(next);
    setShowModal(false);
    await persistProject(item);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this project from the public website and MySQL database?')) return;
    const next = publicProjects.filter((p) => p.id !== id);
    setPublicProjects(next);
    savePublicProjects(next);
    await fetch(`/api/erp/public-content?type=PROJECT&id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch(() => {});
  };

  const handleToggleFeatured = async (p: PublicProject) => {
    const updated = { ...p, featured: !p.featured };
    const next = publicProjects.map((item) => (item.id === p.id ? updated : item));
    setPublicProjects(next);
    savePublicProjects(next);
    await persistProject(updated);
  };

  const handleDuplicate = async (p: PublicProject) => {
    const cloned: PublicProject = {
      ...p,
      id: `proj-${Date.now()}`,
      title: `${p.title} (Clone)`,
      featured: false,
    };
    const next = [cloned, ...publicProjects];
    setPublicProjects(next);
    savePublicProjects(next);
    await persistProject(cloned);
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset public projects and services in MySQL back to factory defaults?')) return;
    const res = await fetch('/api/erp/public-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'RESET_DEFAULTS' }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.projects) {
        setPublicProjects(data.projects);
        savePublicProjects(data.projects);
      }
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(publicProjects, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contec-public-projects-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = publicProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || (p.status || 'COMPLETED') === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  // Analytics & Chart Data
  const categories = Array.from(new Set(publicProjects.map((p) => p.category)));
  const chartData = categories.map((cat) => ({
    label: cat,
    value: publicProjects.filter((p) => p.category === cat).length,
    secondaryValue: publicProjects.filter((p) => p.category === cat && p.featured).length,
    unit: 'projects',
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-[#FFB800]" />
            <span>Website Projects Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Dedicated MySQL-backed portfolio manager for <span className="text-[#FFB800] font-semibold">/projects</span>.
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
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-blue-900/40 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FFB800]" />
            <span>Add Public Project</span>
          </button>
        </div>
      </div>

      {/* Stat Boxes, Graph View & CSV/Print Reports */}
      <ModuleAnalytics
        title="Portfolio Analytics & Reports"
        stats={[
          {
            label: 'Total Showcase Projects',
            value: publicProjects.length,
            subtitle: 'Live in MySQL public_projects',
            accent: 'blue',
            icon: <Globe className="w-4 h-4" />,
          },
          {
            label: 'Featured on Homepage',
            value: publicProjects.filter((p) => p.featured).length,
            subtitle: 'Highlighted portfolio builds',
            accent: 'gold',
            icon: <Star className="w-4 h-4" />,
          },
          {
            label: 'Completed Handovers',
            value: publicProjects.filter((p) => (p.status || 'COMPLETED') === 'COMPLETED').length,
            subtitle: 'Delivered to homeowners',
            accent: 'emerald',
            icon: <CheckCircle2 className="w-4 h-4" />,
          },
          {
            label: 'Solar-Integrated Builds',
            value: publicProjects.filter((p) => p.solarCapacity).length,
            subtitle: 'Clean energy equipped',
            accent: 'purple',
            icon: <Sun className="w-4 h-4" />,
          },
        ]}
        chartTitle="Projects by Category vs Featured"
        chartSubtitle="Distribution across Hillside, Residential, and Commercial categories"
        primarySeriesLabel="Total Projects"
        secondarySeriesLabel="Featured Projects"
        chartData={chartData}
        reportFilename="contec-website-projects"
        reportRows={publicProjects.map((p) => ({
          ID: p.id,
          Title: p.title,
          Category: p.category,
          Location: p.location,
          Year: p.year,
          Area: p.area,
          Status: p.status || 'COMPLETED',
          Featured: p.featured ? 'Yes' : 'No',
          ContractValue: p.contractValue || '',
          SolarCapacity: p.solarCapacity,
        }))}
      />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#080e1c]/80 border border-white/10">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              placeholder="Search projects by title, location..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
            />
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            {['All', 'Hillside', 'Residential', 'Commercial'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  categoryFilter === cat ? 'bg-[#FFB800] text-black font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            {[
              { id: 'All', label: 'All Status' },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'UNDER_CONSTRUCTION', label: 'Onsite' },
              { id: 'DESIGN_PHASE', label: 'Design' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  statusFilter === st.id ? 'bg-blue-600 text-white font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-zinc-400 font-medium">
          {loading ? 'Loading from MySQL...' : `Showing ${filtered.length} of ${publicProjects.length} projects`}
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((p) => {
          const statusColor =
            p.status === 'UNDER_CONSTRUCTION'
              ? 'bg-amber-950/85 text-amber-300 border-amber-500/50'
              : p.status === 'DESIGN_PHASE'
              ? 'bg-blue-950/85 text-blue-300 border-blue-500/50'
              : 'bg-emerald-950/85 text-emerald-300 border-emerald-500/50';
          const statusLabel =
            p.status === 'UNDER_CONSTRUCTION'
              ? 'Under Construction'
              : p.status === 'DESIGN_PHASE'
              ? 'Design Phase'
              : 'Completed';

          return (
            <div
              key={p.id}
              className="rounded-2xl bg-[#080e1c]/90 border border-white/10 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-blue-500/40 transition-all"
            >
              <div>
                <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0038B8] text-white">
                      {p.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(p)}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-md ${
                      p.featured
                        ? 'bg-[#FFB800] text-black shadow-lg'
                        : 'bg-black/60 text-zinc-400 hover:text-white border border-white/20'
                    }`}
                    title={p.featured ? 'Featured on Homepage' : 'Mark Featured'}
                  >
                    <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-black' : ''}`} />
                  </button>

                  <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1.5 text-[11px] text-zinc-200">
                    <MapPin className="w-3 h-3 text-[#FFB800] shrink-0" />
                    <span className="truncate">{p.location} • {p.year}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">{p.tagline || p.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.contractValue && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#FFB800] font-semibold">
                        {p.contractValue}
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                      {p.area}
                    </span>
                    {p.solarCapacity && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold truncate max-w-[140px]">
                        {p.solarCapacity}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-blue-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDuplicate(p)}
                    className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Clone</span>
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-2 py-1 rounded-md bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-3xl bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FFB800]" />
                <span>{editingProject ? 'Edit Public Project (MySQL)' : 'Add New Public Project (MySQL)'}</span>
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
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-zinc-300 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={projectForm.category || 'Hillside'}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080f24] border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="Hillside">Hillside</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.location || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Floor Area</label>
                  <input
                    type="text"
                    value={projectForm.area || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, area: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Completion Year</label>
                  <input
                    type="text"
                    value={projectForm.year || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Status</label>
                  <select
                    value={projectForm.status || 'COMPLETED'}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        status: e.target.value as PublicProject['status'],
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080f24] border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="COMPLETED">Completed</option>
                    <option value="UNDER_CONSTRUCTION">Under Construction</option>
                    <option value="DESIGN_PHASE">Design Phase</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Contract Value</label>
                  <input
                    type="text"
                    value={projectForm.contractValue || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, contractValue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Structural Warranty</label>
                  <input
                    type="text"
                    value={projectForm.structuralWarranty || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, structuralWarranty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Solar Capacity</label>
                  <input
                    type="text"
                    value={projectForm.solarCapacity || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, solarCapacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Energy Rating</label>
                  <input
                    type="text"
                    value={projectForm.energyRating || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, energyRating: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Image URL *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.image || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={projectForm.tagline || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 mb-1">Live Preview</label>
                  <div className="relative h-28 w-full rounded-xl bg-zinc-900 border border-white/15 overflow-hidden">
                    {projectForm.image && (
                      <Image src={projectForm.image} alt="Preview" fill className="object-cover" unoptimized />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={projectForm.description || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-300">Engineering Highlights</label>
                  <button
                    type="button"
                    onClick={() =>
                      setProjectForm({
                        ...projectForm,
                        highlights: [...(projectForm.highlights || []), ''],
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>Add Highlight</span>
                  </button>
                </div>
                {(projectForm.highlights || []).map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => {
                        const next = [...(projectForm.highlights || [])];
                        next[idx] = e.target.value;
                        setProjectForm({ ...projectForm, highlights: next });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProjectForm({
                          ...projectForm,
                          highlights: (projectForm.highlights || []).filter((_, i) => i !== idx),
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
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#FFB800]" />
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
