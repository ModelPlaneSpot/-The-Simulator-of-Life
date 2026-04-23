// Immigration & Passport System
// Realistic immigration mechanics for 197 countries

export type VisaType = 'tourist' | 'student' | 'work' | 'investment' | 'family' | 'asylum' | 'permanent_residency' | 'citizenship';

export interface VisaRequirement {
  type: VisaType;
  label: string;
  description: string;
  processingTimeYears: number; // how many game-years to process
  cost: number;
  requirements: {
    minAge?: number;
    minMoney?: number;
    minSmarts?: number;
    minEducation?: string;
    minKarma?: number;
    hasJob?: boolean;
    hasPartner?: boolean; // for family visa
    partnerFromCountry?: boolean;
    minLanguageProficiency?: number; // 0-100 for country's language
    nocriminal?: boolean;
  };
  successBaseChance: number; // 0-1
  grantsDuration?: number; // years, undefined = permanent
}

export interface PassportData {
  country: string;
  strength: number; // 1-100 (passport power index)
  visaFreeCountries: number; // how many countries can visit visa-free
  tier: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface CountryImmigrationProfile {
  country: string;
  region: string;
  officialLanguage: string;
  difficulty: 'very_easy' | 'easy' | 'moderate' | 'hard' | 'very_hard' | 'nearly_impossible';
  acceptsImmigrants: boolean;
  availableVisas: VisaType[];
  // Country-specific modifiers
  wealthBias: number; // 0-1, how much wealth matters
  educationBias: number; // 0-1, how much education matters
  skillBias: number; // 0-1, how much skills/smarts matter
  languageRequired: boolean;
  minimumInvestment?: number; // for investment visa
  citizenshipByInvestment?: number; // cost for golden visa
  yearsForCitizenship: number; // years of residency needed
  description: string;
}

// Passport strength data for all 197 countries
// Based on real-world Henley Passport Index rankings
export const PASSPORT_DATA: Record<string, PassportData> = {
  // Tier S — Top passports (visa-free to 180+ countries)
  "Japan": { country: "Japan", strength: 97, visaFreeCountries: 193, tier: 'S' },
  "Singapore": { country: "Singapore", strength: 96, visaFreeCountries: 192, tier: 'S' },
  "South Korea": { country: "South Korea", strength: 95, visaFreeCountries: 191, tier: 'S' },
  "Germany": { country: "Germany", strength: 94, visaFreeCountries: 190, tier: 'S' },
  "Spain": { country: "Spain", strength: 94, visaFreeCountries: 190, tier: 'S' },
  "Finland": { country: "Finland", strength: 93, visaFreeCountries: 189, tier: 'S' },
  "Italy": { country: "Italy", strength: 93, visaFreeCountries: 189, tier: 'S' },
  "Luxembourg": { country: "Luxembourg", strength: 93, visaFreeCountries: 189, tier: 'S' },
  "Austria": { country: "Austria", strength: 92, visaFreeCountries: 188, tier: 'S' },
  "Denmark": { country: "Denmark", strength: 92, visaFreeCountries: 188, tier: 'S' },
  "France": { country: "France", strength: 92, visaFreeCountries: 188, tier: 'S' },
  "Ireland": { country: "Ireland", strength: 92, visaFreeCountries: 188, tier: 'S' },
  "Netherlands": { country: "Netherlands", strength: 92, visaFreeCountries: 188, tier: 'S' },
  "Sweden": { country: "Sweden", strength: 92, visaFreeCountries: 188, tier: 'S' },
  "United Kingdom": { country: "United Kingdom", strength: 91, visaFreeCountries: 187, tier: 'S' },
  "Norway": { country: "Norway", strength: 91, visaFreeCountries: 187, tier: 'S' },
  "Portugal": { country: "Portugal", strength: 91, visaFreeCountries: 187, tier: 'S' },
  "Belgium": { country: "Belgium", strength: 91, visaFreeCountries: 187, tier: 'S' },
  "Switzerland": { country: "Switzerland", strength: 91, visaFreeCountries: 187, tier: 'S' },
  "New Zealand": { country: "New Zealand", strength: 90, visaFreeCountries: 186, tier: 'S' },

  // Tier A — Strong passports (visa-free to 160-185 countries)
  "Australia": { country: "Australia", strength: 90, visaFreeCountries: 186, tier: 'A' },
  "Canada": { country: "Canada", strength: 89, visaFreeCountries: 185, tier: 'A' },
  "United States": { country: "United States", strength: 88, visaFreeCountries: 184, tier: 'A' },
  "Greece": { country: "Greece", strength: 88, visaFreeCountries: 184, tier: 'A' },
  "Malta": { country: "Malta", strength: 87, visaFreeCountries: 183, tier: 'A' },
  "Czechia": { country: "Czechia", strength: 87, visaFreeCountries: 183, tier: 'A' },
  "Poland": { country: "Poland", strength: 86, visaFreeCountries: 182, tier: 'A' },
  "Hungary": { country: "Hungary", strength: 85, visaFreeCountries: 181, tier: 'A' },
  "Iceland": { country: "Iceland", strength: 85, visaFreeCountries: 181, tier: 'A' },
  "Lithuania": { country: "Lithuania", strength: 85, visaFreeCountries: 181, tier: 'A' },
  "Slovakia": { country: "Slovakia", strength: 85, visaFreeCountries: 181, tier: 'A' },
  "Slovenia": { country: "Slovenia", strength: 85, visaFreeCountries: 181, tier: 'A' },
  "Latvia": { country: "Latvia", strength: 84, visaFreeCountries: 180, tier: 'A' },
  "Estonia": { country: "Estonia", strength: 84, visaFreeCountries: 180, tier: 'A' },
  "Croatia": { country: "Croatia", strength: 83, visaFreeCountries: 179, tier: 'A' },
  "Romania": { country: "Romania", strength: 82, visaFreeCountries: 176, tier: 'A' },
  "Bulgaria": { country: "Bulgaria", strength: 81, visaFreeCountries: 174, tier: 'A' },
  "Chile": { country: "Chile", strength: 80, visaFreeCountries: 174, tier: 'A' },
  "Malaysia": { country: "Malaysia", strength: 79, visaFreeCountries: 172, tier: 'A' },
  "Israel": { country: "Israel", strength: 78, visaFreeCountries: 161, tier: 'A' },
  "United Arab Emirates": { country: "United Arab Emirates", strength: 78, visaFreeCountries: 178, tier: 'A' },
  "Argentina": { country: "Argentina", strength: 77, visaFreeCountries: 170, tier: 'A' },
  "Brazil": { country: "Brazil", strength: 76, visaFreeCountries: 168, tier: 'A' },
  "Mexico": { country: "Mexico", strength: 75, visaFreeCountries: 159, tier: 'A' },
  "Cyprus": { country: "Cyprus", strength: 82, visaFreeCountries: 176, tier: 'A' },
  "Liechtenstein": { country: "Liechtenstein", strength: 88, visaFreeCountries: 184, tier: 'A' },
  "Monaco": { country: "Monaco", strength: 86, visaFreeCountries: 182, tier: 'A' },
  "San Marino": { country: "San Marino", strength: 84, visaFreeCountries: 172, tier: 'A' },
  "Andorra": { country: "Andorra", strength: 82, visaFreeCountries: 170, tier: 'A' },
  "Brunei": { country: "Brunei", strength: 75, visaFreeCountries: 163, tier: 'A' },
  "Barbados": { country: "Barbados", strength: 73, visaFreeCountries: 155, tier: 'A' },
  "Bahamas": { country: "Bahamas", strength: 72, visaFreeCountries: 153, tier: 'A' },
  "Uruguay": { country: "Uruguay", strength: 74, visaFreeCountries: 155, tier: 'A' },
  "Costa Rica": { country: "Costa Rica", strength: 72, visaFreeCountries: 152, tier: 'A' },
  "Panama": { country: "Panama", strength: 71, visaFreeCountries: 142, tier: 'A' },
  "Antigua and Barbuda": { country: "Antigua and Barbuda", strength: 70, visaFreeCountries: 148, tier: 'A' },
  "Trinidad and Tobago": { country: "Trinidad and Tobago", strength: 69, visaFreeCountries: 147, tier: 'A' },
  "Saint Kitts and Nevis": { country: "Saint Kitts and Nevis", strength: 70, visaFreeCountries: 152, tier: 'A' },
  "Saint Lucia": { country: "Saint Lucia", strength: 68, visaFreeCountries: 146, tier: 'A' },
  "Saint Vincent and the Grenadines": { country: "Saint Vincent and the Grenadines", strength: 67, visaFreeCountries: 145, tier: 'A' },
  "Grenada": { country: "Grenada", strength: 68, visaFreeCountries: 148, tier: 'A' },
  "Dominica": { country: "Dominica", strength: 67, visaFreeCountries: 145, tier: 'A' },
  "Mauritius": { country: "Mauritius", strength: 68, visaFreeCountries: 146, tier: 'A' },
  "Seychelles": { country: "Seychelles", strength: 66, visaFreeCountries: 144, tier: 'A' },

  // Tier B — Moderate passports (visa-free to 100-159 countries)
  "Serbia": { country: "Serbia", strength: 65, visaFreeCountries: 140, tier: 'B' },
  "Montenegro": { country: "Montenegro", strength: 64, visaFreeCountries: 124, tier: 'B' },
  "North Macedonia": { country: "North Macedonia", strength: 63, visaFreeCountries: 124, tier: 'B' },
  "Bosnia and Herzegovina": { country: "Bosnia and Herzegovina", strength: 62, visaFreeCountries: 121, tier: 'B' },
  "Albania": { country: "Albania", strength: 61, visaFreeCountries: 118, tier: 'B' },
  "Moldova": { country: "Moldova", strength: 60, visaFreeCountries: 116, tier: 'B' },
  "Georgia": { country: "Georgia", strength: 59, visaFreeCountries: 114, tier: 'B' },
  "Ukraine": { country: "Ukraine", strength: 58, visaFreeCountries: 144, tier: 'B' },
  "Turkey": { country: "Turkey", strength: 57, visaFreeCountries: 111, tier: 'B' },
  "Thailand": { country: "Thailand", strength: 56, visaFreeCountries: 78, tier: 'B' },
  "South Africa": { country: "South Africa", strength: 55, visaFreeCountries: 103, tier: 'B' },
  "Colombia": { country: "Colombia", strength: 54, visaFreeCountries: 131, tier: 'B' },
  "Peru": { country: "Peru", strength: 53, visaFreeCountries: 135, tier: 'B' },
  "Paraguay": { country: "Paraguay", strength: 52, visaFreeCountries: 132, tier: 'B' },
  "Ecuador": { country: "Ecuador", strength: 51, visaFreeCountries: 85, tier: 'B' },
  "Bolivia": { country: "Bolivia", strength: 50, visaFreeCountries: 78, tier: 'B' },
  "Guatemala": { country: "Guatemala", strength: 49, visaFreeCountries: 133, tier: 'B' },
  "Honduras": { country: "Honduras", strength: 48, visaFreeCountries: 131, tier: 'B' },
  "El Salvador": { country: "El Salvador", strength: 48, visaFreeCountries: 130, tier: 'B' },
  "Nicaragua": { country: "Nicaragua", strength: 47, visaFreeCountries: 128, tier: 'B' },
  "Dominican Republic": { country: "Dominican Republic", strength: 46, visaFreeCountries: 71, tier: 'B' },
  "Jamaica": { country: "Jamaica", strength: 46, visaFreeCountries: 81, tier: 'B' },
  "Guyana": { country: "Guyana", strength: 45, visaFreeCountries: 85, tier: 'B' },
  "Suriname": { country: "Suriname", strength: 44, visaFreeCountries: 79, tier: 'B' },
  "Belize": { country: "Belize", strength: 44, visaFreeCountries: 97, tier: 'B' },
  "Fiji": { country: "Fiji", strength: 45, visaFreeCountries: 89, tier: 'B' },
  "Samoa": { country: "Samoa", strength: 43, visaFreeCountries: 115, tier: 'B' },
  "Tonga": { country: "Tonga", strength: 42, visaFreeCountries: 107, tier: 'B' },
  "Vanuatu": { country: "Vanuatu", strength: 43, visaFreeCountries: 112, tier: 'B' },
  "Palau": { country: "Palau", strength: 42, visaFreeCountries: 117, tier: 'B' },
  "Micronesia": { country: "Micronesia", strength: 41, visaFreeCountries: 111, tier: 'B' },
  "Marshall Islands": { country: "Marshall Islands", strength: 41, visaFreeCountries: 113, tier: 'B' },
  "Kiribati": { country: "Kiribati", strength: 40, visaFreeCountries: 80, tier: 'B' },
  "Nauru": { country: "Nauru", strength: 40, visaFreeCountries: 89, tier: 'B' },
  "Tuvalu": { country: "Tuvalu", strength: 39, visaFreeCountries: 86, tier: 'B' },
  "Solomon Islands": { country: "Solomon Islands", strength: 39, visaFreeCountries: 82, tier: 'B' },
  "Papua New Guinea": { country: "Papua New Guinea", strength: 38, visaFreeCountries: 80, tier: 'B' },
  "Timor-Leste": { country: "Timor-Leste", strength: 38, visaFreeCountries: 85, tier: 'B' },
  "Philippines": { country: "Philippines", strength: 42, visaFreeCountries: 67, tier: 'B' },
  "Indonesia": { country: "Indonesia", strength: 43, visaFreeCountries: 72, tier: 'B' },
  "Vietnam": { country: "Vietnam", strength: 41, visaFreeCountries: 55, tier: 'B' },
  "Cabo Verde": { country: "Cabo Verde", strength: 42, visaFreeCountries: 79, tier: 'B' },
  "Sao Tome and Principe": { country: "Sao Tome and Principe", strength: 40, visaFreeCountries: 75, tier: 'B' },
  "Maldives": { country: "Maldives", strength: 43, visaFreeCountries: 87, tier: 'B' },
  "Kuwait": { country: "Kuwait", strength: 55, visaFreeCountries: 95, tier: 'B' },
  "Qatar": { country: "Qatar", strength: 56, visaFreeCountries: 100, tier: 'B' },
  "Bahrain": { country: "Bahrain", strength: 52, visaFreeCountries: 87, tier: 'B' },
  "Oman": { country: "Oman", strength: 50, visaFreeCountries: 79, tier: 'B' },
  "Saudi Arabia": { country: "Saudi Arabia", strength: 48, visaFreeCountries: 79, tier: 'B' },
  "Botswana": { country: "Botswana", strength: 46, visaFreeCountries: 83, tier: 'B' },
  "Namibia": { country: "Namibia", strength: 44, visaFreeCountries: 76, tier: 'B' },
  "Kenya": { country: "Kenya", strength: 43, visaFreeCountries: 72, tier: 'B' },
  "Ghana": { country: "Ghana", strength: 42, visaFreeCountries: 66, tier: 'B' },
  "Tanzania": { country: "Tanzania", strength: 41, visaFreeCountries: 70, tier: 'B' },
  "Tunisia": { country: "Tunisia", strength: 43, visaFreeCountries: 71, tier: 'B' },
  "Morocco": { country: "Morocco", strength: 44, visaFreeCountries: 69, tier: 'B' },
  "Kazakhstan": { country: "Kazakhstan", strength: 45, visaFreeCountries: 76, tier: 'B' },
  "Azerbaijan": { country: "Azerbaijan", strength: 42, visaFreeCountries: 68, tier: 'B' },
  "Armenia": { country: "Armenia", strength: 41, visaFreeCountries: 65, tier: 'B' },
  "Kyrgyzstan": { country: "Kyrgyzstan", strength: 39, visaFreeCountries: 63, tier: 'B' },
  "Uzbekistan": { country: "Uzbekistan", strength: 38, visaFreeCountries: 58, tier: 'B' },
  "Tajikistan": { country: "Tajikistan", strength: 36, visaFreeCountries: 55, tier: 'B' },
  "Turkmenistan": { country: "Turkmenistan", strength: 35, visaFreeCountries: 51, tier: 'B' },
  "Mongolia": { country: "Mongolia", strength: 40, visaFreeCountries: 65, tier: 'B' },
  "Cuba": { country: "Cuba", strength: 38, visaFreeCountries: 65, tier: 'B' },
  "Eswatini": { country: "Eswatini", strength: 38, visaFreeCountries: 65, tier: 'B' },
  "Lesotho": { country: "Lesotho", strength: 37, visaFreeCountries: 63, tier: 'B' },
  "Gabon": { country: "Gabon", strength: 40, visaFreeCountries: 63, tier: 'B' },
  "Senegal": { country: "Senegal", strength: 39, visaFreeCountries: 63, tier: 'B' },
  "Benin": { country: "Benin", strength: 38, visaFreeCountries: 62, tier: 'B' },
  "Rwanda": { country: "Rwanda", strength: 37, visaFreeCountries: 60, tier: 'B' },
  "Zambia": { country: "Zambia", strength: 37, visaFreeCountries: 60, tier: 'B' },
  "Zimbabwe": { country: "Zimbabwe", strength: 35, visaFreeCountries: 54, tier: 'B' },
  "Mozambique": { country: "Mozambique", strength: 36, visaFreeCountries: 59, tier: 'B' },
  "Malawi": { country: "Malawi", strength: 35, visaFreeCountries: 58, tier: 'B' },
  "Madagascar": { country: "Madagascar", strength: 34, visaFreeCountries: 56, tier: 'B' },
  "Uganda": { country: "Uganda", strength: 36, visaFreeCountries: 62, tier: 'B' },
  "Jordan": { country: "Jordan", strength: 43, visaFreeCountries: 51, tier: 'B' },

  // Tier C — Weak passports (visa-free to 50-99 countries)
  "Russia": { country: "Russia", strength: 50, visaFreeCountries: 118, tier: 'C' },
  "China": { country: "China", strength: 45, visaFreeCountries: 80, tier: 'C' },
  "India": { country: "India", strength: 40, visaFreeCountries: 60, tier: 'C' },
  "Egypt": { country: "Egypt", strength: 38, visaFreeCountries: 53, tier: 'C' },
  "Algeria": { country: "Algeria", strength: 36, visaFreeCountries: 50, tier: 'C' },
  "Lebanon": { country: "Lebanon", strength: 37, visaFreeCountries: 49, tier: 'C' },
  "Sri Lanka": { country: "Sri Lanka", strength: 35, visaFreeCountries: 42, tier: 'C' },
  "Nepal": { country: "Nepal", strength: 33, visaFreeCountries: 38, tier: 'C' },
  "Bhutan": { country: "Bhutan", strength: 32, visaFreeCountries: 53, tier: 'C' },
  "Laos": { country: "Laos", strength: 33, visaFreeCountries: 50, tier: 'C' },
  "Cambodia": { country: "Cambodia", strength: 34, visaFreeCountries: 54, tier: 'C' },
  "Myanmar": { country: "Myanmar", strength: 31, visaFreeCountries: 47, tier: 'C' },
  "Bangladesh": { country: "Bangladesh", strength: 30, visaFreeCountries: 41, tier: 'C' },
  "Nigeria": { country: "Nigeria", strength: 32, visaFreeCountries: 46, tier: 'C' },
  "Cameroon": { country: "Cameroon", strength: 33, visaFreeCountries: 48, tier: 'C' },
  "Guinea": { country: "Guinea", strength: 30, visaFreeCountries: 45, tier: 'C' },
  "Guinea-Bissau": { country: "Guinea-Bissau", strength: 29, visaFreeCountries: 44, tier: 'C' },
  "Sierra Leone": { country: "Sierra Leone", strength: 28, visaFreeCountries: 43, tier: 'C' },
  "Liberia": { country: "Liberia", strength: 29, visaFreeCountries: 46, tier: 'C' },
  "Togo": { country: "Togo", strength: 30, visaFreeCountries: 47, tier: 'C' },
  "Burkina Faso": { country: "Burkina Faso", strength: 29, visaFreeCountries: 45, tier: 'C' },
  "Mali": { country: "Mali", strength: 28, visaFreeCountries: 44, tier: 'C' },
  "Niger": { country: "Niger", strength: 27, visaFreeCountries: 42, tier: 'C' },
  "Chad": { country: "Chad", strength: 26, visaFreeCountries: 40, tier: 'C' },
  "Central African Republic": { country: "Central African Republic", strength: 25, visaFreeCountries: 38, tier: 'C' },
  "Comoros": { country: "Comoros", strength: 30, visaFreeCountries: 50, tier: 'C' },
  "Djibouti": { country: "Djibouti", strength: 31, visaFreeCountries: 49, tier: 'C' },
  "Mauritania": { country: "Mauritania", strength: 30, visaFreeCountries: 47, tier: 'C' },
  "Gambia": { country: "Gambia", strength: 30, visaFreeCountries: 60, tier: 'C' },
  "Equatorial Guinea": { country: "Equatorial Guinea", strength: 32, visaFreeCountries: 53, tier: 'C' },
  "Congo (Congo-Brazzaville)": { country: "Congo (Congo-Brazzaville)", strength: 30, visaFreeCountries: 47, tier: 'C' },

  // Tier D — Very weak passports
  "Iran": { country: "Iran", strength: 28, visaFreeCountries: 43, tier: 'D' },
  "Sudan": { country: "Sudan", strength: 25, visaFreeCountries: 38, tier: 'D' },
  "South Sudan": { country: "South Sudan", strength: 22, visaFreeCountries: 35, tier: 'D' },
  "Libya": { country: "Libya", strength: 26, visaFreeCountries: 39, tier: 'D' },
  "Eritrea": { country: "Eritrea", strength: 24, visaFreeCountries: 38, tier: 'D' },
  "Ethiopia": { country: "Ethiopia", strength: 30, visaFreeCountries: 45, tier: 'D' },
  "Democratic Republic of the Congo": { country: "Democratic Republic of the Congo", strength: 24, visaFreeCountries: 38, tier: 'D' },
  "Burundi": { country: "Burundi", strength: 25, visaFreeCountries: 40, tier: 'D' },
  "Haiti": { country: "Haiti", strength: 27, visaFreeCountries: 49, tier: 'D' },
  "Venezuela": { country: "Venezuela", strength: 30, visaFreeCountries: 46, tier: 'D' },

  // Tier F — Most restricted passports
  "Pakistan": { country: "Pakistan", strength: 22, visaFreeCountries: 33, tier: 'F' },
  "Somalia": { country: "Somalia", strength: 20, visaFreeCountries: 35, tier: 'F' },
  "Syria": { country: "Syria", strength: 18, visaFreeCountries: 30, tier: 'F' },
  "Iraq": { country: "Iraq", strength: 20, visaFreeCountries: 31, tier: 'F' },
  "Afghanistan": { country: "Afghanistan", strength: 15, visaFreeCountries: 27, tier: 'F' },
  "Yemen": { country: "Yemen", strength: 19, visaFreeCountries: 34, tier: 'F' },
  "North Korea": { country: "North Korea", strength: 12, visaFreeCountries: 40, tier: 'F' },
  "Palestine State": { country: "Palestine State", strength: 20, visaFreeCountries: 37, tier: 'F' },

  // Holy See
  "Holy See": { country: "Holy See", strength: 80, visaFreeCountries: 170, tier: 'A' },
};

// Generate default passport for countries not explicitly listed
export function getPassportData(country: string): PassportData {
  if (PASSPORT_DATA[country]) return PASSPORT_DATA[country];
  return { country, strength: 40, visaFreeCountries: 65, tier: 'C' };
}

// Immigration profiles for key countries (detailed rules)
// Other countries use generated defaults based on their region and stability
export const IMMIGRATION_PROFILES: Record<string, CountryImmigrationProfile> = {
  "United States": {
    country: "United States",
    region: "North America",
    officialLanguage: "English",
    difficulty: 'hard',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'asylum', 'permanent_residency', 'citizenship'],
    wealthBias: 0.6,
    educationBias: 0.8,
    skillBias: 0.7,
    languageRequired: false,
    minimumInvestment: 800000,
    citizenshipByInvestment: undefined,
    yearsForCitizenship: 5,
    description: "Green Card lottery, employer sponsorship, or family-based. Highly competitive.",
  },
  "Canada": {
    country: "Canada",
    region: "North America",
    officialLanguage: "English",
    difficulty: 'moderate',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'asylum', 'permanent_residency', 'citizenship'],
    wealthBias: 0.4,
    educationBias: 0.9,
    skillBias: 0.8,
    languageRequired: true,
    minimumInvestment: 200000,
    yearsForCitizenship: 3,
    description: "Express Entry points system. Education, language, and work experience valued.",
  },
  "United Kingdom": {
    country: "United Kingdom",
    region: "Europe",
    officialLanguage: "English",
    difficulty: 'hard',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.5,
    educationBias: 0.7,
    skillBias: 0.8,
    languageRequired: true,
    minimumInvestment: 2000000,
    yearsForCitizenship: 6,
    description: "Points-based system. Skilled Worker visa requires employer sponsorship.",
  },
  "Australia": {
    country: "Australia",
    region: "Oceania",
    officialLanguage: "English",
    difficulty: 'moderate',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.5,
    educationBias: 0.8,
    skillBias: 0.9,
    languageRequired: true,
    minimumInvestment: 500000,
    yearsForCitizenship: 4,
    description: "Skilled migration program. Points-based system favoring young, educated workers.",
  },
  "Germany": {
    country: "Germany",
    region: "Europe",
    officialLanguage: "German",
    difficulty: 'moderate',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'asylum', 'permanent_residency', 'citizenship'],
    wealthBias: 0.3,
    educationBias: 0.8,
    skillBias: 0.7,
    languageRequired: true,
    minimumInvestment: 250000,
    yearsForCitizenship: 8,
    description: "Blue Card for skilled workers. Language proficiency highly valued.",
  },
  "Japan": {
    country: "Japan",
    region: "East Asia",
    officialLanguage: "Japanese",
    difficulty: 'very_hard',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'permanent_residency', 'citizenship'],
    wealthBias: 0.4,
    educationBias: 0.6,
    skillBias: 0.8,
    languageRequired: true,
    minimumInvestment: 500000,
    yearsForCitizenship: 10,
    description: "Highly restrictive. Must renounce other citizenship. Language fluency expected.",
  },
  "Singapore": {
    country: "Singapore",
    region: "Southeast Asia",
    officialLanguage: "English",
    difficulty: 'hard',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'permanent_residency', 'citizenship'],
    wealthBias: 0.8,
    educationBias: 0.7,
    skillBias: 0.8,
    languageRequired: false,
    minimumInvestment: 2500000,
    citizenshipByInvestment: 2500000,
    yearsForCitizenship: 6,
    description: "Highly selective. Global Investor Programme for ultra-wealthy.",
  },
  "France": {
    country: "France",
    region: "Europe",
    officialLanguage: "French",
    difficulty: 'moderate',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'asylum', 'permanent_residency', 'citizenship'],
    wealthBias: 0.4,
    educationBias: 0.7,
    skillBias: 0.6,
    languageRequired: true,
    minimumInvestment: 300000,
    yearsForCitizenship: 5,
    description: "Talent Passport for skilled workers. French language proficiency required.",
  },
  "Portugal": {
    country: "Portugal",
    region: "Europe",
    officialLanguage: "Portuguese",
    difficulty: 'easy',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.6,
    educationBias: 0.4,
    skillBias: 0.4,
    languageRequired: false,
    minimumInvestment: 250000,
    citizenshipByInvestment: 500000,
    yearsForCitizenship: 5,
    description: "Golden Visa program. D7 passive income visa popular with retirees.",
  },
  "Spain": {
    country: "Spain",
    region: "Europe",
    officialLanguage: "Spanish",
    difficulty: 'moderate',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.5,
    educationBias: 0.5,
    skillBias: 0.5,
    languageRequired: true,
    minimumInvestment: 500000,
    citizenshipByInvestment: 500000,
    yearsForCitizenship: 10,
    description: "Non-Lucrative Visa or Golden Visa. 10 years residency for citizenship.",
  },
  "Italy": {
    country: "Italy",
    region: "Europe",
    officialLanguage: "Italian",
    difficulty: 'moderate',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.5,
    educationBias: 0.5,
    skillBias: 0.5,
    languageRequired: true,
    minimumInvestment: 250000,
    yearsForCitizenship: 10,
    description: "Elective Residence Visa. Jure sanguinis ancestry path also available.",
  },
  "Switzerland": {
    country: "Switzerland",
    region: "Europe",
    officialLanguage: "German",
    difficulty: 'very_hard',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.7,
    educationBias: 0.6,
    skillBias: 0.7,
    languageRequired: true,
    minimumInvestment: 1000000,
    yearsForCitizenship: 12,
    description: "One of the hardest countries. 12 years residency. Very expensive.",
  },
  "Netherlands": {
    country: "Netherlands",
    region: "Europe",
    officialLanguage: "Dutch",
    difficulty: 'moderate',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.4,
    educationBias: 0.7,
    skillBias: 0.7,
    languageRequired: true,
    minimumInvestment: 1250000,
    yearsForCitizenship: 5,
    description: "Highly Skilled Migrant scheme. Dutch Civic Integration exam required.",
  },
  "Sweden": {
    country: "Sweden",
    region: "Europe",
    officialLanguage: "Swedish",
    difficulty: 'moderate',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'family', 'asylum', 'permanent_residency', 'citizenship'],
    wealthBias: 0.2,
    educationBias: 0.6,
    skillBias: 0.7,
    languageRequired: false,
    yearsForCitizenship: 5,
    description: "Work permit path. No formal language requirement but helps significantly.",
  },
  "Norway": {
    country: "Norway",
    region: "Europe",
    officialLanguage: "Norwegian",
    difficulty: 'hard',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'family', 'asylum', 'permanent_residency', 'citizenship'],
    wealthBias: 0.3,
    educationBias: 0.7,
    skillBias: 0.7,
    languageRequired: true,
    yearsForCitizenship: 7,
    description: "Skilled worker permits. Norwegian language mandatory for citizenship.",
  },
  "Denmark": {
    country: "Denmark",
    region: "Europe",
    officialLanguage: "Danish",
    difficulty: 'hard',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.3,
    educationBias: 0.8,
    skillBias: 0.8,
    languageRequired: true,
    yearsForCitizenship: 9,
    description: "Pay Limit Scheme or Fast-track. Strict integration requirements.",
  },
  "New Zealand": {
    country: "New Zealand",
    region: "Oceania",
    officialLanguage: "English",
    difficulty: 'moderate',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.5,
    educationBias: 0.7,
    skillBias: 0.8,
    languageRequired: true,
    minimumInvestment: 300000,
    yearsForCitizenship: 5,
    description: "Skilled Migrant Category. Points system favoring under-55 skilled workers.",
  },
  "South Korea": {
    country: "South Korea",
    region: "East Asia",
    officialLanguage: "Korean",
    difficulty: 'hard',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.5,
    educationBias: 0.7,
    skillBias: 0.7,
    languageRequired: true,
    minimumInvestment: 500000,
    yearsForCitizenship: 5,
    description: "F-2 Points-based visa. Korean language proficiency required for naturalization.",
  },
  "Mexico": {
    country: "Mexico",
    region: "Central America",
    officialLanguage: "Spanish",
    difficulty: 'easy',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'work', 'investment', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.5,
    educationBias: 0.3,
    skillBias: 0.3,
    languageRequired: false,
    minimumInvestment: 150000,
    yearsForCitizenship: 5,
    description: "Temporary resident visa with income proof. Relatively straightforward path.",
  },
  "Brazil": {
    country: "Brazil",
    region: "South America",
    officialLanguage: "Portuguese",
    difficulty: 'easy',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'investment', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.4,
    educationBias: 0.3,
    skillBias: 0.3,
    languageRequired: false,
    minimumInvestment: 100000,
    yearsForCitizenship: 4,
    description: "Investor visa from $100k. One of the easier paths to citizenship.",
  },
  "United Arab Emirates": {
    country: "United Arab Emirates",
    region: "Middle East",
    officialLanguage: "Arabic",
    difficulty: 'moderate',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'work', 'investment', 'permanent_residency'],
    wealthBias: 0.9,
    educationBias: 0.5,
    skillBias: 0.5,
    languageRequired: false,
    minimumInvestment: 272000,
    citizenshipByInvestment: 2700000,
    yearsForCitizenship: 30,
    description: "Golden Visa for investors/professionals. Citizenship extremely rare.",
  },
  "Thailand": {
    country: "Thailand",
    region: "Southeast Asia",
    officialLanguage: "Thai",
    difficulty: 'moderate',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'work', 'investment', 'family', 'permanent_residency'],
    wealthBias: 0.6,
    educationBias: 0.3,
    skillBias: 0.3,
    languageRequired: false,
    minimumInvestment: 250000,
    yearsForCitizenship: 12,
    description: "Thailand Elite visa for wealthy. Work permits through employers.",
  },
  "India": {
    country: "India",
    region: "South Asia",
    officialLanguage: "Hindi",
    difficulty: 'very_hard',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'family'],
    wealthBias: 0.3,
    educationBias: 0.5,
    skillBias: 0.5,
    languageRequired: false,
    yearsForCitizenship: 12,
    description: "Very limited immigration. OCI for people of Indian origin only.",
  },
  "China": {
    country: "China",
    region: "East Asia",
    officialLanguage: "Mandarin",
    difficulty: 'nearly_impossible',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work'],
    wealthBias: 0.5,
    educationBias: 0.6,
    skillBias: 0.6,
    languageRequired: true,
    yearsForCitizenship: 20,
    description: "One of the hardest countries for immigration. Green card extremely rare.",
  },
  "Russia": {
    country: "Russia",
    region: "Eastern Europe",
    officialLanguage: "Russian",
    difficulty: 'hard',
    acceptsImmigrants: true,
    availableVisas: ['tourist', 'student', 'work', 'family', 'permanent_residency', 'citizenship'],
    wealthBias: 0.4,
    educationBias: 0.5,
    skillBias: 0.5,
    languageRequired: true,
    yearsForCitizenship: 5,
    description: "Various visa programs. Russian language test required for citizenship.",
  },
  "North Korea": {
    country: "North Korea",
    region: "East Asia",
    officialLanguage: "Korean",
    difficulty: 'nearly_impossible',
    acceptsImmigrants: false,
    availableVisas: [],
    wealthBias: 0,
    educationBias: 0,
    skillBias: 0,
    languageRequired: true,
    yearsForCitizenship: 99,
    description: "Does not accept immigrants. Entry is virtually impossible for civilians.",
  },
  "Somalia": {
    country: "Somalia",
    region: "East Africa",
    officialLanguage: "Somali",
    difficulty: 'very_hard',
    acceptsImmigrants: false,
    availableVisas: ['tourist'],
    wealthBias: 0.1,
    educationBias: 0.1,
    skillBias: 0.1,
    languageRequired: false,
    yearsForCitizenship: 7,
    description: "Extremely unstable. Immigration is not practical.",
  },
};

// Generate a default immigration profile for any country
export function getImmigrationProfile(country: string): CountryImmigrationProfile {
  if (IMMIGRATION_PROFILES[country]) return IMMIGRATION_PROFILES[country];

  const passport = getPassportData(country);
  const isStable = passport.strength > 50;
  const isRich = passport.strength > 70;

  return {
    country,
    region: 'Other',
    officialLanguage: 'Local Language',
    difficulty: isRich ? 'moderate' : isStable ? 'moderate' : 'easy',
    acceptsImmigrants: true,
    availableVisas: isStable
      ? ['tourist', 'student', 'work', 'investment', 'family', 'permanent_residency', 'citizenship']
      : ['tourist', 'work', 'family', 'permanent_residency'],
    wealthBias: 0.5,
    educationBias: 0.5,
    skillBias: 0.5,
    languageRequired: false,
    minimumInvestment: isRich ? 300000 : 50000,
    yearsForCitizenship: isRich ? 7 : 5,
    description: `Standard immigration process. ${isRich ? 'Developed nation with structured visa system.' : 'Developing nation with accessible immigration.'}`
  };
}

// Visa definitions with requirements
export function getVisaOptions(targetCountry: string): VisaRequirement[] {
  const profile = getImmigrationProfile(targetCountry);

  const allVisas: Record<VisaType, VisaRequirement> = {
    tourist: {
      type: 'tourist',
      label: 'Tourist Visa',
      description: 'Short-term visit for tourism or business meetings.',
      processingTimeYears: 0,
      cost: 100,
      requirements: { minAge: 0 },
      successBaseChance: 0.9,
      grantsDuration: 1,
    },
    student: {
      type: 'student',
      label: 'Student Visa',
      description: 'Study at an accredited institution.',
      processingTimeYears: 0,
      cost: 500,
      requirements: { minAge: 16, minSmarts: 40 },
      successBaseChance: 0.75,
      grantsDuration: 4,
    },
    work: {
      type: 'work',
      label: 'Work Visa',
      description: 'Employment-based temporary residency.',
      processingTimeYears: 1,
      cost: 2000,
      requirements: { minAge: 18, minSmarts: 30, minEducation: 'High School', nocriminal: true },
      successBaseChance: 0.5,
      grantsDuration: 3,
    },
    investment: {
      type: 'investment',
      label: 'Investment / Golden Visa',
      description: `Invest in the country's economy for residency.`,
      processingTimeYears: 1,
      cost: profile.minimumInvestment || 250000,
      requirements: { minAge: 18, minMoney: profile.minimumInvestment || 250000, nocriminal: true },
      successBaseChance: 0.85,
      grantsDuration: 5,
    },
    family: {
      type: 'family',
      label: 'Family Reunification',
      description: 'Join a spouse or close family member.',
      processingTimeYears: 1,
      cost: 1000,
      requirements: { minAge: 18, hasPartner: true, partnerFromCountry: true },
      successBaseChance: 0.7,
      grantsDuration: 5,
    },
    asylum: {
      type: 'asylum',
      label: 'Asylum / Refugee',
      description: 'Seek protection from persecution.',
      processingTimeYears: 2,
      cost: 0,
      requirements: { minKarma: 20 },
      successBaseChance: 0.3,
      grantsDuration: 5,
    },
    permanent_residency: {
      type: 'permanent_residency',
      label: 'Permanent Residency',
      description: 'Long-term residency with full rights except voting.',
      processingTimeYears: 2,
      cost: 5000,
      requirements: { minAge: 18, nocriminal: true, minKarma: 30 },
      successBaseChance: 0.4,
    },
    citizenship: {
      type: 'citizenship',
      label: 'Citizenship Application',
      description: `Full citizenship after ${profile.yearsForCitizenship}+ years of residency.`,
      processingTimeYears: Math.max(1, Math.ceil(profile.yearsForCitizenship / 2)),
      cost: profile.difficulty === 'nearly_impossible' ? 50000 : profile.difficulty === 'very_hard' ? 30000 : profile.difficulty === 'hard' ? 20000 : 10000,
      requirements: { minAge: 18, nocriminal: true, minKarma: profile.difficulty === 'nearly_impossible' ? 70 : profile.difficulty === 'very_hard' ? 60 : profile.difficulty === 'hard' ? 50 : 40 },
      successBaseChance: profile.difficulty === 'nearly_impossible' ? 0.1 : profile.difficulty === 'very_hard' ? 0.2 : profile.difficulty === 'hard' ? 0.3 : 0.35,
    },
  };

  // Adjust based on country difficulty
  const difficultyModifiers: Record<string, number> = {
    'very_easy': 0.2,
    'easy': 0.1,
    'moderate': 0,
    'hard': -0.1,
    'very_hard': -0.2,
    'nearly_impossible': -0.35,
  };
  const mod = difficultyModifiers[profile.difficulty] || 0;

  return profile.availableVisas.map(type => {
    const visa = { ...allVisas[type] };
    visa.successBaseChance = Math.max(0.05, Math.min(0.95, visa.successBaseChance + mod));
    return visa;
  });
}

// Calculate immigration success chance for a player
export function calculateImmigrationChance(
  visa: VisaRequirement,
  targetCountry: string,
  player: {
    age: number;
    money: number;
    smarts: number;
    education: string;
    karma: number;
    happiness: number;
    country: string;
    partner?: { name: string } | null;
    inPrison?: boolean;
    languages: { name: string; proficiency: number }[];
  }
): { chance: number; factors: { label: string; effect: 'positive' | 'negative' | 'neutral'; detail: string }[] } {
  const profile = getImmigrationProfile(targetCountry);
  const passport = getPassportData(player.country);
  let chance = visa.successBaseChance;
  const factors: { label: string; effect: 'positive' | 'negative' | 'neutral'; detail: string }[] = [];

  // Passport strength bonus
  const passportBonus = (passport.strength - 50) / 200; // -0.175 to +0.235
  chance += passportBonus;
  if (passportBonus > 0.05) {
    factors.push({ label: 'Strong Passport', effect: 'positive', detail: `${passport.country} passport (Tier ${passport.tier})` });
  } else if (passportBonus < -0.05) {
    factors.push({ label: 'Weak Passport', effect: 'negative', detail: `${passport.country} passport (Tier ${passport.tier})` });
  }

  // Wealth factor
  if (profile.wealthBias > 0) {
    const wealthScore = Math.min(1, player.money / 500000) * profile.wealthBias * 0.15;
    chance += wealthScore;
    if (player.money > 100000) {
      factors.push({ label: 'Financial Resources', effect: 'positive', detail: `$${player.money.toLocaleString()} savings` });
    } else if (player.money < 10000) {
      factors.push({ label: 'Limited Funds', effect: 'negative', detail: 'Low savings may hurt application' });
    }
  }

  // Education factor
  const eduRanks: Record<string, number> = {
    'None': 0, 'Elementary School': 1, 'Middle School': 2, 'High School': 3,
    'Community College': 4, 'Trade School': 5, 'University': 6, 'Graduate School': 7,
    'Medical School': 8, 'Law School': 8, 'PhD Program': 9,
  };
  const eduScore = (eduRanks[player.education] || 0) / 9;
  chance += eduScore * profile.educationBias * 0.15;
  if (eduScore > 0.6) {
    factors.push({ label: 'Education', effect: 'positive', detail: player.education });
  } else if (eduScore < 0.3 && profile.educationBias > 0.5) {
    factors.push({ label: 'Education Gap', effect: 'negative', detail: 'Higher education expected' });
  }

  // Smarts/skill factor
  const smartsScore = player.smarts / 100;
  chance += smartsScore * profile.skillBias * 0.1;
  if (player.smarts > 70) {
    factors.push({ label: 'High Skills', effect: 'positive', detail: `Smarts: ${player.smarts}` });
  }

  // Karma factor
  const karmaBonus = (player.karma - 50) / 300;
  chance += karmaBonus;
  if (player.karma > 70) {
    factors.push({ label: 'Good Karma', effect: 'positive', detail: 'Clean record and good reputation' });
  } else if (player.karma < 30) {
    factors.push({ label: 'Low Karma', effect: 'negative', detail: 'Poor reputation affects application' });
  }

  // Language bonus
  const langMatch = player.languages.find(
    l => l.name.toLowerCase().includes(profile.officialLanguage.toLowerCase())
  );
  if (langMatch && langMatch.proficiency > 50) {
    chance += 0.1;
    factors.push({ label: 'Language Proficiency', effect: 'positive', detail: `${langMatch.name}: ${langMatch.proficiency}%` });
  } else if (profile.languageRequired) {
    chance -= 0.1;
    factors.push({ label: 'Language Barrier', effect: 'negative', detail: `${profile.officialLanguage} required` });
  }

  // Age factor (young adults preferred)
  if (player.age >= 25 && player.age <= 40) {
    chance += 0.05;
    factors.push({ label: 'Prime Working Age', effect: 'positive', detail: `Age ${player.age}` });
  } else if (player.age > 55) {
    chance -= 0.05;
    factors.push({ label: 'Older Applicant', effect: 'negative', detail: 'Some programs prefer younger applicants' });
  }

  // Criminal record
  if (player.inPrison) {
    chance = 0;
    factors.push({ label: 'In Prison', effect: 'negative', detail: 'Cannot apply while incarcerated' });
  }

  return {
    chance: Math.max(0.01, Math.min(0.95, chance)),
    factors,
  };
}

// Get the tier color for passport display
export function getPassportTierColor(tier: string): string {
  switch (tier) {
    case 'S': return '#10b981'; // emerald
    case 'A': return '#3b82f6'; // blue
    case 'B': return '#8b5cf6'; // purple
    case 'C': return '#f59e0b'; // amber
    case 'D': return '#f97316'; // orange
    case 'F': return '#ef4444'; // red
    default: return '#71717a'; // zinc
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'very_easy': return '#10b981';
    case 'easy': return '#34d399';
    case 'moderate': return '#f59e0b';
    case 'hard': return '#f97316';
    case 'very_hard': return '#ef4444';
    case 'nearly_impossible': return '#991b1b';
    default: return '#71717a';
  }
}

export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'very_easy': return 'Very Easy';
    case 'easy': return 'Easy';
    case 'moderate': return 'Moderate';
    case 'hard': return 'Hard';
    case 'very_hard': return 'Very Hard';
    case 'nearly_impossible': return 'Nearly Impossible';
    default: return difficulty;
  }
}
