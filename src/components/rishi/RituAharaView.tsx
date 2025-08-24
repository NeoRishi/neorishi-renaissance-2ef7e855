import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Leaf, AlertTriangle, Lock, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getCurrentRitu, 
  getSeasonalDiet, 
  getPrakritiTips, 
  getQuizQuestions, 
  calculatePrakritiResult, 
  savePrakritiResult, 
  getSavedPrakriti 
} from '@/services/panchangaService';

interface PrakritiQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrakritiQuizModal: React.FC<PrakritiQuizModalProps> = ({ isOpen, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();
  
  const questions = getQuizQuestions();
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (optionId: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: optionId };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate result
      const prakriti = calculatePrakritiResult(newAnswers);
      setResult(prakriti);
      savePrakritiResult(prakriti);
      setShowResult(true);
      
      toast({
        title: "Prakriti Assessment Complete!",
        description: `Your primary constitution is ${prakriti.charAt(0).toUpperCase() + prakriti.slice(1)}. Scroll down to see personalized tips.`,
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult('');
  };

  const handleClose = () => {
    onClose();
    // Reset after a delay to avoid flash
    setTimeout(resetQuiz, 300);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-tulsi-green" />
            Prakriti Assessment
          </DialogTitle>
          <DialogDescription>
            Discover your Ayurvedic constitution for personalized guidance
          </DialogDescription>
        </DialogHeader>

        {!showResult ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {questions[currentQuestion]?.prompt}
              </h3>
              
              <div className="space-y-3">
                {questions[currentQuestion]?.options.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.id)}
                    className="w-full p-4 text-left border rounded-xl hover:border-primary transition-colors"
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-tulsi-green/20 rounded-full flex items-center justify-center">
                <Leaf className="w-10 h-10 text-tulsi-green" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold capitalize mb-2">
                  Your Prakriti: {result}
                </h3>
                <p className="text-muted-foreground">
                  Your personalized diet tips are now available below
                </p>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button onClick={resetQuiz} variant="outline">
                  Retake Quiz
                </Button>
                <Button onClick={handleClose}>
                  View My Tips
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface PrakritiSliderProps {
  dosha: 'vata' | 'pitta' | 'kapha';
  tips: Array<{ id: string; tip: string; tags?: string[] }>;
}

const PrakritiSlider: React.FC<PrakritiSliderProps> = ({ dosha, tips }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const savedPrakriti = getSavedPrakriti();
  const isUserDosha = savedPrakriti === dosha;

  const doshaConfig = {
    vata: { color: 'text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20', emoji: '💨' },
    pitta: { color: 'text-red-400', bg: 'bg-red-50 dark:bg-red-950/20', emoji: '🔥' },
    kapha: { color: 'text-green-400', bg: 'bg-green-50 dark:bg-green-950/20', emoji: '🌍' }
  };

  const config = doshaConfig[dosha];

  const nextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <Card className={`${config.bg} ${isUserDosha ? 'ring-2 ring-tulsi-green' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 capitalize">
            <span className="text-2xl">{config.emoji}</span>
            {dosha}
            {isUserDosha && (
              <Badge variant="secondary" className="bg-tulsi-green/20 text-tulsi-green">
                Your Type
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevTip}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-12 text-center">
              {currentIndex + 1}/{tips.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextTip}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-2"
        >
          <p className="font-medium">{tips[currentIndex]?.tip}</p>
          {tips[currentIndex]?.tags && (
            <div className="flex gap-1 flex-wrap">
              {tips[currentIndex].tags!.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

const RituAharaView: React.FC = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const { toast } = useToast();
  
  const currentRitu = getCurrentRitu();
  const seasonalDiet = getSeasonalDiet(currentRitu);
  const prakritiTips = getPrakritiTips();
  const savedPrakriti = getSavedPrakriti();

  const handleNotifyMe = () => {
    toast({
      title: "Coming Soon!",
      description: "We'll notify you when personalized meal plans are available.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          Ritu-Āhāra — Seasonal Diet
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Current Season: <span className="font-semibold text-kesari-saffron">{currentRitu}</span>
          <br />
          Align your diet with nature's wisdom for optimal health and vitality.
        </p>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
      >
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">General guidance, not medical advice.</span>
        </div>
      </motion.div>

      {/* Personalized Banner for Existing Users */}
      {savedPrakriti && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-tulsi-green/10 border-tulsi-green/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-tulsi-green/20 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-tulsi-green" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-tulsi-green">
                    Focus Tips for Your Prakriti ({savedPrakriti.charAt(0).toUpperCase() + savedPrakriti.slice(1)})
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    See personalized tips in the sliders below
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Seasonal Diet Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Favor Foods */}
        <Card className="border-tulsi-green/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-tulsi-green">
              <Leaf className="w-5 h-5" />
              Best Foods This Season
            </CardTitle>
            <CardDescription>
              Foods that align with {currentRitu} energy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {seasonalDiet.favor.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                {item.icon && <span className="text-2xl">{item.icon}</span>}
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  {item.rationale && (
                    <p className="text-xs text-muted-foreground">{item.rationale}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Avoid Foods */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Foods to Avoid
            </CardTitle>
            <CardDescription>
              Foods that may disrupt {currentRitu} balance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {seasonalDiet.avoid.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                {item.icon && <span className="text-2xl">{item.icon}</span>}
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  {item.rationale && (
                    <p className="text-xs text-muted-foreground">{item.rationale}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Prakriti Tips Sliders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            Constitutional Diet Tips
          </h2>
          <p className="text-muted-foreground">
            Swipe through personalized guidance for each Ayurvedic constitution
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <PrakritiSlider dosha="vata" tips={prakritiTips.vata} />
          <PrakritiSlider dosha="pitta" tips={prakritiTips.pitta} />
          <PrakritiSlider dosha="kapha" tips={prakritiTips.kapha} />
        </div>
      </motion.div>

      {/* Prakriti Quiz CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-kesari-saffron/10 to-surya-gold/10 border-kesari-saffron/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">
                Do you know your Prakriti?
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Take our quick assessment to discover your Ayurvedic constitution and unlock personalized diet guidance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!savedPrakriti ? (
                  <Button
                    onClick={() => setIsQuizOpen(true)}
                    className="bg-kesari-saffron hover:bg-kesari-saffron/90 text-white"
                  >
                    Take Prakriti Quiz
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setIsQuizOpen(true)}
                      variant="outline"
                    >
                      Retake Quiz
                    </Button>
                    <Button
                      className="bg-kesari-saffron hover:bg-kesari-saffron/90 text-white"
                    >
                      Your Type: {savedPrakriti.charAt(0).toUpperCase() + savedPrakriti.slice(1)}
                    </Button>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                This is your gateway to personalized nutrition and paid features.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium Features Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <Card className="opacity-60">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Personalized Meal Plans</h3>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Get weekly meal plans tailored to your Prakriti and current season.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNotifyMe}
              className="w-full"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notify Me
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recipe Recommendations</h3>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Access hundreds of Ayurvedic recipes matched to your constitution.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNotifyMe}
              className="w-full"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notify Me
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <PrakritiQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
};

export default RituAharaView;