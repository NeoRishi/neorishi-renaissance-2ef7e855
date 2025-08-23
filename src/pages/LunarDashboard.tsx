import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Moon, 
  Sun, 
  Stars, 
  Leaf, 
  Calendar, 
  Target, 
  Heart, 
  TrendingUp,
  Sparkles,
  Clock
} from 'lucide-react';
import { OnboardingResponses, UserDetails, onboardingQuestions } from '@/data/onboardingQuestions';

const LunarDashboard = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingResponses>({});
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    // Load data from localStorage (temporary until auth is implemented)
    const savedResponses = localStorage.getItem('onboarding_responses');
    const savedDetails = localStorage.getItem('user_details');
    
    if (savedResponses) {
      setOnboardingData(JSON.parse(savedResponses));
    }
    
    if (savedDetails) {
      setUserDetails(JSON.parse(savedDetails));
    }
  }, []);

  const getAnswerText = (questionId: number, answerId: string) => {
    const question = onboardingQuestions.find(q => q.id === questionId);
    const option = question?.options.find(o => o.id === answerId);
    return option?.text || answerId;
  };

  const getPrimaryGoal = () => {
    const goalAnswer = onboardingData[2]; // Question 2: priority goal
    return goalAnswer?.[0] ? getAnswerText(2, goalAnswer[0]) : "Personal wellness";
  };

  const getTopIssues = () => {
    const issues = onboardingData[1] || []; // Question 1: top issues
    return issues.slice(0, 3).map(issue => getAnswerText(1, issue));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900/20 to-background">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(253,186,116,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.08),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Welcome{userDetails?.fullName ? `, ${userDetails.fullName.split(' ')[0]}` : ''} 🌙
              </h1>
              <p className="text-lg text-muted-foreground">
                Your personalized lunar wellness journey begins now
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-primary-glow/20 text-primary border-primary/30">
                <Moon className="w-3 h-3 mr-1" />
                New Moon Phase
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Primary Focus */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Goal Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-elegant bg-gradient-to-br from-primary/5 to-primary-glow/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary-foreground" />
                    </div>
                    Your 30-Day Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {getPrimaryGoal()}
                  </h3>
                  <div className="flex items-center gap-4">
                    <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90">
                      <Sparkles className="w-4 h-4 mr-2" />
                      View Personalized Plan
                    </Button>
                    <Button variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Track Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Issues to Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-elegant bg-gradient-to-br from-background/95 to-background backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    Areas We're Addressing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getTopIssues().map((issue, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl border border-muted/50 bg-muted/20 hover:bg-muted/30 transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground">{issue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-elegant bg-gradient-to-br from-background/95 to-background backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Sun className="w-5 h-5 text-orange-500" />
                    Today's Wellness Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-muted/50 bg-muted/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Leaf className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Morning Ritual</p>
                          <p className="text-sm text-muted-foreground">Meditation + Pranayama</p>
                        </div>
                      </div>
                      <Badge variant="outline">15 min</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-muted/50 bg-muted/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Mindful Break</p>
                          <p className="text-sm text-muted-foreground">3 PM Energy Reset</p>
                        </div>
                      </div>
                      <Badge variant="outline">5 min</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-muted/50 bg-muted/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Moon className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Evening Wind-down</p>
                          <p className="text-sm text-muted-foreground">Journaling + Herbal tea</p>
                        </div>
                      </div>
                      <Badge variant="outline">10 min</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Lunar Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-elegant bg-gradient-to-br from-background/95 to-background backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stars className="w-5 h-5 text-primary" />
                    Lunar Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <Moon className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="font-semibold mb-2">New Moon</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Perfect time for new beginnings and setting intentions
                    </p>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      Day 1 of 28
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Personalization Summary */}
            {userDetails && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-elegant bg-gradient-to-br from-background/95 to-background backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Your Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p className="text-sm">{userDetails.fullName}</p>
                      </div>
                      
                      {userDetails.dateOfBirth && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
                          <p className="text-sm">{new Date(userDetails.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      )}
                      
                      {userDetails.birthPlace && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Birth Place</p>
                          <p className="text-sm">{userDetails.birthPlace}</p>
                        </div>
                      )}
                      
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        Complete Astrological Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-elegant bg-gradient-to-br from-background/95 to-background backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Full Calendar
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      Update Goals
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Heart className="w-4 h-4 mr-2" />
                      Health Tracker
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Stars className="w-4 h-4 mr-2" />
                      Astro Insights
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LunarDashboard;