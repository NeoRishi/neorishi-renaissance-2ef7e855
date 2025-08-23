import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div key={step} className="flex flex-col items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step <= currentStep
                  ? 'bg-gradient-to-r from-primary to-primary-glow border-primary text-primary-foreground shadow-elegant'
                  : 'border-muted-foreground/30 text-muted-foreground'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: step === currentStep ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {step < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step}</span>
              )}
            </motion.div>
            
            <motion.span
              className={`text-xs mt-2 transition-colors duration-300 ${
                step <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {step === totalSteps ? 'Details' : `Q${step}`}
            </motion.span>
          </div>
        ))}
      </div>
      
      {/* Progress Text */}
      <motion.div
        className="text-center mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps} - {currentStep === totalSteps ? 'Final Details' : 'Questionnaire'}
        </span>
      </motion.div>
    </div>
  );
};