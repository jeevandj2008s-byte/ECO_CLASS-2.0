-- ==============================================================================
-- ECO CLASS (SUSTAINABLE CLASS) - SEED DATA
-- ==============================================================================

-- 1. DEPARTMENTS
INSERT INTO departments (id, code, name, description) VALUES
('d1000000-0000-0000-0000-000000000001', 'CSE', 'Computer Science and Engineering', 'Department of Computer Science & Engineering'),
('d1000000-0000-0000-0000-000000000002', 'ECE', 'Electronics and Communication', 'Department of Electronics & Communication Engineering')
ON CONFLICT (id) DO NOTHING;

-- 2. BLOCKS
INSERT INTO blocks (id, name, code, campus_name, floors_count) VALUES
('b1000000-0000-0000-0000-000000000001', 'Turing Academic Block', 'BLOCK-A', 'Main Green Campus', 4),
('b1000000-0000-0000-0000-000000000002', 'Tesla Technology Block', 'BLOCK-B', 'Main Green Campus', 4)
ON CONFLICT (id) DO NOTHING;

-- 3. FLOORS
INSERT INTO floors (id, block_id, floor_number, name) VALUES
('f1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 1, 'First Floor'),
('f1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 2, 'Second Floor'),
('f1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 2, 'Second Floor')
ON CONFLICT (id) DO NOTHING;

-- 4. CLASSROOMS
INSERT INTO classrooms (id, block_id, floor_id, department_id, room_number, name, capacity, area_sqm) VALUES
('c1000000-0000-0000-0000-000000000204', 'b1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'CR-204', 'IoT & Embedded Systems Lab', 30, 72.00),
('c1000000-0000-0000-0000-000000000205', 'b1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'CR-205', 'Advanced Algorithms Hall', 40, 85.00),
('c1000000-0000-0000-0000-000000000301', 'b1000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002', 'CR-301', 'VLSI Design Studio', 35, 80.00)
ON CONFLICT (id) DO NOTHING;

-- 5. ROOM LAYOUT (Rows, Benches, Seats for CR-204)
INSERT INTO room_layout (classroom_id, rows_count, benches_per_row, seats_per_bench, teacher_desk_position, camera_positions)
VALUES (
    'c1000000-0000-0000-0000-000000000204',
    5, -- 5 rows
    2, -- 2 benches per row (Left & Right aisle)
    3, -- 3 seats per bench = 6 seats per row * 5 rows = 30 seats total
    '{"x": 0.0, "y": 0.0, "z": 1.2}',
    '[{"id": "cam-front", "x": 0.0, "y": 6.5, "z": 2.8, "fov": 90}]'
) ON CONFLICT (classroom_id) DO NOTHING;

-- 6. BENCH ROW LIGHTING ZONES FOR CR-204 (5 Rows -> 5 Zones)
INSERT INTO zones (id, classroom_id, row_index, name, target_lux, min_safety_lux_percent) VALUES
('z1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000204', 1, 'Row 1 (Front Row)', 400.0, 10),
('z1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000204', 2, 'Row 2', 400.0, 10),
('z1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000204', 3, 'Row 3 (Middle Row)', 400.0, 10),
('z1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000204', 4, 'Row 4', 400.0, 10),
('z1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000204', 5, 'Row 5 (Last Bench)', 400.0, 10)
ON CONFLICT (id) DO NOTHING;

-- 7. DEVICES FOR CR-204 (Lights per zone, Ceiling Fans, Environmental Sensor, Power Meter)
INSERT INTO devices (id, classroom_id, zone_id, device_name, device_type, mqtt_topic_sub, mqtt_topic_pub, mac_address, rated_watts) VALUES
-- Dimmable LED Zone Lights
('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000204', 'z1000000-0000-0000-0000-000000000001', 'LED Array Row 1', 'light', 'ecoclass/cmd/c204/light_r1', 'ecoclass/telemetry/c204/light_r1', 'AA:BB:CC:11:01', 60.0),
('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000204', 'z1000000-0000-0000-0000-000000000002', 'LED Array Row 2', 'light', 'ecoclass/cmd/c204/light_r2', 'ecoclass/telemetry/c204/light_r2', 'AA:BB:CC:11:02', 60.0),
('e1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000204', 'z1000000-0000-0000-0000-000000000003', 'LED Array Row 3', 'light', 'ecoclass/cmd/c204/light_r3', 'ecoclass/telemetry/c204/light_r3', 'AA:BB:CC:11:03', 60.0),
('e1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000204', 'z1000000-0000-0000-0000-000000000004', 'LED Array Row 4', 'light', 'ecoclass/cmd/c204/light_r4', 'ecoclass/telemetry/c204/light_r4', 'AA:BB:CC:11:04', 60.0),
('e1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000204', 'z1000000-0000-0000-0000-000000000005', 'LED Array Row 5', 'light', 'ecoclass/cmd/c204/light_r5', 'ecoclass/telemetry/c204/light_r5', 'AA:BB:CC:11:05', 60.0),
-- Smart Ceiling Fans
('e1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000204', NULL, 'Ceiling Fan Front', 'fan', 'ecoclass/cmd/c204/fan_f', 'ecoclass/telemetry/c204/fan_f', 'AA:BB:CC:11:06', 75.0),
('e1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000204', NULL, 'Ceiling Fan Rear', 'fan', 'ecoclass/cmd/c204/fan_r', 'ecoclass/telemetry/c204/fan_r', 'AA:BB:CC:11:07', 75.0),
-- Multi-Sensor Hub (Lux, Temp, Humidity)
('e1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000204', NULL, 'Env MultiSensor Hub', 'sensor', 'ecoclass/cmd/c204/sensor', 'ecoclass/telemetry/c204/sensor', 'AA:BB:CC:11:08', 3.0),
-- Digital Smart Power Meter
('e1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000204', NULL, 'Sub-Panel Smart Meter', 'power_meter', 'ecoclass/cmd/c204/meter', 'ecoclass/telemetry/c204/meter', 'AA:BB:CC:11:09', 5.0)
ON CONFLICT (id) DO NOTHING;

-- 8. INITIAL DEVICE STATES
INSERT INTO device_state (device_id, power_on, brightness_percent, fan_speed, mode, live_watts) VALUES
('e1000000-0000-0000-0000-000000000001', false, 0, 0, 'auto', 0.0),
('e1000000-0000-0000-0000-000000000002', false, 0, 0, 'auto', 0.0),
('e1000000-0000-0000-0000-000000000003', false, 0, 0, 'auto', 0.0),
('e1000000-0000-0000-0000-000000000004', false, 0, 0, 'auto', 0.0),
('e1000000-0000-0000-0000-000000000005', false, 0, 0, 'auto', 0.0),
('e1000000-0000-0000-0000-000000000006', false, 0, 0, 'auto', 0.0),
('e1000000-0000-0000-0000-000000000007', false, 0, 0, 'auto', 0.0),
('e1000000-0000-0000-0000-000000000008', true, 0, 0, 'auto', 2.8),
('e1000000-0000-0000-0000-000000000009', true, 0, 0, 'auto', 4.5)
ON CONFLICT (device_id) DO NOTHING;

-- 9. AUTOMATION RULES FOR CR-204
INSERT INTO automation_rules (
    classroom_id,
    rule_name,
    version,
    is_active,
    target_lux,
    lux_hysteresis,
    empty_dim_percent,
    temp_fan_threshold,
    temp_hysteresis,
    humidity_fan_threshold,
    empty_grace_period_seconds,
    timetable_lookahead_seconds
) VALUES (
    'c1000000-0000-0000-0000-000000000204',
    'Standard Energy Saving Profile v1',
    1,
    true,
    400.0,
    30.0,
    10,
    26.5,
    0.5,
    70.0,
    300,
    600
);

-- 10. ENERGY BASELINES FOR CR-204
INSERT INTO energy_baselines (
    classroom_id,
    baseline_watts_empty,
    baseline_watts_occupied,
    cost_per_kwh,
    co2_kg_per_kwh
) VALUES (
    'c1000000-0000-0000-0000-000000000204',
    450.0, -- lights & fans left running when empty in legacy rooms
    650.0, -- full brightness without daylight harvesting
    0.1500,
    0.8200
) ON CONFLICT DO NOTHING;

-- 11. TIMETABLE SCHEDULE
INSERT INTO timetable (classroom_id, department_id, course_code, course_name, day_of_week, start_time, end_time) VALUES
('c1000000-0000-0000-0000-000000000204', 'd1000000-0000-0000-0000-000000000001', 'CS401', 'IoT and Green Computing', 1, '09:00:00', '10:30:00'),
('c1000000-0000-0000-0000-000000000204', 'd1000000-0000-0000-0000-000000000001', 'CS402', 'Distributed Cloud Systems', 1, '11:00:00', '12:30:00'),
('c1000000-0000-0000-0000-000000000204', 'd1000000-0000-0000-0000-000000000001', 'CS405', 'Embedded Firmware Lab', 1, '14:00:00', '16:00:00')
ON CONFLICT DO NOTHING;

-- 12. SIMULATOR SCENARIOS
INSERT INTO simulator_scenarios (code, name, description, config) VALUES
('lone_student_back', 'One Student on Last Bench', 'Tests targeted bench-row lighting. 1 student in Row 5; Rows 1-4 must dim to 10% safety level.', '{"occupancy": {"total": 1, "students": 1, "teachers": 0, "rows": {"1":0,"2":0,"3":0,"4":0,"5":1}}, "environment": {"lux": 150, "temp": 24.5, "humidity": 45}}'),
('sunny_day_full_class', 'Sunny Afternoon Full Class', 'Daylight harvesting test. 30 students, 750 lux outdoor sunlight. Artificial lighting dims to conserve power.', '{"occupancy": {"total": 30, "students": 29, "teachers": 1, "rows": {"1":6,"2":6,"3":6,"4":6,"5":6}}, "environment": {"lux": 750, "temp": 28.5, "humidity": 65}}'),
('empty_room_grace', 'Class Ends (Grace Period)', 'Classroom becomes empty. Fans and lights continue for 5 min grace, then shut off completely.', '{"occupancy": {"total": 0, "students": 0, "teachers": 0, "rows": {"1":0,"2":0,"3":0,"4":0,"5":0}}, "environment": {"lux": 100, "temp": 25.0, "humidity": 50}}'),
('power_surge_hazard', 'Electrical Power Surge', 'Current spikes to 32 Amps on lighting circuit. Breaker triggers emergency overcurrent incident.', '{"incident": {"type": "overcurrent", "amps": 32.5, "volts": 245.0, "watts": 7962.5}}'),
('short_circuit_incident', 'Short Circuit & Arc Fault', 'Instantaneous 95A spike with voltage collapse. Automated emergency power cut tripped.', '{"incident": {"type": "short_circuit", "amps": 95.0, "volts": 12.0, "watts": 1140.0}}')
ON CONFLICT (code) DO NOTHING;
