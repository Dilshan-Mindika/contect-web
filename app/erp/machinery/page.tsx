"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { MachineryStatus } from '@/lib/erp/types';
import { formatLKR, formatLKRFull } from '@/lib/erp/currency';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import CustomSelect from '@/components/erp/CustomSelect';
import {
  Wrench,
  Search,
  Fuel,
  Clock,
  MapPin,
  User,
  Calendar,
  Radio,
  Coins,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Building2,
  DollarSign,
} from 'lucide-react';

export default function MachineryPage() {
  const {
    machinery,
    addMachinery,
    updateMachinery,
    deleteMachinery,
    updateMachineryStatus,
    fuelLogs,
    addFuelLog,
    activeCompany,
    projects,
    companies,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'FLEET' | 'FUEL' | 'ALLOCATION' | 'MAINTENANCE'>('FLEET');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);

  // Asset Registration Form
  const [assetName, setAssetName] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [assetCat, setAssetCat] = useState<'TOWER_CRANE' | 'EXCAVATOR' | 'BOOM_PUMP' | 'BULLDOZER' | 'GENERATOR'>('EXCAVATOR');
  const [assetSite, setAssetSite] = useState(projects[0]?.name || 'Hanthana Hillside Site');
  const [assetOperator, setAssetOperator] = useState('');
  const [assetSerial, setAssetSerial] = useState('');
  const [assetHireRate, setAssetHireRate] = useState(95000);
  const [assetFuelPct, setAssetFuelPct] = useState(100);
  const [assetHours, setAssetHours] = useState(0);
  const [assetServiceDate, setAssetServiceDate] = useState('2026-12-30');
  const [assetInsuranceExpiry, setAssetInsuranceExpiry] = useState('2027-06-30');

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName) return;
    (addMachinery as (a: Record<string, unknown>) => void)({
      companyId: 'COMP_B',
      assetId: assetCode || `CNT-EQ-${Math.floor(100 + Math.random() * 900)}`,
      name: assetName,
      category: assetCat,
      assignedSite: assetSite,
      operatorName: assetOperator || 'Assigned Operator',
      serialNumber: assetSerial,
      dailyHireRateLkr: Number(assetHireRate),
      fuelCapacityPct: Number(assetFuelPct),
      operatingHours: Number(assetHours),
      nextServiceDate: assetServiceDate,
      insuranceExpiry: assetInsuranceExpiry,
      status: 'OPERATIONAL',
    });
    setAssetName('');
    setAssetCode('');
    setAssetSerial('');
    setShowAssetModal(false);
  };

  // Fuel Form
  const [fuelMachineryId, setFuelMachineryId] = useState(machinery[0]?.id || 'eq-01');
  const [fuelLiters, setFuelLiters] = useState(250);
  const [fuelProject, setFuelProject] = useState(projects[0]?.code || 'CNT-PRJ-241');
  const [fuelHours, setFuelHours] = useState(4850);

  const categories = [
    'ALL',
    'TOWER_CRANE',
    'EXCAVATOR',
    'BOOM_PUMP',
    'BULLDOZER',
    'GENERATOR',
    'TIPPER_TRUCK',
  ];

  const filteredMachinery = machinery.filter((m) => {
    const matchesCompany = activeCompany === 'CONSOLIDATED' || !m.companyId || m.companyId === activeCompany;
    const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.assignedSite.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCompany && matchesCat && matchesSearch;
  });

  const operationalCount = filteredMachinery.filter((m) => m.status === 'OPERATIONAL').length;
  const maintenanceCount = filteredMachinery.filter((m) => m.status === 'MAINTENANCE').length;
  const totalFleetHours = filteredMachinery.reduce((acc, m) => acc + m.operatingHours, 0);
  const totalDailyFleetCostLkr = filteredMachinery.reduce((acc, m) => acc + (m.dailyHireRateLkr || 95000), 0);

  const handleRecordFuel = (e: React.FormEvent) => {
    e.preventDefault();
    const mac = machinery.find((m) => m.id === fuelMachineryId) || machinery[0];
    const cost = Number(fuelLiters) * 370;

    addFuelLog({
      machineryId: mac.id,
      companyId: mac.companyId || 'COMP_B',
      assetId: mac.assetId,
      date: new Date().toISOString().split('T')[0],
      litersIssued: Number(fuelLiters),
      fuelRatePerLiterLkr: 370,
      totalFuelCostLkr: cost,
      odometerOrHours: Number(fuelHours),
      projectId: fuelProject,
    });

    setShowFuelModal(false);
  };

  const currentComp = companies.find((c) => c.id === activeCompany);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Machinery & Equipment Fleet
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Manage heavy plant, Auto Diesel fuel burn (@ LKR 370/L), service schedules, daily hire rates, and equipment cost allocation for {activeCompany === 'CONSOLIDATED' ? 'All Companies' : currentComp?.tradeName}.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setShowFuelModal(true)}
            className="h-10 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-[#FFB800] text-xs font-bold border border-amber-500/35 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer"
          >
            <Fuel className="w-4 h-4" />
            <span>Record Fuel Tanker Discharge</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Fleet Assets</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {filteredMachinery.length} Heavy Units
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            {operationalCount} Units Field Active • {maintenanceCount} In Yard
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Cumulative Fleet Hours</span>
          <div className="text-2xl font-extrabold text-blue-300 mt-1">
            {totalFleetHours.toLocaleString()} Hours
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Telemetry GPS Synced
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Daily Fleet Revenue Capacity</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            {formatLKR(totalDailyFleetCostLkr)} / day
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Wet & Dry Hire Rates in LKR
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Automotive Diesel Tariff</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            LKR 370 / L
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Official Ceylon Petroleum Standard
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {[
          { key: 'FLEET', label: '01. Heavy Fleet Registry', icon: Wrench },
          { key: 'FUEL', label: '02. Diesel Fuel Telematics (@ LKR 370/L)', icon: Fuel },
          { key: 'ALLOCATION', label: '03. Project Allocation & Inter-Company Hire', icon: Building2 },
          { key: 'MAINTENANCE', label: '04. Preventive Service & Licences', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600/30 border border-blue-400 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFB800]' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: FLEET REGISTRY */}
      {activeTab === 'FLEET' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <UniversalRecordManager
            title="Machinery Fleet Directory (Create, View, Edit, Delete & View Modes)"
            items={(selectedCategory === 'ALL' ? filteredMachinery : filteredMachinery.filter((m) => m.category === selectedCategory)) as unknown as Record<string, unknown>[]}
            createLabel="New Fleet Asset"
            searchPlaceholder="Search machinery by name, asset ID, site..."
            sortOptions={[
              { value: 'name', label: 'Equipment Name' },
              { value: 'assetId', label: 'Asset ID' },
              { value: 'operatingHours', label: 'Operating Hours' },
              { value: 'status', label: 'Status' },
            ]}
            fields={[
              { key: 'name', label: 'Equipment Name', isTitle: true, required: true },
              { key: 'assetId', label: 'Asset ID', required: true },
              { key: 'category', label: 'Category', type: 'select', options: ['EXCAVATOR', 'TOWER_CRANE', 'BOOM_PUMP', 'BULLDOZER', 'GENERATOR'] },
              { key: 'assignedSite', label: 'Assigned Site' },
              { key: 'operatorName', label: 'Operator' },
              { key: 'operatingHours', label: 'Hours', type: 'number' },
              { key: 'dailyHireRateLkr', label: 'Daily Rate (LKR)', type: 'number', isCurrency: true, showInTable: false, optional: true },
              { key: 'makeModel', label: 'Make & Model (e.g. CAT 320D)', showInTable: false, optional: true },
              { key: 'serialNo', label: 'Chassis / Serial Number', showInTable: false, optional: true },
              { key: 'registrationNo', label: 'Registration / Plate #', showInTable: false, optional: true },
              { key: 'ownershipType', label: 'Ownership', type: 'select', options: ['OWNED', 'HIRED', 'LEASED'], showInTable: false, optional: true },
              { key: 'fuelCapacityLiters', label: 'Fuel Tank (Liters)', type: 'number', showInTable: false, optional: true },
              { key: 'fuelBurnPerHr', label: 'Avg Burn (L/hr)', type: 'number', showInTable: false, optional: true },
              { key: 'nextServiceHours', label: 'Next Service Due (Hrs)', type: 'number', showInTable: false, optional: true },
              { key: 'insuranceExpiry', label: 'Insurance & Revenue License Expiry', type: 'date', showInTable: false, optional: true },
              { key: 'status', label: 'Status', type: 'select', options: ['OPERATIONAL', 'MAINTENANCE', 'STANDBY', 'REPAIR'], isBadge: true },
              { key: 'images', label: 'Fleet & Logbook Photos', type: 'images', showInTable: false, optional: true },
            ]}
            onCreate={(d) => addMachinery(d as Parameters<typeof addMachinery>[0])}
            onUpdate={(id, d) => updateMachinery(id, d)}
            onDelete={(id) => deleteMachinery(id)}
            renderRowActions={(item) => {
              const id = String(item.id || '');
              const st = String(item.status || '');
              return st !== 'OPERATIONAL' ? (
                <button
                  type="button"
                  onClick={() => updateMachineryStatus(id, 'OPERATIONAL')}
                  className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[10px] font-bold cursor-pointer"
                >
                  Set Active
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => updateMachineryStatus(id, 'MAINTENANCE')}
                  className="px-2 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 text-[10px] font-bold cursor-pointer"
                >
                  Service
                </button>
              );
            }}
          />
        </div>
      )}

      {/* TAB 2: FUEL LOGS */}
      {activeTab === 'FUEL' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#080e1c] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5 text-zinc-400 border-b border-white/10 font-mono">
                  <tr>
                    <th className="p-3">Discharge Date</th>
                    <th className="p-3">Asset ID & Machine</th>
                    <th className="p-3">Mega-Site</th>
                    <th className="p-3 text-right">Liters Issued</th>
                    <th className="p-3 text-right">Tariff (LKR/L)</th>
                    <th className="p-3 text-right">Total Fuel Cost (LKR)</th>
                    <th className="p-3 text-right">Engine Meter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {fuelLogs.map((fl) => (
                    <tr key={fl.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 text-zinc-400">{fl.date}</td>
                      <td className="p-3 font-bold text-white">{fl.assetId}</td>
                      <td className="p-3 text-blue-300">{fl.projectId}</td>
                      <td className="p-3 text-right text-white font-bold">{fl.litersIssued} L</td>
                      <td className="p-3 text-right text-zinc-300">Rs. {fl.fuelRatePerLiterLkr}/L</td>
                      <td className="p-3 text-right text-amber-400 font-bold">{formatLKR(fl.totalFuelCostLkr)}</td>
                      <td className="p-3 text-right text-zinc-400">{fl.odometerOrHours} hrs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECT ALLOCATION */}
      {activeTab === 'ALLOCATION' && (
        <div className="p-6 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-base">Inter-Company Machinery Hire & Fleet Mobilization</h3>
          <p className="text-xs text-zinc-400">
            Company B (Heavy Plant & Equipment) leases specialized tower cranes, hydraulic excavators, and concrete pumps to Company A mega-sites under approved wet/dry commercial plant hire agreements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {filteredMachinery.map((m) => (
              <div key={m.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-white">{m.assetId}</span>
                  <span className="text-[#FFB800]">{formatLKR(m.dailyHireRateLkr || 95000)}/day</span>
                </div>
                <div className="text-zinc-300 font-bold">{m.name}</div>
                <div className="text-[10px] text-zinc-400">Deployed: {m.assignedSite}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PREVENTIVE MAINTENANCE */}
      {activeTab === 'MAINTENANCE' && (
        <div className="p-6 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-base">Preventive Maintenance Schedules & Regulatory Licences</h3>
          <p className="text-xs text-zinc-400">
            Heavy plant equipment requires mandatory 250-hour engine oil changes, hydraulic filter overhauls, and annual Department of Motor Traffic (DMT) revenue license renewals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredMachinery.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-white">{m.name} ({m.assetId})</span>
                  <span className="text-[10px] font-mono text-emerald-400">Licence Valid</span>
                </div>
                <div className="text-zinc-400 flex justify-between">
                  <span>Next Scheduled Preventive Service:</span>
                  <span className="font-mono text-amber-300 font-bold">{m.nextServiceDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FUEL DISCHARGE MODAL */}
      {showFuelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Fuel className="w-4 h-4 text-[#FFB800]" />
                <span>Record Diesel Tanker Discharge</span>
              </h3>
              <button onClick={() => setShowFuelModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleRecordFuel} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Target Plant Asset</label>
                <CustomSelect
                  value={fuelMachineryId}
                  onChange={setFuelMachineryId}
                  options={filteredMachinery.map((m) => ({ value: m.id, label: `${m.assetId} - ${m.name}` }))}
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Discharge Liters</label>
                <input
                  type="number"
                  value={fuelLiters}
                  onChange={(e) => setFuelLiters(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Mega-Site</label>
                  <CustomSelect
                    value={fuelProject}
                    onChange={setFuelProject}
                    options={projects.map((p) => p.code)}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Current Hour Meter</label>
                  <input
                    type="number"
                    value={fuelHours}
                    onChange={(e) => setFuelHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono">
                <div className="text-zinc-400">Total Fuel Cost Debit:</div>
                <div className="text-lg font-extrabold text-[#FFB800]">{formatLKR(Number(fuelLiters) * 370)}</div>
                <div className="text-zinc-400 text-[10px]">Calculation: {fuelLiters} Liters × LKR 370.00 / L</div>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFuelModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                >
                  Confirm Fuel Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Fleet Asset Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#FFB800]" />
                <span>Register Heavy Machinery / Fleet Asset</span>
              </h3>
              <button onClick={() => setShowAssetModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleRegisterAsset} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Caterpillar 320D Excavator"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Asset ID / Fleet Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CNT-EXC-04"
                    value={assetCode}
                    onChange={(e) => setAssetCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Category</label>
                  <CustomSelect
                    value={assetCat}
                    onChange={(val) => setAssetCat(val as typeof assetCat)}
                    options={[
                      { value: 'EXCAVATOR', label: 'Excavator' },
                      { value: 'TOWER_CRANE', label: 'Tower Crane' },
                      { value: 'BOOM_PUMP', label: 'Concrete Boom Pump' },
                      { value: 'BULLDOZER', label: 'Bulldozer' },
                      { value: 'GENERATOR', label: 'Heavy Generator' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Assigned Site</label>
                  <input
                    type="text"
                    value={assetSite}
                    onChange={(e) => setAssetSite(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Operator Name</label>
                  <input
                    type="text"
                    placeholder="e.g. K. Bandara (Licensed)"
                    value={assetOperator}
                    onChange={(e) => setAssetOperator(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Chassis / Serial Number</label>
                  <input
                    type="text"
                    placeholder="e.g. CAT0320D-99812"
                    value={assetSerial}
                    onChange={(e) => setAssetSerial(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Daily Hire Rate (LKR)</label>
                  <input
                    type="number"
                    value={assetHireRate}
                    onChange={(e) => setAssetHireRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Fuel Level (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={assetFuelPct}
                    onChange={(e) => setAssetFuelPct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Hour Meter</label>
                  <input
                    type="number"
                    value={assetHours}
                    onChange={(e) => setAssetHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Next Service Date</label>
                  <input
                    type="date"
                    value={assetServiceDate}
                    onChange={(e) => setAssetServiceDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Insurance / Emission Expiry</label>
                  <input
                    type="date"
                    value={assetInsuranceExpiry}
                    onChange={(e) => setAssetInsuranceExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssetModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0038B8] hover:bg-[#1D4ED8] text-white font-bold text-xs cursor-pointer"
                >
                  Save Fleet Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
