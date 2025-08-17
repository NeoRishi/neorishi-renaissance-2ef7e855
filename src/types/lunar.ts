// Lunar Calendar Types for NeoRishi Chandra-Dhara

export type PakshaType = 'shukla' | 'krishna';
export type RituType = 'vasant' | 'grishma' | 'varsha' | 'sharad' | 'hemant' | 'shishir';
export type TaskType = 'nitya' | 'naimittika' | 'kamya';
export type ZoomLevel = 'year' | 'ritu' | 'month' | 'paksha' | 'day';

// Hindu lunar months
export type LunarMonth = 
  | 'chaitra' | 'vaisakha' | 'jyeshtha' | 'ashadha' 
  | 'shravana' | 'bhadrapada' | 'ashvina' | 'kartika'
  | 'margasirsha' | 'pausha' | 'magha' | 'phalguna';

// Core Panchang data structure
export interface Tithi {
  id: number;
  dateGreg: Date;
  dateLunar: string; // e.g. "Chaitra Shukla 3"
  tithiNumber: number; // 1-15
  paksha: PakshaType;
  lunarMonth: LunarMonth;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  moonrise?: string;
  moonset?: string;
  festivals: string[];
  isAdhika?: boolean; // leap month
  rahu_kalam?: string;
  gulika_kalam?: string;
}

// Extended lunar day with calculated properties
export interface LunarDay extends Tithi {
  isToday: boolean;
  isCurrentPaksha: boolean;
  isCurrentMonth: boolean;
  moonPhasePercentage: number; // 0-100
  isPurnima: boolean; // full moon
  isAmavasya: boolean; // new moon
  isEkadashi: boolean; // 11th tithi
  auspiciousness: 'shubh' | 'ashubh' | 'mixed';
}

// Task management
export interface LunarTask {
  id: string;
  userId: string;
  dateLunar: string; // FK to Tithi.dateLunar
  dateGreg: Date;
  type: TaskType;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  reminderTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Seasonal grouping
export interface RituSeason {
  name: RituType;
  displayName: string;
  months: LunarMonth[];
  colorClass: string;
  description: string;
  characteristics: string[];
  aharVihaar: {
    diet: string[];
    lifestyle: string[];
  };
}

// Monthly view data
export interface LunarMonthData {
  month: LunarMonth;
  year: number;
  gregorianStart: Date;
  gregorianEnd: Date;
  tithis: LunarDay[];
  majorFestivals: string[];
  seasonalTips: string[];
  isAdhika: boolean;
}

// Paksha timeline data
export interface PakshaData {
  type: PakshaType;
  month: LunarMonth;
  year: number;
  tithis: LunarDay[];
  startDate: Date;
  endDate: Date;
  moonPhases: {
    tithi: number;
    phase: 'new' | 'waxing' | 'full' | 'waning';
    percentage: number;
  }[];
}

// Year overview
export interface LunarYearData {
  year: number;
  months: LunarMonthData[];
  totalFestivals: number;
  seasons: RituSeason[];
  specialYogaEvents: string[];
  eclipses: {
    date: Date;
    type: 'solar' | 'lunar';
    visibility: string;
  }[];
}

// Navigation state
export interface NavigationState {
  currentLevel: ZoomLevel;
  selectedYear: number;
  selectedMonth?: LunarMonth;
  selectedPaksha?: PakshaType;
  selectedDate?: Date;
  breadcrumbs: {
    level: ZoomLevel;
    label: string;
    value: string | number;
  }[];
}

// API responses
export interface PanchangResponse {
  success: boolean;
  data: LunarDay[];
  source: 'prokerala' | 'drik' | 'cache';
  lastUpdated: Date;
}

export interface TasksResponse {
  success: boolean;
  tasks: LunarTask[];
  totalCount: number;
}

// Location for panchang calculations
export interface Location {
  latitude: number;
  longitude: number;
  timezone: string;
  city?: string;
  country?: string;
}

// AI tip request/response
export interface AiTipRequest {
  context: {
    tithi: LunarDay;
    tasks: LunarTask[];
    userProfile?: any;
  };
}

export interface AiTipResponse {
  tip: string;
  category: 'ahar' | 'vihaar' | 'spiritual' | 'practical';
  confidence: number;
}

// Utility types for component props
export interface BaseCalendarProps {
  onNavigate: (level: ZoomLevel, value?: any) => void;
  currentNav: NavigationState;
  location: Location;
}

export interface TaskManagementProps {
  tasks: LunarTask[];
  onAddTask: (task: Omit<LunarTask, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<LunarTask>) => void;
}

// Constants for calculations
export const LUNAR_MONTHS: Record<LunarMonth, { sanskrit: string; number: number }> = {
  chaitra: { sanskrit: 'चैत्र', number: 1 },
  vaisakha: { sanskrit: 'वैशाख', number: 2 },
  jyeshtha: { sanskrit: 'ज्येष्ठ', number: 3 },
  ashadha: { sanskrit: 'आषाढ़', number: 4 },
  shravana: { sanskrit: 'श्रावण', number: 5 },
  bhadrapada: { sanskrit: 'भाद्रपद', number: 6 },
  ashvina: { sanskrit: 'आश्विन', number: 7 },
  kartika: { sanskrit: 'कार्तिक', number: 8 },
  margasirsha: { sanskrit: 'मार्गशीर्ष', number: 9 },
  pausha: { sanskrit: 'पौष', number: 10 },
  magha: { sanskrit: 'माघ', number: 11 },
  phalguna: { sanskrit: 'फाल्गुन', number: 12 }
};

export const RITU_SEASONS: Record<RituType, RituSeason> = {
  vasant: {
    name: 'vasant',
    displayName: 'Vasant (Spring)',
    months: ['chaitra', 'vaisakha'],
    colorClass: 'bg-ritu-vasant',
    description: 'Spring season of renewal and growth',
    characteristics: ['New beginnings', 'Increased energy', 'Kapha balance'],
    aharVihaar: {
      diet: ['Light, warm foods', 'Bitter and astringent tastes', 'Fresh greens'],
      lifestyle: ['Early rising', 'Moderate exercise', 'Oil massage']
    }
  },
  grishma: {
    name: 'grishma',
    displayName: 'Grishma (Summer)',
    months: ['jyeshtha', 'ashadha'],
    colorClass: 'bg-ritu-grishma',
    description: 'Hot summer season requiring cooling practices',
    characteristics: ['High heat', 'Pitta aggravation', 'Dehydration risk'],
    aharVihaar: {
      diet: ['Cool, sweet foods', 'Plenty of water', 'Cooling fruits'],
      lifestyle: ['Avoid midday sun', 'Swimming', 'Cooling pranayama']
    }
  },
  varsha: {
    name: 'varsha',
    displayName: 'Varsha (Monsoon)',
    months: ['shravana', 'bhadrapada'],
    colorClass: 'bg-ritu-varsha',
    description: 'Monsoon season of cleansing and rejuvenation',
    characteristics: ['Heavy rains', 'Vata-Pitta balance', 'Digestive challenges'],
    aharVihaar: {
      diet: ['Warm, light foods', 'Digestive spices', 'Avoid raw foods'],
      lifestyle: ['Indoor activities', 'Meditation', 'Avoid dampness']
    }
  },
  sharad: {
    name: 'sharad',
    displayName: 'Sharad (Autumn)',
    months: ['ashvina', 'kartika'],
    colorClass: 'bg-ritu-sharad',
    description: 'Autumn season of harvest and preparation',
    characteristics: ['Cooling weather', 'Pitta pacification', 'Digestive strength'],
    aharVihaar: {
      diet: ['Nourishing foods', 'Sweet and bitter tastes', 'Seasonal fruits'],
      lifestyle: ['Regular routine', 'Strength building', 'Nature walks']
    }
  },
  hemant: {
    name: 'hemant',
    displayName: 'Hemant (Early Winter)',
    months: ['margasirsha', 'pausha'],
    colorClass: 'bg-ritu-hemant',
    description: 'Early winter season building internal heat',
    characteristics: ['Cold weather', 'Strong digestion', 'Vata aggravation'],
    aharVihaar: {
      diet: ['Warm, oily foods', 'Sweet and sour tastes', 'Hot beverages'],
      lifestyle: ['Warm clothing', 'Oil massage', 'Indoor heating']
    }
  },
  shishir: {
    name: 'shishir',
    displayName: 'Shishir (Late Winter)',
    months: ['magha', 'phalguna'],
    colorClass: 'bg-ritu-shishir',
    description: 'Late winter preparing for spring',
    characteristics: ['Dry cold', 'Kapha accumulation', 'Preparation for spring'],
    aharVihaar: {
      diet: ['Heavy, nourishing foods', 'Warming spices', 'Seasonal vegetables'],
      lifestyle: ['Exercise to generate heat', 'Dry massage', 'Preparations for spring']
    }
  }
}; 