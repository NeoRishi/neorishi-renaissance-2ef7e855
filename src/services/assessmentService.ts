import { supabase } from '@/integrations/supabase/client';
import { PrakritiResult } from '@/types/prakriti';

export const saveAssessmentResult = async (result: any) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    if (!user) {
      console.error('No user found in session');
      throw new Error('User not authenticated');
    }

    console.log('Saving assessment result for user:', user.id);
    console.log('Assessment data:', {
      user_id: user.id,
      dominant_dosha: result.dominantDosha,
      constitution_type: result.constitution,
      scores: result.scores,
      answers: result.answers,
      total_questions: result.totalQuestions
    });

    const { data, error } = await supabase
      .from('assessment_results')
      .insert({
        user_id: user.id,
        dominant_dosha: result.dominantDosha,
        constitution_type: result.constitution,
        scores: result.scores,
        answers: result.answers,
        total_questions: result.totalQuestions
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    return { data, error: null };
  } catch (error) {
    console.error('Error saving assessment result:', error);
    return { data: null, error };
  }
};

export const getLatestAssessmentResult = async () => {
  try {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching assessment result:', error);
    return { data: null, error };
  }
}; 