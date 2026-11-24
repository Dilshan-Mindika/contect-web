"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useERP } from '@/lib/erp/AuthContext';
import { formatLKR } from '@/lib/erp/currency';
import {
  getPublicProjects,
  savePublicProjects,
  DEFAULT_PROJECTS,
  PublicProject,
  getPublicServices,
  savePublicServices,
  DEFAULT_SERVICES,
  PublicService,
} from '@/lib/publicData';
import {
  HardHat,
  Users,
  Plus,
  ArrowRight,
  CheckCircle2,
  Building2,
  Trash2,
  Edit3,
  Globe,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  Phone,
  MessageSquare,
  X,
  Star,
  Copy,
  Download,
  RotateCcw,
  Search,
  Filter,
  ShieldCheck,
  Check,
  ExternalLink,
  Coins,
  ShieldAlert,
} from 'lucide-react';

export default function ERPDashboardPage() {
  const { user, projects, invoices, leads, websiteInquiries, updateInquiryStatus } = useERP();

  // Public Projects & Services Management State
  const [publicProjects, setPublicProjects] = useState<PublicProject[]>(DEFAULT_PROJECTS);
  const [publicServices, setPublicServices] = useState<PublicService[]>(DEFAULT_SERVICES);
  const [websiteTab, setWebsiteTab] = useState<'PROJECTS' | 'SERVICES'>('PROJECTS');

  // Search & Filter State
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [projectStatusFilter, setProjectStatusFilter] = useState('All');
  const [serviceSearch, setServiceSearch] = useState('');

  // Modal States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<PublicProject | null>(null);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<PublicService | null>(null);

  // Project Form State (Includes All Advanced & Optional Fields)
  const [projectForm, setProjectForm] = useState<Partial<PublicProject>>({
    title: '',
    category: 'Hillside',
    location: 'Kandy, Sri Lanka',
    year: new Date().getFullYear().toString(),
    area: '4,500 sq ft',
    solarCapacity: '25 kW Rooftop Solar',
    energyRating: 'Eco-Friendly Living',
    image: '/images/project-alpine.jpg',
    tagline: '',
    description: '',
    highlights: ['Reinforced concrete foundation', 'Hillside slope protection', 'Custom luxury interior finishing'],
    status: 'COMPLETED',
    featured: true,
    contractValue: 'LKR 165M',
    structuralWarranty: '25-Year Foundation Warranty',
    leadArchitect: 'Chartered Structural Engineering Team',
    foundationType: 'Rock-Anchored Reinforced Concrete Grade 35',
    clientPrivacy: 'PUBLIC',
  });

  // Service Form State (Includes All Advanced & Optional Fields)
  const [serviceForm, setServiceForm] = useState<Partial<PublicService>>({
    badge: 'NEW STAGE',
    title: '',
    desc: '',
    image: '/images/hero-main.jpg',
    features: ['Professional consultation', 'Council approvals', 'Chartered architect supervision', 'Guaranteed completion'],
    startingPrice: 'From LKR 4,500/sqft',
    timeline: '3 - 8 Months',
    cidaStandard: 'CIDA CS-2 / SLS 107',
    warranty: '20-Year Structural Guarantee',
    featured: true,
  });

  // Load public projects and services on mount
  useEffect(() => {
    setPublicProjects(getPublicProjects());
    setPublicServices(getPublicServices());

    const handleProjUpdate = () => setPublicProjects(getPublicProjects());
    const handleServUpdate = () => setPublicServices(getPublicServices());

    window.addEventListener('contec_projects_updated', handleProjUpdate);
    window.addEventListener('contec_services_updated', handleServUpdate);
    window.addEventListener('storage', handleProjUpdate);
    window.addEventListener('storage', handleServUpdate);

    return () => {
      window.removeEventListener('contec_projects_updated', handleProjUpdate);
      window.removeEventListener('contec_services_updated', handleServUpdate);
      window.removeEventListener('storage', handleProjUpdate);
      window.removeEventListener('storage', handleServUpdate);
    };
  }, []);

  // Dynamic Highlight Handlers for Project Form
  const handleAddHighlight = () => {
    setProjectForm((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), ''],
    }));
  };

  const handleUpdateHighlight = (index: number, val: string) => {
    setProjectForm((prev) => {
      const updated = [...(prev.highlights || [])];
      updated[index] = val;
      return { ...prev, highlights: updated };
    });
  };

  const handleRemoveHighlight = (index: number) => {
    setProjectForm((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== index),
    }));
  };

  // Dynamic Feature Handlers for Service Form
  const handleAddFeature = () => {
    setServiceForm((prev) => ({
      ...prev,
      features: [...(prev.features || []), ''],
    }));
  };

  const handleUpdateFeature = (index: number, val: string) => {
    setServiceForm((prev) => {
      const updated = [...(prev.features || [])];
      updated[index] = val;
      return { ...prev, features: updated };
    });
  };

  const handleRemoveFeature = (index: number) => {
    setServiceForm((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  // Toggle Featured Project Directly from Card
  const handleToggleFeaturedProject = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = publicProjects.map((p) =>
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    setPublicProjects(updated);
    savePublicProjects(updated);
  };

  // Duplicate / Clone Project
  const handleDuplicateProject = (p: PublicProject) => {
    const cloned: PublicProject = {
      ...p,
      id: 'proj-' + Date.now(),
      title: `${p.title} (Clone)`,
      featured: false,
    };
    const updated = [cloned, ...publicProjects];
    setPublicProjects(updated);
    savePublicProjects(updated);
  };

  // Duplicate / Clone Service
  const handleDuplicateService = (s: PublicService) => {
    const cloned: PublicService = {
      ...s,
      id: 'serv-' + Date.now(),
      title: `${s.title} (Clone)`,
      badge: `STAGE 0${publicServices.length + 1}`,
    };
    const updated = [...publicServices, cloned];
    setPublicServices(updated);
    savePublicServices(updated);
  };

  // Export Data as JSON Backup
  const handleExportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      projects: publicProjects,
      services: publicServices,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contec-public-website-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset to Factory Defaults
  const handleResetDefaults = () => {
    if (confirm('Reset all website projects and services back to official factory defaults? Any custom modifications will be replaced.')) {
      setPublicProjects(DEFAULT_PROJECTS);
      savePublicProjects(DEFAULT_PROJECTS);
      setPublicServices(DEFAULT_SERVICES);
      savePublicServices(DEFAULT_SERVICES);
    }
  };

  // Handlers for Projects Modal
  const handleOpenAddProject = () => {
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
      highlights: [
        'Reinforced foundation on slope',
        'Integrated solar power system',
        'Turnkey luxury finishes',
      ],
      status: 'COMPLETED',
      featured: true,
      contractValue: 'LKR 165M',
      structuralWarranty: '25-Year Foundation Warranty',
      leadArchitect: 'Chartered Structural Engineering Team',
      foundationType: 'Rock-Anchored Reinforced Concrete Grade 35',
      clientPrivacy: 'PUBLIC',
    });
    setShowProjectModal(true);
  };

  const handleOpenEditProject = (p: PublicProject) => {
    setEditingProject(p);
    setProjectForm({
      ...p,
      status: p.status || 'COMPLETED',
      featured: p.featured ?? false,
      contractValue: p.contractValue || 'LKR 150M',
      structuralWarranty: p.structuralWarranty || '25-Year Foundation Warranty',
      leadArchitect: p.leadArchitect || 'Chartered Structural Engineering Team',
      foundationType: p.foundationType || 'Rock-Anchored Reinforced Concrete Grade 35',
      clientPrivacy: p.clientPrivacy || 'PUBLIC',
      highlights: p.highlights && p.highlights.length > 0 ? p.highlights : ['Reinforced concrete foundation'],
    });
    setShowProjectModal(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title) return;

    const cleanHighlights = (projectForm.highlights || []).filter((h) => h.trim().length > 0);

    let updated: PublicProject[];
    if (editingProject) {
      updated = publicProjects.map((p) =>
        p.id === editingProject.id
          ? ({
              ...p,
              ...projectForm,
              highlights: cleanHighlights.length > 0 ? cleanHighlights : ['Reinforced concrete foundation'],
            } as PublicProject)
          : p
      );
    } else {
      const newProj: PublicProject = {
        id: 'proj-' + Date.now(),
        title: projectForm.title || 'New Luxury Project',
        category: projectForm.category || 'Hillside',
        location: projectForm.location || 'Kandy, Sri Lanka',
        year: projectForm.year || '2026',
        area: projectForm.area || '4,500 sq ft',
        solarCapacity: projectForm.solarCapacity || '25 kW Solar',
        energyRating: projectForm.energyRating || 'Eco-Friendly Living',
        image: projectForm.image || '/images/project-alpine.jpg',
        tagline: projectForm.tagline || 'Custom luxury home engineered by CONTEC Design & Build.',
        description: projectForm.description || 'Engineered with certified structural foundations.',
        highlights: cleanHighlights.length > 0 ? cleanHighlights : ['Reinforced concrete foundation', 'Architectural excellence'],
        status: projectForm.status || 'COMPLETED',
        featured: projectForm.featured ?? false,
        contractValue: projectForm.contractValue || '',
        structuralWarranty: projectForm.structuralWarranty || '25-Year Foundation Warranty',
        leadArchitect: projectForm.leadArchitect || 'Chartered Structural Engineering Team',
        foundationType: projectForm.foundationType || 'Rock-Anchored Reinforced Concrete Grade 35',
        clientPrivacy: projectForm.clientPrivacy || 'PUBLIC',
      };
      updated = [newProj, ...publicProjects];
    }

    setPublicProjects(updated);
    savePublicProjects(updated);
    setShowProjectModal(false);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to remove this project from the public website?')) {
      const updated = publicProjects.filter((p) => p.id !== id);
      setPublicProjects(updated);
      savePublicProjects(updated);
    }
  };

  // Handlers for Services Modal
  const handleOpenAddService = () => {
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
    setShowServiceModal(true);
  };

  const handleOpenEditService = (s: PublicService) => {
    setEditingService(s);
    setServiceForm({
      ...s,
      startingPrice: s.startingPrice || 'From LKR 4,500/sqft',
      timeline: s.timeline || '3 - 8 Months',
      cidaStandard: s.cidaStandard || 'CIDA CS-2 / SLS 107',
      warranty: s.warranty || '20-Year Structural Guarantee',
      featured: s.featured ?? false,
      features: s.features && s.features.length > 0 ? s.features : ['Chartered architectural design'],
    });
    setShowServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title) return;

    const cleanFeatures = (serviceForm.features || []).filter((f) => f.trim().length > 0);

    let updated: PublicService[];
    if (editingService) {
      updated = publicServices.map((s) =>
        s.id === editingService.id
          ? ({
              ...s,
              ...serviceForm,
              features: cleanFeatures.length > 0 ? cleanFeatures : ['Certified engineering', 'Quality assurance'],
            } as PublicService)
          : s
      );
    } else {
      const newServ: PublicService = {
        id: 'serv-' + Date.now(),
        badge: serviceForm.badge || `STAGE 0${publicServices.length + 1}`,
        title: serviceForm.title || 'New Service',
        desc: serviceForm.desc || 'Turnkey service delivered by CONTEC Design & Build.',
        image: serviceForm.image || '/images/hero-main.jpg',
        features: cleanFeatures.length > 0 ? cleanFeatures : ['Certified engineering', 'Quality assurance'],
        startingPrice: serviceForm.startingPrice || '',
        timeline: serviceForm.timeline || '',
        cidaStandard: serviceForm.cidaStandard || 'CIDA CS-2 / SLS 107',
        warranty: serviceForm.warranty || '20-Year Structural Guarantee',
        featured: serviceForm.featured ?? false,
      };
      updated = [...publicServices, newServ];
    }

    setPublicServices(updated);
    savePublicServices(updated);
    setShowServiceModal(false);
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to remove this service from the public website?')) {
      const updated = publicServices.filter((s) => s.id !== id);
      setPublicServices(updated);
      savePublicServices(updated);
    }
  };

  // Filtered Lists for Live Search & Category Filtering
  const filteredProjects = publicProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(projectSearch.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(projectSearch.toLowerCase()));
    const matchesCategory =
      projectCategoryFilter === 'All' || p.category === projectCategoryFilter;
    const matchesStatus =
      projectStatusFilter === 'All' || (p.status || 'COMPLETED') === projectStatusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredServices = publicServices.filter((s) => {
    return (
      s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.badge.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.desc.toLowerCase().includes(serviceSearch.toLowerCase())
    );
  });

  // Summary Metrics
  const ongoingProjects = projects.filter((p) => p.phase !== 'HANDOVER').length || 4;
  const newInquiriesCount = websiteInquiries.filter((i) => i.status === 'NEW').length || leads.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name || 'Staff Member'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Department: <span className="text-[#FFB800] font-semibold">{user?.department || 'Executive'}</span> • Manage active construction projects, client inquiries, and public website content.
          </p>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#080e1c]/80 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Active Construction Sites</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{ongoingProjects} Sites</div>
          <div className="text-[11px] text-zinc-400 mt-1">Hanthana, Digana, Anniewatte, Peradeniya</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#080e1c]/80 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Client Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{newInquiriesCount} Inquiries</div>
          <div className="text-[11px] text-emerald-400 mt-1">Received from /contact page</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#080e1c]/80 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Public Portfolio Projects</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center text-[#FFB800]">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{publicProjects.length} Projects</div>
          <div className="text-[11px] text-zinc-400 mt-1">Live on /projects page</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#080e1c]/80 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Public Services Offered</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{publicServices.length} Services</div>
          <div className="text-[11px] text-zinc-400 mt-1">Live on /services page</div>
        </div>
      </div>

      {/* ================= SECTION: MANAGE PUBLIC WEBSITE CONTENT ================= */}
      <div className="p-6 rounded-3xl bg-[#080e1c]/90 border border-blue-500/25 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                Public Website Content Manager
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFB800]/15 border border-[#FFB800]/30 text-[#FFB800]">
                Live Sync Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Add, update, or remove projects shown on <span className="text-[#FFB800] font-semibold">/projects</span> and services shown on <span className="text-[#FFB800] font-semibold">/services</span>. Updates persist and reflect instantly.
            </p>
          </div>

          {/* Sub-Tabs Switcher & Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setWebsiteTab('PROJECTS')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  websiteTab === 'PROJECTS'
                    ? 'bg-[#0038B8] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Projects ({publicProjects.length})
              </button>
              <button
                onClick={() => setWebsiteTab('SERVICES')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  websiteTab === 'SERVICES'
                    ? 'bg-[#0038B8] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Services ({publicServices.length})
              </button>
            </div>

            <button
              onClick={handleExportData}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download JSON backup of all public website data"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-xs font-semibold text-zinc-400 hover:text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset projects and services back to factory defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Public Projects Manager */}
        {websiteTab === 'PROJECTS' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search Input */}
                <div className="relative min-w-[200px] flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects by title, area..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1 text-[11px]">
                  {['All', 'Hillside', 'Residential', 'Commercial'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProjectCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        projectCategoryFilter === cat
                          ? 'bg-[#FFB800] text-black font-bold'
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Status Pills */}
                <div className="flex items-center gap-1 text-[11px]">
                  {[
                    { id: 'All', label: 'All Status' },
                    { id: 'COMPLETED', label: 'Completed' },
                    { id: 'UNDER_CONSTRUCTION', label: 'Onsite' },
                    { id: 'DESIGN_PHASE', label: 'Design' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setProjectStatusFilter(st.id)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        projectStatusFilter === st.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Project CTA */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                <span className="text-xs text-zinc-400 font-medium">
                  Showing {filteredProjects.length} of {publicProjects.length} projects
                </span>
                <button
                  onClick={handleOpenAddProject}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-900/40 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProjects.map((p) => {
                const statusColor =
                  p.status === 'UNDER_CONSTRUCTION'
                    ? 'bg-amber-950/85 text-amber-300 border-amber-500/50 shadow-amber-950/50'
                    : p.status === 'DESIGN_PHASE'
                    ? 'bg-blue-950/85 text-blue-300 border-blue-500/50 shadow-blue-950/50'
                    : 'bg-emerald-950/85 text-emerald-300 border-emerald-500/50 shadow-emerald-950/50';

                const statusLabel =
                  p.status === 'UNDER_CONSTRUCTION'
                    ? 'Under Construction'
                    : p.status === 'DESIGN_PHASE'
                    ? 'Design Phase'
                    : 'Completed';

                return (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-black/50 border border-white/10 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-blue-500/40 transition-all"
                  >
                    <div>
                      {/* Image Preview & Badges */}
                      <div className="relative h-40 w-full bg-zinc-900 overflow-hidden">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                        {/* Top Left: Category Badge & Status Badge */}
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0038B8] text-white shadow-md">
                            {p.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md shadow-sm ${statusColor}`}>
                            {statusLabel}
                          </span>
                        </div>

                        {/* Top Right: Featured Star Toggle */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleFeaturedProject(p.id, e)}
                          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
                            p.featured
                              ? 'bg-[#FFB800] text-black shadow-lg shadow-amber-500/40'
                              : 'bg-black/60 text-zinc-400 hover:text-white border border-white/20'
                          }`}
                          title={p.featured ? 'Featured on Website (Click to unfeature)' : 'Mark as Featured on Homepage'}
                        >
                          <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-black' : ''}`} />
                        </button>

                        {/* Bottom Tagline on Image */}
                        <div className="absolute bottom-2 left-2.5 right-2.5">
                          <span className="text-[10px] text-zinc-300 font-medium block truncate">
                            {p.location} • {p.year}
                          </span>
                        </div>
                      </div>

                      {/* Card Content & Advanced Meta */}
                      <div className="p-3.5 space-y-2">
                        <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">{p.title}</h3>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {p.tagline || p.description}
                        </p>

                        {/* Advanced Pills */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.contractValue && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#FFB800] font-semibold">
                              {p.contractValue}
                            </span>
                          )}
                          {p.structuralWarranty && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-emerald-300 font-semibold truncate max-w-[140px]">
                              {p.structuralWarranty}
                            </span>
                          )}
                          {p.area && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                              {p.area}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Toolbar */}
                    <div className="p-3 pt-2 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditProject(p)}
                          className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Edit all fields and highlights"
                        >
                          <Edit3 className="w-3 h-3 text-blue-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDuplicateProject(p)}
                          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-zinc-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          title="Clone this project as a template"
                        >
                          <Copy className="w-3 h-3 text-zinc-400" />
                          <span className="hidden sm:inline">Clone</span>
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="px-2 py-1 rounded-md bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Delete project from public site"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Public Services Manager */}
        {websiteTab === 'SERVICES' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="relative min-w-[220px] max-w-sm flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Search services by title, stage..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                <span className="text-xs text-zinc-400 font-medium">
                  Showing {filteredServices.length} of {publicServices.length} services
                </span>
                <button
                  onClick={handleOpenAddService}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl bg-black/50 border border-white/10 p-4 shadow-lg flex flex-col justify-between hover:border-emerald-500/40 transition-all space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                        {s.badge}
                      </span>
                      {s.timeline && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium">
                          ⏱ {s.timeline}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{s.desc}</p>

                    {/* Advanced Meta Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
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
                      {s.warranty && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
                          {s.warranty}
                        </span>
                      )}
                    </div>

                    {/* Features Preview */}
                    <div className="space-y-1 pt-1 border-t border-white/5">
                      {s.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditService(s)}
                        className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Edit service details & features"
                      >
                        <Edit3 className="w-3 h-3 text-blue-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDuplicateService(s)}
                        className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-zinc-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Clone this service as template"
                      >
                        <Copy className="w-3 h-3 text-zinc-400" />
                        <span className="hidden sm:inline">Clone</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteService(s.id)}
                      className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Delete service from public site"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= SECTION: RECENT CLIENT INQUIRIES & SITES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Incoming Client Inquiries */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#080e1c]/80 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Recent Client Inquiries (/contact)</span>
              </h2>
              <p className="text-xs text-zinc-400">Homeowners seeking feasibility checks and consultations</p>
            </div>
            <Link
              href="/erp/crm"
              className="text-xs text-[#FFB800] hover:underline flex items-center gap-1"
            >
              <span>View All Inquiries</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {websiteInquiries.slice(0, 4).map((inq) => (
              <div
                key={inq.id}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{inq.clientName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold">
                      {inq.projectType}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-3">
                    <span>{inq.phone}</span>
                    <span>•</span>
                    <span>Received: {inq.date}</span>
                    <span>•</span>
                    <span className="text-[#FFB800] font-semibold">{inq.budgetRange}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${inq.phone}`}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                    title="Call Client"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Active Construction Projects in Kandy */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#080e1c]/80 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <HardHat className="w-4 h-4 text-[#FFB800]" />
                <span>Ongoing Construction Sites</span>
              </h2>
              <p className="text-xs text-zinc-400">Live progress across Kandy district</p>
            </div>
            <Link
              href="/erp/projects"
              className="text-xs text-[#FFB800] hover:underline flex items-center gap-1"
            >
              <span>View Sites</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Hanthana Hillside Villa', phase: 'Roof Waterproofing', pct: 82, location: 'Hanthana' },
              { name: 'Victoria Lakefront Retreat', phase: 'Superstructure Framing', pct: 65, location: 'Digana' },
              { name: 'Anniewatte Luxury Residence', phase: 'Foundation & Retaining Walls', pct: 40, location: 'Anniewatte' },
              { name: 'Kandy Commercial Suites', phase: 'Interior M&E Finishing', pct: 90, location: 'Peradeniya Rd' },
            ].map((site, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{site.name}</span>
                    <span className="text-[11px] text-zinc-400">{site.location} • Phase: {site.phase}</span>
                  </div>
                  <span className="font-mono font-bold text-[#FFB800]">{site.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0038B8] to-[#FFB800] rounded-full transition-all duration-500"
                    style={{ width: `${site.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT PUBLIC PROJECT (ADVANCED) ================= */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-3xl bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0038B8]/20 border border-blue-500/30 flex items-center justify-center text-[#FFB800]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingProject ? 'Edit Public Project' : 'Add New Public Project'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Live portfolio display on <span className="text-[#FFB800]">/projects</span> and homepage
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5 text-xs">
              {/* SECTION 1: Core Project Identity */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-bold text-[#FFB800] uppercase tracking-wider block">
                  1. Project Identity &amp; Location
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-zinc-300 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Hanthana Hillside Villa"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Category</label>
                    <select
                      value={projectForm.category || 'Hillside'}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#080f24] border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                    >
                      <option value="Hillside">Hillside Villa</option>
                      <option value="Residential">Residential Luxury</option>
                      <option value="Commercial">Commercial &amp; Hotel</option>
                      <option value="Interior & Turnkey">Interior &amp; Turnkey</option>
                      <option value="Infrastructure">Civil Infrastructure</option>
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
                      placeholder="e.g. Hanthana, Kandy"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Living Floor Area</label>
                    <input
                      type="text"
                      value={projectForm.area || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, area: e.target.value })}
                      placeholder="e.g. 6,400 sq ft"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Completion Year</label>
                    <input
                      type="text"
                      value={projectForm.year || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                      placeholder="e.g. 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Status, Commercial & Engineering Credentials (Advanced) */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-bold text-[#FFB800] uppercase tracking-wider block">
                  2. Status, Warranty &amp; Engineering Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Project Status</label>
                    <select
                      value={projectForm.status || 'COMPLETED'}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          status: e.target.value as 'COMPLETED' | 'UNDER_CONSTRUCTION' | 'DESIGN_PHASE',
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-[#080f24] border border-white/15 text-white focus:outline-none focus:border-[#FFB800]"
                    >
                      <option value="COMPLETED">Completed (Handed Over)</option>
                      <option value="UNDER_CONSTRUCTION">Under Construction (Active Onsite)</option>
                      <option value="DESIGN_PHASE">Design &amp; Approvals Phase</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Contract Valuation (LKR)</label>
                    <input
                      type="text"
                      value={projectForm.contractValue || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, contractValue: e.target.value })}
                      placeholder="e.g. LKR 165M"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Structural Warranty</label>
                    <input
                      type="text"
                      value={projectForm.structuralWarranty || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, structuralWarranty: e.target.value })}
                      placeholder="e.g. 25-Year Foundation Warranty"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Lead Structural Engineer / Architect</label>
                    <input
                      type="text"
                      value={projectForm.leadArchitect || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, leadArchitect: e.target.value })}
                      placeholder="e.g. Chartered Structural Lead"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Foundation Type</label>
                    <input
                      type="text"
                      value={projectForm.foundationType || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, foundationType: e.target.value })}
                      placeholder="e.g. Rock-Anchored Grade 35"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={projectForm.featured ?? false}
                        onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-[#FFB800] focus:ring-0 cursor-pointer"
                      />
                      <span className="font-bold text-white text-xs">Featured on Homepage</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Sustainability & Energy */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-bold text-[#FFB800] uppercase tracking-wider block">
                  3. Solar Power &amp; Sustainability
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Solar Harvest Capacity</label>
                    <input
                      type="text"
                      value={projectForm.solarCapacity || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, solarCapacity: e.target.value })}
                      placeholder="e.g. 42 kW Rooftop Solar System"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Energy Rating Tag</label>
                    <input
                      type="text"
                      value={projectForm.energyRating || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, energyRating: e.target.value })}
                      placeholder="e.g. Eco-Friendly Living"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Media, Story & Description */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-bold text-[#FFB800] uppercase tracking-wider block">
                  4. Visuals &amp; Architectural Story
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">Project Image URL *</label>
                      <input
                        type="text"
                        required
                        value={projectForm.image || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        placeholder="/images/project-alpine.jpg or https://..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">Short Tagline *</label>
                      <input
                        type="text"
                        value={projectForm.tagline || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                        placeholder="e.g. Modern hillside home designed with scenic mountain valley views."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                  </div>

                  {/* Live Thumbnail Preview */}
                  <div>
                    <label className="block font-semibold text-zinc-400 mb-1">Live Image Preview</label>
                    <div className="relative h-28 w-full rounded-xl bg-zinc-900 border border-white/15 overflow-hidden flex items-center justify-center">
                      {projectForm.image ? (
                        <Image
                          src={projectForm.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-[10px] text-zinc-500">No Image Specified</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Detailed Architectural Description</label>
                  <textarea
                    rows={3}
                    value={projectForm.description || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Describe rock-anchor foundations, panoramic glazing, interior finishings, and construction methodologies..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              {/* SECTION 5: Dynamic Highlights Checklist */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#FFB800] uppercase tracking-wider block">
                      5. Engineering Highlights Checklist
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      These bullet points appear in the client detail modal on /projects
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>Add Highlight</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(projectForm.highlights || []).map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-5 text-center text-xs text-[#FFB800] font-bold">✓</span>
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => handleUpdateHighlight(index, e.target.value)}
                        placeholder={`Highlight #${index + 1} (e.g. Infinity pool & wide scenic viewing deck)`}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(index)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Remove highlight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Submit & Cancel Bar */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] text-white font-bold shadow-lg shadow-blue-900/50 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-[#FFB800]" />
                  <span>Save &amp; Publish to /projects</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PUBLIC SERVICE (ADVANCED) ================= */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingService ? 'Edit Public Service' : 'Add New Public Service'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Live service stage offering displayed on <span className="text-emerald-400">/services</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowServiceModal(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-5 text-xs">
              {/* SECTION 1: Service Identity */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  1. Service Identity &amp; Scope
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Stage Badge *</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.badge || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                      placeholder="e.g. STAGE 01"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-zinc-300 mb-1">Service Title *</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.title || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      placeholder="e.g. Architectural Design & Council Approvals"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Full Service Scope Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={serviceForm.desc || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                    placeholder="Explain what is included in this service stage for homeowners and investors..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* SECTION 2: Standards & Pricing (Advanced) */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  2. Standards, Pricing &amp; Timeline
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Starting Price Tier</label>
                    <input
                      type="text"
                      value={serviceForm.startingPrice || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, startingPrice: e.target.value })}
                      placeholder="e.g. From LKR 4,500/sqft"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Estimated Timeline</label>
                    <input
                      type="text"
                      value={serviceForm.timeline || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, timeline: e.target.value })}
                      placeholder="e.g. 3 - 8 Months"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">CIDA / SLS Certification Standard</label>
                    <input
                      type="text"
                      value={serviceForm.cidaStandard || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, cidaStandard: e.target.value })}
                      placeholder="e.g. CIDA CS-2 / SLS 107"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Structural Guarantee</label>
                    <input
                      type="text"
                      value={serviceForm.warranty || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, warranty: e.target.value })}
                      placeholder="e.g. 20-Year Guarantee"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Visual Image */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  3. Service Showcase Image
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-zinc-300 mb-1">Image URL *</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.image || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                      placeholder="/images/hero-main.jpg or https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-400 mb-1">Preview</label>
                    <div className="relative h-20 w-full rounded-xl bg-zinc-900 border border-white/15 overflow-hidden flex items-center justify-center">
                      {serviceForm.image ? (
                        <Image
                          src={serviceForm.image}
                          alt="Service Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-[10px] text-zinc-500">No Image</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Dynamic Features Checklist */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      4. Features &amp; Deliverables Checklist
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Displayed on /services card with checkmarks
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(serviceForm.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-5 text-center text-xs text-emerald-400 font-bold">✓</span>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleUpdateFeature(index, e.target.value)}
                        placeholder={`Feature #${index + 1} (e.g. Council approvals & KMC clearance)`}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Remove feature"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Submit & Cancel Bar */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/50 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Save &amp; Publish to /services</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
