
interface AssessmentProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

export const AssessmentProgressBar = ({ currentQuestion, totalQuestions }: AssessmentProgressBarProps) => {
  // Show 0% before the user selects the first option.
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <>
      <div className="w-full bg-amber-200 rounded-full h-3 mt-6">
        <div 
          className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-sm text-amber-600 mt-2">
        Question {currentQuestion + 1} of {totalQuestions}
      </div>
    </>
  );
};
