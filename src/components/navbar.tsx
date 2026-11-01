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
    hod: { bg: 'rgba(139, 92, 246, 0.18)', text: '#c4b5fd', border: 'rgba(139, 92, 246, 0.45)' },
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
        background: 'rgba(5, 5, 16, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(124, 58, 237, 0.12)',
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
              background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(124, 58, 237, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <Layers size={19} color="#ffffff" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600, fontSize: '17px', letterSpacing: '-0.01em', color: '#fff' }}>
                Eco Class
              </span>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#8b5cf6',
                  boxShadow: '0 0 8px #8b5cf6',
                  display: 'inline-block',
                }}
                title="Telemetry Live & Connected"
              />
            </div>
            <span
              style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.08em',
                fontWeight: 400,
                textTransform: 'uppercase',
              }}
            >
              Sustainable Class
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
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
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 500 : 300,
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                  background: isActive ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(124, 58, 237, 0.35)' : 'transparent'}`,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.01em',
                  transition: 'all 0.18s ease',
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
              padding: '7px 14px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.14), rgba(239, 68, 68, 0.05))',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-pill)',
              color: '#fca5a5',
              fontSize: '12px',
              fontWeight: 500,
              textDecoration: 'none',
              letterSpacing: '0.02em',
              transition: 'all 0.2s ease',
            }}
          >
            <AlertTriangle size={13} />
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
                padding: '4px 10px 4px 4px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
              }}
              aria-label="User menu and role switcher"
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
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
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  {session.role}
                </span>
              </div>
              <ChevronDown size={13} color="rgba(255,255,255,0.4)" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '118%',
                  width: '260px',
                  background: '#080814',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 20px 48px rgba(0, 0, 0, 0.8)',
                  padding: '14px',
                  zIndex: 100,
                }}
              >
                <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>{session.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{session.email || 'No email attached'}</div>
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: currentRoleStyle.bg,
                      color: currentRoleStyle.text,
                      border: `1px solid ${currentRoleStyle.border}`,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    Active Role: {session.role}
                  </div>
                </div>

                {/* Role Switcher for Demo */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontWeight: 500 }}>
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
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: `1px solid ${session.role === r ? 'rgba(124, 58, 237, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                          background: session.role === r ? 'rgba(124, 58, 237, 0.16)' : 'rgba(255, 255, 255, 0.02)',
                          color: session.role === r ? '#c4b5fd' : 'rgba(255, 255, 255, 0.5)',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
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
                      borderRadius: '6px',
                    }}
                  >
                    <LogOut size={13} />
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
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              padding: '6px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#080814',
            borderBottom: '1px solid rgba(124, 58, 237, 0.18)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                color: pathname === link.href ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                background: pathname === link.href ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                textDecoration: 'none',
                fontWeight: pathname === link.href ? 500 : 300,
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
