import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const HeroMotion = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Premium SVG animation for rishi silhouette with neural constellation
  const StaticFrame = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      {/* Mandala background */}
      <defs>
        <radialGradient id="mandalaGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(244,211,138,0.15)" />
          <stop offset="70%" stopColor="rgba(246,184,94,0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Mandala circles */}
      <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(244,211,138,0.1)" strokeWidth="1" />
      <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(244,211,138,0.08)" strokeWidth="1" />
      <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(244,211,138,0.06)" strokeWidth="1" />
      
      {/* Rishi silhouette */}
      <path
        d="M200 140 C190 140 180 150 180 165 L180 200 C180 220 185 235 200 240 C215 235 220 220 220 200 L220 165 C220 150 210 140 200 140 Z M200 240 L200 280 C200 290 195 300 190 310 L210 310 C205 300 200 290 200 280 Z M190 310 L190 320 C190 325 195 330 200 330 C205 330 210 325 210 320 L210 310"
        fill="rgba(244,211,138,0.6)"
        filter="url(#glow)"
      />
      
      {/* Neural nodes */}
      <circle cx="180" cy="120" r="3" fill="rgba(244,211,138,0.8)" />
      <circle cx="220" cy="125" r="2.5" fill="rgba(244,211,138,0.7)" />
      <circle cx="200" cy="110" r="2" fill="rgba(244,211,138,0.9)" />
      <circle cx="190" cy="100" r="1.5" fill="rgba(244,211,138,0.6)" />
      <circle cx="210" cy="105" r="2" fill="rgba(244,211,138,0.8)" />
      
      {/* Neural connections */}
      <line x1="180" y1="120" x2="200" y2="110" stroke="rgba(244,211,138,0.3)" strokeWidth="1" />
      <line x1="220" y1="125" x2="200" y2="110" stroke="rgba(244,211,138,0.3)" strokeWidth="1" />
      <line x1="190" y1="100" x2="200" y2="110" stroke="rgba(244,211,138,0.3)" strokeWidth="1" />
      <line x1="210" y1="105" x2="200" y2="110" stroke="rgba(244,211,138,0.3)" strokeWidth="1" />
    </svg>
  );

  const AnimatedFrame = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      {/* Animated mandala background */}
      <defs>
        <radialGradient id="mandalaGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(244,211,138,0.15)" />
          <stop offset="70%" stopColor="rgba(246,184,94,0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Rotating mandala circles */}
      <motion.circle 
        cx="200" cy="200" r="180" 
        fill="none" stroke="rgba(244,211,138,0.1)" strokeWidth="1"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      />
      <motion.circle 
        cx="200" cy="200" r="140" 
        fill="none" stroke="rgba(244,211,138,0.08)" strokeWidth="1"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      />
      <motion.circle 
        cx="200" cy="200" r="100" 
        fill="none" stroke="rgba(244,211,138,0.06)" strokeWidth="1"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      />
      
      {/* Rishi silhouette with breathing effect */}
      <motion.path
        d="M200 140 C190 140 180 150 180 165 L180 200 C180 220 185 235 200 240 C215 235 220 220 220 200 L220 165 C220 150 210 140 200 140 Z M200 240 L200 280 C200 290 195 300 190 310 L210 310 C205 300 200 290 200 280 Z M190 310 L190 320 C190 325 195 330 200 330 C205 330 210 325 210 320 L210 310"
        fill="rgba(244,211,138,0.6)"
        filter="url(#glow)"
        animate={{ 
          opacity: [0.6, 0.8, 0.6],
          scale: [1, 1.02, 1]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ transformOrigin: "200px 235px" }}
      />
      
      {/* Pulsing neural nodes */}
      <motion.circle 
        cx="180" cy="120" r="3" 
        fill="rgba(244,211,138,0.8)"
        animate={{ 
          opacity: [0.4, 1, 0.4],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          delay: 0,
          ease: "easeInOut"
        }}
      />
      <motion.circle 
        cx="220" cy="125" r="2.5" 
        fill="rgba(244,211,138,0.7)"
        animate={{ 
          opacity: [0.4, 1, 0.4],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          delay: 0.5,
          ease: "easeInOut"
        }}
      />
      <motion.circle 
        cx="200" cy="110" r="2" 
        fill="rgba(244,211,138,0.9)"
        animate={{ 
          opacity: [0.4, 1, 0.4],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          delay: 1,
          ease: "easeInOut"
        }}
      />
      <motion.circle 
        cx="190" cy="100" r="1.5" 
        fill="rgba(244,211,138,0.6)"
        animate={{ 
          opacity: [0.4, 1, 0.4],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          delay: 1.5,
          ease: "easeInOut"
        }}
      />
      <motion.circle 
        cx="210" cy="105" r="2" 
        fill="rgba(244,211,138,0.8)"
        animate={{ 
          opacity: [0.4, 1, 0.4],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          delay: 0.3,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated neural connections */}
      <motion.line 
        x1="180" y1="120" x2="200" y2="110" 
        stroke="rgba(244,211,138,0.3)" strokeWidth="1"
        animate={{ opacity: [0.1, 0.6, 0.1] }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          delay: 0,
          ease: "easeInOut"
        }}
      />
      <motion.line 
        x1="220" y1="125" x2="200" y2="110" 
        stroke="rgba(244,211,138,0.3)" strokeWidth="1"
        animate={{ opacity: [0.1, 0.6, 0.1] }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          delay: 0.5,
          ease: "easeInOut"
        }}
      />
      <motion.line 
        x1="190" y1="100" x2="200" y2="110" 
        stroke="rgba(244,211,138,0.3)" strokeWidth="1"
        animate={{ opacity: [0.1, 0.6, 0.1] }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          delay: 1,
          ease: "easeInOut"
        }}
      />
      <motion.line 
        x1="210" y1="105" x2="200" y2="110" 
        stroke="rgba(244,211,138,0.3)" strokeWidth="1"
        animate={{ opacity: [0.1, 0.6, 0.1] }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          delay: 1.5,
          ease: "easeInOut"
        }}
      />

      {/* Orbiting particles */}
      <motion.circle
        cx="200" cy="200" r="1.5"
        fill="rgba(244,211,138,0.8)"
        animate={{
          x: [0, 50, 0, -50, 0],
          y: [0, -30, -60, -30, 0],
          opacity: [0, 1, 0.5, 1, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.circle
        cx="200" cy="200" r="1"
        fill="rgba(244,211,138,0.6)"
        animate={{
          x: [0, -40, 0, 40, 0],
          y: [0, 25, 50, 25, 0],
          opacity: [0, 0.8, 0.3, 0.8, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          delay: 2,
          ease: "easeInOut"
        }}
      />
    </svg>
  );

  return (
    <motion.div 
      ref={containerRef}
      className="relative rounded-3xl overflow-hidden backdrop-blur-sm bg-gradient-to-br from-slate-900/20 via-slate-800/10 to-slate-900/30 border border-slate-700/20 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
      style={{ y: prefersReducedMotion ? 0 : y }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Inner vignette */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-900/20 rounded-3xl" />
      
      {/* Motion graphic content */}
      <div className="aspect-square p-8">
        {prefersReducedMotion ? <StaticFrame /> : <AnimatedFrame />}
      </div>
      
      {/* Subtle film grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay rounded-3xl pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
        }}
      />
    </motion.div>
  );
};