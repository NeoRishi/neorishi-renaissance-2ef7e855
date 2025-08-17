-- Create wellness_profiles table for storing user wellness profile data
CREATE TABLE public.wellness_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  preferred_name TEXT,
  age INTEGER,
  gender TEXT,
  weight INTEGER,
  height INTEGER,
  city TEXT,
  zip TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ensure only one wellness profile per user
ALTER TABLE public.wellness_profiles ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- Create index for faster lookups by user_id
CREATE INDEX idx_wellness_profiles_user_id ON public.wellness_profiles(user_id);

-- Enable Row Level Security
ALTER TABLE public.wellness_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own wellness profile
CREATE POLICY "Users can view their own wellness profile"
  ON public.wellness_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own wellness profile
CREATE POLICY "Users can insert their own wellness profile"
  ON public.wellness_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own wellness profile
CREATE POLICY "Users can update their own wellness profile"
  ON public.wellness_profiles
  FOR UPDATE
  USING (auth.uid() = user_id); 