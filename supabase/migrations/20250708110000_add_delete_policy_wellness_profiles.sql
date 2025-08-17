-- Add DELETE policy for wellness_profiles so users can remove their own profile
-- Timestamp: 2025-07-08 11:00 UTC

-- Ensure row-level security is enabled (safe even if already enabled)
ALTER TABLE public.wellness_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to delete ONLY their own wellness profile row
CREATE POLICY "Users can delete their own wellness profile"
  ON public.wellness_profiles
  FOR DELETE
  USING (auth.uid() = user_id); 