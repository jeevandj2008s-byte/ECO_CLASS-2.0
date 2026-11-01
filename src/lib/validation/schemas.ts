import { z } from 'zod';

export const UserRoleSchema = z.enum(['admin', 'hod', 'worker', 'user']);
export const DeviceTypeSchema = z.enum(['light', 'fan', 'sensor', 'camera', 'power_meter']);
export const ControlModeSchema = z.enum(['auto', 'manual', 'forced_off']);
export const IncidentSeveritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export const IncidentStatusSchema = z.enum(['open', 'acknowledged', 'investigating', 'resolved', 'false_positive']);

// Device Telemetry Ingest Schema
export const TelemetryIngestSchema = z.object({
  classroom_id: z.string().uuid(),
  zone_id: z.string().uuid().optional(),
  device_id: z.string().uuid().optional(),
  lux: z.number().min(0).max(100000).default(0),
  temperature_c: z.number().min(-20).max(80).default(25.0),
  humidity_percent: z.number().min(0).max(100).default(50.0),
  power_watts: z.number().min(0).default(0),
  current_amps: z.number().min(0).default(0),
  voltage_volts: z.number().min(0).max(500).default(230),
  recorded_at: z.string().datetime().optional(),
});

// Device Command & Manual Override Schema
export const DeviceCommandSchema = z.object({
  device_id: z.string().uuid(),
  power_on: z.boolean().optional(),
  brightness_percent: z.number().min(0).max(100).optional(),
  fan_speed: z.number().min(0).max(5).optional(),
  mode: ControlModeSchema.default('manual'),
  override_duration_seconds: z.number().min(60).max(86400).optional(), // Max 24 hours
  idempotency_key: z.string().min(8).max(128).optional(),
});

// Manual Occupancy Ingest (Fallback for 3D UI / manual override)
export const ManualOccupancySchema = z.object({
  classroom_id: z.string().uuid(),
  row_occupancy: z.record(z.string(), z.number().min(0)),
  total_students: z.number().min(0),
  total_teachers: z.number().min(0).default(0),
  confidence: z.number().min(0).max(1).default(1.0),
  seats: z.array(z.object({
    seat_id: z.string(),
    row: z.number().min(1),
    col: z.number().min(1),
    occupied: z.boolean(),
    is_teacher: z.boolean().default(false),
  })).optional(),
});

// Emergency Incident Creation Schema
export const CreateIncidentSchema = z.object({
  classroom_id: z.string().uuid(),
  zone_id: z.string().uuid().optional(),
  device_id: z.string().uuid().optional(),
  incident_type: z.string().min(3).max(50),
  severity: IncidentSeveritySchema.default('high'),
  title: z.string().min(5).max(150),
  description: z.string().min(10),
  telemetry_snapshot: z.record(z.string(), z.unknown()).optional(),
  trip_power_immediately: z.boolean().default(true),
});

// Automation Rule Update Schema
export const UpdateRuleSchema = z.object({
  rule_name: z.string().min(3).max(100).optional(),
  target_lux: z.number().min(50).max(2000).optional(),
  lux_hysteresis: z.number().min(5).max(100).optional(),
  empty_dim_percent: z.number().min(0).max(50).optional(),
  temp_fan_threshold: z.number().min(15).max(40).optional(),
  temp_hysteresis: z.number().min(0.1).max(5.0).optional(),
  humidity_fan_threshold: z.number().min(20).max(95).optional(),
  empty_grace_period_seconds: z.number().min(10).max(3600).optional(),
  timetable_lookahead_seconds: z.number().min(60).max(3600).optional(),
  is_active: z.boolean().optional(),
});

// AI Chat Request Schema
export const AIChatRequestSchema = z.object({
  conversation_id: z.string().uuid().optional(),
  message: z.string().min(1).max(2000),
  stream: z.boolean().default(false),
});

// Simulator Injection Schema
export const SimulatorInjectSchema = z.object({
  classroom_id: z.string().uuid(),
  scenario_code: z.string().optional(),
  occupancy: z.object({
    total: z.number().min(0),
    students: z.number().min(0),
    teachers: z.number().min(0),
    rows: z.record(z.string(), z.number().min(0)),
  }).optional(),
  environment: z.object({
    lux: z.number().min(0).max(50000),
    temp: z.number().min(10).max(50),
    humidity: z.number().min(0).max(100),
  }).optional(),
  incident: z.object({
    type: z.string(),
    amps: z.number().min(0),
    volts: z.number().min(0),
    watts: z.number().min(0),
  }).optional(),
});
