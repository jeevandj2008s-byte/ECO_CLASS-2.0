/**
 * ==============================================================================
 * Centralised Campus & Institutional Configuration
 * ==============================================================================
 * All campus names, addresses, tariffs, carbon emission factors, and contact info
 * are defined here. Update these values to adapt Eco Class for any institution.
 */

export interface CampusConfig {
  collegeName: string;
  collegeShortName: string;
  teamName: string;
  campusCampusName: string;
  address: string;
  pinCode: string;
  state: string;
  country: string;
  quote: string;

  // Electrical & Tariff Parameters
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  tariffINRPerKWh: number; // BESCOM HT tariff in ₹/kWh
  gridEmissionFactorKgPerKWh: number; // Central Electricity Authority (CEA) India grid factor: ~0.71 - 0.82 kg CO2e/kWh
  defaultTargetLux: number;
  safetyMinLuxPercent: number;

  // Campus Architecture Defaults
  defaultClassroomId: string;
  totalBlocksCount: number;
  totalClassroomsCount: number;

  // Contact & Social
  supportEmail: string;
  emergencyPhone: string;
}

export const CAMPUS_CONFIG: CampusConfig = {
  collegeName: 'Bangalore Institute of Technology',
  collegeShortName: 'BIT',
  teamName: 'Eco Class Systems Team',
  campusCampusName: 'V.V. Puram Main Green Campus',
  address: 'K.R. Road, V.V. Puram, Bengaluru, Karnataka - 560004, India',
  pinCode: '560004',
  state: 'Karnataka',
  country: 'India',
  quote: 'Smart telemetry helps track, isolate, and eliminate campus energy waste.',

  // Tariffs & Emissions (editable in Settings/Admin)
  currencySymbol: '₹',
  currencyCode: 'INR',
  locale: 'en-IN',
  tariffINRPerKWh: 8.25, // ₹8.25 per kWh (BESCOM HT commercial/educational tariff)
  gridEmissionFactorKgPerKWh: 0.71, // 0.71 kg CO₂e per kWh (India Grid Standard)
  defaultTargetLux: 400,
  safetyMinLuxPercent: 10,

  // Architecture defaults
  defaultClassroomId: 'c1000000-0000-0000-0000-000000000204',
  totalBlocksCount: 8,
  totalClassroomsCount: 42,

  // Support
  supportEmail: 'energy-cell@bit-bangalore.edu.in',
  emergencyPhone: '+91 80 2661 5865',
};

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat(CAMPUS_CONFIG.locale, {
    style: 'currency',
    currency: CAMPUS_CONFIG.currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumberIN(num: number): string {
  return new Intl.NumberFormat(CAMPUS_CONFIG.locale).format(num);
}
