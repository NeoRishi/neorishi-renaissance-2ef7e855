import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RotatingWords } from './RotatingWords';
import { HeroMotion } from './HeroMotion';
import { CTAStart } from './CTAStart';

export const Hero = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartJourney = async () => {
    setIsLoading(true);
    // Small delay for UX
    setTimeout(() => {
      navigate('/onboarding');
      setIsLoading(false);
    }, 300);
  };

  return (
    <header role="banner" className="relative min-h-screen py-16 sm:py-20 lg:py-32 overflow-hidden">
      {/* Premium deep navy background with luxury textures */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800/90 to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(244,211,138,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(246,184,94,0.06),transparent_50%)]" />
      
      {/* Subtle film grain + vignette */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
        {/* Mobile-first stack: Motion graphic → Text content → CTA */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center justify-center min-h-[calc(100vh-8rem)] max-w-7xl mx-auto">
          
          {/* Motion Graphic - Top on mobile, Right on desktop */}
          <div className="order-1 lg:order-2 w-full max-w-sm sm:max-w-md lg:max-w-none">
            <HeroMotion />
          </div>

          {/* Text Content - Bottom on mobile, Left on desktop */}
          <div className="order-2 lg:order-1 space-y-6 sm:space-y-8 text-center lg:text-left w-full">
            
            {/* Tagline */}
            <motion.p 
              className="text-sm sm:text-base text-slate-300/80 tracking-wide font-light"
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              Redefining Lifestyle with Sanatan Intelligence.
            </motion.p>
            
            {/* Kinetic Headline */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-2 sm:gap-4">
                <RotatingWords />
                <motion.span 
                  className="text-2xl sm:text-3xl lg:text-4xl text-slate-400 font-light"
                  style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  →
                </motion.span>
              </div>
              
              <motion.h1 
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-[#F4D38A] via-[#FFC875] to-[#F6B85E] bg-clip-text text-transparent leading-tight"
                style={{ 
                  fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
                  fontWeight: 750,
                  fontVariationSettings: '"opsz" auto',
                  textShadow: "0 0 24px rgba(244,211,138,0.4), 0 0 8px rgba(244,211,138,0.3)"
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  textShadow: [
                    "0 0 24px rgba(244,211,138,0.25), 0 0 8px rgba(244,211,138,0.2)",
                    "0 0 32px rgba(244,211,138,0.4), 0 0 12px rgba(244,211,138,0.3)",
                    "0 0 24px rgba(244,211,138,0.25), 0 0 8px rgba(244,211,138,0.2)"
                  ]
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] },
                  y: { duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] },
                  textShadow: { 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }
                }}
              >
                NeoRishi
              </motion.h1>
            </div>
            
            {/* CTA Button */}
            <motion.div 
              className="pt-6 sm:pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <CTAStart 
                onClick={handleStartJourney}
                loading={isLoading}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};