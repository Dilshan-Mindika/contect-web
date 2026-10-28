"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import {
  Boxes,
  Plus,
  Search,
  Truck,
} from 'lucide-react';

export default function InventoryPage() {
  const {
    inventory,
    purchaseOrders,
    adjustStock,
    updatePOStatus,
    addPurchaseOrder,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'STOCK' | 'ORDERS'>('STOCK');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPOModal, setShowPOModal] = useState(false);

  // Form State for PO
  const [supplier, setSupplier] = useState('');
  const [totalAmount, setTotalAmount] = useState(75000);
  const [itemsCount, setItemsCount] = useState(25);

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInventoryValuation = inventory.reduce(
    (acc, it) => acc + it.quantity * it.unitCost,
    0
  );
  const lowStockCount = inventory.filter(
    (it) => it.status === 'LOW_STOCK' || it.status === 'CRITICAL'
  ).length;

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return;
    addPurchaseOrder({
      supplier,
      totalAmount: Number(totalAmount),
      status: 'PENDING',
      itemsCount: Number(itemsCount),
    });
    setSupplier('');
    setShowPOModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <Boxes className="w-4 h-4" />
            <span>Procurement & Material Supply Chain</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Material Master & Purchase Orders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Real-time yard inventory levels, seismic hardware tracking, and automated supplier replenishment.
          </p>
        </div>

        <button
          onClick={() => setShowPOModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold shadow-lg shadow-blue-900/40 border border-blue-400/40 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#FFB800]" />
          <span>Issue Purchase Order (PO)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Yard Valuation</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            ${(totalInventoryValuation / 1000000).toFixed(2)}M
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Across {inventory.length} structural SKU categories
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Stock Reorder Alerts</span>
          <div
            className={`text-2xl font-extrabold mt-1 ${
              lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {lowStockCount} Items
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Automated threshold notifications
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Active Purchase Orders</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            {purchaseOrders.length} POs
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Total Value: $
            {(
              purchaseOrders.reduce((acc, p) => acc + p.totalAmount, 0) / 1000000
            ).toFixed(2)}
            M
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 self-start w-fit">
        <button
          onClick={() => setActiveTab('STOCK')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'STOCK'
              ? 'bg-[#0038B8] text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Stock Items Catalog ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'ORDERS'
              ? 'bg-[#0038B8] text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
      </div>

      {/* TAB 1: Stock Items Catalog */}
      {activeTab === 'STOCK' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search material SKU, category, or yard..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFB800]"
            />
          </div>

          <div className="rounded-2xl bg-[#080e1c]/85 border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.03] text-zinc-400 font-mono text-[11px] border-b border-white/10 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">SKU & Material</th>
                    <th className="py-3.5 px-4">Warehouse Location</th>
                    <th className="py-3.5 px-4 text-center">Available Stock</th>
                    <th className="py-3.5 px-4 text-right">Unit Cost</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-[11px] font-mono text-zinc-400">
                          {item.sku} • {item.category}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">{item.warehouseLocation}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                        {item.quantity} {item.unit}
                        <div className="text-[10px] text-zinc-400 font-normal">
                          Min: {item.minThreshold} {item.unit}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                        ${item.unitCost.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                            item.status === 'OPTIMAL'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.status === 'LOW_STOCK'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => adjustStock(item.id, -10)}
                            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10"
                            title="Dispatch 10 units"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => adjustStock(item.id, 50)}
                            className="px-2 py-1 rounded bg-[#0038B8]/40 hover:bg-[#0038B8] text-white font-mono text-xs border border-blue-500/30"
                            title="Receive 50 units"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Purchase Orders */}
      {activeTab === 'ORDERS' && (
        <div className="rounded-2xl bg-[#080e1c]/85 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-zinc-400 font-mono text-[11px] border-b border-white/10 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">PO Number</th>
                  <th className="py-3.5 px-4">Supplier Entity</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-center">Workflow State</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {po.poNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{po.supplier}</div>
                      <div className="text-[11px] text-zinc-400">{po.itemsCount} SKU units</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400">{po.date}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-white text-sm">
                      ${po.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          po.status === 'APPROVED' || po.status === 'FULFILLED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : po.status === 'DISPATCHED'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {po.status === 'PENDING' && (
                        <button
                          onClick={() => updatePOStatus(po.id, 'APPROVED')}
                          className="px-3 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold"
                        >
                          Approve PO
                        </button>
                      )}
                      {po.status === 'APPROVED' && (
                        <button
                          onClick={() => updatePOStatus(po.id, 'DISPATCHED')}
                          className="px-3 py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-[11px] font-bold"
                        >
                          Mark Dispatched
                        </button>
                      )}
                      {po.status === 'DISPATCHED' && (
                        <button
                          onClick={() => updatePOStatus(po.id, 'FULFILLED')}
                          className="px-3 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-[11px] font-bold"
                        >
                          Receive to Yard
                        </button>
                      )}
                      {po.status === 'FULFILLED' && (
                        <span className="text-[11px] text-zinc-400">Inventory Logged</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Issue PO */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091124] border border-white/15 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FFB800]" />
                <span>Issue Supplier Purchase Order</span>
              </h3>
              <button onClick={() => setShowPOModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Supplier Entity</label>
                <input
                  type="text"
                  required
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="e.g. Emirates Steel Arkan"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Total PO Amount ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Item Units Count</label>
                  <input
                    type="number"
                    required
                    value={itemsCount}
                    onChange={(e) => setItemsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPOModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0038B8] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-blue-900/40"
                >
                  Issue PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

