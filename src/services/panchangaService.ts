import { PanchangaDay, Task, Streak, JournalEntry } from '@/types/panchanga';
import { format, addDays, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

// Real Panchanga data from VedicAstroAPI
export const getPanchanga = async (dateISO: string): Promise<PanchangaDay> => {
  try {
    // Call the edge function to fetch real panchanga data
    const { data, error } = await supabase.functions.invoke('fetch-panchanga', {
      body: { date: dateISO }
    });

    if (error) {
      console.error('Error fetching panchanga data:', error);
      return getMockPanchanga(dateISO);
    }

    return data;
  } catch (error) {
    console.error('Error calling panchanga service:', error);
    return getMockPanchanga(dateISO);
  }
};

// Fallback mock Panchanga data generator
const getMockPanchanga = (dateISO: string): PanchangaDay => {
  const date = parseISO(dateISO);
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Determine tithi (1-30, cycling)
  const tithiIndex = (dayOfYear % 30) + 1;
  const paksha = tithiIndex <= 15 ? 'Śukla' : 'Kṛṣṇa';
  const tithiInPaksha = tithiIndex <= 15 ? tithiIndex : tithiIndex - 15;
  
  const tithiNames = [
    '', 'Pratipat', 'Dvitīyā', 'Tṛtīyā', 'Chaturthi', 'Pañchamī',
    'Ṣaṣṭhi', 'Saptamī', 'Aṣṭamī', 'Navamī', 'Daśamī',
    'Ekādaśī', 'Dvādaśī', 'Trayodaśī', 'Chaturdaśī', 'Pūrṇimā/Amāvasyā'
  ];

  const nakshatras = [
    'Aśvinī', 'Bharaṇī', 'Kṛttikā', 'Rohiṇī', 'Mṛgaśirṣa', 'Ārdrā',
    'Punarvasu', 'Puṣya', 'Āśleṣā', 'Maghā', 'Pūrva Phālgunī', 'Uttara Phālgunī',
    'Hasta', 'Chitrā', 'Svātī', 'Viśākhā', 'Anurādhā', 'Jyeṣṭhā',
    'Mūla', 'Pūrva Āṣāḍhā', 'Uttara Āṣāḍhā', 'Śravaṇa', 'Dhaniṣṭhā',
    'Śatabhiṣak', 'Pūrva Bhādrapadā', 'Uttara Bhādrapadā', 'Revatī'
  ];

  const yogas = ['Viṣkambha', 'Prīti', 'Āyuṣmān', 'Saubhāgya', 'Śobhana', 'Atigaṇḍa', 'Sukarman', 'Dhṛti', 'Śūla', 'Gaṇḍa', 'Vṛddhi', 'Dhruva', 'Vyāghāta', 'Harṣaṇa', 'Vajra', 'Siddhi', 'Vyatīpāta', 'Varīyān', 'Parigha', 'Śiva', 'Siddha', 'Sādhya', 'Śubha', 'Śukla', 'Brahma', 'Māhendra', 'Vaidṛti'];
  
  const karanas = ['Bava', 'Bālava', 'Kaulava', 'Taitila', 'Gara', 'Vaṇija', 'Viṣṭi', 'Śakuni', 'Catuṣpāt', 'Nāga', 'Kiṃstughna'];

  // Mock festivals for certain dates
  const festivals = [];
  if (tithiInPaksha === 4 && paksha === 'Śukla') {
    festivals.push({
      name: 'Gaṇeśa Chaturthi',
      type: 'Festival',
      importance: 'High' as const,
      note: 'Vināyaka Chaturthi vrata',
      isToday: true
    });
  }

  // Mock astro tips
  const astroTips = [
    "Honor beginnings—start one small, focused task to invite auspicious flow.",
    "The moon's energy supports deep reflection and emotional healing today.",
    "Perfect time for spiritual practices and connecting with your inner wisdom.",
    "Channel today's energy into creative pursuits and artistic expression.",
    "Focus on relationships and community connections for maximum benefit.",
    "A powerful day for manifestation and setting clear intentions.",
    "Embrace patience and allow natural timing to guide your actions."
  ];

  // Generate moon phase based on paksha and tithi
  let moonPhase;
  if (paksha === 'Śukla') {
    if (tithiInPaksha === 15) {
      moonPhase = { name: 'Pūrṇimā (Full Moon)', illumination: 100, emoji: '🌕' };
    } else if (tithiInPaksha <= 7) {
      moonPhase = { name: 'Waxing Crescent', illumination: (tithiInPaksha / 15) * 100, emoji: '🌒' };
    } else {
      moonPhase = { name: 'Waxing Gibbous', illumination: (tithiInPaksha / 15) * 100, emoji: '🌔' };
    }
  } else {
    if (tithiInPaksha === 15) {
      moonPhase = { name: 'Amāvasyā (New Moon)', illumination: 0, emoji: '🌑' };
    } else if (tithiInPaksha <= 7) {
      moonPhase = { name: 'Waning Gibbous', illumination: ((15 - tithiInPaksha) / 15) * 100, emoji: '🌖' };
    } else {
      moonPhase = { name: 'Waning Crescent', illumination: ((15 - tithiInPaksha) / 15) * 100, emoji: '🌘' };
    }
  }

  return {
    dateISO,
    timezone: 'Asia/Kolkata',
    ritu: 'Varṣā',
    masa: 'Bhādrapada',
    paksha,
    tithi: {
      name: tithiNames[tithiInPaksha] || tithiNames[15],
      index: tithiInPaksha,
      start: `${dateISO}T${String(Math.floor(Math.random() * 12) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}+05:30`,
      end: `${format(addDays(date, 1), 'yyyy-MM-dd')}T${String(Math.floor(Math.random() * 12) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}+05:30`,
    },
    nakshatra: {
      name: nakshatras[dayOfYear % nakshatras.length],
      end: `${dateISO}T${String(Math.floor(Math.random() * 12) + 12).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}+05:30`,
    },
    yoga: yogas[dayOfYear % yogas.length],
    karana: karanas[dayOfYear % karanas.length],
    sunrise: `${dateISO}T05:${String(45 + Math.floor(Math.random() * 30)).padStart(2, '0')}+05:30`,
    sunset: `${dateISO}T18:${String(30 + Math.floor(Math.random() * 30)).padStart(2, '0')}+05:30`,
    moonrise: `${dateISO}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}+05:30`,
    moonset: `${format(addDays(date, 1), 'yyyy-MM-dd')}T${String(Math.floor(Math.random() * 12)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}+05:30`,
    festivals,
    astroTip: astroTips[dayOfYear % astroTips.length],
    moonPhase,
    doshaGunaBlocks: [
      {
        from: '04:00',
        to: '06:00',
        guna: 'Sattva',
        dosha: 'Vāta',
        do: ['Wake up', 'Set Sankalpa', 'Meditation', 'Journaling'],
        avoid: ['Social media', 'Heavy meals']
      },
      {
        from: '06:00',
        to: '10:00',
        guna: 'Rajas',
        dosha: 'Pitta',
        do: ['Deep work', 'Planning', 'Sun exposure', 'Physical exercise'],
        avoid: ['Heavy meals before 9am', 'Emotional decisions']
      },
      {
        from: '10:00',
        to: '14:00',
        guna: 'Rajas',
        dosha: 'Pitta',
        do: ['Productive work', 'Meetings', 'Learning'],
        avoid: ['Overeating', 'Excessive heat']
      },
      {
        from: '14:00',
        to: '18:00',
        guna: 'Tamas',
        dosha: 'Kapha',
        do: ['Light activities', 'Creative work', 'Rest'],
        avoid: ['Important decisions', 'Heavy physical work']
      },
      {
        from: '18:00',
        to: '22:00',
        guna: 'Sattva',
        dosha: 'Kapha',
        do: ['Reflection', 'Family time', 'Light meals', 'Spiritual practice'],
        avoid: ['Stimulating activities', 'Work stress']
      },
      {
        from: '22:00',
        to: '04:00',
        guna: 'Tamas',
        dosha: 'Kapha',
        do: ['Sleep preparation', 'Gentle stretching'],
        avoid: ['Screens', 'Heavy foods', 'Intense activities']
      }
    ]
  };
};

// Mock task service
export const getRecommendedTasks = (sankalpa?: string): Task[] => {
  return [
    {
      id: 'task_001',
      title: '15-min prāṇāyāma',
      notes: 'Nāḍī śodhana before breakfast',
      when: `${format(new Date(), 'yyyy-MM-dd')}T07:30+05:30`,
      durationMin: 20,
      reminder: `${format(new Date(), 'yyyy-MM-dd')}T07:20+05:30`,
      status: 'pending',
      category: 'Health',
      derivedFromSankalpa: true
    },
    {
      id: 'task_002', 
      title: 'Morning meditation',
      notes: 'Silent sitting practice',
      when: `${format(new Date(), 'yyyy-MM-dd')}T06:00+05:30`,
      durationMin: 15,
      status: 'pending',
      category: 'Spiritual',
      derivedFromSankalpa: true
    },
    {
      id: 'task_003',
      title: 'Evening reflection',
      notes: 'Journal about the day\'s experiences',
      when: `${format(new Date(), 'yyyy-MM-dd')}T19:00+05:30`,
      durationMin: 10,
      status: 'pending',
      category: 'Growth',
      derivedFromSankalpa: true
    }
  ];
};

// Mock streak service - using localStorage for demo
export const getStreaks = (): Streak => {
  const saved = localStorage.getItem('rishi-streaks');
  if (saved) {
    return JSON.parse(saved);
  }
  
  const defaultStreaks = {
    brahma_muhurta: { current: 3, best: 7 },
    daily_tasks: { current: 2, best: 5 },
    night_journal: { current: 1, best: 4 }
  };
  
  localStorage.setItem('rishi-streaks', JSON.stringify(defaultStreaks));
  return defaultStreaks;
};

export const updateStreak = (type: keyof Streak, increment: boolean = true): Streak => {
  const streaks = getStreaks();
  
  if (increment) {
    streaks[type].current += 1;
    if (streaks[type].current > streaks[type].best) {
      streaks[type].best = streaks[type].current;
    }
  } else {
    streaks[type].current = 0;
  }
  
  localStorage.setItem('rishi-streaks', JSON.stringify(streaks));
  return streaks;
};

// Mock journal service
export const getJournalEntry = (date: string): JournalEntry | null => {
  const saved = localStorage.getItem(`rishi-journal-${date}`);
  return saved ? JSON.parse(saved) : null;
};

export const saveJournalEntry = (date: string, entry: Partial<JournalEntry>): void => {
  const existing = getJournalEntry(date) || { date };
  const updated = { ...existing, ...entry };
  localStorage.setItem(`rishi-journal-${date}`, JSON.stringify(updated));
};

// Mock NeoRishi chat service
export const askNeoRishi = async (query: string, context: any): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = [
    `Based on today's ${context.tithi} tithi and ${context.nakshatra} nakshatra, I suggest focusing on ${query.includes('meditation') ? 'deepening your spiritual practice' : 'practical matters with patience'}.`,
    `The current ${context.ritu} season supports ${query.includes('work') ? 'steady progress in your endeavors' : 'inner reflection and growth'}. Consider aligning your actions with this natural rhythm.`,
    `Given the ${context.moonPhase} moon phase, this is an excellent time for ${query.includes('new') ? 'starting fresh initiatives' : 'completing ongoing projects'}. Trust the cosmic timing.`,
    `Your Sankalpa can be enhanced by working with today's ${context.dosha} dominant energy. ${query.includes('energy') ? 'Channel this vitality mindfully' : 'Use this time for contemplative activities'}.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const getDinacharya = (): Array<{id: string, activity: string, time: string, completed: boolean}> => {
  return [
    { id: 'wake', activity: 'Wake before sunrise', time: '05:30', completed: false },
    { id: 'water', activity: 'Drink warm water', time: '05:45', completed: false },
    { id: 'eliminate', activity: 'Natural elimination', time: '06:00', completed: false },
    { id: 'oral', activity: 'Oral hygiene & tongue scraping', time: '06:15', completed: false },
    { id: 'exercise', activity: 'Physical exercise/yoga', time: '06:30', completed: false },
    { id: 'meditation', activity: 'Meditation & pranayama', time: '07:30', completed: false },
    { id: 'breakfast', activity: 'Nutritious breakfast', time: '08:30', completed: false },
  ];
};

// Seasonal Diet Data
export interface DietItem {
  id: string;
  label: string;
  icon?: string;
  rationale?: string;
}

export interface SeasonalDiet {
  favor: DietItem[];
  avoid: DietItem[];
}

export interface PrakritiTip {
  id: string;
  tip: string;
  tags?: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: Array<{
    id: string;
    text: string;
    weight: { vata: number; pitta: number; kapha: number };
  }>;
}

const rituDietMap: Record<string, SeasonalDiet> = {
  'Vasanta': {
    favor: [
      { id: 'spring-1', label: 'Light, warm foods', icon: '🍲', rationale: 'Supports digestive fire awakening' },
      { id: 'spring-2', label: 'Bitter greens', icon: '🥬', rationale: 'Cleanses accumulated toxins' },
      { id: 'spring-3', label: 'Honey & ginger tea', icon: '🍵', rationale: 'Energizes and warms the body' },
      { id: 'spring-4', label: 'Fresh herbs & spices', icon: '🌿', rationale: 'Stimulates metabolism' }
    ],
    avoid: [
      { id: 'spring-avoid-1', label: 'Heavy, oily foods', icon: '🍟', rationale: 'Hard to digest in transition' },
      { id: 'spring-avoid-2', label: 'Cold drinks', icon: '🧊', rationale: 'Dampens digestive fire' },
      { id: 'spring-avoid-3', label: 'Dairy products', icon: '🥛', rationale: 'Can increase mucus production' }
    ]
  },
  'Grīṣma': {
    favor: [
      { id: 'summer-1', label: 'Cooling foods', icon: '🥒', rationale: 'Balances excess heat' },
      { id: 'summer-2', label: 'Sweet, juicy fruits', icon: '🍉', rationale: 'Hydrates and cools the body' },
      { id: 'summer-3', label: 'Coconut water', icon: '🥥', rationale: 'Natural electrolyte replenisher' },
      { id: 'summer-4', label: 'Rose water & mint', icon: '🌹', rationale: 'Cooling and soothing' }
    ],
    avoid: [
      { id: 'summer-avoid-1', label: 'Hot, spicy foods', icon: '🌶️', rationale: 'Increases internal heat' },
      { id: 'summer-avoid-2', label: 'Alcohol', icon: '🍷', rationale: 'Dehydrating and heating' },
      { id: 'summer-avoid-3', label: 'Fried foods', icon: '🍳', rationale: 'Hard to digest in heat' }
    ]
  },
  'Varṣā': {
    favor: [
      { id: 'monsoon-1', label: 'Warm, cooked foods', icon: '🍜', rationale: 'Easy digestion in dampness' },
      { id: 'monsoon-2', label: 'Ginger & turmeric', icon: '🫚', rationale: 'Supports immunity' },
      { id: 'monsoon-3', label: 'Light grains & pulses', icon: '🌾', rationale: 'Balanced nutrition' },
      { id: 'monsoon-4', label: 'Herbal teas', icon: '🍵', rationale: 'Warming and digestive' }
    ],
    avoid: [
      { id: 'monsoon-avoid-1', label: 'Raw foods', icon: '🥗', rationale: 'Risk of contamination' },
      { id: 'monsoon-avoid-2', label: 'Street food', icon: '🌮', rationale: 'Hygiene concerns' },
      { id: 'monsoon-avoid-3', label: 'Excess sweets', icon: '🍰', rationale: 'Can worsen dampness' }
    ]
  },
  'Śarad': {
    favor: [
      { id: 'autumn-1', label: 'Sweet, nourishing foods', icon: '🍠', rationale: 'Builds strength for winter' },
      { id: 'autumn-2', label: 'Ghee & nuts', icon: '🥜', rationale: 'Healthy fats for vitality' },
      { id: 'autumn-3', label: 'Warm milk with spices', icon: '🥛', rationale: 'Calming and grounding' },
      { id: 'autumn-4', label: 'Seasonal fruits', icon: '🍎', rationale: 'Natural harvest nutrition' }
    ],
    avoid: [
      { id: 'autumn-avoid-1', label: 'Dry, rough foods', icon: '🍪', rationale: 'Can aggravate Vata' },
      { id: 'autumn-avoid-2', label: 'Irregular meals', icon: '⏰', rationale: 'Disturbs natural rhythm' },
      { id: 'autumn-avoid-3', label: 'Cold foods', icon: '🍨', rationale: 'Weakens digestive fire' }
    ]
  },
  'Hemanta': {
    favor: [
      { id: 'winter-1', label: 'Warming, heavy foods', icon: '🍲', rationale: 'Sustains energy in cold' },
      { id: 'winter-2', label: 'Sesame oil & ghee', icon: '🛢️', rationale: 'Provides internal warmth' },
      { id: 'winter-3', label: 'Hot soups & stews', icon: '🍵', rationale: 'Easy digestion and warmth' },
      { id: 'winter-4', label: 'Warming spices', icon: '🧄', rationale: 'Stimulates circulation' }
    ],
    avoid: [
      { id: 'winter-avoid-1', label: 'Cold drinks & ice', icon: '🧊', rationale: 'Disrupts internal heat' },
      { id: 'winter-avoid-2', label: 'Light, dry foods', icon: '🍪', rationale: 'Insufficient nourishment' },
      { id: 'winter-avoid-3', label: 'Raw vegetables', icon: '🥕', rationale: 'Hard to digest when cold' }
    ]
  },
  'Śiśira': {
    favor: [
      { id: 'late-winter-1', label: 'Warm, oily foods', icon: '🍛', rationale: 'Maintains body heat' },
      { id: 'late-winter-2', label: 'Jaggery & dates', icon: '🍯', rationale: 'Natural energy source' },
      { id: 'late-winter-3', label: 'Cooked grains', icon: '🍚', rationale: 'Grounding and satisfying' },
      { id: 'late-winter-4', label: 'Herbal decoctions', icon: '☕', rationale: 'Supports immunity' }
    ],
    avoid: [
      { id: 'late-winter-avoid-1', label: 'Frozen foods', icon: '🧊', rationale: 'Extremely cooling' },
      { id: 'late-winter-avoid-2', label: 'Excessive fasting', icon: '🚫', rationale: 'Depletes energy reserves' },
      { id: 'late-winter-avoid-3', label: 'Cold salads', icon: '🥗', rationale: 'Too cooling for season' }
    ]
  }
};

const prakritiTips = {
  vata: [
    { id: 'vata-1', tip: 'Warm, cooked foods', tags: ['Method'] },
    { id: 'vata-2', tip: 'Regular meal times', tags: ['Timing'] },
    { id: 'vata-3', tip: 'Sweet, sour, salty tastes', tags: ['Taste'] },
    { id: 'vata-4', tip: 'Avoid cold drinks', tags: ['Method'] },
    { id: 'vata-5', tip: 'Nourishing soups', tags: ['Example'] },
    { id: 'vata-6', tip: 'Ghee and oils', tags: ['Method'] },
    { id: 'vata-7', tip: 'Calming spices', tags: ['Example'] },
    { id: 'vata-8', tip: 'Avoid raw foods', tags: ['Method'] },
    { id: 'vata-9', tip: 'Warm herbal teas', tags: ['Example'] },
    { id: 'vata-10', tip: 'Cooked grains', tags: ['Example'] }
  ],
  pitta: [
    { id: 'pitta-1', tip: 'Cooling foods', tags: ['Method'] },
    { id: 'pitta-2', tip: 'Sweet, bitter, astringent', tags: ['Taste'] },
    { id: 'pitta-3', tip: 'Avoid spicy foods', tags: ['Method'] },
    { id: 'pitta-4', tip: 'Fresh cucumber', tags: ['Example'] },
    { id: 'pitta-5', tip: 'Coconut water', tags: ['Example'] },
    { id: 'pitta-6', tip: 'Leafy greens', tags: ['Example'] },
    { id: 'pitta-7', tip: 'Cool, not cold', tags: ['Method'] },
    { id: 'pitta-8', tip: 'Avoid alcohol', tags: ['Method'] },
    { id: 'pitta-9', tip: 'Sweet fruits', tags: ['Example'] },
    { id: 'pitta-10', tip: 'Moderate portions', tags: ['Method'] }
  ],
  kapha: [
    { id: 'kapha-1', tip: 'Light, dry foods', tags: ['Method'] },
    { id: 'kapha-2', tip: 'Pungent, bitter, astringent', tags: ['Taste'] },
    { id: 'kapha-3', tip: 'Avoid heavy foods', tags: ['Method'] },
    { id: 'kapha-4', tip: 'Warming spices', tags: ['Example'] },
    { id: 'kapha-5', tip: 'Skip breakfast sometimes', tags: ['Timing'] },
    { id: 'kapha-6', tip: 'Steamed vegetables', tags: ['Example'] },
    { id: 'kapha-7', tip: 'Honey over sugar', tags: ['Example'] },
    { id: 'kapha-8', tip: 'Avoid dairy excess', tags: ['Method'] },
    { id: 'kapha-9', tip: 'Ginger tea', tags: ['Example'] },
    { id: 'kapha-10', tip: 'Smaller portions', tags: ['Method'] }
  ]
};

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'How would you describe your body build?',
    options: [
      { id: 'q1-a', text: 'Thin, light, hard to gain weight', weight: { vata: 3, pitta: 0, kapha: 0 } },
      { id: 'q1-b', text: 'Medium build, muscular', weight: { vata: 0, pitta: 3, kapha: 0 } },
      { id: 'q1-c', text: 'Heavy, solid, easy to gain weight', weight: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 'q2',
    prompt: 'What best describes your appetite?',
    options: [
      { id: 'q2-a', text: 'Variable, sometimes forget to eat', weight: { vata: 3, pitta: 0, kapha: 0 } },
      { id: 'q2-b', text: 'Strong, regular, get irritable when hungry', weight: { vata: 0, pitta: 3, kapha: 0 } },
      { id: 'q2-c', text: 'Steady, can skip meals easily', weight: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 'q3',
    prompt: 'How do you handle stress?',
    options: [
      { id: 'q3-a', text: 'Get anxious, mind races', weight: { vata: 3, pitta: 0, kapha: 0 } },
      { id: 'q3-b', text: 'Get irritated, frustrated', weight: { vata: 0, pitta: 3, kapha: 0 } },
      { id: 'q3-c', text: 'Withdraw, become lethargic', weight: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 'q4',
    prompt: 'What is your sleep pattern like?',
    options: [
      { id: 'q4-a', text: 'Light sleeper, wake frequently', weight: { vata: 3, pitta: 0, kapha: 0 } },
      { id: 'q4-b', text: 'Sound sleep, wake refreshed', weight: { vata: 0, pitta: 3, kapha: 0 } },
      { id: 'q4-c', text: 'Deep sleep, hard to wake up', weight: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  }
];

export const getCurrentRitu = (): string => {
  const month = new Date().getMonth() + 1; // 1-12
  
  // Simplified ritu mapping (Northern Hemisphere)
  if (month >= 3 && month <= 4) return 'Vasanta'; // Spring
  if (month >= 5 && month <= 6) return 'Grīṣma'; // Summer
  if (month >= 7 && month <= 8) return 'Varṣā'; // Monsoon
  if (month >= 9 && month <= 10) return 'Śarad'; // Autumn
  if (month >= 11 && month <= 12) return 'Hemanta'; // Early Winter
  return 'Śiśira'; // Late Winter (Jan-Feb)
};

export const getSeasonalDiet = (ritu: string): SeasonalDiet => {
  return rituDietMap[ritu] || rituDietMap['Varṣā'];
};

export const getPrakritiTips = () => {
  return prakritiTips;
};

export const getQuizQuestions = (): QuizQuestion[] => {
  return quizQuestions;
};

export const calculatePrakritiResult = (answers: Record<string, string>): string => {
  const scores = { vata: 0, pitta: 0, kapha: 0 };
  
  Object.entries(answers).forEach(([questionId, optionId]) => {
    const question = quizQuestions.find(q => q.id === questionId);
    const option = question?.options.find(o => o.id === optionId);
    
    if (option) {
      scores.vata += option.weight.vata;
      scores.pitta += option.weight.pitta;
      scores.kapha += option.weight.kapha;
    }
  });
  
  const maxScore = Math.max(scores.vata, scores.pitta, scores.kapha);
  if (scores.vata === maxScore) return 'vata';
  if (scores.pitta === maxScore) return 'pitta';
  return 'kapha';
};

export const savePrakritiResult = (prakriti: string): void => {
  localStorage.setItem('rishi-prakriti', prakriti);
};

export const getSavedPrakriti = (): string | null => {
  return localStorage.getItem('rishi-prakriti');
};