"use client";

import React from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List,
  Grid3X3,
  AlignJustify,
  Plus,
  X,
} from 'lucide-react';

export type ViewMode = 'GRID' | 'DETAILED' | 'TILE' | 'COMPACT';

export interface SortOption {
  value: string;
  label: string;
}

interface DataViewToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  sortOptions: SortOption[];
  sortBy: string;
  onSortByChange: (val: string) => void;
  sortDir: 'asc' | 'desc';
  onSortDirToggle: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
  filteredCount: number;
  onCreateClick?: () => void;
  createLabel?: string;
}

const VIEW_MODES: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'GRID', label: 'Grid', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { id: 'DETAILED', label: 'Detailed', icon: <List className="w-3.5 h-3.5" /> },
  { id: 'TILE', label: 'Tile', icon: <Grid3X3 className="w-3.5 h-3.5" /> },
  { id: 'COMPACT', label: 'Compact', icon: <AlignJustify className="w-3.5 h-3.5" /> },
];

export default function DataViewToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  sortOptions,
  sortBy,
  onSortByChange,
  sortDir,
  onSortDirToggle,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  onCreateClick,
  createLabel = 'Create New',
}: DataViewToolbarProps) {
  return (
    <div className="p-3.5 rounded-2xl bg-[#080e1c]/80 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Left: Search + Sorting */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort By + Direction */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#FFB800] absolute left-2.5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl bg-[#050811] border border-white/15 text-xs text-white font-semibold focus:outline-none focus:border-[#FFB800] cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={onSortDirToggle}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title={sortDir === 'asc' ? 'Ascending (Click to reverse)' : 'Descending (Click to reverse)'}
          >
            {sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <span className="text-[11px] text-zinc-400 font-medium px-1">
          {filteredCount} of {totalCount}
        </span>
      </div>

      {/* Right: View Modes + Create Button */}
      <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 shrink-0">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {VIEW_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onViewModeChange(m.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === m.id
                  ? 'bg-[#0038B8] text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title={`${m.label} View`}
            >
              {m.icon}
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>

        {onCreateClick && (
          <button
            type="button"
            onClick={onCreateClick}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>{createLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
