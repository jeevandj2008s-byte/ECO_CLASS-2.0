export type UserRole = 'admin' | 'hod' | 'worker' | 'user';
export type DeviceType = 'light' | 'fan' | 'sensor' | 'camera' | 'power_meter';
export type ControlMode = 'auto' | 'manual' | 'forced_off';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
export type NotificationChannel = 'email' | 'push' | 'sms';

export interface Profile {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  department_id?: string | null;
  phone_number?: string | null;
  is_invited: boolean;
  invited_role?: UserRole | null;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  created_at: string;
}

export interface Block {
  id: string;
  name: string;
  code: string;
  campus_name: string;
  floors_count: number;
  created_at: string;
}

export interface Floor {
  id: string;
  block_id: string;
  floor_number: number;
  name: string;
}

export interface Classroom {
  id: string;
  block_id: string;
  floor_id: string;
  department_id?: string | null;
  room_number: string;
  name: string;
  capacity: number;
  area_sqm: number;
  is_active: boolean;
  created_at: string;
}

export interface RoomLayout {
  id: string;
  classroom_id: string;
  rows_count: number;
  benches_per_row: number;
  seats_per_bench: number;
  teacher_desk_position: { x: number; y: number; z: number };
  camera_positions: Array<{ id: string; x: number; y: number; z: number; fov: number }>;
}

export interface Zone {
  id: string;
  classroom_id: string;
  row_index: number;
  name: string;
  target_lux: number;
  min_safety_lux_percent: number;
}

export interface Device {
  id: string;
  classroom_id: string;
  zone_id?: string | null;
  device_name: string;
  device_type: DeviceType;
  mqtt_topic_sub: string;
  mqtt_topic_pub: string;
  mac_address?: string | null;
  rated_watts: number;
  firmware_version?: string;
  is_online: boolean;
  last_heartbeat: string;
}

export interface DeviceState {
  device_id: string;
  power_on: boolean;
  brightness_percent: number;
  fan_speed: number;
  mode: ControlMode;
  override_until?: string | null;
  override_by?: string | null;
  live_watts: number;
  updated_at: string;
}

export interface SensorReading {
  id: string;
  classroom_id: string;
  zone_id?: string | null;
  lux: number;
  temperature_c: number;
  humidity_percent: number;
  power_watts: number;
  current_amps: number;
  voltage_volts: number;
  recorded_at: string;
}

export interface OccupancySnapshot {
  id: string;
  classroom_id: string;
  total_people: number;
  student_count: number;
  teacher_count: number;
  row_occupancy: Record<string, number>;
  seat_occupancy: Array<{
    seat_id: string;
    row: number;
    col: number;
    occupied: boolean;
    profile_id?: string | null;
    is_teacher?: boolean;
  }>;
  confidence_score: number;
  detected_at: string;
}

export interface AutomationRule {
  id: string;
  classroom_id?: string | null;
  block_id?: string | null;
  rule_name: string;
  version: number;
  is_active: boolean;
  target_lux: number;
  lux_hysteresis: number;
  empty_dim_percent: number;
  temp_fan_threshold: number;
  temp_hysteresis: number;
  humidity_fan_threshold: number;
  empty_grace_period_seconds: number;
  timetable_lookahead_seconds: number;
}

export interface AutomationEvent {
  id: string;
  classroom_id: string;
  zone_id?: string | null;
  device_id?: string | null;
  rule_id?: string | null;
  event_type: string;
  trigger_inputs: Record<string, unknown>;
  actions_taken: Record<string, unknown>;
  explanation: string;
  created_at: string;
}

export interface EmergencyIncident {
  id: string;
  classroom_id: string;
  zone_id?: string | null;
  device_id?: string | null;
  incident_type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  power_cut_applied: boolean;
  title: string;
  description: string;
  telemetry_snapshot?: Record<string, unknown> | null;
  raised_by?: string | null;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  resolution_notes?: string | null;
  created_at: string;
}

export interface EnergyUsage {
  id: string;
  classroom_id: string;
  zone_id?: string | null;
  device_id?: string | null;
  interval_start: string;
  interval_end: string;
  actual_kwh: number;
  baseline_kwh: number;
  saved_kwh: number;
  cost_saved: number;
  co2_saved_kg: number;
}
