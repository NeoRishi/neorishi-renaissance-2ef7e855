import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

type GoalsQuestionnaire = Database['public']['Tables']['goals_questionnaire']['Row'];
type Goal = Database['public']['Tables']['goals']['Row'];
type FoodPreference = Database['public']['Tables']['food_preferences']['Row'];
type Challenge = Database['public']['Tables']['challenges']['Row'];

export interface GoalsQuestionnaireData {
  user_id: string;
  assessment_result_id: string;
  activity_level: string;
  time_available: number;
  stress_level: number;
  sleep_quality: number;
  energy_level: number;
  goals: string[];
  food_preferences: string[];
  challenges: string[];
}

export async function saveGoalsQuestionnaire(data: GoalsQuestionnaireData): Promise<GoalsQuestionnaire> {
  console.log('Starting to save goals questionnaire...');
  
  const { data: questionnaire, error: questionnaireError } = await supabase
    .from('goals_questionnaire')
    .insert({
      user_id: data.user_id,
      assessment_result_id: data.assessment_result_id,
      activity_level: data.activity_level,
      time_available: data.time_available,
      stress_level: data.stress_level,
      sleep_quality: data.sleep_quality,
      energy_level: data.energy_level,
    })
    .select()
    .single();

  if (questionnaireError) {
    console.error('Error saving goals questionnaire:', questionnaireError);
    throw new Error(`Failed to save goals questionnaire: ${questionnaireError.message}`);
  }

  console.log('Successfully saved main questionnaire, now saving related data...');

  // Save goals
  if (data.goals.length > 0) {
    const { error: goalsError } = await supabase
      .from('goals')
      .insert(
        data.goals.map(goal_id => ({
          questionnaire_id: questionnaire.id,
          goal_id,
        }))
      );

    if (goalsError) {
      console.error('Error saving goals:', goalsError);
      throw new Error(`Failed to save goals: ${goalsError.message}`);
    }
  }

  // Save food preferences
  if (data.food_preferences.length > 0) {
    const { error: preferencesError } = await supabase
      .from('food_preferences')
      .insert(
        data.food_preferences.map(preference_id => ({
          questionnaire_id: questionnaire.id,
          preference_id,
        }))
      );

    if (preferencesError) {
      console.error('Error saving food preferences:', preferencesError);
      throw new Error(`Failed to save food preferences: ${preferencesError.message}`);
    }
  }

  // Save challenges
  if (data.challenges.length > 0) {
    const { error: challengesError } = await supabase
      .from('challenges')
      .insert(
        data.challenges.map(challenge_id => ({
          questionnaire_id: questionnaire.id,
          challenge_id,
        }))
      );

    if (challengesError) {
      console.error('Error saving challenges:', challengesError);
      throw new Error(`Failed to save challenges: ${challengesError.message}`);
    }
  }

  console.log('Successfully saved all questionnaire data');
  return questionnaire;
}

export async function getLatestGoalsQuestionnaire(userId: string): Promise<{
  questionnaire: GoalsQuestionnaire;
  goals: Goal[];
  food_preferences: FoodPreference[];
  challenges: Challenge[];
} | null> {
  const { data: questionnaire, error: questionnaireError } = await supabase
    .from('goals_questionnaire')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (questionnaireError) {
    if (questionnaireError.code === 'PGRST116') {
      // No questionnaire found
      return null;
    }
    console.error('Error fetching goals questionnaire:', questionnaireError);
    throw new Error('Failed to fetch goals questionnaire');
  }

  // Fetch related data
  const [goalsResult, preferencesResult, challengesResult] = await Promise.all([
    supabase
      .from('goals')
      .select('*')
      .eq('questionnaire_id', questionnaire.id),
    supabase
      .from('food_preferences')
      .select('*')
      .eq('questionnaire_id', questionnaire.id),
    supabase
      .from('challenges')
      .select('*')
      .eq('questionnaire_id', questionnaire.id),
  ]);

  if (goalsResult.error) {
    console.error('Error fetching goals:', goalsResult.error);
    throw new Error('Failed to fetch goals');
  }

  if (preferencesResult.error) {
    console.error('Error fetching food preferences:', preferencesResult.error);
    throw new Error('Failed to fetch food preferences');
  }

  if (challengesResult.error) {
    console.error('Error fetching challenges:', challengesResult.error);
    throw new Error('Failed to fetch challenges');
  }

  return {
    questionnaire,
    goals: goalsResult.data,
    food_preferences: preferencesResult.data,
    challenges: challengesResult.data,
  };
} 