-- Create goals_questionnaire table for storing the main questionnaire response
CREATE TABLE public.goals_questionnaire (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  assessment_result_id UUID NOT NULL REFERENCES public.assessment_results ON DELETE CASCADE,
  activity_level TEXT NOT NULL,
  time_available INTEGER NOT NULL,
  stress_level INTEGER NOT NULL,
  sleep_quality INTEGER NOT NULL,
  energy_level INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goals table for storing selected goals
CREATE TABLE public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_id UUID NOT NULL REFERENCES public.goals_questionnaire ON DELETE CASCADE,
  goal_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food_preferences table for storing selected food preferences
CREATE TABLE public.food_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_id UUID NOT NULL REFERENCES public.goals_questionnaire ON DELETE CASCADE,
  preference_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenges table for storing selected challenges
CREATE TABLE public.challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_id UUID NOT NULL REFERENCES public.goals_questionnaire ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.goals_questionnaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Create policies for goals_questionnaire
CREATE POLICY "Users can view their own questionnaire responses" 
  ON public.goals_questionnaire 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questionnaire responses" 
  ON public.goals_questionnaire 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questionnaire responses" 
  ON public.goals_questionnaire 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for goals
CREATE POLICY "Users can view their own goals" 
  ON public.goals 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.goals_questionnaire 
    WHERE id = goals.questionnaire_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own goals" 
  ON public.goals 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.goals_questionnaire 
    WHERE id = goals.questionnaire_id 
    AND user_id = auth.uid()
  ));

-- Create policies for food_preferences
CREATE POLICY "Users can view their own food preferences" 
  ON public.food_preferences 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.goals_questionnaire 
    WHERE id = food_preferences.questionnaire_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own food preferences" 
  ON public.food_preferences 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.goals_questionnaire 
    WHERE id = food_preferences.questionnaire_id 
    AND user_id = auth.uid()
  ));

-- Create policies for challenges
CREATE POLICY "Users can view their own challenges" 
  ON public.challenges 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.goals_questionnaire 
    WHERE id = challenges.questionnaire_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own challenges" 
  ON public.challenges 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.goals_questionnaire 
    WHERE id = challenges.questionnaire_id 
    AND user_id = auth.uid()
  ));

-- Create indexes for faster lookups
CREATE INDEX idx_goals_questionnaire_user_id ON public.goals_questionnaire(user_id);
CREATE INDEX idx_goals_questionnaire_id ON public.goals(questionnaire_id);
CREATE INDEX idx_food_preferences_questionnaire_id ON public.food_preferences(questionnaire_id);
CREATE INDEX idx_challenges_questionnaire_id ON public.challenges(questionnaire_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_goals_questionnaire_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update updated_at
CREATE TRIGGER on_goals_questionnaire_updated
  BEFORE UPDATE ON public.goals_questionnaire
  FOR EACH ROW EXECUTE PROCEDURE public.handle_goals_questionnaire_updated_at(); 