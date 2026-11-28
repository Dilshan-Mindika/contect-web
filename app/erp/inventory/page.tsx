"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { formatLKR, formatLKRFull } from '@/lib/erp/currency';
import ModuleAnalytics from '@/components/erp/ModuleAnalytics';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import CustomSelect from '@/components/erp/CustomSelect';
import {
  Boxes,
  Plus,
  Search,
  Truck,
  FileCheck,
  AlertTriangle,
  Building2,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function InventoryPage() {
  const {
    inventory,
    adjustStock,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    stores,
    materialIssueNotes,
    addMaterialIssueNote,
    activeCompany,
    projects,
    companies,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'STOCK' | 'STORES' | 'MIN' | 'TRANSFER'>('STOCK');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMinModal, setShowMinModal] = useState(false);

  // MIN Form State
  const [minProjectCode, setMinProjectCode] = useState(projects[0]?.code || 'CNT-PRJ-241');
  const [minStoreCode, setMinStoreCode] = useState('ST-PORTCITY');
  const [minReceiver, setMinReceiver] = useState('Eng. Samantha Weerasinghe');
  const [minSku, setMinSku] = useState(inventory[0]?.sku || 'STEEL-RB-500B');
  const [minQty, setMinQty] = useState(10);

  const filteredInventory = inventory.filter((item) => {
    const matchesCompany = activeCompany === 'CONSOLIDATED' || !item.companyId || item.companyId === activeCompany;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCompany && matchesSearch;
  });

  const filteredStores = stores.filter(
    (st) => activeCompany === 'CONSOLIDATED' || st.companyId === activeCompany
  );

  const filteredMins = materialIssueNotes.filter(
    (min) => activeCompany === 'CONSOLIDATED' || min.companyId === activeCompany
  );

  const totalInventoryValuation = filteredInventory.reduce(
    (acc, it) => acc + it.quantity * it.unitCost,
    0
  );

  const lowStockCount = filteredInventory.filter(
    (it) => it.status === 'LOW_STOCK' || it.status === 'CRITICAL'
  ).length;

  const handleCreateMin = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find((i) => i.sku === minSku) || inventory[0];
    const unitRate = item.unitCost;
    const amount = Number(minQty) * unitRate;

    addMaterialIssueNote({
      companyId: activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany,
      storeCode: minStoreCode,
      projectId: projects.find((p) => p.code === minProjectCode)?.id || 'prj-01',
      projectCode: minProjectCode,
      issueDate: new Date().toISOString().split('T')[0],
      storekeeperName: 'T. M. Nazeer (Storekeeper)',
      receiverName: minReceiver,
      items: [
        {
          itemSku: item.sku,
          name: item.name,
          qtyIssued: Number(minQty),
          unit: item.unit,
          unitRateLkr: unitRate,
          amountLkr: amount,
        },
      ],
      totalMaterialCostLkr: amount,
    });

    setShowMinModal(false);
  };

  const currentComp = companies.find((c) => c.id === activeCompany);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Materials & Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Monitor Tor steel rebar, Tokyo Super cement, M-sand, multi-store stock transfers, and Material Issue Notes (MIN) for {activeCompany === 'CONSOLIDATED' ? 'All Companies' : currentComp?.tradeName}.
          </p>
        </div>

        <button
          onClick={() => setShowMinModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold shadow-lg border border-blue-400/30 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#FFB800]" />
          <span>Issue Material Note (MIN)</span>
        </button>
      </div>

      {/* Stat Boxes, Graph View & CSV/Print Reports */}
      <ModuleAnalytics
        title="Inventory Stockpile Analytics & Reports"
        stats={[
          {
            label: 'Stockpile Valuation',
            value: formatLKR(totalInventoryValuation, true),
            subtitle: `${filteredInventory.length} tracked SKUs`,
            accent: 'blue',
            icon: <Boxes className="w-4 h-4" />,
          },
          {
            label: 'Low / Critical Stock',
            value: `${lowStockCount} Items`,
            subtitle: 'Below minimum threshold',
            accent: lowStockCount > 0 ? 'amber' : 'emerald',
            icon: <AlertTriangle className="w-4 h-4" />,
          },
          {
            label: 'Active Warehouse Stores',
            value: filteredStores.length,
            subtitle: 'Site & central yards',
            accent: 'gold',
            icon: <Building2 className="w-4 h-4" />,
          },
          {
            label: 'Material Issue Notes',
            value: filteredMins.length,
            subtitle: 'Dispatched to sites',
            accent: 'purple',
            icon: <FileCheck className="w-4 h-4" />,
          },
        ]}
        reportFilename="contec-inventory-stock"
        showModeToggle={false}
        reportRows={filteredInventory.map((it) => ({
          SKU: it.sku,
          Material: it.name,
          Category: it.category,
          Quantity: it.quantity,
          Unit: it.unit,
          UnitCostLKR: it.unitCost,
          TotalValueLKR: it.quantity * it.unitCost,
          Status: it.status,
        }))}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Stockpile Valuation</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatLKR(totalInventoryValuation, true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Across {filteredStores.length} Storage Depots
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Active Storage Network</span>
          <div className="text-2xl font-extrabold text-blue-300 mt-1">
            {filteredStores.length} Stores
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Bonded Warehouses & Site Stores
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Reorder Stock Alerts</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            {lowStockCount} Items Low
          </div>
          <span className="text-[11px] text-amber-400/80 mt-1 block">
            Below Buffer Safety Threshold
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Valuation Policy (LKAS 2)</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            {currentComp?.inventoryValuation || 'FIFO'}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            First-In, First-Out Method
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {[
          { key: 'STOCK', label: '01. Material Master Stockpiles', icon: Boxes },
          { key: 'STORES', label: '02. Multi-Store Depots & Site Stores', icon: Building2 },
          { key: 'MIN', label: '03. Material Issue Notes (MIN)', icon: FileText },
          { key: 'TRANSFER', label: '04. Inter-Store Transfers & Wastage', icon: Truck },
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

      {/* TAB 1: MATERIAL MASTER */}
      {activeTab === 'STOCK' && (
        <div className="space-y-4">
          <UniversalRecordManager
            title="Materials Stock"
            defaultViewMode="DETAILED"
            items={filteredInventory as unknown as Record<string, unknown>[]}
            createLabel="Add Material"
            searchPlaceholder="Search SKU, steel, cement, depot..."
            sortOptions={[
              { value: 'name', label: 'Material Name' },
              { value: 'quantity', label: 'Quantity' },
              { value: 'unitCost', label: 'Unit Cost' },
              { value: 'status', label: 'Stock Status' },
            ]}
            fields={[
              { key: 'name', label: 'Material Name', isTitle: true, required: true },
              { key: 'sku', label: 'SKU Code', required: true },
              { key: 'category', label: 'Category', required: true },
              { key: 'quantity', label: 'Quantity', type: 'number', required: true },
              { key: 'unit', label: 'Unit', required: true },
              { key: 'unitCost', label: 'Unit Cost (LKR)', type: 'number', isCurrency: true },
              { key: 'minThreshold', label: 'Min Threshold', type: 'number', showInTable: false, optional: true },
              { key: 'warehouseLocation', label: 'Store / Yard Location', showInTable: false, optional: true },
              { key: 'qualityStandard', label: 'Quality Standard (SLS/BS/ASTM)', showInTable: false, optional: true },
              { key: 'millTestCertificateNo', label: 'Mill Test Cert (MTC) #', showInTable: false, optional: true },
              { key: 'batchNumber', label: 'Batch / Heat Number', showInTable: false, optional: true },
              { key: 'primarySupplier', label: 'Approved Supplier', showInTable: false, optional: true },
              { key: 'binRackCode', label: 'Bin / Rack Code', showInTable: false, optional: true },
              { key: 'reorderLeadDays', label: 'Lead Time (Days)', type: 'number', showInTable: false, optional: true },
              { key: 'expiryDate', label: 'Shelf-Life / Expiry Date', type: 'date', showInTable: false, optional: true },
              { key: 'status', label: 'Status', type: 'select', options: ['OPTIMAL', 'LOW_STOCK', 'CRITICAL'], isBadge: true },
              { key: 'images', label: 'Material & MTC Certificate Photos', type: 'images', showInTable: false, optional: true },
            ]}
            onCreate={(d) => addInventoryItem(d as Parameters<typeof addInventoryItem>[0])}
            onUpdate={(id, d) => updateInventoryItem(id, d)}
            onDelete={(id) => deleteInventoryItem(id)}
            renderRowActions={(item) => {
              const id = String(item.id || '');
              return (
                <>
                  <button
                    type="button"
                    onClick={() => adjustStock(id, -10)}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 text-[10px] font-mono cursor-pointer"
                    title="Decrement 10 units"
                  >
                    -10
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustStock(id, 10)}
                    className="px-2 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[10px] font-bold font-mono cursor-pointer"
                    title="Increment 10 units"
                  >
                    +10
                  </button>
                </>
              );
            }}
          />
        </div>
      )}

      {/* TAB 2: MULTI-STORE DEPOTS */}
      {activeTab === 'STORES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStores.map((store) => (
            <div key={store.id} className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {store.storeCode}
                  </span>
                  <h3 className="font-bold text-white text-base mt-1">{store.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFB800]/20 text-[#FFB800]">
                  {store.storeType === 'CENTRAL_WAREHOUSE' ? 'Central Bonded Depot' : 'Site Stockyard'}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Physical Location:</span>
                  <span className="text-white font-medium">{store.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Designated Storekeeper:</span>
                  <span className="text-white font-medium">{store.storekeeperName}</span>
                </div>
                <div className="flex justify-between py-1 pt-2 font-bold text-sm">
                  <span className="text-zinc-300">Total Yard Stock Valuation:</span>
                  <span className="font-mono text-emerald-400">{formatLKR(store.totalValueLkr)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MATERIAL ISSUE NOTES (MIN) */}
      {activeTab === 'MIN' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300">
            <strong>Direct Project Cost Accounting Rule:</strong> Issuing materials immediately decrements store quantity balance and automatically posts a direct material expense debit into the target Mega-Project Cost Code.
          </div>

          <div className="space-y-3">
            {filteredMins.map((min) => (
              <div key={min.id} className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base">{min.minNumber}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        Site: {min.projectCode}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">Date: {min.issueDate}</span>
                    </div>
                    <div className="text-xs text-zinc-300 mt-1">Store: {min.storeCode} • Issued by: {min.storekeeperName} • Received by: {min.receiverName}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase">Material Cost Debited</span>
                    <div className="text-base font-extrabold text-[#FFB800] font-mono">{formatLKR(min.totalMaterialCostLkr)}</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left font-mono">
                    <thead className="text-zinc-400 border-b border-white/5">
                      <tr>
                        <th className="pb-1 text-left">SKU Code & Material</th>
                        <th className="pb-1 text-right">Qty Issued</th>
                        <th className="pb-1 text-right">Unit Rate (LKR)</th>
                        <th className="pb-1 text-right">Total Debit (LKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {min.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-1.5 font-sans font-bold text-white">{it.name} ({it.itemSku})</td>
                          <td className="py-1.5 text-right text-emerald-400 font-bold">{it.qtyIssued} {it.unit}</td>
                          <td className="py-1.5 text-right text-zinc-300">{formatLKR(it.unitRateLkr)}</td>
                          <td className="py-1.5 text-right text-[#FFB800] font-bold">{formatLKR(it.amountLkr)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TRANSFERS & WASTAGE */}
      {activeTab === 'TRANSFER' && (
        <div className="p-6 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-base">Store-to-Site Transfer Protocol & Wastage Tolerance</h3>
          <p className="text-xs text-zinc-400">
            All materials transferred between central stockpiles and project sites are sealed under Gate Pass authorization. Maximum allowable construction wastage tolerance is capped at <strong>2.5% on Rebar cutting</strong> and <strong>1.5% on Bulk Cement</strong>.
          </p>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-300">
            Current site cutting scrap is collected and recycled under CIDA green building specifications.
          </div>
        </div>
      )}

      {/* ISSUE MIN MODAL */}
      {showMinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FFB800]" />
                <span>Issue Material Note (MIN)</span>
              </h3>
              <button onClick={() => setShowMinModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateMin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Target Project Site</label>
                <CustomSelect
                  value={minProjectCode}
                  onChange={setMinProjectCode}
                  options={projects.map((p) => ({ value: p.code, label: `${p.code} - ${p.name}` }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Source Store</label>
                  <CustomSelect
                    value={minStoreCode}
                    onChange={setMinStoreCode}
                    options={filteredStores.map((s) => s.storeCode)}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Receiver Name</label>
                  <input
                    type="text"
                    value={minReceiver}
                    onChange={(e) => setMinReceiver(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Material SKU</label>
                <CustomSelect
                  value={minSku}
                  onChange={setMinSku}
                  options={filteredInventory.map((i) => ({
                    value: i.sku,
                    label: `${i.sku} - ${i.name} (${formatLKR(i.unitCost)} / ${i.unit})`,
                  }))}
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Quantity to Issue</label>
                <input
                  type="number"
                  value={minQty}
                  onChange={(e) => setMinQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  required
                />
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMinModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Confirm Issue &amp; Debit Project Cost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
