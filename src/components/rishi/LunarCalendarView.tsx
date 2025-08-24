import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Sunrise, Sunset, Moon, Sun, Calendar, Plus, MapPin } from 'lucide-react';
import { RITUS } from '@/types/panchanga';
import { format, parseISO, addDays, startOfDay, getDay } from 'date-fns';

type ViewType = 'year' | 'ritu' | 'month' | 'paksha' | 'day';

interface LunarCalendarViewProps {
  panchangaData: any;
  onDateSelect?: (date: string) => void;
}

// Authentic Tithi names mapping
const TITHI_NAMES = [
  'Pratipada', 'Dvitīyā', 'Tṛtīyā', 'Chaturthī', 'Pañchamī',
  'Ṣaṣṭhī', 'Saptamī', 'Aṣṭamī', 'Navamī', 'Daśamī',
  'Ekādaśī', 'Dvādaśī', 'Trayodaśī', 'Chaturdaśī', 'Pūrṇimā/Amāvasyā'
];

// Hindu lunar month mapping with Gregorian approximation
const HINDU_MONTHS = {
  'Chaitra': { start: [3, 21], end: [4, 20] },      // March 21 - April 20
  'Vaishākha': { start: [4, 21], end: [5, 20] },    // April 21 - May 20
  'Jyeṣṭha': { start: [5, 21], end: [6, 20] },      // May 21 - June 20
  'Āṣāḍha': { start: [6, 21], end: [7, 20] },       // June 21 - July 20
  'Śrāvaṇa': { start: [7, 21], end: [8, 20] },      // July 21 - August 20
  'Bhādrapada': { start: [8, 21], end: [9, 20] },   // August 21 - September 20
  'Āśvina': { start: [9, 21], end: [10, 20] },      // September 21 - October 20
  'Kārtika': { start: [10, 21], end: [11, 20] },    // October 21 - November 20
  'Agrahāyaṇa': { start: [11, 21], end: [12, 20] }, // November 21 - December 20
  'Pauṣa': { start: [12, 21], end: [1, 20] },       // December 21 - January 20
  'Māgha': { start: [1, 21], end: [2, 18] },        // January 21 - February 18
  'Phālguna': { start: [2, 19], end: [3, 20] }      // February 19 - March 20
};

// Generate Hindu lunar month days with Gregorian dates
const generateHinduMonthDays = (hinduMonth: string, year: number = new Date().getFullYear()) => {
  const monthData = HINDU_MONTHS[hinduMonth as keyof typeof HINDU_MONTHS];
  if (!monthData) return [];

  const days = [];
  let currentDate = new Date(year, monthData.start[0] - 1, monthData.start[1]);
  let endDate = new Date(year, monthData.end[0] - 1, monthData.end[1]);
  
  // Handle year boundary crossing (like Pauṣa: Dec 21 - Jan 20)
  if (monthData.start[0] > monthData.end[0]) {
    endDate = new Date(year + 1, monthData.end[0] - 1, monthData.end[1]);
  }

  let tithiCounter = 1;
  let paksha: 'Śukla' | 'Kṛṣṇa' = 'Śukla';

  while (currentDate <= endDate) {
    const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Calculate moon phase based on tithi
    let moonPhase = '🌑';
    let moonIllumination = 0;
    
    if (paksha === 'Śukla') {
      moonIllumination = (tithiCounter / 15) * 100;
      if (tithiCounter <= 3) moonPhase = '🌒';
      else if (tithiCounter <= 7) moonPhase = '🌓';
      else if (tithiCounter <= 11) moonPhase = '🌔';
      else if (tithiCounter <= 14) moonPhase = '🌕';
      else moonPhase = '🌕'; // Purnima
    } else {
      moonIllumination = ((15 - tithiCounter) / 15) * 100;
      if (tithiCounter <= 3) moonPhase = '🌖';
      else if (tithiCounter <= 7) moonPhase = '🌗';
      else if (tithiCounter <= 11) moonPhase = '🌘';
      else if (tithiCounter <= 14) moonPhase = '🌑';
      else moonPhase = '🌑'; // Amavasya
    }

    // Sample festivals based on tithi
    const festivals = [];
    if (tithiCounter === 4 && paksha === 'Śukla' && hinduMonth === 'Bhādrapada') {
      festivals.push({ name: 'Gaṇeśa Chaturthi', importance: 'High' });
    }
    if (tithiCounter === 15 && paksha === 'Śukla') {
      festivals.push({ name: 'Pūrṇimā', importance: 'Medium' });
    }
    if (tithiCounter === 15 && paksha === 'Kṛṣṇa') {
      festivals.push({ name: 'Amāvasyā', importance: 'Medium' });
    }

    const tithiName = paksha === 'Śukla' && tithiCounter === 15 ? 'Pūrṇimā' : 
                      paksha === 'Kṛṣṇa' && tithiCounter === 15 ? 'Amāvasyā' :
                      TITHI_NAMES[tithiCounter - 1];

    days.push({
      gregorianDate: format(currentDate, 'yyyy-MM-dd'),
      gregorianDisplay: format(currentDate, 'd'),
      gregorianMonthDate: format(currentDate, 'd-MMM'),
      tithi: tithiCounter,
      tithiName,
      paksha,
      moonPhase,
      moonIllumination,
      festivals,
      isToday: format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
      taskCount: Math.floor(Math.random() * 4) // Mock task count
    });

    currentDate = addDays(currentDate, 1);
    tithiCounter++;

    // Switch paksha after 15 days
    if (tithiCounter > 15) {
      tithiCounter = 1;
      paksha = paksha === 'Śukla' ? 'Kṛṣṇa' : 'Śukla';
    }
  }

  return days;
};

export const LunarCalendarView: React.FC<LunarCalendarViewProps> = ({ 
  panchangaData, 
  onDateSelect 
}) => {
  const [currentView, setCurrentView] = useState<ViewType>('month');
  const [selectedRitu, setSelectedRitu] = useState<string>('Varṣā');
  const [selectedMonth, setSelectedMonth] = useState<string>('Bhādrapada');
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const handleRituSelect = (ritu: string) => {
    setSelectedRitu(ritu);
    setCurrentView('ritu');
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setCurrentView('month');
  };

  const handleDaySelect = (day: any) => {
    setSelectedDay(day);
    setTaskDialogOpen(true);
    if (onDateSelect) {
      onDateSelect(day.gregorianDate);
    }
  };

  const handleBackToYear = () => setCurrentView('year');
  const handleBackToRitu = () => setCurrentView('ritu');
  const handleBackToMonth = () => setCurrentView('month');

  // Generate days for current Hindu month
  const hinduMonthDays = generateHinduMonthDays(selectedMonth);

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
              onClick={handleBackToRitu}
              className={currentView === 'ritu' ? 'text-primary font-medium' : ''}
            >
              {selectedRitu}
            </Button>
          </>
        )}
        {(currentView === 'month' || currentView === 'paksha' || currentView === 'day') && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToMonth}
              className={currentView === 'month' ? 'text-primary font-medium' : ''}
            >
              {selectedMonth}
            </Button>
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

        {/* Ritu View - Months in Season */}
        {currentView === 'ritu' && (
          <motion.div
            key="ritu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{selectedRitu} Ritu</h2>
              <p className="text-sm text-muted-foreground">Select a lunar month</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {RITUS.find(r => r.name === selectedRitu)?.months.map((month, index) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                    onClick={() => handleMonthSelect(month)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{month}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Hindu lunar month spanning Gregorian dates
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Month View - Hindu Month with Separated Paksha */}
        {currentView === 'month' && (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Month Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{selectedMonth}</h2>
              <p className="text-sm text-muted-foreground">
                Hindu lunar month • {hinduMonthDays.length} days • Click any day to schedule tasks
              </p>
            </div>
            
            {(() => {
              // Separate days by paksha
              const shuklaDays = hinduMonthDays.filter(day => day.paksha === 'Śukla');
              const krishnaDays = hinduMonthDays.filter(day => day.paksha === 'Kṛṣṇa');
              
              return (
                <div className="space-y-8">
                  {/* Shukla Paksha */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-full"></div>
                      <h3 className="text-lg font-semibold">Śukla Pakṣa (Waxing Moon)</h3>
                      <span className="text-sm text-muted-foreground">• {shuklaDays.length} days</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
                      {shuklaDays.map((day, index) => (
                        <motion.div
                          key={day.gregorianDate}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          className={`relative cursor-pointer transition-all duration-200 ${
                            day.isToday 
                              ? 'ring-2 ring-primary shadow-lg' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => handleDaySelect(day)}
                        >
                          <Card className={`h-24 ${
                            day.isToday 
                              ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30' 
                              : 'hover:bg-muted/30'
                          }`}>
                            <CardContent className="p-2 h-full flex flex-col justify-between">
                              {/* Gregorian Date & Moon */}
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {day.gregorianMonthDate}
                                </span>
                                <span className="text-sm">{day.moonPhase}</span>
                              </div>
                              
                              {/* Tithi Name */}
                              <div className="text-center flex-1 flex items-center justify-center">
                                <div className="text-xs font-medium">
                                  {day.tithiName}
                                </div>
                              </div>
                              
                              {/* Bottom indicators */}
                              <div className="flex items-center justify-between">
                                {/* Festival indicator */}
                                {day.festivals.length > 0 && (
                                  <Badge variant="secondary" className="text-xs px-1 py-0 h-3">
                                    {day.festivals.length}
                                  </Badge>
                                )}
                                
                                {/* Task indicator */}
                                {day.taskCount > 0 && (
                                  <div className="flex gap-1">
                                    {Array.from({ length: Math.min(day.taskCount, 3) }).map((_, i) => (
                                      <div key={i} className="w-1 h-1 bg-primary rounded-full" />
                                    ))}
                                    {day.taskCount > 3 && (
                                      <span className="text-xs text-primary">+</span>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              {/* Today indicator */}
                              {day.isToday && (
                                <div className="absolute -top-1 -right-1">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Krishna Paksha */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full"></div>
                      <h3 className="text-lg font-semibold">Kṛṣṇa Pakṣa (Waning Moon)</h3>
                      <span className="text-sm text-muted-foreground">• {krishnaDays.length} days</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
                      {krishnaDays.map((day, index) => (
                        <motion.div
                          key={day.gregorianDate}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          className={`relative cursor-pointer transition-all duration-200 ${
                            day.isToday 
                              ? 'ring-2 ring-primary shadow-lg' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => handleDaySelect(day)}
                        >
                          <Card className={`h-24 ${
                            day.isToday 
                              ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30' 
                              : 'hover:bg-muted/30'
                          }`}>
                            <CardContent className="p-2 h-full flex flex-col justify-between">
                              {/* Gregorian Date & Moon */}
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {day.gregorianMonthDate}
                                </span>
                                <span className="text-sm">{day.moonPhase}</span>
                              </div>
                              
                              {/* Tithi Name */}
                              <div className="text-center flex-1 flex items-center justify-center">
                                <div className="text-xs font-medium">
                                  {day.tithiName}
                                </div>
                              </div>
                              
                              {/* Bottom indicators */}
                              <div className="flex items-center justify-between">
                                {/* Festival indicator */}
                                {day.festivals.length > 0 && (
                                  <Badge variant="secondary" className="text-xs px-1 py-0 h-3">
                                    {day.festivals.length}
                                  </Badge>
                                )}
                                
                                {/* Task indicator */}
                                {day.taskCount > 0 && (
                                  <div className="flex gap-1">
                                    {Array.from({ length: Math.min(day.taskCount, 3) }).map((_, i) => (
                                      <div key={i} className="w-1 h-1 bg-primary rounded-full" />
                                    ))}
                                    {day.taskCount > 3 && (
                                      <span className="text-xs text-primary">+</span>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              {/* Today indicator */}
                              {day.isToday && (
                                <div className="absolute -top-1 -right-1">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
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

      {/* Day Task Scheduling Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Task
            </DialogTitle>
          </DialogHeader>
          {selectedDay && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">
                      {format(new Date(selectedDay.gregorianDate), 'EEEE, MMMM do, yyyy')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedDay.paksha} Paksha • Tithi {selectedDay.tithi}
                    </div>
                  </div>
                  <div className="text-2xl">{selectedDay.moonPhase}</div>
                </div>
                
                {selectedDay.festivals.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Festivals:</div>
                    {selectedDay.festivals.map((festival: any, index: number) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {festival.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button className="w-full flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task for This Day
                </Button>
                
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Set Daily Reminder
                </Button>
                
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  View Day Details
                </Button>
              </div>

              {selectedDay.taskCount > 0 && (
                <div className="border-t pt-3">
                  <div className="text-sm font-medium mb-2">
                    Existing Tasks: {selectedDay.taskCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Click "Add Task" to schedule something new for this day
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};