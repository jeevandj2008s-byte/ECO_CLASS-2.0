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
    <Link
      href={finalHref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '310px',
        minWidth: '310px',
        height: '380px',
        padding: '24px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-card)',
        textDecoration: 'none',
        color: 'inherit',
        scrollSnapAlign: 'start',
        position: 'relative',
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
      className="module-card-item"
    >
      {/* Top Section */}
      <div>
        {/* Top Row: Icon Tile + Title + Monospace Tag Pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-tile-violet">
              <Icon size={20} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#ffffff',
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
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            {tag}
          </span>
        </div>

        {/* Big Stat / Word */}
        <div style={{ margin: '16px 0 12px 0' }}>
          <div
            className={`mono-telemetry ${statGradient ? 'gradient-text-mint' : ''}`}
            style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: statGradient ? 'inherit' : '#ffffff',
              lineHeight: 1.1,
            }}
          >
            {bigStat}
          </div>
        </div>

        {/* Short Description */}
        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>

      {/* Bottom Row: Aligned "Read now →" Pill Button */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            background: 'linear-gradient(135deg, rgba(109, 79, 224, 0.35), rgba(126, 232, 214, 0.2))',
            border: '1px solid rgba(109, 79, 224, 0.45)',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          <span>Read now</span>
          <ArrowRight size={14} color="var(--accent-mint)" />
        </div>
      </div>

      <style jsx>{`
        .module-card-item:hover {
          transform: translateY(-4px);
          border-color: var(--border-violet) !important;
          box-shadow: var(--shadow-card-hover) !important;
        }
      `}</style>
    </Link>
  );
}
