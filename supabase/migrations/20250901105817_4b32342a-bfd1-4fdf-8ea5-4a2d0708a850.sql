-- Address security linter issues and remove problematic security definer views
-- Remove any existing security definer views that may be causing issues
DROP VIEW IF EXISTS public.safe_profiles CASCADE;
DROP VIEW IF EXISTS public.safe_onboarding_responses CASCADE;

-- Ensure our security functions are properly defined (they should be SECURITY DEFINER as intended)
-- Keep the security functions as they are needed for proper RLS enforcement