-- Restructure database to use single table for all onboarding responses
-- Drop existing tables that will be consolidated
DROP TABLE IF EXISTS public.goals CASCADE;
DROP TABLE IF EXISTS public.food_preferences CASCADE;
DROP TABLE IF EXISTS public.challenges CASCADE;
DROP TABLE IF EXISTS public.goals_questionnaire CASCADE;
DROP TABLE IF EXISTS public.assessment_results CASCADE;

-- Create a single comprehensive onboarding responses table
CREATE TABLE public.onboarding_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}',
  full_name TEXT,
  phone TEXT,
  email TEXT,
  date_of_birth DATE,
  time_of_birth TIME,
  birth_place TEXT,
  is_email_verified BOOLEAN NOT NULL DEFAULT false,
  is_phone_verified BOOLEAN NOT NULL DEFAULT false,
  email_verification_token TEXT,
  phone_verification_token TEXT,
  email_verification_expires_at TIMESTAMP WITH TIME ZONE,
  phone_verification_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding responses
CREATE POLICY "Users can view their own onboarding responses" 
ON public.onboarding_responses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding responses" 
ON public.onboarding_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding responses" 
ON public.onboarding_responses 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_onboarding_responses_updated_at
BEFORE UPDATE ON public.onboarding_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update profiles table to include verification status
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN NOT NULL DEFAULT false;