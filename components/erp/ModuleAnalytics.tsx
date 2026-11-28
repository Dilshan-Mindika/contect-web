"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  LayoutGrid,
  SlidersHorizontal,
} from 'lucide-react';

export interface StatBoxItem {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  accent?: 'blue' | 'gold' | 'emerald' | 'purple' | 'amber' | 'red';
  icon?: React.ReactNode;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  unit?: string;
}

interface ModuleAnalyticsProps {
  title?: string;
  stats: StatBoxItem[];
  chartTitle?: string;
  chartSubtitle?: string;
  primarySeriesLabel?: string;
  secondarySeriesLabel?: string;
  chartData?: ChartDataPoint[];
  reportFilename?: string;
  reportRows?: Record<string, string | number | boolean>[];
  defaultMode?: 'MINIMAL' | 'ADVANCED';
  showModeToggle?: boolean;
}

const ACCENT_STYLES: Record<NonNullable<StatBoxItem['accent']>, string> = {
  blue: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
  gold: 'bg-[#FFB800]/10 border-[#FFB800]/25 text-[#FFB800]',
  emerald: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  purple: 'bg-purple-500/10 border-purple-500/25 text-purple-400',
  amber: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
  red: 'bg-red-500/10 border-red-500/25 text-red-400',
};

export default function ModuleAnalytics({
  title,
  stats,
  chartTitle = 'Performance & Distribution Graph',
  chartSubtitle = 'Updated from your live records',
  primarySeriesLabel = 'Primary',
  secondarySeriesLabel = 'Target / Cost',
  chartData = [],
  reportFilename = 'contec-report',
  reportRows = [],
  defaultMode = 'ADVANCED',
  showModeToggle = true,
}: ModuleAnalyticsProps) {
  const [mode, setMode] = useState<'MINIMAL' | 'ADVANCED'>(defaultMode);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleExportCsv = () => {
    if (!reportRows || reportRows.length === 0) return;
    const headers = Object.keys(reportRows[0]);
    const csvLines = [
      headers.join(','),
      ...reportRows.map((row) =>
        headers
          .map((h) => {
            const cell = String(row[h] ?? '').replace(/"/g, '""');
            return `"${cell}"`;
          })
          .join(',')
      ),
    ];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportFilename}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxVal = Math.max(
    1,
    ...chartData.flatMap((d) => [d.value, d.secondaryValue || 0])
  );

  return (
    <div className="space-y-4">
      {/* Toolbar: Minimal/Advanced Toggle & Reports */}
      {(title || showModeToggle || reportRows.length > 0) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {title && <h2 className="text-sm font-bold text-zinc-200">{title}</h2>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {showModeToggle && (
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setMode('MINIMAL')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    mode === 'MINIMAL'
                      ? 'bg-[#0038B8] text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>Simple</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('ADVANCED')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    mode === 'ADVANCED'
                      ? 'bg-[#0038B8] text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Charts &amp; Details</span>
                </button>
              </div>
            )}

            {reportRows.length > 0 && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Report</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      )}

      {/* Stat Boxes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const accentClass = ACCENT_STYLES[s.accent || 'blue'];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 1, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              whileHover={{ y: -2 }}
              className="p-4 sm:p-5 rounded-2xl bg-[#080e1c]/85 border border-white/10 shadow-lg hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-zinc-400">{s.label}</span>
                {s.icon && (
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${accentClass}`}>
                    {s.icon}
                  </div>
                )}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white mt-2">{s.value}</div>
              {(s.subtitle || s.trend) && (
                <div className="flex items-center justify-between gap-2 mt-1 text-[11px]">
                  {s.subtitle && <span className="text-zinc-400 truncate">{s.subtitle}</span>}
                  {s.trend && (
                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5 shrink-0">
                      <TrendingUp className="w-3 h-3" />
                      {s.trend}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Advanced Graph View */}
      {mode === 'ADVANCED' && chartData.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#080e1c]/85 border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#FFB800]" />
                <span>{chartTitle}</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">{chartSubtitle}</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-[#0038B8] to-blue-400" />
                {primarySeriesLabel}
              </span>
              {chartData.some((d) => d.secondaryValue !== undefined) && (
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFB800]" />
                  {secondarySeriesLabel}
                </span>
              )}
            </div>
          </div>

          <div className="h-48 flex items-end gap-2 sm:gap-4 pt-6 px-2">
            {chartData.map((d, i) => {
              const primaryPct = Math.max(4, Math.round((d.value / maxVal) * 100));
              const secondaryPct =
                d.secondaryValue !== undefined
                  ? Math.max(4, Math.round((d.secondaryValue / maxVal) * 100))
                  : null;
              const isHovered = hoveredIdx === i;

              return (
                <div
                  key={d.label + i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative group"
                >
                  {isHovered && (
                    <div className="absolute -top-8 z-20 px-2.5 py-1 rounded-lg bg-[#050811] border border-white/20 text-[10px] text-white font-bold whitespace-nowrap shadow-xl">
                      {d.label}: {d.value.toLocaleString()}{d.unit ? ` ${d.unit}` : ''}
                      {d.secondaryValue !== undefined
                        ? ` / ${d.secondaryValue.toLocaleString()}${d.unit ? ` ${d.unit}` : ''}`
                        : ''}
                    </div>
                  )}

                  <div className="w-full h-full flex items-end justify-center gap-1">
                    <div
                      className="w-full max-w-[26px] rounded-t-md bg-gradient-to-t from-[#0038B8] to-blue-400 transition-all duration-500 group-hover:brightness-125"
                      style={{ height: `${primaryPct}%` }}
                    />
                    {secondaryPct !== null && (
                      <div
                        className="w-full max-w-[26px] rounded-t-md bg-gradient-to-t from-amber-600 to-[#FFB800] transition-all duration-500 group-hover:brightness-125"
                        style={{ height: `${secondaryPct}%` }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium truncate max-w-full text-center">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
