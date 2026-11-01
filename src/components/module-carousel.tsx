'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  Box,
  Camera,
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
  const [liveKW, setLiveKW] = useState<string>('142 kW');
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
            setLiveKW(`${(roomData.power_meter.watts / 1000).toFixed(0)} kW`);
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
        // keep defaults
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
      const amount = direction === 'left' ? -350 : 350;
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
      title: 'COMMAND CENTER',
      tag: 'Live Telemetry',
      bigStat: liveKW,
      statGradient: true,
      description: 'Real-time 142 kW microgrid draw, solar generation, and ghost gap monitoring.',
      route: '/dashboard',
      icon: Activity,
    },
    {
      id: 'bit-digital-twin',
      title: 'BIT DIGITAL TWIN',
      tag: 'Campus Map',
      bigStat: blockCount,
      statGradient: true,
      description: 'Interactive 8-building twin with thermal heatmaps and device controls.',
      route: '/campus-map',
      icon: Layers,
    },
    {
      id: 'vision-lab',
      title: 'VISION LAB',
      tag: 'Edge AI & Phone',
      bigStat: 'Edge AI',
      statGradient: true,
      description: 'COCO-SSD occupancy inference with phone camera wireless pairing.',
      route: '/vision-lab',
      icon: Camera,
    },
    {
      id: 'automation-control',
      title: 'AUTOMATION & CONTROL',
      tag: '0 Latency',
      bigStat: '0 Latency',
      statGradient: true,
      description: 'Campus Eco switch, load shedding, and 60-second safety response.',
      route: '/automation',
      icon: Sliders,
    },
    {
      id: 'classroom-3d',
      title: '3D CLASSROOM TWIN',
      tag: 'Live Occupancy',
      bigStat: liveOccupancy,
      statGradient: false,
      description: 'Walk into any classroom in 3D and see who is seated, row by row, with light and fan states.',
      route: '/classroom-3d',
      icon: Box,
    },
    {
      id: 'simulator',
      title: 'POWER SIMULATOR',
      tag: 'What-If Lab',
      bigStat: 'Simulate',
      statGradient: false,
      description: 'Place students and teachers, change sunlight and temperature, and watch power flow react.',
      route: '/simulator',
      icon: Cpu,
    },
    {
      id: 'helpdesk',
      title: 'EMERGENCY HELPDESK',
      tag: 'Safety Guard',
      bigStat: openIncidentsCount,
      statGradient: !openIncidentsCount.startsWith('0'),
      description: 'Short-circuit and fault alerts dispatched instantly to HODs and maintenance workers.',
      route: '/helpdesk',
      icon: AlertTriangle,
    },
    {
      id: 'assistant',
      title: 'AURA AI COACH',
      tag: 'GenAI Engine',
      bigStat: 'AI Coach',
      statGradient: true,
      description: 'Ask what is happening in any block, why a light is dim, or how to save energy.',
      route: '/assistant',
      icon: Sparkles,
    },
    {
      id: 'admin',
      title: 'ADMIN & ROLES',
      tag: 'RBAC Security',
      bigStat: 'Roles',
      description: 'Manage HODs, workers, and view-only accounts with strict Supabase RLS security.',
      route: '/admin',
      icon: ShieldAlert,
      requiresAuth: true,
      allowedRoles: ['admin', 'hod'],
    },
  ];

  return (
    <section style={{ margin: '80px 0 60px 0', position: 'relative', zIndex: 1 }}>
      {/* Section Header matching Screenshot 3 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          {/* Blue Glowing Dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#38bdf8',
                boxShadow: '0 0 10px #38bdf8',
                display: 'inline-block',
              }}
            />
          </div>

          <h2
            style={{
              fontSize: 'clamp(30px, 4.6vw, 48px)',
              fontWeight: 300,
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              margin: '0 0 12px 0',
              color: '#ffffff',
            }}
          >
            Explore All Campus
            <br />
            <span className="gradient-text-mint">Energy Twin Systems</span>
          </h2>
          <p
            style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.48)',
              fontSize: '15px',
              fontWeight: 300,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Click any module below to open its dedicated view with live simulated telemetry and controls &rarr;
          </p>
        </div>

        {/* Circular Left / Right Arrow Buttons from Screenshot 3 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
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
              border: '1px solid rgba(255, 255, 255, 0.12)',
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
          gap: '24px',
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

export default ModuleCarousel;
