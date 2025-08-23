export interface Tithi {
  name: string;
  index: number;
  start: string;
  end: string;
}

export interface Nakshatra {
  name: string;
  end: string;
}

export interface Festival {
  name: string;
  type: string;
  importance: 'High' | 'Medium' | 'Low';
  note?: string;
  isToday: boolean;
}

export interface DoshaGunaBlock {
  from: string;
  to: string;
  guna: 'Sattva' | 'Rajas' | 'Tamas';
  dosha: 'Vāta' | 'Pitta' | 'Kapha';
  do: string[];
  avoid: string[];
}

export interface PanchangaDay {
  dateISO: string;
  timezone: string;
  ritu: string;
  masa: string;
  paksha: 'Śukla' | 'Kṛṣṇa';
  tithi: Tithi;
  nakshatra: Nakshatra;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  festivals: Festival[];
  astroTip: string;
  doshaGunaBlocks: DoshaGunaBlock[];
  moonPhase: {
    name: string;
    illumination: number;
    emoji: string;
  };
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  when: string;
  durationMin: number;
  reminder?: string;
  status: 'pending' | 'completed' | 'cancelled';
  category: string;
  derivedFromSankalpa?: boolean;
}

export interface Streak {
  brahma_muhurta: {
    current: number;
    best: number;
  };
  daily_tasks: {
    current: number;
    best: number;
  };
  night_journal: {
    current: number;
    best: number;
  };
}

export interface JournalEntry {
  date: string;
  morning?: {
    sankalpa: string;
    timestamp: string;
  };
  night?: {
    reflection: string;
    improvements: string;
    timestamp: string;
  };
}

export interface Ritu {
  name: string;
  months: string[];
  emoji: string;
  description: string;
  current: boolean;
}

// Ritu (Season) definitions
export const RITUS: Ritu[] = [
  {
    name: 'Vasanta',
    months: ['Chaitra', 'Vaishākha'],
    emoji: '🌸',
    description: 'Spring - renewal and growth',
    current: false,
  },
  {
    name: 'Grīṣma',
    months: ['Jyeṣṭha', 'Āṣāḍha'],
    emoji: '☀️',
    description: 'Summer - energy and transformation',
    current: false,
  },
  {
    name: 'Varṣā',
    months: ['Śrāvaṇa', 'Bhādrapada'],
    emoji: '🌧️',
    description: 'Monsoon - cleansing and abundance',
    current: true,
  },
  {
    name: 'Śarad',
    months: ['Āśvina', 'Kārtika'],
    emoji: '🍂',
    description: 'Autumn - balance and harvest',
    current: false,
  },
  {
    name: 'Hemanta',
    months: ['Agrahāyaṇa', 'Pauṣa'],
    emoji: '❄️',
    description: 'Early winter - gathering and reflection',
    current: false,
  },
  {
    name: 'Śiśira',
    months: ['Māgha', 'Phālguna'],
    emoji: '🌨️',
    description: 'Late winter - introspection and preparation',
    current: false,
  },
];