// Main Lunar Calendar Component - Entry point for all zoom levels
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTodayPanchang, useCurrentLunarContext, useYearData, usePanchangData } from '@/hooks/usePanchang';
import { ZoomLevel, NavigationState, Location, LUNAR_MONTHS, RITU_SEASONS, LunarMonth, RituType, LunarDay } from '@/types/lunar';
import { Calendar, Moon, Sun, Star, ArrowLeft, ArrowRight, Leaf, Snowflake, CloudRain, Trees, Flower2, Mountain } from 'lucide-react';
import { format, addDays, startOfYear, addMonths, isSameDay } from 'date-fns';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Default location (can be made configurable later)
const DEFAULT_LOCATION: Location = {
  latitude: 19.0760,
  longitude: 72.8777,
  timezone: 'Asia/Kolkata',
  city: 'Mumbai',
  country: 'India'
};

// Utility function to calculate lunar month boundaries based on actual lunar cycles
const calculateLunarMonthBoundaries = (year: number, month: LunarMonth): { start: Date; end: Date } => {
  // This is a more accurate calculation based on traditional Hindu calendar
  // Each lunar month starts around the new moon and lasts approximately 29.5 days
  
  const lunarMonthStartDates: Record<LunarMonth, { month: number; day: number }> = {
    chaitra: { month: 2, day: 22 },      // March 22 (Chaitra typically starts in late March)
    vaisakha: { month: 3, day: 21 },     // April 21
    jyeshtha: { month: 4, day: 21 },     // May 21
    ashadha: { month: 5, day: 20 },      // June 20
    shravana: { month: 6, day: 20 },     // July 20
    bhadrapada: { month: 7, day: 19 },   // August 19
    ashvina: { month: 8, day: 18 },      // September 18
    kartika: { month: 9, day: 18 },      // October 18
    margasirsha: { month: 10, day: 17 }, // November 17
    pausha: { month: 11, day: 17 },      // December 17
    magha: { month: 0, day: 16 },        // January 16
    phalguna: { month: 1, day: 15 },     // February 15
  };

  const startDate = new Date(year, lunarMonthStartDates[month].month, lunarMonthStartDates[month].day);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 29); // Lunar months are typically 29-30 days

  return { start: startDate, end: endDate };
};

export const LunarCalendar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<LunarMonth | null>(null);
  
  // Get view from URL params, default to 'day'
  const currentZoom = (searchParams.get('view') as ZoomLevel) || 'day';
  
  // Fetch data based on current view
  const { data: todayData, isLoading: todayLoading, error: todayError } = useTodayPanchang(DEFAULT_LOCATION);
  const { data: lunarContext, isLoading: contextLoading } = useCurrentLunarContext(DEFAULT_LOCATION);
  const { data: yearData, isLoading: yearLoading } = useYearData(selectedYear, DEFAULT_LOCATION, currentZoom === 'year');

  // Fetch month data when in month view
  const currentMonth = selectedMonth || todayData?.lunarMonth || 'chaitra';
  const monthBoundaries = calculateLunarMonthBoundaries(selectedYear, currentMonth);
  const { data: monthData, isLoading: monthLoading } = usePanchangData(
    monthBoundaries.start,
    monthBoundaries.end,
    DEFAULT_LOCATION,
    currentZoom === 'month'
  );

  // Update URL when zoom level changes
  const handleZoomChange = (newZoom: ZoomLevel) => {
    setSearchParams({ view: newZoom });
  };

  if (todayLoading || contextLoading || (currentZoom === 'year' && yearLoading) || (currentZoom === 'month' && monthLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-paksha-shukla-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-2xl text-gray-700 font-medium">Loading lunar calendar...</div>
        </div>
      </div>
    );
  }

  if (todayError || !todayData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🌙</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Lunar Data Unavailable</h2>
            <p className="text-gray-600 mb-4">
              Unable to fetch panchang data. Please check your connection or try again later.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-paksha-shukla-500 hover:bg-paksha-shukla-600"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderZoomNavigation = () => {
    const zoomLevels: { level: ZoomLevel; label: string; icon: React.ReactNode }[] = [
      { level: 'year', label: 'Year', icon: <Calendar className="w-4 h-4" /> },
      { level: 'ritu', label: 'Season', icon: <Star className="w-4 h-4" /> },
      { level: 'month', label: 'Month', icon: <Calendar className="w-4 h-4" /> },
      { level: 'paksha', label: 'Paksha', icon: <Moon className="w-4 h-4" /> },
      { level: 'day', label: 'Day', icon: <Sun className="w-4 h-4" /> },
    ];

    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {zoomLevels.map(({ level, label, icon }) => (
          <Button
            key={level}
            variant={currentZoom === level ? "default" : "outline"}
            size="sm"
            onClick={() => handleZoomChange(level)}
            className={currentZoom === level 
              ? "bg-paksha-shukla-500 text-white" 
              : "border-paksha-shukla-300 hover:bg-paksha-shukla-50"
            }
          >
            {icon}
            <span className="ml-2">{label}</span>
          </Button>
        ))}
      </div>
    );
  };

  const renderYearView = () => {
    const months = Object.entries(LUNAR_MONTHS);
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-800">
                📅 Year {selectedYear} - Lunar Calendar
              </span>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedYear(selectedYear - 1)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  {selectedYear - 1}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedYear(selectedYear + 1)}
                >
                  {selectedYear + 1}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {months.map(([monthKey, monthData]) => {
                const month = monthKey as LunarMonth;
                const isCurrentMonth = month === todayData?.lunarMonth;
                const monthBoundaries = calculateLunarMonthBoundaries(selectedYear, month);
                
                return (
                  <Card 
                    key={month}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      isCurrentMonth ? 'ring-2 ring-paksha-shukla-500 animate-chandra-pulse' : ''
                    }`}
                    onClick={() => {
                      setSelectedMonth(month);
                      handleZoomChange('month');
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🌙</div>
                      <h3 className="font-bold text-gray-800 mb-1">
                        {monthData.sanskrit}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize mb-2">
                        {month}
                      </p>
                      <div className="text-xs text-blue-600 mb-2">
                        {format(monthBoundaries.start, 'MMM d')} - {format(monthBoundaries.end, 'MMM d')}
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs mb-1"
                      >
                        Lunar Month {monthData.number}
                      </Badge>
                      {isCurrentMonth && (
                        <div className="mt-2">
                          <Badge className="bg-paksha-shukla-100 text-paksha-shukla-700 text-xs">
                            Current
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {yearData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">
                📊 Year {selectedYear} Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{yearData.totalFestivals}</div>
                  <div className="text-sm text-green-600">Total Festivals</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">6</div>
                  <div className="text-sm text-blue-600">Ritu Seasons</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">12</div>
                  <div className="text-sm text-purple-600">Lunar Months</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-700">24</div>
                  <div className="text-sm text-amber-600">Pakshas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderRituView = () => {
    const seasons = Object.values(RITU_SEASONS);
    
    const getCurrentSeason = () => {
      if (!todayData) return null;
      return seasons.find(season => season.months.includes(todayData.lunarMonth));
    };
    
    const currentSeason = getCurrentSeason();
    
    const getSeasonIcon = (seasonName: RituType) => {
      const icons = {
        vasant: <Flower2 className="w-8 h-8" />,
        grishma: <Sun className="w-8 h-8" />,
        varsha: <CloudRain className="w-8 h-8" />,
        sharad: <Leaf className="w-8 h-8" />,
        hemant: <Trees className="w-8 h-8" />,
        shishir: <Snowflake className="w-8 h-8" />
      };
      return icons[seasonName] || <Star className="w-8 h-8" />;
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800">
              🌸 Ritu - Seasonal Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              The six seasons (Ritu) of the Hindu calendar, each with unique characteristics and Ayurvedic guidance.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seasons.map((season) => {
                const isCurrentSeason = currentSeason?.name === season.name;
                
                return (
                  <Card 
                    key={season.name}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      isCurrentSeason ? 'ring-2 ring-green-500 animate-chandra-pulse' : ''
                    } ${season.colorClass} border-0`}
                    onClick={() => handleZoomChange('month')}
                  >
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="flex justify-center mb-3 text-gray-700">
                          {getSeasonIcon(season.name)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {season.displayName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {season.description}
                        </p>
                        {isCurrentSeason && (
                          <Badge className="bg-green-100 text-green-700 mb-3">
                            Current Season
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-700 text-sm mb-1">Months:</h4>
                          <div className="flex flex-wrap gap-1">
                            {season.months.map(month => (
                              <Badge key={month} variant="outline" className="text-xs">
                                {LUNAR_MONTHS[month].sanskrit}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-700 text-sm mb-1">Characteristics:</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {season.characteristics.slice(0, 2).map((char, index) => (
                              <li key={index}>• {char}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-700 text-sm mb-1">Ayurvedic Tips:</h4>
                          <div className="text-xs text-gray-600">
                            <p>• {season.aharVihaar.diet[0]}</p>
                            <p>• {season.aharVihaar.lifestyle[0]}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthInfo = LUNAR_MONTHS[currentMonth];
    const monthBoundaries = calculateLunarMonthBoundaries(selectedYear, currentMonth);
    
    // Use actual panchang data if available, otherwise generate sample data
    const generateMonthTithis = (): Array<{
      day: number;
      tithiNumber: number;
      paksha: 'shukla' | 'krishna';
      isToday: boolean;
      gregorianDate: Date;
      isPurnima: boolean;
      isAmavasya: boolean;
      isEkadashi: boolean;
      festivals: string[];
      auspiciousness: 'shubh' | 'ashubh' | 'mixed';
      lunarDay?: LunarDay;
    }> => {
      const tithis = [];
      
      if (monthData && monthData.data && monthData.data.length > 0) {
        // Use actual panchang data
        return monthData.data.map((lunarDay, index) => ({
          day: index + 1,
          tithiNumber: lunarDay.tithiNumber,
          paksha: lunarDay.paksha,
          isToday: lunarDay.isToday,
          gregorianDate: lunarDay.dateGreg,
          isPurnima: lunarDay.isPurnima,
          isAmavasya: lunarDay.isAmavasya,
          isEkadashi: lunarDay.isEkadashi,
          festivals: lunarDay.festivals,
          auspiciousness: lunarDay.auspiciousness,
          lunarDay
        }));
      } else {
        // Generate sample data based on lunar month boundaries
        const startDate = monthBoundaries.start;
        const today = new Date();
        
        for (let i = 1; i <= 30; i++) {
          const gregorianDate = addDays(startDate, i - 1);
          const paksha = i <= 15 ? 'shukla' : 'krishna';
          const tithiNumber = i <= 15 ? i : i - 15;
          const isToday = isSameDay(gregorianDate, today);
          
          tithis.push({
            day: i,
            tithiNumber,
            paksha,
            isToday,
            gregorianDate,
            isPurnima: tithiNumber === 15 && paksha === 'shukla',
            isAmavasya: tithiNumber === 15 && paksha === 'krishna',
            isEkadashi: tithiNumber === 11,
            festivals: tithiNumber === 15 && paksha === 'shukla' ? ['Purnima'] : 
                      tithiNumber === 15 && paksha === 'krishna' ? ['Amavasya'] : [],
            auspiciousness: tithiNumber === 11 || (tithiNumber === 15 && paksha === 'shukla') ? 'shubh' : 
                           (tithiNumber === 15 && paksha === 'krishna') ? 'ashubh' : 'mixed'
          });
        }
      }
      
      return tithis;
    };

    const monthTithis = generateMonthTithis();

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-gray-800 block">
                  🗓️ {monthInfo.sanskrit}
                </span>
                <span className="text-lg text-gray-600">
                  {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} • {format(monthBoundaries.start, 'MMMM d')} - {format(monthBoundaries.end, 'MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleZoomChange('year')}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Year View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleZoomChange('ritu')}
                >
                  <Star className="w-4 h-4 mr-1" />
                  Seasons
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-paksha-shukla-50 rounded-lg">
                  <h3 className="font-semibold text-paksha-shukla-700 mb-2">Shukla Paksha</h3>
                  <p className="text-sm text-gray-600">Waxing Moon (Days 1-15)</p>
                </div>
                <div className="p-4 bg-paksha-krishna-50 rounded-lg">
                  <h3 className="font-semibold text-paksha-krishna-700 mb-2">Krishna Paksha</h3>
                  <p className="text-sm text-gray-600">Waning Moon (Days 16-30)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 md:grid-cols-7 gap-2">
              {monthTithis.map((tithi) => (
                <Card 
                  key={tithi.day}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    tithi.isToday ? 'ring-2 ring-paksha-shukla-500 animate-chandra-pulse' : ''
                  } ${tithi.paksha === 'shukla' ? 'bg-paksha-shukla-50' : 'bg-paksha-krishna-50'}`}
                  onClick={() => handleZoomChange('paksha')}
                >
                  <CardContent className="p-2 text-center">
                    <div className="text-xs text-blue-600 mb-1">
                      {format(tithi.gregorianDate, 'MMM d')}
                    </div>
                    <div className="text-lg font-bold text-gray-800 mb-1">
                      {tithi.tithiNumber}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {tithi.paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'}
                    </div>
                    <div className="flex justify-center mb-1">
                      {tithi.isPurnima && <span className="text-lg">🌕</span>}
                      {tithi.isAmavasya && <span className="text-lg">🌑</span>}
                      {tithi.isEkadashi && <span className="text-lg">⭐</span>}
                      {!tithi.isPurnima && !tithi.isAmavasya && !tithi.isEkadashi && (
                        <span className="text-lg">
                          {tithi.paksha === 'shukla' ? '🌒' : '🌘'}
                        </span>
                      )}
                    </div>
                    {tithi.festivals.map((festival, index) => (
                      <Badge key={index} variant="secondary" className="text-xs mb-1">
                        {festival}
                      </Badge>
                    ))}
                    <div className={`w-2 h-2 rounded-full mx-auto ${
                      tithi.auspiciousness === 'shubh' ? 'bg-green-400' :
                      tithi.auspiciousness === 'ashubh' ? 'bg-red-400' : 'bg-yellow-400'
                    }`}></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPakshaView = () => {
    const currentPaksha = todayData?.paksha || 'shukla';
    const currentTithi = todayData?.tithiNumber || 8;
    const monthBoundaries = calculateLunarMonthBoundaries(selectedYear, currentMonth);
    
    const generatePakshaTithis = () => {
      const tithis = [];
      // Start from either beginning of month (shukla) or middle (krishna)
      const pakshaStart = currentPaksha === 'shukla' ? monthBoundaries.start : addDays(monthBoundaries.start, 15);
      const today = new Date();
      
      for (let i = 1; i <= 15; i++) {
        const gregorianDate = addDays(pakshaStart, i - 1);
        tithis.push({
          tithiNumber: i,
          gregorianDate,
          isToday: isSameDay(gregorianDate, today),
          isPurnima: i === 15 && currentPaksha === 'shukla',
          isAmavasya: i === 15 && currentPaksha === 'krishna',
          isEkadashi: i === 11,
          moonPhase: currentPaksha === 'shukla' ? (i / 15) * 100 : ((15 - i) / 15) * 100
        });
      }
      return tithis;
    };

    const pakshaTitle = currentPaksha === 'shukla' ? 'शुक्ल पक्ष (Shukla Paksha)' : 'कृष्ण पक्ष (Krishna Paksha)';
    const pakshaDesc = currentPaksha === 'shukla' ? 'Waxing Moon - Growing Light' : 'Waning Moon - Diminishing Light';
    
    const pakshaData = generatePakshaTithis();

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-gray-800 block">
                  🌙 {pakshaTitle}
                </span>
                <span className="text-lg text-gray-600">
                  {format(pakshaData[0].gregorianDate, 'MMMM d')} - {format(pakshaData[14].gregorianDate, 'MMMM d, yyyy')}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleZoomChange('month')}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Month View
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-lg text-gray-600 mb-4">{pakshaDesc}</p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant={currentPaksha === 'shukla' ? 'default' : 'outline'}
                  size="sm"
                  className="bg-paksha-shukla-500"
                >
                  Shukla Paksha
                </Button>
                <Button
                  variant={currentPaksha === 'krishna' ? 'default' : 'outline'}
                  size="sm"
                  className="bg-paksha-krishna-500"
                >
                  Krishna Paksha
                </Button>
              </div>
            </div>

            {/* Horizontal Timeline */}
            <div className="relative mb-8">
              <div className="flex justify-between items-center mb-4">
                {pakshaData.map((tithi) => (
                  <div 
                    key={tithi.tithiNumber}
                    className={`relative cursor-pointer transition-all duration-300 ${
                      tithi.isToday ? 'transform scale-125' : 'hover:scale-110'
                    }`}
                    onClick={() => handleZoomChange('day')}
                  >
                    <div 
                      className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-sm font-bold ${
                        tithi.isToday 
                          ? 'bg-paksha-shukla-500 text-white border-paksha-shukla-600 animate-chandra-pulse' 
                          : tithi.isPurnima || tithi.isAmavasya 
                            ? 'bg-lunar-gold text-gray-800 border-lunar-gold'
                            : tithi.isEkadashi
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                      style={{
                        background: tithi.isToday ? undefined : 
                                   tithi.isPurnima || tithi.isAmavasya ? undefined :
                                   `conic-gradient(from 0deg, #e5e7eb ${tithi.moonPhase}%, transparent ${tithi.moonPhase}%)`
                      }}
                    >
                      {tithi.tithiNumber}
                    </div>
                    
                    {/* Labels */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                      <div className="text-xs text-blue-600 mb-1">
                        {format(tithi.gregorianDate, 'MMM d')}
                      </div>
                      <div className="text-xs text-gray-600">
                        {tithi.isPurnima && '🌕'}
                        {tithi.isAmavasya && '🌑'}
                        {tithi.isEkadashi && '⭐'}
                      </div>
                      {tithi.isToday && (
                        <Badge className="bg-paksha-shukla-100 text-paksha-shukla-700 text-xs mt-1">
                          Today
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Connecting Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-300 -z-10"></div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-lg mb-1">🌑</div>
                <div className="text-sm font-medium">Amavasya</div>
                <div className="text-xs text-gray-600">New Moon</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg mb-1">⭐</div>
                <div className="text-sm font-medium">Ekadashi</div>
                <div className="text-xs text-gray-600">11th Tithi</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg mb-1">🌕</div>
                <div className="text-sm font-medium">Purnima</div>
                <div className="text-xs text-gray-600">Full Moon</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg mb-1">🌙</div>
                <div className="text-sm font-medium">Regular Tithi</div>
                <div className="text-xs text-gray-600">Other Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="space-y-6">
        {/* Navigation breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button onClick={() => handleZoomChange('year')} className="hover:text-gray-800">Year</button>
          <span>→</span>
          <button onClick={() => handleZoomChange('ritu')} className="hover:text-gray-800">Season</button>
          <span>→</span>
          <button onClick={() => handleZoomChange('month')} className="hover:text-gray-800">Month</button>
          <span>→</span>
          <button onClick={() => handleZoomChange('paksha')} className="hover:text-gray-800">Paksha</button>
          <span>→</span>
          <span className="font-medium text-gray-800">Day</span>
        </div>

        {/* Today's Panchang Card */}
        <Card className="animate-chandra-pulse">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-800">
                🌙 Today's Panchāṅga
              </span>
              <Badge variant="outline" className="text-paksha-shukla-600 border-paksha-shukla-300">
                {format(currentDate, 'MMMM dd, yyyy')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Lunar Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-paksha-shukla-50 rounded-lg">
                <h3 className="font-semibold text-paksha-shukla-700 mb-2">Lunar Date</h3>
                <p className="text-lg font-medium text-gray-800">{todayData.dateLunar}</p>
                <p className="text-sm text-gray-600">
                  Tithi {todayData.tithiNumber} • {todayData.paksha === 'shukla' ? 'Shukla Paksha' : 'Krishna Paksha'}
                </p>
              </div>
              
              <div className="p-4 bg-paksha-krishna-50 rounded-lg">
                <h3 className="font-semibold text-paksha-krishna-700 mb-2">Moon Phase</h3>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">
                    {todayData.isPurnima ? '🌕' : 
                     todayData.isAmavasya ? '🌑' : 
                     todayData.paksha === 'shukla' ? '🌒' : '🌘'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {todayData.moonPhasePercentage.toFixed(0)}% illuminated
                    </p>
                    <p className="text-sm text-gray-600">
                      {todayData.isPurnima ? 'Purnima (Full Moon)' :
                       todayData.isAmavasya ? 'Amavasya (New Moon)' :
                       todayData.paksha === 'shukla' ? 'Waxing' : 'Waning'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Panchang Elements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <h4 className="font-medium text-gray-700 text-sm">Nakshatra</h4>
                <p className="text-lg font-semibold text-gray-800">{todayData.nakshatra}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <h4 className="font-medium text-gray-700 text-sm">Yoga</h4>
                <p className="text-lg font-semibold text-gray-800">{todayData.yoga}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <h4 className="font-medium text-gray-700 text-sm">Karana</h4>
                <p className="text-lg font-semibold text-gray-800">{todayData.karana}</p>
              </div>
            </div>

            {/* Sun and Moon Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <h4 className="font-medium text-amber-700 text-sm flex items-center">
                  <Sun className="w-4 h-4 mr-1" /> Sunrise
                </h4>
                <p className="text-lg font-semibold text-gray-800">{todayData.sunrise}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <h4 className="font-medium text-amber-700 text-sm flex items-center">
                  <Sun className="w-4 h-4 mr-1" /> Sunset
                </h4>
                <p className="text-lg font-semibold text-gray-800">{todayData.sunset}</p>
              </div>
            </div>

            {/* Festivals */}
            {todayData.festivals && todayData.festivals.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                <h4 className="font-medium text-amber-700 mb-2">🎉 Festivals & Observances</h4>
                <div className="flex flex-wrap gap-2">
                  {todayData.festivals.map((festival, index) => (
                    <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800">
                      {festival}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Auspiciousness */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">✨ Auspiciousness</h4>
              <Badge 
                className={
                  todayData.auspiciousness === 'shubh' ? 'bg-green-100 text-green-800' :
                  todayData.auspiciousness === 'ashubh' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }
              >
                {todayData.auspiciousness === 'shubh' ? '🟢 Auspicious (Shubh)' :
                 todayData.auspiciousness === 'ashubh' ? '🔴 Inauspicious (Ashubh)' :
                 '🟡 Mixed'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Current Ritu Context */}
        {lunarContext && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                🌸 Current Season Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-ritu-vasant rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Current Ritu</h4>
                <p className="text-lg font-medium text-gray-800">{lunarContext.currentRitu}</p>
              </div>
              
              {lunarContext.nextSignificantDay && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2">Next Significant Day</h4>
                  <p className="font-medium text-gray-800">
                    {lunarContext.nextSignificantDay.dateLunar}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(lunarContext.nextSignificantDay.dateGreg, 'MMMM dd, yyyy')}
                  </p>
                  {lunarContext.nextSignificantDay.festivals.length > 0 && (
                    <div className="mt-2">
                      {lunarContext.nextSignificantDay.festivals.map((festival, index) => (
                        <Badge key={index} variant="outline" className="mr-1 text-blue-700">
                          {festival}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {lunarContext.daysUntilPurnima > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-800">{lunarContext.daysUntilPurnima}</p>
                    <p className="text-sm text-gray-600">days until Purnima</p>
                  </div>
                )}
                {lunarContext.daysUntilAmavasya > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-800">{lunarContext.daysUntilAmavasya}</p>
                    <p className="text-sm text-gray-600">days until Amavasya</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentZoom) {
      case 'year':
        return renderYearView();
      case 'ritu':
        return renderRituView();
      case 'month':
        return renderMonthView();
      case 'paksha':
        return renderPakshaView();
      case 'day':
      default:
        return renderDayView();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 mb-4">
            🌙 Chandra-Dhara
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Hindu Lunar Calendar & Panchāṅga
          </p>
          <p className="text-gray-600">
            Navigate through the cosmic rhythms of time
          </p>
        </div>

        {/* Zoom Navigation */}
        {renderZoomNavigation()}

        {/* Current View */}
        {renderCurrentView()}
      </div>
    </div>
  );
}; 