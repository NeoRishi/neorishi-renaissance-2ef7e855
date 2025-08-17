
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Check, Crown, Star, Sparkles, Gift } from "lucide-react";

interface SubscriptionPlansProps {
  onBack: () => void;
}

export const SubscriptionPlans = ({ onBack }: SubscriptionPlansProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'premium' | null>(null);

  const handleSubscribe = (plan: 'basic' | 'pro' | 'premium') => {
    setSelectedPlan(plan);
    // Here you would integrate with your payment system
    console.log(`Starting ${plan} subscription`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="absolute top-8 left-8 text-amber-700 hover:text-amber-800"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-5xl font-bold text-amber-800 mb-6">Choose Your Wellness Journey</h1>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover personalized wellness plans rooted in ancient wisdom and powered by modern AI. 
            Start your transformation with our comprehensive Ayurvedic and Yogic guidance.
          </p>

          {/* Free Trial Banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center justify-center mb-2">
              <Gift className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-bold">Start Free Today!</h3>
            </div>
            <p className="text-green-100 text-lg">
              Free Prakriti Assessment • Personalized Recommendations • 7-Day Trial of All Features
            </p>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Basic Plan */}
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300 relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-amber-800 mb-2">Basic</CardTitle>
              <div className="text-4xl font-bold text-amber-800 mb-2">
                ₹199
                <span className="text-lg font-normal text-amber-600">/month</span>
              </div>
              <p className="text-amber-600 text-sm">Perfect for beginners</p>
              <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full inline-block mt-2">
                7-Day Free Trial
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700 font-medium">Free Prakriti assessment & body type analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Basic personalized diet plan</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Simple daily routine (Dinacharya)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Basic yoga sequences</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Weekly wellness tips</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleSubscribe('basic')}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white mt-6"
              >
                Start Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300 relative border-2 border-amber-400 scale-105">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-1">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-amber-800 mb-2">Pro</CardTitle>
              <div className="text-4xl font-bold text-amber-800 mb-2">
                ₹499
                <span className="text-lg font-normal text-amber-600">/month</span>
              </div>
              <p className="text-amber-600 text-sm">For dedicated practitioners</p>
              <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full inline-block mt-2">
                7-Day Free Trial
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700 font-medium">Everything in Basic plan (FREE)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Advanced AI coaching & feedback</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Seasonal routine adjustments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Goal-based plan modifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Pranayama & breathing exercises</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Progress tracking & analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Priority support</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleSubscribe('pro')}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white mt-6"
              >
                Start Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300 relative border-2 border-purple-400">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                <Crown className="w-4 h-4 mr-1" />
                Premium
              </Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-amber-800 mb-2">Premium</CardTitle>
              <div className="text-4xl font-bold text-amber-800 mb-2">
                ₹999
                <span className="text-lg font-normal text-amber-600">/month</span>
              </div>
              <p className="text-amber-600 text-sm">Complete spiritual wellness</p>
              <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full inline-block mt-2">
                7-Day Free Trial
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700 font-medium">Everything in Pro plan (FREE)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-amber-700 font-medium">Personalized guided meditations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-amber-700 font-medium">Astrology-based recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-amber-700 font-medium">Advanced spiritual sadhana practices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Vedic lifestyle consulting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Mantra & chanting guidance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">24/7 AI wellness support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-amber-700">Monthly live Q&A sessions</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleSubscribe('premium')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-6"
              >
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Highlights */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-amber-800 mb-8">What Makes NeoRishi Special</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/60 p-6 rounded-xl border border-orange-200">
              <div className="text-4xl mb-4">🧘‍♀️</div>
              <h4 className="font-semibold text-amber-800 mb-2">Ancient Wisdom</h4>
              <p className="text-amber-700 text-sm">5000+ years of Ayurvedic and Yogic knowledge</p>
            </div>
            <div className="bg-white/60 p-6 rounded-xl border border-orange-200">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="font-semibold text-amber-800 mb-2">AI-Powered</h4>
              <p className="text-amber-700 text-sm">Modern technology for personalized guidance</p>
            </div>
            <div className="bg-white/60 p-6 rounded-xl border border-orange-200">
              <div className="text-4xl mb-4">🌟</div>
              <h4 className="font-semibold text-amber-800 mb-2">Holistic Approach</h4>
              <p className="text-amber-700 text-sm">Body, mind, and spirit alignment</p>
            </div>
            <div className="bg-white/60 p-6 rounded-xl border border-orange-200">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="font-semibold text-amber-800 mb-2">Proven Results</h4>
              <p className="text-amber-700 text-sm">Track your wellness journey with analytics</p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-2xl p-8 text-center border border-green-200">
          <h3 className="text-2xl font-bold text-green-800 mb-4">30-Day Money-Back Guarantee</h3>
          <p className="text-green-700 text-lg">
            Try NeoRishi risk-free. If you're not completely satisfied with your wellness transformation, 
            we'll refund your money within 30 days. No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
};
