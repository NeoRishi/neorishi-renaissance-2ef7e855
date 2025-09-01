-- Fix RLS security vulnerabilities for profiles table
-- Add additional security definer function for user validation
CREATE OR REPLACE FUNCTION public.is_authenticated_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- Drop existing policies for profiles table to recreate with better security
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles; 
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create enhanced RLS policies for profiles table with stricter controls
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

-- Secure onboarding_responses table with stricter policies
DROP POLICY IF EXISTS "Users can view their own onboarding responses" ON public.onboarding_responses;
DROP POLICY IF EXISTS "Users can create their own onboarding responses" ON public.onboarding_responses;
DROP POLICY IF EXISTS "Users can update their own onboarding responses" ON public.onboarding_responses;

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

-- Restrict panchanga_cache access to authenticated users only
DROP POLICY IF EXISTS "Everyone can view panchanga cache" ON public.panchanga_cache;
DROP POLICY IF EXISTS "System can manage panchanga cache" ON public.panchanga_cache;

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

-- Add function to validate sensitive data access
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

-- Create view for safe profile access (excluding verification tokens)
CREATE OR REPLACE VIEW public.safe_profiles AS
SELECT 
  id,
  user_id,
  full_name,
  email,
  phone,
  date_of_birth,
  time_of_birth,
  birth_place,
  is_email_verified,
  is_phone_verified,
  created_at,
  updated_at
FROM public.profiles
WHERE public.validate_user_data_access(user_id);

-- Grant appropriate permissions on the view
GRANT SELECT ON public.safe_profiles TO authenticated;

-- Create view for safe onboarding responses (excluding sensitive tokens)  
CREATE OR REPLACE VIEW public.safe_onboarding_responses AS
SELECT
  id,
  user_id,
  responses,
  email,
  phone,
  full_name,
  date_of_birth,
  time_of_birth,
  birth_place,
  is_email_verified,
  is_phone_verified,
  created_at,
  updated_at
FROM public.onboarding_responses
WHERE public.validate_user_data_access(user_id);

-- Grant appropriate permissions on the view
GRANT SELECT ON public.safe_onboarding_responses TO authenticated;