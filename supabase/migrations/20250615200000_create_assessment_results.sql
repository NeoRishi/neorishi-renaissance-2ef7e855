-- Create assessment_results table
CREATE TABLE public.assessment_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  dominant_dosha TEXT NOT NULL,
  constitution_type TEXT NOT NULL,
  scores JSONB NOT NULL,
  answers JSONB NOT NULL,
  total_questions INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policies for assessment_results
CREATE POLICY "Users can view their own assessment results" 
  ON public.assessment_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment results" 
  ON public.assessment_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessment results" 
  ON public.assessment_results 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_assessment_results_user_id ON public.assessment_results(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update updated_at
CREATE TRIGGER on_assessment_results_updated
  BEFORE UPDATE ON public.assessment_results
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at(); 