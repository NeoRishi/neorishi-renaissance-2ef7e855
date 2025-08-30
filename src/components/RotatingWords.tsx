import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const rotatingPhrases = ["Think like", "Act like", "Be a"];

export const RotatingWords = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center lg:justify-start">
      <div className="inline-flex items-center space-x-3">
        {/* Rotating words container with fixed width to prevent layout shift */}
        <div className="w-32 sm:w-36 lg:w-40 h-16 flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentPhraseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-kesari via-kesari to-kesari/80 bg-clip-text text-transparent"
            >
              {rotatingPhrases[currentPhraseIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
        
        {/* Static NeoRishi text */}
        <motion.span 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground lg:drop-shadow-[0_0_24px_rgba(253,186,116,0.15)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          NeoRishi
        </motion.span>
      </div>
    </div>
  );
};