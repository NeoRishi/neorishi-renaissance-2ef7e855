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
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Section = 'home' | 'goals' | 'assessment' | 'results' | 'settings' | 'subscription';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-card/90 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-primary mb-6 text-center">Settings</h1>
        <div className="space-y-8">
          {/* Change Password */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Change Password</h2>
            <div className="space-y-3">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" placeholder="Current password" />
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" placeholder="New password" />
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              <Button className="mt-2 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-bold">Update Password</Button>
            </div>
          </div>
          {/* Dark Mode Toggle */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Appearance</h2>
            <div className="flex items-center justify-between">
              <span className="text-lg text-foreground font-medium">Dark Mode</span>
              <Switch />
            </div>
          </div>
          {/* Notification Preferences */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Notifications</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg text-foreground">Email Notifications</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg text-foreground">SMS Notifications</span>
                <Switch />
              </div>
            </div>
          </div>
          {/* Delete Account */}
          <div className="pt-4 border-t border-border">
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

    toast({
      title: "Goals Saved",
      description: "Your wellness goals have been saved successfully.",
    });

    // Navigate to the next section or show results
    setCurrentSection('results');
  };
  const handleTakeAssessment = () => {
    navigate('/onboarding');
  };
  const handleAssessmentComplete = async (result: any) => {
    try {
      setUserProfile({
        prakritiResult: result,
        assessment_result_id: 'temp-id'
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
    // Remove assessment loading for simplified app
  }, [user]);
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-2xl text-foreground font-medium">Loading your wellness journey...</div>
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
                <Hero />
              </div>

              {/* Consolidated Problem/Solution Section */}
              <div id="why-choose-section" className="py-20 px-4 bg-secondary/50">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-foreground mb-6">Transform Your Wellness Journey</h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                      Feeling tired, stuck, or out of sync with your body and mind? NeoRishi combines 5000-year-old Ayurvedic wisdom with modern AI to create your personalized path to wellness.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <Card className="group bg-card/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Heart className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">Physical Wellness</h3>
                        <p className="text-muted-foreground">Overcome low energy, poor digestion, and weight struggles</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-card/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">Mental Clarity</h3>
                        <p className="text-muted-foreground">Find focus, reduce anxiety, and boost motivation</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-card/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">Spiritual Growth</h3>
                        <p className="text-muted-foreground">Discover your purpose and inner peace</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <Button onClick={() => scrollTo('features-section')} className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
                      Explore How It Works
                      <Compass className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Streamlined Features Section */}
              <div id="features-section" className="py-20 px-4 bg-background">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-foreground mb-6">Your Complete Wellness Toolkit</h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                      <Card className="group bg-card/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                            <Compass className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Constitution Assessment</h3>
                          <p className="text-muted-foreground text-sm">Discover your unique Ayurvedic body type</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-card/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Daily Routines</h3>
                        <p className="text-muted-foreground text-sm">Personalized schedules that fit your life</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-card/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                          <Utensils className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Nutrition Plans</h3>
                        <p className="text-muted-foreground text-sm">Tailored diet recommendations</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-card/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Meditation & Breathwork</h3>
                        <p className="text-muted-foreground text-sm">Guided practices for your constitution</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-card/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Adaptive Yoga</h3>
                        <p className="text-muted-foreground text-sm">Sequences tailored to your needs</p>
                      </CardContent>
                    </Card>

                    <Card className="group bg-card/80 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Progress Tracking</h3>
                        <p className="text-muted-foreground text-sm">Monitor your wellness journey</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Single, focused CTA */}
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-primary to-primary-glow rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
                      <h3 className="text-2xl font-bold text-primary-foreground mb-4">Ready to Begin?</h3>
                      <p className="text-primary-foreground/90 mb-6">Join thousands discovering their optimal wellness path</p>
                      <Button onClick={handleTakeAssessment} className="bg-background text-foreground hover:bg-secondary px-10 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
                        Start your journey
                        <Zap className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simplified About Section */}
              <div id="about-section" className="py-20 px-4 bg-secondary/30">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl font-bold text-foreground mb-8">About NeoRishi</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-12">
                    We combine 5000-year-old Ayurvedic wisdom with cutting-edge AI to make ancient wellness teachings accessible for modern life. Every recommendation is personalized to your unique constitution and goals.
                  </p>
                  
                  <div className="grid md:grid-cols-4 gap-8 bg-card rounded-2xl p-8 border">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">10,000+</div>
                      <div className="text-muted-foreground">Happy Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">4.9/5</div>
                      <div className="text-muted-foreground">User Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">50+</div>
                      <div className="text-muted-foreground">Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">99%</div>
                      <div className="text-muted-foreground">Success Rate</div>
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
            <div className="pt-16 min-h-screen bg-background">
              <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="text-center mb-12">
                  <h1 className="text-5xl font-extrabold text-foreground mb-3 tracking-tight drop-shadow-lg">Your Personalized Wellness Plan</h1>
                  <p className="text-xl text-muted-foreground font-medium mb-2">Based on your assessment and goals</p>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto mb-4 rounded-full"></div>
                </div>

                {/* Prakriti Results */}
                <Card className="mb-10 shadow-xl border bg-card">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <span className="inline-block w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center"><span className="text-primary-foreground text-2xl">🧬</span></span>
                      Your Body-Mind Type
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-secondary rounded-xl p-6 flex flex-col items-center shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground mb-2 uppercase tracking-wide">Current State</h3>
                        <span className="inline-block text-3xl font-extrabold text-primary bg-primary/10 px-6 py-2 rounded-full mb-2 shadow-md border border-primary/20">
                          {userProfile?.prakritiResult?.dominantDosha || userProfile?.prakritiResult?.dominant}
                        </span>
                        <p className="text-sm text-muted-foreground">Your most prominent dosha at this time</p>
                      </div>
                      <div className="bg-accent rounded-xl p-6 flex flex-col items-center shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground mb-2 uppercase tracking-wide">Natural Constitution</h3>
                        <span className="inline-block text-3xl font-extrabold text-primary bg-primary/10 px-6 py-2 rounded-full mb-2 shadow-md border border-primary/20">
                          {userProfile?.prakritiResult?.constitution || userProfile?.prakritiResult?.constitutionType}
                        </span>
                        <p className="text-sm text-muted-foreground">Your balanced state of being</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><span className="text-xl">📊</span> Dosha Scores</h3>
                      <div className="grid grid-cols-3 gap-6">
                        {(Object.entries(userProfile?.prakritiResult?.scores || {}) as [string, number][]).map(([dosha, score]) => (
                          <div key={dosha} className="text-center bg-background rounded-lg p-4 shadow border">
                            <div className="text-2xl font-bold text-primary mb-1">{score}</div>
                            <div className="text-base font-semibold text-muted-foreground capitalize">{dosha}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Goals Summary */}
                <Card className="mb-10 shadow-xl border bg-card">
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
                <Card className="mb-10 shadow-xl border bg-card">
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
            <Button onClick={handleTakeAssessment} className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group">
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
