-- Fix RLS security vulnerabilities with proper handling of existing policies
-- Add security definer function for enhanced user validation
CREATE OR REPLACE FUNCTION public.is_authenticated_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND auth.role() = 'authenticated';
$$;

-- Function to validate user data access with additional security checks
CREATE OR REPLACE FUNCTION public.validate_user_data_access(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE  
SET search_path = public
AS $$
  SELECT 
    auth.uid() IS NOT NULL AND 
    auth.uid() = target_user_id AND
    auth.role() = 'authenticated';
$$;

-- Enhance profiles table security by adding stricter policies
-- First, check if enhanced policies exist, if not create them
DO $$
BEGIN
  -- Drop and recreate policies with enhanced security
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles; 
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Authenticated users can view only their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Authenticated users can create only their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Authenticated users can update only their own profile" ON public.profiles;

  -- Create enhanced policies with dual authentication checks
  CREATE POLICY "Authenticated users can view only their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND 
    public.is_authenticated_user() = true
  );

  CREATE POLICY "Authenticated users can create only their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND 
    public.is_authenticated_user() = true
  );

  CREATE POLICY "Authenticated users can update only their own profile"
  ON public.profiles  
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND 
    public.is_authenticated_user() = true
  )
  WITH CHECK (
    auth.uid() = user_id AND 
    public.is_authenticated_user() = true
  );
END
$$;

-- Secure onboarding_responses table
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can view their own onboarding responses" ON public.onboarding_responses;
  DROP POLICY IF EXISTS "Users can create their own onboarding responses" ON public.onboarding_responses;
  DROP POLICY IF EXISTS "Users can update their own onboarding responses" ON public.onboarding_responses;
  DROP POLICY IF EXISTS "Authenticated users can view only their own onboarding data" ON public.onboarding_responses;
  DROP POLICY IF EXISTS "Authenticated users can create only their own onboarding data" ON public.onboarding_responses;
  DROP POLICY IF EXISTS "Authenticated users can update only their own onboarding data" ON public.onboarding_responses;

  -- Create enhanced policies
  CREATE POLICY "Authenticated users can view only their own onboarding data"
  ON public.onboarding_responses
  FOR SELECT  
  TO authenticated
  USING (
    auth.uid() = user_id AND 
    public.is_authenticated_user() = true
  );

  CREATE POLICY "Authenticated users can create only their own onboarding data"
  ON public.onboarding_responses
  FOR INSERT
  TO authenticated  
  WITH CHECK (
    auth.uid() = user_id AND 
    public.is_authenticated_user() = true
  );

  CREATE POLICY "Authenticated users can update only their own onboarding data"
  ON public.onboarding_responses
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND 
    public.is_authenticated_user() = true
  )
  WITH CHECK (
    auth.uid() = user_id AND 
    public.is_authenticated_user() = true
  );
END
$$;

-- Restrict panchanga_cache to authenticated users only for security
DO $$
BEGIN
  DROP POLICY IF EXISTS "Everyone can view panchanga cache" ON public.panchanga_cache;
  DROP POLICY IF EXISTS "System can manage panchanga cache" ON public.panchanga_cache;
  DROP POLICY IF EXISTS "Authenticated users can view panchanga cache" ON public.panchanga_cache;

  CREATE POLICY "Authenticated users can view panchanga cache"
  ON public.panchanga_cache
  FOR SELECT
  TO authenticated
  USING (public.is_authenticated_user() = true);

  CREATE POLICY "System can manage panchanga cache"  
  ON public.panchanga_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
END
$$;