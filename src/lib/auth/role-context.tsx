'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/types/database.types';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  isAuthenticated: boolean;
}

interface RoleContextValue {
  session: UserSession;
  setRole: (role: UserRole) => void;
  logout: () => void;
  loginAs: (role: UserRole, email?: string, name?: string) => void;
}

const DEFAULT_SESSION: UserSession = {
  id: 'usr-admin-demo',
  email: 'director@bit-bangalore.edu.in',
  name: 'Dr. C. R. Rajashekhar',
  role: 'admin',
  department: 'Administration',
  isAuthenticated: true,
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession>(DEFAULT_SESSION);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ecoclass_session');
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch {
      // localStorage may fail in SSR
    }
  }, []);

  const saveSession = (newSession: UserSession) => {
    setSession(newSession);
    try {
      localStorage.setItem('ecoclass_session', JSON.stringify(newSession));
    } catch {
      // ignore
    }
  };

  const setRole = (role: UserRole) => {
    const updated = {
      ...session,
      role,
      isAuthenticated: true,
    };
    saveSession(updated);
  };

  const loginAs = (role: UserRole, email?: string, name?: string) => {
    const defaultNames: Record<UserRole, { name: string; email: string; dept: string }> = {
      admin: { name: 'Dr. C. R. Rajashekhar (Director)', email: 'director@bit-bangalore.edu.in', dept: 'Campus Operations' },
      hod: { name: 'Prof. K. S. Sridhar (HOD CSE)', email: 'hod.cse@bit-bangalore.edu.in', dept: 'CSE Department' },
      worker: { name: 'Raju M. (Senior Electrician)', email: 'raju.facilities@bit-bangalore.edu.in', dept: 'Electrical Maintenance' },
      user: { name: 'Aditya Sharma (Student 6th Sem)', email: 'aditya.1bi21cs001@bit-bangalore.edu.in', dept: 'CSE Student' },
    };

    const def = defaultNames[role];
    const newSession: UserSession = {
      id: `usr-${role}-${Date.now().toString(36)}`,
      email: email || def.email,
      name: name || def.name,
      role,
      department: def.dept,
      isAuthenticated: true,
    };
    saveSession(newSession);
  };

  const logout = () => {
    const guestSession: UserSession = {
      id: 'guest',
      email: '',
      name: 'Guest Visitor',
      role: 'user',
      isAuthenticated: false,
    };
    saveSession(guestSession);
  };

  return (
    <RoleContext.Provider value={{ session, setRole, logout, loginAs }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return ctx;
}
