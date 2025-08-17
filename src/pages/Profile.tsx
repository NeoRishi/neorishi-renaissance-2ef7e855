import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/UserProfile";
import { getLatestAssessmentResult } from "@/services/assessmentService";
import { getLatestGoalsQuestionnaire } from "@/services/goalsQuestionnaireService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          setLoading(true);
          // Load assessment result
          const { data: assessmentData, error: assessmentError } = await getLatestAssessmentResult();
          if (assessmentError) {
            console.error('Error loading assessment:', assessmentError);
            toast({
              title: "Error",
              description: "Failed to load assessment data. Please try again.",
              variant: "destructive",
            });
            return;
          }

          if (assessmentData) {
            // Load goals questionnaire data
            const goalsData = await getLatestGoalsQuestionnaire(user.id);
            
            setUserProfile({
              prakritiResult: {
                dominant: assessmentData.dominant_dosha,
                constitutionType: assessmentData.constitution_type,
                scores: assessmentData.scores,
                answers: assessmentData.answers,
                totalQuestions: assessmentData.total_questions
              },
              assessment_result_id: assessmentData.id,
              // Add goals data if available
              ...(goalsData && {
                goals: goalsData.goals.map(g => g.goal_id),
                foodPreferences: goalsData.food_preferences.map(fp => fp.preference_id),
                activityLevel: goalsData.questionnaire.activity_level,
                timeAvailable: goalsData.questionnaire.time_available,
                stressLevel: goalsData.questionnaire.stress_level,
                sleepQuality: goalsData.questionnaire.sleep_quality,
                energyLevel: goalsData.questionnaire.energy_level,
                challenges: goalsData.challenges.map(c => c.challenge_id)
              })
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          toast({
            title: "Error",
            description: "Failed to load user data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, [user, toast]);

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-800">Please sign in to view your profile</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-800">Loading your profile...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="text-amber-700 hover:text-amber-800">
          ← Back to Home
        </Button>
      </div>
      <UserProfile userProfile={userProfile} />
    </div>
  );
};

export default Profile; 