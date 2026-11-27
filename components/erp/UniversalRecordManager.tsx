"use client";

import React, { useState } from 'react';
import DataViewToolbar, { ViewMode, SortOption } from '@/components/erp/DataViewToolbar';
import MultiImageField from '@/components/erp/MultiImageField';
import { formatLKR } from '@/lib/erp/currency';
import { Eye, Edit3, Trash2, X, Check, ChevronDown, ChevronRight, SlidersHorizontal } from 'lucide-react';

export interface FieldSchema {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'images' | 'checkbox';
  options?: string[];
  required?: boolean;
  optional?: boolean;
  isTitle?: boolean;
  isBadge?: boolean;
  isCurrency?: boolean;
  showInTable?: boolean;
  placeholder?: string;
}

interface UniversalRecordManagerProps<T extends Record<string, unknown>> {
  title?: string;
  items: T[];
  fields: FieldSchema[];
  sortOptions: SortOption[];
  createLabel?: string;
  searchPlaceholder?: string;
  onCreate?: (data: Record<string, unknown>) => void;
  onUpdate?: (id: string, data: Record<string, unknown>) => void;
  onDelete?: (id: string) => void;
  renderRowActions?: (item: T) => React.ReactNode;
}

export default function UniversalRecordManager<T extends Record<string, unknown>>({
  title,
  items,
  fields,
  sortOptions,
  createLabel = 'Create New',
  searchPlaceholder = 'Search records...',
  onCreate,
  onUpdate,
  onDelete,
  renderRowActions,
}: UniversalRecordManagerProps<T>) {
  const [localItems, setLocalItems] = useState<T[] | null>(null);
  const activeItems = localItems ?? items;

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(sortOptions[0]?.value || fields[0]?.key || 'id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');

  const [viewingItem, setViewingItem] = useState<T | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const titleField = fields.find((f) => f.isTitle) || fields[0];
  const badgeField = fields.find((f) => f.isBadge);
  const tableFields = fields.filter((f) => f.showInTable !== false && f.type !== 'images').slice(0, 6);
  const coreFields = fields.filter((f) => !f.optional);
  const optionalFields = fields.filter((f) => f.optional);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setShowOptionalFields(false);
    const initial: Record<string, unknown> = {};
    fields.forEach((f) => {
      initial[f.key] =
        f.type === 'number'
          ? 0
          : f.type === 'images'
          ? []
          : f.type === 'checkbox'
          ? false
          : f.options?.[0] || '';
    });
    setFormData(initial);
    setShowFormModal(true);
  };

  const handleOpenEdit = (item: T) => {
    setEditingItem(item);
    setShowOptionalFields(optionalFields.some((f) => {
      const v = item[f.key];
      return Array.isArray(v) ? v.length > 0 : Boolean(v);
    }));
    const initial: Record<string, unknown> = {};
    fields.forEach((f) => {
      initial[f.key] =
        item[f.key] ??
        (f.type === 'number' ? 0 : f.type === 'images' ? [] : f.type === 'checkbox' ? false : '');
    });
    setFormData(initial);
    setShowFormModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const id = String(editingItem.id || '');
      if (onUpdate) {
        onUpdate(id, formData);
      } else {
        setLocalItems(activeItems.map((it) => (String(it.id) === id ? ({ ...it, ...formData } as T) : it)));
      }
    } else {
      const newRecord = { ...formData, id: `rec-${Date.now().toString().slice(-5)}` } as unknown as T;
      if (onCreate) {
        onCreate(formData);
      } else {
        setLocalItems([newRecord, ...activeItems]);
      }
    }
    setShowFormModal(false);
  };

  const handleDelete = (item: T) => {
    const label = String(item[titleField.key] || item.id || 'record');
    if (!confirm(`Delete "${label}"?`)) return;
    const id = String(item.id || '');
    if (onDelete) {
      onDelete(id);
    } else {
      setLocalItems(activeItems.filter((it) => String(it.id) !== id));
    }
  };

  const filtered = activeItems
    .filter((item) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return fields.some((f) => String(item[f.key] ?? '').toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      const av = a[sortBy];
      const bv = b[sortBy];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul;
      return String(av ?? '').localeCompare(String(bv ?? '')) * mul;
    });

  const formatVal = (f: FieldSchema, val: unknown) => {
    if (val === null || val === undefined || val === '') return '—';
    if (f.type === 'checkbox') return val ? 'Yes' : 'No';
    if (f.type === 'images' && Array.isArray(val)) return `${val.length} photo(s)`;
    if (f.isCurrency && typeof val === 'number') return formatLKR(val, true);
    return String(val);
  };

  const renderFieldInput = (f: FieldSchema) => (
    <div
      key={f.key}
      className={
        f.type === 'textarea' || f.type === 'images' ? 'sm:col-span-2' : ''
      }
    >
      {f.type !== 'images' && f.type !== 'checkbox' && (
        <label className="block font-semibold text-zinc-300 mb-1">
          {f.label} {f.required && '*'}
        </label>
      )}
      {f.type === 'images' ? (
        <MultiImageField
          label={f.label}
          images={Array.isArray(formData[f.key]) ? (formData[f.key] as string[]) : []}
          onChange={(imgs) => setFormData({ ...formData, [f.key]: imgs })}
        />
      ) : f.type === 'checkbox' ? (
        <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(formData[f.key])}
            onChange={(e) => setFormData({ ...formData, [f.key]: e.target.checked })}
            className="w-4 h-4 accent-[#0038B8] rounded"
          />
          <span className="font-semibold text-zinc-200">{f.label}</span>
        </label>
      ) : f.type === 'select' ? (
        <select
          value={String(formData[f.key] ?? '')}
          onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-white"
        >
          {(f.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : f.type === 'textarea' ? (
        <textarea
          rows={3}
          required={f.required}
          placeholder={f.placeholder}
          value={String(formData[f.key] ?? '')}
          onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
        />
      ) : (
        <input
          type={f.type || 'text'}
          required={f.required}
          placeholder={f.placeholder}
          value={String(formData[f.key] ?? '')}
          onChange={(e) =>
            setFormData({
              ...formData,
              [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value,
            })
          }
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {title && <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">{title}</h2>}

      <DataViewToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
        sortOptions={sortOptions}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDir={sortDir}
        onSortDirToggle={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={activeItems.length}
        filteredCount={filtered.length}
        onCreateClick={handleOpenCreate}
        createLabel={createLabel}
      />

      {viewMode === 'DETAILED' ? (
        <div className="rounded-2xl bg-[#080e1c]/90 border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-[10px] uppercase text-zinc-400">
              <tr>
                {tableFields.map((f) => (
                  <th key={f.key} className="p-3.5">{f.label}</th>
                ))}
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item, idx) => (
                <tr key={String(item.id || idx)} className="hover:bg-white/[0.03]">
                  {tableFields.map((f) => (
                    <td key={f.key} className={`p-3.5 ${f.isTitle ? 'font-bold text-white' : f.isCurrency ? 'font-mono text-[#FFB800] font-semibold' : 'text-zinc-300'}`}>
                      {formatVal(f, item[f.key])}
                    </td>
                  ))}
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      {renderRowActions && renderRowActions(item)}
                      <button type="button" onClick={() => setViewingItem(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-emerald-400 cursor-pointer" title="View"><Eye className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-blue-400 cursor-pointer" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleDelete(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={
            viewMode === 'TILE'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'
              : viewMode === 'COMPACT'
              ? 'space-y-2'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          }
        >
          {filtered.map((item, idx) => (
            <div
              key={String(item.id || idx)}
              className={`rounded-2xl bg-[#080e1c]/90 border border-white/10 hover:border-blue-500/30 transition-all flex ${
                viewMode === 'COMPACT' ? 'p-3 items-center justify-between gap-3' : 'p-4 flex-col justify-between gap-3'
              }`}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-white truncate">
                    {formatVal(titleField, item[titleField.key])}
                  </span>
                  {badgeField && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 shrink-0">
                      {formatVal(badgeField, item[badgeField.key])}
                    </span>
                  )}
                </div>

                {viewMode !== 'COMPACT' && (
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    {tableFields
                      .filter((f) => f.key !== titleField.key && f.key !== badgeField?.key)
                      .slice(0, 4)
                      .map((f) => (
                        <div key={f.key} className="truncate">
                          <span className="text-zinc-500">{f.label}: </span>
                          <span className={f.isCurrency ? 'text-[#FFB800] font-semibold font-mono' : 'text-zinc-300'}>
                            {formatVal(f, item[f.key])}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 shrink-0">
                <div className="flex items-center gap-1 flex-wrap">
                  {renderRowActions && renderRowActions(item)}
                  <button type="button" onClick={() => setViewingItem(item)} className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-emerald-400 text-[11px] font-semibold flex items-center gap-1 cursor-pointer">
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button type="button" onClick={() => handleOpenEdit(item)} className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-blue-400 text-[11px] font-semibold flex items-center gap-1 cursor-pointer">
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
                <button type="button" onClick={() => handleDelete(item)} className="px-2 py-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold flex items-center gap-1 cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">{formatVal(titleField, viewingItem[titleField.key])}</h3>
              <button type="button" onClick={() => setViewingItem(null)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            {fields
              .filter((f) => f.type === 'images' && Array.isArray(viewingItem[f.key]) && (viewingItem[f.key] as string[]).length > 0)
              .map((f) => (
                <div key={f.key} className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">{f.label}</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(viewingItem[f.key] as string[]).map((src, i) => (
                      <a key={`${src}-${i}`} href={src} target="_blank" rel="noreferrer" className="block aspect-video rounded-xl overflow-hidden border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`Attachment ${i + 1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {fields
                .filter((f) => f.type !== 'images')
                .map((f) => (
                  <div key={f.key} className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-zinc-400 block text-[10px] uppercase font-semibold">{f.label}</span>
                    <span className="text-white font-semibold mt-0.5 block break-words">{formatVal(f, viewingItem[f.key])}</span>
                  </div>
                ))}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button type="button" onClick={() => { setViewingItem(null); handleOpenEdit(viewingItem); }} className="px-4 py-2 rounded-xl bg-[#0038B8] text-white text-xs font-bold cursor-pointer">Edit Record</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">{editingItem ? `Edit ${titleField.label}` : createLabel}</h3>
              <button type="button" onClick={() => setShowFormModal(false)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coreFields.map(renderFieldInput)}
              </div>

              {optionalFields.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowOptionalFields((prev) => !prev)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.03] cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-bold text-blue-300">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>Optional &amp; Advanced Construction Fields ({optionalFields.length})</span>
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                      <span>{showOptionalFields ? 'Hide' : 'Expand'}</span>
                      {showOptionalFields ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                  </button>

                  {showOptionalFields && (
                    <div className="p-4 pt-1 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {optionalFields.map(renderFieldInput)}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0038B8] text-white font-bold flex items-center gap-1.5 cursor-pointer">
                  <Check className="w-4 h-4" />
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
