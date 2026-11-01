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
  Zap,
  Activity,
  Plus,
  Command,
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
    { label: 'Vision Lab', href: '/vision-lab' },
    { label: 'HVAC Control', href: '/automation' },
    { label: 'Simulator', href: '/simulator' },
    { label: '3D Classroom', href: '/classroom-3d' },
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

  // Derive display initials
  const initials = session.name
    ? session.name.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase()
    : 'DE';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(5, 5, 16, 0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(124, 58, 237, 0.14)',
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
        {/* Brand Logo & Institution Info matching Screenshot 4 */}
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
            <Zap size={18} color="#ffffff" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '-0.01em', color: '#fff' }}>
                AuraSync
              </span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: 'rgba(124, 58, 237, 0.25)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  color: '#c4b5fd',
                  letterSpacing: '0.04em',
                }}
              >
                {CAMPUS_CONFIG.collegeShortName}
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
                letterSpacing: '0.04em',
                fontWeight: 300,
              }}
            >
              Energy Twin &bull; {CAMPUS_CONFIG.teamName}, {CAMPUS_CONFIG.collegeShortName}
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
                  background: isActive ? 'rgba(124, 58, 237, 0.18)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(124, 58, 237, 0.4)' : 'transparent'}`,
                  boxShadow: isActive ? '0 0 12px rgba(124, 58, 237, 0.2)' : 'none',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick Report Waste Button (Screenshot 4) */}
          <Link
            href="/helpdesk"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: 'var(--radius-pill)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 500,
              textDecoration: 'none',
              letterSpacing: '0.02em',
              boxShadow: '0 0 16px rgba(124, 58, 237, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <Plus size={13} strokeWidth={2.4} />
            <span className="hide-on-mobile">Report Waste</span>
          </Link>

          {/* Quick Command shortcut badge */}
          <Link
            href="/assistant"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              color: 'rgba(255, 255, 255, 0.45)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
            }}
            className="cmd-k-shortcut"
            title="Ask AI (Cmd+K)"
          >
            <Command size={12} />
            <span>K</span>
          </Link>

          {/* User Profile / Role Chip */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 10px 5px 6px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                color: '#fff',
                transition: 'all 0.2s ease',
              }}
              aria-label="User Account Menu"
              aria-expanded={userDropdownOpen}
            >
              {/* Initials circle from Screenshot 4 */}
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                {initials}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.1 }} className="hide-on-mobile">
                <div style={{ fontSize: '11.5px', fontWeight: 500, color: '#fff' }}>
                  {session.name || `Demo ${session.role.toUpperCase()}`}
                </div>
                <div
                  style={{
                    fontSize: '9.5px',
                    fontFamily: 'var(--font-mono)',
                    color: currentRoleStyle.text,
                    textTransform: 'uppercase',
                  }}
                >
                  {session.role}
                </div>
              </div>
              <ChevronDown size={13} color="rgba(255, 255, 255, 0.4)" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '260px',
                  background: '#0a0a18',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '12px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(124, 58, 237, 0.2)',
                  zIndex: 100,
                }}
              >
                {/* User Info Header */}
                <div
                  style={{
                    paddingBottom: '10px',
                    marginBottom: '10px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ fontWeight: 500, fontSize: '13px', color: '#fff' }}>
                    {session.name || 'Demo User'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {session.email || 'hod.aiml@aurasync.demo'}
                  </div>
                  <div style={{ marginTop: '6px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        background: currentRoleStyle.bg,
                        border: `1px solid ${currentRoleStyle.border}`,
                        color: currentRoleStyle.text,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      {session.role}
                    </span>
                  </div>
                </div>

                {/* Role Switcher (Simulation / Testing) */}
                <div style={{ marginBottom: '10px' }}>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.4)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    Quick Role Switch:
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
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase',
                          borderRadius: '6px',
                          border: `1px solid ${session.role === r ? 'rgba(124, 58, 237, 0.5)' : 'rgba(255, 255, 255, 0.06)'}`,
                          background: session.role === r ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                          color: session.role === r ? '#c4b5fd' : 'rgba(255, 255, 255, 0.6)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account / Admin Link */}
                {(session.role === 'admin' || session.role === 'hod') && (
                  <Link
                    href="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      marginBottom: '4px',
                      background: 'rgba(255, 255, 255, 0.02)',
                    }}
                  >
                    <Shield size={14} color="#a78bfa" />
                    <span>Admin User Management</span>
                  </Link>
                )}

                {/* Sign Out Button */}
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
                    padding: '8px 10px',
                    fontSize: '12px',
                    color: '#fca5a5',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '6px',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              cursor: 'pointer',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(5, 5, 16, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
            padding: '16px 20px 24px 20px',
          }}
          className="mobile-nav-drawer"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: isActive ? 500 : 300,
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                    background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(124, 58, 237, 0.35)' : 'transparent'}`,
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .cmd-k-shortcut {
            display: flex !important;
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

export default Navbar;
