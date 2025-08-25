-- Create assessment_results table for Prakriti assessments
CREATE TABLE public.assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dominant_dosha TEXT NOT NULL,
  constitution_type TEXT NOT NULL,
  scores JSONB NOT NULL,
  answers JSONB NOT NULL,
  total_questions INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goals_questionnaire table
CREATE TABLE public.goals_questionnaire (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_result_id UUID NOT NULL,
  activity_level TEXT NOT NULL,
  time_available INTEGER NOT NULL,
  stress_level INTEGER NOT NULL,
  sleep_quality INTEGER NOT NULL,
  energy_level INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_id UUID NOT NULL,
  goal_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food_preferences table
CREATE TABLE public.food_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_id UUID NOT NULL,
  preference_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_id UUID NOT NULL,
  challenge_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create journal_entries table for daily journaling
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL,
  sankalpa TEXT,
  reflection TEXT,
  improvements TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

-- Create daily_tasks table
CREATE TABLE public.daily_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_date DATE NOT NULL,
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create streaks table
CREATE TABLE public.streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  streak_type TEXT NOT NULL,
  current_count INTEGER NOT NULL DEFAULT 0,
  longest_count INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, streak_type)
);

-- Create panchanga_cache table for performance optimization
CREATE TABLE public.panchanga_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_date DATE NOT NULL UNIQUE,
  panchanga_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals_questionnaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panchanga_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for assessment_results
CREATE POLICY "Users can view their own assessment results" 
ON public.assessment_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessment results" 
ON public.assessment_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessment results" 
ON public.assessment_results 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for goals_questionnaire
CREATE POLICY "Users can view their own goals questionnaire" 
ON public.goals_questionnaire 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals questionnaire" 
ON public.goals_questionnaire 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals questionnaire" 
ON public.goals_questionnaire 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for goals (linked through goals_questionnaire)
CREATE POLICY "Users can view their own goals" 
ON public.goals 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.goals_questionnaire 
  WHERE id = questionnaire_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create their own goals" 
ON public.goals 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.goals_questionnaire 
  WHERE id = questionnaire_id AND user_id = auth.uid()
));

-- Create RLS policies for food_preferences (linked through goals_questionnaire)
CREATE POLICY "Users can view their own food preferences" 
ON public.food_preferences 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.goals_questionnaire 
  WHERE id = questionnaire_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create their own food preferences" 
ON public.food_preferences 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.goals_questionnaire 
  WHERE id = questionnaire_id AND user_id = auth.uid()
));

-- Create RLS policies for challenges (linked through goals_questionnaire)
CREATE POLICY "Users can view their own challenges" 
ON public.challenges 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.goals_questionnaire 
  WHERE id = questionnaire_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create their own challenges" 
ON public.challenges 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.goals_questionnaire 
  WHERE id = questionnaire_id AND user_id = auth.uid()
));

-- Create RLS policies for journal_entries
CREATE POLICY "Users can view their own journal entries" 
ON public.journal_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries" 
ON public.journal_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" 
ON public.journal_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for daily_tasks
CREATE POLICY "Users can view their own daily tasks" 
ON public.daily_tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily tasks" 
ON public.daily_tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily tasks" 
ON public.daily_tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily tasks" 
ON public.daily_tasks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for streaks
CREATE POLICY "Users can view their own streaks" 
ON public.streaks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own streaks" 
ON public.streaks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
ON public.streaks 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for panchanga_cache (public read access for performance)
CREATE POLICY "Everyone can view panchanga cache" 
ON public.panchanga_cache 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage panchanga cache" 
ON public.panchanga_cache 
FOR ALL 
USING (true);

-- Create performance indexes
CREATE INDEX idx_assessment_results_user_id ON public.assessment_results(user_id);
CREATE INDEX idx_assessment_results_created_at ON public.assessment_results(created_at DESC);

CREATE INDEX idx_goals_questionnaire_user_id ON public.goals_questionnaire(user_id);
CREATE INDEX idx_goals_questionnaire_assessment_result_id ON public.goals_questionnaire(assessment_result_id);

CREATE INDEX idx_goals_questionnaire_id ON public.goals(questionnaire_id);
CREATE INDEX idx_food_preferences_questionnaire_id ON public.food_preferences(questionnaire_id);
CREATE INDEX idx_challenges_questionnaire_id ON public.challenges(questionnaire_id);

CREATE INDEX idx_journal_entries_user_date ON public.journal_entries(user_id, entry_date DESC);
CREATE INDEX idx_daily_tasks_user_date ON public.daily_tasks(user_id, task_date DESC);
CREATE INDEX idx_daily_tasks_completed ON public.daily_tasks(user_id, completed, task_date DESC);

CREATE INDEX idx_streaks_user_type ON public.streaks(user_id, streak_type);
CREATE INDEX idx_panchanga_cache_date ON public.panchanga_cache(cache_date);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_assessment_results_updated_at
BEFORE UPDATE ON public.assessment_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_questionnaire_updated_at
BEFORE UPDATE ON public.goals_questionnaire
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
BEFORE UPDATE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_tasks_updated_at
BEFORE UPDATE ON public.daily_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at
BEFORE UPDATE ON public.streaks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_panchanga_cache_updated_at
BEFORE UPDATE ON public.panchanga_cache
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();