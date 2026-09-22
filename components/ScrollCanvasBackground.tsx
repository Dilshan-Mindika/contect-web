"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface ScrollCanvasProps {
  totalFrames?: number;
  containerRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

const TOTAL_FRAMES_DEFAULT = 150;

export default function ScrollCanvasBackground({
  totalFrames = TOTAL_FRAMES_DEFAULT,
  containerRef,
  className = "",
}: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesCache = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  const lastDrawnValRef = useRef<number>(-1);
  const isReducedMotion = useRef<boolean>(false);
  const animationFrameId = useRef<number | null>(null);

  // Helper to format frame path (using optimized high-resolution WebP)
  const getFramePath = useCallback((frameNumber: number) => {
    const formatted = String(frameNumber).padStart(3, "0");
    return `/frames/frame-${formatted}.webp`;
  }, []);

  // 16:9 Precision Render Engine
  const renderCanvas = useCallback((frameVal: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const clampedVal = Math.max(1, Math.min(totalFrames, frameVal));
    const frameBase = Math.floor(clampedVal);
    const frameNext = Math.min(totalFrames, frameBase + 1);
    const blendAlpha = clampedVal - frameBase;

    // Retrieve base frame or nearest loaded frame
    let imgBase = imagesCache.current[frameBase];
    if (!imgBase || !imgBase.complete || imgBase.naturalWidth === 0) {
      for (let offset = 1; offset < totalFrames; offset++) {
        const prev = imagesCache.current[Math.max(1, frameBase - offset)];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          imgBase = prev;
          break;
        }
        const next = imagesCache.current[Math.min(totalFrames, frameBase + offset)];
        if (next && next.complete && next.naturalWidth > 0) {
          imgBase = next;
          break;
        }
      }
    }

    if (!imgBase || !imgBase.complete || imgBase.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Strict 16:9 Aspect Ratio (1920x1080) math
    const TARGET_ASPECT = 16 / 9;
    const canvasAspect = canvasWidth / canvasHeight;

    let destWidth: number;
    let destHeight: number;
    let destX: number;
    let destY: number;

    if (canvasAspect > TARGET_ASPECT) {
      // Screen is wider than 16:9: match width for full immersive widescreen
      destWidth = canvasWidth;
      destHeight = canvasWidth / TARGET_ASPECT;
      destX = 0;
      destY = (canvasHeight - destHeight) / 2;
    } else {
      // Screen is taller than 16:9: match height
      destHeight = canvasHeight;
      destWidth = canvasHeight * TARGET_ASPECT;
      destX = (canvasWidth - destWidth) / 2;
      destY = 0;
    }

    // Clear and draw base frame
    ctx.globalAlpha = 1.0;
    ctx.drawImage(imgBase, 0, 0, imgBase.naturalWidth, imgBase.naturalHeight, destX, destY, destWidth, destHeight);

    // Liquid-smooth sub-frame cross-fade
    if (blendAlpha > 0.02 && frameNext !== frameBase) {
      const imgNext = imagesCache.current[frameNext];
      if (imgNext && imgNext.complete && imgNext.naturalWidth > 0) {
        ctx.globalAlpha = blendAlpha;
        ctx.drawImage(imgNext, 0, 0, imgNext.naturalWidth, imgNext.naturalHeight, destX, destY, destWidth, destHeight);
        ctx.globalAlpha = 1.0;
      }
    }

    lastDrawnValRef.current = clampedVal;
  }, [totalFrames]);

  // Handle canvas resize with devicePixelRatio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    const targetW = Math.round(displayWidth * dpr);
    const targetH = Math.round(displayHeight * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      renderCanvas(currentFrameRef.current);
    }
  }, [renderCanvas]);

  // Instant high-speed parallel preloading of all 150 WebP frames
  useEffect(() => {
    imagesCache.current = new Array(totalFrames + 1).fill(null);

    if (typeof window !== "undefined") {
      isReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    // Step 1: Preload Frame 1 immediately
    const firstImg = new Image();
    firstImg.src = getFramePath(1);
    firstImg.onload = () => {
      imagesCache.current[1] = firstImg;
      if ("decode" in firstImg) {
        firstImg.decode().then(() => {
          handleResize();
          renderCanvas(1);
        }).catch(() => {
          handleResize();
          renderCanvas(1);
        });
      } else {
        handleResize();
        renderCanvas(1);
      }
    };

    // Step 2: Parallel batch preload for all 150 frames with hardware decode
    const preloadAll = async () => {
      const loadSingle = (index: number) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = getFramePath(index);
          img.onload = () => {
            imagesCache.current[index] = img;
            if ("decode" in img) {
              img.decode().then(() => resolve()).catch(() => resolve());
            } else {
              resolve();
            }
          };
          img.onerror = () => resolve();
        });
      };

      // Burst load first 30 frames
      const burstPromises: Promise<void>[] = [];
      for (let i = 2; i <= 30 && i <= totalFrames; i++) {
        burstPromises.push(loadSingle(i));
      }
      await Promise.all(burstPromises);

      // Load remaining frames in batches of 20
      for (let start = 31; start <= totalFrames; start += 20) {
        const batch: Promise<void>[] = [];
        for (let i = start; i < start + 20 && i <= totalFrames; i++) {
          batch.push(loadSingle(i));
        }
        await Promise.all(batch);
      }
    };

    preloadAll();

    return () => {
      imagesCache.current = [];
    };
  }, [totalFrames, getFramePath, handleResize, renderCanvas]);

  // Scroll position to target frame mapper
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef?.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = container.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      const targetFrame = 1 + progress * (totalFrames - 1);
      targetFrameRef.current = targetFrame;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [containerRef, totalFrames, handleResize]);

  // Liquid 120 FPS RAF Loop with Delta Time Lerp
  useEffect(() => {
    let isRunning = true;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      if (!isRunning) return;

      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.001) {
        // High-precision smooth damping
        const lerpRate = isReducedMotion.current ? 1 : 1 - Math.exp(-16 * dt);
        const nextVal = current + diff * lerpRate;
        currentFrameRef.current = nextVal;
        renderCanvas(nextVal);
      } else if (lastDrawnValRef.current !== current) {
        renderCanvas(current);
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [totalFrames, renderCanvas]);

  return (
    <div className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: "block" }}
      />
      {/* Subtle top & bottom edge shading for maximum text contrast while keeping 16:9 visual 100% visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050509]/30 via-transparent to-[#050509]/50 pointer-events-none" />
    </div>
  );
}
