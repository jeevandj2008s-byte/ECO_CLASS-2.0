'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Activity,
  Map,
  Box,
  Eye,
  Sliders,
  Cpu,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { ModuleCard, ModuleCardProps } from './module-card';
import { CAMPUS_CONFIG } from '@/lib/config/campus';

export function ModuleCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Live dynamic states for cards
  const [liveKW, setLiveKW] = useState<string>('1.4 kW');
  const [liveOccupancy, setLiveOccupancy] = useState<string>('1 Seated');
  const [openIncidentsCount, setOpenIncidentsCount] = useState<string>('0 Open');
  const [blockCount, setBlockCount] = useState<string>(`${CAMPUS_CONFIG.totalBlocksCount} Blocks`);

  useEffect(() => {
    async function fetchCarouselData() {
      try {
        const [roomRes, incidentsRes, campusRes] = await Promise.all([
          fetch('/api/classrooms/c1000000-0000-0000-0000-000000000204').catch(() => null),
          fetch('/api/incidents').catch(() => null),
          fetch('/api/campus').catch(() => null),
        ]);

        if (roomRes && roomRes.ok) {
          const roomData = await roomRes.json();
          if (roomData.power_meter && roomData.power_meter.watts) {
            setLiveKW(`${(roomData.power_meter.watts / 1000).toFixed(1)} kW`);
          }
          if (roomData.occupancy && roomData.occupancy.total !== undefined) {
            setLiveOccupancy(`${roomData.occupancy.total} Seated`);
          }
        }

        if (incidentsRes && incidentsRes.ok) {
          const incData = await incidentsRes.json();
          const openCount = (incData.incidents || []).filter((i: any) => i.status === 'open').length;
          setOpenIncidentsCount(`${openCount} Open`);
        }

        if (campusRes && campusRes.ok) {
          const cData = await campusRes.json();
          if (cData.blocks && cData.blocks.length > 0) {
            setBlockCount(`${cData.blocks.length} Blocks`);
          }
        }
      } catch {
        // use fallback values
      }
    }

    fetchCarouselData();
    const timer = setInterval(fetchCarouselData, 6000);
    return () => clearInterval(timer);
  }, []);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      scroll('left');
    } else if (e.key === 'ArrowRight') {
      scroll('right');
    }
  };

  const moduleItems: ModuleCardProps[] = [
    {
      id: 'command-center',
      title: 'Command Center',
      tag: 'Live Telemetry',
      bigStat: liveKW,
      statGradient: true,
      description: 'Real-time campus power draw, solar generation, and energy-waste monitoring.',
      route: '/dashboard',
      icon: Activity,
    },
    {
      id: 'campus-map',
      title: 'Campus Map',
      tag: 'Digital Twin',
      bigStat: blockCount,
      description: 'Interactive campus map with block-level heatmaps and device controls.',
      route: '/campus-map',
      icon: Map,
    },
    {
      id: 'classroom-3d',
      title: '3D Classroom',
      tag: 'Live Occupancy',
      bigStat: liveOccupancy,
      statGradient: true,
      description: 'Walk into any classroom in 3D and see who is seated, row by row, with light and fan states.',
      route: '/classroom-3d',
      icon: Box,
    },
    {
      id: 'vision-lab',
      title: 'Vision Lab',
      tag: 'Face & Edge AI',
      bigStat: 'Edge AI',
      description: 'Face recognition and people counting to know exactly who is in class.',
      route: '/vision-lab',
      icon: Eye,
    },
    {
      id: 'automation',
      title: 'Automation & Control',
      tag: 'Smart Switches',
      bigStat: '0 Latency',
      statGradient: true,
      description: 'Auto dim, brighten, and fan control by occupancy, sunlight, temperature and humidity.',
      route: '/automation',
      icon: Sliders,
    },
    {
      id: 'simulator',
      title: 'Power Simulator',
      tag: 'What-If',
      bigStat: 'Simulate',
      description: 'Place students and teachers, change sunlight and temperature, and watch power flow react.',
      route: '/simulator',
      icon: Cpu,
    },
    {
      id: 'helpdesk',
      title: 'Emergency Help Desk',
      tag: 'Safety',
      bigStat: openIncidentsCount,
      statGradient: openIncidentsCount.startsWith('0') ? false : true,
      description: 'Short-circuit and fault alerts sent instantly to HODs and workers.',
      route: '/helpdesk',
      icon: AlertTriangle,
    },
    {
      id: 'assistant',
      title: 'Eco AI Assistant',
      tag: 'Ask Anything',
      bigStat: 'AI Coach',
      statGradient: true,
      description: 'Ask what is happening in any block, why a light is dim, or where to save energy.',
      route: '/assistant',
      icon: Sparkles,
    },
    {
      id: 'admin',
      title: 'Admin & Users',
      tag: 'Access',
      bigStat: 'Roles',
      description: 'Manage HODs, workers and users with Google login.',
      route: '/admin',
      icon: ShieldAlert,
      requiresAuth: true,
      allowedRoles: ['admin', 'hod'], // Only shown to admin or HOD
    },
  ];

  return (
    <section style={{ margin: '80px 0 60px 0', position: 'relative', zIndex: 1 }}>
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '28px',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div className="eyebrow-badge" style={{ marginBottom: '10px' }}>
            <span>MODULAR DIGITAL TWIN</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              fontWeight: 200,
              letterSpacing: '-0.035em',
              lineHeight: 1.15,
              margin: '0 0 8px 0',
              color: '#ffffff',
            }}
          >
            Explore All Campus
            <br />
            <span className="gradient-text-violet">Energy Twin Systems</span>
          </h2>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: '15px', fontWeight: 300 }}>
            Click any module below to open its dedicated view with live telemetry and controls &rarr;
          </p>
        </div>

        {/* Circular Left / Right Arrow Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: canScrollLeft ? '#ffffff' : 'rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollLeft ? 'pointer' : 'not-allowed',
              opacity: canScrollLeft ? 1 : 0.4,
              transition: 'all 0.2s ease',
            }}
            aria-label="Scroll carousel left"
          >
            <ChevronLeft size={19} />
          </button>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: canScrollRight ? '#ffffff' : 'rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollRight ? 'pointer' : 'not-allowed',
              opacity: canScrollRight ? 1 : 0.4,
              transition: 'all 0.2s ease',
            }}
            aria-label="Scroll carousel right"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Campus Energy Twin Systems Carousel"
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '24px',
          paddingTop: '6px',
          scrollbarWidth: 'none',
          outline: 'none',
        }}
      >
        {moduleItems.map((item) => (
          <ModuleCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
