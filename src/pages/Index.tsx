import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { GoalsQuestionnaire, goalCategories, foodPreferences, activityLevels } from "@/components/GoalsQuestionnaire";
import { PrakritiAssessment } from "@/components/PrakritiAssessment";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowDown, ArrowUp, Zap, Brain, Heart, Target, Compass, Lightbulb, Calendar, Utensils, Star, CheckCircle, Award } from "lucide-react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { saveAssessmentResult, getLatestAssessmentResult } from '@/services/assessmentService';
import { saveGoalsQuestionnaire, getLatestGoalsQuestionnaire } from '@/services/goalsQuestionnaireService';
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Section = 'home' | 'goals' | 'assessment' | 'results' | 'settings' | 'subscription';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-amber-800 mb-6 text-center">Settings</h1>
        <div className="space-y-8">
          {/* Change Password */}
          <div>
            <h2 className="text-2xl font-bold text-amber-700 mb-2">Change Password</h2>
            <div className="space-y-3">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" placeholder="Current password" />
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" placeholder="New password" />
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              <Button className="mt-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold">Update Password</Button>
            </div>
          </div>
          {/* Dark Mode Toggle */}
          <div>
            <h2 className="text-2xl font-bold text-amber-700 mb-2">Appearance</h2>
            <div className="flex items-center justify-between">
              <span className="text-lg text-amber-800 font-medium">Dark Mode</span>
              <Switch />
            </div>
          </div>
          {/* Notification Preferences */}
          <div>
            <h2 className="text-2xl font-bold text-amber-700 mb-2">Notifications</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg text-amber-800">Email Notifications</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg text-amber-800">SMS Notifications</span>
                <Switch />
              </div>
            </div>
          </div>
          {/* Delete Account */}
          <div className="pt-4 border-t border-amber-100">
            <h2 className="text-2xl font-bold text-red-700 mb-2">Danger Zone</h2>
            <Button variant="destructive" className="w-full font-bold">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [scrollY, setScrollY] = useState(0);
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const mockPrakritiResult = {
    dominant: 'vata',
    scores: { vata: 6, pitta: 2, kapha: 0 }
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGoalsComplete = async (goalsData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your goals.",
        variant: "destructive",
      });
      return;
    }

    if (!userProfile?.assessment_result_id) {
      toast({
        title: "Assessment Required",
        description: "Please complete the Prakriti assessment first.",
        variant: "destructive",
      });
      setCurrentSection('assessment');
      return;
    }

    try {
      console.log('Saving goals questionnaire with data:', {
        user_id: user.id,
        assessment_result_id: userProfile.assessment_result_id,
        activity_level: goalsData.activityLevel,
        time_available: goalsData.timeAvailable,
        stress_level: goalsData.stressLevel,
        sleep_quality: goalsData.sleepQuality,
        energy_level: goalsData.energyLevel,
        goals: goalsData.goals,
        food_preferences: goalsData.foodPreferences,
        challenges: goalsData.challenges,
      });

      // Save the goals questionnaire data
      const result = await saveGoalsQuestionnaire({
        user_id: user.id,
        assessment_result_id: userProfile.assessment_result_id,
        activity_level: goalsData.activityLevel,
        time_available: goalsData.timeAvailable,
        stress_level: goalsData.stressLevel,
        sleep_quality: goalsData.sleepQuality,
        energy_level: goalsData.energyLevel,
        goals: goalsData.goals,
        food_preferences: goalsData.foodPreferences,
        challenges: goalsData.challenges,
      });

      console.log('Goals questionnaire saved successfully:', result);

      // Update user profile with goals data
      setUserProfile(prev => ({
        ...prev,
        goals: goalsData.goals,
        foodPreferences: goalsData.foodPreferences,
        activityLevel: goalsData.activityLevel,
        timeAvailable: goalsData.timeAvailable,
        stressLevel: goalsData.stressLevel,
        sleepQuality: goalsData.sleepQuality,
        energyLevel: goalsData.energyLevel,
        challenges: goalsData.challenges,
      }));

      toast({
        title: "Goals Saved",
        description: "Your wellness goals have been saved successfully.",
      });

      // Navigate to the next section or show results
      setCurrentSection('results');
    } catch (error) {
      console.error('Detailed error saving goals:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save your goals. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handleTakeAssessment = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentSection('assessment');
  };
  const handleAssessmentComplete = async (result: any) => {
    try {
      const { data, error } = await saveAssessmentResult(result);
      if (error) {
        console.error('Error saving assessment:', error);
        toast({
          title: "Error Saving Assessment",
          description: error.message || "Failed to save assessment results. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setUserProfile({
        prakritiResult: result,
        assessment_result_id: data.id
      });
      setCurrentSection('goals');
    } catch (error: any) {
      console.error('Error in handleAssessmentComplete:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handleNavigate = (section: 'home' | 'subscription' | 'goals' | 'assessment' | 'features' | 'about' | 'settings') => {
    if (section === 'features') {
      scrollTo('features-section');
    } else if (section === 'about') {
        scrollTo('about-section');
    } else if (section === 'home') {
      setCurrentSection('home');
      setTimeout(() => scrollTo('home'), 0);
    } else if (section === 'settings') {
        navigate('/settings');
    } else {
      // Check if the section requires authentication (goals & assessment only)
      if ((section === 'goals' || section === 'assessment') && !user) {
        navigate('/auth');
        return;
      }
      setCurrentSection(section);

      // Ensure we start at top when navigating to subscription page
      if (section === 'subscription') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
  useEffect(() => {
    const loadLatestAssessment = async () => {
      if (user) {
        try {
          // Wellness profile step removed – go directly to assessment
          setCurrentSection('assessment');

          // Load assessment result
          const { data: assessmentData, error: assessmentError } = await getLatestAssessmentResult();
          if (assessmentError) {
            console.error('Error loading assessment:', assessmentError);
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
          console.error('Error loading assessment:', error);
        }
      }
    };

    loadLatestAssessment();
  }, [user]);
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-2xl text-amber-800 font-medium">Loading your wellness journey...</div>
        </div>
      </div>;
  }
  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-background relative overflow-hidden">
          {/* Header Navigation */}
          <Header onNavigate={handleNavigate} />

          {currentSection === 'home' && <>
              {/* Hero Section */}
              <div id="home">
                <Hero onTakeAssessment={handleTakeAssessment} />
              </div>

              {/* Consolidated Problem/Solution Section */}
              <div id="why-choose-section" className="py-20 px-4 bg-gradient-to-b from-orange-50 to-amber-50">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-amber-800 mb-6">Transform Your Wellness Journey</h2>
                    <p className="text-xl text-amber-700 mb-8 max-w-3xl mx-auto">
                      Feeling tired, stuck, or out of sync with your body and mind? NeoRishi combines 5000-year-old Ayurvedic wisdom with modern AI to create your personalized path to wellness.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <Card className="group bg-white/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Heart className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-3">Physical Wellness</h3>
                        <p className="text-amber-700">Overcome low energy, poor digestion, and weight struggles</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-white/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-3">Mental Clarity</h3>
                        <p className="text-amber-700">Find focus, reduce anxiety, and boost motivation</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-white/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-3">Spiritual Growth</h3>
                        <p className="text-amber-700">Discover your purpose and inner peace</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <Button onClick={() => scrollTo('features-section')} className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
                      Explore How It Works
                      <Compass className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Streamlined Features Section */}
              <div id="features-section" className="py-20 px-4 bg-gradient-to-b from-amber-50 to-orange-50">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-amber-800 mb-6">Your Complete Wellness Toolkit</h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <Card className="group bg-white/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Compass className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Constitution Assessment</h3>
                        <p className="text-amber-700 text-sm">Discover your unique Ayurvedic body type</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-white/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Daily Routines</h3>
                        <p className="text-amber-700 text-sm">Personalized schedules that fit your life</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-white/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Utensils className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Nutrition Plans</h3>
                        <p className="text-amber-700 text-sm">Tailored diet recommendations</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-white/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Meditation & Breathwork</h3>
                        <p className="text-amber-700 text-sm">Guided practices for your constitution</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-white/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Adaptive Yoga</h3>
                        <p className="text-amber-700 text-sm">Sequences tailored to your needs</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-white/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Progress Tracking</h3>
                        <p className="text-amber-700 text-sm">Monitor your wellness journey</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Single, focused CTA */}
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
                      <h3 className="text-2xl font-bold text-white mb-4">Ready to Begin?</h3>
                      <p className="text-orange-100 mb-6">Join thousands discovering their optimal wellness path</p>
                      <Button onClick={handleTakeAssessment} className="bg-white text-orange-600 hover:bg-orange-50 px-10 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
                        Start Free Assessment
                        <Zap className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simplified About Section */}
              <div id="about-section" className="py-20 px-4 bg-gradient-to-b from-orange-50 to-amber-50">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl font-bold text-amber-800 mb-8">About NeoRishi</h2>
                  <p className="text-lg text-amber-700 leading-relaxed mb-12">
                    We combine 5000-year-old Ayurvedic wisdom with cutting-edge AI to make ancient wellness teachings accessible for modern life. Every recommendation is personalized to your unique constitution and goals.
                  </p>
                  
                  <div className="grid md:grid-cols-4 gap-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-800">10,000+</div>
                      <div className="text-amber-600">Happy Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-800">4.9/5</div>
                      <div className="text-amber-600">User Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-800">50+</div>
                      <div className="text-amber-600">Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-800">99%</div>
                      <div className="text-amber-600">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
              <Footer />
            </>}

          {currentSection === 'assessment' && <div className="pt-16">
              <PrakritiAssessment onComplete={handleAssessmentComplete} onBack={() => setCurrentSection('home')} />
            </div>}

          {currentSection === 'goals' && <div className="pt-16">
              <GoalsQuestionnaire prakritiResult={userProfile?.prakritiResult || mockPrakritiResult} onComplete={handleGoalsComplete} onBack={() => setCurrentSection('assessment')} />
            </div>}

          {currentSection === 'results' && (
            <div className="pt-16 min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="text-center mb-12">
                  <h1 className="text-5xl font-extrabold text-amber-800 mb-3 tracking-tight drop-shadow-lg">Your Personalized Wellness Plan</h1>
                  <p className="text-xl text-amber-700 font-medium mb-2">Based on your assessment and goals</p>
                  <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mb-4 rounded-full"></div>
                </div>

                {/* Prakriti Results */}
                <Card className="mb-10 shadow-xl border-amber-200 bg-white/90">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-amber-800 mb-6 flex items-center gap-3">
                      <span className="inline-block w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center"><span className="text-white text-2xl">🧬</span></span>
                      Your Body-Mind Type
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
                        <h3 className="text-lg font-semibold text-amber-700 mb-2 uppercase tracking-wide">Current State</h3>
                        <span className="inline-block text-3xl font-extrabold text-orange-700 bg-orange-100 px-6 py-2 rounded-full mb-2 shadow-md border border-orange-200">
                          {userProfile?.prakritiResult?.dominantDosha || userProfile?.prakritiResult?.dominant}
                        </span>
                        <p className="text-sm text-amber-600">Your most prominent dosha at this time</p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
                        <h3 className="text-lg font-semibold text-amber-700 mb-2 uppercase tracking-wide">Natural Constitution</h3>
                        <span className="inline-block text-3xl font-extrabold text-amber-700 bg-amber-100 px-6 py-2 rounded-full mb-2 shadow-md border border-amber-200">
                          {userProfile?.prakritiResult?.constitution || userProfile?.prakritiResult?.constitutionType}
                        </span>
                        <p className="text-sm text-amber-600">Your balanced state of being</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-amber-700 mb-3 flex items-center gap-2"><span className="text-xl">📊</span> Dosha Scores</h3>
                      <div className="grid grid-cols-3 gap-6">
                        {(Object.entries(userProfile?.prakritiResult?.scores || {}) as [string, number][]).map(([dosha, score]) => (
                          <div key={dosha} className="text-center bg-white rounded-lg p-4 shadow border border-amber-100">
                            <div className="text-2xl font-bold text-amber-800 mb-1">{score}</div>
                            <div className="text-base font-semibold text-amber-600 capitalize">{dosha}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Goals Summary */}
                <Card className="mb-10 shadow-xl border-green-200 bg-white/90">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                      <span className="inline-block w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center"><span className="text-white text-2xl">🎯</span></span>
                      Your Wellness Goals
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-green-700 mb-2 flex items-center gap-2"><span className="text-lg">🏆</span> Selected Goals</h3>
                        <div className="space-y-2">
                          {userProfile?.goals?.map((goalId: string) => {
                            const goal = goalCategories.find(g => g.id === goalId);
                            return (
                              <div key={goalId} className="flex items-center text-green-700 font-medium bg-green-50 rounded px-3 py-1">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                {goal?.label || goalId || 'Unknown Goal'}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-700 mb-2 flex items-center gap-2"><span className="text-lg">🥗</span> Food Preferences</h3>
                        <div className="space-y-2">
                          {userProfile?.foodPreferences?.map((prefId: string) => {
                            const pref = foodPreferences.find(f => f.id === prefId);
                            return (
                              <div key={prefId} className="flex items-center text-green-700 font-medium bg-green-50 rounded px-3 py-1">
                                <Utensils className="w-4 h-4 mr-2 text-green-500" />
                                {pref?.label || prefId || 'Unknown Preference'}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current State */}
                <Card className="mb-10 shadow-xl border-blue-200 bg-white/90">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-3">
                      <span className="inline-block w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"><span className="text-white text-2xl">💡</span></span>
                      Your Current State
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-700 mb-2">Activity Level</h3>
                        <p className="text-blue-700 font-bold text-lg">
                          {activityLevels.find(l => l.id === userProfile?.activityLevel)?.label || userProfile?.activityLevel}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-700 mb-2">Time Available</h3>
                        <p className="text-blue-700 font-bold text-lg">{userProfile?.timeAvailable} minutes per day</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-700 mb-2">Stress Level</h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full mx-1 border-2 ${i < (userProfile?.stressLevel || 0) ? 'bg-blue-500 border-blue-600' : 'bg-gray-200 border-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-700 mb-2">Sleep Quality</h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full mx-1 border-2 ${i < (userProfile?.sleepQuality || 0) ? 'bg-blue-500 border-blue-600' : 'bg-gray-200 border-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-700 mb-2">Energy Level</h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full mx-1 border-2 ${i < (userProfile?.energyLevel || 0) ? 'bg-blue-500 border-blue-600' : 'bg-gray-200 border-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          )}

          {currentSection === 'subscription' && <div className="pt-16">
              <SubscriptionPlans onBack={() => setCurrentSection('home')} />
            </div>}

          {/* Floating action button */}
          <div className="fixed bottom-8 right-8 z-50">
            <Button onClick={handleTakeAssessment} className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group">
              <Zap className="w-6 h-6 group-hover:animate-pulse" />
            </Button>
          </div>
        </div>
      } />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
};

export default Index;
