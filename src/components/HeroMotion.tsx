import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HeroMotionProps {
  className?: string;
}

export const HeroMotion: React.FC<HeroMotionProps> = ({ className = "" }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -4]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div className={`relative ${className}`}>
        <div className="rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] bg-[rgba(255,255,255,0.02)] backdrop-blur border border-white/5 overflow-hidden">
          <div className="aspect-square max-w-md mx-auto p-8 flex items-center justify-center">
            <div className="relative">
              {/* Static Mandala Background */}
              <div className="absolute inset-0 w-64 h-64 rounded-full border-2 border-kesari/20">
                <div className="absolute inset-4 rounded-full border border-kesari/15"></div>
                <div className="absolute inset-8 rounded-full border border-kesari/10"></div>
              </div>
              
              {/* Static Rishi Silhouette */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-40 h-40 fill-kesari/80">
                  <path d="M100 50c-8 0-12 4-12 12v8c0 4 2 8 6 10l-4 6c-2 2-2 6 0 8l8 8c2 2 6 2 8 0l8-8c2-2 2-6 0-8l-4-6c4-2 6-6 6-10v-8c0-8-4-12-12-12z"/>
                  <path d="M80 100c-4 0-8 4-8 8v20c0 8 4 12 12 12h4l-2 20c0 4 4 8 8 8h12c4 0 8-4 8-8l-2-20h4c8 0 12-4 12-12v-20c0-4-4-8-8-8z"/>
                  <path d="M70 140l-8 8c-4 4-4 8 0 12l8 8v12c0 4 4 8 8 8h12l20 8c4 2 8-2 8-6v-12l20-8h12c4 0 8-4 8-8v-12l8-8c4-4 4-8 0-12l-8-8"/>
                </svg>
                
                {/* Static Neural Nodes */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-kesari/60"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-kesari/40 mt-0.5"></div>
                    <div className="w-2 h-2 rounded-full bg-kesari/60"></div>
                  </div>
                  <div className="flex space-x-3 mt-2 justify-center">
                    <div className="w-1 h-1 rounded-full bg-kesari/30"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-kesari/50"></div>
                    <div className="w-1 h-1 rounded-full bg-kesari/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ y }}
    >
      <div className="rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] bg-[rgba(255,255,255,0.02)] backdrop-blur border border-white/5 overflow-hidden">
        <div className="aspect-square max-w-md mx-auto p-8 flex items-center justify-center">
          <div className="relative">
            {/* Animated Mandala Background */}
            <motion.div 
              className="absolute inset-0 w-64 h-64"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full rounded-full border-2 border-kesari/20">
                <div className="absolute inset-4 rounded-full border border-kesari/15"></div>
                <div className="absolute inset-8 rounded-full border border-kesari/10"></div>
                {/* Mandala Details */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-kesari/30 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      transformOrigin: '0 0',
                      transform: `rotate(${i * 45}deg) translateX(120px) translateY(-2px)`
                    }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Meditating Rishi Silhouette */}
            <motion.div 
              className="relative w-64 h-64 flex items-center justify-center"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 200 200" className="w-40 h-40 fill-kesari/80">
                <motion.path 
                  d="M100 50c-8 0-12 4-12 12v8c0 4 2 8 6 10l-4 6c-2 2-2 6 0 8l8 8c2 2 6 2 8 0l8-8c2-2 2-6 0-8l-4-6c4-2 6-6 6-10v-8c0-8-4-12-12-12z"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.path 
                  d="M80 100c-4 0-8 4-8 8v20c0 8 4 12 12 12h4l-2 20c0 4 4 8 8 8h12c4 0 8-4 8-8l-2-20h4c8 0 12-4 12-12v-20c0-4-4-8-8-8z"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                <motion.path 
                  d="M70 140l-8 8c-4 4-4 8 0 12l8 8v12c0 4 4 8 8 8h12l20 8c4 2 8-2 8-6v-12l20-8h12c4 0 8-4 8-8v-12l8-8c4-4 4-8 0-12l-8-8"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </svg>
            </motion.div>
            
            {/* Neural Network Above Head */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-20">
              {/* Main nodes */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`node-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-kesari/60"
                  style={{
                    left: `${20 + (i % 3) * 30}%`,
                    top: `${20 + Math.floor(i / 3) * 40}%`
                  }}
                  animate={{ 
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.3 
                  }}
                />
              ))}
              
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
                {[
                  { x1: 25, y1: 25, x2: 50, y2: 25 },
                  { x1: 50, y1: 25, x2: 75, y2: 25 },
                  { x1: 25, y1: 45, x2: 50, y2: 45 },
                  { x1: 50, y1: 45, x2: 75, y2: 45 },
                  { x1: 25, y1: 25, x2: 25, y2: 45 },
                  { x1: 75, y1: 25, x2: 75, y2: 45 }
                ].map((line, i) => (
                  <motion.line
                    key={`line-${i}`}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="hsl(var(--kesari))"
                    strokeWidth="0.5"
                    opacity="0.3"
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                  />
                ))}
              </svg>
            </div>
            
            {/* Orbiting Particles */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 rounded-full bg-kesari/40"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: '0 0',
                  transform: `rotate(${i * 120}deg) translateX(140px) translateY(-2px)`
                }}
                animate={{
                  rotate: 360,
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 1] }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};