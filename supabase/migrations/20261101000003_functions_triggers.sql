-- ==============================================================================
-- ECO CLASS (SUSTAINABLE CLASS) - FUNCTIONS, TRIGGERS & REALTIME PUBLICATION
-- ==============================================================================

-- 1. AUTOMATIC PROFILE CREATION TRIGGER (WITH EMAIL ALLOWLIST CHECK)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    matched_role user_role := 'user'::user_role;
    matched_dept UUID := NULL;
    is_pre_invited BOOLEAN := FALSE;
BEGIN
    -- Check if this email exists on the admin allow-list
    SELECT designated_role, department_id, TRUE
    INTO matched_role, matched_dept, is_pre_invited
    FROM public.email_allowlist
    WHERE LOWER(email) = LOWER(NEW.email);

    -- Insert into public.profiles
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        avatar_url,
        role,
        department_id,
        is_invited,
        invited_role
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(matched_role, 'user'::user_role),
        matched_dept,
        COALESCE(is_pre_invited, FALSE),
        matched_role
    );

    -- Initialize notification contact entry
    INSERT INTO public.notification_contacts (profile_id)
    VALUES (NEW.id)
    ON CONFLICT (profile_id) DO NOTHING;

    -- Audit log the initial user registration
    INSERT INTO public.audit_logs (
        actor_id,
        actor_email,
        actor_role,
        action,
        target_resource,
        target_id,
        metadata
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(matched_role, 'user'::user_role),
        'USER_REGISTERED',
        'profiles',
        NEW.id,
        jsonb_build_object(
            'provider', NEW.raw_app_meta_data->>'provider',
            'matched_allowlist', is_pre_invited,
            'assigned_role', COALESCE(matched_role, 'user'::user_role)
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger attached to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. AUDIT LOG ON ROLE CHANGES
CREATE OR REPLACE FUNCTION public.handle_profile_role_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.role IS DISTINCT FROM NEW.role THEN
        INSERT INTO public.audit_logs (
            actor_id,
            actor_email,
            actor_role,
            action,
            target_resource,
            target_id,
            metadata
        ) VALUES (
            auth.uid(),
            (SELECT email FROM profiles WHERE id = auth.uid()),
            (SELECT role FROM profiles WHERE id = auth.uid()),
            'ROLE_CHANGE',
            'profiles',
            NEW.id,
            jsonb_build_object(
                'target_email', NEW.email,
                'old_role', OLD.role,
                'new_role', NEW.role
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_role_changed ON public.profiles;
CREATE TRIGGER on_profile_role_changed
    AFTER UPDATE OF role ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_profile_role_update();

-- 3. EMERGENCY POWER TRIP FUNCTION (Callable by staff or automation engine)
CREATE OR REPLACE FUNCTION public.trip_zone_power(
    p_classroom_id UUID,
    p_zone_id UUID,
    p_incident_id UUID
)
RETURNS VOID AS $$
BEGIN
    -- Cut power to devices in the specific zone
    UPDATE public.device_state
    SET
        power_on = FALSE,
        brightness_percent = 0,
        fan_speed = 0,
        mode = 'forced_off',
        override_until = NOW() + INTERVAL '2 hours',
        updated_at = NOW()
    WHERE device_id IN (
        SELECT id FROM public.devices
        WHERE classroom_id = p_classroom_id
          AND (zone_id = p_zone_id OR p_zone_id IS NULL)
    );

    -- Mark incident as power cut applied
    UPDATE public.emergency_incidents
    SET power_cut_applied = TRUE, updated_at = NOW()
    WHERE id = p_incident_id;

    -- Record event in automation_events
    INSERT INTO public.automation_events (
        classroom_id,
        zone_id,
        event_type,
        trigger_inputs,
        actions_taken,
        explanation
    ) VALUES (
        p_classroom_id,
        p_zone_id,
        'EMERGENCY_POWER_CUT',
        jsonb_build_object('incident_id', p_incident_id),
        jsonb_build_object('power_on', false, 'mode', 'forced_off'),
        'Emergency circuit tripped! Cut all power to prevent electrical hazard or fire damage.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. CLEANUP EXPIRED MANUAL OVERRIDES (Restores devices to 'auto')
CREATE OR REPLACE FUNCTION public.cleanup_expired_overrides()
RETURNS INT AS $$
DECLARE
    cleared_count INT;
BEGIN
    WITH expired AS (
        UPDATE public.device_state
        SET
            mode = 'auto',
            override_until = NULL,
            override_by = NULL,
            updated_at = NOW()
        WHERE mode != 'auto'
          AND override_until IS NOT NULL
          AND override_until <= NOW()
        RETURNING device_id
    )
    SELECT count(*) INTO cleared_count FROM expired;
    RETURN cleared_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. MATERIALIZED VIEW FOR HOURLY ENERGY AGGREGATION
CREATE MATERIALIZED VIEW IF NOT EXISTS hourly_energy_summary AS
SELECT
    DATE_TRUNC('hour', interval_start) AS hour_bucket,
    classroom_id,
    SUM(actual_kwh) AS total_actual_kwh,
    SUM(baseline_kwh) AS total_baseline_kwh,
    SUM(saved_kwh) AS total_saved_kwh,
    SUM(cost_saved) AS total_cost_saved,
    SUM(co2_saved_kg) AS total_co2_saved_kg
FROM public.energy_usage
GROUP BY 1, 2
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_hourly_energy_unique
    ON hourly_energy_summary (hour_bucket, classroom_id);

-- Refresh function for pg_cron
CREATE OR REPLACE FUNCTION refresh_energy_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY hourly_energy_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ENABLE SUPABASE REALTIME ON DYNAMIC TABLES
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.device_state;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_incidents;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.occupancy_snapshots;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.automation_events;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;
