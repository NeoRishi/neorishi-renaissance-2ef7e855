
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Activity } from "lucide-react";

interface PrakritiResult {
  dominant: string;
  scores: {
    vata: number;
    pitta: number;
    kapha: number;
  };
}

interface PersonalizedPlanProps {
  prakritiResult: PrakritiResult;
  onBack: () => void;
  onRestart: () => void;
}

const doshaInfo = {
  vata: {
    name: "Vata",
    element: "Air & Space",
    qualities: "Light, Cold, Dry, Mobile, Subtle",
    color: "from-blue-500 to-purple-600",
    description: "You are naturally creative, energetic, and quick-thinking. Your constitution benefits from grounding, warming, and nourishing practices."
  },
  pitta: {
    name: "Pitta", 
    element: "Fire & Water",
    qualities: "Hot, Sharp, Light, Oily, Liquid",
    color: "from-red-500 to-orange-600",
    description: "You have a strong metabolism, sharp intellect, and natural leadership qualities. Balance comes through cooling and calming practices."
  },
  kapha: {
    name: "Kapha",
    element: "Earth & Water", 
    qualities: "Heavy, Cold, Moist, Stable, Dense",
    color: "from-green-500 to-blue-500",
    description: "You possess natural strength, stability, and compassion. Energizing and stimulating practices help maintain your optimal balance."
  }
};

const dietPlans = {
  vata: {
    favor: ["Warm, cooked foods", "Sweet, sour, salty tastes", "Ghee, oils, and healthy fats", "Root vegetables", "Warm spices (ginger, cinnamon)", "Warm milk with turmeric"],
    avoid: ["Cold, raw foods", "Excessive bitter, pungent tastes", "Dry, light foods", "Too much caffeine", "Irregular meal times"],
    timing: "Regular meals at consistent times. Largest meal at lunch."
  },
  pitta: {
    favor: ["Cool, fresh foods", "Sweet, bitter, astringent tastes", "Cooling spices (coriander, fennel)", "Leafy greens", "Coconut water", "Fresh fruits"],
    avoid: ["Spicy, hot foods", "Excessive sour, salty tastes", "Alcohol", "Fried foods", "Eating when angry"],
    timing: "Never skip meals. Moderate portions. Cool down before eating."
  },
  kapha: {
    favor: ["Light, warm foods", "Pungent, bitter, astringent tastes", "Stimulating spices (black pepper, ginger)", "Steamed vegetables", "Herbal teas", "Light proteins"],
    avoid: ["Heavy, oily foods", "Excessive sweet, sour, salty", "Dairy products", "Cold drinks", "Overeating"],
    timing: "Light breakfast, substantial lunch, light dinner before 7 PM."
  }
};

const yogaRoutines = {
  vata: {
    morning: ["Sun Salutation (slow)", "Standing poses for grounding", "Hip openers", "Gentle backbends"],
    evening: ["Restorative poses", "Forward folds", "Legs up the wall", "Yoga Nidra"],
    pranayama: "Nadi Shodhana (alternate nostril breathing)"
  },
  pitta: {
    morning: ["Moon Salutation", "Cooling forward folds", "Twists", "Heart opening poses"],
    evening: ["Gentle inversions", "Supported fish pose", "Child's pose", "Cooling pranayama"],
    pranayama: "Sheetali (cooling breath) and Bhramari"
  },
  kapha: {
    morning: ["Dynamic Sun Salutations", "Standing poses with holds", "Backbends", "Vigorous vinyasa"],
    evening: ["Inversions", "Arm balances", "Core strengthening", "Energizing breathwork"],
    pranayama: "Kapalabhati (skull shining breath) and Bhastrika"
  }
};

const dinacharya = {
  vata: {
    "5:30 AM": "Wake up, drink warm water with ginger",
    "6:00 AM": "Oil massage (Abhyanga) with sesame oil",
    "6:30 AM": "Gentle yoga and meditation",
    "8:00 AM": "Warm, nourishing breakfast",
    "12:00 PM": "Largest meal of the day",
    "6:00 PM": "Light, warm dinner",
    "9:00 PM": "Calming evening routine",
    "10:00 PM": "Sleep (consistent timing crucial)"
  },
  pitta: {
    "6:00 AM": "Wake up, drink cool water",
    "6:30 AM": "Coconut oil massage",
    "7:00 AM": "Moderate yoga practice",
    "8:30 AM": "Fresh, cooling breakfast",
    "12:30 PM": "Substantial lunch (avoid peak sun)",
    "7:00 PM": "Light, cooling dinner",
    "9:30 PM": "Reading or gentle activities",
    "10:30 PM": "Sleep in cool environment"
  },
  kapha: {
    "5:00 AM": "Early wake up, no snoozing",
    "5:30 AM": "Vigorous dry brushing",
    "6:00 AM": "Energetic yoga and cardio",
    "8:00 AM": "Light breakfast (or skip if not hungry)",
    "12:00 PM": "Main meal of the day",
    "6:00 PM": "Very light dinner",
    "8:30 PM": "Active evening activities",
    "10:00 PM": "Sleep (avoid oversleeping)"
  }
};

export const PersonalizedPlan = ({ prakritiResult, onBack, onRestart }: PersonalizedPlanProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const dosha = prakritiResult.dominant;
  const info = doshaInfo[dosha as keyof typeof doshaInfo];

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
            Back to Assessment
          </Button>
          
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Your Personalized Plan</h1>
          <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${info.color} text-white shadow-lg`}>
            <Activity className="w-6 h-6 mr-2" />
            <span className="text-xl font-semibold">Primary Dosha: {info.name}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 border border-orange-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="diet" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">Diet Plan</TabsTrigger>
            <TabsTrigger value="yoga" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">Yoga & Exercise</TabsTrigger>
            <TabsTrigger value="routine" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">Daily Routine</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-800">Your Prakriti: {info.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">Constitutional Overview</h3>
                  <p className="text-amber-700 leading-relaxed">{info.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Governing Elements</h4>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">{info.element}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Key Qualities</h4>
                    <p className="text-amber-700">{info.qualities}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-3">Assessment Results</h3>
                  <div className="flex space-x-4">
                    {Object.entries(prakritiResult.scores).map(([dosha, score]) => (
                      <div key={dosha} className="text-center">
                        <div className="text-2xl font-bold text-amber-800">{score}</div>
                        <div className="text-sm text-amber-600 capitalize">{dosha}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diet" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-800">Ayurvedic Diet Plan for {info.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-3">Foods to Favor</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {dietPlans[dosha as keyof typeof dietPlans].favor.map((food, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {food}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-3">Foods to Minimize</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {dietPlans[dosha as keyof typeof dietPlans].avoid.map((food, index) => (
                      <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                        {food}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">Meal Timing Guidance</h3>
                  <p className="text-amber-700 leading-relaxed">
                    {dietPlans[dosha as keyof typeof dietPlans].timing}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yoga" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-800">Yoga & Exercise for {info.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-3">Morning Practice</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {yogaRoutines[dosha as keyof typeof yogaRoutines].morning.map((pose, index) => (
                      <Badge key={index} variant="outline" className="border-orange-300 text-amber-700">
                        {pose}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-3">Evening Practice</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {yogaRoutines[dosha as keyof typeof yogaRoutines].evening.map((pose, index) => (
                      <Badge key={index} variant="outline" className="border-purple-300 text-purple-700">
                        {pose}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">Recommended Pranayama</h3>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {yogaRoutines[dosha as keyof typeof yogaRoutines].pranayama}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routine" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-800">Ideal Dinacharya (Daily Routine)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(dinacharya[dosha as keyof typeof dinacharya]).map(([time, activity], index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-500">
                      <div className="font-semibold text-amber-800 min-w-[80px]">{time}</div>
                      <div className="text-amber-700">{activity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={onRestart}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            Take Assessment Again
          </Button>
          <Button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white">
            Save My Plan
          </Button>
        </div>
      </div>
    </div>
  );
};
