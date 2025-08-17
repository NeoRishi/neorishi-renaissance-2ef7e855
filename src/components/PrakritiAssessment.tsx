import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { prakritiQuestions } from "@/utils/prakritiQuestions";
import { AssessmentProgressBar } from "@/components/AssessmentProgressBar";
import { calculatePrakritiResult } from "@/utils/prakritiCalculator";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PrakritiResult } from "@/types/prakriti";

interface PrakritiAssessmentProps {
  onComplete: (result: PrakritiResult) => void;
  onBack: () => void;
}

export function PrakritiAssessment({ onComplete, onBack }: PrakritiAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    if (currentQuestion >= 0) {
      const questionId = prakritiQuestions[currentQuestion].id;
      setSelectedValue(answers[questionId] || "");
    }
  }, [currentQuestion, answers]);

  const handleOptionClick = (value: string) => {
    const questionId = prakritiQuestions[currentQuestion].id;
    setSelectedValue(value);
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value };
      return newAnswers;
    });
    // Auto-advance unless last question
    if (currentQuestion === prakritiQuestions.length - 1) {
      const result = calculatePrakritiResult({ ...answers, [questionId]: value });
      onComplete({
        ...result,
        scores: { vata: result.vata, pitta: result.pitta, kapha: result.kapha },
        answers: { ...answers, [questionId]: value },
        totalQuestions: Object.keys({ ...answers, [questionId]: value }).length
      });
    } else {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 200); // slight delay for UI feedback
    }
  };

  const startAssessment = () => {
    setCurrentQuestion(0);
    setSelectedValue("");
    setAnswers({});
  };

  const handleNext = () => {
    if (currentQuestion === prakritiQuestions.length - 1) {
      const result = calculatePrakritiResult(answers);
      onComplete({
        ...result,
        scores: { vata: result.vata, pitta: result.pitta, kapha: result.kapha },
        answers: answers,
        totalQuestions: Object.keys(answers).length
      });
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (currentQuestion === -1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="absolute top-8 left-8 text-amber-700 hover:text-amber-800"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-amber-800 mb-4">Personalization Assessment</h1>
            <p className="text-amber-700">Discover your unique body-mind type through detailed Ayurvedic analysis</p>
          </div>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <p className="text-amber-700">
                  This assessment will help you identify your dominant Dosha(s)—Vata, Pitta, and Kapha—which form your unique, lifelong constitution known as Prakriti. Understanding your Prakriti is the first step toward personalized well-being.
                </p>
                <h3 className="text-xl font-semibold text-amber-800">An Important Note Before You Begin</h3>
                <p className="text-amber-700">
                  For an accurate result, please answer based on what has been <strong>most consistently true for you throughout your entire life</strong>, not just your current state. Think about your natural tendencies from childhood and early adulthood. The goal is to identify your innate nature (<em>Prakriti</em>), not a temporary imbalance (<em>Vikriti</em>).
                </p>
              </div>
              <div className="flex justify-center mt-8">
                <Button onClick={startAssessment} className="w-full">
                  Begin Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = prakritiQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AssessmentProgressBar 
          currentQuestion={currentQuestion} 
          totalQuestions={prakritiQuestions.length} 
        />
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-amber-800 text-center mb-8">
              {question.question}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {Object.entries(question.options).map(([value, text]) => (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    "p-6 border rounded-lg shadow-sm text-left transition-all focus:outline-none",
                    selectedValue === value
                      ? "bg-amber-200 border-amber-500 ring-2 ring-amber-400"
                      : "bg-white border-amber-100 hover:bg-amber-50"
                  )}
                  onClick={() => handleOptionClick(value)}
                  aria-pressed={selectedValue === value}
                >
                  <span className="block text-amber-800">{text}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="text-amber-700 border-amber-200 hover:bg-amber-50"
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedValue}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
              >
                {currentQuestion === prakritiQuestions.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
