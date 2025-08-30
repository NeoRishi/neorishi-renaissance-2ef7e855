import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


const rotatingPhrases = ["Think like,", "Act like,", "Be a"];

export const Hero = () => {
  const navigate = useNavigate();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Premium background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-slate-900/50 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(253,186,116,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Rotating Headline */}
            <div className="space-y-4">
              <div className="h-20 flex items-center justify-center lg:justify-start">
                <div className="inline-flex items-center gap-4">
                  <div className="w-80 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentPhraseIndex}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ 
                          duration: 0.6, 
                          ease: [0.4, 0, 0.2, 1],
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }}
                        className="text-4xl md:text-5xl lg:text-6xl font-light bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent block"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {rotatingPhrases[currentPhraseIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              
              <motion.h2 
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  textShadow: "0 0 24px hsl(var(--primary-glow) / 0.15)"
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                NeoRishi
              </motion.h2>
            </div>
            
            {/* Tagline */}
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Redefining Lifestyle with Sanatan Intelligence.
            </motion.p>
            
            {/* CTA Section */}
            <motion.div 
              className="pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                onClick={() => navigate('/onboarding')}
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground text-lg px-8 py-6 rounded-2xl shadow-elegant group"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
          
          {/* Hero Image */}
          <motion.div 
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto lg:max-w-none">
              <img 
                src="/lovable-uploads/3c67ba90-ae3a-4e7a-b07f-fa0a2b7edc68.png" 
                alt="Meditation and spiritual wellness through AI-powered Ayurveda"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary-glow/10" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-full opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-primary-glow to-primary rounded-full opacity-15 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};