'use client';

import React from 'react';
import { HeroSection } from '@/components/hero-section';
import { ModuleCarousel } from '@/components/module-carousel';
import { HowToUseSection } from '@/components/how-to-use';
import { InnovationCards } from '@/components/innovation-cards';

export default function HomePage() {
  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Part 1: Hero Section */}
      <HeroSection />

      {/* Part 2: Explore All Campus Energy Twin Systems Horizontal Carousel */}
      <ModuleCarousel />

      {/* Part 4: How to Use Eco Class (5-Step Stepper & Role Tab Switcher) */}
      <HowToUseSection />

      {/* Part 3: Engineered for Campus Net-Zero Goals (Core Innovations) */}
      <InnovationCards />
    </div>
  );
}
