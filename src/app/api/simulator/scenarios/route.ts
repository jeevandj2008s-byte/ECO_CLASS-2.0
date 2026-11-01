import { NextResponse } from 'next/server';
import { PRESET_SCENARIOS } from '@/lib/simulator/scenarios';

export async function GET() {
  return NextResponse.json({
    scenarios: Object.values(PRESET_SCENARIOS),
  });
}
