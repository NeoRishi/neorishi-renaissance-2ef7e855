import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

interface CTAStartProps {
  onClick: () => void;
  loading?: boolean;
}

export const CTAStart = ({ onClick, loading = false }: CTAStartProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Magnetic cursor effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      disabled={loading}
      className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-medium text-slate-900 text-base sm:text-lg tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F4D38A] focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        background: 'linear-gradient(135deg, rgba(244,211,138,0.1) 0%, rgba(246,184,94,0.05) 100%)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid transparent',
        backgroundImage: 'linear-gradient(135deg, rgba(244,211,138,0.1), rgba(246,184,94,0.05)), linear-gradient(90deg, #F4D38A, #F6B85E)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        x: springX,
        y: springY
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      animate={{
        scale: isPressed ? 0.985 : 1,
        translateY: isHovered ? -2 : 0
      }}
      transition={{
        scale: { duration: 0.1 },
        translateY: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
      }}
      whileTap={{ scale: 0.975 }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
          transform: 'translateX(-100%)'
        }}
        animate={{
          opacity: isHovered ? [0, 1, 0] : 0,
          x: isHovered ? ['translateX(-100%)', 'translateX(100%)'] : 'translateX(-100%)'
        }}
        transition={{
          duration: 0.7,
          ease: [0.23, 1, 0.32, 1],
          repeat: isHovered ? Infinity : 0,
          repeatDelay: 2
        }}
      />

      {/* Glass reflection */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60" />
      
      {/* Button content */}
      <motion.span
        className="relative z-10 font-medium"
        animate={{
          color: isHovered ? '#1e293b' : '#334155'
        }}
        transition={{ duration: 0.2 }}
      >
        {loading ? 'Loading...' : 'start your journey'}
      </motion.span>
      
      {/* Icon */}
      <motion.div
        className="relative z-10 flex items-center"
        animate={{
          translateX: isHovered ? 2 : 0,
          color: isHovered ? '#1e293b' : '#334155'
        }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <ArrowRight className="w-5 h-5" />
        )}
      </motion.div>

      {/* Ripple effect on press */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(244,211,138,0.3) 0%, transparent 70%)'
          }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}

      {/* Enhanced shadow on hover */}
      <motion.div
        className="absolute -inset-1 rounded-full opacity-0 -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(246,200,120,0.15) 0%, transparent 70%)',
          filter: 'blur(8px)'
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};