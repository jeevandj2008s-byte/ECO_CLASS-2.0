'use client';

import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export function HeroIsometricStack() {
  return (
    <div className="hero-isometric-container">
      {/* Background radial glow behind the isometric stack */}
      <div className="isometric-glow-cyan" />
      <div className="isometric-glow-violet" />

      {/* Floating Chip 1: CAMPUS TELEMETRY (Top-Left) */}
      <div className="floating-chip chip-top-left">
        <div className="chip-icon-box chip-icon-cyan">
          <Activity size={18} color="#7ee8d6" strokeWidth={2.2} />
        </div>
        <div className="chip-text-content">
          <div className="chip-eyebrow">CAMPUS TELEMETRY</div>
          <div className="chip-subtitle">BIT Digital Twin: Live 8-Block T...</div>
        </div>
      </div>

      {/* Isometric 3D Layer Stack Illustration */}
      <div className="isometric-layers-wrapper" aria-hidden="true">
        <svg
          viewBox="0 0 540 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="isometric-svg"
        >
          <defs>
            {/* Gradients for Glass Slabs */}
            <linearGradient id="slabTopGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="slabMidGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.30" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.18" />
            </linearGradient>

            <linearGradient id="slabBotGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.32" />
              <stop offset="50%" stopColor="#6d28d9" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
            </linearGradient>

            {/* Glowing Stroke Gradients */}
            <linearGradient id="cyanStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <linearGradient id="violetStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            {/* Neon Glow Filters */}
            <filter id="neonGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="neonGlowViolet" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ==================== LAYER 3 (BOTTOM SLAB) ==================== */}
          <g className="layer-bottom">
            {/* Slab Extrusion / Thickness */}
            <polygon
              points="110,320 270,400 270,418 110,338"
              fill="#4c1d95"
              fillOpacity="0.45"
            />
            <polygon
              points="270,400 430,320 430,338 270,418"
              fill="#581c87"
              fillOpacity="0.6"
            />
            {/* Top Surface */}
            <polygon
              points="270,240 430,320 270,400 110,320"
              fill="url(#slabBotGrad)"
              stroke="url(#violetStroke)"
              strokeWidth="1.5"
            />
            {/* Bottom Grid Dots & Wave */}
            <g opacity="0.75" filter="url(#neonGlowViolet)">
              <circle cx="210" cy="310" r="2.5" fill="#c084fc" />
              <circle cx="240" cy="325" r="3" fill="#a855f7" />
              <circle cx="270" cy="340" r="3.5" fill="#38bdf8" />
              <circle cx="300" cy="325" r="3" fill="#a855f7" />
              <circle cx="330" cy="310" r="2.5" fill="#c084fc" />
              <circle cx="270" cy="310" r="2.5" fill="#818cf8" />
              <circle cx="240" cy="295" r="2" fill="#818cf8" />
              <circle cx="300" cy="295" r="2" fill="#818cf8" />
              <circle cx="270" cy="370" r="2.5" fill="#c084fc" />
              <path
                d="M170,320 Q270,370 370,320"
                stroke="#a855f7"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
              />
            </g>
          </g>

          {/* ==================== LAYER 2 (MIDDLE SLAB) ==================== */}
          <g className="layer-middle">
            {/* Slab Extrusion / Thickness */}
            <polygon
              points="110,230 270,310 270,326 110,246"
              fill="#0e7490"
              fillOpacity="0.45"
            />
            <polygon
              points="270,310 430,230 430,246 270,326"
              fill="#1e3a8a"
              fillOpacity="0.6"
            />
            {/* Top Surface */}
            <polygon
              points="270,150 430,230 270,310 110,230"
              fill="url(#slabMidGrad)"
              stroke="url(#cyanStroke)"
              strokeWidth="1.5"
            />
            {/* Middle Wave Ribbon Flow */}
            <g opacity="0.85" filter="url(#neonGlowCyan)">
              <path
                d="M150,225 C200,200 240,270 290,245 C340,220 370,250 390,235"
                stroke="#2dd4bf"
                strokeWidth="2.2"
                fill="none"
              />
              <path
                d="M160,235 C210,210 250,280 300,255 C350,230 380,260 400,245"
                stroke="#38bdf8"
                strokeWidth="1.6"
                strokeOpacity="0.8"
                fill="none"
              />
              <circle cx="200" cy="215" r="3" fill="#2dd4bf" />
              <circle cx="290" cy="245" r="3.5" fill="#38bdf8" />
              <circle cx="350" cy="235" r="3" fill="#a78bfa" />
            </g>
          </g>

          {/* ==================== LAYER 1 (TOP SLAB) ==================== */}
          <g className="layer-top">
            {/* Slab Extrusion / Thickness */}
            <polygon
              points="110,140 270,220 270,234 110,154"
              fill="#065f46"
              fillOpacity="0.4"
            />
            <polygon
              points="270,220 430,140 430,154 270,234"
              fill="#0c4a6e"
              fillOpacity="0.55"
            />
            {/* Top Surface */}
            <polygon
              points="270,60 430,140 270,220 110,140"
              fill="url(#slabTopGrad)"
              stroke="#7ee8d6"
              strokeWidth="1.8"
            />
            {/* Top Holographic Matrix Grid & Heatmap */}
            <g opacity="0.9" filter="url(#neonGlowCyan)">
              {/* Isometric grid lines */}
              <line x1="150" y1="120" x2="310" y2="200" stroke="#7ee8d6" strokeWidth="0.8" strokeOpacity="0.45" />
              <line x1="190" y1="100" x2="350" y2="180" stroke="#7ee8d6" strokeWidth="0.8" strokeOpacity="0.45" />
              <line x1="230" y1="80"  x2="390" y2="160" stroke="#7ee8d6" strokeWidth="0.8" strokeOpacity="0.45" />

              <line x1="190" y1="180" x2="350" y2="100" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.45" />
              <line x1="230" y1="200" x2="390" y2="120" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.45" />
              <line x1="150" y1="160" x2="310" y2="80"  stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.45" />

              {/* Glowing Nodes / Heatmap Points */}
              <circle cx="270" cy="140" r="4.5" fill="#ffffff" />
              <circle cx="270" cy="140" r="7" stroke="#7ee8d6" strokeWidth="1.2" fill="none" opacity="0.75" />

              <circle cx="230" cy="120" r="3" fill="#7ee8d6" />
              <circle cx="310" cy="120" r="3" fill="#38bdf8" />
              <circle cx="230" cy="160" r="3" fill="#2dd4bf" />
              <circle cx="310" cy="160" r="3.5" fill="#a78bfa" />

              <circle cx="190" cy="140" r="2.5" fill="#38bdf8" />
              <circle cx="350" cy="140" r="2.5" fill="#7ee8d6" />

              {/* Vertical Laser Light Pillar Connecting Layers */}
              <line
                x1="270"
                y1="60"
                x2="270"
                y2="340"
                stroke="#7ee8d6"
                strokeWidth="1.2"
                strokeDasharray="2 3"
                opacity="0.6"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Floating Chip 2: AUTOMATED DEFENSE (Bottom-Right) */}
      <div className="floating-chip chip-bottom-right">
        <div className="chip-icon-box chip-icon-teal">
          <ShieldCheck size={18} color="#2dd4bf" strokeWidth={2.2} />
        </div>
        <div className="chip-text-content">
          <div className="chip-eyebrow">AUTOMATED DEFENSE</div>
          <div className="chip-subtitle">Zero-Latency: 60s Ghost Load ...</div>
        </div>
      </div>

      <style jsx>{`
        .hero-isometric-container {
          position: relative;
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 420px;
        }

        .isometric-glow-cyan {
          position: absolute;
          top: 15%;
          left: 15%;
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, transparent 70%);
          filter: blur(48px);
          pointer-events: none;
          z-index: 0;
        }

        .isometric-glow-violet {
          position: absolute;
          bottom: 10%;
          right: 15%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
          filter: blur(52px);
          pointer-events: none;
          z-index: 0;
        }

        .isometric-layers-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          animation: floatSlabs 6s ease-in-out infinite;
        }

        .isometric-svg {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.65));
        }

        @keyframes floatSlabs {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        /* Floating Chips */
        .floating-chip {
          position: absolute;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 18px 10px 12px;
          background: rgba(10, 10, 24, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.65), 0 0 20px rgba(124, 58, 237, 0.15);
          white-space: nowrap;
          pointer-events: auto;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .floating-chip:hover {
          transform: translateY(-2px);
          border-color: rgba(126, 232, 214, 0.4);
        }

        .chip-top-left {
          top: 8%;
          left: -10px;
          animation: floatChip1 5s ease-in-out infinite;
        }

        .chip-bottom-right {
          bottom: 6%;
          right: -10px;
          animation: floatChip2 5.5s ease-in-out infinite;
        }

        @keyframes floatChip1 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes floatChip2 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
          }
        }

        .chip-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chip-icon-cyan {
          background: rgba(126, 232, 214, 0.12);
          border-color: rgba(126, 232, 214, 0.3);
          box-shadow: 0 0 14px rgba(126, 232, 214, 0.25);
        }

        .chip-icon-teal {
          background: rgba(45, 212, 191, 0.12);
          border-color: rgba(45, 212, 191, 0.3);
          box-shadow: 0 0 14px rgba(45, 212, 191, 0.25);
        }

        .chip-text-content {
          text-align: left;
        }

        .chip-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7ee8d6;
        }

        .chip-subtitle {
          font-size: 12px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: -0.01em;
          margin-top: 2px;
        }

        @media (max-width: 640px) {
          .chip-top-left {
            left: 0;
            top: 0;
          }
          .chip-bottom-right {
            right: 0;
            bottom: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default HeroIsometricStack;

