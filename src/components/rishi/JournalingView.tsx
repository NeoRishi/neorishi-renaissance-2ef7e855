import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sunrise, Moon, BookOpen, Save, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getJournalEntry, saveJournalEntry } from '@/services/panchangaService';
import { useToast } from '@/hooks/use-toast';

interface JournalingViewProps {
  date: string;
}

export const JournalingView: React.FC<JournalingViewProps> = ({ date }) => {
  const { toast } = useToast();
  const [journalEntry, setJournalEntry] = useState<any>(null);
  const [sankalpa, setSankalpa] = useState('');
  const [reflection, setReflection] = useState('');
  const [improvements, setImprovements] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const currentHour = new Date().getHours();
  const isMorningTime = currentHour >= 4 && currentHour < 12;
  const isEveningTime = currentHour >= 18 && currentHour <= 23;
  
  useEffect(() => {
    const entry = getJournalEntry(date);
    if (entry) {
      setJournalEntry(entry);
      setSankalpa(entry.morning?.sankalpa || '');
      setReflection(entry.night?.reflection || '');
      setImprovements(entry.night?.improvements || '');
    }
  }, [date]);

  const handleSaveMorning = async () => {
    if (!sankalpa.trim()) return;
    
    setIsSaving(true);
    try {
      const entry = {
        morning: {
          sankalpa: sankalpa.trim(),
          timestamp: new Date().toISOString()
        }
      };
      
      saveJournalEntry(date, entry);
      setJournalEntry(prev => ({ ...prev, ...entry }));
      
      toast({
        title: "Sankalpa saved",
        description: "Your morning intention has been set.",
      });
    } catch (error) {
      toast({
        title: "Error saving sankalpa",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNight = async () => {
    if (!reflection.trim() && !improvements.trim()) return;
    
    setIsSaving(true);
    try {
      const entry = {
        night: {
          reflection: reflection.trim(),
          improvements: improvements.trim(),
          timestamp: new Date().toISOString()
        }
      };
      
      saveJournalEntry(date, entry);
      setJournalEntry(prev => ({ ...prev, ...entry }));
      
      toast({
        title: "Evening reflection saved",
        description: "Your daily reflection has been recorded.",
      });
    } catch (error) {
      toast({
        title: "Error saving reflection",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold mb-2">Daily Journaling</h2>
        <p className="text-muted-foreground">
          {format(new Date(date), 'EEEE, MMMM do, yyyy')}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Morning - Sankalpa */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`${isMorningTime ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/5 to-accent/5' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Sunrise className="w-5 h-5 text-orange-500" />
                </div>
                Morning Sankalpa
                {isMorningTime && (
                  <Badge className="bg-tulsi/20 text-tulsi border-tulsi/30">
                    Perfect time
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Set your intention in one clear sentence
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={sankalpa}
                onChange={(e) => setSankalpa(e.target.value)}
                placeholder="Today, I intend to..."
                className="min-h-[100px] resize-none"
                maxLength={200}
              />
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {sankalpa.length}/200 characters
                </span>
                
                <Button
                  onClick={handleSaveMorning}
                  disabled={!sankalpa.trim() || isSaving}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Sankalpa'}
                </Button>
              </div>

              {journalEntry?.morning && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Saved: {format(new Date(journalEntry.morning.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm">{journalEntry.morning.sankalpa}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Evening - Retrospective */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`${isEveningTime ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/5 to-accent/5' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Moon className="w-5 h-5 text-purple-500" />
                </div>
                Evening Reflection
                {isEveningTime && (
                  <Badge className="bg-tulsi/20 text-tulsi border-tulsi/30">
                    Perfect time
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Close the loop: a 2-minute reflection
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  What aligned today?
                </label>
                <Textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Reflect on what went well, what you learned..."
                  className="min-h-[80px] resize-none"
                  maxLength={300}
                />
                <span className="text-xs text-muted-foreground">
                  {reflection.length}/300 characters
                </span>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  One thing to improve
                </label>
                <Textarea
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="What would you do differently tomorrow?"
                  className="min-h-[80px] resize-none"
                  maxLength={200}
                />
                <span className="text-xs text-muted-foreground">
                  {improvements.length}/200 characters
                </span>
              </div>
              
              <Button
                onClick={handleSaveNight}
                disabled={(!reflection.trim() && !improvements.trim()) || isSaving}
                size="sm"
                className="w-full flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Reflection'}
              </Button>

              {journalEntry?.night && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Saved: {format(new Date(journalEntry.night.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  {journalEntry.night.reflection && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">What aligned:</p>
                      <p className="text-sm">{journalEntry.night.reflection}</p>
                    </div>
                  )}
                  {journalEntry.night.improvements && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">To improve:</p>
                      <p className="text-sm">{journalEntry.night.improvements}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Guidance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-muted/50 to-background border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium mb-2">Journaling Guidance</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• <strong>Morning Sankalpa:</strong> Set a clear, positive intention for the day</p>
                  <p>• <strong>Evening Reflection:</strong> Acknowledge progress and areas for growth</p>
                  <p>• <strong>Best times:</strong> Brahma Muhūrta (before sunrise) and sunset hours</p>
                  <p>• Keep entries brief but meaningful - quality over quantity</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};