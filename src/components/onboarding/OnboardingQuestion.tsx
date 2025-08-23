import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OnboardingQuestion as QuestionType } from '@/data/onboardingQuestions';

interface OnboardingQuestionProps {
  question: QuestionType;
  selectedAnswers: string[];
  onAnswerChange: (answers: string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoBack: boolean;
  isLastQuestion: boolean;
}

export const OnboardingQuestion = ({
  question,
  selectedAnswers,
  onAnswerChange,
  onNext,
  onPrevious,
  canGoBack,
  isLastQuestion
}: OnboardingQuestionProps) => {
  const handleSingleSelect = (value: string) => {
    onAnswerChange([value]);
  };

  const handleMultiSelect = (optionId: string, checked: boolean) => {
    let newAnswers = [...selectedAnswers];
    
    if (checked) {
      if (question.maxSelections && newAnswers.length >= question.maxSelections) {
        return; // Don't allow more selections than max
      }
      newAnswers.push(optionId);
    } else {
      newAnswers = newAnswers.filter(id => id !== optionId);
    }
    
    onAnswerChange(newAnswers);
  };

  const canProceed = selectedAnswers.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-0 shadow-elegant bg-gradient-to-br from-background/95 to-background backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
            {question.question}
          </CardTitle>
          {question.type === 'multi' && question.maxSelections && (
            <p className="text-sm text-muted-foreground mt-2">
              Select up to {question.maxSelections} option{question.maxSelections > 1 ? 's' : ''}
              {selectedAnswers.length > 0 && (
                <span className="ml-2 text-primary font-medium">
                  ({selectedAnswers.length}/{question.maxSelections} selected)
                </span>
              )}
            </p>
          )}
          {question.type === 'multi' && !question.maxSelections && (
            <p className="text-sm text-muted-foreground mt-2">
              Select all that apply
            </p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {question.type === 'single' ? (
              <RadioGroup
                value={selectedAnswers[0] || ''}
                onValueChange={handleSingleSelect}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-4 rounded-xl border border-muted/50 hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 cursor-pointer"
                    onClick={() => handleSingleSelect(option.id)}
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 text-sm cursor-pointer">
                      {option.text}
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-4 rounded-xl border border-muted/50 hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 cursor-pointer"
                    onClick={() => handleMultiSelect(option.id, !selectedAnswers.includes(option.id))}
                  >
                    <Checkbox
                      id={option.id}
                      checked={selectedAnswers.includes(option.id)}
                      onCheckedChange={(checked) => handleMultiSelect(option.id, !!checked)}
                    />
                    <Label htmlFor={option.id} className="flex-1 text-sm cursor-pointer">
                      {option.text}
                    </Label>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!canGoBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 shadow-elegant"
            >
              {isLastQuestion ? 'Continue to Details' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};