'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Keyboard,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CAMPUS_CONFIG } from '@/lib/config/campus';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How does bench-row targeted lighting work without illuminating empty rows?',
    answer:
      'Eco Class partitions each classroom into bench-row lighting zones (Rows 1 through 5 in standard layout). Overhead cameras and vision edge models detect spatial occupant coordinates. If one student sits in the back row (Row 5), only the Row 5 lighting circuit boosts to reach target study illumination (400 Lux), while unoccupied front and middle rows are kept at a 10% safety dimming level, saving up to 80% fixture wattage.',
  },
  {
    question: 'What happens if environmental sensors fail or disconnect?',
    answer:
      'The deterministic automation engine monitors sensor heartbeat freshness every evaluation cycle. If telemetry drops for more than 60 seconds, the system triggers FAILSAFE_TRIGGERED mode: all classroom zone lights default to a safe 70% brightness and fans switch to safe medium ventilation (speed 2). Occupants are never left in the dark due to a sensor dropout.',
  },
  {
    question: 'How does the Emergency Help Desk automatically cut power during a short circuit?',
    answer:
      'Sub-panel digital power meters stream current (Amps) and voltage telemetry every second. If an instantaneous spike exceeds 50A with line voltage collapse or continuous draw exceeds 25A, the emergency coordinator executes an automated breaker trip command (mode = forced_off). At the same moment, multi-channel alerts (Web Push, Email, and SMS via Twilio) are broadcast to on-duty electricians and the department HOD.',
  },
  {
    question: 'What is the privacy policy regarding face embeddings and cameras?',
    answer:
      'Eco Class is engineered with strict Privacy-by-Design. Raw video frames are analyzed entirely in volatile memory and immediately destroyed after vector extraction. Only 512-dimensional normalized biometric embeddings are stored in PostgreSQL pgvector, and ONLY for students and faculty who have signed an explicit consent agreement. Anyone can trigger the GDPR Right-to-Forget button in the Vision Lab to instantly purge their embeddings.',
  },
  {
    question: 'Can regular students or visitors control classroom switches?',
    answer:
      'No. The Row Level Security (RLS) policies and backend API permission gates restrict manual hardware control strictly to Workers, HODs, and Administrators. Students and unauthenticated visitors have view-only access to the 3D twin, campus map, and carbon metrics. Any unauthorized command attempt returns HTTP 403 Forbidden and records an audit log entry.',
  },
  {
    question: 'How is energy baseline savings calculated in Indian Rupees (₹)?',
    answer:
      `Each classroom is calibrated against an unmanaged baseline representing legacy fixtures left running at 100% full capacity. Real-time consumption is subtracted from baseline to calculate kWh saved. Savings are multiplied by the local institutional tariff (₹${CAMPUS_CONFIG.tariffINRPerKWh.toFixed(2)}/kWh under BESCOM HT educational rate) and the national grid carbon factor (${CAMPUS_CONFIG.gridEmissionFactorKgPerKWh} kg CO₂e/kWh).`,
  },
];

export default function HowToUsePage() {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '14px' }}>
          <span>COMPLETE OPERATIONAL GUIDE</span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 200,
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
            color: '#fff',
          }}
        >
          How to Use Eco Class
        </h1>
        <p style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
          Official manual for administrators, faculty HODs, electricians, and students at{' '}
          <strong style={{ color: '#fff', fontWeight: 500 }}>{CAMPUS_CONFIG.collegeName}</strong>.
        </p>
      </div>

      {/* Playbook Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '60px' }}>
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 400, color: '#c4b5fd', margin: '0 0 12px 0' }}>
              1. Sign In &amp; Role-Based Access
            </h2>
            <p style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.5)', margin: '0 0 18px 0' }}>
              Eco Class uses Google Workspace OAuth. Sign in with your registered college email (e.g. <code>@bit-bangalore.edu.in</code>).
              If your email is on the pre-approved administrator allowlist, your role (Admin, HOD, Worker) is automatically provisioned via database triggers.
              Unregistered users receive view-only Student/Guest privileges.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/login" className="strata-btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                Go to Sign In &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 400, color: '#c4b5fd', margin: '0 0 12px 0' }}>
              2. Campus Map &amp; 3D Digital Twin Navigation
            </h2>
            <p style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.5)', margin: '0 0 18px 0' }}>
              Select any academic block on the Campus Map to view live power meters. Click through to a classroom (such as CR-204 in Turing Block)
              to inspect the 3D seating twin. You can see student seating coordinates in real time, view live watts per bench-row fixture,
              and inspect the power flow tree from the transformer down to individual actuators.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/campus-map" className="strata-btn-secondary" style={{ padding: '8px 18px', fontSize: '13px', color: '#c4b5fd' }}>
                Open Campus Map &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 400, color: '#c4b5fd', margin: '0 0 12px 0' }}>
              3. Automated Energy Optimization vs Manual Overrides
            </h2>
            <p style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.5)', margin: 0 }}>
              Classroom devices operate in <strong>Auto Mode</strong> by default. The engine continuously samples ambient lux to harvest daylight
              and reads temperature/humidity to scale ceiling fans. If special event lighting is needed, staff can apply a manual override
              with an expiry window. The engine respects technician overrides and resumes automatic energy-saving once the timer expires.
            </p>
          </div>
        </div>

        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 400, color: '#c4b5fd', margin: '0 0 12px 0' }}>
              4. Emergency Incident Help Desk
            </h2>
            <p style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.5)', margin: 0 }}>
              In the event of an electrical hazard or burning smell, any staff member can trip circuit power using the Emergency Help Desk button.
              Automatic breaker trip events broadcast alerts directly to facilities technicians, who must acknowledge the alert, conduct on-site
              investigations, and record resolution notes before power can be restored.
            </p>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Box */}
      <div className="strata-card-wrapper" style={{ marginBottom: '60px' }}>
        <div className="strata-card-aura" />
        <div
          className="strata-card-inner"
          style={{
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Keyboard size={18} color="#a78bfa" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 400, color: '#fff' }}>
              Keyboard Shortcuts &amp; Accessibility
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '13px' }}>
            <div>
              <kbd style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: '#c4b5fd', marginRight: '8px' }}>
                Ctrl + Shift + D
              </kbd>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 300 }}>Toggle Sim Debug Console</span>
            </div>
            <div>
              <kbd style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: '#c4b5fd', marginRight: '8px' }}>
                &larr; / &rarr;
              </kbd>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 300 }}>Scroll Module Carousel</span>
            </div>
            <div>
              <kbd style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: '#c4b5fd', marginRight: '8px' }}>
                Tab / Shift+Tab
              </kbd>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 300 }}>Keyboard Focus Ring Navigation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (Accordion) */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 200, letterSpacing: '-0.02em', color: '#fff', marginBottom: '24px', textAlign: 'center' }}>
          Frequently Asked Questions (FAQs)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openFAQIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: '#080814',
                  border: `1px solid ${isOpen ? 'rgba(124, 58, 237, 0.45)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 400,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp size={16} color="#c4b5fd" /> : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 22px 22px 22px',
                      fontSize: '13px',
                      fontWeight: 300,
                      lineHeight: 1.65,
                      color: 'rgba(255, 255, 255, 0.55)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      paddingTop: '14px',
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
