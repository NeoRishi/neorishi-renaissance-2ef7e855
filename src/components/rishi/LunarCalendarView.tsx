import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Sunrise, Sunset, Moon, Sun } from 'lucide-react';
import { RITUS } from '@/types/panchanga';
import { format, parseISO } from 'date-fns';

type ViewType = 'year' | 'month' | 'day';

interface LunarCalendarViewProps {
  panchangaData: any;
  onDateSelect?: (date: string) => void;
}

export const LunarCalendarView: React.FC<LunarCalendarViewProps> = ({ 
  panchangaData, 
  onDateSelect 
}) => {
  const [currentView, setCurrentView] = useState<ViewType>('day');
  const [selectedRitu, setSelectedRitu] = useState<string>('Varṣā');
  const [selectedMonth, setSelectedMonth] = useState<string>('Bhādrapada');

  const handleRituSelect = (ritu: string) => {
    setSelectedRitu(ritu);
    setCurrentView('month');
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setCurrentView('day');
  };

  const handleBackToYear = () => setCurrentView('year');
  const handleBackToMonth = () => setCurrentView('month');

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToYear}
          className={currentView === 'year' ? 'text-primary font-medium' : ''}
        >
          Year
        </Button>
        {currentView !== 'year' && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToMonth}
              className={currentView === 'month' ? 'text-primary font-medium' : ''}
            >
              {selectedRitu}
            </Button>
          </>
        )}
        {currentView === 'day' && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary font-medium">{selectedMonth}</span>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Year View - Ritu Cards */}
        {currentView === 'year' && (
          <motion.div
            key="year"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {RITUS.map((ritu, index) => (
              <motion.div
                key={ritu.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    ritu.current 
                      ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/5 to-accent/5' 
                      : 'hover:ring-1 hover:ring-border'
                  }`}
                  onClick={() => handleRituSelect(ritu.name)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-2xl">{ritu.emoji}</span>
                        {ritu.name}
                      </CardTitle>
                      {ritu.current && (
                        <Badge variant="secondary" className="bg-primary/20 text-primary">
                          Current
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{ritu.description}</p>
                    <div className="space-y-1">
                      {ritu.months.map(month => (
                        <div key={month} className="text-xs bg-muted/50 rounded px-2 py-1">
                          {month}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Month View - Paksha Columns */}
        {currentView === 'month' && (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Śukla Paksha */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  Śukla Paksha (Waxing)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 15 }, (_, i) => {
                    const tithiNum = i + 1;
                    const isToday = tithiNum === panchangaData?.tithi?.index && panchangaData?.paksha === 'Śukla';
                    return (
                      <motion.div
                        key={`sukla-${tithiNum}`}
                        whileHover={{ scale: 1.05 }}
                        className={`p-2 rounded-lg text-center text-sm border cursor-pointer transition-all ${
                          isToday 
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary/50 shadow-lg' 
                            : 'hover:bg-muted/50 border-border'
                        }`}
                        onClick={() => handleMonthSelect(selectedMonth)}
                      >
                        {tithiNum}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Kṛṣṇa Paksha */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                  Kṛṣṇa Paksha (Waning)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 15 }, (_, i) => {
                    const tithiNum = i + 1;
                    const isToday = tithiNum === panchangaData?.tithi?.index && panchangaData?.paksha === 'Kṛṣṇa';
                    return (
                      <motion.div
                        key={`krishna-${tithiNum}`}
                        whileHover={{ scale: 1.05 }}
                        className={`p-2 rounded-lg text-center text-sm border cursor-pointer transition-all ${
                          isToday 
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary/50 shadow-lg' 
                            : 'hover:bg-muted/50 border-border'
                        }`}
                        onClick={() => handleMonthSelect(selectedMonth)}
                      >
                        {tithiNum}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Day View - Default Dashboard */}
        {currentView === 'day' && panchangaData && (
          <motion.div
            key="day"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Day Header */}
            <Card className="bg-gradient-to-r from-primary/10 via-background to-accent/10">
              <CardContent className="pt-6">
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
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Add Task</Button>
                    <Button size="sm">Write Sankalpa</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};