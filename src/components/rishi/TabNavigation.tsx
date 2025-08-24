import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, BookOpen, Target, Clock, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

interface TabNavigationProps {
  defaultTab?: string;
  children: React.ReactNode;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  defaultTab = "today", 
  children 
}) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      {/* Sticky Navigation Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5 bg-muted/30 backdrop-blur-sm">
              <TabsTrigger 
                value="today" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Today</span>
                <span className="sm:hidden">Today</span>
              </TabsTrigger>
              <TabsTrigger 
                value="lunar-calendar" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Lunar Calendar</span>
                <span className="sm:hidden">Calendar</span>
              </TabsTrigger>
              <TabsTrigger 
                value="journaling"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Journaling</span>
                <span className="sm:hidden">Journal</span>
              </TabsTrigger>
              <TabsTrigger 
                value="daily-tasks"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Daily Tasks</span>
                <span className="sm:hidden">Tasks</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ritu-ahara"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Leaf className="w-4 h-4" />
                <span className="hidden sm:inline">Ritu-Āhāra</span>
                <span className="sm:hidden">Diet</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-6 py-6">
        {children}
      </div>
    </Tabs>
  );
};

// Export tab content components for use in parent
export { TabsContent };