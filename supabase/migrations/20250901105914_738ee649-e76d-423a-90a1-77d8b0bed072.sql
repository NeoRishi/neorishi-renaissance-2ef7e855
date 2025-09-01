-- Fix security definer view issues by removing problematic views
-- and strengthening RLS policies instead

-- Drop the problematic security definer views
DROP VIEW IF EXISTS public.safe_profiles;
DROP VIEW IF EXISTS public.safe_onboarding_responses;

-- Remove grants on the dropped views
-- (Views are already dropped so no need to revoke grants)

-- The RLS policies we created are already secure and sufficient
-- The security definer functions for validation are fine to keep
-- as they are used in policies, not in views

-- Add additional constraint to ensure user_id is never null for security
-- This prevents potential RLS bypass scenarios

-- Update profiles table to ensure user_id cannot be null
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL;

-- Update onboarding_responses table to ensure user_id cannot be null  
ALTER TABLE public.onboarding_responses
ALTER COLUMN user_id SET NOT NULL;

-- Add indexes for better performance on security-critical columns
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id ON public.onboarding_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_questionnaire_user_id ON public.goals_questionnaire(user_id);