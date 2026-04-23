export interface Language {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
  region: string;
  tier: 'Core' | 'Secondary' | 'Rare';
}

export interface PlayerLanguage {
  id: string;
  name: string;
  proficiency: number; // 0-100
  isNative: boolean;
}

export const ALL_LANGUAGES: Language[] = [
  // ── CORE LANGUAGES (widely spoken, commonly taught) ──
  // European Core
  { id: 'english', name: 'English', difficulty: 'Medium', region: 'Europe', tier: 'Core' },
  { id: 'french', name: 'French', difficulty: 'Medium', region: 'Europe', tier: 'Core' },
  { id: 'german', name: 'German', difficulty: 'Medium', region: 'Europe', tier: 'Core' },
  { id: 'spanish', name: 'Spanish', difficulty: 'Easy', region: 'Europe', tier: 'Core' },
  { id: 'portuguese', name: 'Portuguese', difficulty: 'Easy', region: 'Europe', tier: 'Core' },
  { id: 'italian', name: 'Italian', difficulty: 'Easy', region: 'Europe', tier: 'Core' },
  { id: 'russian', name: 'Russian', difficulty: 'Hard', region: 'Europe', tier: 'Core' },
  // Asian Core
  { id: 'mandarin', name: 'Mandarin Chinese', difficulty: 'Very Hard', region: 'Asia', tier: 'Core' },
  { id: 'japanese', name: 'Japanese', difficulty: 'Very Hard', region: 'Asia', tier: 'Core' },
  { id: 'korean', name: 'Korean', difficulty: 'Hard', region: 'Asia', tier: 'Core' },
  { id: 'hindi', name: 'Hindi', difficulty: 'Hard', region: 'Asia', tier: 'Core' },
  { id: 'arabic', name: 'Arabic', difficulty: 'Very Hard', region: 'Asia', tier: 'Core' },

  // ── SECONDARY LANGUAGES (regional importance) ──
  // European Secondary
  { id: 'dutch', name: 'Dutch', difficulty: 'Medium', region: 'Europe', tier: 'Secondary' },
  { id: 'flemish', name: 'Flemish', difficulty: 'Medium', region: 'Europe', tier: 'Secondary' },
  { id: 'polish', name: 'Polish', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'ukrainian', name: 'Ukrainian', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'swedish', name: 'Swedish', difficulty: 'Medium', region: 'Europe', tier: 'Secondary' },
  { id: 'norwegian', name: 'Norwegian', difficulty: 'Medium', region: 'Europe', tier: 'Secondary' },
  { id: 'danish', name: 'Danish', difficulty: 'Medium', region: 'Europe', tier: 'Secondary' },
  { id: 'finnish', name: 'Finnish', difficulty: 'Very Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'greek', name: 'Greek', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'turkish', name: 'Turkish', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'romanian', name: 'Romanian', difficulty: 'Medium', region: 'Europe', tier: 'Secondary' },
  { id: 'czech', name: 'Czech', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'hungarian', name: 'Hungarian', difficulty: 'Very Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'serbian', name: 'Serbian', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'croatian', name: 'Croatian', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'bulgarian', name: 'Bulgarian', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'slovak', name: 'Slovak', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'slovenian', name: 'Slovenian', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'estonian', name: 'Estonian', difficulty: 'Very Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'latvian', name: 'Latvian', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  { id: 'lithuanian', name: 'Lithuanian', difficulty: 'Hard', region: 'Europe', tier: 'Secondary' },
  // Asian Secondary
  { id: 'cantonese', name: 'Cantonese', difficulty: 'Very Hard', region: 'Asia', tier: 'Secondary' },
  { id: 'thai', name: 'Thai', difficulty: 'Hard', region: 'Asia', tier: 'Secondary' },
  { id: 'vietnamese', name: 'Vietnamese', difficulty: 'Hard', region: 'Asia', tier: 'Secondary' },
  { id: 'malay', name: 'Malay', difficulty: 'Medium', region: 'Asia', tier: 'Secondary' },
  { id: 'tagalog', name: 'Tagalog', difficulty: 'Medium', region: 'Asia', tier: 'Secondary' },
  { id: 'urdu', name: 'Urdu', difficulty: 'Hard', region: 'Asia', tier: 'Secondary' },
  { id: 'bengali', name: 'Bengali', difficulty: 'Hard', region: 'Asia', tier: 'Secondary' },
  { id: 'persian', name: 'Persian (Farsi)', difficulty: 'Hard', region: 'Asia', tier: 'Secondary' },
  { id: 'hebrew', name: 'Hebrew', difficulty: 'Hard', region: 'Asia', tier: 'Secondary' },
  { id: 'tamil', name: 'Tamil', difficulty: 'Very Hard', region: 'Asia', tier: 'Secondary' },
  // African Secondary
  { id: 'swahili', name: 'Swahili', difficulty: 'Medium', region: 'Africa', tier: 'Secondary' },
  { id: 'hausa', name: 'Hausa', difficulty: 'Hard', region: 'Africa', tier: 'Secondary' },
  { id: 'yoruba', name: 'Yoruba', difficulty: 'Hard', region: 'Africa', tier: 'Secondary' },
  { id: 'zulu', name: 'Zulu', difficulty: 'Hard', region: 'Africa', tier: 'Secondary' },
  { id: 'amharic', name: 'Amharic', difficulty: 'Very Hard', region: 'Africa', tier: 'Secondary' },
  { id: 'afrikaans', name: 'Afrikaans', difficulty: 'Medium', region: 'Africa', tier: 'Secondary' },

  // ── RARE LANGUAGES (indigenous, endangered, or niche) ──
  // Americas
  { id: 'nahuatl', name: 'Nahuatl', difficulty: 'Very Hard', region: 'Americas', tier: 'Rare' },
  { id: 'quechua', name: 'Quechua', difficulty: 'Hard', region: 'Americas', tier: 'Rare' },
  { id: 'creole', name: 'Haitian Creole', difficulty: 'Easy', region: 'Americas', tier: 'Rare' },
  { id: 'guarani', name: 'Guaraní', difficulty: 'Hard', region: 'Americas', tier: 'Rare' },
  { id: 'aymara', name: 'Aymara', difficulty: 'Very Hard', region: 'Americas', tier: 'Rare' },
  { id: 'mapudungun', name: 'Mapudungun', difficulty: 'Very Hard', region: 'Americas', tier: 'Rare' },
  { id: 'navajo', name: 'Navajo', difficulty: 'Very Hard', region: 'Americas', tier: 'Rare' },
  { id: 'cherokee', name: 'Cherokee', difficulty: 'Very Hard', region: 'Americas', tier: 'Rare' },
  // Oceania
  { id: 'maori', name: 'Māori', difficulty: 'Hard', region: 'Oceania', tier: 'Rare' },
  { id: 'hawaiian', name: 'Hawaiian', difficulty: 'Hard', region: 'Oceania', tier: 'Rare' },
  { id: 'samoan', name: 'Samoan', difficulty: 'Medium', region: 'Oceania', tier: 'Rare' },
  { id: 'tongan', name: 'Tongan', difficulty: 'Medium', region: 'Oceania', tier: 'Rare' },
  { id: 'fijian', name: 'Fijian', difficulty: 'Medium', region: 'Oceania', tier: 'Rare' },
  // Africa Rare
  { id: 'wolof', name: 'Wolof', difficulty: 'Hard', region: 'Africa', tier: 'Rare' },
  { id: 'somali', name: 'Somali', difficulty: 'Hard', region: 'Africa', tier: 'Rare' },
  { id: 'shona', name: 'Shona', difficulty: 'Hard', region: 'Africa', tier: 'Rare' },
  { id: 'igbo', name: 'Igbo', difficulty: 'Hard', region: 'Africa', tier: 'Rare' },
  { id: 'xhosa', name: 'Xhosa', difficulty: 'Very Hard', region: 'Africa', tier: 'Rare' },
  { id: 'twi', name: 'Twi', difficulty: 'Hard', region: 'Africa', tier: 'Rare' },
  // Asia Rare
  { id: 'khmer', name: 'Khmer', difficulty: 'Hard', region: 'Asia', tier: 'Rare' },
  { id: 'lao', name: 'Lao', difficulty: 'Hard', region: 'Asia', tier: 'Rare' },
  { id: 'burmese', name: 'Burmese', difficulty: 'Very Hard', region: 'Asia', tier: 'Rare' },
  { id: 'mongolian', name: 'Mongolian', difficulty: 'Very Hard', region: 'Asia', tier: 'Rare' },
  { id: 'nepali', name: 'Nepali', difficulty: 'Hard', region: 'Asia', tier: 'Rare' },
  { id: 'sinhala', name: 'Sinhala', difficulty: 'Very Hard', region: 'Asia', tier: 'Rare' },
  { id: 'kazakh', name: 'Kazakh', difficulty: 'Hard', region: 'Asia', tier: 'Rare' },
  { id: 'uzbek', name: 'Uzbek', difficulty: 'Hard', region: 'Asia', tier: 'Rare' },
  { id: 'dari', name: 'Dari', difficulty: 'Hard', region: 'Asia', tier: 'Rare' },
  { id: 'pashto', name: 'Pashto', difficulty: 'Hard', region: 'Asia', tier: 'Rare' },
  // Europe Rare
  { id: 'albanian', name: 'Albanian', difficulty: 'Hard', region: 'Europe', tier: 'Rare' },
  { id: 'icelandic', name: 'Icelandic', difficulty: 'Very Hard', region: 'Europe', tier: 'Rare' },
  { id: 'irish', name: 'Irish (Gaeilge)', difficulty: 'Hard', region: 'Europe', tier: 'Rare' },
  { id: 'welsh', name: 'Welsh', difficulty: 'Hard', region: 'Europe', tier: 'Rare' },
  { id: 'basque', name: 'Basque', difficulty: 'Very Hard', region: 'Europe', tier: 'Rare' },
  { id: 'catalan', name: 'Catalan', difficulty: 'Medium', region: 'Europe', tier: 'Rare' },
  { id: 'luxembourgish', name: 'Luxembourgish', difficulty: 'Medium', region: 'Europe', tier: 'Rare' },
  { id: 'maltese', name: 'Maltese', difficulty: 'Hard', region: 'Europe', tier: 'Rare' },
  { id: 'bosnian', name: 'Bosnian', difficulty: 'Hard', region: 'Europe', tier: 'Rare' },
  { id: 'macedonian', name: 'Macedonian', difficulty: 'Hard', region: 'Europe', tier: 'Rare' },
  { id: 'montenegrin', name: 'Montenegrin', difficulty: 'Hard', region: 'Europe', tier: 'Rare' },
  { id: 'belarusian', name: 'Belarusian', difficulty: 'Hard', region: 'Europe', tier: 'Rare' },
  { id: 'azerbaijani', name: 'Azerbaijani', difficulty: 'Hard', region: 'Europe', tier: 'Rare' },
  { id: 'armenian', name: 'Armenian', difficulty: 'Very Hard', region: 'Europe', tier: 'Rare' },
  { id: 'georgian', name: 'Georgian', difficulty: 'Very Hard', region: 'Europe', tier: 'Rare' },
];

// Map countries to their native/common languages (players get these at birth)
export const COUNTRY_LANGUAGES: Record<string, string[]> = {
  "Afghanistan": ["dari", "pashto"],
  "Albania": ["albanian"],
  "Algeria": ["arabic", "french"],
  "Argentina": ["spanish"],
  "Armenia": ["armenian"],
  "Australia": ["english"],
  "Austria": ["german"],
  "Azerbaijan": ["azerbaijani"],
  "Bangladesh": ["bengali"],
  "Belarus": ["russian", "belarusian"],
  "Belgium": ["flemish", "french", "german"],
  "Bolivia": ["spanish", "quechua"],
  "Bosnia and Herzegovina": ["bosnian"],
  "Brazil": ["portuguese"],
  "Bulgaria": ["bulgarian"],
  "Cambodia": ["khmer"],
  "Cameroon": ["french", "english"],
  "Canada": ["english", "french"],
  "Chile": ["spanish"],
  "China": ["mandarin"],
  "Colombia": ["spanish"],
  "Costa Rica": ["spanish"],
  "Croatia": ["croatian"],
  "Cuba": ["spanish"],
  "Cyprus": ["greek", "turkish"],
  "Czechia": ["czech"],
  "Democratic Republic of the Congo": ["french", "swahili"],
  "Denmark": ["danish"],
  "Dominican Republic": ["spanish"],
  "Ecuador": ["spanish"],
  "Egypt": ["arabic"],
  "El Salvador": ["spanish"],
  "Estonia": ["estonian"],
  "Ethiopia": ["amharic"],
  "Finland": ["finnish", "swedish"],
  "France": ["french"],
  "Germany": ["german"],
  "Ghana": ["english"],
  "Greece": ["greek"],
  "Guatemala": ["spanish"],
  "Haiti": ["creole", "french"],
  "Honduras": ["spanish"],
  "Hungary": ["hungarian"],
  "Iceland": ["icelandic"],
  "India": ["hindi", "english"],
  "Indonesia": ["malay"],
  "Iran": ["persian"],
  "Iraq": ["arabic"],
  "Ireland": ["english", "irish"],
  "Israel": ["hebrew", "arabic"],
  "Italy": ["italian"],
  "Jamaica": ["english"],
  "Japan": ["japanese"],
  "Jordan": ["arabic"],
  "Kazakhstan": ["kazakh", "russian"],
  "Kenya": ["swahili", "english"],
  "Kuwait": ["arabic"],
  "Laos": ["lao"],
  "Latvia": ["latvian"],
  "Lebanon": ["arabic", "french"],
  "Libya": ["arabic"],
  "Lithuania": ["lithuanian"],
  "Luxembourg": ["french", "german", "luxembourgish"],
  "Malaysia": ["malay", "english"],
  "Mexico": ["spanish"],
  "Mongolia": ["mongolian"],
  "Montenegro": ["montenegrin"],
  "Morocco": ["arabic", "french"],
  "Mozambique": ["portuguese"],
  "Myanmar": ["burmese"],
  "Nepal": ["nepali"],
  "Netherlands": ["dutch"],
  "New Zealand": ["english"],
  "Nicaragua": ["spanish"],
  "Nigeria": ["english", "hausa", "yoruba"],
  "North Korea": ["korean"],
  "North Macedonia": ["macedonian"],
  "Norway": ["norwegian"],
  "Pakistan": ["urdu", "english"],
  "Panama": ["spanish"],
  "Paraguay": ["spanish", "guarani"],
  "Peru": ["spanish", "quechua"],
  "Philippines": ["tagalog", "english"],
  "Poland": ["polish"],
  "Portugal": ["portuguese"],
  "Qatar": ["arabic"],
  "Romania": ["romanian"],
  "Russia": ["russian"],
  "Saudi Arabia": ["arabic"],
  "Senegal": ["french", "wolof"],
  "Serbia": ["serbian"],
  "Singapore": ["english", "mandarin", "malay", "tamil"],
  "Slovakia": ["slovak"],
  "Slovenia": ["slovenian"],
  "Somalia": ["somali", "arabic"],
  "South Africa": ["english", "zulu", "afrikaans"],
  "South Korea": ["korean"],
  "Spain": ["spanish"],
  "Sri Lanka": ["sinhala", "tamil"],
  "Sudan": ["arabic"],
  "Sweden": ["swedish"],
  "Switzerland": ["german", "french", "italian"],
  "Syria": ["arabic"],
  "Tanzania": ["swahili", "english"],
  "Thailand": ["thai"],
  "Tunisia": ["arabic", "french"],
  "Turkey": ["turkish"],
  "Uganda": ["english", "swahili"],
  "Ukraine": ["ukrainian"],
  "United Arab Emirates": ["arabic", "english"],
  "United Kingdom": ["english"],
  "United States": ["english"],
  "Uruguay": ["spanish"],
  "Uzbekistan": ["uzbek"],
  "Venezuela": ["spanish"],
  "Vietnam": ["vietnamese"],
  "Yemen": ["arabic"],
  "Zambia": ["english"],
  "Zimbabwe": ["english", "shona"],
};

// Languages available to learn at school (the 25 core ones)
export const LEARNABLE_LANGUAGES = ALL_LANGUAGES;

// Cost to study a language per year
export const LANGUAGE_STUDY_COST: Record<Language['difficulty'], number> = {
  'Easy': 500,
  'Medium': 800,
  'Hard': 1200,
  'Very Hard': 1800,
};

// Proficiency gain per year of study (affected by smarts)
export const LANGUAGE_YEARLY_GAIN: Record<Language['difficulty'], number> = {
  'Easy': 25,
  'Medium': 18,
  'Hard': 12,
  'Very Hard': 8,
};

// Salary bonus multiplier per known language (proficiency >= 50)
export function getLanguageSalaryBonus(languages: PlayerLanguage[]): number {
  const usefulLanguages = languages.filter(l => l.proficiency >= 50 && !l.isNative);
  if (usefulLanguages.length === 0) return 1.0;
  // Each extra language gives 3-8% bonus depending on proficiency
  let bonus = 1.0;
  for (const lang of usefulLanguages) {
    bonus += (lang.proficiency / 100) * 0.08;
  }
  return bonus;
}

// Get starting languages for a country (all native, proficiency 100)
export function getStartingLanguages(country: string): PlayerLanguage[] {
  const langIds = COUNTRY_LANGUAGES[country] || ['english'];
  return langIds.map(id => {
    const langDef = ALL_LANGUAGES.find(l => l.id === id);
    return {
      id,
      name: langDef?.name || id.charAt(0).toUpperCase() + id.slice(1),
      proficiency: 100,
      isNative: true,
    };
  });
}
