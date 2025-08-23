-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  date_of_birth DATE,
  time_of_birth TIME,
  birth_place TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create assessment_results table
CREATE TABLE public.assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dominant_dosha TEXT,
  constitution_type TEXT,
  scores JSONB,
  answers JSONB,
  total_questions INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policies for assessment_results
CREATE POLICY "Users can view their own assessment results" 
ON public.assessment_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessment results" 
ON public.assessment_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create onboarding_responses table for the 6-question onboarding
CREATE TABLE public.onboarding_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding_responses
CREATE POLICY "Users can view their own onboarding responses" 
ON public.onboarding_responses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding responses" 
ON public.onboarding_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create goals_questionnaire table
CREATE TABLE public.goals_questionnaire (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_result_id UUID REFERENCES public.assessment_results(id),
  activity_level TEXT,
  time_available INTEGER,
  stress_level INTEGER,
  sleep_quality INTEGER,
  energy_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.goals_questionnaire ENABLE ROW LEVEL SECURITY;

-- Create policies for goals_questionnaire
CREATE POLICY "Users can view their own goals questionnaire" 
ON public.goals_questionnaire 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals questionnaire" 
ON public.goals_questionnaire 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create goals table
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_id UUID NOT NULL REFERENCES public.goals_questionnaire(id) ON DELETE CASCADE,
  goal_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Create policies for goals
CREATE POLICY "Users can view goals from their questionnaires" 
ON public.goals 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.goals_questionnaire gq 
  WHERE gq.id = goals.questionnaire_id 
  AND gq.user_id = auth.uid()
));

CREATE POLICY "Users can create goals for their questionnaires" 
ON public.goals 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.goals_questionnaire gq 
  WHERE gq.id = goals.questionnaire_id 
  AND gq.user_id = auth.uid()
));

-- Create food_preferences table
CREATE TABLE public.food_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_id UUID NOT NULL REFERENCES public.goals_questionnaire(id) ON DELETE CASCADE,
  preference_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.food_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for food_preferences
CREATE POLICY "Users can view food preferences from their questionnaires" 
ON public.food_preferences 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.goals_questionnaire gq 
  WHERE gq.id = food_preferences.questionnaire_id 
  AND gq.user_id = auth.uid()
));

CREATE POLICY "Users can create food preferences for their questionnaires" 
ON public.food_preferences 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.goals_questionnaire gq 
  WHERE gq.id = food_preferences.questionnaire_id 
  AND gq.user_id = auth.uid()
));

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_id UUID NOT NULL REFERENCES public.goals_questionnaire(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Create policies for challenges
CREATE POLICY "Users can view challenges from their questionnaires" 
ON public.challenges 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.goals_questionnaire gq 
  WHERE gq.id = challenges.questionnaire_id 
  AND gq.user_id = auth.uid()
));

CREATE POLICY "Users can create challenges for their questionnaires" 
ON public.challenges 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.goals_questionnaire gq 
  WHERE gq.id = challenges.questionnaire_id 
  AND gq.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessment_results_updated_at
  BEFORE UPDATE ON public.assessment_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_questionnaire_updated_at
  BEFORE UPDATE ON public.goals_questionnaire
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();