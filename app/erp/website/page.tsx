"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useERP } from '@/lib/erp/AuthContext';
import {
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function WebsiteManagementPage() {
  const {
    websiteProjects,
    addWebsiteProject,
    deleteWebsiteProject,
    websiteInquiries,
    updateInquiryStatus,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'INQUIRIES' | 'SETTINGS'>('PROJECTS');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // Form State for new showcase project
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Commercial High-Rise');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('');
  const completionYear = '2026';
  const [featured, setFeatured] = useState(true);

  const handleCreateWebsiteProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addWebsiteProject({
      title,
      category,
      location: location || 'Colombo Financial City',
      imageUrl,
      description: description || 'Parametric luxury structural development engineered by CONTEC.',
      completionYear,
      featured,
    });
    setTitle('');
    setDescription('');
    setShowAddProjectModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>Website Management & Corporate CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Public Website CMS & Inbound Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Manage showcase portfolio items, review client requests from /contact, and configure corporate contact channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Open Public Site</span>
          </Link>

          <button
            onClick={() => setShowAddProjectModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold shadow-lg shadow-blue-900/40 border border-blue-400/40 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-[#FFB800]" />
            <span>Add Showcase Project</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 self-start w-fit">
        <button
          onClick={() => setActiveTab('PROJECTS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'PROJECTS'
              ? 'bg-[#0038B8] text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Portfolio Showcase ({websiteProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('INQUIRIES')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'INQUIRIES'
              ? 'bg-[#0038B8] text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>Incoming Web Inquiries ({websiteInquiries.length})</span>
          {websiteInquiries.some((i) => i.status === 'NEW') && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'SETTINGS'
              ? 'bg-[#0038B8] text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Company Information & Channels
        </button>
      </div>

      {/* TAB 1: Portfolio Showcase Projects */}
      {activeTab === 'PROJECTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websiteProjects.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-[#080e1c]/85 border border-white/10 overflow-hidden shadow-lg group hover:border-[#FFB800]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.featured && (
                    <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFB800] text-black font-extrabold shadow-md">
                      Featured on Homepage
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-white border border-white/20">
                    {p.completionYear}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-[11px] font-mono text-blue-300 uppercase tracking-wider">
                    {p.category}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#FFB800] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="text-[11px] text-zinc-500 pt-1">
                    Location: {p.location}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-mono">Live on Public Site</span>
                <button
                  onClick={() => deleteWebsiteProject(p.id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Remove from public showcase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Incoming Inquiries */}
      {activeTab === 'INQUIRIES' && (
        <div className="rounded-2xl bg-[#080e1c]/85 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-zinc-400 font-mono text-[11px] border-b border-white/10 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Inquiry Date</th>
                  <th className="py-3.5 px-4">Client Contact</th>
                  <th className="py-3.5 px-4">Project Typology</th>
                  <th className="py-3.5 px-4">Target Budget</th>
                  <th className="py-3.5 px-4 max-w-xs">Message Scope</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {websiteInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-zinc-400 whitespace-nowrap">
                      {inq.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{inq.clientName}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{inq.email}</div>
                      <div className="text-[10px] text-zinc-500">{inq.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-blue-300 font-medium">
                      {inq.projectType}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#FFB800]">
                      {inq.budgetRange}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-zinc-300 leading-snug">
                      {inq.message}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          inq.status === 'NEW'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : inq.status === 'CONTACTED'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {inq.status === 'NEW' ? (
                        <button
                          onClick={() => updateInquiryStatus(inq.id, 'CONTACTED')}
                          className="px-3 py-1.5 rounded-lg bg-[#0038B8] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors"
                        >
                          Mark Contacted
                        </button>
                      ) : (
                        <span className="text-[11px] text-zinc-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Company Settings & Contact Channels */}
      {activeTab === 'SETTINGS' && (
        <div className="max-w-2xl p-6 rounded-2xl bg-[#080e1c]/85 border border-white/10 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">Public Corporate Information</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Reflected dynamically in the header, footer, and consultation booking forms.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Company Registered Name</label>
              <input
                type="text"
                readOnly
                value="CONTEC Design & Build (Pvt) Ltd."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Corporate Head Office Address</label>
              <input
                type="text"
                readOnly
                value="No. 167, George E. De Silva Mawatha, Kandy, Sri Lanka, 20000"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Direct Hotline / WhatsApp</label>
                <input
                  type="text"
                  readOnly
                  value="+94 77 781 2141"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#FFB800] font-mono cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Official Email Inquiries</label>
                <input
                  type="text"
                  readOnly
                  value="conteckandy@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Showcase Project */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="w-full max-w-lg bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFB800]" />
                <span>Publish New Website Showcase Project</span>
              </h3>
              <button onClick={() => setShowAddProjectModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWebsiteProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apex Marine Harbor Towers"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="Commercial High-Rise">Commercial High-Rise</option>
                    <option value="Luxury Residential">Luxury Residential</option>
                    <option value="Civil Infrastructure">Civil Infrastructure</option>
                    <option value="Hospitality & Eco-Resorts">Hospitality & Eco-Resorts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kandy Hillside Sanctuary"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Architectural Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Highlight parametric form, mass timber elements, or energy credentials..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-[#0038B8]"
                />
                <label htmlFor="featured" className="text-xs text-zinc-300">
                  Feature prominently on Homepage Hero Portfolio
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0038B8] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-blue-900/40"
                >
                  Publish to Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

