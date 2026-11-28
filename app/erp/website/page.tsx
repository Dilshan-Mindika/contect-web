"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  DEFAULT_PROJECTS,
  PublicProject,
  savePublicProjects,
} from '@/lib/publicData';
import ModuleAnalytics from '@/components/erp/ModuleAnalytics';
import DataViewToolbar, { ViewMode } from '@/components/erp/DataViewToolbar';
import MultiImageField from '@/components/erp/MultiImageField';
import CustomSelect from '@/components/erp/CustomSelect';
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
  Eye,
} from 'lucide-react';

export default function WebsiteProjectsManagerPage() {
  const [publicProjects, setPublicProjects] = useState<PublicProject[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [projectSearch, setProjectSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('title');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [viewingProject, setViewingProject] = useState<PublicProject | null>(null);

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
    images: ['/images/project-alpine.jpg'],
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
      images: ['/images/project-alpine.jpg'],
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
      images: p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [],
      highlights: p.highlights?.length ? p.highlights : ['Reinforced concrete foundation'],
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title) return;
    const cleanHighlights = (projectForm.highlights || []).filter((h) => h.trim().length > 0);
    const gallery = projectForm.images && projectForm.images.length > 0
      ? projectForm.images
      : [projectForm.image || '/images/project-alpine.jpg'];
    const item: PublicProject = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      title: projectForm.title,
      category: projectForm.category || 'Hillside',
      location: projectForm.location || 'Kandy, Sri Lanka',
      year: projectForm.year || '2026',
      area: projectForm.area || '4,500 sq ft',
      solarCapacity: projectForm.solarCapacity || '25 kW Solar',
      energyRating: projectForm.energyRating || 'Eco-Friendly Living',
      image: gallery[0],
      images: gallery,
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
      clientName: projectForm.clientName || '',
      concreteGrade: projectForm.concreteGrade || '',
      targetSector: projectForm.targetSector || '',
      durationMonths: projectForm.durationMonths || '',
      approvalsObtained: projectForm.approvalsObtained || '',
      smartSystems: projectForm.smartSystems || '',
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

  const filtered = publicProjects
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.location.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(projectSearch.toLowerCase());
      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || (p.status || 'COMPLETED') === statusFilter;
      return matchesSearch && matchesCat && matchesStatus;
    })
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'year') return a.year.localeCompare(b.year) * mul;
      if (sortBy === 'category') return a.category.localeCompare(b.category) * mul;
      if (sortBy === 'status') return (a.status || 'COMPLETED').localeCompare(b.status || 'COMPLETED') * mul;
      return a.title.localeCompare(b.title) * mul;
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
            Dedicated portfolio manager for <span className="text-[#FFB800] font-semibold">/projects</span>.
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
            subtitle: 'Published to /projects',
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
        reportFilename="contec-website-projects"
        showModeToggle={false}
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

      {/* DataViewToolbar with Search, Sort & Grid/Detailed/Tile/Compact */}
      <DataViewToolbar
        search={projectSearch}
        onSearchChange={setProjectSearch}
        searchPlaceholder="Search projects by title, location..."
        sortOptions={[
          { value: 'title', label: 'Project Title' },
          { value: 'year', label: 'Year' },
          { value: 'category', label: 'Category' },
          { value: 'status', label: 'Status' },
        ]}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDir={sortDir}
        onSortDirToggle={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={publicProjects.length}
        filteredCount={filtered.length}
      />

      {/* Projects Grid / Tile / Detailed / Compact */}
      {viewMode === 'DETAILED' ? (
        <div className="rounded-2xl bg-[#080e1c]/90 border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-[10px] uppercase text-zinc-400">
              <tr>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Area</th>
                <th className="p-3.5">Valuation</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.03]">
                  <td className="p-3.5 font-bold text-white">{p.title}</td>
                  <td className="p-3.5 text-blue-300">{p.category}</td>
                  <td className="p-3.5 text-zinc-400">{p.location}</td>
                  <td className="p-3.5 text-zinc-300">{p.area}</td>
                  <td className="p-3.5 text-[#FFB800] font-semibold">{p.contractValue || '—'}</td>
                  <td className="p-3.5 text-emerald-300 font-semibold">{p.status || 'COMPLETED'}</td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => setViewingProject(p)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-emerald-400 cursor-pointer" title="View"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleOpenEdit(p)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-blue-400 cursor-pointer" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
      <div className={
        viewMode === 'TILE'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3'
          : viewMode === 'COMPACT'
          ? 'space-y-2'
          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
      }>
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
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingProject(p)}
                    className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-emerald-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-blue-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDuplicate(p)}
                    className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-2 py-1 rounded-md bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* VIEW PROJECT DETAIL MODAL */}
      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">{viewingProject.title}</h3>
              <button onClick={() => setViewingProject(null)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5"><span className="text-zinc-400 block text-[10px]">Location</span><strong className="text-white">{viewingProject.location}</strong></div>
              <div className="p-3 rounded-xl bg-white/5"><span className="text-zinc-400 block text-[10px]">Valuation</span><strong className="text-[#FFB800]">{viewingProject.contractValue || 'N/A'}</strong></div>
              <div className="p-3 rounded-xl bg-white/5"><span className="text-zinc-400 block text-[10px]">Area / Year</span><strong className="text-white">{viewingProject.area} • {viewingProject.year}</strong></div>
              <div className="p-3 rounded-xl bg-white/5"><span className="text-zinc-400 block text-[10px]">Solar</span><strong className="text-emerald-300">{viewingProject.solarCapacity}</strong></div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{viewingProject.description}</p>
            {(viewingProject.images?.length ? viewingProject.images : [viewingProject.image]).length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {(viewingProject.images?.length ? viewingProject.images : [viewingProject.image]).map((img, i) => (
                  <div key={`${img}-${i}`} className="relative h-20 rounded-xl overflow-hidden border border-white/10">
                    <Image src={img} alt={`${viewingProject.title} ${i + 1}`} fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setViewingProject(null); handleOpenEdit(viewingProject); }} className="px-4 py-2 rounded-xl bg-[#0038B8] text-white text-xs font-bold cursor-pointer">Edit Project</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-3xl bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FFB800]" />
                <span>{editingProject ? 'Edit Public Project' : 'Add New Public Project'}</span>
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
                  <CustomSelect
                    value={projectForm.category || 'Hillside'}
                    onChange={(val) => setProjectForm({ ...projectForm, category: val })}
                    options={['Hillside', 'Residential', 'Commercial', 'Infrastructure']}
                  />
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
                  <CustomSelect
                    value={projectForm.status || 'COMPLETED'}
                    onChange={(val) =>
                      setProjectForm({
                        ...projectForm,
                        status: val as PublicProject['status'],
                      })
                    }
                    options={[
                      { value: 'COMPLETED', label: 'Completed' },
                      { value: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
                      { value: 'DESIGN_PHASE', label: 'Design Phase' },
                    ]}
                  />
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

              <MultiImageField
                label="Project Photo Gallery (Upload Multiple Images or Add URLs)"
                images={projectForm.images && projectForm.images.length > 0 ? projectForm.images : projectForm.image ? [projectForm.image] : []}
                onChange={(imgs) =>
                  setProjectForm({
                    ...projectForm,
                    images: imgs,
                    image: imgs[0] || '/images/project-alpine.jpg',
                  })
                }
              />

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={projectForm.tagline || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                  Optional Structural, Client &amp; Compliance Metadata
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Client / Developer (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Private Villa Owner"
                      value={projectForm.clientName || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Client Privacy</label>
                    <CustomSelect
                      value={projectForm.clientPrivacy || 'PUBLIC'}
                      onChange={(val) => setProjectForm({ ...projectForm, clientPrivacy: val as 'PUBLIC' | 'CONFIDENTIAL' })}
                      options={[
                        { value: 'PUBLIC', label: 'Public Display' },
                        { value: 'CONFIDENTIAL', label: 'Confidential (NDA)' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Duration (Months)</label>
                    <input
                      type="text"
                      placeholder="e.g. 14 Months"
                      value={projectForm.durationMonths || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, durationMonths: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Foundation System</label>
                    <input
                      type="text"
                      value={projectForm.foundationType || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, foundationType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Concrete &amp; Steel Grade</label>
                    <input
                      type="text"
                      placeholder="e.g. G35 / BS 4449 B500B"
                      value={projectForm.concreteGrade || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, concreteGrade: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Lead Architect / Engineer</label>
                    <input
                      type="text"
                      value={projectForm.leadArchitect || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, leadArchitect: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Approvals Obtained</label>
                    <input
                      type="text"
                      placeholder="e.g. UDA, NBRO, KMC, COC"
                      value={projectForm.approvalsObtained || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, approvalsObtained: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-zinc-300 mb-1">Smart MEP &amp; Automation Systems</label>
                    <input
                      type="text"
                      placeholder="e.g. Rainwater Harvesting, KNX Smart Lighting, EV Charger"
                      value={projectForm.smartSystems || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, smartSystems: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
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
                  <span>Save &amp; Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
