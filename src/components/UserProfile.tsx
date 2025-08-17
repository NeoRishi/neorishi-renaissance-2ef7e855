import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Brain, Heart, Moon, Sun, Target, Utensils, Zap } from "lucide-react";
import { goalCategories, foodPreferences, activityLevels } from "./GoalsQuestionnaire";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileProps {
  userProfile: any;
}

export const UserProfile = ({ userProfile }: UserProfileProps) => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (data?.full_name) {
          // Get first name from full name
          const nameParts = data.full_name.split(' ');
          setFirstName(nameParts[0]);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  if (!user || !userProfile) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-amber-800">
              Welcome, {firstName || user.email}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Current State */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="w-5 h-5 text-amber-600" />
                    Current State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-amber-700">Dominant Dosha</h3>
                      <p className="text-lg font-semibold text-amber-800">
                        {userProfile?.prakritiResult?.dominant?.toUpperCase()}
                      </p>
                      <p className="text-sm text-amber-600">
                        Your current energetic tendency
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-amber-700">Natural Constitution</h3>
                      <p className="text-lg font-semibold text-amber-800">
                        {userProfile?.prakritiResult?.constitutionType?.toUpperCase()}
                      </p>
                      <p className="text-sm text-amber-600">
                        Your ideal state of balance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wellness Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="w-5 h-5 text-amber-600" />
                    Wellness Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-amber-700">Activity Level</h3>
                      <p className="text-lg font-semibold text-amber-800">
                        {activityLevels.find(l => l.id === userProfile?.activityLevel)?.label}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-amber-700">Time Available</h3>
                      <p className="text-lg font-semibold text-amber-800">
                        {userProfile?.timeAvailable} minutes per day
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assessment Tab */}
          <TabsContent value="assessment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-amber-600" />
                  Prakriti Assessment Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Dosha Scores */}
                  <div>
                    <h3 className="text-sm font-medium text-amber-700 mb-2">Dosha Scores</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(userProfile?.prakritiResult?.scores || {}).map(([dosha, score]) => (
                        <div key={dosha} className="bg-amber-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-amber-700">{dosha.toUpperCase()}</p>
                          <p className="text-2xl font-bold text-amber-800">{score}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assessment Details */}
                  <div>
                    <h3 className="text-sm font-medium text-amber-700 mb-2">Assessment Details</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-amber-600">
                        Total Questions: {userProfile?.prakritiResult?.totalQuestions}
                      </p>
                      <p className="text-sm text-amber-600">
                        Answers Recorded: {Object.keys(userProfile?.prakritiResult?.answers || {}).length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Selected Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-amber-600" />
                    Selected Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userProfile?.goals?.map((goalId: string) => {
                      const goal = goalCategories.find(g => g.id === goalId);
                      return (
                        <div key={goalId} className="flex items-center gap-2 text-amber-600">
                          <Target className="w-4 h-4" />
                          {goal?.label || goalId}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Food Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Utensils className="w-5 h-5 text-amber-600" />
                    Food Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userProfile?.foodPreferences?.map((prefId: string) => {
                      const pref = foodPreferences.find(f => f.id === prefId);
                      return (
                        <div key={prefId} className="flex items-center gap-2 text-amber-600">
                          <Utensils className="w-4 h-4" />
                          {pref?.label || prefId}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-amber-600" />
                  Wellness Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current State Metrics */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Moon className="w-4 h-4 text-amber-600" />
                        <h3 className="text-sm font-medium text-amber-700">Sleep Quality</h3>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < (userProfile?.sleepQuality || 0) ? 'bg-amber-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-4 h-4 text-amber-600" />
                        <h3 className="text-sm font-medium text-amber-700">Stress Level</h3>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < (userProfile?.stressLevel || 0) ? 'bg-amber-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-amber-600" />
                        <h3 className="text-sm font-medium text-amber-700">Energy Level</h3>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < (userProfile?.energyLevel || 0) ? 'bg-amber-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 