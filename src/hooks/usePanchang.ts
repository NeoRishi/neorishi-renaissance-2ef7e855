// Custom hooks for Panchang data using TanStack Query
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { panchangService } from '../lib/panchang';
import {
  PanchangResponse,
  LunarDay,
  Location,
  LunarMonth,
  LunarYearData,
  LunarMonthData,
  PakshaData,
  PakshaType,
  RITU_SEASONS
} from '../types/lunar';
import { addDays, startOfDay, endOfDay } from 'date-fns';

// Default location (Mumbai) - should be replaced with user's location
const DEFAULT_LOCATION: Location = {
  latitude: 19.0760,
  longitude: 72.8777,
  timezone: 'Asia/Kolkata',
  city: 'Mumbai',
  country: 'India'
};

/**
 * Hook to fetch panchang data for a date range
 */
export function usePanchangData(
  startDate: Date,
  endDate: Date,
  location: Location = DEFAULT_LOCATION,
  enabled = true
): UseQueryResult<PanchangResponse, Error> {
  return useQuery({
    queryKey: ['panchang', startDate.toISOString(), endDate.toISOString(), location],
    queryFn: () => panchangService.getPanchangData(startDate, endDate, location),
    enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to fetch today's panchang data
 */
export function useTodayPanchang(
  location: Location = DEFAULT_LOCATION
): UseQueryResult<LunarDay | null, Error> {
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(today);

  return useQuery({
    queryKey: ['today-panchang', today.toISOString(), location],
    queryFn: async () => {
      const response = await panchangService.getPanchangData(today, tomorrow, location);
      return response.success && response.data.length > 0 ? response.data[0] : null;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 3,
  });
}

/**
 * Hook to fetch year data for lunar calendar
 */
export function useYearData(
  year: number,
  location: Location = DEFAULT_LOCATION,
  enabled = true
): UseQueryResult<LunarYearData, Error> {
  return useQuery({
    queryKey: ['lunar-year', year, location],
    queryFn: async () => {
      const response = await panchangService.getYearData(year, location);
      
      if (!response.success) {
        throw new Error('Failed to fetch year data');
      }

      // Transform the response into LunarYearData format
      const yearData: LunarYearData = {
        year,
        months: [], // Will be populated by grouping tithis
        totalFestivals: 0,
        seasons: Object.values(RITU_SEASONS),
        specialYogaEvents: [],
        eclipses: [] // This would come from a separate API in a real implementation
      };

      // Group tithis by lunar month
      const monthsMap = new Map<LunarMonth, LunarDay[]>();
      let totalFestivals = 0;

      response.data.forEach(lunarDay => {
        if (!monthsMap.has(lunarDay.lunarMonth)) {
          monthsMap.set(lunarDay.lunarMonth, []);
        }
        monthsMap.get(lunarDay.lunarMonth)!.push(lunarDay);
        totalFestivals += lunarDay.festivals.length;
      });

             // Convert map to LunarMonthData array
       yearData.months = Array.from(monthsMap.entries()).map(([month, lunarDays]) => {
         const sortedLunarDays = lunarDays.sort((a, b) => a.dateGreg.getTime() - b.dateGreg.getTime());
         return {
           month,
           year,
           gregorianStart: sortedLunarDays[0]?.dateGreg || new Date(year, 0, 1),
           gregorianEnd: sortedLunarDays[sortedLunarDays.length - 1]?.dateGreg || new Date(year, 11, 31),
           tithis: sortedLunarDays,
           majorFestivals: [...new Set(sortedLunarDays.flatMap(t => t.festivals))],
           seasonalTips: [], // Would be populated based on season
           isAdhika: false // Would be calculated based on lunar calendar rules
         } as LunarMonthData;
       });

      yearData.totalFestivals = totalFestivals;

      return yearData;
    },
    enabled,
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days
    retry: 2,
  });
}

/**
 * Hook to fetch specific month data
 */
export function useMonthData(
  year: number,
  month: LunarMonth,
  location: Location = DEFAULT_LOCATION,
  enabled = true
): UseQueryResult<LunarMonthData, Error> {
  return useQuery({
    queryKey: ['lunar-month', year, month, location],
    queryFn: async () => {
      const response = await panchangService.getMonthData(year, month, location);
      
      if (!response.success) {
        throw new Error(`Failed to fetch data for ${month} ${year}`);
      }

             const lunarDays = response.data.filter(lunarDay => lunarDay.lunarMonth === month);
       const sortedLunarDays = lunarDays.sort((a, b) => a.dateGreg.getTime() - b.dateGreg.getTime());

       return {
         month,
         year,
         gregorianStart: sortedLunarDays[0]?.dateGreg || new Date(year, 0, 1),
         gregorianEnd: sortedLunarDays[sortedLunarDays.length - 1]?.dateGreg || new Date(year, 11, 31),
         tithis: sortedLunarDays,
         majorFestivals: [...new Set(sortedLunarDays.flatMap(t => t.festivals))],
         seasonalTips: [], // Would be populated based on the season this month belongs to
         isAdhika: false // Would be calculated based on lunar calendar rules
       } as LunarMonthData;
    },
    enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    retry: 2,
  });
}

/**
 * Hook to fetch paksha data (15-day period)
 */
export function usePakshaData(
  year: number,
  month: LunarMonth,
  paksha: PakshaType,
  location: Location = DEFAULT_LOCATION,
  enabled = true
): UseQueryResult<PakshaData, Error> {
  return useQuery({
    queryKey: ['paksha', year, month, paksha, location],
    queryFn: async () => {
      const response = await panchangService.getMonthData(year, month, location);
      
      if (!response.success) {
        throw new Error(`Failed to fetch paksha data for ${month} ${paksha} ${year}`);
      }

      // Filter tithis for the specific paksha
      const pakshaRange = paksha === 'shukla' ? [1, 15] : [1, 15]; // Both ranges are 1-15
      const pakshaData = response.data.filter(tithi => 
        tithi.lunarMonth === month && 
        tithi.paksha === paksha &&
        tithi.tithiNumber >= pakshaRange[0] && 
        tithi.tithiNumber <= pakshaRange[1]
      );

      const sortedTithis = pakshaData.sort((a, b) => a.tithiNumber - b.tithiNumber);

      // Calculate moon phases for each tithi
      const moonPhases = sortedTithis.map(tithi => ({
        tithi: tithi.tithiNumber,
        phase: getMoonPhaseType(tithi.tithiNumber, paksha),
        percentage: tithi.moonPhasePercentage
      }));

      return {
        type: paksha,
        month,
        year,
        tithis: sortedTithis,
        startDate: sortedTithis[0]?.dateGreg || new Date(),
        endDate: sortedTithis[sortedTithis.length - 1]?.dateGreg || new Date(),
        moonPhases
      } as PakshaData;
    },
    enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    retry: 2,
  });
}

/**
 * Hook to get current lunar context (what tithi, paksha, month we're in)
 */
export function useCurrentLunarContext(
  location: Location = DEFAULT_LOCATION
): UseQueryResult<{
  tithi: LunarDay;
  nextSignificantDay: LunarDay | null;
  daysUntilPurnima: number;
  daysUntilAmavasya: number;
  currentRitu: string;
}, Error> {
  const today = new Date();
  const weekFromNow = addDays(today, 7);

  return useQuery({
    queryKey: ['lunar-context', today.toDateString(), location],
    queryFn: async () => {
      const response = await panchangService.getPanchangData(today, weekFromNow, location);
      
      if (!response.success || response.data.length === 0) {
        throw new Error('Failed to get current lunar context');
      }

      const todayTithi = response.data[0];
      const allTithis = response.data;

      // Find next significant day (Purnima, Amavasya, Ekadashi)
      const nextSignificant = allTithis.find(tithi => 
        tithi.dateGreg > today && (
          tithi.isPurnima || 
          tithi.isAmavasya || 
          tithi.isEkadashi ||
          tithi.festivals.length > 0
        )
      );

      // Calculate days until Purnima and Amavasya
      const daysUntilPurnima = calculateDaysUntilMoonPhase(allTithis, 'purnima');
      const daysUntilAmavasya = calculateDaysUntilMoonPhase(allTithis, 'amavasya');

      // Determine current Ritu based on lunar month
      const currentRitu = Object.values(RITU_SEASONS).find(ritu => 
        ritu.months.includes(todayTithi.lunarMonth)
      )?.displayName || 'Unknown Season';

      return {
        tithi: todayTithi,
        nextSignificantDay: nextSignificant || null,
        daysUntilPurnima,
        daysUntilAmavasya,
        currentRitu
      };
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 12, // 12 hours
    retry: 3,
  });
}

/**
 * Helper function to determine moon phase type
 */
function getMoonPhaseType(
  tithiNumber: number, 
  paksha: PakshaType
): 'new' | 'waxing' | 'full' | 'waning' {
  if (paksha === 'shukla') {
    if (tithiNumber === 1) return 'new';
    if (tithiNumber === 15) return 'full';
    return 'waxing';
  } else {
    if (tithiNumber === 15) return 'new';
    return 'waning';
  }
}

/**
 * Helper function to calculate days until specific moon phase
 */
function calculateDaysUntilMoonPhase(
  tithis: LunarDay[], 
  phase: 'purnima' | 'amavasya'
): number {
  const today = startOfDay(new Date());
  
  const targetTithi = tithis.find(tithi => {
    const tithiDate = startOfDay(tithi.dateGreg);
    return tithiDate > today && (
      phase === 'purnima' ? tithi.isPurnima : tithi.isAmavasya
    );
  });

  if (!targetTithi) return -1;

  const diffTime = targetTithi.dateGreg.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Hook to prefetch next month's data
 */
export function usePrefetchNextMonth(
  currentYear: number,
  currentMonth: LunarMonth,
  location: Location = DEFAULT_LOCATION
) {
  // This would implement prefetching logic for smooth navigation
  // Left as a placeholder for now
}

// Export utility functions for external use
export { getMoonPhaseType, calculateDaysUntilMoonPhase }; 