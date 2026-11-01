'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/lib/auth/role-context';
import {
  Sparkles,
  AlertTriangle,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Layers,
  Activity,
} from 'lucide-react';
import { CAMPUS_CONFIG } from '@/lib/config/campus';
import { UserRole } from '@/lib/types/database.types';

export function Navbar() {
  const pathname = usePathname();
  const { session, setRole, logout } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Campus Map', href: '/campus-map' },
    { label: '3D Classroom', href: '/classroom-3d' },
    { label: 'Vision Lab', href: '/vision-lab' },
    { label: 'Automation', href: '/automation' },
    { label: 'Simulator', href: '/simulator' },
    { label: 'Help Desk', href: '/helpdesk' },
    { label: 'Eco AI', href: '/assistant' },
    { label: 'How to Use', href: '/how-to-use' },
  ];

  const roleColors: Record<UserRole, { bg: string; text: string; border: string }> = {
    admin: { bg: 'rgba(239, 68, 68, 0.15)', text: '#fca5a5', border: 'rgba(239, 68, 68, 0.4)' },
    hod: { bg: 'rgba(168, 85, 247, 0.15)', text: '#d8b4fe', border: 'rgba(168, 85, 247, 0.4)' },
    worker: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fcd34d', border: 'rgba(245, 158, 11, 0.4)' },
    user: { bg: 'rgba(126, 232, 214, 0.15)', text: '#7ee8d6', border: 'rgba(126, 232, 214, 0.4)' },
  };

  const currentRoleStyle = roleColors[session.role] || roleColors.user;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(11, 11, 16, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0 20px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6d4fe0, #7ee8d6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(109, 79, 224, 0.4)',
            }}
          >
            <Layers size={20} color="#0b0b10" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>
                Eco Class
              </span>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: 'var(--status-emerald)',
                  boxShadow: '0 0 8px #10b981',
                  display: 'inline-block',
                }}
                title="Telemetry Live & Connected"
              />
            </div>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--accent-mint)',
                letterSpacing: '0.04em',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Sustainable Class
            </span>
          </div>
        </Link>

        {/* Desktop Scrollable Navigation */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '4px',
            overflowX: 'auto',
            padding: '4px',
            scrollbarWidth: 'none',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent-mint)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-mint-subtle)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--border-mint)' : 'transparent'}`,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Report Issue Button */}
          <Link
            href="/helpdesk"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-pill)',
              color: '#fca5a5',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <AlertTriangle size={14} />
            <span className="hide-on-mobile">Report Issue</span>
          </Link>

          {/* User Profile / Role Chip */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px 4px 4px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
              aria-label="User menu and role switcher"
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6d4fe0, #a78bfa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {session.name ? session.name[0] : 'U'}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.1 }} className="hide-on-mobile">
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    color: currentRoleStyle.text,
                    fontWeight: 700,
                  }}
                >
                  {session.role}
                </span>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  width: '260px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.6)',
                  padding: '12px',
                  zIndex: 100,
                }}
              >
                <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{session.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{session.email || 'No email attached'}</div>
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: currentRoleStyle.bg,
                      color: currentRoleStyle.text,
                      border: `1px solid ${currentRoleStyle.border}`,
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    Active Role: {session.role}
                  </div>
                </div>

                {/* Role Switcher for Pair/Reviewer Demo */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontWeight: 600 }}>
                    Switch Demo Role
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    {(['admin', 'hod', 'worker', 'user'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRole(r);
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          padding: '5px 8px',
                          borderRadius: '4px',
                          border: `1px solid ${session.role === r ? 'var(--accent-mint)' : 'var(--border-subtle)'}`,
                          background: session.role === r ? 'var(--accent-mint-subtle)' : 'var(--bg-surface)',
                          color: session.role === r ? 'var(--accent-mint)' : 'var(--text-secondary)',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#f87171',
                      fontSize: '12px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                  >
                    <LogOut size={14} />
                    Reset to Guest / Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-medium)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                color: pathname === link.href ? 'var(--accent-mint)' : '#e2e8f0',
                background: pathname === link.href ? 'var(--accent-mint-subtle)' : 'transparent',
                textDecoration: 'none',
                fontWeight: pathname === link.href ? 600 : 500,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
