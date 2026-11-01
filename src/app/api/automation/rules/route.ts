import { NextRequest, NextResponse } from 'next/server';
import { UpdateRuleSchema } from '@/lib/validation/schemas';

// In-memory active rules state with defaults
let activeRule = {
  id: 'rule-204-active',
  rule_name: 'Campus Standard Energy Profile v1',
  version: 1,
  is_active: true,
  target_lux: 400.0,
  lux_hysteresis: 30.0,
  empty_dim_percent: 10,
  temp_fan_threshold: 26.5,
  temp_hysteresis: 0.5,
  humidity_fan_threshold: 70.0,
  empty_grace_period_seconds: 300,
  timetable_lookahead_seconds: 600,
  updated_at: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json({ rule: activeRule });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = UpdateRuleSchema.parse(body);

    activeRule = {
      ...activeRule,
      ...validated,
      version: activeRule.version + 1,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Automation rule updated and version incremented',
      rule: activeRule,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
