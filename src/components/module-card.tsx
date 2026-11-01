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
        width: '320px',
        minWidth: '320px',
        height: '390px',
        scrollSnapAlign: 'start',
      }}
    >
      <div className="strata-card-aura" />
      <Link
        href={finalHref}
        className="strata-card-inner"
        style={{
          padding: '28px 24px',
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Section */}
        <div>
          {/* Top Row: Icon Tile + Title + Tag Pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="strata-icon-tile">
                <Icon size={18} color="rgba(255, 255, 255, 0.85)" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#ffffff',
                  }}
                >
                  {title}
                </div>
              </div>
            </div>
            {tag && (
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  color: 'rgba(255, 255, 255, 0.55)',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                {tag}
              </span>
            )}
          </div>

          {/* Big Stat or Key Highlight */}
          <div
            style={{
              fontSize: '36px',
              fontWeight: 200,
              letterSpacing: '-0.025em',
              marginBottom: '14px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
            }}
            className={statGradient ? 'gradient-text-mint mono-telemetry' : 'mono-telemetry'}
          >
            {bigStat}
          </div>

          {/* Short Module Description */}
          <p
            style={{
              fontSize: '13px',
              fontWeight: 300,
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.48)',
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>

        {/* Bottom Signature Violet Pill Button (from Screenshot 3) */}
        <div style={{ paddingTop: '16px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #6d4fe0 0%, #5835cf 100%)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.02em',
              boxShadow: '0 4px 16px rgba(109, 79, 224, 0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            className="read-now-pill"
          >
            <span>Read now</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ModuleCard;
