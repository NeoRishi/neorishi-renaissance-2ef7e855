import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Heart, Target, Clock, Smile, Frown, Meh } from "lucide-react";

interface GoalsQuestionnaireProps {
  prakritiResult: any;
  onComplete: (goalsData: any) => void;
  onBack: () => void;
}

export const goalCategories = [
  { id: 'weight_loss', label: 'Weight Management', emoji: '⚖️', color: 'bg-blue-100 text-blue-800' },
  { id: 'energy', label: 'Boost Energy', emoji: '⚡', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'stress', label: 'Reduce Stress', emoji: '🧘', color: 'bg-purple-100 text-purple-800' },
  { id: 'fitness', label: 'Build Strength', emoji: '💪', color: 'bg-red-100 text-red-800' },
  { id: 'sleep', label: 'Better Sleep', emoji: '😴', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'digestion', label: 'Improve Digestion', emoji: '🌱', color: 'bg-green-100 text-green-800' }
];

export const foodPreferences = [
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { id: 'vegan', label: 'Vegan', emoji: '🌿' },
  { id: 'satvik', label: 'Satvik Foods', emoji: '🕉️' },
  { id: 'spicy', label: 'Spicy Food', emoji: '🌶️' },
  { id: 'sweet', label: 'Sweet Treats', emoji: '🍯' },
  { id: 'raw', label: 'Raw Foods', emoji: '🥗' }
];

export const activityLevels = [
  { id: 'beginner', label: 'Beginner', description: 'New to exercise', intensity: 1 },
  { id: 'moderate', label: 'Moderate', description: '2-3 times per week', intensity: 2 },
  { id: 'active', label: 'Active', description: '4-5 times per week', intensity: 3 },
  { id: 'athlete', label: 'Athlete', description: 'Daily training', intensity: 4 }
];

const timeAvailability = [
  { id: '15min', label: '15 minutes', value: 15 },
  { id: '30min', label: '30 minutes', value: 30 },
  { id: '45min', label: '45 minutes', value: 45 },
  { id: '60min', label: '1 hour', value: 60 },
  { id: '90min', label: '1.5 hours', value: 90 }
];

export const GoalsQuestionnaire = ({ prakritiResult, onComplete, onBack }: GoalsQuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({
    goals: [] as string[],
    foodPreferences: [] as string[],
    activityLevel: '',
    timeAvailable: 0,
    stressLevel: 0,
    sleepQuality: 0,
    energyLevel: 0,
    challenges: [] as string[]
  });

  const steps = [
    { title: "Your Goals", subtitle: "What would you like to achieve?" },
    { title: "Food Preferences", subtitle: "What foods resonate with you?" },
    { title: "Activity Level", subtitle: "How active are you currently?" },
    { title: "Time Commitment", subtitle: "How much time can you dedicate daily?" },
    { title: "Current State", subtitle: "Rate your current well-being" },
    { title: "Challenges", subtitle: "What obstacles do you face?" }
  ];

  const toggleSelection = (category: 'goals' | 'foodPreferences' | 'challenges', value: string) => {
    setResponses(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item: string) => item !== value)
        : [...prev[category], value]
    }));
  };

  const setRating = (category: string, value: number) => {
    setResponses(prev => ({ ...prev, [category]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete({ prakritiResult, ...responses });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Goals
        return (
          <div className="grid grid-cols-2 gap-4">
            {goalCategories.map(goal => (
              <Card 
                key={goal.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  responses.goals.includes(goal.id) ? 'ring-2 ring-amber-400 bg-amber-50' : 'hover:shadow-md'
                }`}
                onClick={() => toggleSelection('goals', goal.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{goal.emoji}</div>
                  <Badge className={goal.color}>{goal.label}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 1: // Food Preferences
        return (
          <div className="grid grid-cols-3 gap-4">
            {foodPreferences.map(food => (
              <Card 
                key={food.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  responses.foodPreferences.includes(food.id) ? 'ring-2 ring-amber-400 bg-amber-50' : 'hover:shadow-md'
                }`}
                onClick={() => toggleSelection('foodPreferences', food.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{food.emoji}</div>
                  <div className="text-sm font-medium text-amber-800">{food.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 2: // Activity Level
        return (
          <div className="space-y-4">
            {activityLevels.map(level => (
              <Card 
                key={level.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  responses.activityLevel === level.id ? 'ring-2 ring-amber-400 bg-amber-50' : 'hover:shadow-md'
                }`}
                onClick={() => setResponses(prev => ({ ...prev, activityLevel: level.id }))}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-amber-800">{level.label}</div>
                    <div className="text-sm text-amber-600">{level.description}</div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < level.intensity ? 'bg-amber-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 3: // Time Commitment
        return (
          <div className="grid grid-cols-1 gap-4">
            {timeAvailability.map(time => (
              <Card 
                key={time.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  responses.timeAvailable === time.value ? 'ring-2 ring-amber-400 bg-amber-50' : 'hover:shadow-md'
                }`}
                onClick={() => setResponses(prev => ({ ...prev, timeAvailable: time.value }))}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-amber-600" />
                    <span className="font-medium text-amber-800">{time.label}</span>
                  </div>
                  <div className="text-amber-600">per day</div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 4: // Current State Ratings
        const ratings = [
          { key: 'stressLevel', label: 'Stress Level', lowLabel: 'Very Calm', highLabel: 'Very Stressed' },
          { key: 'sleepQuality', label: 'Sleep Quality', lowLabel: 'Poor Sleep', highLabel: 'Great Sleep' },
          { key: 'energyLevel', label: 'Energy Level', lowLabel: 'Always Tired', highLabel: 'Very Energetic' }
        ];

        return (
          <div className="space-y-8">
            {ratings.map(rating => (
              <div key={rating.key} className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-800">{rating.label}</h3>
                <div className="flex items-center justify-between text-sm text-amber-600 mb-2">
                  <span>{rating.lowLabel}</span>
                  <span>{rating.highLabel}</span>
                </div>
                <div className="flex space-x-2 justify-center">
                  {[1, 2, 3, 4, 5].map(value => {
                    const IconComponent = value <= 2 ? Frown : value <= 3 ? Meh : Smile;
                    return (
                      <button
                        key={value}
                        onClick={() => setRating(rating.key, value)}
                        className={`p-3 rounded-full transition-all duration-200 hover:scale-110 ${
                          responses[rating.key as keyof typeof responses] === value
                            ? 'bg-amber-500 text-white shadow-lg'
                            : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );

      case 5: // Challenges
        const challenges = [
          { id: 'time', label: 'Lack of Time', emoji: '⏰' },
          { id: 'motivation', label: 'Low Motivation', emoji: '😔' },
          { id: 'consistency', label: 'Being Consistent', emoji: '📅' },
          { id: 'knowledge', label: 'Not Knowing What to Do', emoji: '❓' },
          { id: 'social', label: 'Social Pressure', emoji: '👥' },
          { id: 'cravings', label: 'Food Cravings', emoji: '🍕' }
        ];

        return (
          <div className="grid grid-cols-2 gap-4">
            {challenges.map(challenge => (
              <Card 
                key={challenge.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  responses.challenges.includes(challenge.id) ? 'ring-2 ring-amber-400 bg-amber-50' : 'hover:shadow-md'
                }`}
                onClick={() => toggleSelection('challenges', challenge.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{challenge.emoji}</div>
                  <div className="text-sm font-medium text-amber-800">{challenge.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="absolute top-8 left-8 text-amber-700 hover:text-amber-800"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-4xl font-bold text-amber-800 mb-2">Tell Us About Yourself</h1>
          <p className="text-amber-700 mb-6">Help us create your perfect wellness plan</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-amber-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-amber-600">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Content Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-amber-800 flex items-center justify-center space-x-2">
              <Target className="w-6 h-6" />
              <span>{steps[currentStep].title}</span>
            </CardTitle>
            <p className="text-amber-600">{steps[currentStep].subtitle}</p>
          </CardHeader>
          <CardContent>
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Previous
              </Button>
              
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
              >
                {currentStep === steps.length - 1 ? 'Show Results' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
