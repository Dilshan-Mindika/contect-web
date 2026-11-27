"use client";

import React, { useRef, useState } from 'react';
import { ImagePlus, Link as LinkIcon, Star, Trash2, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface MultiImageFieldProps {
  label?: string;
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function MultiImageField({
  label = 'Image Gallery (Cover + Multiple Photos)',
  images,
  onChange,
  maxImages = 20,
}: MultiImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('files', file));

      const res = await fetch('/api/erp/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Image upload failed');
      } else if (Array.isArray(data.urls)) {
        const merged = Array.from(new Set([...images, ...data.urls])).slice(0, maxImages);
        onChange(merged);
      }
    } catch {
      setError('Network error while uploading images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      setUrlInput('');
      return;
    }
    onChange([...images, trimmed].slice(0, maxImages));
    setUrlInput('');
  };

  const handleSetCover = (idx: number) => {
    if (idx === 0) return;
    const copy = [...images];
    const [picked] = copy.splice(idx, 1);
    onChange([picked, ...copy]);
  };

  const handleMove = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const copy = [...images];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    onChange(copy);
  };

  const handleRemove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-zinc-200">{label}</span>
        <span className="text-[10px] font-mono text-zinc-400">
          {images.length} / {maxImages} images • First image = Cover
        </span>
      </div>

      {/* Upload + URL Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          multiple
          onChange={handleFilesSelected}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3.5 py-2 rounded-xl bg-[#0038B8] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5 text-[#FFB800]" />}
          <span>{uploading ? 'Uploading...' : 'Upload Images'}</span>
        </button>

        <div className="flex-1 flex gap-1.5">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              placeholder="Or paste image URL (/images/... or https://...)"
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
            />
          </div>
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer shrink-0"
          >
            Add URL
          </button>
        </div>
      </div>

      {error && (
        <div className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1.5">
          {error}
        </div>
      )}

      {/* Thumbnails Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {images.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className={`group relative rounded-xl overflow-hidden border bg-black/40 aspect-video ${
                idx === 0 ? 'border-[#FFB800]' : 'border-white/15'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />

              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#FFB800] text-black text-[9px] font-extrabold uppercase flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-black" />
                  Cover
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      className="px-1.5 py-0.5 rounded bg-[#FFB800]/20 hover:bg-[#FFB800]/40 text-[#FFB800] text-[9px] font-bold cursor-pointer"
                      title="Set as Cover Image"
                    >
                      Cover
                    </button>
                  )}
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, -1)}
                      className="p-1 rounded bg-white/10 hover:bg-white/25 text-white cursor-pointer"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-2.5 h-2.5" />
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 1)}
                      className="p-1 rounded bg-white/10 hover:bg-white/25 text-white cursor-pointer"
                      title="Move Right"
                    >
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1 rounded bg-red-500/30 hover:bg-red-500/60 text-red-200 cursor-pointer"
                  title="Remove Image"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[11px] text-zinc-500 italic py-2 text-center border border-dashed border-white/10 rounded-xl">
          No images added yet. Upload multiple photos or paste URLs above.
        </div>
      )}
    </div>
  );
}
