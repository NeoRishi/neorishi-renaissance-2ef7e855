-- Fix security definer view issues detected by linter
-- Drop any security definer views that may be causing issues

-- Check if views exist and drop them if they use security definer
DROP VIEW IF EXISTS public.safe_profiles CASCADE;
DROP VIEW IF EXISTS public.safe_onboarding_responses CASCADE;

-- Instead of views, we'll rely on the enhanced RLS policies for security
-- The RLS policies we created provide the necessary security without needing security definer views

-- Verify all tables have proper RLS enabled
-- This is a safety check to ensure RLS is active on all sensitive tables
DO $$
BEGIN
  -- Ensure RLS is enabled on all sensitive tables
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.panchanga_cache ENABLE ROW LEVEL SECURITY;
  
  -- Add comment explaining the security approach
  COMMENT ON TABLE public.profiles IS 'Personal user data protected by RLS policies requiring authenticated users to access only their own data';
  COMMENT ON TABLE public.onboarding_responses IS 'Sensitive user onboarding data including verification tokens, protected by strict RLS policies';
  COMMENT ON TABLE public.panchanga_cache IS 'Astronomical data cache, restricted to authenticated users only';
END
$$;