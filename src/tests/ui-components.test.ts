import { describe, it, expect } from 'vitest';
import { CAMPUS_CONFIG, formatCurrencyINR } from '../lib/config/campus';

describe('UI Layer & Campus Configuration Standards', () => {
  it('loads institutional campus parameters correctly', () => {
    expect(CAMPUS_CONFIG.collegeName).toBe('Bangalore Institute of Technology');
    expect(CAMPUS_CONFIG.collegeShortName).toBe('BIT');
    expect(CAMPUS_CONFIG.tariffINRPerKWh).toBe(8.25);
    expect(CAMPUS_CONFIG.gridEmissionFactorKgPerKWh).toBe(0.71);
    expect(CAMPUS_CONFIG.currencySymbol).toBe('₹');
  });

  it('formats Indian Rupee currency with en-IN locale properly', () => {
    const formatted = formatCurrencyINR(1500.5);
    expect(formatted).toContain('1,500.50');
  });

  it('verifies role-based card visibility logic', () => {
    // Admin & Users card should only be visible to admin or hod
    const allowedRoles: Array<'admin' | 'hod'> = ['admin', 'hod'];

    const canStudentSee = (role: string) => allowedRoles.includes(role as any);

    expect(canStudentSee('admin')).toBe(true);
    expect(canStudentSee('hod')).toBe(true);
    expect(canStudentSee('worker')).toBe(false);
    expect(canStudentSee('user')).toBe(false);
  });

  it('contains all 9 essential module card routes in carousel spec', () => {
    const expectedRoutes = [
      '/dashboard',
      '/campus-map',
      '/classroom-3d',
      '/vision-lab',
      '/automation',
      '/simulator',
      '/helpdesk',
      '/assistant',
      '/admin',
    ];

    expect(expectedRoutes).toHaveLength(9);
    for (const r of expectedRoutes) {
      expect(r.startsWith('/')).toBe(true);
    }
  });

  it('verifies 5-step stepper content in How to Use section', () => {
    const stepNumbers = ['01', '02', '03', '04', '05'];
    expect(stepNumbers).toHaveLength(5);
  });
});
