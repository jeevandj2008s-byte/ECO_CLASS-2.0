'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Layers } from 'lucide-react';
import { CAMPUS_CONFIG, formatNumberIN } from '@/lib/config/campus';
import { HeroIsometricStack } from './hero-isometric-stack';

interface HeroLiveStats {
  liveLoadKW: number;
  energySavedKWh: number;
  peopleDetected: number;
  co2AvoidedKg: number;
}

export function HeroSection() {
  const [stats, setStats] = useState<HeroLiveStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const [crRes, energyRes] = await Promise.all([
          fetch('/api/classrooms/c1000000-0000-0000-0000-000000000204').catch(() => null),
          fetch('/api/energy/stats?period=today').catch(() => null),
        ]);

        let liveWatts = 519500; // 519.50 kW campus aggregate
        let people = 260;
        let savedKWh = 94.2;
        let co2Kg = 66.88;

        if (crRes && crRes.ok) {
          const crData = await crRes.json();
          if (crData.power_meter && crData.power_meter.watts) {
            // Scale classroom reading to full 8-block campus microgrid draw
            liveWatts = Math.max(519500, crData.power_meter.watts * 120);
          }
          if (crData.occupancy && crData.occupancy.total !== undefined) {
            people = Math.max(260, crData.occupancy.total * 8);
          }
        }

        if (energyRes && energyRes.ok) {
          const energyData = await energyRes.json();
          if (energyData.metrics) {
            savedKWh = energyData.metrics.totalSavedKwh || savedKWh;
            co2Kg = energyData.metrics.totalCo2SavedKg || co2Kg;
          }
        }

        setStats({
          liveLoadKW: Number((liveWatts / 1000).toFixed(2)),
          energySavedKWh: Number(savedKWh.toFixed(2)),
          peopleDetected: people,
          co2AvoidedKg: Number(co2Kg.toFixed(1)),
        });
      } catch {
        setStats({
          liveLoadKW: 519.5,
          energySavedKWh: 94.2,
          peopleDetected: 260,
          co2AvoidedKg: 66.9,
        });
      } finally {
        setLoading(false);
      }
    }

    loadTelemetry();
    const interval = setInterval(loadTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        paddingTop: '64px',
        paddingBottom: '48px',
        position: 'relative',
        zIndex: 1,
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      {/* Radial shadow overlay behind hero */}
      <div className="hero-radial-overlay" />

      {/* 2-Column Hero Grid matching Screenshot 4 */}
      <div className="hero-grid-container">
        {/* Left Column: Eyebrow + Headline + Description + 3 Buttons */}
        <div className="hero-content-left">
          {/* 1. Eyebrow Pill Badge with Sparkle Icon */}
          <div style={{ marginBottom: '24px' }}>
            <div className="eyebrow-badge">
              <Sparkles size={14} color="#a78bfa" />
              <span>BIT Hackathon 2026 &bull; AI-Powered Campus Microgrid Digital Twin</span>
            </div>
          </div>

          {/* 2. Giant Headline on Three Lines */}
          <h1 className="hero-giant-heading">
            Sustainable Energy.
            <br />
            Reimagined in
            <br />
            <span className="gradient-text-mint">Real-Time.</span>
          </h1>

          {/* 3. Description Paragraph */}
          <p className="hero-lead-paragraph">
            AuraSync creates a living digital twin of{' '}
            <strong style={{ color: '#ffffff', fontWeight: 500 }}>
              {CAMPUS_CONFIG.collegeName}
            </strong>
            . Uniting computer vision occupancy, synthetic IoT telemetry, and GenAI coaching to
            bust energy ghosts campus-wide.
          </p>

          {/* 4. Three Buttons in a Row (Stack on Mobile) */}
          <div className="hero-buttons-container">
            {/* Primary Violet Button */}
            <Link href="/dashboard" className="strata-btn-primary">
              <Zap size={15} color="#ffffff" />
              <span>Launch Command Center</span>
              <ArrowRight size={15} />
            </Link>

            {/* Secondary Outlined Campus Map */}
            <Link href="/campus-map" className="strata-btn-secondary">
              <Layers size={15} color="rgba(255, 255, 255, 0.7)" />
              <span>Explore BIT Campus Map</span>
            </Link>

            {/* Secondary Outlined Ask Eco AI */}
            <Link href="/assistant" className="strata-btn-secondary">
              <Sparkles size={15} color="#a78bfa" />
              <span>Ask Aura AI</span>
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Isometric Glowing Stack Graphic */}
        <div className="hero-graphic-right">
          <HeroIsometricStack />
        </div>
      </div>

      {/* Thin Subtle Divider */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
          margin: '48px 0 36px 0',
          position: 'relative',
          zIndex: 1,
        }}
      />

      {/* 5. Live Stat Counters Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Metric 1 */}
        <div style={{ textAlign: 'center' }}>
          {loading ? (
            <div
              style={{
                height: '36px',
                width: '110px',
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: 'clamp(28px, 3.6vw, 38px)',
                fontWeight: 200,
                letterSpacing: '-0.02em',
              }}
              className="mono-telemetry gradient-text-stat"
            >
              {stats?.liveLoadKW.toFixed(2)}
              <span style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.4)', marginLeft: '4px' }}>
                kW
              </span>
            </div>
          )}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              marginTop: '6px',
            }}
          >
            Live Campus Load
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{ textAlign: 'center' }}>
          {loading ? (
            <div
              style={{
                height: '36px',
                width: '90px',
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: 'clamp(28px, 3.6vw, 38px)',
                fontWeight: 200,
                letterSpacing: '-0.02em',
              }}
              className="mono-telemetry gradient-text-stat"
            >
              {stats?.energySavedKWh.toFixed(2)}
              <span style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.4)', marginLeft: '4px' }}>
                kWh
              </span>
            </div>
          )}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              marginTop: '6px',
            }}
          >
            Energy Saved Today
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{ textAlign: 'center' }}>
          {loading ? (
            <div
              style={{
                height: '36px',
                width: '90px',
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: 'clamp(28px, 3.6vw, 38px)',
                fontWeight: 200,
                letterSpacing: '-0.02em',
              }}
              className="mono-telemetry gradient-text-stat"
            >
              {stats?.peopleDetected !== undefined ? formatNumberIN(stats.peopleDetected) : '260'}
            </div>
          )}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              marginTop: '6px',
            }}
          >
            Students &amp; Faculty Detected
          </div>
        </div>

        {/* Metric 4 */}
        <div style={{ textAlign: 'center' }}>
          {loading ? (
            <div
              style={{
                height: '36px',
                width: '90px',
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: 'clamp(28px, 3.6vw, 38px)',
                fontWeight: 200,
                letterSpacing: '-0.02em',
              }}
              className="mono-telemetry gradient-text-stat"
            >
              8<span style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.4)', marginLeft: '4px' }}>Blocks</span>
            </div>
          )}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              marginTop: '6px',
            }}
          >
            Monitored Campus Blocks
          </div>
        </div>
      </div>

      {/* 6. Mouse Scroll Animation Indicator at Bottom */}
      <div
        style={{
          marginTop: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.4,
          pointerEvents: 'none',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '20px',
            height: '32px',
            borderRadius: '9999px',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            position: 'relative',
          }}
        >
          <div
            className="scroll-indicator-dot"
            style={{
              width: '2px',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.75)',
              borderRadius: '9999px',
              position: 'absolute',
              top: '6px',
              left: '50%',
            }}
          />
        </div>
        <span
          style={{
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          Scroll
        </span>
      </div>

      <style jsx>{`
        .hero-grid-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 40px;
          position: relative;
          z-index: 1;
        }

        .hero-content-left {
          text-align: left;
        }

        .hero-giant-heading {
          font-size: clamp(2.4rem, 4.8vw, 4.2rem);
          font-weight: 200;
          line-height: 1.08;
          letterSpacing: -0.035em;
          margin: 0 0 24px 0;
          color: #ffffff;
        }

        .hero-lead-paragraph {
          font-size: clamp(14px, 1.6vw, 16px);
          font-weight: 300;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.5);
          max-width: 580px;
          margin: 0 0 36px 0;
        }

        .hero-buttons-container {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .hero-graphic-right {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 980px) {
          .hero-grid-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-content-left {
            text-align: center;
          }
          .hero-lead-paragraph {
            margin: 0 auto 36px auto;
          }
          .hero-buttons-container {
            justify-content: center;
          }
          .hero-graphic-right {
            margin-top: 20px;
          }
        }

        @media (max-width: 640px) {
          .hero-buttons-container {
            flex-direction: column !important;
            width: 100% !important;
          }
          .hero-buttons-container a {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
