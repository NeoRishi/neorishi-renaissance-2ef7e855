import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle, Sun, Sunrise, Sunset, Moon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { DoshaGunaBlock, PanchangaDay } from '@/types/panchanga';

interface TodayViewProps {
  panchangaData: PanchangaDay;
}

export const TodayView: React.FC<TodayViewProps> = ({ panchangaData }) => {
  const getCurrentAndNextBlocks = (blocks: DoshaGunaBlock[]) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    let currentBlock = null;
    let nextBlock = null;
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (currentTime >= block.from && currentTime <= block.to) {
        currentBlock = block;
        nextBlock = blocks[i + 1] || blocks[0]; // Next block or first block if at end
        break;
      }
    }
    
    // If no current block found, find the next upcoming block
    if (!currentBlock) {
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (currentTime < block.from) {
          nextBlock = block;
          break;
        }
      }
      // If we're past all blocks for today, next is first block of tomorrow
      if (!nextBlock) {
        nextBlock = blocks[0];
      }
    }
    
    return { currentBlock, nextBlock };
  };

  const getGunaColor = (guna: string) => {
    switch (guna) {
      case 'Sattva': return 'bg-tulsi/20 text-tulsi border-tulsi/30';
      case 'Rajas': return 'bg-kesari/20 text-kesari border-kesari/30';
      case 'Tamas': return 'bg-secondary/20 text-secondary-foreground border-secondary/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'Vāta': return 'bg-blue-100/10 text-blue-300 border-blue-200/20';
      case 'Pitta': return 'bg-red-100/10 text-red-300 border-red-200/20'; 
      case 'Kapha': return 'bg-green-100/10 text-green-300 border-green-200/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const { currentBlock, nextBlock } = getCurrentAndNextBlocks(panchangaData.doshaGunaBlocks);

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-2xl p-6 border"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {format(parseISO(panchangaData.dateISO), 'EEEE, MMMM do, yyyy')}
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{panchangaData.ritu} • {panchangaData.masa}</span>
              <span>{panchangaData.paksha} • {panchangaData.tithi.name}</span>
              <Badge variant="outline" className="bg-background/50">
                {panchangaData.moonPhase.emoji} {panchangaData.moonPhase.name}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Dosha-Guna Block */}
        {currentBlock && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="ring-2 ring-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Current Rhythm
                </CardTitle>
                <p className="text-sm text-muted-foreground">Active now</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono bg-primary/10 text-primary">
                      {currentBlock.from} - {currentBlock.to}
                    </Badge>
                    <Badge className={getGunaColor(currentBlock.guna)}>
                      {currentBlock.guna}
                    </Badge>
                    <Badge variant="outline" className={getDoshaColor(currentBlock.dosha)}>
                      {currentBlock.dosha}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-tulsi" />
                        <span className="text-sm font-medium text-tulsi">Best to do</span>
                      </div>
                      <ul className="space-y-1 ml-6">
                        {currentBlock.do.map((activity, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">Avoid</span>
                      </div>
                      <ul className="space-y-1 ml-6">
                        {currentBlock.avoid.map((activity, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Next Dosha-Guna Block */}
        {nextBlock && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-dashed border-2 border-accent/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Next Rhythm
                </CardTitle>
                <p className="text-sm text-muted-foreground">Prepare for upcoming</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      {nextBlock.from} - {nextBlock.to}
                    </Badge>
                    <Badge className={getGunaColor(nextBlock.guna)}>
                      {nextBlock.guna}
                    </Badge>
                    <Badge variant="outline" className={getDoshaColor(nextBlock.dosha)}>
                      {nextBlock.dosha}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-tulsi" />
                        <span className="text-sm font-medium text-tulsi">Best to do</span>
                      </div>
                      <ul className="space-y-1 ml-6">
                        {nextBlock.do.map((activity, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">Avoid</span>
                      </div>
                      <ul className="space-y-1 ml-6">
                        {nextBlock.avoid.map((activity, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pañchāṅga Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pañchāṅga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Tithi</p>
                <p>{panchangaData.tithi.name}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Nakṣatra</p>
                <p>{panchangaData.nakshatra.name}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Yoga</p>
                <p>{panchangaData.yoga}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Karaṇa</p>
                <p>{panchangaData.karana}</p>
              </div>
              <div className="flex items-center gap-1">
                <Sunrise className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="font-medium text-muted-foreground">Sunrise</p>
                  <p>{format(parseISO(panchangaData.sunrise), 'HH:mm')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Sunset className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="font-medium text-muted-foreground">Sunset</p>
                  <p>{format(parseISO(panchangaData.sunset), 'HH:mm')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Astro Tip */}
        <Card className="bg-gradient-to-br from-accent/10 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-primary" />
              Astro Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{panchangaData.astroTip}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};