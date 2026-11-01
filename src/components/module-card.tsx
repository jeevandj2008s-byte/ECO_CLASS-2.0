'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { useRole } from '@/lib/auth/role-context';

export interface ModuleCardProps {
  id: string;
  title: string;
  tag: string;
  bigStat: string;
  statGradient?: boolean;
  description: string;
  route: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
  allowedRoles?: Array<'admin' | 'hod' | 'worker' | 'user'>;
}

export function ModuleCard({
  title,
  tag,
  bigStat,
  statGradient = false,
  description,
  route,
  icon: Icon,
  requiresAuth = false,
  allowedRoles,
}: ModuleCardProps) {
  const { session } = useRole();

  // If role-restricted, check permissions
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return null;
  }

  // If requires auth and not authenticated, link through login with returnUrl
  const finalHref = requiresAuth && !session.isAuthenticated
    ? `/login?returnUrl=${encodeURIComponent(route)}`
    : route;

  return (
    <div
      className="strata-card-wrapper module-card-outer"
      style={{
        width: '310px',
        minWidth: '310px',
        height: '380px',
        scrollSnapAlign: 'start',
      }}
    >
      <div className="strata-card-aura" />
      <Link
        href={finalHref}
        className="strata-card-inner"
        style={{
          padding: '24px',
          textDecoration: 'none',
          color: 'inherit',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Section */}
        <div>
          {/* Top Row: Icon Tile + Title + Tag Pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="strata-icon-tile">
                <Icon size={18} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  {title}
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                padding: '3px 9px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}
            >
              {tag}
            </span>
          </div>

          {/* Big Stat or Key Highlight */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 200,
              letterSpacing: '-0.02em',
              marginBottom: '14px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
            }}
            className={statGradient ? 'gradient-text-stat mono-telemetry' : 'mono-telemetry'}
          >
            {bigStat}
          </div>

          {/* Short Module Description */}
          <p
            style={{
              fontSize: '13px',
              fontWeight: 300,
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.45)',
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>

        {/* Bottom Action Pill */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div
            className="strata-btn-pill"
            style={{
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 400 }}>Read now</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </div>
  );
}
