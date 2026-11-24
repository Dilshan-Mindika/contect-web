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
} from 'lucide-react';

export default function ERPDashboardPage() {
  const { user, projects, invoices, leads, websiteInquiries, updateInquiryStatus } = useERP();

  // Public Projects & Services Management State
  const [publicProjects, setPublicProjects] = useState<PublicProject[]>(DEFAULT_PROJECTS);
  const [publicServices, setPublicServices] = useState<PublicService[]>(DEFAULT_SERVICES);
  const [websiteTab, setWebsiteTab] = useState<'PROJECTS' | 'SERVICES'>('PROJECTS');

  // Modal States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<PublicProject | null>(null);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<PublicService | null>(null);

  // Project Form State
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
  });

  // Service Form State
  const [serviceForm, setServiceForm] = useState<Partial<PublicService>>({
    badge: 'NEW STAGE',
    title: '',
    desc: '',
    image: '/images/hero-main.jpg',
    features: ['Professional consultation', 'Council approvals', 'Chartered architect supervision', 'Guaranteed completion'],
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

  // Handlers for Projects
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
      highlights: ['Reinforced foundation on slope', 'Integrated solar power system', 'Turnkey luxury finishes'],
    });
    setShowProjectModal(true);
  };

  const handleOpenEditProject = (p: PublicProject) => {
    setEditingProject(p);
    setProjectForm(p);
    setShowProjectModal(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title) return;

    let updated: PublicProject[];
    if (editingProject) {
      updated = publicProjects.map((p) =>
        p.id === editingProject.id ? ({ ...p, ...projectForm } as PublicProject) : p
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
        energyRating: projectForm.energyRating || 'Eco-Friendly',
        image: projectForm.image || '/images/project-alpine.jpg',
        tagline: projectForm.tagline || 'Custom home built by CONTEC Design & Build.',
        description: projectForm.description || 'Engineered with certified structural foundations.',
        highlights: projectForm.highlights || ['Reinforced concrete', 'Architectural excellence'],
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

  // Handlers for Services
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      badge: `STAGE 0${publicServices.length + 1}`,
      title: '',
      desc: '',
      image: '/images/hero-main.jpg',
      features: ['Professional consultation', 'Council approvals', 'Guaranteed fixed BOQ', '1-year free maintenance'],
    });
    setShowServiceModal(true);
  };

  const handleOpenEditService = (s: PublicService) => {
    setEditingService(s);
    setServiceForm(s);
    setShowServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title) return;

    let updated: PublicService[];
    if (editingService) {
      updated = publicServices.map((s) =>
        s.id === editingService.id ? ({ ...s, ...serviceForm } as PublicService) : s
      );
    } else {
      const newServ: PublicService = {
        id: 'serv-' + Date.now(),
        badge: serviceForm.badge || `STAGE 0${publicServices.length + 1}`,
        title: serviceForm.title || 'New Service',
        desc: serviceForm.desc || 'Turnkey service delivered by CONTEC Design & Build.',
        image: serviceForm.image || '/images/hero-main.jpg',
        features: serviceForm.features || ['Certified engineering', 'Quality assurance'],
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

  // Summary Metrics
  const ongoingProjects = projects.filter((p) => p.phase !== 'HANDOVER').length || 4;
  const newInquiriesCount = websiteInquiries.filter((i) => i.status === 'NEW').length || leads.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0038B8]/20 border border-blue-500/30 text-xs font-semibold text-blue-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CONTEC Staff Dashboard • Kandy Operations</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Welcome back, {user?.name || 'Staff Member'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Department: <span className="text-[#FFB800] font-semibold">{user?.department || 'Executive'}</span> • Manage active construction projects, client inquiries, and public website content.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleOpenAddProject}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold border border-blue-400/40 flex items-center gap-1.5 shadow-md shadow-blue-900/40 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Add Public Project</span>
          </button>

          <button
            onClick={handleOpenAddService}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Service</span>
          </button>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#FFB800] tracking-wider">
              <Globe className="w-4 h-4" />
              <span>Public Website Content Manager</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Manage What Appears on Public Web Pages
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Add, update, or remove projects shown on <span className="text-[#FFB800]">/projects</span> and services shown on <span className="text-[#FFB800]">/services</span>. Updates appear instantly on the live site.
            </p>
          </div>

          {/* Sub-Tabs Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setWebsiteTab('PROJECTS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                websiteTab === 'PROJECTS'
                  ? 'bg-[#0038B8] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Public Projects ({publicProjects.length})
            </button>
            <button
              onClick={() => setWebsiteTab('SERVICES')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                websiteTab === 'SERVICES'
                  ? 'bg-[#0038B8] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Public Services ({publicServices.length})
            </button>
          </div>
        </div>

        {/* TAB 1: Public Projects Manager */}
        {websiteTab === 'PROJECTS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">
                Displaying {publicProjects.length} live showcase projects on /projects
              </span>
              <button
                onClick={handleOpenAddProject}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {publicProjects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-black/50 border border-white/10 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-blue-500/40 transition-all"
                >
                  <div>
                    <div className="relative h-36 w-full bg-zinc-900 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0038B8] text-white shadow-md">
                        {p.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1.5">
                      <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">{p.title}</h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <MapPin className="w-3 h-3 text-[#FFB800] shrink-0" />
                        <span className="truncate">{p.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                        <span>Area: <strong className="text-zinc-200">{p.area}</strong></span>
                        <span>Year: <strong className="text-zinc-200">{p.year}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 pt-2 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <button
                      onClick={() => handleOpenEditProject(p)}
                      className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-blue-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
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

        {/* TAB 2: Public Services Manager */}
        {websiteTab === 'SERVICES' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">
                Displaying {publicServices.length} core service stages on /services
              </span>
              <button
                onClick={handleOpenAddService}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicServices.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl bg-black/50 border border-white/10 p-4 shadow-lg flex flex-col justify-between hover:border-emerald-500/40 transition-all space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                        {s.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{s.desc}</p>

                    <div className="space-y-1 pt-1">
                      {s.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditService(s)}
                      className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-blue-400" />
                      <span>Edit Service</span>
                    </button>
                    <button
                      onClick={() => handleDeleteService(s.id)}
                      className="px-3 py-1 rounded-md bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
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

      {/* ================= MODAL: ADD / EDIT PUBLIC PROJECT ================= */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#FFB800]" />
                <span>{editingProject ? 'Edit Public Project' : 'Add New Public Project'}</span>
              </h3>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={projectForm.title || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Digana Hillside Lake Villa"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={projectForm.location || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    placeholder="e.g. Digana, Kandy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Floor Area</label>
                  <input
                    type="text"
                    value={projectForm.area || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, area: e.target.value })}
                    placeholder="e.g. 5,200 sq ft"
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

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={projectForm.image || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  placeholder="/images/project-alpine.jpg or https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={projectForm.description || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Describe the structural features, architectural style, and engineering highlights..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] text-white font-bold shadow-md shadow-blue-900/40"
                >
                  Save &amp; Update /projects Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PUBLIC SERVICE ================= */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>{editingService ? 'Edit Public Service' : 'Add New Public Service'}</span>
              </h3>
              <button
                onClick={() => setShowServiceModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Stage Badge</label>
                  <input
                    type="text"
                    value={serviceForm.badge || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                    placeholder="e.g. STAGE 06"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-zinc-300 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    placeholder="e.g. Solar Power & Hillside Retaining Walls"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={serviceForm.desc || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                  placeholder="Explain what is included in this service for clients..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold shadow-md shadow-emerald-900/40"
                >
                  Save &amp; Update /services Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
