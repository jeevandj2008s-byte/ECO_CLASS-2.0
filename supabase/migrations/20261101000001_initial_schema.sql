-- ==============================================================================
-- ECO CLASS (SUSTAINABLE CLASS) - INITIAL SCHEMA MIGRATION
-- ==============================================================================

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- pgvector for face embeddings

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'hod', 'worker', 'user');
CREATE TYPE device_type AS ENUM ('light', 'fan', 'sensor', 'camera', 'power_meter');
CREATE TYPE control_mode AS ENUM ('auto', 'manual', 'forced_off');
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_status AS ENUM ('open', 'acknowledged', 'investigating', 'resolved', 'false_positive');
CREATE TYPE notification_channel AS ENUM ('email', 'push', 'sms');

-- 2. CAMPUS HIERARCHY
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    campus_name VARCHAR(100) NOT NULL DEFAULT 'Main Campus',
    floors_count INT NOT NULL DEFAULT 4,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    floor_number INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(block_id, floor_number)
);

CREATE TABLE classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    floor_id UUID NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    room_number VARCHAR(30) NOT NULL,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 40,
    area_sqm NUMERIC(6, 2) NOT NULL DEFAULT 65.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(block_id, room_number)
);

-- 3. PROFILES & ROLES (Linked to Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150),
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'user',
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    phone_number VARCHAR(25),
    is_invited BOOLEAN NOT NULL DEFAULT FALSE,
    invited_role user_role,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Worker block assignments (which blocks a worker manages)
CREATE TABLE worker_block_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(worker_id, block_id)
);

-- Admin email allow-list for pre-approved roles
CREATE TABLE email_allowlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    designated_role user_role NOT NULL DEFAULT 'user',
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROOM LAYOUT & BENCH ZONES
-- Bench rows, columns, and seats for 3D digital twin and precision zone control
CREATE TABLE room_layout (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    rows_count INT NOT NULL DEFAULT 6,
    benches_per_row INT NOT NULL DEFAULT 2,
    seats_per_bench INT NOT NULL DEFAULT 3,
    teacher_desk_position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "z": 1.5}',
    camera_positions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(classroom_id)
);

-- Lighting zones: Each bench row corresponds to a lighting zone
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    row_index INT NOT NULL, -- Row index 1..N (e.g., Row 1 is front, Row 6 is back)
    name VARCHAR(50) NOT NULL, -- e.g. "Row 1 (Front)", "Row 5 (Back)"
    target_lux NUMERIC(6, 2) NOT NULL DEFAULT 400.0,
    min_safety_lux_percent INT NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(classroom_id, row_index)
);

-- 5. DEVICES & HARDWARE STATE
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL, -- Null if room-wide (e.g. general fan or meter)
    device_name VARCHAR(100) NOT NULL,
    device_type device_type NOT NULL,
    mqtt_topic_sub VARCHAR(255) NOT NULL,
    mqtt_topic_pub VARCHAR(255) NOT NULL,
    mac_address VARCHAR(30) UNIQUE,
    rated_watts NUMERIC(8, 2) NOT NULL DEFAULT 40.0,
    firmware_version VARCHAR(30) DEFAULT '1.0.0',
    is_online BOOLEAN NOT NULL DEFAULT TRUE,
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE device_state (
    device_id UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
    power_on BOOLEAN NOT NULL DEFAULT FALSE,
    brightness_percent INT DEFAULT 0 CHECK (brightness_percent BETWEEN 0 AND 100),
    fan_speed INT DEFAULT 0 CHECK (fan_speed BETWEEN 0 AND 5),
    mode control_mode NOT NULL DEFAULT 'auto',
    override_until TIMESTAMPTZ,
    override_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    live_watts NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Idempotent Device Commands Queue
CREATE TABLE device_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    idempotency_key VARCHAR(100) NOT NULL UNIQUE,
    command_payload JSONB NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'acknowledged', 'failed', 'timeout')),
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 3,
    acknowledged_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TIME-SERIES SENSOR TELEMETRY & OCCUPANCY
CREATE TABLE sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    lux NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    temperature_c NUMERIC(5, 2) NOT NULL DEFAULT 25.0,
    humidity_percent NUMERIC(5, 2) NOT NULL DEFAULT 50.0,
    power_watts NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    current_amps NUMERIC(6, 2) NOT NULL DEFAULT 0.0,
    voltage_volts NUMERIC(6, 2) NOT NULL DEFAULT 230.0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for rapid time-series querying
CREATE INDEX idx_sensor_readings_room_time ON sensor_readings(classroom_id, recorded_at DESC);
CREATE INDEX idx_sensor_readings_zone_time ON sensor_readings(zone_id, recorded_at DESC);

-- Occupancy snapshots per room and row
CREATE TABLE occupancy_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    total_people INT NOT NULL DEFAULT 0,
    student_count INT NOT NULL DEFAULT 0,
    teacher_count INT NOT NULL DEFAULT 0,
    row_occupancy JSONB NOT NULL DEFAULT '{}', -- e.g. {"1": 0, "2": 0, "3": 0, "4": 0, "5": 1}
    seat_occupancy JSONB NOT NULL DEFAULT '[]', -- array of {seat_id, row, col, occupied, profile_id}
    confidence_score NUMERIC(4, 3) DEFAULT 0.950,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_occupancy_room_time ON occupancy_snapshots(classroom_id, detected_at DESC);

-- People currently present (Attendance & Live digital twin)
CREATE TABLE people_present (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Null if anonymous
    role user_role NOT NULL DEFAULT 'user',
    row_index INT NOT NULL,
    seat_label VARCHAR(30),
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TIMETABLE (Schedule-aware automation)
CREATE TABLE timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    course_code VARCHAR(30) NOT NULL,
    course_name VARCHAR(150) NOT NULL,
    teacher_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday...
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_cancelled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AUTOMATION RULES & EVENTS (Deterministic & Explainable)
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE, -- Null means global default
    block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
    rule_name VARCHAR(100) NOT NULL,
    version INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    target_lux NUMERIC(6, 2) NOT NULL DEFAULT 400.0,
    lux_hysteresis NUMERIC(6, 2) NOT NULL DEFAULT 30.0,
    empty_dim_percent INT NOT NULL DEFAULT 10,
    temp_fan_threshold NUMERIC(4, 2) NOT NULL DEFAULT 26.5,
    temp_hysteresis NUMERIC(4, 2) NOT NULL DEFAULT 0.5,
    humidity_fan_threshold NUMERIC(4, 2) NOT NULL DEFAULT 70.0,
    empty_grace_period_seconds INT NOT NULL DEFAULT 300, -- 5 min
    timetable_lookahead_seconds INT NOT NULL DEFAULT 600, -- 10 min
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE automation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    rule_id UUID REFERENCES automation_rules(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- e.g. "DIM_EMPTY_ROW", "BOOST_OCCUPIED_ROW", "TEMP_FAN_ON", "SHUTDOWN_EMPTY_ROOM"
    trigger_inputs JSONB NOT NULL,   -- e.g. {lux: 250, ambient: 180, row_occupants: 1, temp: 28.2}
    actions_taken JSONB NOT NULL,    -- e.g. {brightness_set: 85, fan_speed_set: 3}
    explanation TEXT NOT NULL,       -- Human-readable reason for AI and logs
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_automation_events_room_time ON automation_events(classroom_id, created_at DESC);

-- 9. ENERGY USAGE & BASELINES
CREATE TABLE energy_baselines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    baseline_watts_empty NUMERIC(8, 2) NOT NULL DEFAULT 1200.0, -- Standard lights + fans full on
    baseline_watts_occupied NUMERIC(8, 2) NOT NULL DEFAULT 1800.0,
    cost_per_kwh NUMERIC(6, 4) NOT NULL DEFAULT 0.1500,
    co2_kg_per_kwh NUMERIC(6, 4) NOT NULL DEFAULT 0.8200,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE energy_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    interval_start TIMESTAMPTZ NOT NULL,
    interval_end TIMESTAMPTZ NOT NULL,
    actual_kwh NUMERIC(10, 4) NOT NULL DEFAULT 0.0,
    baseline_kwh NUMERIC(10, 4) NOT NULL DEFAULT 0.0,
    saved_kwh NUMERIC(10, 4) GENERATED ALWAYS AS (GREATEST(0, baseline_kwh - actual_kwh)) STORED,
    cost_saved NUMERIC(10, 4) NOT NULL DEFAULT 0.0,
    co2_saved_kg NUMERIC(10, 4) NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_energy_usage_room_interval ON energy_usage(classroom_id, interval_start DESC);

-- 10. EMERGENCY HELP DESK & INCIDENTS
CREATE TABLE emergency_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    incident_type VARCHAR(50) NOT NULL, -- "short_circuit", "overcurrent", "smoke_alarm", "high_temp", "manual"
    severity incident_severity NOT NULL DEFAULT 'high',
    status incident_status NOT NULL DEFAULT 'open',
    power_cut_applied BOOLEAN NOT NULL DEFAULT FALSE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    telemetry_snapshot JSONB,
    raised_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    acknowledged_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_incidents_status_time ON emergency_incidents(status, created_at DESC);

CREATE TABLE incident_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES emergency_incidents(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    channel notification_channel NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notification_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    notify_email BOOLEAN NOT NULL DEFAULT TRUE,
    notify_push BOOLEAN NOT NULL DEFAULT TRUE,
    notify_sms BOOLEAN NOT NULL DEFAULT FALSE,
    phone_number VARCHAR(25),
    push_subscription JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(profile_id)
);

-- 11. VISION LAB & FACE PROFILES (Privacy-First)
CREATE TABLE face_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    has_consented BOOLEAN NOT NULL DEFAULT FALSE,
    consent_recorded_at TIMESTAMPTZ,
    consent_ip VARCHAR(50),
    embedding vector(512), -- 512-dimensional face embedding
    model_version VARCHAR(50) DEFAULT 'facenet512-v1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(profile_id)
);

-- 12. AI ASSISTANT CONVERSATIONS & TOOL CALLS
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
    content TEXT,
    tool_calls JSONB,
    tool_call_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AUDIT LOGS & SIMULATOR SCENARIOS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    actor_role user_role,
    action VARCHAR(100) NOT NULL, -- e.g. "ROLE_CHANGE", "LOGIN", "MANUAL_DEVICE_OVERRIDE", "EMERGENCY_ACK"
    target_resource VARCHAR(100) NOT NULL,
    target_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}',
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor_time ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_logs_action_time ON audit_logs(action, created_at DESC);

CREATE TABLE simulator_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    config JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
