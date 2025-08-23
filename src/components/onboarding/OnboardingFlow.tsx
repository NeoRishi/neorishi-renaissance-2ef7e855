import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingQuestion } from './OnboardingQuestion';
import { UserDetailsForm } from './UserDetailsForm';
import { onboardingQuestions, OnboardingResponses, UserDetails } from '@/data/onboardingQuestions';
import { supabase } from '@/integrations/supabase/client';

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [responses, setResponses] = useState<OnboardingResponses>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const totalSteps = onboardingQuestions.length + 1; // +1 for user details form
  const currentQuestion = onboardingQuestions.find(q => q.id === currentStep);
  
  const handleAnswerChange = (questionId: number, answers: string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answers
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleUserDetailsSubmit = async (userDetails: UserDetails) => {
    setIsSubmitting(true);
    
    try {
      // For now, we'll store this locally since authentication isn't implemented
      // Once auth is added, we'll save to Supabase with the user's ID
      
      // Save onboarding responses to localStorage for now
      localStorage.setItem('onboarding_responses', JSON.stringify(responses));
      localStorage.setItem('user_details', JSON.stringify(userDetails));
      
      toast({
        title: "Welcome to NeoRishi! 🌟",
        description: "Your personalized journey is being prepared. Redirecting to your dashboard...",
      });
      
      // Simulate processing time
      setTimeout(() => {
        navigate('/lunar-dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900/20 to-background">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(253,186,116,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.08),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent mb-4">
            Welcome to Your NeoRishi Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's personalize your experience with a few questions to understand your unique needs and goals.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

        {/* Question or User Details Form */}
        <AnimatePresence mode="wait">
          {currentStep <= onboardingQuestions.length && currentQuestion ? (
            <OnboardingQuestion
              key={currentStep}
              question={currentQuestion}
              selectedAnswers={responses[currentStep] || []}
              onAnswerChange={(answers) => handleAnswerChange(currentStep, answers)}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoBack={currentStep > 1}
              isLastQuestion={currentStep === onboardingQuestions.length}
            />
          ) : (
            <UserDetailsForm
              key="user-details"
              onSubmit={handleUserDetailsSubmit}
              onPrevious={handlePrevious}
              isLoading={isSubmitting}
            />
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            Your responses help us create a personalized wellness journey based on ancient Ayurvedic principles.
          </p>
        </motion.div>
      </div>
    </div>
  );
};