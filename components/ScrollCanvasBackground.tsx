"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface ScrollCanvasProps {
  totalFrames?: number;
  containerRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

const TOTAL_FRAMES_DEFAULT = 150;
const TARGET_ASPECT = 16 / 9;

export default function ScrollCanvasBackground({
  totalFrames = TOTAL_FRAMES_DEFAULT,
  containerRef,
  className = "",
}: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesCache = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  const lastDrawnFrameRef = useRef<number>(-1);
  const isReducedMotion = useRef<boolean>(false);
  const animationFrameId = useRef<number | null>(null);

  // Helper to format frame path (high-efficiency WebP)
  const getFramePath = useCallback((frameNumber: number) => {
    const formatted = String(frameNumber).padStart(3, "0");
    return `/frames/frame-${formatted}.webp`;
  }, []);

  // Precise 16:9 Auto-Scale & Render Engine
  const drawFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const clampedFrame = Math.max(1, Math.min(totalFrames, Math.round(frameNumber)));

    // Retrieve requested frame or closest available cached frame
    let img = imagesCache.current[clampedFrame];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < totalFrames; offset++) {
        const prev = imagesCache.current[Math.max(1, clampedFrame - offset)];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesCache.current[Math.min(totalFrames, clampedFrame + offset)];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    if (canvasWidth === 0 || canvasHeight === 0) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Auto-scaling math: perfectly contains full 16:9 aspect ratio on ANY screen size
    const canvasAspect = canvasWidth / canvasHeight;

    let destWidth: number;
    let destHeight: number;
    let destX: number;
    let destY: number;

    if (canvasAspect > TARGET_ASPECT) {
      // Screen is wider than 16:9 -> fit to height, center horizontally
      destHeight = canvasHeight;
      destWidth = canvasHeight * TARGET_ASPECT;
      destX = (canvasWidth - destWidth) / 2;
      destY = 0;
    } else {
      // Screen is taller/narrower than 16:9 -> fit to width, center vertically
      destWidth = canvasWidth;
      destHeight = canvasWidth / TARGET_ASPECT;
      destX = 0;
      destY = (canvasHeight - destHeight) / 2;
    }

    // Fill background with dark theme color to prevent any seams
    ctx.fillStyle = "#050509";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw single crisp frame at sub-pixel rounded position
    ctx.drawImage(
      img,
      0,
      0,
      img.naturalWidth,
      img.naturalHeight,
      Math.round(destX),
      Math.round(destY),
      Math.round(destWidth),
      Math.round(destHeight)
    );

    lastDrawnFrameRef.current = clampedFrame;
  }, [totalFrames]);

  // Robust Auto-Resize Handler for all screen sizes & DPRs
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

      // Redraw current frame immediately on resize
      drawFrame(currentFrameRef.current);
    }
  }, [drawFrame]);

  // Preload all 150 frames with parallel browser fetch and GPU decode
  useEffect(() => {
    imagesCache.current = new Array(totalFrames + 1).fill(null);

    if (typeof window !== "undefined") {
      isReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    // Preload Frame 1 immediately for instant first paint
    const firstImg = new Image();
    firstImg.src = getFramePath(1);
    firstImg.onload = () => {
      imagesCache.current[1] = firstImg;
      if ("decode" in firstImg) {
        firstImg.decode().catch(() => {}).finally(() => {
          handleResize();
          drawFrame(1);
        });
      } else {
        handleResize();
        drawFrame(1);
      }
    };

    // Parallel background loading of remaining frames
    for (let i = 2; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        imagesCache.current[i] = img;
        if ("decode" in img) {
          img.decode().catch(() => {});
        }
      };
    }

    return () => {
      imagesCache.current = [];
    };
  }, [totalFrames, getFramePath, handleResize, drawFrame]);

  // Responsive ResizeObserver & Window Resize Listener
  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && canvasRef.current) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [handleResize]);

  // Real-time Scroll Position to Target Frame Calculation
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
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef, totalFrames]);

  // Silky-Smooth 120 FPS Physics Animation Loop
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

      if (Math.abs(diff) > 0.0001) {
        // High-responsiveness exponential damping (snappy yet buttery smooth)
        const lerpFactor = isReducedMotion.current ? 1 : 1 - Math.exp(-22 * dt);
        const nextVal = current + diff * lerpFactor;
        currentFrameRef.current = nextVal;

        const frameToDraw = Math.round(nextVal);
        if (frameToDraw !== lastDrawnFrameRef.current) {
          drawFrame(frameToDraw);
        }
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
  }, [totalFrames, drawFrame]);

  return (
    <div className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: "block" }}
      />
      {/* Subtle edge vignette for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050509]/20 via-transparent to-[#050509]/40 pointer-events-none" />
    </div>
  );
}

