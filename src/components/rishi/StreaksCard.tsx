import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sunrise, Target, BookOpen, Flame, Trophy } from 'lucide-react';
import { Streak } from '@/types/panchanga';
import { motion } from 'framer-motion';

interface StreaksCardProps {
  streaks: Streak;
}

export const StreaksCard: React.FC<StreaksCardProps> = ({ streaks }) => {
  const streakData = [
    {
      key: 'brahma_muhurta' as keyof Streak,
      name: 'Brahma Muhūrta',
      description: 'Sankalpa before sunrise',
      icon: Sunrise,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      key: 'daily_tasks' as keyof Streak,
      name: 'Daily Tasks',
      description: '3 tasks scheduled',
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      key: 'night_journal' as keyof Streak,
      name: 'Night Journal',
      description: 'Evening reflection',
      icon: BookOpen,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const CircularProgress: React.FC<{ value: number; max: number; color: string }> = ({ 
    value, max, color 
  }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const circumference = 2 * Math.PI * 20; // radius = 20
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-muted/30"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={color}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold">{value}</span>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Streaks
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Consistency is your superpower
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {streakData.map((item, index) => {
            const streakValue = streaks[item.key];
            const IconComponent = item.icon;
            
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <IconComponent className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm font-bold">{streakValue.current}</span>
                      <span className="text-xs text-muted-foreground">current</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-primary" />
                      <span className="text-xs text-muted-foreground">
                        Best: {streakValue.best}
                      </span>
                    </div>
                  </div>
                  
                  <CircularProgress 
                    value={streakValue.current} 
                    max={streakValue.best || 10} 
                    color={item.color}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Overall Progress */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(
                (streaks.brahma_muhurta.current + streaks.daily_tasks.current + streaks.night_journal.current) / 3
              )} avg
            </span>
          </div>
          <Progress 
            value={
              ((streaks.brahma_muhurta.current + streaks.daily_tasks.current + streaks.night_journal.current) / 30) * 100
            } 
            className="h-2" 
          />
        </div>
      </CardContent>
    </Card>
  );
};