-- Automatically populate user_id in wellness_profiles rows
-- Timestamp: 2025-07-08 11:01 UTC

-- Function to set user_id to auth.uid()
CREATE OR REPLACE FUNCTION public.set_wellness_profile_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any (idempotent)
DROP TRIGGER IF EXISTS set_wellness_profile_user_id ON public.wellness_profiles;

-- Create trigger to run BEFORE INSERT
CREATE TRIGGER set_wellness_profile_user_id
BEFORE INSERT ON public.wellness_profiles
FOR EACH ROW EXECUTE PROCEDURE public.set_wellness_profile_user_id(); 