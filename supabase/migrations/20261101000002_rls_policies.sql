-- ==============================================================================
-- ECO CLASS (SUSTAINABLE CLASS) - ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Helper functions for JWT claims and role verification
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            (current_setting('request.jwt.claims', true)::jsonb ->> 'user_role')::user_role,
            (SELECT role FROM profiles WHERE id = auth.uid()),
            'user'::user_role
        )
    );
EXCEPTION WHEN OTHERS THEN
    RETURN 'user'::user_role;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_user_department()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT department_id FROM profiles WHERE id = auth.uid()
    );
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_current_user_role() = 'admin'::user_role;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_hod_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_current_user_role() IN ('admin'::user_role, 'hod'::user_role);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_current_user_role() IN ('admin'::user_role, 'hod'::user_role, 'worker'::user_role);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 1. DEPARTMENTS
-- ------------------------------------------------------------------------------
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read departments"
    ON departments FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "Admins can insert/update/delete departments"
    ON departments FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- ------------------------------------------------------------------------------
-- 2. BLOCKS & FLOORS
-- ------------------------------------------------------------------------------
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read blocks"
    ON blocks FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "Admins can manage blocks"
    ON blocks FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Anyone authenticated can read floors"
    ON floors FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage floors"
    ON floors FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- ------------------------------------------------------------------------------
-- 3. CLASSROOMS
-- ------------------------------------------------------------------------------
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view active classrooms"
    ON classrooms FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "Admins can manage all classrooms"
    ON classrooms FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "HODs can update classrooms in their department"
    ON classrooms FOR UPDATE
    TO authenticated
    USING (get_current_user_role() = 'hod' AND department_id = get_current_user_department())
    WITH CHECK (get_current_user_role() = 'hod' AND department_id = get_current_user_department());

-- ------------------------------------------------------------------------------
-- 4. PROFILES & WORKER ASSIGNMENTS & ALLOWLIST
-- ------------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_block_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_allowlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile, staff can read all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR is_staff());

CREATE POLICY "Users can update their personal profile info"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- Regular users cannot promote their own role!
        AND (role = (SELECT role FROM profiles WHERE id = auth.uid()) OR is_admin())
    );

CREATE POLICY "Admins can manage all profiles"
    ON profiles FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Staff can view worker assignments"
    ON worker_block_assignments FOR SELECT
    TO authenticated
    USING (is_staff());

CREATE POLICY "Admins can manage worker assignments"
    ON worker_block_assignments FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can manage email allowlist"
    ON email_allowlist FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- ------------------------------------------------------------------------------
-- 5. ROOM LAYOUT & ZONES
-- ------------------------------------------------------------------------------
ALTER TABLE room_layout ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view room layout"
    ON room_layout FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins and HODs can update room layout"
    ON room_layout FOR ALL
    TO authenticated
    USING (is_hod_or_admin())
    WITH CHECK (is_hod_or_admin());

CREATE POLICY "Anyone can view zones"
    ON zones FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins and HODs can manage zones"
    ON zones FOR ALL
    TO authenticated
    USING (is_hod_or_admin())
    WITH CHECK (is_hod_or_admin());

-- ------------------------------------------------------------------------------
-- 6. DEVICES & DEVICE STATE & COMMANDS
-- ------------------------------------------------------------------------------
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_commands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view devices"
    ON devices FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "Admins can manage devices"
    ON devices FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Anyone authenticated can view device state"
    ON device_state FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Staff can update device state (manual overrides)"
    ON device_state FOR UPDATE
    TO authenticated
    USING (
        is_admin() OR
        (get_current_user_role() = 'hod' AND EXISTS (
            SELECT 1 FROM devices d
            JOIN classrooms c ON d.classroom_id = c.id
            WHERE d.id = device_state.device_id AND c.department_id = get_current_user_department()
        )) OR
        (get_current_user_role() = 'worker' AND EXISTS (
            SELECT 1 FROM devices d
            JOIN classrooms c ON d.classroom_id = c.id
            JOIN worker_block_assignments wba ON wba.block_id = c.block_id
            WHERE d.id = device_state.device_id AND wba.worker_id = auth.uid()
        ))
    );

CREATE POLICY "Staff can insert device commands"
    ON device_commands FOR INSERT
    TO authenticated
    WITH CHECK (
        is_admin() OR
        (get_current_user_role() = 'hod' AND EXISTS (
            SELECT 1 FROM devices d
            JOIN classrooms c ON d.classroom_id = c.id
            WHERE d.id = device_commands.device_id AND c.department_id = get_current_user_department()
        )) OR
        (get_current_user_role() = 'worker' AND EXISTS (
            SELECT 1 FROM devices d
            JOIN classrooms c ON d.classroom_id = c.id
            JOIN worker_block_assignments wba ON wba.block_id = c.block_id
            WHERE d.id = device_commands.device_id AND wba.worker_id = auth.uid()
        ))
    );

CREATE POLICY "Staff can read device commands"
    ON device_commands FOR SELECT
    TO authenticated
    USING (is_staff());

-- ------------------------------------------------------------------------------
-- 7. SENSOR READINGS & OCCUPANCY & TIMETABLE
-- ------------------------------------------------------------------------------
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupancy_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE people_present ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view sensor telemetry"
    ON sensor_readings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "System and Admins can insert sensor telemetry"
    ON sensor_readings FOR INSERT
    TO authenticated
    WITH CHECK (is_admin() OR auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Anyone authenticated can view occupancy snapshots"
    ON occupancy_snapshots FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Staff and System can insert occupancy snapshots"
    ON occupancy_snapshots FOR INSERT
    TO authenticated
    WITH CHECK (is_staff() OR auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Anyone authenticated can view people present"
    ON people_present FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Staff can manage people present (manual entry fallback)"
    ON people_present FOR ALL
    TO authenticated
    USING (is_staff())
    WITH CHECK (is_staff());

CREATE POLICY "Anyone authenticated can view timetable"
    ON timetable FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins and HODs can manage timetable"
    ON timetable FOR ALL
    TO authenticated
    USING (is_hod_or_admin())
    WITH CHECK (is_hod_or_admin());

-- ------------------------------------------------------------------------------
-- 8. AUTOMATION RULES & EVENTS
-- ------------------------------------------------------------------------------
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read automation rules"
    ON automation_rules FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins and HODs can update automation rules"
    ON automation_rules FOR ALL
    TO authenticated
    USING (is_hod_or_admin())
    WITH CHECK (is_hod_or_admin());

CREATE POLICY "Anyone authenticated can view automation events"
    ON automation_events FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "System and staff can insert automation events"
    ON automation_events FOR INSERT
    TO authenticated
    WITH CHECK (is_staff() OR auth.jwt() ->> 'role' = 'service_role');

-- ------------------------------------------------------------------------------
-- 9. ENERGY USAGE & BASELINES
-- ------------------------------------------------------------------------------
ALTER TABLE energy_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view energy baselines"
    ON energy_baselines FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage energy baselines"
    ON energy_baselines FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Anyone authenticated can view energy usage"
    ON energy_usage FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "System can record energy usage"
    ON energy_usage FOR ALL
    TO authenticated
    USING (is_admin() OR auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (is_admin() OR auth.jwt() ->> 'role' = 'service_role');

-- ------------------------------------------------------------------------------
-- 10. EMERGENCY INCIDENTS & NOTIFICATIONS
-- ------------------------------------------------------------------------------
ALTER TABLE emergency_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_contacts ENABLE ROW LEVEL SECURITY;

-- Note: Students/view-only users cannot access sensitive emergency incidents!
CREATE POLICY "Staff can view emergency incidents"
    ON emergency_incidents FOR SELECT
    TO authenticated
    USING (is_staff());

CREATE POLICY "Staff can create emergency incidents"
    ON emergency_incidents FOR INSERT
    TO authenticated
    WITH CHECK (is_staff() OR auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Staff can update emergency incidents (ack, resolve)"
    ON emergency_incidents FOR UPDATE
    TO authenticated
    USING (is_staff())
    WITH CHECK (is_staff());

CREATE POLICY "Staff can view incident notifications"
    ON incident_notifications FOR SELECT
    TO authenticated
    USING (is_staff());

CREATE POLICY "Users can manage their own notification contacts"
    ON notification_contacts FOR ALL
    TO authenticated
    USING (auth.uid() = profile_id OR is_admin())
    WITH CHECK (auth.uid() = profile_id OR is_admin());

-- ------------------------------------------------------------------------------
-- 11. FACE PROFILES (Privacy & Consent)
-- ------------------------------------------------------------------------------
ALTER TABLE face_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and manage their own face profile"
    ON face_profiles FOR ALL
    TO authenticated
    USING (auth.uid() = profile_id OR is_admin())
    WITH CHECK (auth.uid() = profile_id OR is_admin());

-- ------------------------------------------------------------------------------
-- 12. AI CONVERSATIONS & MESSAGES
-- ------------------------------------------------------------------------------
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own AI conversations"
    ON ai_conversations FOR ALL
    TO authenticated
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can manage their own AI messages"
    ON ai_messages FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM ai_conversations c
        WHERE c.id = ai_messages.conversation_id AND c.profile_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM ai_conversations c
        WHERE c.id = ai_messages.conversation_id AND c.profile_id = auth.uid()
    ));

-- ------------------------------------------------------------------------------
-- 13. AUDIT LOGS & SIMULATOR SCENARIOS
-- ------------------------------------------------------------------------------
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulator_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view audit logs"
    ON audit_logs FOR SELECT
    TO authenticated
    USING (is_staff());

CREATE POLICY "Authenticated users and system can insert audit logs"
    ON audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Anyone authenticated can view simulator scenarios"
    ON simulator_scenarios FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Staff can manage simulator scenarios"
    ON simulator_scenarios FOR ALL
    TO authenticated
    USING (is_staff())
    WITH CHECK (is_staff());
