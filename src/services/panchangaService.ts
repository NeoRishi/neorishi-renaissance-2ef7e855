import { PanchangaDay, Task, Streak, JournalEntry } from '@/types/panchanga';
import { format, addDays, parseISO } from 'date-fns';

// Mock Panchanga data generator
export const getPanchanga = (dateISO: string): PanchangaDay => {
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