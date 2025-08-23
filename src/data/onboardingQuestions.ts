export interface OnboardingQuestion {
  id: number;
  question: string;
  type: 'single' | 'multi';
  maxSelections?: number;
  options: {
    id: string;
    text: string;
  }[];
}

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: 1,
    question: "What are the top issues you're facing right now?",
    type: "multi",
    maxSelections: 3,
    options: [
      { id: "A", text: "Low energy / afternoon crashes" },
      { id: "B", text: "Poor sleep / irregular sleep timing" },
      { id: "C", text: "Brain fog / low focus" },
      { id: "D", text: "High stress / anxiety / irritability" },
      { id: "E", text: "Digestive trouble (bloating, acidity, constipation)" },
      { id: "F", text: "Weight/metabolic concerns" },
      { id: "G", text: "Aches/inflammation (back, joints)" },
      { id: "H", text: "Irregular routine / procrastination" },
      { id: "I", text: "Mood swings / feeling low" },
      { id: "J", text: "Other / not sure (pick this if none fit)" }
    ]
  },
  {
    id: 2,
    question: "If we help you win one thing in the next 30 days, what should it be?",
    type: "single",
    options: [
      { id: "A", text: "Sleep better and wake fresher" },
      { id: "B", text: "Steady daytime energy" },
      { id: "C", text: "Deep focus & distraction control" },
      { id: "D", text: "Calm mind & stress resilience" },
      { id: "E", text: "Gut reset & comfortable digestion" },
      { id: "F", text: "Weight/fat management kickstart" },
      { id: "G", text: "Consistent movement/exercise" },
      { id: "H", text: "Consistent spiritual practice (meditation/prayer/jaap)" }
    ]
  },
  {
    id: 3,
    question: "Which daily rhythm describes you best?",
    type: "single",
    options: [
      { id: "A", text: "Night-owl, irregular sleep/wake" },
      { id: "B", text: "Early riser but inconsistent routine" },
      { id: "C", text: "Structured on weekdays, messy weekends" },
      { id: "D", text: "Regular 9–5 with predictable hours" },
      { id: "E", text: "Shift/rotational schedule" },
      { id: "F", text: "Caregiver/parenting—unpredictable days" }
    ]
  },
  {
    id: 4,
    question: "Food context & constraints (choose what applies).",
    type: "multi",
    options: [
      { id: "A", text: "Vegetarian" },
      { id: "B", text: "Eggitarian" },
      { id: "C", text: "Non-vegetarian" },
      { id: "D", text: "Vegan" },
      { id: "E", text: "Mostly home-cooked" },
      { id: "F", text: "Mostly eating out/ordering" },
      { id: "G", text: "Limited cooking time (<20 min)" },
      { id: "H", text: "Avoids onion/garlic / prefers saatvik" },
      { id: "I", text: "Avoids dairy and/or gluten" },
      { id: "J", text: "Fasts periodically (e.g., Ekadashi/weekly)" }
    ]
  },
  {
    id: 5,
    question: "How do you prefer guidance to feel?",
    type: "multi",
    options: [
      { id: "A", text: "Clear plan with accountability & streaks" },
      { id: "B", text: "Gentle nudges—small steps, low pressure" },
      { id: "C", text: "\"Explain the science\" with brief rationale" },
      { id: "D", text: "Ritual-first (simple yogic/meditative practices)" },
      { id: "E", text: "Minimal notifications—only key moments" },
      { id: "F", text: "Flexible—app adapts if I skip" }
    ]
  },
  {
    id: 6,
    question: "What time/effort budget can you realistically commit most days?",
    type: "single",
    options: [
      { id: "A", text: "10 minutes (micro-habits)" },
      { id: "B", text: "20–30 minutes (compact routine)" },
      { id: "C", text: "45–60 minutes (full routine)" },
      { id: "D", text: "Weekdays short, weekends longer" },
      { id: "E", text: "Varies a lot—need ultra-flexible plans" }
    ]
  }
];

export interface OnboardingResponses {
  [questionId: number]: string[];
}

export interface UserDetails {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth?: Date;
  timeOfBirth?: string;
  birthPlace?: string;
}