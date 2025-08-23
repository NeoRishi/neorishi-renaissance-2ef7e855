import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingChatButtonProps {
  onClick: () => void;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', damping: 15, stiffness: 300 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Button
        onClick={onClick}
        size="lg"
        className="rounded-full h-14 w-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </Button>
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-background border rounded-lg px-3 py-2 shadow-lg"
      >
        <div className="text-sm font-medium">Ask NeoRishi</div>
        <div className="text-xs text-muted-foreground">Your AI spiritual guide</div>
        
        {/* Arrow */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-background border-y-4 border-y-transparent" />
      </motion.div>
    </motion.div>
  );
};