import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PrakritiQuestion } from "@/utils/prakritiQuestions";

interface QuestionCardProps {
  question: PrakritiQuestion;
  selectedAnswer: string;
  onAnswerChange: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoBack: boolean;
  isLastQuestion: boolean;
}

export const QuestionCard = ({
  question,
  selectedAnswer,
  onAnswerChange,
  onPrevious,
  onNext,
  canGoBack,
  isLastQuestion
}: QuestionCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
            {question.category}
          </span>
        </div>
        <CardTitle className="text-xl text-amber-800 leading-relaxed mt-4">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedAnswer} 
          onValueChange={onAnswerChange}
          className="space-y-4"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border border-amber-100 hover:bg-amber-50 transition-colors">
              <RadioGroupItem value={option.value} id={`option-${index}`} className="mt-1" />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                <div className="text-amber-700 leading-relaxed">{option.text}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoBack}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            Previous
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!selectedAnswer}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
          >
            {isLastQuestion ? 'Get My Results' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
