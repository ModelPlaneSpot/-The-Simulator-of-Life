export type EducationLevel = 'None' | 'Elementary School' | 'Middle School' | 'High School' | 'Community College' | 'University' | 'Medical School' | 'Law School' | 'Business School' | 'Flight School' | 'Maritime Academy' | 'Dental School' | 'Veterinary School' | 'Pharmacy School' | 'Space Training' | 'Graduate School' | 'Counseling School' | 'Planning School' | 'Intelligence Academy' | 'Diplomatic Academy' | 'Police Academy' | 'Military Academy' | 'Military Flight School' | 'PhD Program' | 'Training Program' | 'Culinary School' | 'Certification' | 'Trade School' | 'Nursing School';

export type JobCategory = 'None' | 'Corporate' | 'Medical' | 'Military' | 'Politics' | 'Business' | 'Entertainment' | 'Law' | 'Education' | 'Technology' | 'Aviation' | 'Maritime' | 'Finance' | 'Engineering' | 'Media' | 'Science' | 'Public Service' | 'Service' | 'Health';

export interface Job {
  id: string;
  title: string;
  salary: number;
  category: JobCategory;
  requirements: {
    education?: EducationLevel;
    alternativeEducation?: EducationLevel;
    smarts?: number;
    health?: number;
    age?: number;
    money?: number;
    popularity?: number;
    previousJobId?: string;
    yearsInPreviousJob?: number;
    minCategoryExperience?: number;
    minTotalExperience?: number;
  };
}

export type AssetType = 'Property' | 'Car' | 'Boat' | 'Plane' | 'Crypto' | 'Lifestyle';

export type PropertyTier = 'Bad' | 'Middle Class' | 'Luxury';
export type PropertyType = 'House' | 'Apartment' | 'Office' | 'Mall' | 'Land' | 'Penthouse' | 'Mansion' | 'Castle' | 'Private Island';
export type PropertySize = 'Small' | 'Medium' | 'Large' | 'Mansion';

export interface PropertyUpgrade {
  id: string;
  name: string;
  valueMultiplier: number;
}

export interface SmallUpgrade {
  id: string;
  name: string;
  revenueBoost: number; // 0.02-0.04 (2-4%)
  cost: number;
  purchased: boolean;
}

export interface LargeUpgrade {
  id: string;
  name: string;
  revenueBoost: number; // 0.05-0.10 (5-10%)
  valueBoost: number; // 0.06-0.15 (6-15%)
  cost: number;
  purchased: boolean;
}

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  value: number;
  condition: number;
  isRented?: boolean;
  tenant?: { name: string; reliability: number };
  rentYield?: number;
  rentPrice?: number;
  upgradesAtMax?: number;
  propertyType?: PropertyType;
  propertyTier?: PropertyTier;
  propertySize?: PropertySize;
  upgrades?: PropertyUpgrade[];
  upgradeLevel?: number;
  maxUpgrades?: number;
  smallUpgrades?: SmallUpgrade[];
  largeUpgrades?: LargeUpgrade[];
  mortgage?: {
    principal: number;
    monthlyPayment: number;
    remainingMonths: number;
    yearsLeft?: number;
  };
  isPrimaryResidence?: boolean;
  baseValue?: number;
}

export interface Will {
  type: 'even' | 'single' | 'custom';
  recipientId?: string;
  customSplit?: Record<string, number>;
  assetDistribution?: Record<string, string>;
}

export interface LineageEntry {
  id: string;
  name: string;
  ageAtDeath: number;
  netWorth: number;
  yearDied: number;
  finalJob: string;
}

export interface BusinessUpgrade {
  id: string;
  name: string;
  costMultiplier: number;
  profitBoost: number;
  isCore: boolean;
  purchased: boolean;
}

export interface BusinessDefinition {
  id: string;
  name: string;
  category: 'Small' | 'Medium' | 'Large' | 'Ultra Rich';
  basePrice: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  uniqueUpgrades: Omit<BusinessUpgrade, 'purchased' | 'isCore'>[];
}

export interface PlayerBusiness {
  id: string;
  definitionId: string;
  name: string;
  basePrice: number;
  category: string;
  riskLevel: string;
  upgrades: BusinessUpgrade[];
  smallUpgrades?: SmallUpgrade[];
  largeUpgrades?: LargeUpgrade[];
  mortgage?: {
    principal: number;
    monthlyPayment: number;
    monthsLeft: number;
  };
  profitability: number;
  reputation: number;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  age: number;
  health: number;
  happiness: number;
  loyalty: number;
}

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  monthlyPayment: number;
  monthsLeft: number;
  type: 'Small' | 'Personal' | 'Business' | 'Loan Shark';
}

export interface PlayerVisa {
  id: string;
  type: 'tourist' | 'student' | 'work' | 'investment' | 'family' | 'asylum' | 'permanent_residency' | 'citizenship';
  country: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  appliedYear: number;
  processYearsLeft: number;
  expiresAge?: number; // player age when it expires
}

export interface PlayerPassport {
  country: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  strength: number;
  visaFreeCountries: number;
}

export interface Player {
  lineage?: LineageEntry[];
  firstName: string;
  lastName: string;
  country: string;
  passport?: PlayerPassport;
  visas?: PlayerVisa[];
  previousCountries?: string[];
  age: number;
  month?: number;
  health: number;
  smarts: number;
  happiness: number;
  looks: number;
  money: number;
  debt: number;
  loans?: Loan[];
  creditScore?: number;
  pets?: Pet[];
  stress?: number;
  inPrison?: boolean;
  prisonYearsLeft?: number;
  realEstateSkill?: number;
  realEstateXP?: number;
  education: EducationLevel;
  degrees: EducationLevel[];
  currentStudy?: {
    program: EducationLevel;
    yearsLeft: number;
  };
  job: Job | null;
  yearsInJob: number;
  jobHistory?: { title: string; years: number }[];
  isAlive: boolean;
  businesses: PlayerBusiness[];
  assets: Asset[];
  partner?: {
    type: 'dating' | 'engaged' | 'married';
    name: string;
    age: number;
    relationship: number;
    gender?: string;
  };
  kids: {
    id: string;
    name: string;
    age: number;
    relationship: number;
    gender: 'Male' | 'Female';
    assets?: Asset[];
  }[];
  parents: {
    id: string;
    name: string;
    age: number;
    relationship: number;
    gender: 'Male' | 'Female';
    isDead?: boolean;
  }[];
  coworkers?: {
    id: string;
    name: string;
    age: number;
    relationship: number;
    gender: 'Male' | 'Female';
  }[];
  grandparents: {
    id: string;
    name: string;
    age: number;
    relationship: number;
    gender: 'Male' | 'Female';
    isDead?: boolean;
  }[];
  auntsAndUncles: {
    id: string;
    name: string;
    age: number;
    relationship: number;
    gender: 'Male' | 'Female';
    isDead?: boolean;
  }[];
  cousins: {
    id: string;
    name: string;
    age: number;
    relationship: number;
    gender: 'Male' | 'Female';
    isDead?: boolean;
  }[];
  siblings: {
    id: string;
    name: string;
    age: number;
    relationship: number;
    gender: 'Male' | 'Female';
    isDead?: boolean;
  }[];
  friends: {
    id: string;
    name: string;
    age: number;
    relationship: number;
  }[];
  inGroupHome?: boolean;
  guardianName?: string;
  parentalNeglectCount?: number;
  will?: Will;
  lifestyleTier: 'frugal' | 'modest' | 'comfortable' | 'luxury';
  trait: 'Lucky' | 'Lazy' | 'Genius' | 'Aggressive' | 'Charismatic' | 'Normal';
  skills: {
    intelligence: number;
    fitness: number;
    social: number;
    creativity: number;
    driving: number;
    leadership: number;
  };
  languages: {
    id: string;
    name: string;
    proficiency: number;
    isNative: boolean;
  }[];
  currentLanguageStudy?: {
    languageId: string;
    languageName: string;
  };
  illnesses: string[];
  karma: number;
  fame: number;
  followers: number;
  performance: number;
  popularity: number;
}

export interface LogEntry {
  id: string;
  year: number;
  age: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ScenarioOption {
  text: string;
  effect: (player: Player) => Partial<Player> | void;
  message: string | ((player: Player, effectResult?: Partial<Player> | void) => string);
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  options: ScenarioOption[];
  minAge?: number;
  maxAge?: number;
  condition?: (player: Player) => boolean;
}

export interface Activity {
  id: string;
  name: string;
  cost: number;
  effect: (player: Player) => Partial<Player> | void;
  message: string | ((player: Player, result: any) => string);
  limitPerYear?: number;
  isAvailable?: (player: Player) => boolean;
}
