"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { MachineryStatus } from '@/lib/erp/types';
import {
  Wrench,
  Search,
  Fuel,
  Clock,
  MapPin,
  User,
  Calendar,
} from 'lucide-react';

export default function MachineryPage() {
  const { machinery, updateMachineryStatus } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    'ALL',
    'TOWER_CRANE',
    'EXCAVATOR',
    'BOOM_PUMP',
    'BULLDOZER',
    'GENERATOR',
  ];

  const filteredMachinery = machinery.filter((m) => {
    const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.assignedSite.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const operationalCount = machinery.filter((m) => m.status === 'OPERATIONAL').length;
  const maintenanceCount = machinery.filter((m) => m.status === 'MAINTENANCE').length;
  const totalFleetHours = machinery.reduce((acc, m) => acc + m.operatingHours, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <Wrench className="w-4 h-4" />
            <span>Heavy Plant & Machinery Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Equipment Fleet Telemetry & Service Logs
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Monitor high-capacity tower cranes, hydraulic excavators, concrete pumps, fuel levels, and maintenance cycles.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Machinery Assets</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {machinery.length} Heavy Units
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Liebherr, Caterpillar, Putzmeister, Komatsu
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Operational Readiness</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {Math.round((operationalCount / (machinery.length || 1)) * 100)}%
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            {operationalCount} Units Active on Site
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Fleet Cumulative Operating Hours</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            {totalFleetHours.toLocaleString()} Hrs
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {maintenanceCount} Unit in Scheduled Overhaul
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0038B8] text-white'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search equipment ID or site..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFB800]"
          />
        </div>
      </div>

      {/* Machinery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMachinery.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#080e1c]/85 border border-white/10 space-y-4 hover:border-blue-500/30 transition-all shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {item.assetId}
                </span>
                <h3 className="font-bold text-white text-sm mt-1.5 line-clamp-1">{item.name}</h3>
              </div>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                  item.status === 'OPERATIONAL'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : item.status === 'MAINTENANCE'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* Operating Details */}
            <div className="space-y-2 text-xs text-zinc-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Site:</span>
                </span>
                <span className="font-semibold text-white truncate max-w-[170px]">
                  {item.assignedSite}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Operator:</span>
                </span>
                <span className="font-medium text-white">{item.operatorName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Running Hours:</span>
                </span>
                <span className="font-mono font-bold text-white">
                  {item.operatingHours.toLocaleString()} hrs
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Next Service:</span>
                </span>
                <span className="font-mono text-zinc-300">{item.nextServiceDate}</span>
              </div>
            </div>

            {/* Fuel Level Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-[#FFB800]" />
                  <span>Diesel Fuel Tank:</span>
                </span>
                <span className="font-mono font-bold text-white">{item.fuelCapacityPct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.fuelCapacityPct > 50
                      ? 'bg-emerald-400'
                      : item.fuelCapacityPct > 20
                      ? 'bg-amber-400'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${item.fuelCapacityPct}%` }}
                />
              </div>
            </div>

            {/* Quick Status Selector */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-zinc-400 text-[11px]">Operational State:</span>
              <select
                value={item.status}
                onChange={(e) => updateMachineryStatus(item.id, e.target.value as MachineryStatus)}
                className="bg-black/80 border border-white/15 text-[11px] rounded px-2 py-1 text-white focus:outline-none"
              >
                <option value="OPERATIONAL">Operational</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="STANDBY">Standby</option>
                <option value="REPAIR">Repair</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

