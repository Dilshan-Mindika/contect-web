"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOptionItem {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (SelectOptionItem | string)[];
  placeholder?: string;
  className?: string;
  prefixIcon?: React.ReactNode;
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  prefixIcon,
  disabled = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalized: SelectOptionItem[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selected = normalized.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`erp-select-trigger w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-xs text-white font-medium hover:border-blue-400/50 focus:outline-none focus:border-[#0038B8] transition-all cursor-pointer disabled:opacity-50 ${
          open ? 'border-blue-500 ring-2 ring-blue-500/20' : ''
        }`}
      >
        <span className="flex items-center gap-2 min-w-0 truncate">
          {prefixIcon && <span className="shrink-0">{prefixIcon}</span>}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180 text-[#FFB800]' : ''
          }`}
        />
      </button>

      {open && (
        <div className="erp-select-menu absolute left-0 right-0 mt-1.5 z-50 min-w-[180px] rounded-2xl bg-[#0a1328] border border-white/15 shadow-2xl shadow-black/70 p-1.5 max-h-64 overflow-y-auto custom-scrollbar">
          {normalized.map((opt) => {
            const isActive = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0038B8] text-white font-bold'
                    : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
