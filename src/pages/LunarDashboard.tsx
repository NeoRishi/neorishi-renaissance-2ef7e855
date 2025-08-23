import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// RishiRhythm Components
import { TabNavigation, TabsContent } from '@/components/rishi/TabNavigation';
import { TodayView } from '@/components/rishi/TodayView';
import { LunarCalendarView } from '@/components/rishi/LunarCalendarView';
import { DoshaGunaTimeline } from '@/components/rishi/DoshaGunaTimeline';
import { StreaksCard } from '@/components/rishi/StreaksCard';
import { JournalingView } from '@/components/rishi/JournalingView';
import { DailyTasksView } from '@/components/rishi/DailyTasksView';
import { NeoRishiChat } from '@/components/rishi/NeoRishiChat';
import { FloatingChatButton } from '@/components/rishi/FloatingChatButton';

// Services & Types
import { getPanchanga, getStreaks } from '@/services/panchangaService';
import { PanchangaDay, Streak } from '@/types/panchanga';

const LunarDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [panchangaData, setPanchangaData] = useState<PanchangaDay | null>(null);
  const [streaks, setStreaks] = useState<Streak | null>(null);
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load Panchanga data for current date
        const panchanga = getPanchanga(currentDate);
        setPanchangaData(panchanga);
        
        // Load streaks data
        const userStreaks = getStreaks();
        setStreaks(userStreaks);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [currentDate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "Thank you for using NeoRishi!",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your spiritual dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !panchangaData || !streaks) {
    return null;
  }

  const chatContextData = {
    date: currentDate,
    ritu: panchangaData.ritu,
    tithi: panchangaData.tithi.name,
    nakshatra: panchangaData.nakshatra.name,
    moonPhase: panchangaData.moonPhase.name,
    dosha: panchangaData.doshaGunaBlocks.find(block => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      return currentTime >= block.from && currentTime <= block.to;
    })?.dosha || 'Vāta'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 sacred-pattern dark">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-30"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                RishiRhythm — Personalised Dashboard
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{format(new Date(currentDate), 'EEEE, MMMM do, yyyy')}</span>
                {panchangaData && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {panchangaData.moonPhase.emoji} {panchangaData.paksha} • {panchangaData.tithi.name}
                  </Badge>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard */}
      <TabNavigation defaultTab="today">
        {/* Today Tab */}
        <TabsContent value="today" className="mt-0">
          <TodayView panchangaData={panchangaData} />
          <div className="grid lg:grid-cols-1 gap-6 mt-6">
            <StreaksCard streaks={streaks} />
          </div>
        </TabsContent>

        {/* Lunar Calendar Tab */}
        <TabsContent value="lunar-calendar" className="space-y-6 mt-0">
          <LunarCalendarView 
            panchangaData={panchangaData}
            onDateSelect={setCurrentDate}
          />
        </TabsContent>

        {/* Journaling Tab */}
        <TabsContent value="journaling" className="mt-0">
          <JournalingView date={currentDate} />
        </TabsContent>

        {/* Daily Tasks Tab */}
        <TabsContent value="daily-tasks" className="mt-0">
          <DailyTasksView date={currentDate} />
        </TabsContent>
      </TabNavigation>

      {/* Floating Chat Button */}
      <FloatingChatButton onClick={() => setIsChatOpen(true)} />

      {/* NeoRishi Chat */}
      <NeoRishiChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        contextData={chatContextData}
      />
    </div>
  );
};

export default LunarDashboard;