import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HeroMotion } from "./HeroMotion";
import { RotatingWords } from "./RotatingWords";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <header role="banner" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Premium background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-slate-900/50 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(253,186,116,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.1),transparent_50%)]" />
      
      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl">
        {/* Mobile-first layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:min-h-[80vh]">
          
          {/* Motion Graphic - Top on mobile, right on desktop */}
          <div className="order-1 lg:order-2 w-full max-w-sm sm:max-w-md lg:max-w-none">
            <HeroMotion 
              className="w-full" 
              aria-label="Rishi meditating with neural constellation—eternal wisdom meets modern AI"
            />
          </div>
          
          {/* Content - Bottom on mobile, left on desktop */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8 text-center lg:text-left w-full">
            
            {/* Tagline */}
            <motion.p 
              className="text-sm sm:text-base text-slate-300 font-medium tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Redefining Lifestyle with Sanatan Intelligence.
            </motion.p>
            
            {/* Rotating Headline */}
            <div className="space-y-2">
              <RotatingWords />
            </div>
            
            {/* CTA Section */}
            <motion.div 
              className="pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                onClick={() => navigate('/onboarding')}
                size="lg"
                className="w-full sm:w-auto rounded-full px-6 py-3 text-sm font-medium bg-kesari text-slate-900 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-kesari/30 transition-all"
                aria-label="Start your spiritual wellness journey with NeoRishi"
              >
                start your journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};