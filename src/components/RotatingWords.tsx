import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const rotatingPhrases = ["Think like ,", "Act like,", "Be a"];

export const RotatingWords = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Split text into words for individual animation
  const splitWords = (text: string) => {
    return text.split(' ').filter(word => word.length > 0);
  };

  return (
    <div className="inline-block relative" style={{ width: '280px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhraseIndex}
          className="absolute inset-0 flex flex-wrap gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.9,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          {splitWords(rotatingPhrases[currentPhraseIndex]).map((word, wordIndex) => (
            <motion.span
              key={`${currentPhraseIndex}-${wordIndex}`}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight bg-gradient-to-r from-[#F4D38A] via-[#FFC875] to-[#F6B85E] bg-clip-text text-transparent"
              style={{ 
                fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontVariationSettings: '"opsz" auto'
              }}
              initial={{ 
                opacity: 0,
                y: 6,
                clipPath: 'inset(0 100% 0 0)'
              }}
              animate={{ 
                opacity: 1,
                y: 0,
                clipPath: 'inset(0 0% 0 0)'
              }}
              exit={{
                opacity: 0,
                y: -6,
                clipPath: 'inset(0 0% 0 100%)'
              }}
              transition={{
                duration: 1.1,
                delay: wordIndex * 0.12,
                ease: [0.23, 1, 0.32, 1],
                type: "spring",
                stiffness: 220,
                damping: 26
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};