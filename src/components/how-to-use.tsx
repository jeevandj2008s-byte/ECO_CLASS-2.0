'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LogIn,
  MapPin,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  BookOpen,
} from 'lucide-react';
import { UserRole } from '@/lib/types/database.types';

export function HowToUseSection() {
  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('admin');

  const steps = [
    {
      num: '01',
      title: 'Sign in with Google',
      desc: 'Use your registered college Gmail. Unregistered accounts get view-only student access.',
      icon: LogIn,
    },
    {
      num: '02',
      title: 'Pick Block & Room',
      desc: 'Select an academic block (Turing Block A or Tesla Block B) on the Campus Map.',
      icon: MapPin,
    },
    {
      num: '03',
      title: 'Watch Live Twin',
      desc: 'Inspect row-by-row student seating in the 3D Classroom and live power draw in watts.',
      icon: Eye,
    },
    {
      num: '04',
      title: 'Automation & Control',
      desc: 'Let Auto Mode dim empty rows and scale fans, or take manual override if required.',
      icon: Sliders,
    },
    {
      num: '05',
      title: 'Ask Eco AI & Alerts',
      desc: 'Ask questions in plain English or receive instant breaker trip alerts on faults.',
      icon: Sparkles,
    },
  ];

  const roleDetails: Record<
    UserRole,
    { title: string; subtitle: string; badge: string; capabilities: string[] }
  > = {
    admin: {
      title: 'Campus Administrator & Estate Officer',
      subtitle: 'Complete institutional authority across all academic blocks and sub-panels.',
      badge: 'UNIVERSAL ACCESS',
      capabilities: [
        'Edit global automation rules (Target Lux, cooling thresholds, empty grace periods).',
        'Promote staff roles and manage the pre-approved Google email allowlist.',
        'View complete immutable audit logs for all device commands and role modifications.',
        'Access live emergency breaker trip statuses and configure SMS/email providers.',
      ],
    },
    hod: {
      title: 'Head of Department (HOD)',
      subtitle: 'Department-level supervisory control and classroom resource efficiency.',
      badge: 'DEPARTMENT SUPERVISOR',
      capabilities: [
        'Monitor real-time energy usage and student attendance across all department labs.',
        'Control and override lighting zones or fans in departmental classrooms.',
        'Receive immediate emergency short-circuit notifications for department rooms.',
        'Schedule and sync timetable classes to prevent pre-class power shutdowns.',
      ],
    },
    worker: {
      title: 'Facility Technician & Electrician',
      subtitle: 'On-ground operational control and electrical safety incident resolution.',
      badge: 'OPERATIONAL TECHNICIAN',
      capabilities: [
        'Take manual control of lights and ceiling fans in assigned blocks during maintenance.',
        'Acknowledge and investigate circuit breaker trips and power-meter overcurrent alerts.',
        'Mark emergency incidents resolved with timestamped inspection notes.',
        'Verify MQTT actuator acknowledgements and physical breaker health.',
      ],
    },
    user: {
      title: 'Student & Faculty Member',
      subtitle: 'Transparent campus carbon accounting and digital twin classroom viewer.',
      badge: 'VIEW-ONLY ACCESS',
      capabilities: [
        'Explore the 3D digital twin to locate available seating and active study rows.',
        'View live energy conservation metrics and carbon footprint avoided campus-wide.',
        'Interact with the Eco AI Assistant to understand energy waste and lighting policies.',
        'Hardware control and breaker settings are safely restricted to prevent unauthorized interference.',
      ],
    },
  };

  const currentRole = roleDetails[activeRoleTab];

  return (
    <section style={{ margin: '80px 0', position: 'relative', zIndex: 1 }}>
      {/* Eyebrow & Heading */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '14px' }}>
          <span>STEP-BY-STEP PLAYBOOK</span>
        </div>
        <h2
          style={{
            fontSize: 'clamp(28px, 4.5vw, 44px)',
            fontWeight: 200,
            letterSpacing: '-0.035em',
            margin: '0 0 10px 0',
            color: '#ffffff',
          }}
        >
          How to Use Eco Class
        </h2>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: '15px', fontWeight: 300 }}>
          Five simple steps to monitor, automate, and eliminate campus energy waste.
        </p>
      </div>

      {/* 5-Step Horizontal Stepper (Stacks on Mobile) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '56px',
        }}
      >
        {steps.map((s) => {
          const StepIcon = s.icon;
          return (
            <div key={s.num} className="strata-card-wrapper">
              <div className="strata-card-aura" />
              <div
                className="strata-card-inner"
                style={{
                  padding: '24px 20px',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      className="mono-telemetry gradient-text-stat"
                      style={{
                        fontSize: '20px',
                        fontWeight: 300,
                      }}
                    >
                      {s.num}
                    </div>
                    <div className="strata-icon-tile" style={{ width: '32px', height: '32px' }}>
                      <StepIcon size={15} />
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '0.01em',
                      margin: '0 0 8px 0',
                      color: '#ffffff',
                    }}
                  >
                    {s.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: 300,
                      lineHeight: 1.6,
                      color: 'rgba(255, 255, 255, 0.45)',
                      margin: 0,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Tab Switcher & Details Card */}
      <div className="strata-card-wrapper">
        <div className="strata-card-aura" />
        <div
          className="strata-card-inner"
          style={{
            padding: '36px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '28px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                  fontWeight: 500,
                }}
              >
                ROLE-BASED GOVERNANCE
              </div>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 300, letterSpacing: '-0.02em', color: '#fff' }}>
                Permissions &amp; Capabilities by Role
              </h3>
            </div>

            {/* Role Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '4px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {(['admin', 'hod', 'worker', 'user'] as UserRole[]).map((r) => {
                const isSelected = activeRoleTab === r;
                return (
                  <button
                    key={r}
                    onClick={() => setActiveRoleTab(r)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-pill)',
                      border: 'none',
                      background: isSelected
                        ? 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)'
                        : 'transparent',
                      color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Role Content */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 9px',
                  borderRadius: '4px',
                  background: 'rgba(124, 58, 237, 0.12)',
                  color: '#c4b5fd',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  display: 'inline-block',
                  marginBottom: '10px',
                }}
              >
                {currentRole.badge}
              </span>
              <h4 style={{ fontSize: '18px', fontWeight: 400, margin: '0 0 8px 0', color: '#fff' }}>
                {currentRole.title}
              </h4>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.45)',
                  margin: '0 0 24px 0',
                }}
              >
                {currentRole.subtitle}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/simulator" className="strata-btn-primary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                  <Cpu size={14} />
                  <span>Try the Simulator</span>
                </Link>
                <Link href="/how-to-use" className="strata-btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                  <BookOpen size={14} color="#a78bfa" />
                  <span>Read Full Guide</span>
                </Link>
              </div>
            </div>

            {/* Capabilities List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
              {currentRole.capabilities.map((cap, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 300,
                    lineHeight: 1.55,
                    color: 'rgba(255, 255, 255, 0.85)',
                  }}
                >
                  <CheckCircle2 size={16} color="#8b5cf6" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
