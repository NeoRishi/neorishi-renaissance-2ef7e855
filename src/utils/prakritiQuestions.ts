export type PrakritiQuestion = {
  id: string;
  question: string;
  options: {
    Vata: string;
    Pitta: string;
    Kapha: string;
  };
};

export const prakritiQuestions = [
  // Physical Constitution
  {
    id: "body_frame",
    question: "My natural body frame is best described as:",
    options: {
      Vata: "Thin, slender, and light, with prominent bones and joints.",
      Pitta: "Medium and athletic, with good, defined muscle tone.",
      Kapha: "Large, broad, or stocky, with a well-developed, solid frame."
    }
  },
  {
    id: "body_weight",
    question: "Regarding my body weight throughout life, I have found that:",
    options: {
      Vata: "I have a low body weight and find it very difficult to gain weight.",
      Pitta: "My weight is moderate and I can gain or lose it with relative ease.",
      Kapha: "I have a heavier build and gain weight very easily, but find it difficult to lose."
    }
  },
  {
    id: "skin",
    question: "My skin is naturally:",
    options: {
      Vata: "Thin, dry, and cool to the touch, with a tendency to be rough.",
      Pitta: "Warm, slightly oily, and sensitive, prone to rashes, acne, or freckles.",
      Kapha: "Thick, smooth, oily, and cool, with a pale or glowing complexion."
    }
  },
  {
    id: "hair",
    question: "My hair's natural texture and tendency is:",
    options: {
      Vata: "Dry, thin, brittle, or frizzy.",
      Pitta: "Fine, soft, and straight, with a tendency toward early graying or baldness.",
      Kapha: "Thick, oily, wavy, and abundant."
    }
  },
  {
    id: "eyes",
    question: "My eyes are typically:",
    options: {
      Vata: "Small, active, and may appear sunken or nervous.",
      Pitta: "Medium-sized, sharp, and piercing, and can be sensitive to light.",
      Kapha: "Large, calm, and attractive, with long, thick lashes."
    }
  },
  {
    id: "nails",
    question: "My nails are generally:",
    options: {
      Vata: "Small, dry, rough, and brittle; they break or chip easily.",
      Pitta: "Medium-sized, soft, flexible, and have a pinkish luster.",
      Kapha: "Large, thick, strong, and smooth."
    }
  },
  {
    id: "teeth",
    question: "My teeth are generally:",
    options: {
      Vata: "Irregular, crooked, or protruding, with spaces; gums may be thin.",
      Pitta: "Medium-sized and even, but can have a yellowish tint; gums may be sensitive.",
      Kapha: "Large, white, strong, and evenly spaced within strong gums."
    }
  },
  {
    id: "lips",
    question: "My lips are naturally:",
    options: {
      Vata: "Thin, dry, and may be chapped.",
      Pitta: "Medium, soft, and have a distinct reddish color.",
      Kapha: "Large, thick, and smooth, with a pale or pinkish color."
    }
  },
  {
    id: "joints",
    question: "My joints tend to be:",
    options: {
      Vata: "Prominent, thin, and may make cracking or popping sounds.",
      Pitta: "Medium-sized, loose, and flexible.",
      Kapha: "Large, sturdy, well-padded, and strong."
    }
  },
  {
    id: "face_shape",
    question: "My face shape is generally:",
    options: {
      Vata: "Long, thin, or angular.",
      Pitta: "Heart-shaped or triangular, with a tapering chin.",
      Kapha: "Round, large, or square, with full cheeks."
    }
  },
  // Metabolism
  {
    id: "appetite",
    question: "My appetite is typically:",
    options: {
      Vata: "Irregular and unpredictable; I might forget to eat.",
      Pitta: "Strong, sharp, and urgent; I get 'hangry' if I miss a meal.",
      Kapha: "Slow but steady; I can easily skip a meal without discomfort."
    }
  },
  {
    id: "digestion",
    question: "My digestion tends to be:",
    options: {
      Vata: "Variable; I am prone to gas, bloating, and a feeling of fullness.",
      Pitta: "Fast and strong; I can be prone to heartburn or acidity.",
      Kapha: "Slow and heavy; I often feel full for a long time after eating."
    }
  },
  {
    id: "bowel_movements",
    question: "My bowel movements are typically:",
    options: {
      Vata: "Dry, hard, and infrequent; prone to constipation.",
      Pitta: "Regular (often 1-2+ times a day), loose, and soft.",
      Kapha: "Regular but slow; stools are thick, heavy, and well-formed."
    }
  },
  {
    id: "thirst",
    question: "My level of thirst is generally:",
    options: {
      Vata: "Changeable and often low.",
      Pitta: "Strong and frequent; I drink a lot of fluids.",
      Kapha: "Low; I rarely feel very thirsty."
    }
  },
  {
    id: "food_preferences",
    question: "My food preferences lean towards:",
    options: {
      Vata: "Warm, moist, and heavy foods like soups and stews.",
      Pitta: "Substantial, cooling, and less spicy foods.",
      Kapha: "Light, dry, warm, and spicy foods."
    }
  },
  {
    id: "perspiration",
    question: "I tend to perspire:",
    options: {
      Vata: "Very little, even in hot weather or during exercise.",
      Pitta: "Easily and profusely; my sweat may have a strong odor.",
      Kapha: "Moderately, but can be heavy with exertion; mild odor."
    }
  },
  {
    id: "body_temperature",
    question: "My body temperature usually feels:",
    options: {
      Vata: "Cold; my hands and feet are often cold to the touch.",
      Pitta: "Warm; I often feel hot when others are comfortable.",
      Kapha: "Normal and adaptable, but I can feel cool."
    }
  },
  {
    id: "food_cravings",
    question: "My food cravings, if any, are for:",
    options: {
      Vata: "Salty and crunchy snacks.",
      Pitta: "Spicy, sour, or sharp-tasting foods.",
      Kapha: "Sweet, heavy, or creamy foods like pastries and dairy."
    }
  },
  {
    id: "voice",
    question: "My voice quality is:",
    options: {
      Vata: "Weak, hoarse, or high-pitched.",
      Pitta: "Strong, sharp, and commanding.",
      Kapha: "Deep, resonant, and melodious."
    }
  },
  // Energy
  {
    id: "stamina",
    question: "My physical stamina and endurance are:",
    options: {
      Vata: "Low; my energy comes in bursts, and I tire easily.",
      Pitta: "Moderate and focused; I can push myself to burnout.",
      Kapha: "Excellent and sustained; I have great stamina."
    }
  },
  {
    id: "activity_pace",
    question: "My pace of performing activities is:",
    options: {
      Vata: "Very fast and quick; I am always on the go.",
      Pitta: "Moderate, purposeful, and intense.",
      Kapha: "Slow, steady, and methodical."
    }
  },
  {
    id: "sleep",
    question: "My sleep pattern is typically:",
    options: {
      Vata: "Light and easily disturbed; I may have trouble falling asleep.",
      Pitta: "Sound and moderate; I feel rested with 6-8 hours.",
      Kapha: "Deep, heavy, and long; I love to sleep and can feel groggy."
    }
  },
  {
    id: "weather_preference",
    question: "In different weather, I feel most comfortable in:",
    options: {
      Vata: "Warm and humid weather; I dislike cold and wind.",
      Pitta: "Cool and well-ventilated weather; I dislike intense heat.",
      Kapha: "Warm and dry weather; I dislike cold and damp conditions."
    }
  },
  {
    id: "dreams",
    question: "My dreams are often:",
    options: {
      Vata: "Active, filled with movement, flying, or anxiety.",
      Pitta: "Intense, colorful, and may involve conflict or problem-solving.",
      Kapha: "Calm, peaceful, and often involve water or romantic themes."
    }
  },
  {
    id: "physical_activity",
    question: "My general level of physical activity is:",
    options: {
      Vata: "Restless and constantly moving.",
      Pitta: "Purposeful and competitive; I enjoy a challenge.",
      Kapha: "Sedentary; I need motivation to get moving."
    }
  },
  {
    id: "health_tendencies",
    question: "When I get sick, I am most prone to:",
    options: {
      Vata: "Pains, nervous system issues, constipation, and dryness.",
      Pitta: "Fevers, skin inflammation, infections, and acidity.",
      Kapha: "Congestion, coughs, fluid retention, and sinus problems."
    }
  },
  {
    id: "pulse",
    question: "My pulse, when I am relaxed, feels:",
    options: {
      Vata: "Fast, thin, and irregular, like a snake.",
      Pitta: "Strong, steady, and forceful, like a frog's jump.",
      Kapha: "Slow, deep, and gliding, like a swan."
    }
  },
  // Mental
  {
    id: "learning_style",
    question: "When learning something new, my style is:",
    options: {
      Vata: "I grasp things very quickly, but I also forget them just as fast.",
      Pitta: "I grasp things quickly and have a sharp, retentive memory.",
      Kapha: "I learn slowly and methodically, but have excellent long-term retention."
    }
  },
  {
    id: "mind",
    question: "My mind is generally:",
    options: {
      Vata: "Active, restless, and creative, with many thoughts at once.",
      Pitta: "Sharp, focused, logical, and discriminating.",
      Kapha: "Calm, steady, and stable; it takes a lot to perturb me."
    }
  },
  {
    id: "stress_response",
    question: "When faced with a stressful situation, my initial reaction is:",
    options: {
      Vata: "To feel anxious, worried, or fearful.",
      Pitta: "To feel irritable, angry, or frustrated.",
      Kapha: "To withdraw and become quiet, or to remain calm."
    }
  },
  {
    id: "mood",
    question: "My typical mood is:",
    options: {
      Vata: "Changeable and can swing quickly.",
      Pitta: "Intense and driven.",
      Kapha: "Stable, calm, and generally happy."
    }
  },
  {
    id: "speaking_style",
    question: "My manner of speaking is:",
    options: {
      Vata: "Fast and talkative; I may jump from topic to topic.",
      Pitta: "Clear, precise, and persuasive; can be argumentative.",
      Kapha: "Slow, deliberate, and I tend to speak less."
    }
  },
  {
    id: "social_style",
    question: "In social situations, I am:",
    options: {
      Vata: "Socially adaptable but may prefer smaller groups or solitude.",
      Pitta: "A natural leader, confident, and enjoy being in charge.",
      Kapha: "Very loyal and nurturing; I form lasting bonds."
    }
  },
  {
    id: "money_attitude",
    question: "My attitude towards money and spending is:",
    options: {
      Vata: "I spend money impulsively and can have trouble saving.",
      Pitta: "I save money but will spend it on valuable or luxury items.",
      Kapha: "I am a natural saver and am cautious with my spending."
    }
  },
  {
    id: "motivation",
    question: "As a person, I am most driven by:",
    options: {
      Vata: "Change, excitement, and new experiences.",
      Pitta: "Achievement, goals, and perfection.",
      Kapha: "Comfort, stability, and relationships."
    }
  }
]; 