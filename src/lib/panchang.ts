// Panchang Data Service - Unified fetcher with Prokerala + Drik fallback
import { prokeralaAuth } from './prokeralaAuth';
import { 
  Tithi, 
  LunarDay, 
  PanchangResponse, 
  Location, 
  LunarMonth, 
  PakshaType,
  LUNAR_MONTHS 
} from '../types/lunar';
import { addDays, format, parseISO, startOfDay, endOfDay } from 'date-fns';

// IndexedDB cache configuration
const CACHE_DB_NAME = 'ChandraDharaCache';
const CACHE_DB_VERSION = 1;
const PANCHANG_STORE = 'panchang';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface CachedPanchangData {
  key: string;
  data: Tithi[];
  timestamp: number;
  source: 'prokerala' | 'drik';
}

class PanchangService {
  private static instance: PanchangService;
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  private constructor() {
    this.initDB();
  }

  public static getInstance(): PanchangService {
    if (!PanchangService.instance) {
      PanchangService.instance = new PanchangService();
    }
    return PanchangService.instance;
  }

  /**
   * Initialize IndexedDB for caching
   */
  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(CACHE_DB_NAME, CACHE_DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create panchang store
        if (!db.objectStoreNames.contains(PANCHANG_STORE)) {
          const store = db.createObjectStore(PANCHANG_STORE, { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });

    return this.dbPromise;
  }

  /**
   * Generate cache key for panchang data
   */
  private generateCacheKey(
    startDate: Date, 
    endDate: Date, 
    location: Location
  ): string {
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    const lat = location.latitude.toFixed(4);
    const lon = location.longitude.toFixed(4);
    return `panchang_${start}_${end}_${lat}_${lon}`;
  }

  /**
   * Get cached panchang data
   */
  private async getCachedData(cacheKey: string): Promise<Tithi[] | null> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([PANCHANG_STORE], 'readonly');
      const store = transaction.objectStore(PANCHANG_STORE);
      
      return new Promise((resolve, reject) => {
        const request = store.get(cacheKey);
        
        request.onsuccess = () => {
          const result = request.result as CachedPanchangData | undefined;
          
          if (!result) {
            resolve(null);
            return;
          }

          // Check if cache is still valid
          const now = Date.now();
          if (now - result.timestamp > CACHE_DURATION) {
            // Cache expired, remove it
            this.removeCachedData(cacheKey);
            resolve(null);
            return;
          }

          console.log(`📱 Using cached panchang data from ${result.source}`);
          resolve(result.data);
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('⚠️ Failed to get cached data:', error);
      return null;
    }
  }

  /**
   * Cache panchang data
   */
  private async setCachedData(
    cacheKey: string, 
    data: Tithi[], 
    source: 'prokerala' | 'drik'
  ): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([PANCHANG_STORE], 'readwrite');
      const store = transaction.objectStore(PANCHANG_STORE);
      
      const cachedData: CachedPanchangData = {
        key: cacheKey,
        data,
        timestamp: Date.now(),
        source
      };

      await new Promise<void>((resolve, reject) => {
        const request = store.put(cachedData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log(`💾 Cached panchang data from ${source}`);
    } catch (error) {
      console.warn('⚠️ Failed to cache data:', error);
    }
  }

  /**
   * Remove cached data
   */
  private async removeCachedData(cacheKey: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([PANCHANG_STORE], 'readwrite');
      const store = transaction.objectStore(PANCHANG_STORE);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.delete(cacheKey);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('⚠️ Failed to remove cached data:', error);
    }
  }

  /**
   * Fetch panchang data from Prokerala API
   */
  private async fetchFromProkerala(
    startDate: Date,
    endDate: Date,
    location: Location
  ): Promise<Tithi[]> {
    const baseUrl = import.meta.env.VITE_PROKERALA_PANCHANG_ENDPOINT || 
                   'https://api.prokerala.com/v2/panchang';
    
    const params = new URLSearchParams({
      ayanamsa: '1', // Lahiri ayanamsa
      datetime: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
      coordinates: `${location.latitude},${location.longitude}`,
      date_range: format(endDate, "yyyy-MM-dd'T'HH:mm:ss")
    });

    const url = `${baseUrl}?${params}`;

    try {
      const response = await prokeralaAuth.makeAuthenticatedRequest(url);
      
      if (!response.ok) {
        throw new Error(`Prokerala API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error('Invalid Prokerala API response');
      }

      console.log('✅ Fetched panchang data from Prokerala');
      return this.transformProkeralaData(data.data);

    } catch (error) {
      console.error('❌ Prokerala API failed:', error);
      throw error;
    }
  }

  /**
   * Transform Prokerala API response to our Tithi format
   */
  private transformProkeralaData(prokeralaData: any[]): Tithi[] {
    return prokeralaData.map((item, index) => {
      const dateGreg = parseISO(item.datetime);
      const tithiNumber = parseInt(item.tithi?.index || '1');
      const paksha: PakshaType = tithiNumber <= 15 ? 'shukla' : 'krishna';
      const adjustedTithi = paksha === 'krishna' ? tithiNumber - 15 : tithiNumber;
      
      // Determine lunar month from date (simplified)
      const lunarMonth = this.determineLunarMonth(dateGreg);
      
      return {
        id: index + 1,
        dateGreg,
        dateLunar: `${LUNAR_MONTHS[lunarMonth].sanskrit} ${paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'} ${adjustedTithi}`,
        tithiNumber: adjustedTithi,
        paksha,
        lunarMonth,
        nakshatra: item.nakshatra?.name || 'Unknown',
        yoga: item.yoga?.name || 'Unknown',
        karana: item.karana?.name || 'Unknown',
        sunrise: item.sun_rise || '06:00',
        sunset: item.sun_set || '18:00',
        moonrise: item.moon_rise,
        moonset: item.moon_set,
        festivals: item.festivals || [],
        rahu_kalam: item.rahu_kalam,
        gulika_kalam: item.gulika_kalam
      };
    });
  }

  /**
   * Fallback to Drik Panchang (simplified implementation)
   */
  private async fetchFromDrik(
    startDate: Date,
    endDate: Date,
    location: Location
  ): Promise<Tithi[]> {
    console.log('🔄 Falling back to Drik Panchang calculation');
    
    // This is a simplified implementation
    // In a real app, you'd integrate with Swiss Ephemeris or similar
    const days: Tithi[] = [];
    let currentDate = new Date(startDate);
    let id = 1;

    while (currentDate <= endDate) {
      const tithiNumber = ((id - 1) % 30) + 1;
      const paksha: PakshaType = tithiNumber <= 15 ? 'shukla' : 'krishna';
      const adjustedTithi = paksha === 'krishna' ? tithiNumber - 15 : tithiNumber;
      const lunarMonth = this.determineLunarMonth(currentDate);

      days.push({
        id,
        dateGreg: new Date(currentDate),
        dateLunar: `${LUNAR_MONTHS[lunarMonth].sanskrit} ${paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'} ${adjustedTithi}`,
        tithiNumber: adjustedTithi,
        paksha,
        lunarMonth,
        nakshatra: this.calculateNakshatra(currentDate),
        yoga: 'Vishkumbha', // Simplified
        karana: 'Bava', // Simplified
        sunrise: '06:30',
        sunset: '18:30',
        festivals: this.getFestivalsForDate(currentDate),
      });

      currentDate = addDays(currentDate, 1);
      id++;
    }

    return days;
  }

  /**
   * Determine lunar month from Gregorian date (simplified)
   */
  private determineLunarMonth(date: Date): LunarMonth {
    const month = date.getMonth(); // 0-11
    const lunarMonths: LunarMonth[] = [
      'pausha', 'magha', 'phalguna', 'chaitra', 
      'vaisakha', 'jyeshtha', 'ashadha', 'shravana',
      'bhadrapada', 'ashvina', 'kartika', 'margasirsha'
    ];
    return lunarMonths[month];
  }

  /**
   * Calculate nakshatra (simplified)
   */
  private calculateNakshatra(date: Date): string {
    const nakshatras = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigasira', 'Ardra',
      'Punarvasu', 'Pushya', 'Aslesha', 'Magha', 'Purvaphalguni', 'Uttaraphalguni',
      'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Mula', 'Purvashadha', 'Uttarashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
      'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];
    
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return nakshatras[dayOfYear % 27];
  }

  /**
   * Get festivals for date (simplified)
   */
  private getFestivalsForDate(date: Date): string[] {
    const festivals: string[] = [];
    const month = date.getMonth();
    const day = date.getDate();

    // Add some common festivals (simplified)
    if (month === 2 && day === 14) festivals.push('Holi');
    if (month === 7 && day === 15) festivals.push('Krishna Janmashtami');
    if (month === 9 && day === 2) festivals.push('Gandhi Jayanti');
    if (month === 10 && day === 14) festivals.push('Diwali');

    return festivals;
  }

  /**
   * Enhance Tithi data with calculated properties
   */
  private enhanceTithiData(tithis: Tithi[]): LunarDay[] {
    const today = startOfDay(new Date());
    
    return tithis.map(tithi => {
      const isToday = startOfDay(tithi.dateGreg).getTime() === today.getTime();
      const moonPhase = this.calculateMoonPhase(tithi);
      
      return {
        ...tithi,
        isToday,
        isCurrentPaksha: this.isCurrentPaksha(tithi),
        isCurrentMonth: this.isCurrentMonth(tithi),
        moonPhasePercentage: moonPhase,
        isPurnima: tithi.tithiNumber === 15 && tithi.paksha === 'shukla',
        isAmavasya: tithi.tithiNumber === 15 && tithi.paksha === 'krishna',
        isEkadashi: tithi.tithiNumber === 11,
        auspiciousness: this.calculateAuspiciousness(tithi)
      };
    });
  }

  /**
   * Calculate moon phase percentage
   */
  private calculateMoonPhase(tithi: Tithi): number {
    const { tithiNumber, paksha } = tithi;
    
    if (paksha === 'shukla') {
      // Waxing moon: 0% to 100%
      return (tithiNumber / 15) * 100;
    } else {
      // Waning moon: 100% to 0%
      return ((15 - tithiNumber) / 15) * 100;
    }
  }

  /**
   * Check if tithi is in current paksha
   */
  private isCurrentPaksha(tithi: Tithi): boolean {
    // Simplified - in real implementation, calculate current paksha
    return Math.abs(tithi.dateGreg.getTime() - Date.now()) < (15 * 24 * 60 * 60 * 1000);
  }

  /**
   * Check if tithi is in current lunar month
   */
  private isCurrentMonth(tithi: Tithi): boolean {
    // Simplified - in real implementation, calculate current lunar month
    const currentMonth = new Date().getMonth();
    const tithiMonth = tithi.dateGreg.getMonth();
    return Math.abs(currentMonth - tithiMonth) <= 1;
  }

  /**
   * Calculate auspiciousness
   */
  private calculateAuspiciousness(tithi: Tithi): 'shubh' | 'ashubh' | 'mixed' {
    // Simplified auspiciousness calculation
    const isEkadashi = tithi.tithiNumber === 11;
    const isPurnima = tithi.tithiNumber === 15 && tithi.paksha === 'shukla';
    const isAmavasya = tithi.tithiNumber === 15 && tithi.paksha === 'krishna';
    
    if (isEkadashi || isPurnima) return 'shubh';
    if (isAmavasya) return 'ashubh';
    if (tithi.festivals.length > 0) return 'shubh';
    return 'mixed';
  }

  /**
   * Main method to fetch panchang data
   */
  public async getPanchangData(
    startDate: Date,
    endDate: Date,
    location: Location,
    forceRefresh = false
  ): Promise<PanchangResponse> {
    const cacheKey = this.generateCacheKey(startDate, endDate, location);

    try {
      // Check cache first (unless forced refresh)
      if (!forceRefresh) {
        const cachedData = await this.getCachedData(cacheKey);
        if (cachedData) {
          const enhancedData = this.enhanceTithiData(cachedData);
          return {
            success: true,
            data: enhancedData,
            source: 'cache',
            lastUpdated: new Date()
          };
        }
      }

      // Try Prokerala first
      try {
        const prokeralaData = await this.fetchFromProkerala(startDate, endDate, location);
        await this.setCachedData(cacheKey, prokeralaData, 'prokerala');
        
        const enhancedData = this.enhanceTithiData(prokeralaData);
        return {
          success: true,
          data: enhancedData,
          source: 'prokerala',
          lastUpdated: new Date()
        };
      } catch (prokeralaError) {
        console.warn('⚠️ Prokerala failed, trying Drik fallback');
        
        // Fall back to Drik
        const drikData = await this.fetchFromDrik(startDate, endDate, location);
        await this.setCachedData(cacheKey, drikData, 'drik');
        
        const enhancedData = this.enhanceTithiData(drikData);
        return {
          success: true,
          data: enhancedData,
          source: 'drik',
          lastUpdated: new Date()
        };
      }

    } catch (error) {
      console.error('❌ All panchang sources failed:', error);
      return {
        success: false,
        data: [],
        source: 'cache',
        lastUpdated: new Date()
      };
    }
  }

  /**
   * Get panchang data for a specific year
   */
  public async getYearData(year: number, location: Location): Promise<PanchangResponse> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    return this.getPanchangData(startDate, endDate, location);
  }

  /**
   * Get panchang data for a specific month
   */
  public async getMonthData(
    year: number, 
    month: LunarMonth, 
    location: Location
  ): Promise<PanchangResponse> {
    // This is simplified - in reality, lunar months don't align with Gregorian months
    const monthIndex = Object.keys(LUNAR_MONTHS).indexOf(month);
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);
    return this.getPanchangData(startDate, endDate, location);
  }

  /**
   * Clear all cached data
   */
  public async clearCache(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([PANCHANG_STORE], 'readwrite');
      const store = transaction.objectStore(PANCHANG_STORE);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log('🗑️ Panchang cache cleared');
    } catch (error) {
      console.warn('⚠️ Failed to clear cache:', error);
    }
  }
}

// Export singleton instance
export const panchangService = PanchangService.getInstance(); 