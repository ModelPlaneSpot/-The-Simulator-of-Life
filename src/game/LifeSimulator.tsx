import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Brain, Smile, DollarSign, Briefcase, GraduationCap, Building, Shield, Activity, ChevronRight, User, Plus, Play, Home, Car, Ship, Plane, Bitcoin, X, Check, Users, Save, LogOut, ArrowUpCircle, ShoppingBag, Lightbulb, Globe, ScrollText } from 'lucide-react';
import { toast } from 'sonner';
import Tutorial from './Tutorial';
import ImmigrationPanel from './ImmigrationPanel';
import FamilyTreeTab from './FamilyTreeTab';
import { Player, LogEntry, EducationLevel, Job, Asset, AssetType, Scenario, Will, LineageEntry, PlayerVisa } from './types';
import { getPassportData, getImmigrationProfile, getVisaOptions, calculateImmigrationChance, getPassportTierColor, getDifficultyColor, getDifficultyLabel } from './immigration';
import type { VisaType } from './immigration';
import { JOBS } from './jobs';
import { COUNTRIES, COUNTRY_DATA, EDUCATION_COSTS, EDUCATION_DURATIONS, MALE_NAMES, FEMALE_NAMES, UPGRADE_LEVELS, WEDDING_VENUES, SMALL_PROPERTY_UPGRADES, SMALL_BUSINESS_UPGRADES, LARGE_PROPERTY_UPGRADES, LARGE_BUSINESS_UPGRADES } from './constants';
import { getRandomName } from './utils/names';
import { ASSETS_FOR_SALE } from './assets';
import { SCENARIOS } from './scenarios';
import { ACTIVITIES, CRIMES } from './activities';
import { BUSINESSES } from './businesses';
import { ALL_LANGUAGES, LANGUAGE_STUDY_COST, LANGUAGE_YEARLY_GAIN, getStartingLanguages, getLanguageSalaryBonus } from './languages';
import type { BusinessDefinition, PlayerBusiness } from './types';
import type { PlayerLanguage } from './languages';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const MAX_SAFE_MONEY = 999_999_999_999;
const clampMoney = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(MAX_SAFE_MONEY, Math.floor(value))) : 0;
const clampDebt = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(MAX_SAFE_MONEY, Math.floor(value))) : 0;
const withSmallRandomness = (value: number, percent = 0.03) => Math.floor(value * (1 + (Math.random() * 2 - 1) * percent));
const getBusinessUpgradeNames = (businessName: string) => {
  const name = businessName.toLowerCase();
  const themes = [
    {
      match: ['lemonade', 'food', 'restaurant', 'café', 'cafe', 'coffee', 'bakery', 'ice cream', 'juice', 'smoothie', 'barbecue', 'hot dog', 'farm stand', 'catering', 'supermarket'],
      small: ['Better Ingredients', 'Faster Prep Station', 'Menu Add-ons', 'Local Flyer Deal', 'Loyalty Punch Cards'],
      large: ['Commercial Kitchen', 'Delivery Fleet', 'Prime Food-Court Spot', 'Signature Product Line', 'Catering Contracts', 'Second Location', 'Franchise Package'],
    },
    {
      match: ['tech', 'software', 'app', 'cybersecurity', 'data', 'cloud', 'ai', 'robotics', 'metaverse', 'internet'],
      small: ['Code Cleanup', 'Landing Page Refresh', 'Customer Support Tools', 'Bug Fix Sprint', 'Developer Training'],
      large: ['R&D Team', 'Cloud Infrastructure', 'Enterprise Sales Team', 'Patent Portfolio', 'Security Operations Center', 'Global Server Rollout', 'Platform Marketplace'],
    },
    {
      match: ['car', 'delivery', 'courier', 'taxi', 'ride', 'airline', 'shipping', 'logistics', 'railway', 'transport', 'cruise', 'jet'],
      small: ['Route Planning App', 'Vehicle Tune-ups', 'Driver Training', 'Fuel Savings Plan', 'Dispatch Tablet'],
      large: ['Fleet Expansion', 'Maintenance Depot', 'Regional Routes', 'Premium Service Tier', 'Cargo Contracts', 'Automated Dispatch Center', 'National Network'],
    },
    {
      match: ['property', 'real estate', 'construction', 'mall', 'hotel', 'resort', 'island', 'skyscraper', 'co-working', 'parking'],
      small: ['Better Signage', 'Online Booking', 'Cleaning Crew', 'Local Broker Leads', 'Guest Amenities'],
      large: ['Major Renovation', 'Premium Location', 'Corporate Leasing Team', 'Luxury Buildout', 'Regional Property Portfolio', 'Smart Building Systems', 'Flagship Development'],
    },
    {
      match: ['bank', 'finance', 'investment', 'hedge', 'insurance', 'stock', 'exchange', 'crypto'],
      small: ['Client Dashboard', 'Referral Program', 'Risk Checklist', 'Analyst Tools', 'Compliance Training'],
      large: ['Senior Analyst Team', 'Trading Platform', 'Institutional Clients', 'Risk Management Office', 'National Licensing', 'Private Client Division', 'Global Fund Launch'],
    },
    {
      match: ['film', 'studio', 'streaming', 'game', 'gaming', 'casino', 'media', 'music', 'record', 'sports', 'theme park', 'arcade', 'cinema'],
      small: ['Better Equipment', 'Fan Newsletter', 'Creator Partnerships', 'Event Nights', 'Merch Display'],
      large: ['Production Studio', 'Celebrity Partnership', 'Exclusive Content Deal', 'Premium Memberships', 'National Advertising', 'Licensing Division', 'Global Release Campaign'],
    },
    {
      match: ['shop', 'store', 'retail', 'clothing', 'fashion', 'brand', 'jewelry', 'toy', 'thrift', 'flower', 'book', 'electronics', 'pharmacy', 'vending'],
      small: ['Window Display', 'Product Bundles', 'Supplier Discount', 'Checkout Training', 'Local Ads'],
      large: ['Online Storefront', 'Warehouse System', 'Private Label Line', 'Regional Distribution', 'Mall Anchor Lease', 'Celebrity Collection', 'Flagship Store'],
    },
    {
      match: ['oil', 'energy', 'solar', 'wind', 'water', 'mining', 'refinery', 'space', 'planet'],
      small: ['Safety Training', 'Efficiency Audit', 'Monitoring Sensors', 'Specialist Crew', 'Permit Review'],
      large: ['Industrial Equipment', 'Long-term Supply Contracts', 'Exploration Program', 'Automation Control Room', 'Government Partnership', 'Regional Facility', 'Global Operations Hub'],
    },
    {
      match: ['clinic', 'dental', 'vet', 'pharma', 'biotech', 'health', 'pet', 'grooming'],
      small: ['Appointment Reminders', 'Better Supplies', 'Staff Certification', 'Client Follow-ups', 'Care Packages'],
      large: ['Specialist Team', 'Diagnostic Equipment', 'Research Lab', 'Multi-room Expansion', 'Insurance Partnerships', 'Regional Clinic Network', 'Premium Care Program'],
    },
  ];
  const theme = themes.find(t => t.match.some(keyword => name.includes(keyword))) || {
    small: ['Better Tools', 'Local Promotions', 'Staff Training', 'Customer Follow-up', 'Workflow Tune-up'],
    large: ['Professional Equipment', 'Prime Location', 'Management Team', 'Regional Expansion', 'Premium Service Line', 'Automation System', 'Corporate Partnerships'],
  };

  return theme;
};

const createBusinessSmallUpgrades = (businessName: string, basePrice: number, existing: PlayerBusiness['smallUpgrades'] = []) => {
  const names = getBusinessUpgradeNames(businessName).small;
  return SMALL_BUSINESS_UPGRADES.map((upgrade, index) => {
    const current = existing.find(u => u.id === upgrade.id);
    return {
      id: upgrade.id,
      name: names[index] || upgrade.name,
      revenueBoost: upgrade.revenueBoostPct,
      cost: current?.cost ?? Math.floor(basePrice * upgrade.costPct),
      purchased: current?.purchased ?? false,
    };
  });
};

const createBusinessLargeUpgrades = (businessName: string, basePrice: number, existing: PlayerBusiness['largeUpgrades'] = []) => {
  const names = getBusinessUpgradeNames(businessName).large;
  return LARGE_BUSINESS_UPGRADES.map((upgrade, index) => {
    const current = existing.find(u => u.id === upgrade.id);
    return {
      id: upgrade.id,
      name: names[index] || upgrade.name,
      revenueBoost: upgrade.revenueBoostPct,
      valueBoost: upgrade.valueBoostPct,
      cost: current?.cost ?? Math.floor(basePrice * upgrade.costPct),
      purchased: current?.purchased ?? false,
    };
  });
};

const normalizeBusinessUpgrades = (business: PlayerBusiness): PlayerBusiness => ({
  ...business,
  upgrades: [],
  smallUpgrades: createBusinessSmallUpgrades(business.name, business.basePrice, business.smallUpgrades),
  largeUpgrades: createBusinessLargeUpgrades(business.name, business.basePrice, business.largeUpgrades),
});

const calculateNetWorth = (p: Player) => {
  let businessValue = 0;
  if (p.businesses && p.businesses.length > 0) {
    p.businesses.forEach(b => {
      let value = b.basePrice;
      businessValue += value;
      if (b.mortgage && b.mortgage.monthsLeft > 0) {
        businessValue -= b.mortgage.principal;
      }
    });
  }
  return p.money + p.assets.reduce((sum, a) => sum + a.value, 0) + businessValue - p.debt;
};

// Tax rates by country (income tax %)
const COUNTRY_TAX_RATES: Record<string, number> = {
  "United States": 22, "United Kingdom": 20, "Canada": 20, "Australia": 24, "Germany": 30,
  "France": 30, "Japan": 23, "South Korea": 24, "Sweden": 32, "Norway": 36, "Denmark": 38,
  "Finland": 31, "Netherlands": 37, "Belgium": 40, "Austria": 35, "Switzerland": 12,
  "Ireland": 20, "Italy": 25, "Spain": 24, "Portugal": 23, "Greece": 22,
  "Poland": 17, "Czechia": 15, "Hungary": 15, "Romania": 10, "Bulgaria": 10,
  "Russia": 13, "China": 25, "India": 20, "Brazil": 27, "Mexico": 30,
  "Argentina": 35, "Chile": 25, "Colombia": 33, "Peru": 29, "South Africa": 26,
  "Nigeria": 24, "Kenya": 25, "Egypt": 22, "Turkey": 27, "Saudi Arabia": 0,
  "United Arab Emirates": 0, "Qatar": 0, "Kuwait": 0, "Bahrain": 0, "Oman": 0,
  "Singapore": 7, "Hong Kong": 15, "Malaysia": 24, "Thailand": 20, "Indonesia": 22,
  "Philippines": 25, "Vietnam": 20, "Israel": 31, "New Zealand": 28, "Iceland": 31,
  "Luxembourg": 25, "Monaco": 0, "Liechtenstein": 8, "Andorra": 10, "Malta": 25,
  "Cyprus": 20, "Estonia": 20, "Latvia": 23, "Lithuania": 20, "Slovenia": 22,
  "Slovakia": 19, "Croatia": 20, "Serbia": 10, "Montenegro": 9, "North Macedonia": 10,
  "Albania": 15, "Bosnia and Herzegovina": 10, "Moldova": 12, "Ukraine": 18, "Georgia": 20,
  "Armenia": 20, "Azerbaijan": 14, "Kazakhstan": 10, "Uzbekistan": 12,
  "Pakistan": 20, "Bangladesh": 25, "Sri Lanka": 24, "Nepal": 25, "Myanmar": 25,
  "Cambodia": 20, "Laos": 24, "Mongolia": 10, "North Korea": 0, "Cuba": 0,
  "Venezuela": 34, "Ecuador": 25, "Bolivia": 25, "Paraguay": 10, "Uruguay": 25,
  "Costa Rica": 25, "Panama": 25, "Guatemala": 25, "Honduras": 25, "El Salvador": 25,
  "Nicaragua": 30, "Dominican Republic": 25, "Jamaica": 25, "Trinidad and Tobago": 25,
  "Haiti": 30, "Barbados": 28, "Bahamas": 0, "Bermuda": 0,
  "Morocco": 31, "Tunisia": 26, "Algeria": 26, "Libya": 10, "Sudan": 15,
  "Ethiopia": 30, "Tanzania": 30, "Uganda": 30, "Ghana": 25, "Cameroon": 33,
  "Senegal": 30, "Mali": 30, "Mozambique": 32, "Madagascar": 20, "Zimbabwe": 25,
  "Zambia": 37, "Botswana": 22, "Namibia": 37, "Angola": 25,
  "Iran": 25, "Iraq": 15, "Jordan": 20, "Lebanon": 20, "Syria": 22,
  "Afghanistan": 20, "Yemen": 20, "Somalia": 0,
  "Fiji": 20, "Papua New Guinea": 30, "Samoa": 27, "Tonga": 25,
};

const getCountryTaxRate = (country: string): number => {
  return COUNTRY_TAX_RATES[country] ?? 20; // default 20% if not listed
};

// Lifestyle tier multipliers for living costs
const LIFESTYLE_MULTIPLIERS: Record<string, { multiplier: number; happinessBonus: number; label: string }> = {
  frugal: { multiplier: 0.5, happinessBonus: -5, label: 'Frugal' },
  modest: { multiplier: 1.0, happinessBonus: 0, label: 'Modest' },
  comfortable: { multiplier: 1.8, happinessBonus: 5, label: 'Comfortable' },
  luxury: { multiplier: 3.5, happinessBonus: 12, label: 'Luxury' },
};

// Calculate yearly living expenses for a player
const calculateYearlyExpenses = (player: Player) => {
  const countryData = COUNTRY_DATA[player.country] || { cost: 10000 };
  const lifestyleInfo = LIFESTYLE_MULTIPLIERS[player.lifestyleTier] || LIFESTYLE_MULTIPLIERS.modest;
  
  // Base living cost from country (food, utilities, transport)
  // If player is under 18, base living cost is 0 (parents pay)
  const isAdult = player.age >= 18;
  const baseLivingCost = isAdult ? countryData.cost * lifestyleInfo.multiplier : 0;
  
  // Housing cost — if no primary residence, pay rent
  const hasPrimaryResidence = player.assets.some(a => a.isPrimaryResidence);
  const housingCost = isAdult ? (hasPrimaryResidence ? 0 : Math.floor(baseLivingCost * 0.4)) : 0;
  
  // Food & groceries
  const foodCost = Math.floor(baseLivingCost * 0.25);
  
  // Transportation
  const transportCost = Math.floor(baseLivingCost * 0.1);
  
  // Utilities & bills
  const utilitiesCost = Math.floor(baseLivingCost * 0.08);
  
  // Healthcare
  const healthcareCost = Math.floor(baseLivingCost * 0.07);
  
  // Personal & misc
  const personalCost = Math.floor(baseLivingCost * 0.1);
  
  // Kids cost
  const kidsCost = player.kids.length * Math.floor(baseLivingCost * 0.15);
  
  // Pet costs
  const petCost = (player.pets || []).length * Math.floor(baseLivingCost * 0.03);
  
  // Asset maintenance (cars, boats, properties at ~2% of value per year)
  const assetMaintenance = player.assets.reduce((sum, a) => {
    if (a.type === 'Car') return sum + Math.floor(a.value * 0.05);
    if (a.type === 'Boat') return sum + Math.floor(a.value * 0.08);
    if (a.type === 'Plane') return sum + Math.floor(a.value * 0.10);
    if (a.type === 'Property' && !a.isRented) return sum + Math.floor(a.value * 0.02);
    return sum;
  }, 0);
  
  // Mortgage payments (already deducted elsewhere, but tracked here for breakdown)
  const mortgagePayments = player.assets.reduce((sum, a) => {
    if (a.mortgage && a.mortgage.yearsLeft > 0) return sum + a.mortgage.monthlyPayment * 12;
    return sum;
  }, 0);
  
  // Loan payments
  const loanPayments = (player.loans || []).reduce((sum, l) => {
    const payments = Math.min(12, l.monthsLeft);
    return sum + l.monthlyPayment * payments;
  }, 0);
  
  // Tax (for display; actual deduction happens in salary logic)
  const taxRate = getCountryTaxRate(player.country) / 100;
  const jobIncome = player.job ? player.job.salary : 0;
  const taxAmount = Math.floor(jobIncome * taxRate);
  
  // Property income (rented properties earn rent, non-rented owned properties generate 10% of value)
  const propertyIncome = player.assets.reduce((sum, a) => {
    if (a.type === 'Property' && a.isRented && a.rentPrice) {
      const smallBoost = (a.smallUpgrades || []).reduce((b, u) => b + (u.purchased ? u.revenueBoost : 0), 0);
      const largeBoost = (a.largeUpgrades || []).reduce((b, u) => b + (u.purchased ? u.revenueBoost : 0), 0);
      return sum + Math.floor(a.rentPrice * 12 * (1 + smallBoost + largeBoost));
    }
    if (a.type === 'Property' && !a.isRented && !a.isPrimaryResidence) {
      const smallBoost = (a.smallUpgrades || []).reduce((b, u) => b + (u.purchased ? u.revenueBoost : 0), 0);
      const largeBoost = (a.largeUpgrades || []).reduce((b, u) => b + (u.purchased ? u.revenueBoost : 0), 0);
      return sum + Math.floor(a.value * 0.10 * (1 + smallBoost + largeBoost));
    }
    return sum;
  }, 0);
  
  // Business income (10% of base price * small and large upgrade boosts)
  const businessIncome = player.businesses.reduce((sum, b) => {
    const smallBoost = (b.smallUpgrades || []).reduce((boost, u) => boost + (u.purchased ? u.revenueBoost : 0), 0);
    const largeBoost = (b.largeUpgrades || []).reduce((boost, u) => boost + (u.purchased ? u.revenueBoost : 0), 0);
    return sum + Math.floor(b.basePrice * 0.10 * (1 + smallBoost + largeBoost));
  }, 0);
  
  const grossIncome = jobIncome + propertyIncome + businessIncome;
  
  const totalLivingExpenses = clampMoney(housingCost + foodCost + transportCost + utilitiesCost + healthcareCost + personalCost + kidsCost + petCost + assetMaintenance);
  
  return {
    baseLivingCost,
    housingCost,
    foodCost,
    transportCost,
    utilitiesCost,
    healthcareCost,
    personalCost,
    kidsCost,
    petCost,
    assetMaintenance,
    mortgagePayments,
    loanPayments,
    taxAmount,
    grossIncome,
    jobIncome,
    propertyIncome,
    businessIncome,
    totalLivingExpenses,
    totalMonthly: Math.floor(totalLivingExpenses / 12),
  };
};

// Save slot type
interface SaveSlot {
  id: string;
  name: string;
  savedAt: string;
  isAutosave?: boolean;
  player: Player;
  logs: LogEntry[];
  activityCounts: Record<string, number>;
  reformsThisYear: number;
  marketMultiplier: number;
  marketCycle: 'Boom' | 'Normal' | 'Crash';
}

const getSaveSlots = (): SaveSlot[] => {
  try {
    const raw = localStorage.getItem('lifeSimSaves');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const setSaveSlots = (slots: SaveSlot[]) => {
  localStorage.setItem('lifeSimSaves', JSON.stringify(slots));
};

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [menuScreen, setMenuScreen] = useState<'menu' | 'new' | 'newChoice' | 'saves' | 'updates'>('menu');

  const GAME_UPDATES = [
    {
      number: 7,
      version: '1.7',
      title: 'Inflation System',
      date: 'April 2026',
      changes: [
        'Prices increase over time across assets and expenses',
        'Realistic economic inflation affects cost of living',
        'Asset values adjust with market conditions',
      ],
    },
    {
      number: 6,
      version: '1.6',
      title: 'Business Upgrades',
      date: 'April 2026',
      changes: [
        'Small and large upgrades available for businesses',
        'Stacking revenue increases from multiple upgrades',
        'Upgrade costs scale with business size',
      ],
    },
    {
      number: 5,
      version: '1.5',
      title: 'Net Worth UI',
      date: 'April 2026',
      changes: [
        'Total yearly income displayed under net worth',
        'Income can be positive or negative',
        'Clear breakdown of all income and expense sources',
      ],
    },
    {
      number: 4,
      version: '1.4',
      title: 'Income System',
      date: 'April 2026',
      changes: [
        'Businesses and properties generate 10% yearly revenue',
        'Income updates automatically each year',
        'Revenue shown clearly in finance tab',
      ],
    },
    {
      number: 3,
      version: '1.3',
      title: 'Update Log UI',
      date: 'April 2026',
      changes: [
        'Scrollable update log on main screen under New Life',
        'Always visible — no extra button needed',
        'Clean, chronological display of all updates',
      ],
    },
    {
      number: 2,
      version: '1.2',
      title: 'Save System',
      date: 'April 2026',
      changes: [
        'Autosave every 2 minutes',
        'Delete saves with confirmation prompt',
        'Multiple save slots supported',
      ],
    },
    {
      number: 1,
      version: '1.1',
      title: 'Inheritance System',
      date: 'April 2026',
      changes: [
        'Assign assets to specific people in inheritance menu',
        'Distribution menu for assets and money',
        'Percentage-based money inheritance',
        'Full asset transfer (businesses, properties, cars, valuables)',
        'Inherit from family members with randomness based on relationship',
        'Preview and confirmation before finalizing will',
      ],
    },
  ];

  const LATEST_UPDATE_VERSION = '1.7';

  useEffect(() => {
    localStorage.setItem('lastSeenUpdate', LATEST_UPDATE_VERSION);
  }, []);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSlotName, setSaveSlotName] = useState('');
  const [saveSlots, setSaveSlotsState] = useState<SaveSlot[]>(getSaveSlots);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [askParentsToPay, setAskParentsToPay] = useState(false);
  const [activeTab, setActiveTab] = useState<'activities' | 'education' | 'occupation' | 'assets' | 'family' | 'familytree' | 'finance' | 'lifestyle' | 'crime'>('activities');
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [activityCounts, setActivityCounts] = useState<Record<string, number>>({});
  const [reformsThisYear, setReformsThisYear] = useState(0);
  const [marketCycle, setMarketCycle] = useState<'Boom' | 'Normal' | 'Crash'>('Normal');
  const [marketMultiplier, setMarketMultiplier] = useState(1.0);
  const [showDatingApp, setShowDatingApp] = useState(false);
  const [showWillModal, setShowWillModal] = useState(false);
  const [willStep, setWillStep] = useState<'edit' | 'preview' | 'confirmed'>('edit');
  const [datingStep, setDatingStep] = useState<'preference' | 'searching' | 'match'>('preference');
  const [datingPreference, setDatingPreference] = useState<'Male' | 'Female' | 'Any'>('Any');
  const [currentMatch, setCurrentMatch] = useState<{name: string, age: number, looks: number, gender: string} | null>(null);
  const [showFamilyTree, setShowFamilyTree] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showWeddingModal, setShowWeddingModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [tenantModalAssetId, setTenantModalAssetId] = useState<string | null>(null);
  const [currentTenantOffer, setCurrentTenantOffer] = useState<{ name: string, reliability: number } | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialHighlight, setTutorialHighlight] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info', ageOverride?: number) => {
    setLogs(prev => [...prev, { 
      id: Math.random().toString(), 
      year: new Date().getFullYear() + (ageOverride ?? (player?.age || 0)), 
      age: ageOverride ?? (player?.age || 0), 
      message, 
      type 
    }]);
  };

  const getJobFitDetails = (job: Job) => {
    if (!player) return { eligible: false, reasons: ['No active life'] };
    const reasons: string[] = [];
    const req = job.requirements;
    const basicEdu = ['None', 'Elementary School', 'Middle School', 'High School', 'University'];
    const isUniversityLevel = player.degrees.some(d => ['University', 'Medical School', 'Law School', 'Business School', 'Flight School', 'Maritime Academy', 'Dental School', 'Veterinary School', 'Pharmacy School', 'Space Training', 'Graduate School', 'Counseling School', 'Planning School', 'Intelligence Academy', 'Diplomatic Academy', 'Police Academy', 'Military Academy', 'Military Flight School', 'PhD Program'].includes(d));
    const highestBasic = Math.max(...player.degrees.map(d => basicEdu.indexOf(d)), 0);
    const totalExperience = (player.jobHistory || []).reduce((sum, jh) => sum + jh.years, 0) + player.yearsInJob;
    const sameCategoryYears = (player.jobHistory || [])
      .filter(jh => JOBS.find(j => j.title === jh.title)?.category === job.category)
      .reduce((sum, jh) => sum + jh.years, 0) + (player.job?.category === job.category ? player.yearsInJob : 0);
    const checkEdu = (edu: EducationLevel) => {
      if (edu === 'University' && isUniversityLevel) return true;
      if (player.degrees.includes(edu)) return true;
      if (basicEdu.includes(edu) && highestBasic >= basicEdu.indexOf(edu)) return true;
      if (edu === 'High School' && player.age >= 18) return true;
      if (edu === 'Middle School' && player.age >= 14) return true;
      if (edu === 'Elementary School' && player.age >= 11) return true;
      return false;
    };

    if (player.age < 15) reasons.push('Age 15+');
    if (req.age && player.age < req.age) reasons.push(`Age ${req.age}+`);
    if (req.smarts && player.smarts < req.smarts) reasons.push(`Smarts ${req.smarts}+`);
    if (req.health && player.health < req.health) reasons.push(`Health ${req.health}+`);
    if (req.popularity && player.popularity < req.popularity) reasons.push(`Popularity ${req.popularity}%+`);
    if (req.education && !checkEdu(req.education) && !(req.alternativeEducation && checkEdu(req.alternativeEducation))) reasons.push(req.alternativeEducation ? `${req.education} or ${req.alternativeEducation}` : req.education);
    if (req.minCategoryExperience && sameCategoryYears < req.minCategoryExperience) reasons.push(`${req.minCategoryExperience}+ yrs in ${job.category}`);
    if (req.minTotalExperience && totalExperience < req.minTotalExperience) reasons.push(`${req.minTotalExperience}+ yrs total`);
    if (job.salary > 200000 && sameCategoryYears < 10 && !req.minCategoryExperience && !req.minTotalExperience) reasons.push(`10+ yrs in ${job.category}`);
    else if (job.salary > 100000 && sameCategoryYears < 5 && !req.minCategoryExperience && !req.minTotalExperience) reasons.push(`5+ yrs in ${job.category}`);
    else if (job.salary > 60000 && totalExperience < 2 && !req.minCategoryExperience && !req.minTotalExperience) reasons.push('2+ yrs total');
    if (req.previousJobId && (!player.job || player.job.id !== req.previousJobId || player.yearsInJob < (req.yearsInPreviousJob || 0))) reasons.push('Previous role experience');
    if (req.money && player.money < req.money) reasons.push(`$${req.money.toLocaleString()} campaign cost`);

    return { eligible: reasons.length === 0, reasons };
  };

  const getBestAvailableJob = () => {
    if (!player || player.age < 15) return null;
    return [...JOBS]
      .filter(job => player.job?.id !== job.id && getJobFitDetails(job).eligible)
      .sort((a, b) => b.salary - a.salary)[0] || null;
  };

  const randomizeCharacter = () => {
    const randomCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const { first, last } = getRandomName(randomCountry, gender);
    setFirstName(first);
    setLastName(last);
    setCountry(randomCountry);
  };

  const startGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    const traits = ['Lucky', 'Lazy', 'Genius', 'Aggressive', 'Charismatic', 'Normal'] as const;
    const randomTrait = traits[Math.floor(Math.random() * traits.length)];

    const hasBadParents = Math.random() < 0.05; // 5% chance of bad parents (reduced from 15%)
    const parentMinRel = hasBadParents ? 0 : 60;
    const parentMaxRel = hasBadParents ? 30 : 100;

    const newPlayer: Player = {
      firstName,
      lastName,
      country,
      passport: (() => {
        const p = getPassportData(country);
        return { country, tier: p.tier, strength: p.strength, visaFreeCountries: p.visaFreeCountries };
      })(),
      visas: [],
      previousCountries: [],
      age: 0,
      health: randomInt(80, 100),
      smarts: randomInt(20, 100),
      happiness: hasBadParents ? randomInt(30, 60) : randomInt(80, 100),
      looks: randomInt(20, 100),
      money: 0,
      debt: 0,
      education: 'None',
      degrees: ['None'],
      job: null,
      yearsInJob: 0,
      isAlive: true,
      businesses: [],
      assets: [],
      kids: [],
      parents: [
        { id: Math.random().toString(), name: MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)], age: randomInt(20, 45), relationship: randomInt(parentMinRel, parentMaxRel), gender: 'Male' },
        { id: Math.random().toString(), name: FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)], age: randomInt(20, 45), relationship: randomInt(parentMinRel, parentMaxRel), gender: 'Female' }
      ],
      grandparents: Array.from({ length: randomInt(1, 4) }).map(() => {
        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        return {
          id: Math.random().toString(),
          name: gender === 'Male' ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)],
          age: randomInt(45, 80),
          relationship: randomInt(50, 100),
          gender
        };
      }),
      auntsAndUncles: Array.from({ length: randomInt(0, 4) }).map(() => {
        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        return {
          id: Math.random().toString(),
          name: gender === 'Male' ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)],
          age: randomInt(20, 50),
          relationship: randomInt(30, 90),
          gender
        };
      }),
      cousins: Array.from({ length: randomInt(0, 6) }).map(() => {
        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        return {
          id: Math.random().toString(),
          name: gender === 'Male' ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)],
          age: randomInt(1, 25),
          relationship: randomInt(20, 80),
          gender
        };
      }),
      siblings: Array.from({ length: randomInt(0, 3) }).map(() => {
        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        return {
          id: Math.random().toString(),
          name: gender === 'Male' ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)],
          age: randomInt(1, 15),
          relationship: randomInt(50, 100),
          gender
        };
      }),
      friends: [],
      will: { type: 'even' },
      lifestyleTier: 'modest',
      trait: randomTrait,
      skills: {
        intelligence: 0,
        fitness: 0,
        social: 0,
        creativity: 0,
        driving: 0,
        leadership: 0
      },
      languages: getStartingLanguages(country),
      illnesses: [],
      karma: 50,
      fame: 0,
      followers: 0,
      performance: 50,
      popularity: 20
    };

    const initialMarketRoll = Math.random();
    let initialMarketCycle: 'Boom' | 'Normal' | 'Crash' = 'Normal';
    let initialMarketMultiplier = 1.0;
    
    if (initialMarketRoll < 0.15) {
      initialMarketCycle = 'Crash';
      initialMarketMultiplier = 0.8;
    } else if (initialMarketRoll < 0.3) {
      initialMarketCycle = 'Boom';
      initialMarketMultiplier = 1.3;
    }

    setMarketCycle(initialMarketCycle);
    setMarketMultiplier(initialMarketMultiplier);
    setPlayer(newPlayer);
    setLogs([{ id: Math.random().toString(), year: new Date().getFullYear(), age: 0, message: `You were born in ${country}. Your name is ${firstName} ${lastName}.`, type: 'info' }]);
    setIsPlaying(true);
    setReformsThisYear(0);
    // Always show tutorial for new characters - player can skip it
    setShowTutorial(true);
    // Migrate old single save to new system on first new game
    const oldSave = localStorage.getItem('lifeSimSave');
    if (oldSave) {
      try {
        const parsed = JSON.parse(oldSave);
        const migrated: SaveSlot = {
          id: Math.random().toString(36).slice(2),
          name: `${parsed.player.firstName} ${parsed.player.lastName}`,
          savedAt: new Date().toISOString(),
          ...parsed,
        };
        const existing = getSaveSlots();
        existing.push(migrated);
        setSaveSlots(existing);
        setSaveSlotsState(existing);
        localStorage.removeItem('lifeSimSave');
      } catch {}
    }
  };

  const completeTutorial = useCallback(() => {
    setShowTutorial(false);
    setTutorialHighlight(undefined);
    setActiveTab('activities');
  }, []);

  const handleTutorialTabChange = useCallback((tab: string) => {
    setActiveTab(tab as any);
  }, []);

  const handleTutorialHighlightChange = useCallback((area: string | undefined) => {
    setTutorialHighlight(area);
  }, []);

  // Smart suggestions based on player state
  const getSmartSuggestions = () => {
    if (!player) return [];
    const suggestions: { text: string; tab?: string; actionId?: string }[] = [];
    const bestJob = getBestAvailableJob();
    if (player.health < 40) suggestions.push({ text: '💊 Your health is low — visit a doctor!', tab: 'activities', actionId: 'doctor' });
    if (player.health < 20) suggestions.push({ text: '🚨 Health critical — go to the Emergency Room!', tab: 'activities', actionId: 'er' });
    if (player.happiness < 30) suggestions.push({ text: '😔 You seem unhappy — try hanging out with friends or going to a concert.', tab: 'activities' });
    if ((player.stress || 0) > 70) suggestions.push({ text: '🧘 Stress is very high — try meditating or therapy.', tab: 'activities' });
    if (player.smarts < 40 && player.age >= 6) suggestions.push({ text: '📚 You haven\'t studied in a while — visit the library or read a book.', tab: 'activities' });
    if (player.money < 500 && player.age >= 18) suggestions.push({ text: '⚠️ Cash is low — find income or reduce spending soon.', tab: 'occupation' });
    if (bestJob && (!player.job || bestJob.salary > player.job.salary)) suggestions.push({ text: `💼 Best job available: ${bestJob.title} at $${bestJob.salary.toLocaleString()}/yr.`, tab: 'occupation' });
    if (player.age >= 18 && !player.job) suggestions.push({ text: '💼 You don\'t have a job — check the Occupation tab.', tab: 'occupation' });
    if (player.age >= 18 && player.money < 100 && player.debt > 0) suggestions.push({ text: '💰 You\'re broke with debt — consider finding a job.', tab: 'occupation' });
    if (player.age >= 6 && player.age <= 12 && player.parents.some(p => !p.isDead && p.relationship < 50)) suggestions.push({ text: '👨‍👩‍👧 Try spending time with family — your relationship could use some love.', tab: 'family' });
    if (player.age >= 6 && player.age <= 12 && player.parents.some(p => !p.isDead)) suggestions.push({ text: '👨‍👩‍👧 Spend time with your parents while you\'re young!', tab: 'family' });
    if (player.looks < 30 && player.age >= 16) suggestions.push({ text: '💪 Hit the gym or visit a spa to boost your looks.', tab: 'activities' });
    if (player.illnesses.length > 0) suggestions.push({ text: '🤒 You have an illness — see a doctor soon!', tab: 'activities', actionId: 'doctor' });
    if (player.age >= 18 && player.education === 'High School' && !player.currentStudy) suggestions.push({ text: '🎓 Consider higher education to unlock better careers.', tab: 'education' });
    if (player.partner && player.partner.relationship < 30) suggestions.push({ text: '💔 Your relationship is struggling — spend time with your partner.', tab: 'family' });
    if ((player.karma || 50) < 20) suggestions.push({ text: '🙏 Your karma is low — attend a charity gala or do something kind.', tab: 'activities' });
    return suggestions.slice(0, 3);
  };

  // Get predicted stat effects for an activity
  const getActivityEffectPreview = (activity: typeof ACTIVITIES[0]): { label: string; color: string }[] => {
    if (!player) return [];
    const effects: { label: string; color: string }[] = [];
    
    // Map activity IDs to known effects
    const EFFECT_MAP: Record<string, { label: string; color: string }[]> = {
      walk: [{ label: '+Health', color: 'text-emerald-400' }, { label: '−Stress', color: 'text-emerald-400' }],
      meditate: [{ label: '+Happiness', color: 'text-emerald-400' }, { label: '−Stress', color: 'text-emerald-400' }],
      gym: [{ label: '+Health', color: 'text-emerald-400' }, { label: '+Looks', color: 'text-emerald-400' }, { label: '−Stress', color: 'text-emerald-400' }],
      library: [{ label: '+Smarts', color: 'text-emerald-400' }],
      read_book: [{ label: '+Smarts', color: 'text-emerald-400' }],
      online_course: [{ label: '+Smarts', color: 'text-emerald-400' }],
      hire_tutor: [{ label: '+Smarts', color: 'text-emerald-400' }],
      friends: [{ label: '+Happiness', color: 'text-emerald-400' }],
      museum: [{ label: '+Happiness', color: 'text-emerald-400' }, { label: '+Smarts', color: 'text-emerald-400' }],
      concert: [{ label: '+Happiness', color: 'text-emerald-400' }, { label: '−Stress', color: 'text-emerald-400' }],
      movie: [{ label: '+Happiness', color: 'text-emerald-400' }],
      cooking_class: [{ label: '+Happiness', color: 'text-emerald-400' }, { label: '+Smarts', color: 'text-emerald-400' }],
      doctor: [{ label: '+Health', color: 'text-emerald-400' }],
      er: [{ label: '++Health', color: 'text-emerald-400' }],
      therapy: [{ label: '+Happiness', color: 'text-emerald-400' }, { label: '−Stress', color: 'text-emerald-400' }],
      spa: [{ label: '+Happiness', color: 'text-emerald-400' }, { label: '+Looks', color: 'text-emerald-400' }, { label: '−Stress', color: 'text-emerald-400' }],
      party: [{ label: '+Happiness', color: 'text-emerald-400' }],
      golf: [{ label: '+Happiness', color: 'text-emerald-400' }, { label: '+Popularity', color: 'text-emerald-400' }],
      travel_local: [{ label: '+Happiness', color: 'text-emerald-400' }, { label: '−Stress', color: 'text-emerald-400' }],
      travel_international: [{ label: '++Happiness', color: 'text-emerald-400' }, { label: '+Smarts', color: 'text-emerald-400' }],
      travel_luxury: [{ label: '+++Happiness', color: 'text-emerald-400' }, { label: '+Fame', color: 'text-emerald-400' }],
      vacation: [{ label: '+Happiness', color: 'text-emerald-400' }],
      charity_gala: [{ label: '+Karma', color: 'text-emerald-400' }, { label: '+Popularity', color: 'text-emerald-400' }],
      yacht_party: [{ label: '+Happiness', color: 'text-emerald-400' }, { label: '+Popularity', color: 'text-emerald-400' }],
      casino: [{ label: '±Money', color: 'text-amber-400' }, { label: '±Happiness', color: 'text-amber-400' }],
      street_racing: [{ label: '±Money', color: 'text-amber-400' }, { label: '−Health Risk', color: 'text-rose-400' }],
      plastic_surgery: [{ label: '+Looks', color: 'text-emerald-400' }, { label: '−Health Risk', color: 'text-rose-400' }],
      report_parents: [{ label: '−Happiness', color: 'text-rose-400' }, { label: '+Stress', color: 'text-rose-400' }],
    };
    
    return EFFECT_MAP[activity.id] || effects;
  };

  // Get predicted stat effects for a crime
  const getCrimeEffectPreview = (activity: typeof CRIMES[0]): { label: string; color: string }[] => {
    const CRIME_EFFECT_MAP: Record<string, { label: string; color: string }[]> = {
      shoplift: [{ label: '+Money', color: 'text-emerald-400' }, { label: '−Karma', color: 'text-rose-400' }, { label: '⚠ Prison Risk', color: 'text-rose-400' }],
      pickpocket: [{ label: '+Money', color: 'text-emerald-400' }, { label: '−Karma', color: 'text-rose-400' }, { label: '⚠ Prison Risk', color: 'text-rose-400' }],
      rob_house: [{ label: '++Money', color: 'text-emerald-400' }, { label: '−−Karma', color: 'text-rose-400' }, { label: '⚠ Prison 3yr', color: 'text-rose-400' }],
      bank_robbery: [{ label: '+++Money', color: 'text-emerald-400' }, { label: '−−Karma', color: 'text-rose-400' }, { label: '⚠ Prison 15yr', color: 'text-rose-400' }],
      scam_online: [{ label: '+Money', color: 'text-emerald-400' }, { label: '−Karma', color: 'text-rose-400' }, { label: '⚠ Prison Risk', color: 'text-rose-400' }],
      car_theft: [{ label: '++Money', color: 'text-emerald-400' }, { label: '−Karma', color: 'text-rose-400' }, { label: '⚠ Prison 4yr', color: 'text-rose-400' }],
      blackmail: [{ label: '+Money', color: 'text-emerald-400' }, { label: '−Karma', color: 'text-rose-400' }, { label: '−Health Risk', color: 'text-rose-400' }],
      drug_dealing: [{ label: '++Money', color: 'text-emerald-400' }, { label: '−Karma', color: 'text-rose-400' }, { label: '⚠ Prison 5yr', color: 'text-rose-400' }],
      hacking: [{ label: '+++Money', color: 'text-emerald-400' }, { label: '−Karma', color: 'text-rose-400' }, { label: '⚠ Prison 5yr', color: 'text-rose-400' }],
      identity_theft: [{ label: '++Money', color: 'text-emerald-400' }, { label: '−Karma', color: 'text-rose-400' }, { label: '⚠ Prison 4yr', color: 'text-rose-400' }],
      fraud_scheme: [{ label: '+++Money', color: 'text-emerald-400' }, { label: '−−Karma', color: 'text-rose-400' }, { label: '⚠ Prison 8yr', color: 'text-rose-400' }],
      smuggling: [{ label: '++Money', color: 'text-emerald-400' }, { label: '−Karma', color: 'text-rose-400' }, { label: '⚠ Prison 6yr', color: 'text-rose-400' }],
      illegal_gambling: [{ label: '±Money', color: 'text-amber-400' }, { label: '±Happiness', color: 'text-amber-400' }],
      insider_trading: [{ label: '+++Money', color: 'text-emerald-400' }, { label: '−−Karma', color: 'text-rose-400' }, { label: '⚠ Prison 5yr', color: 'text-rose-400' }],
      pirating_software: [{ label: '+Money', color: 'text-emerald-400' }, { label: '−Karma', color: 'text-rose-400' }],
      vandalism: [{ label: '+Happiness', color: 'text-emerald-400' }, { label: '−Karma', color: 'text-rose-400' }, { label: '⚠ Prison Risk', color: 'text-rose-400' }],
    };
    return CRIME_EFFECT_MAP[activity.id] || [];
  };

  const saveGameToSlot = (slotName: string, existingSlotId?: string, isAutosave = false) => {
    if (!player) return;
    const slot: SaveSlot = {
      id: existingSlotId || Math.random().toString(36).slice(2),
      name: slotName,
      savedAt: new Date().toISOString(),
      isAutosave,
      player,
      logs,
      activityCounts,
      reformsThisYear,
      marketMultiplier,
      marketCycle,
    };
    const slots = getSaveSlots();
    const existingIdx = slots.findIndex(s => s.id === slot.id);
    if (existingIdx >= 0) {
      slots[existingIdx] = slot;
    } else {
      slots.push(slot);
    }
    setSaveSlots(slots);
    setSaveSlotsState(slots);
    if (!isAutosave) addLog(`Game saved as "${slotName}".`, 'success');
  };

  const loadSaveSlot = (slot: SaveSlot) => {
    let loadedPlayer = slot.player;
    if (loadedPlayer && loadedPlayer.degrees) {
      loadedPlayer.degrees = loadedPlayer.degrees.filter((d: any) => d);
      if (loadedPlayer.age >= 18 && !loadedPlayer.degrees.includes('High School')) {
        loadedPlayer.degrees.push('High School');
      }
      if (!loadedPlayer.education && loadedPlayer.degrees.length > 0) {
        loadedPlayer.education = loadedPlayer.degrees[loadedPlayer.degrees.length - 1];
      }
    }
    if (loadedPlayer && loadedPlayer.businesses) {
      loadedPlayer = {
        ...loadedPlayer,
        businesses: loadedPlayer.businesses.map(normalizeBusinessUpgrades),
      };
    }
    setPlayer(loadedPlayer);
    setLogs(slot.logs || []);
    setActivityCounts(slot.activityCounts || {});
    setReformsThisYear(slot.reformsThisYear || 0);
    setMarketMultiplier(slot.marketMultiplier || 1);
    setMarketCycle(slot.marketCycle || 'Normal');
    setShowTutorial(false);
    setIsPlaying(true);
  };

  const deleteSaveSlot = (slotId: string) => {
    const slots = getSaveSlots().filter(s => s.id !== slotId);
    setSaveSlots(slots);
    setSaveSlotsState(slots);
    setDeleteConfirmId(null);
  };

  // Autosave every 2 minutes
  useEffect(() => {
    if (isPlaying && player) {
      autosaveTimerRef.current = setInterval(() => {
        const autosaveSlotName = `Autosave - ${player.firstName} ${player.lastName}`;
        const slots = getSaveSlots();
        const existingAutosave = slots.find(s => s.isAutosave && s.name === autosaveSlotName);
        saveGameToSlot(autosaveSlotName, existingAutosave?.id, true);
      }, 2 * 60 * 1000);
    }
    return () => {
      if (autosaveTimerRef.current) clearInterval(autosaveTimerRef.current);
    };
  }, [isPlaying, player]);

  const [showExitPrompt, setShowExitPrompt] = useState(false);

  const exitGame = () => {
    setShowExitPrompt(true);
  };

  const confirmExit = (save: boolean) => {
    if (save) {
      setShowSaveModal(true);
      setShowExitPrompt(false);
      return;
    }
    setIsPlaying(false);
    setPlayer(null);
    setLogs([]);
    setShowExitPrompt(false);
    setMenuScreen('menu');
  };

  const progressYear = () => {
    if (!player || !player.isAlive) return;

    const currentAge = player.age + 1;

    let newHealth = player.health;
    let newSmarts = player.smarts;
    let newHappiness = player.happiness;
    let newLooks = player.looks;
    let newMoney = player.money;
    let newDebt = player.debt;
    let newLoans = [...(player.loans || [])];
    let newCreditScore = player.creditScore ?? 600;
    let newPets = [...(player.pets || [])];
    let newEducation = player.education;
    let newDegrees = [...(player.degrees || [])];
    let newCurrentStudy = player.currentStudy ? { ...player.currentStudy } : undefined;
    let newYearsInJob = player.yearsInJob;
    let newJob = player.job;
    let isAlive = true;
    let newPartner = player.partner ? { ...player.partner } : undefined;
    let newKids = [...(player.kids || [])];
    let newParents = [...(player.parents || [])];
    let newSiblings = [...(player.siblings || [])];
    let newGrandparents = [...(player.grandparents || [])];
    let newAuntsAndUncles = [...(player.auntsAndUncles || [])];
    let newCousins = [...(player.cousins || [])];
    let newBusinesses = player.businesses ? player.businesses.map(b => ({
      ...b,
      upgrades: [],
      mortgage: b.mortgage ? { ...b.mortgage } : undefined
    })) : [];
    let newAssets = [...(player.assets || [])];
    let newFriends = [...(player.friends || [])];
    let newCoworkers = [...(player.coworkers || [])];
    let newSkills = { ...player.skills };
    let newIllnesses = [...player.illnesses];
    let newKarma = player.karma;
    let newFame = player.fame;
    let newFollowers = player.followers;
    let newPerformance = player.performance;
    let newPopularity = player.popularity;
    let newInPrison = player.inPrison || false;
    let newPrisonYearsLeft = player.prisonYearsLeft || 0;
    let newStress = player.stress || 0;
    let newRealEstateSkill = player.realEstateSkill || 0;
    let newRealEstateXP = player.realEstateXP || 0;
    let newLanguages = (player.languages || []).map(l => ({ ...l }));
    let newCurrentLanguageStudy = player.currentLanguageStudy ? { ...player.currentLanguageStudy } : undefined;
    let newVisas = (player.visas || []).map(v => ({ ...v }));

    // Process pending visas
    newVisas = newVisas.map(v => {
      if (v.status === 'pending') {
        const remaining = v.processYearsLeft - 1;
        if (remaining <= 0) {
          const visaOpts = getVisaOptions(v.country);
          const visaDef = visaOpts.find(vo => vo.type === v.type);
          const { chance } = visaDef ? calculateImmigrationChance(visaDef, v.country, player) : { chance: 0.5 };
          if (Math.random() < chance) {
            addLog(`🎉 Your ${v.type.replace('_', ' ')} visa for ${v.country} has been approved!`, 'success');
            return { ...v, status: 'approved' as const, processYearsLeft: 0, expiresAge: visaDef?.grantsDuration ? currentAge + visaDef.grantsDuration : undefined };
          } else {
            addLog(`❌ Your ${v.type.replace('_', ' ')} visa for ${v.country} was denied after processing.`, 'error');
            return { ...v, status: 'denied' as const, processYearsLeft: 0 };
          }
        }
        return { ...v, processYearsLeft: remaining };
      }
      // Expire approved visas
      if (v.status === 'approved' && v.expiresAge && currentAge >= v.expiresAge) {
        addLog(`Your ${v.type.replace('_', ' ')} visa for ${v.country} has expired.`, 'warning');
        return { ...v, status: 'expired' as const };
      }
      return v;
    });
    // Remove denied/expired visas after notification
    newVisas = newVisas.filter(v => v.status !== 'denied' && v.status !== 'expired');

    // Process language study
    if (newCurrentLanguageStudy) {
      const langDef = ALL_LANGUAGES.find(l => l.id === newCurrentLanguageStudy!.languageId);
      if (langDef) {
        const gain = LANGUAGE_YEARLY_GAIN[langDef.difficulty] + Math.floor(newSmarts / 20);
        const existing = newLanguages.find(l => l.id === newCurrentLanguageStudy!.languageId);
        if (existing) {
          existing.proficiency = Math.min(100, existing.proficiency + gain);
          if (existing.proficiency >= 100) {
            addLog(`You've mastered ${existing.name}! 🎓`, 'success', currentAge);
            newCurrentLanguageStudy = undefined;
          } else {
            addLog(`Your ${existing.name} improved to ${existing.proficiency}%.`, 'info', currentAge);
          }
        }
      }
    }

    // Yearly changes — salary with taxes
    if (newJob) {
      const langBonus = getLanguageSalaryBonus(newLanguages);
      const grossSalary = withSmallRandomness(Math.floor(newJob.salary * langBonus), 0.03);
      const taxRate = getCountryTaxRate(player.country) / 100;
      const taxPaid = Math.floor(grossSalary * taxRate);
      const netSalary = grossSalary - taxPaid;
      newMoney += netSalary;
      if (taxPaid > 0) {
        addLog(`💰 Paycheck landed: $${grossSalary.toLocaleString()} gross, $${taxPaid.toLocaleString()} tax in ${player.country}, $${netSalary.toLocaleString()} take-home.`, 'info', currentAge);
      }
       newStress += randomInt(0, 10);
    }

    // Living expenses — deducted yearly (only for age 18+)
    if (currentAge >= 18) {
      const tempPlayer = { ...player, age: currentAge, money: newMoney, job: newJob, assets: newAssets, kids: newKids, pets: newPets, loans: newLoans };
      const expenses = calculateYearlyExpenses(tempPlayer);
      const yearlyExpenses = withSmallRandomness(expenses.totalLivingExpenses, 0.04);
      const monthlyExpenses = Math.floor(yearlyExpenses / 12);
      const lifestyleInfo = LIFESTYLE_MULTIPLIERS[player.lifestyleTier];
      
      newMoney -= yearlyExpenses;
      newHappiness += lifestyleInfo.happinessBonus;
      
      if (newMoney < 0) {
        const shortfall = Math.abs(newMoney);
        newDebt += shortfall;
        newMoney = 0;
        addLog(`💸 You couldn't cover living expenses. $${shortfall.toLocaleString()} was added to debt.`, 'error', currentAge);
        toast.error(`Living expense shortfall: $${shortfall.toLocaleString()} added to debt`);
        newStress += randomInt(5, 15);
      }
      
      addLog(`🏠 Living expenses came to $${yearlyExpenses.toLocaleString()}/yr ($${monthlyExpenses.toLocaleString()}/mo) for a ${lifestyleInfo.label} lifestyle in ${player.country}.`, 'info', currentAge);
    }

    let missedPayments = false;
    newLoans = newLoans.map(loan => {
      if (loan.monthsLeft > 0) {
        const paymentsThisYear = Math.min(12, loan.monthsLeft);
        const yearlyPayment = loan.monthlyPayment * paymentsThisYear;
        
        if (newMoney >= yearlyPayment) {
          newMoney -= yearlyPayment;
          loan.monthsLeft -= paymentsThisYear;
          loan.amount -= (yearlyPayment * 0.7); // Approximate principal reduction
        } else {
          // Missed payment
          missedPayments = true;
          const penalty = loan.amount * (loan.interestRate / 100);
          loan.amount += penalty; // Add penalty to principal
          newDebt += penalty;
          addLog(`You missed payments on your ${loan.type} loan! Penalty added.`, 'error', currentAge);
        }
      }
      return loan;
    }).filter(loan => loan.monthsLeft > 0);
    
    // Update total debt from loans
    newDebt = newLoans.reduce((sum, loan) => sum + loan.amount, 0) + (player.debt - (player.loans?.reduce((sum, l) => sum + l.amount, 0) || 0));

    if (newDebt > 0) {
      const yearlyInterest = Math.floor(newDebt * 0.05);
      newDebt += yearlyInterest;
      newStress += randomInt(0, 12);
    }

    if (missedPayments) {
      newCreditScore = Math.max(300, newCreditScore - randomInt(20, 50));
    } else if (newLoans.length > 0) {
      newCreditScore = Math.min(850, newCreditScore + randomInt(5, 15));
    }

    // Process Pets
    newPets = newPets.map(pet => {
      let updatedPet = { ...pet, age: pet.age + 1 };
      updatedPet.health = Math.max(0, updatedPet.health - randomInt(0, 10));
      updatedPet.happiness = Math.max(0, updatedPet.happiness - randomInt(5, 15));
      
      if (updatedPet.health < 30) {
        addLog(`Your pet ${pet.name} is sick.`, 'warning', currentAge);
      }
      
      if (updatedPet.happiness < 20 && Math.random() < 0.1) {
        addLog(`Your pet ${pet.name} ran away because it was unhappy!`, 'error', currentAge);
        updatedPet.health = 0; // Mark as gone
      }
      
      return updatedPet;
    }).filter(pet => {
      if (pet.health <= 0) {
        addLog(`Your pet ${pet.name} has passed away.`, 'error', currentAge);
        newHappiness -= 20;
        return false;
      }
      return true;
    });

    // Asset yearly logic (mortgage, rent, appreciation)
    newAssets = newAssets.map(asset => {
      let updatedAsset = { ...asset };
      if (updatedAsset.mortgage && updatedAsset.mortgage.yearsLeft > 0) {
        newMoney -= updatedAsset.mortgage.monthlyPayment * 12;
        updatedAsset.mortgage.principal -= updatedAsset.mortgage.monthlyPayment * 6; // Simplified principal reduction
        updatedAsset.mortgage.yearsLeft -= 1;
        if (newMoney < 0) {
          newDebt += Math.abs(newMoney);
          newMoney = 0;
        }
      }
      if (updatedAsset.tenant) {
        let rentMultiplier = 12;
        const tenantRoll = Math.random() * 100;
        if (tenantRoll > updatedAsset.tenant.reliability) {
          // Bad tenant event
          if (Math.random() < 0.2) {
            updatedAsset.condition = Math.max(0, updatedAsset.condition - randomInt(10, 30));
            addLog(`Your tenant trashed ${updatedAsset.name}! Condition dropped.`, 'warning', currentAge);
          } else {
            rentMultiplier = 11;
            addLog(`Your tenant in ${updatedAsset.name} was late on rent this year.`, 'warning', currentAge);
          }
        } else if (updatedAsset.tenant.reliability > 80 && Math.random() < 0.1) {
          updatedAsset.condition = Math.min(100, updatedAsset.condition + randomInt(1, 5));
          addLog(`Your great tenant took good care of ${updatedAsset.name}.`, 'success', currentAge);
        }
        const smallBoostProp = (updatedAsset.smallUpgrades || []).reduce((s, u) => s + (u.purchased ? u.revenueBoost : 0), 0);
        const largeBoostProp = (updatedAsset.largeUpgrades || []).reduce((s, u) => s + (u.purchased ? u.revenueBoost : 0), 0);
        const rentEarned = Math.floor((updatedAsset.rentPrice || 0) * rentMultiplier * (1 + smallBoostProp + largeBoostProp));
        newMoney += rentEarned;
        if (rentEarned > 0) addLog(`🏠 ${updatedAsset.name} rental income: $${rentEarned.toLocaleString()}`, 'success', currentAge);
      } else if (updatedAsset.type === 'Property' && !updatedAsset.isPrimaryResidence) {
        // Non-rented investment properties generate 10% yearly revenue
        const smallBoostProp = (updatedAsset.smallUpgrades || []).reduce((s, u) => s + (u.purchased ? u.revenueBoost : 0), 0);
        const largeBoostProp = (updatedAsset.largeUpgrades || []).reduce((s, u) => s + (u.purchased ? u.revenueBoost : 0), 0);
        const propIncome = Math.floor(updatedAsset.value * 0.10 * (1 + smallBoostProp + largeBoostProp));
        newMoney += propIncome;
        if (propIncome > 0) addLog(`🏠 ${updatedAsset.name} generated $${propIncome.toLocaleString()} in revenue.`, 'success', currentAge);
      }
      
      const appreciation = (randomInt(-2, 8) / 100);
      updatedAsset.value = Math.floor(updatedAsset.value * (1 + appreciation));
      updatedAsset.condition = Math.max(0, updatedAsset.condition - randomInt(1, 5));
      
      return updatedAsset;
    });

    // Business yearly logic
    if (newBusinesses.length > 0) {
      const marketRoll = Math.random();
      let currentMarketCycle: 'Boom' | 'Normal' | 'Crash' = 'Normal';
      let currentMarketMultiplier = 1.0;
      
      if (marketRoll < 0.15) {
        currentMarketCycle = 'Crash';
        currentMarketMultiplier = 0.8;
        addLog('The economy has crashed! Business revenue is down.', 'warning', currentAge);
      } else if (marketRoll < 0.3) {
        currentMarketCycle = 'Boom';
        currentMarketMultiplier = 1.3;
        addLog('The economy is booming! Business revenue is up.', 'success', currentAge);
      }
      setMarketCycle(currentMarketCycle);
      setMarketMultiplier(currentMarketMultiplier);

      newBusinesses.forEach(business => {
        const yearlyRevenue = Math.floor(business.basePrice * 0.10);
        const smallBoost = (business.smallUpgrades || []).reduce((s, u) => s + (u.purchased ? u.revenueBoost : 0), 0);
        const largeBoost = (business.largeUpgrades || []).reduce((s, u) => s + (u.purchased ? u.revenueBoost : 0), 0);
        
        const yearlyProfit = Math.floor(yearlyRevenue * (1 + smallBoost + largeBoost) * currentMarketMultiplier);
        newMoney += yearlyProfit;
        addLog(`💼 ${business.name} earned $${yearlyProfit.toLocaleString()} in profit this year.`, yearlyProfit > 0 ? 'success' : 'warning', currentAge);

        if (business.mortgage && business.mortgage.monthsLeft > 0) {
          const paymentsThisYear = Math.min(12, business.mortgage.monthsLeft);
          newMoney -= business.mortgage.monthlyPayment * paymentsThisYear;
          business.mortgage.monthsLeft -= paymentsThisYear;
          business.mortgage.principal -= business.mortgage.monthlyPayment * 0.5 * paymentsThisYear;
          
          if (newMoney < 0) {
            addLog(`You missed payments on ${business.name} and it was repossessed!`, 'error', currentAge);
            business.mortgage.monthsLeft = -1; // mark for removal
          }
        }

        const eventRoll = Math.random();
        if (eventRoll < 0.05) {
          addLog(`${business.name} went viral! Profit boost this year.`, 'success', currentAge);
          newMoney += Math.floor(business.basePrice * 0.05);
        } else if (eventRoll > 0.95) {
          addLog(`${business.name} had unexpected expenses.`, 'error', currentAge);
          newMoney -= Math.floor(business.basePrice * 0.02);
        }
      });
    }

    // Remove repossessed businesses
    newBusinesses = newBusinesses.filter(b => !(b.mortgage && b.mortgage.monthsLeft === -1));

    setActivityCounts({});
    setReformsThisYear(0);

    newHealth += randomInt(-5, 2);
    newSmarts += randomInt(-2, 2);
    newHappiness += randomInt(-10, 5);
    newLooks += randomInt(-2, 2);

    // Stress logic yearly — gradual buildup, reduced frequency
    // Natural stress decay (relaxation)
    newStress = Math.max(0, newStress - randomInt(5, 15));
    // Stress sources (reduced amounts, build gradually)
    if (newJob) newStress += randomInt(2, 8);
    if (newDebt > 0) newStress += randomInt(2, 5);
    if (newKids.length > 0) newStress += randomInt(1, 4);
    if (newBusinesses.length > 0) newStress += randomInt(2 * newBusinesses.length, 5 * newBusinesses.length);
    
    // Only warn at very high stress
    if (newStress > 85) {
      newHealth -= randomInt(5, 12);
      newHappiness -= randomInt(5, 12);
      addLog('⚠️ Extreme stress is taking a toll on your health and happiness!', 'warning', currentAge);
    } else if (newStress > 65) {
      newHealth -= randomInt(2, 5);
      newHappiness -= randomInt(2, 5);
    }

    // Prison logic
      if (newInPrison) {
        newPrisonYearsLeft -= 1;
        newHappiness -= randomInt(10, 20);
        newLooks -= randomInt(2, 5);
        newHealth -= randomInt(2, 8);
        newStress += randomInt(10, 20);
        if (newPrisonYearsLeft <= 0) {
          newInPrison = false;
          const releaseMsgs = ['You squinted at the sun — freedom at last.', 'The gates opened and you took your first free breath.', 'You walked out with nothing but the clothes on your back.'];
          addLog(`${releaseMsgs[Math.floor(Math.random() * releaseMsgs.length)]} You have been released from prison.`, 'info', currentAge);
        } else {
          const prisonFlavor = ['You stared at the ceiling counting cracks.', 'You made a friend in the yard.', 'The food was somehow worse than last year.', 'You started reading to pass the time.'];
          addLog(`${prisonFlavor[Math.floor(Math.random() * prisonFlavor.length)]} ${newPrisonYearsLeft} years left in prison.`, 'warning', currentAge);
        }
      }

      // Family aging
      if (newPartner) newPartner.age += 1;
      newKids = newKids.map(k => ({ ...k, age: k.age + 1 }));
      newParents = newParents.map(p => ({ ...p, age: p.age + 1 }));
      newSiblings = newSiblings.map(s => ({ ...s, age: s.age + 1 }));
      newGrandparents = newGrandparents.map(gp => ({ ...gp, age: gp.age + 1 }));
      newAuntsAndUncles = newAuntsAndUncles.map(au => ({ ...au, age: au.age + 1 }));
      newCousins = newCousins.map(c => ({ ...c, age: c.age + 1 }));
      newFriends = newFriends.map(f => ({ ...f, age: f.age + 1 }));
      newCoworkers = newCoworkers.map(c => ({ ...c, age: c.age + 1 }));

      // === FAMILY MEMBER DEATH & INHERITANCE ===
      const familyDeathChance = (age: number, isDead?: boolean) => {
        if (isDead) return 0;
        if (age > 90) return 0.25;
        if (age > 80) return 0.12;
        if (age > 70) return 0.06;
        if (age > 60) return 0.02;
        if (age > 40) return 0.005;
        return 0.001;
      };

      const calcFamilyInheritance = (relationship: number, memberAge: number): { money: number; assets: typeof player.assets } => {
        // Higher relationship = more likely to inherit, more money
        const baseChance = Math.min(0.9, relationship / 120);
        if (Math.random() > baseChance) return { money: 0, assets: [] };
        // Older family = more wealth accumulated
        const wealthFactor = Math.max(1, memberAge / 30);
        const baseAmount = randomInt(500, 15000) * wealthFactor;
        const relationshipBonus = (relationship / 100);
        const money = Math.floor(baseAmount * relationshipBonus);
        
        // Random chance to inherit assets based on relationship & wealth
        const inheritedAssets: typeof player.assets = [];
        const assetChance = Math.min(0.6, relationship / 150);
        if (Math.random() < assetChance) {
          // Generate a random asset they "owned"
          const possibleAssets = [
            { type: 'Car' as const, names: ['Old Sedan', 'Family Car', 'Classic Car', 'Vintage Truck'], values: [3000, 8000, 15000, 5000] },
            { type: 'Property' as const, names: ['Old Family Home', 'Small Apartment', 'Country Cottage', 'Condo'], values: [80000, 60000, 120000, 150000] },
            { type: 'Lifestyle' as const, names: ['Antique Furniture', 'Jewelry Collection', 'Art Piece', 'Watch Collection'], values: [2000, 5000, 8000, 12000] },
          ];
          const wealthTier = memberAge > 60 ? 2 : memberAge > 40 ? 1 : 0;
          const numAssets = Math.min(1 + Math.floor(Math.random() * (wealthTier + 1)), 2);
          for (let i = 0; i < numAssets; i++) {
            const category = possibleAssets[Math.floor(Math.random() * possibleAssets.length)];
            const idx = Math.floor(Math.random() * category.names.length);
            const valueMultiplier = 0.5 + Math.random() * wealthFactor * 0.5;
            inheritedAssets.push({
              id: Math.random().toString(36).substr(2, 9),
              type: category.type,
              name: category.names[idx],
              value: Math.floor(category.values[idx] * valueMultiplier),
              condition: randomInt(40, 90),
            });
          }
        }
        return { money, assets: inheritedAssets };
      };

      // Parents dying
      newParents = newParents.map(p => {
        if (p.isDead) return p;
        if (Math.random() < familyDeathChance(p.age)) {
          const inheritance = calcFamilyInheritance(p.relationship, p.age);
          const assetMsg = inheritance.assets.length > 0 ? ` and ${inheritance.assets.map(a => a.name).join(', ')}` : '';
          addLog(`💀 Your ${p.gender === 'Male' ? 'father' : 'mother'} ${p.name} passed away at age ${p.age}.${inheritance.money > 0 || inheritance.assets.length > 0 ? ` You inherited $${inheritance.money.toLocaleString()}${assetMsg}.` : ''}`, 'error', currentAge);
          newMoney += inheritance.money;
          newAssets = [...newAssets, ...inheritance.assets];
          newHappiness = Math.max(0, newHappiness - randomInt(15, 35));
          newStress += randomInt(10, 25);
          return { ...p, isDead: true };
        }
        return p;
      });

      // Grandparents dying
      newGrandparents = newGrandparents.map(gp => {
        if (gp.isDead) return gp;
        if (Math.random() < familyDeathChance(gp.age)) {
          const inheritance = calcFamilyInheritance(gp.relationship, gp.age);
          const assetMsg = inheritance.assets.length > 0 ? ` and ${inheritance.assets.map(a => a.name).join(', ')}` : '';
          addLog(`💀 Your ${gp.gender === 'Male' ? 'grandfather' : 'grandmother'} ${gp.name} passed away at age ${gp.age}.${inheritance.money > 0 || inheritance.assets.length > 0 ? ` You inherited $${inheritance.money.toLocaleString()}${assetMsg}.` : ''}`, 'error', currentAge);
          newMoney += inheritance.money;
          newAssets = [...newAssets, ...inheritance.assets];
          newHappiness = Math.max(0, newHappiness - randomInt(8, 20));
          return { ...gp, isDead: true };
        }
        return gp;
      });

      // Siblings dying (rare unless old)
      newSiblings = newSiblings.map(s => {
        if (s.isDead) return s;
        if (Math.random() < familyDeathChance(s.age)) {
          const inheritance = calcFamilyInheritance(s.relationship, s.age);
          const assetMsg = inheritance.assets.length > 0 ? ` and ${inheritance.assets.map(a => a.name).join(', ')}` : '';
          addLog(`💀 Your ${s.gender === 'Male' ? 'brother' : 'sister'} ${s.name} passed away at age ${s.age}.${inheritance.money > 0 || inheritance.assets.length > 0 ? ` You inherited $${inheritance.money.toLocaleString()}${assetMsg}.` : ''}`, 'error', currentAge);
          newMoney += inheritance.money;
          newAssets = [...newAssets, ...inheritance.assets];
          newHappiness = Math.max(0, newHappiness - randomInt(10, 30));
          return { ...s, isDead: true };
        }
        return s;
      });

      // Aunts/Uncles dying
      newAuntsAndUncles = newAuntsAndUncles.map(au => {
        if (au.isDead) return au;
        if (Math.random() < familyDeathChance(au.age)) {
          const inheritance = calcFamilyInheritance(au.relationship, au.age);
          const assetMsg = inheritance.assets.length > 0 ? ` and ${inheritance.assets.map(a => a.name).join(', ')}` : '';
          addLog(`💀 Your ${au.gender === 'Male' ? 'uncle' : 'aunt'} ${au.name} passed away at age ${au.age}.${inheritance.money > 0 || inheritance.assets.length > 0 ? ` You inherited $${inheritance.money.toLocaleString()}${assetMsg}.` : ''}`, 'error', currentAge);
          newMoney += inheritance.money;
          newAssets = [...newAssets, ...inheritance.assets];
          newHappiness = Math.max(0, newHappiness - randomInt(5, 15));
          return { ...au, isDead: true };
        }
        return au;
      });

      // Education — stat-based exam system
      if (newCurrentStudy) {
        newCurrentStudy.yearsLeft -= 1;
        if (newCurrentStudy.yearsLeft <= 0) {
          // === FINAL EXAM: Pass chance depends on smarts, stress, happiness, and trait ===
          // Pass chance heavily weighted by smarts — 90+ smarts should almost always pass
          const smartsFactor = (newSmarts / 100); // 0-1
          const smartsBoost = newSmarts >= 90 ? 0.25 : newSmarts >= 70 ? 0.12 : newSmarts >= 50 ? 0.05 : 0;
          const stressPenalty = newStress / 500; // 0-0.2 (reduced from 0.33)
          const happinessBonus = (newHappiness - 30) / 300; // -0.1 to +0.23
          const traitBonus = player.trait === 'Genius' ? 0.2 : player.trait === 'Lazy' ? -0.1 : 0;
          // Harder programs need higher stats (reduced difficulties)
          const difficultyMap: Record<string, number> = {
            'Community College': 0, 'Trade School': 0, 'Certification': 0, 'Training Program': 0,
            'University': 0.05, 'Business School': 0.05, 'Culinary School': 0.02,
            'Graduate School': 0.08, 'Law School': 0.08, 'Police Academy': 0.02, 'Military Academy': 0.05,
            'Medical School': 0.12, 'Dental School': 0.1, 'Veterinary School': 0.1, 'Pharmacy School': 0.08,
            'PhD Program': 0.15, 'Space Training': 0.15, 'Intelligence Academy': 0.1,
          };
          const difficulty = difficultyMap[newCurrentStudy.program] ?? 0.05;
          const passChance = Math.min(0.98, Math.max(0.15, smartsFactor * 0.7 + smartsBoost + happinessBonus + traitBonus - stressPenalty - difficulty + 0.3));
          const pct = Math.round(passChance * 100);

          if (Math.random() < passChance) {
            newEducation = newCurrentStudy.program;
            newDegrees.push(newCurrentStudy.program);
            const celebrations = newSmarts > 80
              ? ['You aced your finals with flying colors!', 'Top of your class!', 'Your professors were impressed.']
              : newSmarts > 50
              ? ['You passed with solid grades!', 'Hard work paid off.', 'Your family threw a celebration!']
              : ['You barely squeezed by, but you made it!', 'It was close, but you graduated!', 'You never want to take another exam again.'];
            addLog(`🎓 You graduated with a ${newCurrentStudy.program}! ${celebrations[Math.floor(Math.random() * celebrations.length)]} (${pct}% pass chance)`, 'success', currentAge);
            newCurrentStudy = undefined;
            newSmarts += randomInt(5, 15);
            newHappiness += randomInt(10, 20);
          } else {
            const failMsgs = newSmarts < 30
              ? ['The material was just too advanced.', 'You couldn\'t keep up with the coursework.']
              : newStress > 60
              ? ['Stress got the better of you during finals.', 'You burned out right before exams.']
              : ['You froze during the final exam.', 'The questions were nothing like what you studied.', 'Bad luck — the exam covered your weakest topics.'];
            addLog(`❌ You failed your final exams for ${newCurrentStudy.program}. ${failMsgs[Math.floor(Math.random() * failMsgs.length)]} (${pct}% pass chance)`, 'error', currentAge);
            // Can retry — pushed back 1 year
            newCurrentStudy.yearsLeft = 1;
            newHappiness = Math.max(0, newHappiness - randomInt(10, 20));
            newStress += randomInt(10, 20);
          }
        }
      } else if (currentAge === 6) {
        newEducation = 'Elementary School';
        addLog('You started Elementary School.', 'info', currentAge);
      } else if (currentAge === 11) {
        newEducation = 'Middle School';
        newDegrees.push('Elementary School');
        addLog('You graduated Elementary School and started Middle School.', 'info', currentAge);
      } else if (currentAge === 14) {
        newEducation = 'High School';
        newDegrees.push('Middle School');
        addLog('You graduated Middle School and started High School.', 'info', currentAge);
      } else if (currentAge === 18 && newEducation === 'High School') {
        newDegrees.push('High School');
        addLog('You graduated High School!', 'success', currentAge);
      }

      // Job — stat-based raise/promotion and firing system
      if (newJob) {
        newYearsInJob += 1;

        // === RAISE: Heavily dependent on performance — no raise if performance is low ===
        const perfBonus = newPerformance / 100; // 0-1
        const smartsBonus = newSmarts / 400; // 0-0.25 (reduced)
        const traitMod = player.trait === 'Genius' ? 0.05 : player.trait === 'Charismatic' ? 0.03 : player.trait === 'Lazy' ? -0.1 : 0;
        // Raise chance primarily driven by performance — low performance = almost no chance
        const raiseChance = newPerformance < 30 ? 0 :
                            newPerformance < 50 ? Math.max(0, 0.05 + traitMod) :
                            Math.min(0.7, perfBonus * 0.6 + smartsBonus + traitMod);

        // Raise amount scales with performance only (no tenure bonus for constant growth)
        const baseRaise = newPerformance > 85 ? randomInt(5, 10) :
                          newPerformance > 70 ? randomInt(3, 7) :
                          newPerformance > 50 ? randomInt(1, 4) : randomInt(0, 2);
        const raisePercent = baseRaise;

        if (raisePercent > 0 && Math.random() < raiseChance) {
          const raiseMultiplier = 1 + raisePercent / 100;
          newJob = { ...newJob, salary: Math.floor(newJob.salary * raiseMultiplier) };
          const reason = newPerformance > 85 ? 'Outstanding performance!' :
                         newPerformance > 70 ? 'Strong results this year.' :
                         newSmarts > 70 ? 'Your sharp thinking was noticed.' : 'Solid work.';
          addLog(`📈 You got a ${raisePercent}% raise! New salary: $${newJob.salary.toLocaleString()}. ${reason}`, 'success', currentAge);
          toast.success(`Promotion boost: ${raisePercent}% raise to $${newJob.salary.toLocaleString()}/yr`);
          newHappiness += randomInt(2, 5);
        } else if (newPerformance < 40 && Math.random() < 0.3) {
          addLog('No raise this year — your performance needs improvement.', 'info', currentAge);
        }

        // Performance change: can increase, stay, or decrease based on stats and randomness
        const perfChangeBase = (newSmarts - 50) / 80 + (newHappiness - 50) / 150 - (newStress) / 200;
        const randomSwing = (Math.random() - 0.45) * 12; // slight positive bias but very random
        const traitMod2 = player.trait === 'Lazy' ? -2 : player.trait === 'Genius' ? 2 : 0;
        const perfChange = Math.round(perfChangeBase * 5 + randomSwing + traitMod2);
        newPerformance = Math.max(0, Math.min(100, newPerformance + perfChange));
        if (perfChange > 5) {
          addLog('📈 Your performance at work improved noticeably.', 'success', currentAge);
        } else if (perfChange < -5) {
          addLog('📉 Your work performance slipped this year.', 'warning', currentAge);
        }

        // === FIRING: Based on low performance, low happiness, bad events ===
        const fireBaseChance = newPerformance < 20 ? 0.4 :
                               newPerformance < 35 ? 0.15 :
                               newPerformance < 50 ? 0.05 : 0;
        const stressPenalty = newStress > 80 ? 0.1 : newStress > 60 ? 0.05 : 0;
        const happinessPenalty = newHappiness < 20 ? 0.1 : newHappiness < 35 ? 0.05 : 0;
        const karmaPenalty = newKarma < 15 ? 0.08 : 0;
        const tenureProtection = Math.min(0.15, newYearsInJob * 0.015); // Long tenure protects you
        const fireChance = Math.max(0, fireBaseChance + stressPenalty + happinessPenalty + karmaPenalty - tenureProtection);

        if (fireChance > 0 && Math.random() < fireChance) {
          const fireReason = newPerformance < 20 ? 'due to consistently poor performance' :
                             newHappiness < 20 ? 'after showing up visibly miserable one too many times' :
                             newStress > 80 ? 'after a stress-induced breakdown at work' :
                             newKarma < 15 ? 'after your reputation caught up with you' : 'due to company downsizing';
          const newJobHistory = [...(player.jobHistory || [])];
          if (newJob) newJobHistory.push({ title: newJob.title, years: newYearsInJob });
          addLog(`🔴 You were fired from your job as ${newJob.title} ${fireReason}.`, 'error', currentAge);
          newJob = null;
          newYearsInJob = 0;
          newHappiness = Math.max(0, newHappiness - randomInt(15, 30));
          newStress += randomInt(10, 25);
        }
      }





      // Aging effects
      if (currentAge > 50) {
        newHealth -= randomInt(1, 3);
        newLooks -= randomInt(1, 3);
      }
      if (currentAge > 70) {
        newHealth -= randomInt(2, 5);
        newSmarts -= randomInt(1, 3);
      }

      // Death check
      const baseDeathChance = currentAge > 80 ? (currentAge - 80) * 0.05 : 0;
      const healthDeathPenalty = newHealth < 20 ? (20 - newHealth) * 0.02 : 0;
      if (Math.random() < baseDeathChance + healthDeathPenalty) {
        isAlive = false;
        const deathFlavor = newHealth < 10 
          ? ['after a long battle with illness.', 'peacefully, surrounded by memories.', 'after your health finally gave out.']
          : ['peacefully in your sleep.', 'suddenly and unexpectedly.', 'after a full and eventful life.'];
        const flavor = deathFlavor[Math.floor(Math.random() * deathFlavor.length)];
        const pName = newPartner?.name;
        addLog(`You passed away at age ${currentAge}, ${flavor}${pName ? ` ${pName} was by your side.` : ''}`, 'warning', currentAge);
      }

      // === PERSONALIZED RANDOM EVENTS ===
      // Multiple small events can fire per year to make things feel alive
      const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
      const partnerName = newPartner?.name;
      const hasKids = newKids.length > 0;
      const randomKid = hasKids ? pick(newKids) : null;
      const hasFriends = newFriends.length > 0;
      const randomFriend = hasFriends ? pick(newFriends) : null;
      const hasSiblings = newSiblings.filter(s => !s.isDead).length > 0;
      const randomSibling = hasSiblings ? pick(newSiblings.filter(s => !s.isDead)) : null;
      const jobTitle = newJob?.title;
      const hasBiz = newBusinesses.length > 0;
      const randomBiz = hasBiz ? pick(newBusinesses) : null;
      const hasProperty = newAssets.some(a => a.type === 'Property');
      const hasCar = newAssets.some(a => a.type === 'Car');

      // Pool of contextual micro-events (2-3 fire per year)
      type MicroEvent = { msg: string; action: () => void; type?: LogEntry['type']; weight?: number };
      const eventPool: MicroEvent[] = [];

      // --- Universal events (always available) ---
      eventPool.push(
        { msg: pick(['You found a $20 bill in your jacket pocket.', 'A stranger dropped $50 and you picked it up.', 'You won $75 in a scratch-off lottery ticket.']), action: () => { newMoney += pick([20, 50, 75]); newHappiness += 3; } },
        { msg: pick(['You woke up with a stiff neck.', 'You caught a nasty cold that lasted a week.', 'You twisted your ankle stepping off a curb.']), action: () => { newHealth -= randomInt(3, 8); } },
        { msg: pick(['You had an unexpectedly wonderful day.', 'Something about today just felt right.', 'You laughed so hard your stomach hurt.']), action: () => { newHappiness += randomInt(5, 12); newStress -= randomInt(3, 8); } },
        { msg: pick(['You dropped your phone and cracked the screen.', 'Your headphones broke.', 'A bird pooped on your favorite shirt.']), action: () => { newHappiness -= randomInt(3, 8); newMoney -= randomInt(50, 200); } },
        { msg: pick(['You stayed up all night reading a fascinating book.', 'You watched an incredible documentary.', 'You listened to a podcast that changed your perspective.']), action: () => { newSmarts += randomInt(2, 5); } },
      );

      // --- Age-specific events ---
      if (currentAge <= 12) {
        eventPool.push(
          { msg: pick(['You built the coolest blanket fort ever!', 'You made a best friend at the playground.', 'You caught a firefly and made a wish.']), action: () => { newHappiness += randomInt(5, 15); } },
          { msg: pick(['A bully took your lunch money.', 'You scraped your knee riding a bike.', 'You got scared by a thunderstorm.']), action: () => { newHappiness -= randomInt(5, 10); } },
        );
      }
      if (currentAge >= 13 && currentAge <= 19) {
        eventPool.push(
          { msg: pick(['You got invited to the cool kids\' party.', 'Someone you liked smiled at you in the hallway.', 'You aced a test without studying.']), action: () => { newHappiness += randomInt(8, 15); newPopularity += randomInt(1, 3); } },
          { msg: pick(['You got embarrassed in front of everyone at school.', 'Your crush ignored your text.', 'You had the worst acne breakout of your life.']), action: () => { newHappiness -= randomInt(8, 15); newLooks -= randomInt(1, 3); } },
        );
      }

      // --- Job-related events ---
      if (jobTitle) {
        eventPool.push(
          { msg: `Your coworker brought donuts to the office. You ate three.`, action: () => { newHappiness += 5; newHealth -= 1; } },
          { msg: `Your boss complimented your work as a ${jobTitle}. You felt proud.`, action: () => { newHappiness += 8; newPerformance += 3; } },
          { msg: `You had an awkward elevator ride with your manager in silence.`, action: () => { newStress += 3; } },
          { msg: `A colleague asked you for advice. Being a ${jobTitle} has its perks.`, action: () => { newSmarts += 2; newHappiness += 3; } },
          { msg: pick([`You spilled coffee on your desk at work.`, `The office Wi-Fi went down for 3 hours.`, `Someone microwaved fish in the break room.`]), action: () => { newHappiness -= 3; newStress += 5; } },
        );
        if (newYearsInJob >= 5) {
          eventPool.push({ msg: `You reminisced about your first day as a ${jobTitle}. Time flies.`, action: () => { newHappiness += 3; }, weight: 0.3 });
        }
      }

      // --- Partner events ---
      if (partnerName) {
        eventPool.push(
          { msg: `${partnerName} surprised you with your favorite meal.`, action: () => { newHappiness += randomInt(5, 12); } },
          { msg: `You and ${partnerName} had a silly argument about what to watch on TV.`, action: () => { newHappiness -= 2; newStress += 2; } },
          { msg: `${partnerName} left you a sweet note on the fridge.`, action: () => { newHappiness += 8; } },
          { msg: `You and ${partnerName} laughed about an old inside joke.`, action: () => { newHappiness += 6; newStress -= 5; } },
        );
        if (newPartner && newPartner.relationship < 40) {
          eventPool.push({ msg: `${partnerName} gave you the silent treatment all weekend.`, action: () => { newHappiness -= 12; newStress += 10; }, type: 'warning' });
        }
        if (newPartner && newPartner.type === 'married' && Math.random() < 0.3) {
          eventPool.push({ msg: `You and ${partnerName} slow-danced in the kitchen to no music.`, action: () => { newHappiness += 15; newStress -= 8; } });
        }
      }

      // --- Kids events ---
      if (randomKid) {
        if (randomKid.age <= 5) {
          eventPool.push(
            { msg: `${randomKid.name} said their first full sentence. You teared up.`, action: () => { newHappiness += 15; } },
            { msg: `${randomKid.name} drew a picture of you. It was terrible. You loved it.`, action: () => { newHappiness += 12; } },
          );
        } else if (randomKid.age <= 12) {
          eventPool.push(
            { msg: `${randomKid.name} showed you their report card. ${randomKid.relationship > 60 ? 'They were so proud!' : 'They seemed indifferent.'}`, action: () => { newHappiness += randomKid.relationship > 60 ? 8 : 2; } },
            { msg: `You helped ${randomKid.name} with homework. It was harder than you expected.`, action: () => { newSmarts += 1; newHappiness += 5; newStress += 3; } },
          );
        } else if (randomKid.age >= 13) {
          eventPool.push(
            { msg: `${randomKid.name} ${randomKid.relationship > 50 ? 'asked for your advice about life.' : 'slammed the door and told you to leave them alone.'}`, action: () => { newHappiness += randomKid.relationship > 50 ? 10 : -10; } },
          );
        }
      }

      // --- Friend events ---
      if (randomFriend) {
        eventPool.push(
          { msg: `${randomFriend.name} called you out of the blue just to chat.`, action: () => { newHappiness += 8; newStress -= 5; } },
          { msg: `You and ${randomFriend.name} reminisced about old times over coffee.`, action: () => { newHappiness += 10; } },
          { msg: `${randomFriend.name} asked to borrow $${pick([50, 100, 200])}. ${randomFriend.relationship > 70 ? 'You said yes.' : 'You politely declined.'}`, action: () => { if (randomFriend!.relationship > 70) { newMoney -= 100; } newStress += 2; } },
        );
      }

      // --- Sibling events ---
      if (randomSibling) {
        eventPool.push(
          { msg: `${randomSibling.name} sent you a meme that made you snort-laugh.`, action: () => { newHappiness += 5; } },
          { msg: `You got into a ${randomSibling.relationship > 60 ? 'playful' : 'heated'} argument with ${randomSibling.name}.`, action: () => { newHappiness += randomSibling.relationship > 60 ? 3 : -8; newStress += randomSibling.relationship > 60 ? 0 : 5; } },
        );
      }

      // --- Wealth / asset events ---
      if (hasProperty) {
        eventPool.push(
          { msg: pick(['Your neighbor\'s tree fell on your fence.', 'The kitchen sink started leaking.', 'You found a crack in the basement wall.']), action: () => { newMoney -= randomInt(200, 800); newStress += 5; }, type: 'warning' },
        );
      }
      if (hasCar) {
        eventPool.push(
          { msg: pick(['You got a parking ticket.', 'Someone dinged your car door in a parking lot.', 'Your car needed an unexpected oil change.']), action: () => { newMoney -= randomInt(50, 300); newHappiness -= 3; } },
        );
      }
      if (newMoney > 500000) {
        eventPool.push(
          { msg: pick(['A financial magazine featured you in their "Rising Wealth" column.', 'An old classmate asked you for investment tips.', 'You got invited to an exclusive networking dinner.']), action: () => { newFame += randomInt(1, 3); newHappiness += 5; } },
        );
      }
      if (newMoney < 100 && currentAge >= 18) {
        eventPool.push(
          { msg: pick(['You counted your coins to see if you could afford lunch.', 'You pretended to be busy when friends invited you to dinner — you couldn\'t afford it.', 'You ate ramen for the fifth day in a row.']), action: () => { newHappiness -= randomInt(5, 12); newStress += 5; }, type: 'warning' },
        );
      }

      // --- Business events ---
      if (randomBiz) {
        eventPool.push(
          { msg: `A customer left a glowing 5-star review for ${randomBiz.name}.`, action: () => { newHappiness += 5; newMoney += randomInt(100, 500); } },
          { msg: `${randomBiz.name} got a noise complaint from a neighbor.`, action: () => { newStress += 5; } },
        );
      }

      // --- Education callbacks ---
      if (newDegrees.includes('University') && currentAge > 25 && Math.random() < 0.1) {
        eventPool.push({ msg: `You bumped into a college classmate. They ${pick(['became a CEO', 'were still "figuring things out"', 'moved to another country', 'got married last week'])}.`, action: () => { newHappiness += 3; } });
      }

      // --- Health-based ---
      if (newHealth < 30) {
        eventPool.push({ msg: pick(['You felt winded just climbing stairs.', 'Your back ached all day.', 'You had trouble sleeping due to pain.']), action: () => { newHappiness -= 5; newStress += 5; }, type: 'warning' });
      }

      // --- Karma-based ---
      if (newKarma > 80) {
        eventPool.push({ msg: pick(['A stranger thanked you for holding the door. Small things matter.', 'You found a lost dog and returned it to its owner. They were overjoyed.', 'Someone you helped years ago sent you a heartfelt letter.']), action: () => { newHappiness += randomInt(5, 12); } });
      }
      if (newKarma < 20) {
        eventPool.push({ msg: pick(['An old acquaintance crossed the street to avoid you.', 'You overheard people whispering about you at the store.', 'A neighbor glared at you when you waved.']), action: () => { newHappiness -= randomInt(5, 10); }, type: 'warning' });
      }

      // --- Country flavor ---
      if (player.country === 'Japan') eventPool.push({ msg: pick(['Cherry blossoms bloomed beautifully this spring.', 'You enjoyed a peaceful trip to a local shrine.']), action: () => { newHappiness += 5; } });
      if (player.country === 'United States') eventPool.push({ msg: pick(['You binge-watched a new hit TV show over the weekend.', 'Your favorite team won the championship!']), action: () => { newHappiness += randomInt(3, 10); } });
      if (player.country === 'Brazil') eventPool.push({ msg: pick(['Carnival was incredible this year!', 'You spent a lazy Sunday at the beach.']), action: () => { newHappiness += randomInt(5, 12); } });
      if (player.country === 'France') eventPool.push({ msg: pick(['You had the best croissant of your life.', 'You strolled along the Seine at sunset.']), action: () => { newHappiness += randomInt(3, 8); } });
      if (player.country === 'India') eventPool.push({ msg: pick(['Diwali celebrations lit up the whole neighborhood.', 'You had your grandmother\'s recipe for the first time in years.']), action: () => { newHappiness += randomInt(5, 12); } });
      if (player.country === 'Germany') eventPool.push({ msg: pick(['Oktoberfest was a blast this year.', 'You took a beautiful hike in the Black Forest.']), action: () => { newHappiness += randomInt(3, 8); } });
      if (player.country === 'United Kingdom') eventPool.push({ msg: pick(['It rained for 14 straight days. Classic.', 'You had a proper Sunday roast.']), action: () => { newHappiness += randomInt(1, 5); } });
      if (player.country === 'Australia') eventPool.push({ msg: pick(['You saw a kangaroo on your morning jog.', 'Beach day with perfect waves!']), action: () => { newHappiness += randomInt(3, 8); } });
      if (player.country === 'Nigeria') eventPool.push({ msg: pick(['Jollof rice debate got heated at the family gathering.', 'A power outage turned into a fun candlelight evening.']), action: () => { newHappiness += randomInt(3, 8); } });
      if (player.country === 'Mexico') eventPool.push({ msg: pick(['Día de los Muertos was beautiful this year.', 'Your aunt made the best tamales you\'ve ever tasted.']), action: () => { newHappiness += randomInt(5, 10); } });

      // Fire 1-3 micro-events per year
      if (isAlive) {
        const numEvents = randomInt(1, 3);
        const shuffled = eventPool.sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(numEvents, shuffled.length); i++) {
          shuffled[i].action();
          addLog(shuffled[i].msg, shuffled[i].type || 'info', currentAge);
        }
      }

    // Bounds
    newHealth = Math.max(0, Math.min(100, newHealth));
    newSmarts = Math.max(0, Math.min(100, newSmarts));
    newHappiness = Math.max(0, Math.min(100, newHappiness));
    newLooks = Math.max(0, Math.min(100, newLooks));
    newStress = Math.max(0, Math.min(100, newStress));
    newMoney = clampMoney(newMoney);
    newDebt = clampDebt(newDebt);
    if (newMoney > player.money + 50000) toast.success(`Major financial gain: +$${(newMoney - player.money).toLocaleString()}`);
    if (newMoney < 500 && currentAge >= 18) {
      addLog(`⚠️ Low money warning: you only have $${newMoney.toLocaleString()} available.`, 'warning', currentAge);
      toast.warning(`Low money: $${newMoney.toLocaleString()} cash remaining`);
    }

    setPlayer({
      ...player,
      age: currentAge,
      health: newHealth,
      smarts: newSmarts,
      happiness: newHappiness,
      looks: newLooks,
      money: newMoney,
      debt: newDebt,
      loans: newLoans,
      creditScore: newCreditScore,
      pets: newPets,
      education: newEducation,
      degrees: newDegrees,
      currentStudy: newCurrentStudy,
      job: newJob,
      yearsInJob: newYearsInJob,
      isAlive,
      businesses: newBusinesses,
      assets: newAssets,
      partner: newPartner,
      kids: newKids,
      parents: newParents,
      grandparents: newGrandparents,
      auntsAndUncles: newAuntsAndUncles,
      cousins: newCousins,
      siblings: newSiblings,
      friends: newFriends,
      coworkers: newCoworkers,
      skills: newSkills,
      illnesses: newIllnesses,
      karma: newKarma,
      fame: newFame,
      followers: newFollowers,
      performance: newPerformance,
      popularity: newPopularity,
      inPrison: newInPrison,
      prisonYearsLeft: newPrisonYearsLeft,
      stress: newStress,
      realEstateSkill: newRealEstateSkill,
      realEstateXP: newRealEstateXP,
      languages: newLanguages,
      currentLanguageStudy: newCurrentLanguageStudy,
      visas: newVisas,
    });

    // Trigger a random scenario if alive
    // 50% chance every month, averages to every 2 months
    if (isAlive && Math.random() < 0.5) {
      const validScenarios = SCENARIOS.filter(s => {
        if (s.minAge !== undefined && currentAge < s.minAge) return false;
        if (s.maxAge !== undefined && currentAge > s.maxAge) return false;
        if (s.condition && !s.condition(player)) return false;
        return true;
      });
      
      if (validScenarios.length > 0) {
        const randomScenario = validScenarios[Math.floor(Math.random() * validScenarios.length)];
        setCurrentScenario(randomScenario);
      }
    }
  };

  const makeReform = (type: 'tax' | 'healthcare' | 'education') => {
    if (!player || !player.isAlive || player.job?.category !== 'Politics') return;

    if (reformsThisYear >= 3) {
      addLog(`You have already made enough reforms this year.`, 'warning');
      return;
    }

    setReformsThisYear(prev => prev + 1);

    let successChance = 0.5;
    let popChange = 0;
    let reformName = '';

    if (type === 'tax') {
      successChance = 0.4;
      popChange = randomInt(5, 15);
      reformName = 'Tax Cut';
    } else if (type === 'healthcare') {
      successChance = 0.6;
      popChange = randomInt(3, 10);
      reformName = 'Healthcare Expansion';
    } else {
      successChance = 0.8;
      popChange = randomInt(1, 5);
      reformName = 'Education Funding';
    }

    const success = Math.random() < successChance;

    if (success) {
      const newPlayer = { ...player, popularity: Math.min(100, player.popularity + popChange) };
      setPlayer(newPlayer);
      addLog(`Your ${reformName} reform was successful! Popularity increased by ${popChange}%.${getStatChangesString(player, newPlayer)}`, 'success');
    } else {
      const newPlayer = { ...player, popularity: Math.max(0, player.popularity - popChange) };
      setPlayer(newPlayer);
      addLog(`Your ${reformName} reform was unpopular and failed. Popularity decreased by ${popChange}%.${getStatChangesString(player, newPlayer)}`, 'error');
    }
  };

  const quitJob = () => {
    if (!player || !player.isAlive || !player.job) return;
    
    const newJobHistory = [...(player.jobHistory || [])];
    if (player.yearsInJob > 0) {
      newJobHistory.push({ title: player.job.title, years: player.yearsInJob });
    }

    setPlayer({
      ...player,
      job: null,
      yearsInJob: 0,
      jobHistory: newJobHistory,
      coworkers: undefined
    });
    addLog(`You quit your job as a ${player.job.title}.`, 'info');
  };

  const applyForJob = (job: Job) => {
    if (!player || !player.isAlive) return;

    if (player.job?.id === job.id) {
      addLog(`You are already working as a ${job.title}.`, 'warning');
      return;
    }

    if (player.age < 15) {
      addLog(`You are too young to apply for ${job.title}. You need to be 15.`, 'warning');
      return;
    }

    const req = job.requirements;
    
    if (req.age && player.age < req.age) {
      addLog(`You were rejected for ${job.title}. You are too young.`, 'error');
      return;
    }
    if (req.smarts && player.smarts < req.smarts) {
      addLog(`You were rejected for ${job.title}. You are not smart enough.`, 'error');
      return;
    }
    if (req.health && player.health < req.health) {
      addLog(`You were rejected for ${job.title}. You are not healthy enough.`, 'error');
      return;
    }
    if (req.popularity && player.popularity < req.popularity) {
      addLog(`You were rejected for ${job.title}. You are not popular enough (${player.popularity}% vs ${req.popularity}%).`, 'error');
      return;
    }
    if (req.education) {
      const isUniversityLevel = player.degrees.some(d => ['University', 'Medical School', 'Law School', 'Business School', 'Flight School', 'Maritime Academy', 'Dental School', 'Veterinary School', 'Pharmacy School', 'Space Training', 'Graduate School', 'Counseling School', 'Planning School', 'Intelligence Academy', 'Diplomatic Academy', 'Police Academy', 'Military Academy', 'Military Flight School', 'PhD Program'].includes(d));
      
      const basicEdu = ['None', 'Elementary School', 'Middle School', 'High School', 'University'];
      const highestBasic = Math.max(...player.degrees.map(d => basicEdu.indexOf(d)), 0);

      const checkEdu = (edu: EducationLevel) => {
        if (edu === 'University' && isUniversityLevel) return true;
        if (player.degrees.includes(edu)) return true;
        if (basicEdu.includes(edu) && highestBasic >= basicEdu.indexOf(edu)) return true;
        if (edu === 'High School' && player.age >= 18) return true;
        if (edu === 'Middle School' && player.age >= 14) return true;
        if (edu === 'Elementary School' && player.age >= 11) return true;
        return false;
      };

      const meetsPrimary = checkEdu(req.education);
      const meetsAlt = req.alternativeEducation ? checkEdu(req.alternativeEducation) : false;

      if (!meetsPrimary && !meetsAlt) {
        const altText = req.alternativeEducation ? ` or ${req.alternativeEducation}` : '';
        addLog(`You were rejected for ${job.title}. You need ${req.education}${altText}.`, 'error');
        return;
      }
    }
    // Career progression — strict experience requirements
    const totalExperience = (player.jobHistory || []).reduce((sum, jh) => sum + jh.years, 0) + player.yearsInJob;
    const sameCategoryYears = (player.jobHistory || [])
      .filter(jh => JOBS.find(j => j.title === jh.title)?.category === job.category)
      .reduce((sum, jh) => sum + jh.years, 0) + (player.job?.category === job.category ? player.yearsInJob : 0);

    // Enforce explicit experience requirements from job data
    if (req.minCategoryExperience && sameCategoryYears < req.minCategoryExperience) {
      addLog(`You were rejected for ${job.title}. You need ${req.minCategoryExperience}+ years in ${job.category} (you have ${sameCategoryYears}).`, 'error');
      return;
    }
    if (req.minTotalExperience && totalExperience < req.minTotalExperience) {
      addLog(`You were rejected for ${job.title}. You need ${req.minTotalExperience}+ years of total work experience (you have ${totalExperience}).`, 'error');
      return;
    }

    // Salary-based fallback gates for jobs without explicit experience requirements
    if (job.salary > 200000 && sameCategoryYears < 10 && !req.minCategoryExperience && !req.minTotalExperience) {
      addLog(`You were rejected for ${job.title}. You need 10+ years in ${job.category} (you have ${sameCategoryYears}).`, 'error');
      return;
    } else if (job.salary > 100000 && sameCategoryYears < 5 && !req.minCategoryExperience && !req.minTotalExperience) {
      addLog(`You were rejected for ${job.title}. You need 5+ years in ${job.category} (you have ${sameCategoryYears}).`, 'error');
      return;
    } else if (job.salary > 60000 && totalExperience < 2 && !req.minCategoryExperience && !req.minTotalExperience) {
      addLog(`You were rejected for ${job.title}. You need at least 2 years of work experience (you have ${totalExperience}).`, 'error');
      return;
    }

    if (req.previousJobId) {
      if (!player.job || player.job.id !== req.previousJobId || player.yearsInJob < (req.yearsInPreviousJob || 0)) {
        addLog(`You were rejected for ${job.title}. You lack the required experience.`, 'error');
        return;
      }
    }
    if (req.money) {
      if (player.money < req.money) {
        addLog(`You cannot afford to run for ${job.title}. It costs $${req.money.toLocaleString()}.`, 'error');
        return;
      }
    }

    // === FAILURE CHANCE: not every application succeeds ===
    // Base chance 50%, boosted by smarts, experience, education, looks, trait
    const eduLevels: EducationLevel[] = ['None', 'Elementary School', 'Middle School', 'High School', 'Community College', 'University', 'Graduate School', 'PhD Program'];
    const playerEduScore = Math.max(...player.degrees.map(d => eduLevels.indexOf(d as any)), 0) * 5; // 0-40
    const smartsBonus = player.smarts * 0.25; // 0-25
    const experienceBonus = Math.min(20, totalExperience * 2); // 0-20
    const categoryExpBonus = Math.min(10, sameCategoryYears * 2); // 0-10
    const looksBonus = player.looks * 0.05; // 0-5
    const traitBonus = player.trait === 'Genius' ? 10 : player.trait === 'Charismatic' ? 8 : player.trait === 'Lucky' ? 15 : player.trait === 'Lazy' ? -10 : 0;
    
    // Difficulty scales with salary
    const difficulty = job.salary < 30000 ? 0 : job.salary < 60000 ? 10 : job.salary < 100000 ? 25 : job.salary < 200000 ? 40 : 55;
    
    const hireChance = Math.min(95, Math.max(10, 50 + smartsBonus + experienceBonus + categoryExpBonus + playerEduScore + looksBonus + traitBonus - difficulty)) / 100;
    
    if (Math.random() > hireChance) {
      const pct = Math.round(hireChance * 100);
      addLog(`You applied for ${job.title} but were not selected. (${pct}% chance) Better luck next time!`, 'error');
      return;
    }

    const newJobHistory = [...(player.jobHistory || [])];
    if (player.job && player.yearsInJob > 0) {
      newJobHistory.push({ title: player.job.title, years: player.yearsInJob });
    }

    const newPlayer = { ...player, job, yearsInJob: 0, jobHistory: newJobHistory };
    if (req.money) {
      newPlayer.money -= req.money;
    }
    
    // Generate coworkers
    const numCoworkers = randomInt(2, 5);
    const coworkers = [];
    for (let i = 0; i < numCoworkers; i++) {
      const gender = Math.random() > 0.5 ? 'Male' : 'Female';
      const { first } = getRandomName(player.country, gender);
      coworkers.push({
        id: Math.random().toString(),
        name: first,
        age: Math.max(18, player.age + randomInt(-10, 20)),
        relationship: randomInt(30, 70),
        gender
      });
    }
    newPlayer.coworkers = coworkers;
    
    const pct = Math.round(hireChance * 100);
    setPlayer(newPlayer);
    addLog(`💼 Hired! You started as ${job.title} for $${job.salary.toLocaleString()}/yr. (${pct}% chance)${getStatChangesString(player, newPlayer)}`, 'success');
    toast.success(`New job: ${job.title} at $${job.salary.toLocaleString()}/yr`);
  };

  const applyForEducation = (edu: EducationLevel) => {
    if (!player || !player.isAlive) return;
    if (player.age < 18) {
      addLog('You are too young to apply for higher education.', 'warning');
      return;
    }
    if (player.currentStudy) {
      addLog(`You are already studying ${player.currentStudy.program}.`, 'warning');
      return;
    }
    if ((player.degrees || []).includes(edu)) {
      addLog(`You already have a degree in ${edu}.`, 'warning');
      return;
    }

    const cost = EDUCATION_COSTS[edu as keyof typeof EDUCATION_COSTS] || 0;
    const duration = EDUCATION_DURATIONS[edu as keyof typeof EDUCATION_DURATIONS] || 4;
    
    // Try scholarship first
    if (player.smarts > randomInt(70, 95)) {
      const newPlayer = { ...player, currentStudy: { program: edu, yearsLeft: duration } };
      setPlayer(newPlayer);
      addLog(`You got a full scholarship to ${edu}! It will take ${duration} years.${getStatChangesString(player, newPlayer)}`, 'success');
      return;
    }

    if (player.money >= cost) {
      const newPlayer = { ...player, money: player.money - cost, currentStudy: { program: edu, yearsLeft: duration } };
      setPlayer(newPlayer);
      addLog(`You paid $${cost.toLocaleString()} and enrolled in ${edu} for ${duration} years.${getStatChangesString(player, newPlayer)}`, 'success');
    } else {
      // Take a student loan
      const newPlayer = { ...player, debt: (player.debt || 0) + cost, currentStudy: { program: edu, yearsLeft: duration } };
      setPlayer(newPlayer);
      addLog(`You took out a $${cost.toLocaleString()} student loan and enrolled in ${edu} for ${duration} years.${getStatChangesString(player, newPlayer)}`, 'warning');
    }
  };

  const purchaseSmallUpgrade = (targetType: 'business' | 'property', targetId: string, upgradeId: string) => {
    if (!player || !player.isAlive) return;

    if (targetType === 'business') {
      const business = player.businesses.find(b => b.id === targetId);
      if (!business || !business.smallUpgrades) return;
      const upgrade = business.smallUpgrades.find(u => u.id === upgradeId);
      if (!upgrade || upgrade.purchased) return;
      if (player.money < upgrade.cost) {
        addLog(`You need $${upgrade.cost.toLocaleString()} to purchase ${upgrade.name}.`, 'error');
        return;
      }
      setPlayer(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          money: prev.money - upgrade.cost,
          businesses: prev.businesses.map(b => b.id === targetId ? {
            ...b,
            smallUpgrades: (b.smallUpgrades || []).map(u => u.id === upgradeId ? { ...u, purchased: true } : u)
          } : b)
        };
      });
      addLog(`You purchased ${upgrade.name} for $${upgrade.cost.toLocaleString()}! Revenue boosted by +${(upgrade.revenueBoost * 100).toFixed(0)}%.`, 'success');
    } else {
      const asset = player.assets.find(a => a.id === targetId);
      if (!asset || !asset.smallUpgrades) return;
      const upgrade = asset.smallUpgrades.find(u => u.id === upgradeId);
      if (!upgrade || upgrade.purchased) return;
      if (player.money < upgrade.cost) {
        addLog(`You need $${upgrade.cost.toLocaleString()} to purchase ${upgrade.name}.`, 'error');
        return;
      }
      setPlayer(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          money: prev.money - upgrade.cost,
          assets: prev.assets.map(a => a.id === targetId ? {
            ...a,
            smallUpgrades: (a.smallUpgrades || []).map(u => u.id === upgradeId ? { ...u, purchased: true } : u)
          } : a)
        };
      });
      addLog(`You purchased ${upgrade.name} for your ${asset.name} for $${upgrade.cost.toLocaleString()}! Revenue boosted by +${(upgrade.revenueBoost * 100).toFixed(0)}%.`, 'success');
    }
  };

  const purchaseLargeUpgrade = (targetType: 'business' | 'property', targetId: string, upgradeId: string) => {
    if (!player || !player.isAlive) return;

    if (targetType === 'business') {
      const business = player.businesses.find(b => b.id === targetId);
      if (!business || !business.largeUpgrades) return;
      const upgrade = business.largeUpgrades.find(u => u.id === upgradeId);
      if (!upgrade || upgrade.purchased) return;
      if (player.money < upgrade.cost) {
        addLog(`You need $${upgrade.cost.toLocaleString()} to purchase ${upgrade.name}.`, 'error');
        return;
      }
      setPlayer(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          money: prev.money - upgrade.cost,
          businesses: prev.businesses.map(b => b.id === targetId ? {
            ...b,
            basePrice: b.basePrice + Math.floor(b.basePrice * upgrade.valueBoost),
            largeUpgrades: (b.largeUpgrades || []).map(u => u.id === upgradeId ? { ...u, purchased: true } : u)
          } : b)
        };
      });
      addLog(`You purchased ${upgrade.name} for $${upgrade.cost.toLocaleString()}! Revenue +${(upgrade.revenueBoost * 100).toFixed(0)}%, Value +${(upgrade.valueBoost * 100).toFixed(0)}%.`, 'success');
    } else {
      const asset = player.assets.find(a => a.id === targetId);
      if (!asset || !asset.largeUpgrades) return;
      const upgrade = asset.largeUpgrades.find(u => u.id === upgradeId);
      if (!upgrade || upgrade.purchased) return;
      if (player.money < upgrade.cost) {
        addLog(`You need $${upgrade.cost.toLocaleString()} to purchase ${upgrade.name}.`, 'error');
        return;
      }
      setPlayer(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          money: prev.money - upgrade.cost,
          assets: prev.assets.map(a => a.id === targetId ? {
            ...a,
            value: a.value + Math.floor(a.value * upgrade.valueBoost),
            largeUpgrades: (a.largeUpgrades || []).map(u => u.id === upgradeId ? { ...u, purchased: true } : u)
          } : a)
        };
      });
      addLog(`You purchased ${upgrade.name} for ${asset.name} for $${upgrade.cost.toLocaleString()}! Revenue +${(upgrade.revenueBoost * 100).toFixed(0)}%, Value +${(upgrade.valueBoost * 100).toFixed(0)}%.`, 'success');
    }
  };

  const sellBusiness = (businessId: string) => {
    if (!player || !player.isAlive) return;
    
    const business = player.businesses.find(b => b.id === businessId);
    if (!business) return;

    let saleValue = business.basePrice;
    
    let mortgagePayoff = 0;
    
    if (business.mortgage && business.mortgage.monthsLeft > 0) {
      mortgagePayoff = business.mortgage.principal;
      saleValue -= mortgagePayoff;
    }
    
    setPlayer(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        money: prev.money + saleValue,
        businesses: prev.businesses.filter(b => b.id !== businessId)
      };
    });
    
    if (saleValue >= 0) {
      addLog(`You sold ${business.name} for $${saleValue.toLocaleString()}${mortgagePayoff > 0 ? ` (after paying off $${mortgagePayoff.toLocaleString()} in mortgage)` : ''}.`, 'success');
    } else {
      addLog(`You sold ${business.name} but owed $${Math.abs(saleValue).toLocaleString()} more on the mortgage than it was worth!`, 'error');
    }
  };

  const startBusiness = (idea: BusinessDefinition, useMortgage: boolean = false) => {
    if (!player || !player.isAlive) return;
    if (player.age < 18) {
      addLog('You are too young to start a business.', 'warning');
      return;
    }
    
    const downPayment = useMortgage ? Math.floor(idea.basePrice * 0.2) : idea.basePrice;
    
    if (player.money < downPayment) {
      addLog(`You need at least $${downPayment.toLocaleString()} to start a ${idea.name}.`, 'error');
      return;
    }

    let mortgage;
    if (useMortgage) {
      const principal = idea.basePrice - downPayment;
      const totalToPay = principal * 1.5; // 50% total interest over 10 years
      mortgage = {
        principal,
        monthsLeft: 120, // 10 years
        monthlyPayment: Math.floor(totalToPay / 120)
      };
    }

    const newBusiness: PlayerBusiness = {
      id: Math.random().toString(),
      definitionId: idea.id,
      name: `${player.lastName} ${idea.name}`,
      basePrice: idea.basePrice,
      category: idea.category,
      riskLevel: idea.riskLevel,
      upgrades: [],
      smallUpgrades: createBusinessSmallUpgrades(idea.name, idea.basePrice),
      largeUpgrades: createBusinessLargeUpgrades(idea.name, idea.basePrice),
      mortgage,
      profitability: 100,
      reputation: 50
    };

    setPlayer({ 
      ...player, 
      money: player.money - downPayment, 
      businesses: [...(player.businesses || []), newBusiness]
    });
    addLog(`You started a ${idea.name} for $${downPayment.toLocaleString()}!`, 'success');
    setShowBusinessModal(false);
  };

  const buyAsset = (template: { 
    type: AssetType; 
    name: string; 
    baseValue: number; 
    rentYield?: number;
    propertyTier?: import('./types').PropertyTier;
    propertyType?: import('./types').PropertyType;
    propertySize?: import('./types').PropertySize;
    maxUpgrades?: number;
  }) => {
    if (!player || !player.isAlive) return;
    if (player.age < 18 && template.type !== 'Lifestyle') {
      addLog(`You are too young to buy ${template.type.toLowerCase()}s. You need to be 18.`, 'warning');
      return;
    }

    let baseCost = Math.floor(template.baseValue * marketMultiplier);
    
    // Apply real estate skill discount (up to 95% off at level 100)
    if (template.type === 'Property' && player.realEstateSkill) {
      const discount = Math.min(0.95, (player.realEstateSkill / 100) * 0.95);
      baseCost = Math.floor(baseCost * (1 - discount));
    }
    
    let cost = baseCost;
    let downPayment = cost;
    let mortgage = 0;

    if (template.type === 'Property') {
      if (player.money >= cost) {
        downPayment = cost;
        mortgage = 0;
      } else {
        downPayment = Math.floor(player.money > 0 ? player.money * 0.8 : 0);
        mortgage = cost - downPayment;
      }
    }

    if (player.money < downPayment) {
      addLog(`You cannot afford a ${template.name}. You need at least $${downPayment.toLocaleString()} for the down payment.`, 'error');
      return;
    }

    const newAsset: Asset = {
      id: Math.random().toString(),
      type: template.type,
      name: template.name,
      value: cost,
      baseValue: template.baseValue,
      condition: 100,
      isRented: false,
      rentYield: template.rentYield,
      propertyTier: template.propertyTier,
      propertyType: template.propertyType,
      propertySize: template.propertySize,
      maxUpgrades: template.maxUpgrades,
      upgrades: [],
      upgradeLevel: 0,
      smallUpgrades: template.type === 'Property' ? SMALL_PROPERTY_UPGRADES.map(u => ({
        id: u.id,
        name: u.name,
        revenueBoost: u.revenueBoostPct,
        cost: Math.floor(template.baseValue * u.costPct),
        purchased: false,
      })) : undefined,
      largeUpgrades: template.type === 'Property' ? LARGE_PROPERTY_UPGRADES.map(u => ({
        id: u.id,
        name: u.name,
        revenueBoost: u.revenueBoostPct,
        valueBoost: u.valueBoostPct,
        cost: Math.floor(template.baseValue * u.costPct),
        purchased: false,
      })) : undefined,
      mortgage: mortgage > 0 ? {
        principal: mortgage,
        monthlyPayment: Math.max(1, Math.floor((cost * 0.05) / 12)),
        remainingMonths: Math.ceil(mortgage / Math.max(1, Math.floor((cost * 0.05) / 12)))
      } : undefined
    };

    let xpGained = template.type === 'Property' ? 20 : 0;
    let happinessGained = template.type === 'Lifestyle' ? 10 : template.type === 'Car' ? 15 : template.type === 'Boat' ? 20 : template.type === 'Plane' ? 30 : 0;

    if (mortgage > 0 && player.money < cost) {
      const newPlayer = {
        ...player, 
        money: player.money - downPayment, 
        assets: [...player.assets, newAsset],
        realEstateXP: (player.realEstateXP || 0) + xpGained,
        happiness: Math.min(100, player.happiness + happinessGained)
      };
      setPlayer(newPlayer);
      addLog(`You bought a ${template.name} with a mortgage! Paid $${downPayment.toLocaleString()} down.${getStatChangesString(player, newPlayer)}`, 'success');
    } else {
      const newPlayer = {
        ...player, 
        money: player.money - cost, 
        assets: [...player.assets, newAsset],
        realEstateXP: (player.realEstateXP || 0) + xpGained,
        happiness: Math.min(100, player.happiness + happinessGained)
      };
      setPlayer(newPlayer);
      addLog(`You bought a ${template.name} for $${cost.toLocaleString()} in cash!${getStatChangesString(player, newPlayer)}`, 'success');
    }
  };

  const sellAsset = (assetId: string) => {
    if (!player || !player.isAlive) return;
    const asset = player.assets.find(a => a.id === assetId);
    if (!asset) return;

    const sellPrice = Math.floor(asset.value * (asset.condition / 100));
    let netProfit = sellPrice;
    
    if (asset.mortgage) {
      netProfit -= asset.mortgage.principal;
    }

    let xpGained = asset.type === 'Property' ? 15 : 0;

    const newPlayer = {
      ...player, 
      money: player.money + netProfit, 
      assets: player.assets.filter(a => a.id !== assetId),
      realEstateXP: (player.realEstateXP || 0) + xpGained
    };
    setPlayer(newPlayer);
    
    if (asset.mortgage) {
      addLog(`You sold your ${asset.name} for $${sellPrice.toLocaleString()}, paid off the $${asset.mortgage.principal.toLocaleString()} mortgage, and netted $${netProfit.toLocaleString()}.${getStatChangesString(player, newPlayer)}`, 'info');
    } else {
      addLog(`You sold your ${asset.name} for $${sellPrice.toLocaleString()}.${getStatChangesString(player, newPlayer)}`, 'info');
    }
  };

  const giftAsset = (assetId: string, kidId: string) => {
    if (!player || !player.isAlive) return;
    const asset = player.assets.find(a => a.id === assetId);
    const kid = player.kids.find(k => k.id === kidId);
    if (!asset || !kid) return;

    if (asset.mortgage) {
      addLog(`You cannot gift ${asset.name} because it has a mortgage. Pay it off first.`, 'error');
      return;
    }

    const newPlayer = {
      ...player,
      assets: player.assets.filter(a => a.id !== assetId),
      kids: player.kids.map(k => k.id === kidId ? { 
        ...k, 
        relationship: Math.min(100, k.relationship + 20),
        assets: [...(k.assets || []), asset]
      } : k)
    };
    setPlayer(newPlayer);
    
    addLog(`You gifted your ${asset.name} to your child ${kid.name}.${getStatChangesString(player, newPlayer)}`, 'success');
  };

  const payOffDebt = () => {
    if (!player || !player.isAlive || player.debt <= 0) return;
    
    // Pay as much as possible, up to the total debt
    const amountToPay = Math.min(player.money, player.debt);
    
    if (amountToPay <= 0) {
      addLog('You do not have any money to pay off your debt.', 'error');
      return;
    }

    const newPlayer = {
      ...player,
      money: player.money - amountToPay,
      debt: player.debt - amountToPay
    };
    setPlayer(newPlayer);
    addLog(`You paid off $${amountToPay.toLocaleString()} of your debt.${getStatChangesString(player, newPlayer)}`, 'success');
  };

  const upgradeProperty = (assetId: string) => {
    if (!player || !player.isAlive) return;
    const asset = player.assets.find(a => a.id === assetId);
    if (!asset || asset.type !== 'Property') return;

    const currentLevel = asset.upgradeLevel || (Array.isArray(asset.upgrades) ? asset.upgrades.length : 0);

    if (currentLevel >= UPGRADE_LEVELS.length) {
      addLog(`Your ${asset.name} is fully upgraded (Level 6/6).`, 'warning');
      return;
    }

    const nextUpgrade = UPGRADE_LEVELS[currentLevel];
    const upgradeCost = Math.floor(asset.value * nextUpgrade.costPct);

    if (player.money < upgradeCost) {
      addLog(`You cannot afford ${nextUpgrade.name} for your ${asset.name}. It costs $${upgradeCost.toLocaleString()}.`, 'error');
      return;
    }

    const newLevel = currentLevel + 1;
    
    // Re-calculate value
    let totalUpgradeEffect = 0;
    for (let i = 0; i < newLevel; i++) {
      totalUpgradeEffect += UPGRADE_LEVELS[i].effectPct;
    }
    
    let conditionMultiplier = 1.0;
    if (asset.condition < 40) conditionMultiplier = 0.7;
    if (asset.condition === 0) conditionMultiplier = 0.3;

    const newValue = Math.floor((asset.baseValue || asset.value) * (1 + totalUpgradeEffect) * marketMultiplier * conditionMultiplier);

    const newPlayer = {
      ...player,
      money: player.money - upgradeCost,
      realEstateXP: (player.realEstateXP || 0) + 10,
      assets: player.assets.map(a => a.id === assetId ? { ...a, value: newValue, upgradeLevel: newLevel, condition: Math.min(100, a.condition + 10) } : a)
    };
    setPlayer(newPlayer);
    addLog(`You spent $${upgradeCost.toLocaleString()} on ${nextUpgrade.name} for your ${asset.name}! Its value increased to $${newValue.toLocaleString()}.${getStatChangesString(player, newPlayer)}`, 'success');
  };

  const togglePrimaryResidence = (assetId: string) => {
    if (!player || !player.isAlive) return;
    setPlayer({
      ...player,
      assets: player.assets.map(a => {
        if (a.id === assetId) {
          return { ...a, isPrimaryResidence: !a.isPrimaryResidence, isRented: false };
        }
        if (a.type === 'Property' && a.isPrimaryResidence) {
          return { ...a, isPrimaryResidence: false }; // Only one primary residence
        }
        return a;
      })
    });
  };

  const repairAsset = (assetId: string) => {
    if (!player || !player.isAlive) return;
    const asset = player.assets.find(a => a.id === assetId);
    if (!asset || asset.type === 'Crypto') return;

    if (asset.condition >= 100) {
      addLog(`Your ${asset.name} is already in perfect condition.`, 'warning');
      return;
    }

    const repairCost = Math.floor(asset.value * ((100 - asset.condition) / 100) * 0.05);

    if (player.money < repairCost) {
      addLog(`You cannot afford to repair your ${asset.name}. It costs $${repairCost.toLocaleString()}.`, 'error');
      return;
    }

    let newValue = asset.value;
    if (asset.type === 'Property') {
      const currentLevel = asset.upgradeLevel || (Array.isArray(asset.upgrades) ? asset.upgrades.length : 0);
      let totalUpgradeEffect = 0;
      for (let i = 0; i < Math.min(currentLevel, UPGRADE_LEVELS.length); i++) {
        totalUpgradeEffect += UPGRADE_LEVELS[i].effectPct;
      }
      let upgradeMultiplier = 1.0 + totalUpgradeEffect;
      newValue = Math.floor((asset.baseValue || asset.value) * upgradeMultiplier * marketMultiplier);
    } else {
      newValue = asset.baseValue || asset.value;
    }

    const newPlayer = {
      ...player,
      money: player.money - repairCost,
      realEstateXP: asset.type === 'Property' ? (player.realEstateXP || 0) + 5 : player.realEstateXP,
      assets: player.assets.map(a => a.id === assetId ? { ...a, condition: 100, value: newValue } : a)
    };
    setPlayer(newPlayer);
    addLog(`You spent $${repairCost.toLocaleString()} to repair your ${asset.name}.${getStatChangesString(player, newPlayer)}`, 'success');
  };

  const toggleRentProperty = (assetId: string) => {
    if (!player || !player.isAlive) return;
    const asset = player.assets.find(a => a.id === assetId);
    if (!asset) return;

    if (asset.isRented) {
      // Evict tenant
      setPlayer({
        ...player,
        assets: player.assets.map(a => a.id === assetId ? { ...a, isRented: false, tenant: undefined } : a)
      });
      addLog(`You evicted the tenant from ${asset.name}.`, 'info');
    } else {
      // Open modal to find tenant
      setTenantModalAssetId(assetId);
      generateTenantOffer();
    }
  };

  const generateTenantOffer = () => {
    const isMale = Math.random() > 0.5;
    const name = isMale ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
    const reliability = randomInt(10, 100);
    setCurrentTenantOffer({ name, reliability });
  };

  const acceptTenant = () => {
    if (!player || !tenantModalAssetId || !currentTenantOffer) return;
    setPlayer({
      ...player,
      assets: player.assets.map(a => a.id === tenantModalAssetId ? { ...a, isRented: true, tenant: currentTenantOffer } : a)
    });
    addLog(`You rented out a property to ${currentTenantOffer.name}.`, 'success');
    setTenantModalAssetId(null);
    setCurrentTenantOffer(null);
  };

  const rejectTenant = () => {
    generateTenantOffer();
  };

  const closeTenantModal = () => {
    setTenantModalAssetId(null);
    setCurrentTenantOffer(null);
  };

  const payOffMortgage = (assetId: string) => {
    if (!player || !player.isAlive) return;
    const asset = player.assets.find(a => a.id === assetId);
    if (!asset || !asset.mortgage) return;

    if (player.money < asset.mortgage.principal) {
      addLog(`You cannot afford to pay off the $${asset.mortgage.principal.toLocaleString()} mortgage on your ${asset.name}.`, 'error');
      return;
    }

    const newPlayer = {
      ...player,
      money: player.money - asset.mortgage.principal,
      assets: player.assets.map(a => a.id === assetId ? { ...a, mortgage: undefined } : a)
    };
    setPlayer(newPlayer);
    addLog(`You paid off the $${asset.mortgage.principal.toLocaleString()} mortgage on your ${asset.name}!${getStatChangesString(player, newPlayer)}`, 'success');
  };

  const generateMatch = (pref: 'Male' | 'Female' | 'Any') => {
    if (!player) return;
    let gender = pref;
    if (gender === 'Any') {
      gender = Math.random() > 0.5 ? 'Male' : 'Female';
    }
    const name = gender === 'Male' 
      ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] 
      : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
    const age = player.age + randomInt(-5, 5);
    setCurrentMatch({ name, age: Math.max(18, age), looks: randomInt(30, 100), gender });
  };

  const startSearching = (pref: 'Male' | 'Female' | 'Any') => {
    setDatingPreference(pref);
    setDatingStep('searching');
    setTimeout(() => {
      generateMatch(pref);
      setDatingStep('match');
    }, 1500);
  };

  const openDatingApp = () => {
    if (!player || !player.isAlive) return;
    if (player.age < 18) {
      addLog('You are too young to use the dating app. You need to be 18.', 'warning');
      return;
    }
    if (player.partner) {
      addLog(`You are already ${player.partner.type === 'married' ? 'married to' : 'dating'} ${player.partner.name}.`, 'warning');
      return;
    }
    setDatingStep('preference');
    setShowDatingApp(true);
  };

  const startLanguageStudy = (langId: string) => {
    if (!player || !player.isAlive) return;
    if (player.age < 6) {
      addLog("You're too young to study languages at school.", 'warning');
      return;
    }
    const langDef = ALL_LANGUAGES.find(l => l.id === langId);
    if (!langDef) return;

    const existing = (player.languages || []).find(l => l.id === langId);
    if (existing && existing.proficiency >= 100) {
      addLog(`You already speak ${langDef.name} fluently!`, 'warning');
      return;
    }

    const cost = LANGUAGE_STUDY_COST[langDef.difficulty];
    if (player.money < cost) {
      addLog(`You can't afford ${langDef.name} lessons ($${cost.toLocaleString()}/yr).`, 'error');
      return;
    }

    const newLanguages = [...(player.languages || [])];
    if (!existing) {
      newLanguages.push({ id: langId, name: langDef.name, proficiency: 0, isNative: false });
    }

    setPlayer({
      ...player,
      money: player.money - cost,
      languages: newLanguages,
      currentLanguageStudy: { languageId: langId, languageName: langDef.name }
    });
    addLog(`You started studying ${langDef.name}! ($${cost.toLocaleString()}/yr)`, 'success');
  };

  const stopLanguageStudy = () => {
    if (!player) return;
    const langName = player.currentLanguageStudy?.languageName || 'the language';
    setPlayer({ ...player, currentLanguageStudy: undefined });
    addLog(`You stopped studying ${langName}.`, 'info');
  };


  const likeMatch = () => {
    if (!player || !currentMatch) return;
    const matchChance = player.looks > currentMatch.looks - 20 ? 0.6 : 0.3;
    if (Math.random() < matchChance) {
      setPlayer({
        ...player,
        partner: { type: 'dating', name: currentMatch.name, age: currentMatch.age, relationship: randomInt(60, 90), gender: currentMatch.gender }
      });
      addLog(`You matched with ${currentMatch.name} and you started dating!`, 'success');
      setShowDatingApp(false);
    } else {
      addLog(`${currentMatch.name} didn't match with you.`, 'info');
      startSearching(datingPreference);
    }
  };

  const passMatch = () => {
    startSearching(datingPreference);
  };

  const makeFriend = () => {
    if (!player || !player.isAlive) return;
    if (Math.random() > 0.7) {
      addLog('You tried to make a friend, but didn\'t click with anyone.', 'info');
      return;
    }
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const name = gender === 'Male' 
      ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] 
      : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
    const newFriend = { id: Math.random().toString(), name, age: player.age + randomInt(-3, 3), relationship: randomInt(40, 70) };
    const newPlayer = {
      ...player,
      friends: [...(player.friends || []), newFriend]
    };
    setPlayer(newPlayer);
    addLog(`You made a new friend named ${name}!${getStatChangesString(player, newPlayer)}`, 'success');
  };

  const socializeWithFriend = (id: string) => {
    if (!player || !player.isAlive) return;
    const friend = (player.friends || []).find(f => f.id === id);
    if (!friend) return;
    const newPlayer = {
      ...player,
      friends: (player.friends || []).map(f => f.id === id ? { ...f, relationship: Math.min(100, f.relationship + randomInt(5, 15)) } : f),
      happiness: Math.min(100, player.happiness + 5)
    };
    setPlayer(newPlayer);
    addLog(`You hung out with your friend ${friend.name}.${getStatChangesString(player, newPlayer)}`, 'info');
  };

  const unfriend = (id: string) => {
    if (!player || !player.isAlive) return;
    const friend = (player.friends || []).find(f => f.id === id);
    if (!friend) return;
    const newPlayer = {
      ...player,
      friends: (player.friends || []).filter(f => f.id !== id)
    };
    setPlayer(newPlayer);
    addLog(`You stopped being friends with ${friend.name}.${getStatChangesString(player, newPlayer)}`, 'info');
  };

  const takeLoan = (type: 'Small' | 'Personal' | 'Business' | 'Loan Shark') => {
    if (!player || !player.isAlive) return;
    
    let amount = 0;
    let interestRate = 0;
    let months = 0;
    
    switch (type) {
      case 'Small':
        amount = 5000;
        interestRate = 8;
        months = 12;
        break;
      case 'Personal':
        amount = 25000;
        interestRate = 12;
        months = 36;
        break;
      case 'Business':
        amount = 100000;
        interestRate = 10;
        months = 60;
        break;
      case 'Loan Shark':
        amount = 50000;
        interestRate = 40;
        months = 12;
        break;
    }
    
    const monthlyInterest = (interestRate / 100) / 12;
    const monthlyPayment = Math.floor((amount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months)));
    
    const newLoan: import('./types').Loan = {
      id: Math.random().toString(),
      amount,
      interestRate,
      monthlyPayment,
      monthsLeft: months,
      type
    };
    
    const newPlayer = {
      ...player,
      money: player.money + amount,
      loans: [...(player.loans || []), newLoan],
      debt: player.debt + amount
    };
    
    setPlayer(newPlayer);
    addLog(`You took out a ${type} loan for $${amount.toLocaleString()} at ${interestRate}% interest.`, 'warning');
  };

  const payLoan = (loanId: string) => {
    if (!player || !player.isAlive) return;
    const loan = (player.loans || []).find(l => l.id === loanId);
    if (!loan) return;
    
    if (player.money < loan.amount) {
      addLog(`You don't have enough money to pay off this loan. You need $${Math.ceil(loan.amount).toLocaleString()}.`, 'error');
      return;
    }
    
    const newPlayer = {
      ...player,
      money: player.money - loan.amount,
      debt: Math.max(0, player.debt - loan.amount),
      loans: player.loans?.filter(l => l.id !== loanId),
      creditScore: Math.min(850, (player.creditScore || 600) + 20)
    };
    
    setPlayer(newPlayer);
    addLog(`You paid off your ${loan.type} loan of $${Math.ceil(loan.amount).toLocaleString()}!`, 'success');
  };

  const buyPet = (type: string, cost: number) => {
    if (!player || !player.isAlive) return;
    if (player.money < cost) {
      addLog(`You cannot afford a ${type}. It costs $${cost.toLocaleString()}.`, 'error');
      return;
    }
    
    const petNames = ['Buddy', 'Bella', 'Charlie', 'Luna', 'Max', 'Lucy', 'Rocky', 'Daisy', 'Milo', 'Zoe', 'Leo', 'Lola', 'Jack', 'Stella', 'Oliver', 'Chloe', 'Bear', 'Penny', 'Duke', 'Ruby', 'Zeus', 'Rosie', 'Apollo', 'Lily', 'Thor', 'Mia', 'Buster', 'Coco', 'Diesel', 'Nala'];
    const name = petNames[Math.floor(Math.random() * petNames.length)];
    
    const newPet: import('./types').Pet = {
      id: Math.random().toString(),
      name,
      type,
      age: 0,
      health: 100,
      happiness: 100,
      loyalty: 50
    };
    
    const newPlayer = {
      ...player,
      money: player.money - cost,
      pets: [...(player.pets || []), newPet],
      happiness: Math.min(100, player.happiness + 15)
    };
    
    setPlayer(newPlayer);
    addLog(`You bought a ${type} named ${name} for $${cost.toLocaleString()}!`, 'success');
  };

  const interactWithPet = (petId: string, action: 'feed' | 'play' | 'train' | 'vet' | 'sell') => {
    if (!player || !player.isAlive) return;
    const pet = (player.pets || []).find(p => p.id === petId);
    if (!pet) return;
    
    let newPlayer = { ...player };
    let msg = '';
    
    if (action === 'sell') {
      newPlayer.pets = newPlayer.pets?.filter(p => p.id !== petId);
      newPlayer.money += 50;
      newPlayer.karma = Math.max(0, newPlayer.karma - 10);
      msg = `You sold your pet ${pet.name} for $50.`;
    } else {
      newPlayer.pets = newPlayer.pets?.map(p => {
        if (p.id === petId) {
          let updated = { ...p };
          if (action === 'feed') {
            if (newPlayer.money < 20) { msg = `Not enough money to feed ${pet.name}.`; return p; }
            newPlayer.money -= 20;
            updated.health = Math.min(100, updated.health + 10);
            msg = `You fed ${pet.name}.`;
          } else if (action === 'play') {
            updated.happiness = Math.min(100, updated.happiness + 15);
            newPlayer.happiness = Math.min(100, newPlayer.happiness + 5);
            msg = `You played with ${pet.name}.`;
          } else if (action === 'train') {
            updated.loyalty = Math.min(100, updated.loyalty + 15);
            msg = `You trained ${pet.name}.`;
          } else if (action === 'vet') {
            if (newPlayer.money < 200) { msg = `Not enough money for the vet.`; return p; }
            newPlayer.money -= 200;
            updated.health = 100;
            msg = `You took ${pet.name} to the vet.`;
          }
          return updated;
        }
        return p;
      });
    }
    
    setPlayer(newPlayer);
    if (msg) addLog(msg, action === 'sell' ? 'warning' : 'info');
  };

  const applyForVisa = (targetCountry: string, visa: any) => {
    if (!player || !player.isAlive) return;
    if (player.age < 18) {
      addLog('You must be 18 or older to apply for immigration.', 'warning');
      return;
    }
    if (player.money < visa.cost) {
      addLog(`You cannot afford the ${visa.label} application. It costs $${visa.cost.toLocaleString()}.`, 'error');
      return;
    }
    if (player.inPrison) {
      addLog('You cannot apply for immigration while in prison.', 'error');
      return;
    }

    const { chance } = calculateImmigrationChance(visa, targetCountry, player);

    // Immediate processing for tourist visas
    if (visa.type === 'tourist' || visa.processingTimeYears === 0) {
      const success = Math.random() < chance;
      if (success) {
        const newVisa = {
          id: Math.random().toString(),
          type: visa.type,
          country: targetCountry,
          status: 'approved' as const,
          appliedYear: player.age,
          processYearsLeft: 0,
          expiresAge: visa.grantsDuration ? player.age + visa.grantsDuration : undefined,
        };

        // For citizenship/permanent_residency, actually move there
        if (visa.type === 'citizenship' || visa.type === 'permanent_residency') {
          const passportData = getPassportData(targetCountry);
          const newPlayer = {
            ...player,
            money: player.money - visa.cost,
            country: targetCountry,
            passport: { country: targetCountry, tier: passportData.tier, strength: passportData.strength, visaFreeCountries: passportData.visaFreeCountries },
            previousCountries: [...(player.previousCountries || []), player.country].filter((v, i, a) => a.indexOf(v) === i),
            visas: [...(player.visas || []), newVisa],
            job: null,
            happiness: Math.min(100, player.happiness + 25),
          };
          setPlayer(newPlayer);
          addLog(`🎉 Your ${visa.label} for ${targetCountry} was approved! You've moved to ${targetCountry}!`, 'success');
        } else {
          setPlayer({
            ...player,
            money: player.money - visa.cost,
            visas: [...(player.visas || []), newVisa],
          });
          addLog(`✅ Your ${visa.label} for ${targetCountry} was approved!`, 'success');
        }
      } else {
        setPlayer({
          ...player,
          money: player.money - visa.cost,
          happiness: Math.max(0, player.happiness - 10),
        });
        addLog(`❌ Your ${visa.label} for ${targetCountry} was denied. You lost $${visa.cost.toLocaleString()} in fees.`, 'error');
      }
    } else {
      // Multi-year processing — add as pending
      const newVisa = {
        id: Math.random().toString(),
        type: visa.type,
        country: targetCountry,
        status: 'pending' as const,
        appliedYear: player.age,
        processYearsLeft: visa.processingTimeYears,
      };
      setPlayer({
        ...player,
        money: player.money - visa.cost,
        visas: [...(player.visas || []), newVisa],
      });
      addLog(`📋 Applied for ${visa.label} in ${targetCountry}. Processing time: ${visa.processingTimeYears} year(s). Cost: $${visa.cost.toLocaleString()}.`, 'info');
    }
  };

  const cancelVisa = (visaId: string) => {
    if (!player) return;
    setPlayer({
      ...player,
      visas: (player.visas || []).filter(v => v.id !== visaId),
    });
    addLog('You cancelled a pending visa application.', 'info');
  };

  const emigrate = (country: string, cost: number) => {
    if (!player || !player.isAlive) return;
    if (player.age < 18) {
      addLog('You must be 18 or older to emigrate.', 'warning');
      return;
    }
    if (player.money < cost) {
      addLog(`You cannot afford to emigrate to ${country}. It costs $${cost.toLocaleString()}.`, 'error');
      return;
    }
    
    if (player.inPrison) {
      addLog('You cannot emigrate while in prison.', 'error');
      return;
    }
    
    const countryData = COUNTRY_DATA[country];
    const stability = countryData ? countryData.stability / 100 : 0.5;
    
    const karmaModifier = (player.karma - 50) / 500;
    const successChance = Math.max(0.1, Math.min(0.95, stability + karmaModifier));
    
    if (Math.random() < successChance) {
      const passportData = getPassportData(country);
      const newPlayer = {
        ...player,
        money: player.money - cost,
        country,
        passport: { country, tier: passportData.tier, strength: passportData.strength, visaFreeCountries: passportData.visaFreeCountries },
        previousCountries: [...(player.previousCountries || []), player.country].filter((v, i, a) => a.indexOf(v) === i),
        job: null,
        happiness: Math.min(100, player.happiness + 20)
      };
      setPlayer(newPlayer);
      addLog(`You successfully emigrated to ${country}! You had to leave your job behind.`, 'success');
    } else {
      const newPlayer = {
        ...player,
        money: player.money - (cost / 2),
        happiness: Math.max(0, player.happiness - 20)
      };
      setPlayer(newPlayer);
      addLog(`Your visa application to ${country} was denied. You lost $${(cost / 2).toLocaleString()} in fees.`, 'error');
    }
  };

  const makeLove = () => {
    if (!player || !player.isAlive || !player.partner) return;
    
    let newPlayer = { ...player };
    let msg = `You made love with ${player.partner.name}.`;
    newPlayer.happiness = Math.min(100, newPlayer.happiness + 10);
    
    if (Math.random() < 0.15) {
      const kidGender = Math.random() > 0.5 ? 'Male' : 'Female';
      const { first: kidName } = getRandomName(player.country, kidGender);
      newPlayer.kids = [...(newPlayer.kids || []), {
        id: Math.random().toString(),
        name: kidName,
        age: 0,
        relationship: 50,
        gender: kidGender
      }];
      msg += ` You are having a baby! Welcome ${kidName}.`;
    }
    
    setPlayer(newPlayer);
    addLog(msg, 'success');
  };

  const fertilityTreatment = () => {
    if (!player || !player.isAlive || !player.partner) return;
    if (player.money < 8000) {
      addLog('You cannot afford fertility treatments ($8,000).', 'error');
      return;
    }
    
    let newPlayer = { ...player, money: player.money - 8000 };
    let msg = `You underwent fertility treatments for $8,000.`;
    
    if (Math.random() < 0.45) {
      const kidGender = Math.random() > 0.5 ? 'Male' : 'Female';
      const { first: kidName } = getRandomName(player.country, kidGender);
      newPlayer.kids = [...(newPlayer.kids || []), {
        id: Math.random().toString(),
        name: kidName,
        age: 0,
        relationship: 50,
        gender: kidGender
      }];
      msg += ` It was successful! You are having a baby named ${kidName}.`;
      newPlayer.happiness = Math.min(100, newPlayer.happiness + 30);
    } else {
      msg += ` Unfortunately, it was not successful this time.`;
      newPlayer.happiness = Math.max(0, newPlayer.happiness - 20);
    }
    
    setPlayer(newPlayer);
    addLog(msg, 'info');
  };

  const propose = () => {
    if (!player || !player.isAlive || !player.partner) return;
    if (player.partner.type === 'married') {
      addLog(`You are already married to ${player.partner.name}.`, 'warning');
      return;
    }
    if (player.partner.type === 'engaged') {
      addLog(`You are already engaged to ${player.partner.name}. Plan the wedding!`, 'warning');
      return;
    }
    if (player.age < 18) {
      addLog('You are too young to get married.', 'warning');
      return;
    }

    // 10% chance of rejection if girl proposes to man due to embarrassment
    // Assume player gender is not explicitly stored, wait, we don't have player gender?
    // Let's assume player gender based on partner gender? No, player can be anything.
    // We don't have player gender in Player interface. Let's just add a 10% chance of embarrassment rejection if partner is male.
    if (player.partner.gender === 'Male' && Math.random() < 0.1) {
      const newPlayer = {
        ...player,
        partner: { ...player.partner, relationship: Math.max(0, player.partner.relationship - 10) }
      };
      setPlayer(newPlayer);
      addLog(`${player.partner.name} was embarrassed that you proposed first and rejected it.${getStatChangesString(player, newPlayer)}`, 'error');
      return;
    }

    if (player.partner.relationship > 70) {
      const newPlayer = {
        ...player,
        partner: { ...player.partner, type: 'engaged' as const, relationship: Math.min(100, player.partner.relationship + 20) }
      };
      setPlayer(newPlayer);
      addLog(`${player.partner.name} accepted your proposal! You are now engaged!${getStatChangesString(player, newPlayer)}`, 'success');
    } else {
      const newPlayer = {
        ...player,
        partner: { ...player.partner, relationship: Math.max(0, player.partner.relationship - 20) }
      };
      setPlayer(newPlayer);
      addLog(`${player.partner.name} rejected your proposal.${getStatChangesString(player, newPlayer)}`, 'error');
    }
  };

  const planWedding = (venue: typeof WEDDING_VENUES[0]) => {
    if (!player || !player.isAlive || !player.partner || player.partner.type !== 'engaged') return;

    let costToMoney = venue.cost;
    let parentsPaid = false;
    let newParents = player.parents ? [...player.parents] : [];

    if (askParentsToPay && venue.cost > 0) {
      const aliveParents = newParents.filter(p => !p.isDead);
      if (aliveParents.length > 0) {
        const parent = aliveParents.reduce((prev, current) => (prev.relationship > current.relationship) ? prev : current);
        if (parent.relationship > 50) { // Weddings are expensive, need higher relationship
          parentsPaid = true;
          costToMoney = 0;
          addLog(`Your ${parent.gender === 'Male' ? 'father' : 'mother'} paid for your wedding at the ${venue.name}!`, 'success');
          if (Math.random() > 0.5) {
             const pIndex = newParents.findIndex(p => p.id === parent.id);
             newParents[pIndex] = { ...parent, relationship: Math.max(0, parent.relationship - randomInt(2, 6)) };
          }
        } else {
          addLog(`${parent.name} refused to pay for your wedding.`, 'warning');
          return;
        }
      } else if (player.inGroupHome) {
        parentsPaid = true;
        costToMoney = 0;
        addLog(`The state paid for your wedding at the ${venue.name} since you are in a group home.`, 'success');
      } else if (player.guardianName) {
        if (Math.random() < 0.4) { // Lower chance for wedding
          parentsPaid = true;
          costToMoney = 0;
          addLog(`Your guardian (${player.guardianName}) paid for your wedding at the ${venue.name}!`, 'success');
        } else {
          addLog(`Your guardian (${player.guardianName}) refused to pay for your wedding.`, 'warning');
          return;
        }
      } else {
        addLog(`You don't have any living parents to ask for money.`, 'error');
        return;
      }
    }

    if (!parentsPaid && player.money < venue.cost) {
      addLog(`You cannot afford the ${venue.name} venue. It costs $${venue.cost.toLocaleString()}.`, 'error');
      return;
    }

    const newPlayer = {
      ...player,
      money: player.money - costToMoney,
      partner: { ...player.partner, type: 'married' as const, relationship: Math.min(100, player.partner.relationship + 30) },
      happiness: Math.min(100, player.happiness + 20),
      parents: newParents
    };
    setPlayer(newPlayer);
    setShowWeddingModal(false);
    addLog(`You married ${player.partner.name} at the ${venue.name}! It was a beautiful ceremony.${getStatChangesString(player, newPlayer)}`, 'success');
  };
  const hintProposal = () => {
    if (!player || !player.isAlive || !player.partner) return;
    if (player.partner.type !== 'dating') return;

    if (player.partner.relationship > 80 && Math.random() > 0.4) {
      const newPlayer = {
        ...player,
        partner: { ...player.partner, type: 'engaged' as const, relationship: Math.min(100, player.partner.relationship + 20) }
      };
      setPlayer(newPlayer);
      addLog(`You dropped a hint, and ${player.partner.name} proposed to you! You are now engaged!${getStatChangesString(player, newPlayer)}`, 'success');
    } else {
      const newPlayer = {
        ...player,
        partner: { ...player.partner, relationship: Math.max(0, player.partner.relationship - 5) }
      };
      setPlayer(newPlayer);
      addLog(`You hinted at marriage, but ${player.partner.name} changed the subject.${getStatChangesString(player, newPlayer)}`, 'warning');
    }
  };


  const breakUp = () => {
    if (!player || !player.isAlive || !player.partner) return;
    const newPlayer = {
      ...player,
      partner: undefined,
      happiness: Math.max(0, player.happiness - 20)
    };
    setPlayer(newPlayer);
    addLog(`You broke up with ${player.partner.name}.${getStatChangesString(player, newPlayer)}`, 'info');
  };

  const handleSocialAction = (personId: string, personType: string, action: string) => {
    if (!player || !player.isAlive) return;

    let targetName = '';
    let relationshipChange = 0;
    let moneyChange = 0;
    let happinessChange = 0;
    let logMessage = '';
    let cost = 0;
    
    switch (action) {
      case 'spend_time':
        relationshipChange = randomInt(3, 8);
        happinessChange = 2;
        logMessage = `You spent time with {name}.`;
        break;
      case 'conversation':
        relationshipChange = randomInt(2, 5);
        logMessage = `You had a nice conversation with {name}.`;
        break;
      case 'compliment':
        relationshipChange = randomInt(4, 10);
        logMessage = `You complimented {name}. They smiled.`;
        break;
      case 'insult':
        relationshipChange = -randomInt(10, 25);
        happinessChange = -5;
        logMessage = `You insulted {name}. They were very hurt.`;
        break;
      case 'gift':
        cost = 50;
        relationshipChange = randomInt(10, 20);
        happinessChange = 5;
        logMessage = `You gave {name} a nice gift. They loved it!`;
        break;
      case 'ask_money':
        if (Math.random() > 0.5) {
          const amount = randomInt(20, 100);
          moneyChange = amount;
          relationshipChange = -randomInt(2, 5);
          logMessage = `You asked {name} for money and they gave you $${amount}.`;
        } else {
          relationshipChange = -randomInt(5, 15);
          logMessage = `You asked {name} for money but they refused.`;
        }
        break;
      case 'argue':
        relationshipChange = -randomInt(15, 30);
        happinessChange = -10;
        logMessage = `You got into a heated argument with {name}.`;
        break;
      case 'apologize':
        relationshipChange = randomInt(5, 15);
        logMessage = `You apologized to {name}. They appreciated it.`;
        break;
      case 'movies':
        cost = 30;
        relationshipChange = randomInt(8, 15);
        happinessChange = 8;
        logMessage = `You took {name} to the movies. You both had a great time.`;
        break;
      case 'eat_out':
        cost = 40;
        relationshipChange = randomInt(10, 18);
        happinessChange = 10;
        logMessage = `You took {name} out to a nice restaurant.`;
        break;
      case 'ask_out':
        if (player.partner) {
          addLog(`You are already ${player.partner.type === 'married' ? 'married to' : 'dating'} ${player.partner.name}.`, 'warning');
          return;
        }
        // We need to know the coworker's relationship to determine success
        const coworker = player.coworkers?.find(c => c.id === personId);
        if (!coworker) return;
        
        targetName = coworker.name;
        if (coworker.relationship > 60 && Math.random() > 0.3) {
          // Success
          const newPartner = {
            type: 'dating' as const,
            name: coworker.name,
            age: coworker.age,
            relationship: coworker.relationship,
            gender: coworker.gender
          };
          setPlayer({
            ...player,
            partner: newPartner
          });
          addLog(`You asked out ${coworker.name} and they said yes! You are now dating.`, 'success');
          return;
        } else {
          // Failure
          relationshipChange = -20;
          happinessChange = -15;
          logMessage = `You asked out ${coworker.name} but they rejected you. It's going to be awkward at work...`;
        }
        break;
      case 'hookup':
        const person = personType === 'coworker' 
          ? player.coworkers?.find(c => c.id === personId)
          : player.friends?.find(f => f.id === personId);
        if (!person) return;
        targetName = person.name;
        
        if (person.relationship > 60 && Math.random() > 0.3) {
          let newPlayer = { ...player };
          newPlayer.happiness = Math.min(100, newPlayer.happiness + 15);
          let msg = `You hooked up with ${person.name}!`;
          
          if (Math.random() < 0.05) {
            newPlayer.health = Math.max(0, newPlayer.health - 20);
            newPlayer.happiness = Math.max(0, newPlayer.happiness - 30);
            msg += ` You caught an STD!`;
          }
          
          if (Math.random() < 0.05) {
            const kidGender = Math.random() > 0.5 ? 'Male' : 'Female';
            const { first: kidName } = getRandomName(player.country, kidGender);
            newPlayer.kids = [...(newPlayer.kids || []), {
              id: Math.random().toString(),
              name: kidName,
              age: 0,
              relationship: 50,
              gender: kidGender
            }];
            msg += ` Wait... an unexpected pregnancy occurred! You now have a child named ${kidName}.`;
          }
          
          // Update relationship
          if (personType === 'coworker') {
            newPlayer.coworkers = newPlayer.coworkers?.map(c => c.id === personId ? { ...c, relationship: Math.min(100, c.relationship + 10) } : c);
          } else {
            newPlayer.friends = newPlayer.friends?.map(f => f.id === personId ? { ...f, relationship: Math.min(100, f.relationship + 10) } : f);
          }
          
          setPlayer(newPlayer);
          addLog(msg, 'info');
          return;
        } else {
          relationshipChange = -30;
          happinessChange = -10;
          logMessage = `You tried to hook up with ${person.name}, but they were offended.`;
        }
        break;
      default:
        return;
    }

    let newParents = player.parents ? [...player.parents] : [];
    if (cost > 0) {
      let paidByParents = false;
      if (askParentsToPay) {
        const aliveParents = newParents.filter(p => !p.isDead);
        if (aliveParents.length > 0) {
          const parent = aliveParents.reduce((prev, current) => (prev.relationship > current.relationship) ? prev : current);
          if (parent.relationship > 30) {
            paidByParents = true;
            logMessage += ` Your ${parent.gender === 'Male' ? 'father' : 'mother'} paid for it.`;
            if (Math.random() > 0.5) {
               const pIndex = newParents.findIndex(p => p.id === parent.id);
               newParents[pIndex] = { ...parent, relationship: Math.max(0, parent.relationship - randomInt(1, 4)) };
            }
          } else {
            addLog(`${parent.name} refused to pay for your activity.`, 'warning');
            return;
          }
        } else if (player.inGroupHome) {
          paidByParents = true;
          logMessage += ` The state paid for it since you are in a group home.`;
        } else if (player.guardianName) {
          if (Math.random() < 0.6) {
            paidByParents = true;
            logMessage += ` Your guardian (${player.guardianName}) paid for it.`;
          } else {
            addLog(`Your guardian (${player.guardianName}) refused to pay for your activity.`, 'warning');
            return;
          }
        } else {
          addLog(`You don't have any living parents to ask for money.`, 'error');
          return;
        }
      }

      if (!paidByParents) {
        if (player.money < cost) {
          addLog(`You don't have enough money.`, 'error');
          return;
        }
        moneyChange -= cost;
      }
    }

    let newPlayer = { ...player };
    newPlayer.money += moneyChange;
    newPlayer.happiness = Math.min(100, Math.max(0, newPlayer.happiness + happinessChange));
    newPlayer.parents = newParents;

    const updateRelationship = (currentRel: number) => Math.min(100, Math.max(0, currentRel + relationshipChange));

    if (personType === 'partner' && newPlayer.partner) {
      targetName = newPlayer.partner.name;
      newPlayer.partner.relationship = updateRelationship(newPlayer.partner.relationship);
    } else if (personType === 'parent') {
      newPlayer.parents = newPlayer.parents.map(p => {
        if (p.id === personId) { targetName = p.name; return { ...p, relationship: updateRelationship(p.relationship) }; }
        return p;
      });
    } else if (personType === 'sibling') {
      newPlayer.siblings = newPlayer.siblings.map(p => {
        if (p.id === personId) { targetName = p.name; return { ...p, relationship: updateRelationship(p.relationship) }; }
        return p;
      });
    } else if (personType === 'grandparent') {
      newPlayer.grandparents = newPlayer.grandparents.map(p => {
        if (p.id === personId) { targetName = p.name; return { ...p, relationship: updateRelationship(p.relationship) }; }
        return p;
      });
    } else if (personType === 'coworker') {
      newPlayer.coworkers = newPlayer.coworkers?.map(p => {
        if (p.id === personId) { targetName = p.name; return { ...p, relationship: updateRelationship(p.relationship) }; }
        return p;
      });
    } else if (personType === 'auntUncle') {
      newPlayer.auntsAndUncles = newPlayer.auntsAndUncles.map(p => {
        if (p.id === personId) { targetName = p.name; return { ...p, relationship: updateRelationship(p.relationship) }; }
        return p;
      });
    } else if (personType === 'cousin') {
      newPlayer.cousins = newPlayer.cousins.map(p => {
        if (p.id === personId) { targetName = p.name; return { ...p, relationship: updateRelationship(p.relationship) }; }
        return p;
      });
    } else if (personType === 'kid') {
      newPlayer.kids = newPlayer.kids.map(p => {
        if (p.id === personId) { targetName = p.name; return { ...p, relationship: updateRelationship(p.relationship) }; }
        return p;
      });
    } else if (personType === 'friend') {
      newPlayer.friends = (newPlayer.friends || []).map(p => {
        if (p.id === personId) { targetName = p.name; return { ...p, relationship: updateRelationship(p.relationship) }; }
        return p;
      });
    }

    if (!targetName) return;

    setPlayer(newPlayer);
    addLog(`${logMessage.replace('{name}', targetName)}${getStatChangesString(player, newPlayer)}`, relationshipChange >= 0 ? 'info' : 'warning');
  };

  const SocialDropdown = ({ personId, personType, isDead }: { personId: string, personType: string, isDead?: boolean }) => (
    <select
      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg transition-colors disabled:opacity-50 outline-none cursor-pointer flex-1"
      onChange={(e) => {
        if (e.target.value) {
          handleSocialAction(personId, personType, e.target.value);
          e.target.value = "";
        }
      }}
      defaultValue=""
      disabled={!player?.isAlive || isDead}
    >
      <option value="" disabled>Interact...</option>
      <option value="spend_time">Spend Time</option>
      <option value="conversation">Have a Conversation</option>
      <option value="compliment">Give a Compliment</option>
      <option value="insult">Insult</option>
      <option value="gift">Give a Gift ($50)</option>
      <option value="ask_money">Ask for Money</option>
      <option value="argue">Argue</option>
      <option value="apologize">Apologize</option>
      <option value="movies">Go to the Movies ($30)</option>
      <option value="eat_out">Go out to Eat ($40)</option>
      {personType === 'coworker' && <option value="ask_out">Ask Out</option>}
      {(personType === 'friend' || personType === 'coworker') && player?.age && player.age >= 18 && <option value="hookup">Hookup</option>}
    </select>
  );

  const socializeWithPartner = () => {
    if (!player || !player.isAlive || !player.partner) return;
    const newPlayer = {
      ...player,
      partner: { ...player.partner, relationship: Math.min(100, player.partner.relationship + randomInt(5, 15)) },
      happiness: Math.min(100, player.happiness + 5)
    };
    setPlayer(newPlayer);
    addLog(`You spent time with ${player.partner.name}.${getStatChangesString(player, newPlayer)}`, 'info');
  };

  const socializeWithKid = (id: string) => {
    if (!player || !player.isAlive) return;
    const kid = player.kids.find(k => k.id === id);
    if (!kid) return;
    const newPlayer = {
      ...player,
      kids: player.kids.map(k => k.id === id ? { ...k, relationship: Math.min(100, k.relationship + randomInt(5, 15)) } : k),
      happiness: Math.min(100, player.happiness + 5)
    };
    setPlayer(newPlayer);
    addLog(`You spent time with your child ${kid.name}.${getStatChangesString(player, newPlayer)}`, 'info');
  };

  const getWillRecipients = (p: Player): { id: string; name: string; role: string }[] => {
    const recipients: { id: string; name: string; role: string }[] = [];
    if (p.partner) {
      recipients.push({ id: 'partner', name: p.partner.name, role: p.partner.type === 'married' ? 'Spouse' : p.partner.type === 'engaged' ? 'Fiancé(e)' : 'Partner' });
    }
    p.kids?.forEach(kid => recipients.push({ id: kid.id, name: kid.name, role: 'Child' }));
    p.siblings?.filter(s => !s.isDead).forEach(s => recipients.push({ id: s.id, name: s.name, role: s.gender === 'Male' ? 'Brother' : 'Sister' }));
    p.parents?.filter(par => !par.isDead).forEach(par => recipients.push({ id: par.id, name: par.name, role: par.gender === 'Male' ? 'Father' : 'Mother' }));
    p.grandparents?.filter(gp => !gp.isDead).forEach(gp => recipients.push({ id: gp.id, name: gp.name, role: gp.gender === 'Male' ? 'Grandfather' : 'Grandmother' }));
    p.auntsAndUncles?.filter(au => !au.isDead).forEach(au => recipients.push({ id: au.id, name: au.name, role: au.gender === 'Male' ? 'Uncle' : 'Aunt' }));
    p.cousins?.filter(c => !c.isDead).forEach(c => recipients.push({ id: c.id, name: c.name, role: 'Cousin' }));
    p.friends?.forEach(f => recipients.push({ id: f.id, name: f.name, role: 'Friend' }));
    return recipients;
  };

  const updateWill = (type: 'even' | 'single' | 'custom', recipientId?: string) => {
    if (!player || !player.isAlive) return;
    
    let newWill: Will = { type, recipientId };
    
    if (type === 'custom') {
      const allRecipients = getWillRecipients(player);
      const recipientIds = allRecipients.map(r => r.id);
      
      // Keep existing splits for recipients that still exist, add new ones at 0
      const existingSplit = player.will?.customSplit || {};
      const customSplit: Record<string, number> = {};
      const hasExisting = Object.keys(existingSplit).length > 0;
      
      if (hasExisting) {
        recipientIds.forEach(id => { customSplit[id] = existingSplit[id] || 0; });
      } else {
        const count = recipientIds.length;
        const split = count > 0 ? Math.floor(100 / count) : 0;
        const remainder = count > 0 ? 100 % count : 0;
        recipientIds.forEach((id, index) => { customSplit[id] = split + (index === 0 ? remainder : 0); });
      }
      
      newWill = {
        type: 'custom',
        customSplit,
        assetDistribution: player.will?.assetDistribution || {}
      };
    }

    setPlayer({
      ...player,
      will: newWill
    });
    addLog('You updated your will.', 'info');
  };

  const getStatChangesString = (oldPlayer: Player, newPlayer: Partial<Player>) => {
    const changes: string[] = [];
    if (newPlayer.happiness !== undefined) {
      const diff = Math.round(newPlayer.happiness - oldPlayer.happiness);
      if (diff !== 0) changes.push(`Happiness ${diff > 0 ? '+' : ''}${diff}`);
    }
    if (newPlayer.health !== undefined) {
      const diff = Math.round(newPlayer.health - oldPlayer.health);
      if (diff !== 0) changes.push(`Health ${diff > 0 ? '+' : ''}${diff}`);
    }
    if (newPlayer.smarts !== undefined) {
      const diff = Math.round(newPlayer.smarts - oldPlayer.smarts);
      if (diff !== 0) changes.push(`Smarts ${diff > 0 ? '+' : ''}${diff}`);
    }
    if (newPlayer.looks !== undefined) {
      const diff = Math.round(newPlayer.looks - oldPlayer.looks);
      if (diff !== 0) changes.push(`Looks ${diff > 0 ? '+' : ''}${diff}`);
    }
    if (newPlayer.money !== undefined) {
      const diff = Math.round(newPlayer.money - oldPlayer.money);
      if (diff !== 0) changes.push(`Money ${diff > 0 ? '+$' : '-$'}${Math.abs(diff).toLocaleString()}`);
    }
    if (newPlayer.debt !== undefined) {
      const diff = Math.round(newPlayer.debt - (oldPlayer.debt || 0));
      if (diff !== 0) changes.push(`Debt ${diff > 0 ? '+$' : '-$'}${Math.abs(diff).toLocaleString()}`);
    }
    if (newPlayer.karma !== undefined) {
      const diff = Math.round(newPlayer.karma - (oldPlayer.karma || 50));
      if (diff !== 0) changes.push(`Karma ${diff > 0 ? '+' : ''}${diff}`);
    }
    if (newPlayer.fame !== undefined) {
      const diff = Math.round(newPlayer.fame - (oldPlayer.fame || 0));
      if (diff !== 0) changes.push(`Fame ${diff > 0 ? '+' : ''}${diff}`);
    }
    if ((newPlayer as any).stress !== undefined) {
      const diff = Math.round((newPlayer as any).stress - (oldPlayer.stress || 0));
      if (diff !== 0) changes.push(`Stress ${diff > 0 ? '+' : ''}${diff}`);
    }
    return changes.length > 0 ? ` (${changes.join(', ')})` : '';
  };

  const performActivity = (activity: import('./types').Activity) => {
    if (!player || !player.isAlive) return;

    if (player.inPrison) {
      addLog(`You cannot do that while in prison!`, 'error');
      return;
    }

    let costToMoney = activity.cost;
    let costToDebt = 0;
    let parentsPaid = false;

    if (askParentsToPay && activity.cost > 0) {
      const hasLivingParents = player.parents && player.parents.some(p => !p.isDead);
      if (hasLivingParents) {
        const aliveParents = player.parents!.filter(p => !p.isDead);
        const parent = aliveParents.reduce((prev, current) => (prev.relationship > current.relationship) ? prev : current);
        if (parent.relationship > 30) {
          parentsPaid = true;
          costToMoney = 0;
          costToDebt = 0;
          addLog(`Your ${parent.gender === 'Male' ? 'father' : 'mother'} paid for your ${activity.name.toLowerCase()}.`, 'success');
          if (Math.random() > 0.5) {
             const newParents = [...player.parents!];
             const pIndex = newParents.findIndex(p => p.id === parent.id);
             newParents[pIndex] = { ...parent, relationship: Math.max(0, parent.relationship - randomInt(1, 4)) };
             setPlayer(prev => prev ? { ...prev, parents: newParents } : prev);
          }
        } else {
          addLog(`${parent.name} refused to pay for your ${activity.name.toLowerCase()}.`, 'warning');
          return;
        }
      } else if (player.inGroupHome) {
        parentsPaid = true;
        costToMoney = 0;
        costToDebt = 0;
        addLog(`The state paid for your ${activity.name.toLowerCase()} since you are in a group home.`, 'success');
      } else if (player.guardianName) {
        if (Math.random() < 0.6) {
          parentsPaid = true;
          costToMoney = 0;
          costToDebt = 0;
          addLog(`Your guardian (${player.guardianName}) paid for your ${activity.name.toLowerCase()}.`, 'success');
        } else {
          addLog(`Your guardian (${player.guardianName}) refused to pay for your ${activity.name.toLowerCase()}.`, 'warning');
          return;
        }
      }
    }

    if (!parentsPaid && player.age < 18 && (activity.id === 'doctor' || activity.id === 'er' || activity.id === 'therapy')) {
      const hasLivingParents = player.parents && player.parents.length > 0;
      if (hasLivingParents) {
        const avgRelationship = player.parents.reduce((sum, p) => sum + p.relationship, 0) / player.parents.length;
        // 50% base chance + up to 50% from relationship
        const chance = 0.5 + (avgRelationship / 200); 
        if (Math.random() < chance) {
          parentsPaid = true;
          costToMoney = 0;
          costToDebt = 0;
          addLog(`Your parents paid for your ${activity.name.toLowerCase()}.`, 'success');
        } else {
          addLog(`Your parents refused to pay for your ${activity.name.toLowerCase()}.`, 'warning');
        }
      } else {
        // No parents - check if in group home or with a relative
        if (player.inGroupHome) {
          // Group home / state pays for it
          parentsPaid = true;
          costToMoney = 0;
          costToDebt = 0;
          addLog(`The state paid for your ${activity.name.toLowerCase()} since you are in a group home.`, 'success');
        } else if (player.guardianName) {
          // Relative pays for it
          // 60% base chance
          const chance = 0.6;
          if (Math.random() < chance) {
            parentsPaid = true;
            costToMoney = 0;
            costToDebt = 0;
            addLog(`Your guardian (${player.guardianName}) paid for your ${activity.name.toLowerCase()}.`, 'success');
          } else {
            addLog(`Your guardian (${player.guardianName}) refused to pay for your ${activity.name.toLowerCase()}.`, 'warning');
          }
        }
      }
    }

    if (!parentsPaid && player.money < activity.cost) {
      if (activity.id === 'doctor' || activity.id === 'er' || activity.id === 'therapy') {
        costToMoney = player.money > 0 ? player.money : 0;
        costToDebt = activity.cost - costToMoney;
      } else {
        addLog(`You cannot afford to ${activity.name.toLowerCase()}. It costs $${activity.cost.toLocaleString()}.`, 'error');
        return;
      }
    }

    if (activity.limitPerYear) {
      const count = activityCounts[activity.id] || 0;
      if (count >= activity.limitPerYear) {
        addLog(`You have already done ${activity.name.toLowerCase()} enough times this year.`, 'warning');
        return;
      }
      setActivityCounts({ ...activityCounts, [activity.id]: count + 1 });
    }

    const effect = activity.effect(player);
    
    if (effect && effect.inPrison) {
      const prisonYears = effect.prisonYearsLeft || 1;
      const newPlayerState = { 
        ...effect, 
        money: player.money - costToMoney, 
        debt: (player.debt || 0) + costToDebt,
      };
      const statChanges = getStatChangesString(player, newPlayerState);
      
      setPlayer(prev => prev ? { 
        ...prev, 
        ...newPlayerState,
        inPrison: true,
        prisonYearsLeft: prisonYears,
        job: null,
        yearsInJob: 0
      } : null);
      
      const messageText = typeof activity.message === 'function' ? activity.message(player, effect) : activity.message;
      addLog(`${messageText}${statChanges}`, 'error');
    } else {
      const newPlayerState = { 
        ...effect, 
        money: player.money - costToMoney,
        debt: (player.debt || 0) + costToDebt,
      };
      const statChanges = getStatChangesString(player, newPlayerState);

      setPlayer(prev => prev ? { 
        ...prev, 
        ...newPlayerState
      } : null);
      
      const messageText = typeof activity.message === 'function' ? activity.message(player, effect) : activity.message;
      
      if (costToDebt > 0) {
        addLog(`${messageText} $${costToDebt.toLocaleString()} was added to your debt.${statChanges}`, 'warning');
      } else {
        addLog(`${messageText}${statChanges}`, 'success');
      }

      if (effect && effect.illnesses && effect.illnesses.length < player.illnesses.length) {
        const cured = player.illnesses.find(i => !effect.illnesses!.includes(i));
        if (cured) {
          addLog(`You were cured of ${cured}!`, 'success');
        }
      }
    }
  };

  const handleScenarioOption = (option: import('./types').ScenarioOption) => {
    if (!player || !player.isAlive) return;
    const effect = option.effect(player);
    const statChanges = effect ? getStatChangesString(player, effect) : '';
    const messageText = typeof option.message === 'function' ? option.message(player, effect) : option.message;
    setPlayer(prev => prev ? { ...prev, ...effect } : null);
    addLog(`${messageText}${statChanges}`, 'info');
    setCurrentScenario(null);
  };

  const continueAsChild = (kidId: string) => {
    if (!player) return;
    const kid = player.kids.find(k => k.id === kidId);
    if (!kid) return;

    // Calculate inheritance — includes all assets (properties, cars, boats, planes, crypto, lifestyle) and businesses
    let inheritanceMoney = 0;
    let inheritedAssets: typeof player.assets = [];
    let inheritedBusinesses: typeof player.businesses = [];
    
    // Cash + business value (minus asset values which are handled separately)
    let liquidWealth = player.money - player.debt;
    
    // Calculate total business value
    let businessValue = 0;
    player.businesses.forEach(b => {
      let val = b.basePrice;
      if (b.mortgage && b.mortgage.monthsLeft > 0) val -= b.mortgage.principal;
      businessValue += val;
    });
    
    if (player.will?.type === 'custom') {
      // Assigned assets go directly to recipients
      player.assets.forEach(asset => {
        if (player.will?.assetDistribution?.[asset.id] === kidId) {
          inheritedAssets.push(asset);
        }
      });
      
      // Assigned businesses go directly to recipients
      player.businesses.forEach(biz => {
        if (player.will?.assetDistribution?.[biz.id] === kidId) {
          inheritedBusinesses.push(biz);
        }
      });
      
      // Unassigned assets: distribute proportionally based on percentage shares
      const unassignedAssets = player.assets.filter(a => !player.will?.assetDistribution?.[a.id]);
      const unassignedBizzes = player.businesses.filter(b => !player.will?.assetDistribution?.[b.id]);
      const kidPercentage = player.will.customSplit?.[kidId] || 0;
      
      if (kidPercentage > 0 && unassignedAssets.length > 0) {
        // Sort by value descending and distribute proportionally
        const sortedAssets = [...unassignedAssets].sort((a, b) => b.value - a.value);
        const totalUnassignedValue = sortedAssets.reduce((s, a) => s + a.value, 0);
        let kidShare = 0;
        const kidTargetValue = totalUnassignedValue * (kidPercentage / 100);
        for (const asset of sortedAssets) {
          if (kidShare + asset.value <= kidTargetValue * 1.2) {
            inheritedAssets.push(asset);
            kidShare += asset.value;
          }
        }
      }
      
      if (kidPercentage > 0 && unassignedBizzes.length > 0) {
        const sortedBizzes = [...unassignedBizzes];
        const totalBizCount = sortedBizzes.length;
        const kidBizCount = Math.max(1, Math.round(totalBizCount * (kidPercentage / 100)));
        for (let i = 0; i < kidBizCount && i < sortedBizzes.length; i++) {
          inheritedBusinesses.push(sortedBizzes[i]);
        }
      }
      
      // Money: only liquid cash distributed by percentage (not asset values)
      if (liquidWealth > 0) {
        inheritanceMoney = Math.floor(liquidWealth * (kidPercentage / 100));
      }
    } else if (player.will?.type === 'single') {
      if (player.will.recipientId === kidId) {
        inheritedAssets = [...player.assets];
        inheritedBusinesses = [...player.businesses];
        inheritanceMoney = Math.max(0, liquidWealth);
      }
    } else {
      // Even split: distribute ALL assets and businesses round-robin, plus even money
      const totalCash = Math.max(0, liquidWealth);
      inheritanceMoney = Math.floor(totalCash / player.kids.length);
      const kidIndex = player.kids.findIndex(k => k.id === kidId);
      player.assets.forEach((asset, i) => {
        if (i % player.kids.length === kidIndex) inheritedAssets.push(asset);
      });
      player.businesses.forEach((biz, i) => {
        if (i % player.kids.length === kidIndex) inheritedBusinesses.push(biz);
      });
    }

    const traits = ['Lucky', 'Lazy', 'Genius', 'Aggressive', 'Charismatic', 'Normal'] as const;
    const randomTrait = traits[Math.floor(Math.random() * traits.length)];

    const allAssets = [...(kid.assets || []), ...inheritedAssets];

    const currentLineageEntry: LineageEntry = {
      id: Math.random().toString(),
      name: `${player.firstName} ${player.lastName}`,
      ageAtDeath: player.age,
      netWorth: calculateNetWorth(player),
      yearDied: new Date().getFullYear() + player.age,
      finalJob: player.job ? player.job.title : 'Unemployed'
    };

    const newLineage = [...(player.lineage || []), currentLineageEntry];

    const newPlayer: Player = {
      lineage: newLineage,
      firstName: kid.name,
      lastName: player.lastName,
      country: player.country,
      age: kid.age,
      health: randomInt(80, 100),
      smarts: randomInt(20, 100),
      happiness: randomInt(60, 100),
      looks: randomInt(20, 100),
      money: inheritanceMoney,
      debt: 0,
      education: kid.age >= 18 ? 'High School' : (kid.age >= 14 ? 'Middle School' : (kid.age >= 11 ? 'Elementary School' : 'None')),
      degrees: kid.age >= 18 ? ['High School'] : [],
      job: null,
      yearsInJob: 0,
      isAlive: true,
      businesses: inheritedBusinesses,
      assets: allAssets,
      kids: [],
      parents: [
        {
          id: Math.random().toString(),
          name: player.firstName,
          age: player.age,
          relationship: 100,
          gender: MALE_NAMES.includes(player.firstName) ? 'Male' : 'Female',
          isDead: true
        },
        ...(player.partner ? [{
          id: Math.random().toString(),
          name: player.partner.name,
          age: player.partner.age,
          relationship: randomInt(50, 100),
          gender: Math.random() > 0.5 ? 'Male' as const : 'Female' as const
        }] : [])
      ],
      grandparents: (player.parents || []).map(p => ({
        id: p.id,
        name: p.name,
        age: p.age,
        relationship: randomInt(30, 100),
        gender: p.gender
      })),
      auntsAndUncles: player.siblings.map(s => ({
        id: s.id,
        name: s.name,
        age: s.age,
        relationship: randomInt(20, 80),
        gender: s.gender
      })),
      cousins: Array.from({ length: randomInt(0, 5) }).map(() => {
        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        return {
          id: Math.random().toString(),
          name: gender === 'Male' ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)],
          age: randomInt(1, kid.age + 10),
          relationship: randomInt(20, 80),
          gender
        };
      }),
      siblings: player.kids.filter(k => k.id !== kidId).map(k => ({
        id: k.id,
        name: k.name,
        age: k.age,
        relationship: randomInt(30, 100),
        gender: k.gender
      })),
      friends: [],
      will: { type: 'even' },
      lifestyleTier: 'modest',
      trait: randomTrait,
      skills: {
        intelligence: kid.age * 2,
        fitness: kid.age * 2,
        social: kid.age * 2,
        creativity: kid.age * 2,
        driving: kid.age >= 16 ? 50 : 0,
        leadership: kid.age
      },
      languages: getStartingLanguages(player.country),
      illnesses: [],
      karma: 50,
      fame: 0,
      followers: 0,
      performance: 50,
      popularity: 20
    };

    setPlayer(newPlayer);
    const inheritSummary = [
      inheritanceMoney > 0 ? `$${inheritanceMoney.toLocaleString()}` : null,
      inheritedAssets.length > 0 ? `${inheritedAssets.length} asset${inheritedAssets.length > 1 ? 's' : ''}` : null,
      inheritedBusinesses.length > 0 ? `${inheritedBusinesses.length} business${inheritedBusinesses.length > 1 ? 'es' : ''}` : null,
    ].filter(Boolean).join(', ');
    setLogs([{ id: Math.random().toString(), year: new Date().getFullYear(), age: kid.age, message: `You are ${kid.name} ${player.lastName}. You inherited ${inheritSummary || 'nothing'} from your parent.`, type: 'info' }]);
    setActiveTab('activities');
    setReformsThisYear(0);
  };

  if (!isPlaying) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
          {/* === MAIN MENU === */}
          {menuScreen === 'menu' && (
            <>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Life Simulator</h1>
                <p className="text-zinc-400">Live your story</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setMenuScreen('newChoice')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-4 py-4 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <Plus className="w-5 h-5" />
                  New Life
                </button>
                <button
                  onClick={() => { setSaveSlotsState(getSaveSlots()); setMenuScreen('saves'); }}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl px-4 py-4 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <Save className="w-5 h-5" />
                  Load Save
                  {saveSlots.length > 0 && (
                    <span className="ml-2 text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">{saveSlots.length}</span>
                  )}
                </button>
              </div>

              {/* Update Log inline */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <ScrollText className="w-4 h-4 text-zinc-500" />
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Update Log</h3>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {[...GAME_UPDATES].sort((a, b) => b.number - a.number).map((update) => (
                    <div key={update.number} className="bg-zinc-800/60 border border-zinc-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-white">Update {update.number}: {update.title}</h4>
                        <span className="text-[10px] bg-indigo-600/20 text-indigo-400 px-1.5 py-0.5 rounded-full">v{update.version}</span>
                      </div>
                      <ul className="space-y-0.5">
                        {update.changes.map((change, i) => (
                          <li key={i} className="text-zinc-400 text-xs flex items-start gap-1.5">
                            <span className="text-indigo-500 mt-0.5">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* === NEW LIFE CHOICE SCREEN === */}
          {menuScreen === 'newChoice' && (
            <>
              <div className="flex items-center mb-6">
                <button onClick={() => setMenuScreen('menu')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors mr-3">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-white">New Life</h2>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => { randomizeCharacter(); }}
                  className="w-full bg-zinc-800 border border-zinc-700 hover:border-indigo-500 text-left rounded-xl p-5 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Random Life</h3>
                      <p className="text-zinc-400 text-sm">Get a random name and country — jump right in</p>
                    </div>
                  </div>
                  {firstName && (
                    <div className="mt-3 bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                      <p className="text-white font-medium">{firstName} {lastName}</p>
                      <p className="text-zinc-400 text-sm">{country}</p>
                      <div className="flex gap-2 mt-3">
                        <button type="button" onClick={(e) => { e.stopPropagation(); randomizeCharacter(); }}
                          className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors"
                        >
                          🎲 Re-roll
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); startGame(e as any); }}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors flex items-center justify-center gap-1"
                        >
                          <Play className="w-4 h-4" /> Start
                        </button>
                      </div>
                    </div>
                  )}
                </button>
                <button
                  onClick={() => { setFirstName(''); setLastName(''); setCountry(COUNTRIES[0]); setMenuScreen('new'); }}
                  className="w-full bg-zinc-800 border border-zinc-700 hover:border-indigo-500 text-left rounded-xl p-5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Custom Life</h3>
                      <p className="text-zinc-400 text-sm">Choose your own name and country</p>
                    </div>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* === CUSTOM CHARACTER SCREEN === */}
          {menuScreen === 'new' && (
            <>
              <div className="flex items-center mb-6">
                <button onClick={() => setMenuScreen('newChoice')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors mr-3">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-white">Create Character</h2>
              </div>
              <form onSubmit={startGame} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">First Name</label>
                  <input 
                    type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Last Name</label>
                  <input 
                    type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Country</label>
                  <select 
                    value={country} onChange={e => setCountry(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-4 py-4 transition-colors flex items-center justify-center gap-2 text-lg mt-6"
                >
                  <Play className="w-5 h-5" />
                  Start Life
                </button>
              </form>
            </>
          )}

          {/* === SAVES SCREEN === */}
          {menuScreen === 'saves' && (
            <>
              <div className="flex items-center mb-6">
                <button onClick={() => setMenuScreen('menu')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors mr-3">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-white">Saved Games</h2>
              </div>
              {saveSlots.length === 0 ? (
                <div className="text-center py-12">
                  <Save className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 text-lg">No saves yet</p>
                  <p className="text-zinc-600 text-sm mt-1">Start a new life and save your progress</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {saveSlots.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()).map(slot => (
                    <div key={slot.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-white text-lg">
                            {slot.isAutosave && <span className="text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded mr-2">Auto</span>}
                            {slot.name}
                          </h3>
                          <p className="text-zinc-400 text-sm">{slot.player.firstName} {slot.player.lastName} • Age {slot.player.age}</p>
                        </div>
                        {deleteConfirmId === slot.id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-rose-400 mr-1">Delete?</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteSaveSlot(slot.id); }}
                              className="p-1.5 bg-rose-500/20 rounded-lg text-rose-400 hover:bg-rose-500/30 transition-colors"
                              title="Confirm Delete"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                              className="p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(slot.id); }}
                            className="p-1.5 hover:bg-rose-500/20 rounded-lg text-zinc-600 hover:text-rose-400 transition-colors"
                            title="Delete Save"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                        <span>{slot.player.country}</span>
                        <span>•</span>
                        <span>${Math.abs(calculateNetWorth(slot.player)).toLocaleString()} net worth</span>
                        <span>•</span>
                        <span>{new Date(slot.savedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-rose-500 rounded-full" style={{ width: `${slot.player.health}%` }} /></div>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${slot.player.smarts}%` }} /></div>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${slot.player.happiness}%` }} /></div>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-pink-500 rounded-full" style={{ width: `${slot.player.looks}%` }} /></div>
                      </div>
                      <button
                        onClick={() => loadSaveSlot(slot)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-3 py-2 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Continue
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  if (!player) return null;

  const smartSuggestions = getSmartSuggestions();
  const bestAvailableJob = getBestAvailableJob();
  const compactStats = [
    { label: 'Cash', value: `$${player.money.toLocaleString()}`, icon: DollarSign, color: player.money < 500 ? 'text-amber-400' : 'text-emerald-400' },
    { label: 'Job', value: player.job?.title || 'Unemployed', icon: Briefcase, color: 'text-indigo-400' },
    { label: 'Smarts', value: `${player.smarts}%`, icon: Brain, color: 'text-blue-400' },
    { label: 'Mood', value: `${player.happiness}%`, icon: Smile, color: 'text-amber-400' },
    { label: 'Health', value: `${player.health}%`, icon: Heart, color: 'text-rose-400' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col md:flex-row relative">
      {/* Tutorial Overlay */}
      {showTutorial && isPlaying && player && (
        <Tutorial onComplete={completeTutorial} onTabChange={handleTutorialTabChange} onHighlightChange={handleTutorialHighlightChange} />
      )}
      {/* Left Sidebar - Stats & Info */}
      <div data-tutorial="stats-panel" className="w-full md:w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-2xl font-bold text-white">{player.firstName} {player.lastName}</h2>
            <div className="flex gap-2">
      <button data-tutorial="help-button" onClick={() => { setShowTutorial(true); }} className="p-2 bg-indigo-600/30 hover:bg-indigo-600/50 rounded-lg text-indigo-300 transition-colors" title="Replay Tutorial" style={showTutorial && tutorialHighlight === 'help-button' ? { boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.7)', zIndex: 100001, position: 'relative' as const } : undefined}>
                <span className="text-sm font-bold">?</span>
              </button>
              <button onClick={() => setShowFamilyTree(true)} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors" title="Family Tree">
                <Users className="w-4 h-4" />
              </button>
              <button onClick={() => setShowSaveModal(true)} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors" title="Save Game">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={exitGame} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors" title="Exit Game">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
            <span>{player.country}</span>
            <span>•</span>
            <span>Age {player.age}</span>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              {compactStats.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 min-w-0">
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${item.color}`} />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-600">{item.label}</div>
                      <div className="text-xs text-zinc-200 truncate">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {player.money < 500 && player.age >= 18 && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Low money warning: cash is under $500.</span>
              </div>
            )}
            <div className="flex flex-col gap-1 mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-300 text-sm">
                  <span className="text-zinc-500">Cash Balance:</span>
                  <span className={`font-medium ${player.money < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {player.money < 0 ? '-' : ''}${Math.abs(player.money).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-300 text-sm">
                  <span className="text-zinc-500">Net Worth:</span>
                  <span className={`font-medium ${calculateNetWorth(player) < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {calculateNetWorth(player) < 0 ? '-' : ''}${Math.abs(calculateNetWorth(player)).toLocaleString()}
                  </span>
                 </div>
               </div>
               {(() => {
                 const exp = calculateYearlyExpenses(player);
                 const totalOut = exp.totalLivingExpenses + exp.mortgagePayments + exp.loanPayments + exp.taxAmount;
                 const yearlyNet = exp.grossIncome - totalOut;
                 return (
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm">
                       <span className="text-zinc-500">Yearly Income:</span>
                       <span className={`font-medium ${yearlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                         {yearlyNet >= 0 ? '+' : ''}${yearlyNet.toLocaleString()}/yr
                       </span>
                       {exp.propertyIncome > 0 && <span className="text-xs text-zinc-600">(🏠${exp.propertyIncome.toLocaleString()})</span>}
                       {exp.businessIncome > 0 && <span className="text-xs text-zinc-600">(💼${exp.businessIncome.toLocaleString()})</span>}
                     </div>
                   </div>
                 );
               })()}
              {player.debt > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-400 text-sm">
                    <span className="text-rose-500">Debt:</span>
                    <span className="font-medium">-${player.debt.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={payOffDebt}
                    className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded text-xs transition-colors"
                  >
                    Pay Off
                  </button>
                </div>
              )}
            </div>
            {player.job && (
              <div className="flex items-center gap-2 text-indigo-400 text-sm">
                <Briefcase className="w-4 h-4" />
                <span>{player.job.title} (${player.job.salary.toLocaleString()}/yr) - {player.yearsInJob} yrs</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>{player.education}</span>
            </div>
            {player.currentStudy && (
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <Activity className="w-4 h-4" />
                <span>Studying {player.currentStudy.program} ({player.currentStudy.yearsLeft} yrs left)</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2 text-rose-400"><Heart className="w-4 h-4" /> Health</span>
              <span>{player.health}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${player.health}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2 text-blue-400"><Brain className="w-4 h-4" /> Smarts</span>
              <span>{player.smarts}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${player.smarts}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2 text-amber-400"><Smile className="w-4 h-4" /> Happiness</span>
              <span>{player.happiness}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${player.happiness}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2 text-rose-400"><Activity className="w-4 h-4" /> Stress</span>
              <span>{player.stress || 0}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${player.stress || 0}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2 text-purple-400"><User className="w-4 h-4" /> Looks</span>
              <span>{player.looks}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${player.looks}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2 text-indigo-400"><Activity className="w-4 h-4" /> Karma</span>
              <span>{player.karma}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${player.karma}%` }} />
            </div>
          </div>
          {player.job?.category === 'Politics' && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2 text-pink-400"><Activity className="w-4 h-4" /> Popularity</span>
                <span>{player.popularity}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${player.popularity}%` }} />
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-zinc-800">
            <div className="text-sm text-zinc-400 mb-2">Trait: <span className="text-zinc-200 font-medium">{player.trait}</span></div>
            <div className="text-sm text-zinc-400 mb-2">Fame: <span className="text-zinc-200 font-medium">{player.fame}%</span></div>
            <div className="text-sm text-zinc-400 mb-2">Followers: <span className="text-zinc-200 font-medium">{player.followers.toLocaleString()}</span></div>
            {player.illnesses.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-2">Conditions</div>
                <div className="flex flex-wrap gap-2">
                  {player.illnesses.map(illness => (
                    <span key={illness} className="px-2 py-1 bg-rose-500/10 text-rose-400 text-xs rounded-md">{illness}</span>
                  ))}
                </div>
              </div>
            )}
            {player.languages && player.languages.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold text-teal-500 uppercase tracking-wider mb-2">Languages</div>
                <div className="flex flex-wrap gap-2">
                  {player.languages.map(lang => (
                    <span key={lang.id} className={`px-2 py-1 text-xs rounded-md ${lang.isNative ? 'bg-teal-500/10 text-teal-400' : lang.proficiency >= 50 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {lang.name} {lang.isNative ? '' : `${lang.proficiency}%`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div data-tutorial="age-button" className="p-6 border-t border-zinc-800">
          <button 
            onClick={progressYear}
            disabled={!player.isAlive || currentScenario !== null}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xl rounded-2xl py-4 transition-colors shadow-lg shadow-emerald-900/20"
          >
            + Year
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Logs Area */}
        <div data-tutorial="logs-area" className="flex-1 overflow-y-auto p-6 space-y-4">
          {logs.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-zinc-300">
                <ScrollText className="w-4 h-4 text-indigo-400" />
                Activity Log
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {logs.slice(-4).reverse().map(log => (
                  <div key={`summary-${log.id}`} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className={`mt-1 h-2 w-2 rounded-full ${
                      log.type === 'error' ? 'bg-rose-400' :
                      log.type === 'success' ? 'bg-emerald-400' :
                      log.type === 'warning' ? 'bg-amber-400' :
                      'bg-zinc-500'
                    }`} />
                    <span className="line-clamp-2">Age {log.age}: {log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 items-start">
              <div className="w-12 text-zinc-500 text-sm font-mono pt-1">
                {log.age} yrs
              </div>
              <div className={`flex-1 p-3 rounded-xl border ${
                log.type === 'error' ? 'bg-rose-950/30 border-rose-900/50 text-rose-200' :
                log.type === 'success' ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-200' :
                log.type === 'warning' ? 'bg-amber-950/30 border-amber-900/50 text-amber-200' :
                'bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}>
                {log.message}
              </div>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>

        {/* Action Menu */}
        <div data-tutorial="tab-panel" className="h-72 bg-zinc-900 border-t border-zinc-800 flex flex-col">
          <div className="flex border-b border-zinc-800 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('activities')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'activities' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Activities
            </button>
            <button 
              onClick={() => setActiveTab('education')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'education' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Education
            </button>
            <button 
              onClick={() => setActiveTab('occupation')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'occupation' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Occupation
            </button>
            <button 
              onClick={() => setActiveTab('assets')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'assets' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Assets & Business
            </button>
            <button 
              onClick={() => setActiveTab('finance')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'finance' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Finance
            </button>
            <button 
              onClick={() => setActiveTab('family')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'family' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Family & Relationships
            </button>
            <button 
              onClick={() => setActiveTab('familytree')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'familytree' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Family Tree
            </button>
            <button 
              onClick={() => setActiveTab('lifestyle')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'lifestyle' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Lifestyle
            </button>
            <button 
              onClick={() => setActiveTab('crime')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'crime' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Crime
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'activities' && (
              <div className="space-y-4">
                {/* Smart Suggestions */}
                {smartSuggestions.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {smartSuggestions.map((s, i) => (
                      <button key={i} onClick={() => s.tab && setActiveTab(s.tab as any)} className="w-full flex items-center gap-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-sm text-indigo-300 hover:bg-indigo-500/20 transition-colors text-left">
                        <Lightbulb className="w-4 h-4 flex-shrink-0" />
                        {s.text}
                      </button>
                    ))}
                  </div>
                )}
                {(() => {
                  const POSITIVE_IDS = ['walk', 'meditate', 'gym', 'library', 'read_book', 'friends', 'museum', 'concert', 'movie', 'cooking_class', 'online_course', 'hire_tutor'];
                  const NEUTRAL_IDS = ['doctor', 'er', 'therapy', 'spa', 'party', 'golf', 'travel_local', 'travel_international', 'travel_luxury', 'vacation', 'charity_gala', 'yacht_party'];
                  const NEGATIVE_IDS = ['report_parents', 'casino', 'street_racing', 'plastic_surgery'];

                  const getActivityTier = (id: string) => {
                    if (POSITIVE_IDS.includes(id)) return 0;
                    if (NEUTRAL_IDS.includes(id)) return 1;
                    if (NEGATIVE_IDS.includes(id)) return 2;
                    return 1;
                  };

                  const TIER_LABELS = ['Wellness & Growth', 'Lifestyle & Leisure', 'Risky & Extreme'];
                  const TIER_COLORS = [
                    { icon: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-900/30' },
                    { icon: 'bg-indigo-500/10 text-indigo-400', border: 'border-zinc-800' },
                    { icon: 'bg-amber-500/10 text-amber-400', border: 'border-amber-900/30' },
                  ];

                  const filtered = [...ACTIVITIES]
                    .filter(a => {
                      if (!a.isAvailable || a.isAvailable(player)) {
                        // Only show CPS report when parent relationship is very low or neglect happened
                        if (a.id === 'report_parents') {
                          const hasNeglect = (player.parentalNeglectCount || 0) > 0;
                          const hasLowRelParent = player.parents?.some(p => !p.isDead && p.relationship < 25);
                          return hasNeglect || hasLowRelParent;
                        }
                        return true;
                      }
                      return false;
                    })
                    .sort((a, b) => getActivityTier(a.id) - getActivityTier(b.id));

                  const groups: [number, typeof filtered][] = [];
                  let currentTier = -1;
                  for (const act of filtered) {
                    const tier = getActivityTier(act.id);
                    if (tier !== currentTier) {
                      currentTier = tier;
                      groups.push([tier, []]);
                    }
                    groups[groups.length - 1][1].push(act);
                  }

                  return groups.map(([tier, acts]) => (
                    <div key={tier}>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">{TIER_LABELS[tier]}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                        {acts.map(activity => {
                          const effects = getActivityEffectPreview(activity);
                          return (
                          <button
                            key={activity.id}
                            onClick={() => performActivity(activity)}
                            disabled={!player.isAlive}
                            className={`flex items-center gap-3 p-4 bg-zinc-950 border ${TIER_COLORS[tier].border} rounded-xl hover:border-zinc-600 transition-colors text-left disabled:opacity-50`}
                          >
                            <div className={`p-2 ${TIER_COLORS[tier].icon} rounded-lg`}><Activity className="w-5 h-5" /></div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-zinc-200">{activity.name}</div>
                              <div className="text-xs text-zinc-500">{activity.cost > 0 ? `$${activity.cost.toLocaleString()}` : 'Free'}</div>
                              {effects.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {effects.map((e, idx) => (
                                    <span key={idx} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${e.color} ${e.color.includes('emerald') ? 'bg-emerald-500/10' : e.color.includes('amber') ? 'bg-amber-500/10' : 'bg-rose-500/10'}`}>
                                      {e.label}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {activity.limitPerYear && (
                                <div className="text-[10px] text-zinc-600 mt-1">
                                  {activityCounts[activity.id] || 0} / {activity.limitPerYear} this year
                                </div>
                              )}
                            </div>
                          </button>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}

            {activeTab === 'crime' && (
              <div className="space-y-6">
                <div className="bg-rose-950/20 border border-rose-900/50 rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-rose-500 uppercase tracking-wider">Criminal Activities</h3>
                  </div>
                  <p className="text-sm text-zinc-400 mb-6">
                    Warning: Crime can lead to prison time, fines, and a ruined reputation. Your smarts and karma affect your chances of success.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CRIMES.filter(a => !a.isAvailable || a.isAvailable(player)).map(activity => {
                      const effects = getCrimeEffectPreview(activity);
                      return (
                      <button 
                        key={activity.id}
                        onClick={() => performActivity(activity)} 
                        disabled={!player.isAlive || player.money < activity.cost || player.inPrison}
                        className="flex flex-col p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-rose-500/50 hover:bg-rose-500/5 transition-colors text-left disabled:opacity-50"
                      >
                        <div className="font-medium text-zinc-200 mb-1">{activity.name}</div>
                        <div className="text-xs text-rose-400 mb-1.5">
                          {activity.cost > 0 ? `Cost: $${activity.cost.toLocaleString()}` : 'Free'}
                        </div>
                        {effects.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {effects.map((e, idx) => (
                              <span key={idx} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${e.color} ${e.color.includes('emerald') ? 'bg-emerald-500/10' : e.color.includes('amber') ? 'bg-amber-500/10' : 'bg-rose-500/10'}`}>
                                {e.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                {/* Degrees */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Degrees & Programs</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(EDUCATION_COSTS).map(([edu, cost]) => (
                      <button 
                        key={edu}
                        onClick={() => applyForEducation(edu as EducationLevel)}
                        disabled={!player.isAlive}
                        className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors text-left disabled:opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><GraduationCap className="w-5 h-5" /></div>
                          <div>
                            <div className="font-medium text-zinc-200">{edu}</div>
                            <div className="text-xs text-zinc-500">${cost.toLocaleString()}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-600" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                {player.age >= 6 && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">🌍 Language Learning</h3>
                    
                    {/* Current languages */}
                    {player.languages && player.languages.length > 0 && (
                      <div className="mb-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Your Languages</div>
                        <div className="space-y-2">
                          {player.languages.map(lang => (
                            <div key={lang.id} className="flex items-center justify-between">
                              <span className="text-sm text-zinc-200">{lang.name} {lang.isNative ? '(Native)' : ''}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                  <div className={`h-full transition-all ${lang.proficiency >= 80 ? 'bg-emerald-500' : lang.proficiency >= 50 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${lang.proficiency}%` }} />
                                </div>
                                <span className="text-xs text-zinc-500 w-8">{lang.proficiency}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Currently studying */}
                    {player.currentLanguageStudy && (
                      <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                        <span className="text-sm text-indigo-300">📖 Studying {player.currentLanguageStudy.languageName}...</span>
                        <button onClick={stopLanguageStudy} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors">Stop</button>
                      </div>
                    )}

                    {/* Available languages to learn */}
                    {(['Core', 'Secondary', 'Rare'] as const).map(tier => {
                      const tierLangs = ALL_LANGUAGES
                        .filter(lang => lang.tier === tier && !(player.languages || []).find(l => l.id === lang.id && l.proficiency >= 100));
                      if (tierLangs.length === 0) return null;
                      const tierColors = { Core: 'text-emerald-400', Secondary: 'text-amber-400', Rare: 'text-purple-400' };
                      const tierDescriptions = { Core: 'Widely spoken worldwide', Secondary: 'Regional importance', Rare: 'Indigenous & niche languages' };
                      return (
                        <div key={tier} className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-semibold uppercase tracking-wider ${tierColors[tier]}`}>{tier} Languages</span>
                            <span className="text-[10px] text-zinc-600">— {tierDescriptions[tier]}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {tierLangs.map(lang => {
                              const existing = (player.languages || []).find(l => l.id === lang.id);
                              const isStudying = player.currentLanguageStudy?.languageId === lang.id;
                              return (
                                <button 
                                  key={lang.id}
                                  onClick={() => startLanguageStudy(lang.id)}
                                  disabled={!player.isAlive || isStudying}
                                  className={`flex items-center justify-between p-3 bg-zinc-950 border rounded-xl hover:border-zinc-700 transition-colors text-left disabled:opacity-50 ${isStudying ? 'border-indigo-500/50' : 'border-zinc-800'}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${tier === 'Core' ? 'bg-emerald-500/10 text-emerald-400' : tier === 'Secondary' ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'}`}><Globe className="w-4 h-4" /></div>
                                    <div>
                                      <div className="font-medium text-zinc-200 text-sm">{lang.name}</div>
                                      <div className="text-xs text-zinc-500">
                                        {lang.difficulty} • ${LANGUAGE_STUDY_COST[lang.difficulty].toLocaleString()}/yr
                                        {existing ? ` • ${existing.proficiency}%` : ''}
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'occupation' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Career</h3>
                  <button 
                    onClick={() => setShowResumeModal(true)}
                    className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 text-sm rounded-lg transition-colors font-medium"
                  >
                    View Resume
                  </button>
                </div>
                {player.job && (
                  <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl mb-6">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Current Job</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-zinc-200 text-lg">{player.job.title}</div>
                      <div className="text-emerald-400 font-medium">${player.job.salary.toLocaleString()}/yr</div>
                    </div>
                    <div className="text-sm text-zinc-400 mb-4">Experience: {player.yearsInJob} years</div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">Performance</span>
                        <span className="text-zinc-200">{player.performance}%</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${player.performance}%` }} />
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500 italic mt-2">High performance increases your chances of a promotion!</div>
                    {player.job.category === 'Politics' && (
                      <div className="mt-4 pt-4 border-t border-zinc-800">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-zinc-400">Popularity</span>
                          <span className="text-zinc-200">{player.popularity}%</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
                          <div className="h-full bg-pink-500 transition-all" style={{ width: `${player.popularity}%` }} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => makeReform('tax')}
                            disabled={reformsThisYear >= 3}
                            className="w-full py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            Tax Cut
                          </button>
                          <button
                            onClick={() => makeReform('healthcare')}
                            disabled={reformsThisYear >= 3}
                            className="w-full py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            Healthcare
                          </button>
                          <button
                            onClick={() => makeReform('education')}
                            disabled={reformsThisYear >= 3}
                            className="w-full py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            Education
                          </button>
                        </div>
                        <div className="text-xs text-center text-zinc-500 mt-2">Reforms this year: {reformsThisYear}/3</div>
                      </div>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                      <button 
                        onClick={quitJob}
                        disabled={!player.isAlive}
                        className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        Quit Job
                      </button>
                    </div>

                    {player.coworkers && player.coworkers.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-zinc-800">
                        <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Coworkers</h4>
                        <div className="space-y-3">
                          {player.coworkers.map(coworker => (
                            <div key={coworker.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                              <div>
                                <div className="font-medium text-zinc-200">{coworker.name}</div>
                                <div className="text-xs text-zinc-500">Age {coworker.age} • {coworker.gender}</div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="text-xs text-zinc-400 mb-1">Relationship</div>
                                  <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 transition-all" style={{ width: `${coworker.relationship}%` }} />
                                  </div>
                                </div>
                                <SocialDropdown personId={coworker.id} personType="coworker" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {['Corporate', 'Medical', 'Military', 'Politics', 'Entertainment', 'Law', 'Technology', 'Aviation', 'Maritime', 'Finance', 'Engineering', 'Media', 'Science', 'Public Service', 'Education'].map(category => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {JOBS.filter(j => j.category === category).map(job => {
                        const fit = getJobFitDetails(job);
                        const isBest = bestAvailableJob?.id === job.id;
                        return (
                          <button 
                            key={job.id}
                            onClick={() => applyForJob(job)}
                            disabled={!player.isAlive}
                            className={`flex flex-col p-4 bg-zinc-950 border rounded-xl hover:border-zinc-700 transition-colors text-left disabled:opacity-50 ${isBest ? 'border-emerald-500/70 shadow-lg shadow-emerald-950/30' : fit.eligible ? 'border-indigo-500/30' : 'border-zinc-800'}`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="font-medium text-zinc-200">{job.title}</div>
                              {isBest && <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1"><Briefcase className="w-3 h-3" /> Best</span>}
                            </div>
                            <div className="text-sm text-emerald-400 mb-2 flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary.toLocaleString()}/yr</div>
                            {fit.eligible ? (
                              <div className="text-xs text-indigo-300 flex items-center gap-1 mb-2"><Check className="w-3 h-3" /> Eligible to apply</div>
                            ) : (
                              <div className="text-xs text-amber-300 flex items-start gap-1 mb-2"><Activity className="w-3 h-3 mt-0.5" /> Needs: {fit.reasons.slice(0, 2).join(', ')}</div>
                            )}
                            <div className="text-xs text-zinc-500 space-y-1">
                              {job.requirements.education && <div>Req: {job.requirements.education}{job.requirements.alternativeEducation ? ` or ${job.requirements.alternativeEducation}` : ''}</div>}
                              {job.requirements.smarts && <div>Req Smarts: {job.requirements.smarts}+</div>}
                              {job.requirements.health && <div>Req Health: {job.requirements.health}+</div>}
                              {job.requirements.popularity && <div>Req Popularity: {job.requirements.popularity}%</div>}
                              {job.requirements.previousJobId && <div>Exp: {JOBS.find(j => j.id === job.requirements.previousJobId)?.title} ({job.requirements.yearsInPreviousJob} yrs)</div>}
                              {job.requirements.money && <div>Cost: ${job.requirements.money.toLocaleString()}</div>}
                              {job.salary > 200000 && <div className="text-amber-500">⚡ 10+ yrs in {job.category}</div>}
                              {job.salary > 100000 && job.salary <= 200000 && <div className="text-amber-500">⚡ 5+ yrs in {job.category}</div>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'family' && (
              <div className="space-y-8">
                {((player.parents && player.parents.some(p => !p.isDead)) || player.inGroupHome || player.guardianName) && (
                  <label className="flex items-center gap-2 text-sm text-zinc-400 mb-4 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={askParentsToPay} 
                      onChange={(e) => setAskParentsToPay(e.target.checked)} 
                      className="rounded bg-zinc-900 border-zinc-700 text-indigo-500 focus:ring-indigo-500" 
                    />
                    Ask parents/guardians to pay for social events
                  </label>
                )}
                {/* Partner Section */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Partner & Romance</h3>
                  <div className="flex flex-col gap-3">
                    {!player.partner ? (
                      <button 
                        onClick={openDatingApp}
                        disabled={!player.isAlive || player.age < 18}
                        className="flex items-center gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors text-left disabled:opacity-50 w-full max-w-md"
                      >
                        <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg"><Heart className="w-5 h-5" /></div>
                        <div className="flex-1">
                          <div className="font-medium text-zinc-200">Dating App</div>
                          <div className="text-xs text-zinc-500">Find someone special (18+)</div>
                        </div>
                      </button>
                    ) : (
                      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl max-w-md">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg"><Heart className="w-5 h-5" /></div>
                          <div>
                            <div className="font-medium text-zinc-200 text-lg">{player.partner.name}</div>
                            <div className="text-sm text-zinc-500">{player.partner.type === 'married' ? 'Spouse' : 'Partner'} • Age {player.partner.age}</div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-zinc-400">Relationship</span>
                              <span className="text-zinc-200">{player.partner.relationship}%</span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-pink-500 transition-all" style={{ width: `${player.partner.relationship}%` }} />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <SocialDropdown personId="partner" personType="partner" />
                            {player.partner.type === 'dating' && (
                              <>
                                <button onClick={propose} disabled={!player.isAlive || player.age < 18} className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 text-sm rounded-lg transition-colors disabled:opacity-50">Propose</button>
                                <button onClick={hintProposal} disabled={!player.isAlive || player.age < 18} className="px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 text-sm rounded-lg transition-colors disabled:opacity-50">Hint for Proposal</button>
                              </>
                            )}
                            {player.partner.type === 'engaged' && (
                              <button onClick={() => setShowWeddingModal(true)} disabled={!player.isAlive} className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm rounded-lg transition-colors disabled:opacity-50">Plan Wedding</button>
                            )}
                            <button onClick={makeLove} disabled={!player.isAlive} className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-sm rounded-lg transition-colors disabled:opacity-50">Make Love</button>
                            <button onClick={fertilityTreatment} disabled={!player.isAlive || player.money < 8000} className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm rounded-lg transition-colors disabled:opacity-50">Fertility Treatment ($8k)</button>
                            <button onClick={breakUp} disabled={!player.isAlive} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-colors disabled:opacity-50">{player.partner.type === 'married' ? 'Divorce' : 'Break Up'}</button>
                          </div>
                        </div>
                      </div>
                    )}
                    

                  </div>
                </div>

                {/* Parents Section */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Parents</h3>
                  {(!player.parents || player.parents.length === 0) ? (
                    <div className="text-sm text-zinc-500 italic">
                      {player.age < 18 
                        ? (player.inGroupHome ? 'You are currently living in a group home.' : (player.guardianName ? `You are currently living with your guardian (${player.guardianName}).` : 'You are currently living with relatives.'))
                        : 'No parents.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {player.parents.map(parent => (
                        <div key={parent.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-zinc-500" />
                              <div className="font-medium text-zinc-200">
                                {parent.name} {parent.isDead && <span className="text-rose-500 text-xs ml-1">(Deceased)</span>}
                              </div>
                            </div>
                            <div className="text-xs text-zinc-500">{parent.gender === 'Male' ? 'Father' : 'Mother'} {parent.isDead ? '' : `• Age ${parent.age}`}</div>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-zinc-400">Relationship</span>
                              <span className="text-zinc-200">{parent.relationship}%</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 transition-all" style={{ width: `${parent.relationship}%` }} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <SocialDropdown personId={parent.id} personType="parent" isDead={parent.isDead} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Siblings Section */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Siblings</h3>
                  {(!player.siblings || player.siblings.length === 0) ? (
                    <div className="text-sm text-zinc-500 italic">No siblings.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {player.siblings.map(sibling => (
                        <div key={sibling.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-zinc-500" />
                              <div className="font-medium text-zinc-200">{sibling.name}</div>
                            </div>
                            <div className="text-xs text-zinc-500">{sibling.gender === 'Male' ? 'Brother' : 'Sister'} • Age {sibling.age}</div>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-zinc-400">Relationship</span>
                              <span className="text-zinc-200">{sibling.relationship}%</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 transition-all" style={{ width: `${sibling.relationship}%` }} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <SocialDropdown personId={sibling.id} personType="sibling" isDead={sibling.isDead} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grandparents Section */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Grandparents</h3>
                  {(!player.grandparents || player.grandparents.length === 0) ? (
                    <div className="text-sm text-zinc-500 italic">No grandparents.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {player.grandparents.map(gp => (
                        <div key={gp.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-zinc-500" />
                              <div className="font-medium text-zinc-200">{gp.name}</div>
                            </div>
                            <div className="text-xs text-zinc-500">{gp.gender === 'Male' ? 'Grandfather' : 'Grandmother'} • Age {gp.age}</div>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-zinc-400">Relationship</span>
                              <span className="text-zinc-200">{gp.relationship}%</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 transition-all" style={{ width: `${gp.relationship}%` }} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <SocialDropdown personId={gp.id} personType="grandparent" isDead={gp.isDead} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Aunts & Uncles Section */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Aunts & Uncles</h3>
                  {(!player.auntsAndUncles || player.auntsAndUncles.length === 0) ? (
                    <div className="text-sm text-zinc-500 italic">No aunts or uncles.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {player.auntsAndUncles.map(au => (
                        <div key={au.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-zinc-500" />
                              <div className="font-medium text-zinc-200">{au.name}</div>
                            </div>
                            <div className="text-xs text-zinc-500">{au.gender === 'Male' ? 'Uncle' : 'Aunt'} • Age {au.age}</div>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-zinc-400">Relationship</span>
                              <span className="text-zinc-200">{au.relationship}%</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 transition-all" style={{ width: `${au.relationship}%` }} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <SocialDropdown personId={au.id} personType="auntUncle" isDead={au.isDead} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cousins Section */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Cousins</h3>
                  {(!player.cousins || player.cousins.length === 0) ? (
                    <div className="text-sm text-zinc-500 italic">No cousins.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {player.cousins.map(c => (
                        <div key={c.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-zinc-500" />
                              <div className="font-medium text-zinc-200">{c.name}</div>
                            </div>
                            <div className="text-xs text-zinc-500">Cousin • Age {c.age}</div>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-zinc-400">Relationship</span>
                              <span className="text-zinc-200">{c.relationship}%</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 transition-all" style={{ width: `${c.relationship}%` }} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <SocialDropdown personId={c.id} personType="cousin" isDead={c.isDead} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Friends Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Friends</h3>
                    <button 
                      onClick={makeFriend}
                      disabled={!player.isAlive}
                      className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                    >
                      + Make a Friend
                    </button>
                  </div>
                  
                  {(!player.friends || player.friends.length === 0) ? (
                    <div className="text-sm text-zinc-500 italic">No friends yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {player.friends.map(friend => (
                        <div key={friend.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-zinc-500" />
                              <div className="font-medium text-zinc-200">{friend.name}</div>
                            </div>
                            <div className="text-xs text-zinc-500">Age {friend.age}</div>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-zinc-400">Relationship</span>
                              <span className="text-zinc-200">{friend.relationship}%</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 transition-all" style={{ width: `${friend.relationship}%` }} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <SocialDropdown personId={friend.id} personType="friend" />
                            <button onClick={() => unfriend(friend.id)} disabled={!player.isAlive} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors disabled:opacity-50">Unfriend</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Kids Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Children</h3>
                  </div>
                  
                  {(!player.kids || player.kids.length === 0) ? (
                    <div className="text-sm text-zinc-500 italic">No children yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {player.kids.map(kid => (
                        <div key={kid.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-zinc-200">{kid.name}</div>
                            <div className="text-xs text-zinc-500">{kid.gender} • Age {kid.age}</div>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-zinc-400">Relationship</span>
                              <span className="text-zinc-200">{kid.relationship}%</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 transition-all" style={{ width: `${kid.relationship}%` }} />
                            </div>
                          </div>
                          <SocialDropdown personId={kid.id} personType="kid" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Will Section */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Last Will & Testament</h3>
                  <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl max-w-md">
                    <div className="text-sm text-zinc-400 mb-4">How should your assets be distributed upon your passing?</div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-900 transition-colors">
                        <input 
                          type="radio" 
                          name="will" 
                          checked={player.will?.type === 'even'} 
                          onChange={() => updateWill('even')}
                          disabled={!player.isAlive}
                          className="text-indigo-500 focus:ring-indigo-500 bg-zinc-900 border-zinc-700"
                        />
                        <span className="text-sm text-zinc-200">Split evenly among all children</span>
                      </label>
                      
                      {player.kids && player.kids.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs text-zinc-500 uppercase tracking-wider mt-4 mb-2">Leave everything to one child:</div>
                          {player.kids.map(kid => (
                            <label key={kid.id} className="flex items-center gap-3 p-3 border border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-900 transition-colors">
                              <input 
                                type="radio" 
                                name="will" 
                                checked={player.will?.type === 'single' && player.will?.recipientId === kid.id} 
                                onChange={() => updateWill('single', kid.id)}
                                disabled={!player.isAlive}
                                className="text-indigo-500 focus:ring-indigo-500 bg-zinc-900 border-zinc-700"
                              />
                              <span className="text-sm text-zinc-200">{kid.name}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {player.kids && player.kids.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-zinc-800">
                           <label className="flex items-center gap-3 p-3 border border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-900 transition-colors mb-2">
                            <input 
                              type="radio" 
                              name="will" 
                              checked={player.will?.type === 'custom'} 
                              onChange={() => updateWill('custom')}
                              disabled={!player.isAlive}
                              className="text-indigo-500 focus:ring-indigo-500 bg-zinc-900 border-zinc-700"
                            />
                            <span className="text-sm text-zinc-200">Custom Distribution</span>
                          </label>
                          {player.will?.type === 'custom' && (
                            <button
                              onClick={() => { setWillStep('edit'); setShowWillModal(true); }}
                              disabled={!player.isAlive}
                              className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg text-sm font-medium transition-colors"
                            >
                              Edit Custom Will
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="space-y-8">
                {/* Real Estate Skill */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Real Estate Investor Profile</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      marketCycle === 'Boom' ? 'bg-emerald-500/20 text-emerald-400' :
                      marketCycle === 'Crash' ? 'bg-rose-500/20 text-rose-400' :
                      'bg-zinc-800 text-zinc-300'
                    }`}>
                      Market: {marketCycle}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <div className="text-zinc-400 text-sm mb-1">Real Estate Skill</div>
                      <div className="text-2xl font-bold text-indigo-400">{player.realEstateSkill || 0} / 100</div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${player.realEstateSkill || 0}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <div className="text-zinc-400 text-sm mb-1">XP to Next Level</div>
                      <div className="text-2xl font-bold text-emerald-400">{player.realEstateXP || 0} / 100</div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${player.realEstateXP || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Section */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Businesses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(!player.businesses || player.businesses.length === 0) ? (
                      <button 
                        onClick={() => setShowBusinessModal(true)}
                        disabled={!player.isAlive}
                        className="flex items-center gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors text-left disabled:opacity-50 w-full"
                      >
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Building className="w-5 h-5" /></div>
                        <div className="flex-1">
                          <div className="font-medium text-zinc-200">Start a Business</div>
                          <div className="text-xs text-zinc-500">Choose from dozens of different businesses</div>
                        </div>
                        <Plus className="w-5 h-5 text-zinc-600" />
                      </button>
                    ) : (
                      <>
                        {player.businesses.map(business => (
                          <div key={business.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Building className="w-5 h-5" /></div>
                              <div>
                                <div className="font-medium text-zinc-200 text-lg">{business.name}</div>
                                <div className="text-sm text-zinc-500">{business.category}</div>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm mb-6">
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Annual Revenue</span>
                                <span className="text-emerald-400 font-medium">
                                  ${Math.floor(business.basePrice * 0.10 * (1 + (business.smallUpgrades || []).reduce((s, u) => s + (u.purchased ? u.revenueBoost : 0), 0) + (business.largeUpgrades || []).reduce((s, u) => s + (u.purchased ? u.revenueBoost : 0), 0)) * marketMultiplier).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Estimated Value</span>
                                <span className="text-zinc-200 font-medium">
                                  ${business.basePrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Profitability</span>
                                <span className="text-emerald-400 font-medium">{business.profitability}%</span>
                              </div>
                              {business.mortgage && (
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Mortgage ({Math.ceil(business.mortgage.monthsLeft / 12)} yrs)</span>
                                  <span className="text-rose-400 font-medium">-${(business.mortgage.monthlyPayment * 12).toLocaleString()}/yr</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Upgrades</span>
                                <span className="text-emerald-400 font-medium">
                                  {(business.smallUpgrades || []).filter(u => u.purchased).length + (business.largeUpgrades || []).filter(u => u.purchased).length} / {(business.smallUpgrades || []).length + (business.largeUpgrades || []).length}
                                </span>
                              </div>
                            </div>

                            {/* Small Upgrades */}
                            {business.smallUpgrades && business.smallUpgrades.some(u => !u.purchased) && (
                              <div className="space-y-2 mb-4">
                                <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Small Upgrades (+{business.smallUpgrades.filter(u => u.purchased).length}/{business.smallUpgrades.length})</div>
                                {business.smallUpgrades.filter(u => !u.purchased).slice(0, 2).map(upgrade => (
                                  <button
                                    key={upgrade.id}
                                    onClick={() => purchaseSmallUpgrade('business', business.id, upgrade.id)}
                                    disabled={!player.isAlive || player.money < upgrade.cost}
                                    className="w-full py-2 px-3 bg-teal-500/10 text-teal-400 rounded-lg hover:bg-teal-500/20 disabled:opacity-50 transition-colors text-xs font-medium flex items-center justify-between"
                                  >
                                    <span className="flex items-center gap-2 min-w-0">
                                      <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                                      <span className="truncate">{upgrade.name} (+{(upgrade.revenueBoost * 100).toFixed(0)}% rev)</span>
                                    </span>
                                    <span>${upgrade.cost.toLocaleString()}</span>
                                  </button>
                                ))}
                                {business.smallUpgrades.filter(u => u.purchased).length > 0 && (
                                  <div className="text-xs text-teal-400/60">Total boost: +{(business.smallUpgrades.filter(u => u.purchased).reduce((s, u) => s + u.revenueBoost, 0) * 100).toFixed(0)}%</div>
                                )}
                              </div>
                            )}

                            {/* Large Upgrades */}
                            {business.largeUpgrades && business.largeUpgrades.some(u => !u.purchased) && (
                              <div className="space-y-2 mb-4">
                                <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Large Upgrades ({business.largeUpgrades.filter(u => u.purchased).length}/{business.largeUpgrades.length})</div>
                                {business.largeUpgrades.filter(u => !u.purchased).slice(0, 2).map(upgrade => (
                                  <button
                                    key={upgrade.id}
                                    onClick={() => purchaseLargeUpgrade('business', business.id, upgrade.id)}
                                    disabled={!player.isAlive || player.money < upgrade.cost}
                                    className="w-full py-2 px-3 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 disabled:opacity-50 transition-colors text-xs font-medium flex items-center justify-between"
                                  >
                                    <span className="flex items-center gap-2 min-w-0">
                                      <ArrowUpCircle className="w-3.5 h-3.5 shrink-0" />
                                      <span className="truncate">{upgrade.name} (+{(upgrade.revenueBoost * 100).toFixed(0)}% rev, +{(upgrade.valueBoost * 100).toFixed(0)}% val)</span>
                                    </span>
                                    <span>${upgrade.cost.toLocaleString()}</span>
                                  </button>
                                ))}
                                {business.largeUpgrades.filter(u => u.purchased).length > 0 && (
                                  <div className="text-xs text-amber-400/60">Total boost: +{(business.largeUpgrades.filter(u => u.purchased).reduce((s, u) => s + u.revenueBoost, 0) * 100).toFixed(0)}% rev, +{(business.largeUpgrades.filter(u => u.purchased).reduce((s, u) => s + u.valueBoost, 0) * 100).toFixed(0)}% val</div>
                                )}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => sellBusiness(business.id)}
                                disabled={!player.isAlive}
                                className="flex-1 py-2 px-4 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 disabled:opacity-50 transition-colors text-sm font-medium flex items-center justify-center"
                              >
                                Sell Business
                              </button>
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => setShowBusinessModal(true)}
                          disabled={!player.isAlive}
                          className="flex flex-col items-center justify-center gap-3 p-6 bg-zinc-950/50 border border-zinc-800 border-dashed rounded-xl hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors text-center disabled:opacity-50 h-full min-h-[200px]"
                        >
                          <div className="p-3 bg-zinc-800 text-zinc-400 rounded-full"><Plus className="w-6 h-6" /></div>
                          <div>
                            <div className="font-medium text-zinc-300">Start Another Business</div>
                            <div className="text-xs text-zinc-500 mt-1">Expand your empire</div>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Owned Assets */}
                {player.assets.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Your Assets</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {player.assets.map(asset => (
                        <div key={asset.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                              {asset.type === 'Property' ? <Home className="w-5 h-5" /> :
                               asset.type === 'Car' ? <Car className="w-5 h-5" /> :
                               asset.type === 'Boat' ? <Ship className="w-5 h-5" /> :
                               asset.type === 'Crypto' ? <Bitcoin className="w-5 h-5" /> :
                               asset.type === 'Lifestyle' ? <ShoppingBag className="w-5 h-5" /> :
                               <Plane className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="font-medium text-zinc-200">{asset.name}</div>
                              {asset.type !== 'Crypto' && (
                                <div className="text-xs text-zinc-500">Condition: {asset.condition}%</div>
                              )}
                              {asset.type === 'Property' && asset.mortgage && (
                                <div className="text-xs text-rose-400 mt-1">
                                  Mortgage: ${asset.mortgage.principal.toLocaleString()} (${asset.mortgage.monthlyPayment.toLocaleString()}/mo)
                                </div>
                              )}
                              {asset.type === 'Property' && (
                                <div className="text-xs text-emerald-400 mt-1">
                                  Expected Rent: ${Math.floor(asset.value * 0.10 * (1 + ((player.realEstateSkill || 0) / 100))).toLocaleString()}/mo
                                </div>
                              )}
                              {asset.type === 'Property' && (
                                <div className="text-xs text-indigo-400 mt-1">
                                  Upgrade Level: {asset.upgradeLevel || (asset.upgrades ? asset.upgrades.length : 0)} / {UPGRADE_LEVELS.length}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-emerald-400 mb-4">${asset.value.toLocaleString()}</div>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => sellAsset(asset.id)} className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg text-xs font-medium transition-colors">Sell</button>
                            {player.kids && player.kids.length > 0 && (
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    giftAsset(asset.id, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                                className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-xs font-medium transition-colors border-none outline-none cursor-pointer appearance-none"
                                defaultValue=""
                              >
                                <option value="" disabled>Gift to Child...</option>
                                {player.kids.map(kid => (
                                  <option key={kid.id} value={kid.id}>{kid.name}</option>
                                ))}
                              </select>
                            )}
                            {asset.type !== 'Crypto' && (
                              <button 
                                onClick={() => repairAsset(asset.id)} 
                                disabled={asset.condition >= 100}
                                className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Repair
                              </button>
                            )}
                            {asset.type === 'Property' && (
                              <>
                                {asset.mortgage && (
                                  <button 
                                    onClick={() => payOffMortgage(asset.id)} 
                                    className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg text-xs font-medium transition-colors"
                                  >
                                    Pay Off Mortgage
                                  </button>
                                )}
                                <button 
                                  onClick={() => upgradeProperty(asset.id)} 
                                  disabled={(asset.upgradeLevel || (asset.upgrades ? asset.upgrades.length : 0)) >= UPGRADE_LEVELS.length}
                                  className="px-3 py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {(asset.upgradeLevel || (asset.upgrades ? asset.upgrades.length : 0)) >= UPGRADE_LEVELS.length 
                                    ? 'Max Upgrades' 
                                    : `Upgrade ($${Math.floor(asset.value * UPGRADE_LEVELS[asset.upgradeLevel || (asset.upgrades ? asset.upgrades.length : 0)].costPct).toLocaleString()})`
                                  }
                                </button>
                                <button 
                                  onClick={() => togglePrimaryResidence(asset.id)} 
                                  disabled={asset.isRented}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${asset.isPrimaryResidence ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                                >
                                  {asset.isPrimaryResidence ? 'Living Here' : 'Move In'}
                                </button>
                                <button 
                                  onClick={() => toggleRentProperty(asset.id)} 
                                  disabled={asset.isPrimaryResidence}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${asset.isRented ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                                >
                                  {asset.isRented ? 'Rented' : 'Rent Out'}
                                </button>
                              </>
                            )}
                            {/* Small Upgrades for Properties */}
                            {asset.type === 'Property' && asset.smallUpgrades && asset.smallUpgrades.some(u => !u.purchased) && (
                              <div className="mt-2 space-y-1">
                                <div className="text-xs text-zinc-500 font-semibold">Small Upgrades ({asset.smallUpgrades.filter(u => u.purchased).length}/{asset.smallUpgrades.length})</div>
                                {asset.smallUpgrades.filter(u => !u.purchased).slice(0, 2).map(upgrade => (
                                  <button
                                    key={upgrade.id}
                                    onClick={() => purchaseSmallUpgrade('property', asset.id, upgrade.id)}
                                    disabled={!player.isAlive || player.money < upgrade.cost}
                                    className="w-full py-1.5 px-3 bg-teal-500/10 text-teal-400 rounded-lg hover:bg-teal-500/20 disabled:opacity-50 transition-colors text-xs font-medium flex items-center justify-between"
                                  >
                                    <span>{upgrade.name} (+{(upgrade.revenueBoost * 100).toFixed(0)}% rev)</span>
                                    <span>${upgrade.cost.toLocaleString()}</span>
                                  </button>
                                ))}
                                {asset.smallUpgrades.filter(u => u.purchased).length > 0 && (
                                  <div className="text-xs text-teal-400/60">Total boost: +{(asset.smallUpgrades.filter(u => u.purchased).reduce((s, u) => s + u.revenueBoost, 0) * 100).toFixed(0)}%</div>
                                )}
                              </div>
                            )}
                            {/* Large Upgrades for Properties */}
                            {asset.type === 'Property' && asset.largeUpgrades && asset.largeUpgrades.some(u => !u.purchased) && (
                              <div className="mt-2 space-y-1">
                                <div className="text-xs text-zinc-500 font-semibold">Large Upgrades ({asset.largeUpgrades.filter(u => u.purchased).length}/{asset.largeUpgrades.length})</div>
                                {asset.largeUpgrades.filter(u => !u.purchased).slice(0, 2).map(upgrade => (
                                  <button
                                    key={upgrade.id}
                                    onClick={() => purchaseLargeUpgrade('property', asset.id, upgrade.id)}
                                    disabled={!player.isAlive || player.money < upgrade.cost}
                                    className="w-full py-1.5 px-3 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 disabled:opacity-50 transition-colors text-xs font-medium flex items-center justify-between"
                                  >
                                    <span>{upgrade.name} (+{(upgrade.revenueBoost * 100).toFixed(0)}% rev, +{(upgrade.valueBoost * 100).toFixed(0)}% val)</span>
                                    <span>${upgrade.cost.toLocaleString()}</span>
                                  </button>
                                ))}
                                {asset.largeUpgrades.filter(u => u.purchased).length > 0 && (
                                  <div className="text-xs text-amber-400/60">Total boost: +{(asset.largeUpgrades.filter(u => u.purchased).reduce((s, u) => s + u.revenueBoost, 0) * 100).toFixed(0)}% rev, +{(asset.largeUpgrades.filter(u => u.purchased).reduce((s, u) => s + u.valueBoost, 0) * 100).toFixed(0)}% val</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shop */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Shop</h3>
                  <div className="space-y-6">
                    {['Property', 'Car', 'Boat', 'Plane', 'Crypto', 'Lifestyle'].map(type => (
                      <div key={type}>
                        <h4 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                          {type === 'Property' ? 'Properties' : type === 'Crypto' ? 'Crypto' : type === 'Lifestyle' ? 'Lifestyle Items' : type + 's'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {ASSETS_FOR_SALE.filter(a => a.type === type).map(item => {
                            let displayPrice = Math.floor(item.baseValue * marketMultiplier);
                            if (item.type === 'Property' && player.realEstateSkill) {
                              const discount = Math.min(0.95, (player.realEstateSkill / 100) * 0.95);
                              displayPrice = Math.floor(displayPrice * (1 - discount));
                            }
                            return (
                            <button 
                              key={item.name}
                              onClick={() => buyAsset(item)}
                              disabled={!player.isAlive}
                              className="flex flex-col p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors text-left disabled:opacity-50"
                            >
                              <div className="font-medium text-zinc-200 mb-1">{item.name}</div>
                              {item.type === 'Property' && (
                                <div className="text-xs text-zinc-500 mb-2">
                                  {item.propertyTier} • {item.propertyType} • {item.propertySize}
                                </div>
                              )}
                              <div className="text-sm text-emerald-400">
                                ${displayPrice.toLocaleString()}
                                {item.type === 'Property' && (
                                  <span className="text-xs text-zinc-500 ml-2">
                                    {player.money >= displayPrice 
                                      ? '(No Mortgage)' 
                                      : `(Down: $${Math.floor(player.money > 0 ? player.money * 0.8 : 0).toLocaleString()})`}
                                  </span>
                                )}
                              </div>
                            </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'finance' && (() => {
              const expenses = calculateYearlyExpenses(player);
              const netIncome = expenses.grossIncome - expenses.taxAmount;
              const totalOutflows = expenses.totalLivingExpenses + expenses.mortgagePayments + expenses.loanPayments + expenses.taxAmount;
              const yearlyNet = expenses.grossIncome - totalOutflows;
              
              return (
              <div className="space-y-8">
                {/* Lifestyle Tier Selector */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Lifestyle</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(LIFESTYLE_MULTIPLIERS).map(([key, info]) => (
                      <button
                        key={key}
                        onClick={() => setPlayer({ ...player, lifestyleTier: key as any })}
                        className={`p-3 rounded-xl border text-left transition-colors ${player.lifestyleTier === key ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                      >
                        <div className="font-medium text-sm">{info.label}</div>
                        <div className="text-xs mt-1 opacity-70">{info.multiplier}x cost</div>
                        <div className={`text-xs mt-1 ${info.happinessBonus > 0 ? 'text-emerald-400' : info.happinessBonus < 0 ? 'text-rose-400' : 'text-zinc-500'}`}>
                          {info.happinessBonus > 0 ? '+' : ''}{info.happinessBonus} happiness/yr
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly Expense Breakdown */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Monthly Expense Breakdown</h3>
                  <div className="space-y-3">
                    {[
                      { label: '🏠 Housing/Rent', amount: expenses.housingCost, note: player.assets.some(a => a.isPrimaryResidence) ? 'You own your home' : '' },
                      { label: '🍔 Food & Groceries', amount: expenses.foodCost },
                      { label: '🚗 Transportation', amount: expenses.transportCost },
                      { label: '💡 Utilities & Bills', amount: expenses.utilitiesCost },
                      { label: '🏥 Healthcare', amount: expenses.healthcareCost },
                      { label: '🛍️ Personal & Misc', amount: expenses.personalCost },
                      ...(expenses.kidsCost > 0 ? [{ label: `👶 Children (${player.kids.length})`, amount: expenses.kidsCost }] : []),
                      ...(expenses.petCost > 0 ? [{ label: `🐾 Pets (${(player.pets || []).length})`, amount: expenses.petCost }] : []),
                      ...(expenses.assetMaintenance > 0 ? [{ label: '🔧 Asset Maintenance', amount: expenses.assetMaintenance }] : []),
                      ...(expenses.mortgagePayments > 0 ? [{ label: '🏦 Mortgage Payments', amount: expenses.mortgagePayments }] : []),
                      ...(expenses.loanPayments > 0 ? [{ label: '💳 Loan Payments', amount: expenses.loanPayments }] : []),
                      ...(expenses.taxAmount > 0 ? [{ label: `🏛️ Taxes (${getCountryTaxRate(player.country)}%)`, amount: expenses.taxAmount }] : []),
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                        <div className="text-sm text-zinc-300">
                          {item.label}
                          {'note' in item && item.note && <span className="text-emerald-400 text-xs ml-2">✓ {item.note}</span>}
                        </div>
                        <div className="text-sm font-medium text-rose-400">
                          ${Math.floor(item.amount / 12).toLocaleString()}/mo
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t-2 border-zinc-700">
                      <div className="text-sm font-bold text-zinc-200">Total Monthly Outflows</div>
                      <div className="text-lg font-bold text-rose-400">${Math.floor(totalOutflows / 12).toLocaleString()}/mo</div>
                    </div>
                  </div>
                </div>

                {/* Income Breakdown */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Income Sources</h3>
                  <div className="space-y-3">
                    {expenses.jobIncome > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                        <span className="text-sm text-zinc-300">💼 Job Salary</span>
                        <span className="text-sm font-medium text-emerald-400">+${expenses.jobIncome.toLocaleString()}/yr</span>
                      </div>
                    )}
                    {expenses.propertyIncome > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                        <span className="text-sm text-zinc-300">🏠 Property Income</span>
                        <span className="text-sm font-medium text-emerald-400">+${expenses.propertyIncome.toLocaleString()}/yr</span>
                      </div>
                    )}
                    {expenses.businessIncome > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                        <span className="text-sm text-zinc-300">💼 Business Revenue</span>
                        <span className="text-sm font-medium text-emerald-400">+${expenses.businessIncome.toLocaleString()}/yr</span>
                      </div>
                    )}
                    {expenses.grossIncome === 0 && (
                      <div className="text-sm text-zinc-500 text-center py-2">No income sources</div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t-2 border-zinc-700">
                      <span className="text-sm font-bold text-zinc-200">Total Gross Income</span>
                      <span className="text-lg font-bold text-emerald-400">${expenses.grossIncome.toLocaleString()}/yr</span>
                    </div>
                  </div>
                </div>

                {/* Income vs Expenses Summary */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Annual Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <div className="text-zinc-400 text-xs mb-1">Gross Income</div>
                      <div className="text-xl font-bold text-emerald-400">${expenses.grossIncome.toLocaleString()}</div>
                      <div className="text-xs text-zinc-500 mt-1">Net: ${netIncome.toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <div className="text-zinc-400 text-xs mb-1">Total Expenses</div>
                      <div className="text-xl font-bold text-rose-400">${totalOutflows.toLocaleString()}</div>
                      <div className="text-xs text-zinc-500 mt-1">${Math.floor(totalOutflows / 12).toLocaleString()}/mo</div>
                    </div>
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <div className="text-zinc-400 text-xs mb-1">Net Cash Flow</div>
                      <div className={`text-xl font-bold ${yearlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {yearlyNet >= 0 ? '+' : ''}${yearlyNet.toLocaleString()}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{yearlyNet >= 0 ? '+' : ''}${Math.floor(yearlyNet / 12).toLocaleString()}/mo</div>
                    </div>
                  </div>
                </div>

                {/* Credit Profile */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Credit Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <div className="text-zinc-400 text-sm mb-1">Credit Score</div>
                      <div className={`text-2xl font-bold ${player.creditScore && player.creditScore >= 700 ? 'text-emerald-400' : player.creditScore && player.creditScore >= 600 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {player.creditScore || 600}
                      </div>
                    </div>
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <div className="text-zinc-400 text-sm mb-1">Total Debt</div>
                      <div className="text-2xl font-bold text-rose-400">
                        ${Math.ceil(player.debt || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Loans */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Active Loans</h3>
                  {(!player.loans || player.loans.length === 0) ? (
                    <div className="text-zinc-500 text-sm">You have no active loans.</div>
                  ) : (
                    <div className="space-y-4">
                      {player.loans.map(loan => {
                        const totalInterest = Math.floor(loan.monthlyPayment * loan.monthsLeft - loan.amount);
                        return (
                        <div key={loan.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <div className="font-medium text-zinc-200">{loan.type} Loan</div>
                            <div className="text-sm text-zinc-400">
                              ${Math.ceil(loan.amount).toLocaleString()} remaining @ {loan.interestRate}% APR
                            </div>
                            <div className="text-xs text-rose-400 mt-1">
                              ${Math.ceil(loan.monthlyPayment).toLocaleString()}/mo · ${Math.ceil(loan.monthlyPayment * 12).toLocaleString()}/yr · {Math.ceil(loan.monthsLeft / 12)} yrs left
                            </div>
                            {totalInterest > 0 && (
                              <div className="text-xs text-amber-400 mt-1">
                                ~${totalInterest.toLocaleString()} total interest remaining
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => payLoan(loan.id)}
                            disabled={!player.isAlive || player.money < loan.amount}
                            className="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                          >
                            Pay Off (${Math.ceil(loan.amount).toLocaleString()})
                          </button>
                        </div>
                      )})}
                    </div>
                  )}
                </div>

                {/* Take a Loan */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Take a Loan</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { type: 'Small', amount: 5000, rate: 8 },
                      { type: 'Personal', amount: 25000, rate: 12 },
                      { type: 'Business', amount: 100000, rate: 10 },
                      { type: 'Loan Shark', amount: 50000, rate: 40 }
                    ].map(loan => (
                      <button
                        key={loan.type}
                        onClick={() => takeLoan(loan.type as any)}
                        disabled={!player.isAlive}
                        className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors text-left disabled:opacity-50"
                      >
                        <div className="font-medium text-zinc-200">{loan.type} Loan</div>
                        <div className="text-sm text-emerald-400 mb-1">${loan.amount.toLocaleString()}</div>
                        <div className="text-xs text-zinc-500">{loan.rate}% APR · ~${Math.floor(loan.amount * (1 + loan.rate/100) / 60).toLocaleString()}/mo for 5 yrs</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              );
            })()}

            {activeTab === 'familytree' && (
              <FamilyTreeTab player={player} calculateNetWorth={calculateNetWorth} />
            )}

            {activeTab === 'lifestyle' && (
              <div className="space-y-8">
                {((player.parents && player.parents.some(p => !p.isDead)) || player.inGroupHome || player.guardianName) && (
                  <label className="flex items-center gap-2 text-sm text-zinc-400 mb-4 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={askParentsToPay} 
                      onChange={(e) => setAskParentsToPay(e.target.checked)} 
                      className="rounded bg-zinc-900 border-zinc-700 text-indigo-500 focus:ring-indigo-500" 
                    />
                    Ask parents/guardians to pay for social events
                  </label>
                )}
                {/* Pets Section */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Your Pets</h3>
                  </div>
                  
                  {(!player.pets || player.pets.length === 0) ? (
                    <div className="text-zinc-500 text-sm mb-6">You don't have any pets.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {player.pets.map(pet => (
                        <div key={pet.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium text-zinc-200">{pet.name}</div>
                              <div className="text-xs text-zinc-500">{pet.type} • Age {pet.age}</div>
                            </div>
                            <button onClick={() => interactWithPet(pet.id, 'sell')} className="text-xs text-rose-400 hover:text-rose-300">Sell</button>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-zinc-400">Health</span>
                                <span className={pet.health > 50 ? 'text-emerald-400' : 'text-rose-400'}>{pet.health}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className={`h-full ${pet.health > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${pet.health}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-zinc-400">Happiness</span>
                                <span className={pet.happiness > 50 ? 'text-blue-400' : 'text-amber-400'}>{pet.happiness}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className={`h-full ${pet.happiness > 50 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${pet.happiness}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-zinc-400">Loyalty</span>
                                <span className="text-indigo-400">{pet.loyalty}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${pet.loyalty}%` }} />
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => interactWithPet(pet.id, 'feed')} className="py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition-colors">Feed ($20)</button>
                            <button onClick={() => interactWithPet(pet.id, 'play')} className="py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition-colors">Play</button>
                            <button onClick={() => interactWithPet(pet.id, 'train')} className="py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition-colors">Train</button>
                            <button onClick={() => interactWithPet(pet.id, 'vet')} className="py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition-colors">Vet ($200)</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <h4 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-3">Adopt a Pet</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { type: 'Dog', cost: 300 },
                      { type: 'Cat', cost: 150 },
                      { type: 'Fish', cost: 15 },
                      { type: 'Hamster', cost: 40 },
                      { type: 'Parrot', cost: 500 },
                      { type: 'Hedgehog', cost: 200 },
                      { type: 'Ferret', cost: 250 },
                      { type: 'Turtle', cost: 100 },
                      { type: 'Monkey', cost: 5000 },
                      { type: 'Fox', cost: 3000 },
                      { type: 'Snake', cost: 250 },
                      { type: 'Tiger', cost: 50000 },
                      { type: 'Lion', cost: 60000 },
                      { type: 'Bear', cost: 40000 }
                    ].map(pet => (
                      <button
                        key={pet.type}
                        onClick={() => buyPet(pet.type, pet.cost)}
                        disabled={!player.isAlive || player.money < pet.cost}
                        className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors text-center disabled:opacity-50"
                      >
                        <div className="font-medium text-zinc-200 text-sm mb-1">{pet.type}</div>
                        <div className="text-xs text-emerald-400">${pet.cost.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Immigration Section */}
                <ImmigrationPanel
                  player={player}
                  onApplyVisa={applyForVisa}
                  onCancelVisa={cancelVisa}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dating App Modal */}
      {showDatingApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center relative">
            <button 
              onClick={() => setShowDatingApp(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-pink-500 mb-6">Dating App</h2>
            
            {datingStep === 'preference' && (
              <div className="space-y-4">
                <p className="text-zinc-300 mb-4">Who are you interested in?</p>
                <button onClick={() => startSearching('Female')} className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-pink-500 hover:bg-pink-500/10 transition-colors text-white font-medium">Women</button>
                <button onClick={() => startSearching('Male')} className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-pink-500 hover:bg-pink-500/10 transition-colors text-white font-medium">Men</button>
                <button onClick={() => startSearching('Any')} className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-pink-500 hover:bg-pink-500/10 transition-colors text-white font-medium">Anyone</button>
              </div>
            )}

            {datingStep === 'searching' && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-400 animate-pulse">Finding matches...</p>
              </div>
            )}

            {datingStep === 'match' && currentMatch && (
              <>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8">
                  <div className="w-24 h-24 bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-12 h-12 text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{currentMatch.name}, {currentMatch.age}</h3>
                  <div className="mt-4 flex justify-center items-center gap-2 text-sm text-zinc-400">
                    <span>Looks:</span>
                    <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500" style={{ width: `${currentMatch.looks}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-6">
                  <button
                    onClick={passMatch}
                    className="w-16 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <button
                    onClick={likeMatch}
                    className="w-16 h-16 rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/50 flex items-center justify-center text-pink-500 transition-colors"
                  >
                    <Heart className="w-8 h-8 fill-current" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Death Modal */}
      {player && !player.isAlive && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center">
            <h2 className="text-3xl font-bold text-red-500 mb-2">You Died</h2>
            <p className="text-zinc-400 mb-6 text-lg">You lived to be {player.age} years old.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-zinc-400">Net Worth</span>
                <span className="text-emerald-400 font-medium">${calculateNetWorth(player).toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-zinc-400">Final Career</span>
                <span className="text-zinc-200 font-medium">{player.job ? player.job.title : 'Unemployed'}</span>
              </div>
              <div className="flex justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-zinc-400">Education</span>
                <span className="text-zinc-200 font-medium">{player.education}</span>
              </div>
              <div className="flex justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-zinc-400">Children</span>
                <span className="text-zinc-200 font-medium">{(player.kids || []).length}</span>
              </div>
              <div className="flex justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-zinc-400">Real Estate Skill</span>
                <span className="text-indigo-400 font-medium">{player.realEstateSkill || 0}</span>
              </div>
              <div className="flex justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-zinc-400">Karma</span>
                <span className="text-amber-400 font-medium">{player.karma}</span>
              </div>
            </div>

            {player.kids && player.kids.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 text-left">Continue as Child</h3>
                {player.kids.map(kid => (
                  <button
                    key={kid.id}
                    onClick={() => continueAsChild(kid.id)}
                    className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-indigo-500 hover:bg-indigo-500/10 transition-colors flex justify-between items-center"
                  >
                    <span className="text-zinc-200 font-medium">{kid.name}</span>
                    <span className="text-zinc-500 text-sm">Age {kid.age}</span>
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
              >
                Start New Life
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tenant Modal */}
      {tenantModalAssetId && currentTenantOffer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button 
              onClick={closeTenantModal}
              className="absolute top-6 right-6 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-emerald-400" />
              Find a Tenant
            </h2>
            
            <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50 mb-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">{currentTenantOffer.name}</h3>
              <div className="flex items-center justify-center gap-2 text-zinc-400 mb-4">
                <span>Reliability:</span>
                <div className="flex-1 max-w-[150px] bg-zinc-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${currentTenantOffer.reliability > 70 ? 'bg-emerald-500' : currentTenantOffer.reliability > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${currentTenantOffer.reliability}%` }}
                  />
                </div>
                <span className="font-medium text-white">{currentTenantOffer.reliability}/100</span>
              </div>
              <p className="text-sm text-zinc-500">
                {currentTenantOffer.reliability > 80 ? 'Looks like a great tenant!' : 
                 currentTenantOffer.reliability > 50 ? 'Seems okay, but might be late on rent sometimes.' : 
                 'High risk of property damage and missed rent.'}
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={rejectTenant}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Reject & Find Another
              </button>
              <button 
                onClick={acceptTenant}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Accept Tenant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wedding Modal */}
      {showWeddingModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-500" />
                Plan Your Wedding
              </h2>
              <button onClick={() => setShowWeddingModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-zinc-300 mb-6">Choose a venue for your wedding with {player?.partner?.name}. Your current balance is <span className="text-emerald-400 font-bold">${player?.money.toLocaleString()}</span>.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WEDDING_VENUES.map((venue, index) => (
                  <button
                    key={index}
                    onClick={() => planWedding(venue)}
                    disabled={player!.money < venue.cost}
                    className="flex flex-col text-left p-4 rounded-xl border border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-white">{venue.name}</span>
                      <span className="text-emerald-400 font-medium">${venue.cost.toLocaleString()}</span>
                    </div>
                    <span className="text-sm text-zinc-400">{venue.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Modal */}
      {showBusinessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowBusinessModal(false)}
              className="absolute top-6 right-6 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Building className="w-6 h-6 text-emerald-400" />
              Start a Business
            </h2>
            
            <div className="space-y-8">
              {Array.from(new Set(BUSINESSES.map(b => b.category))).map(category => (
                <div key={category}>
                  <h3 className="text-lg font-bold text-zinc-300 mb-4 pb-2 border-b border-zinc-800">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {BUSINESSES.filter(b => b.category === category).map(idea => {
                      const downPayment = Math.floor(idea.basePrice * 0.2);
                      const canAffordCash = player && player.money >= idea.basePrice;
                      const canAffordMortgage = player && player.money >= downPayment;
                      
                      return (
                        <div key={idea.name} className="flex flex-col p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-left h-full">
                          <div className="font-medium text-zinc-200 mb-1">{idea.name}</div>
                          <div className="text-sm font-bold text-zinc-400 mb-4">Cost: ${idea.basePrice.toLocaleString()}</div>
                          <div className="flex flex-col gap-2 mt-auto">
                            <button
                              onClick={() => startBusiness(idea, false)}
                              disabled={!canAffordCash}
                              className="w-full py-2 px-3 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 disabled:opacity-50 transition-colors text-sm font-medium"
                            >
                              Buy Cash (${idea.basePrice.toLocaleString()})
                            </button>
                            <button
                              onClick={() => startBusiness(idea, true)}
                              disabled={!canAffordMortgage}
                              className="w-full py-2 px-3 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 disabled:opacity-50 transition-colors text-sm font-medium"
                            >
                              Mortgage (20% Down: ${downPayment.toLocaleString()})
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Family Tree Modal */}
      {showFamilyTree && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowFamilyTree(false)}
              className="absolute top-6 right-6 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-400" />
              Family Tree
            </h2>
            
            <div className="space-y-4">
              <div className="relative pl-6 border-l-2 border-zinc-800 space-y-6">
                {player?.lineage?.map((ancestor, idx) => (
                  <div key={ancestor.id} className="relative">
                    <div className="absolute -left-[33px] top-4 w-4 h-4 rounded-full bg-indigo-500 border-4 border-zinc-900" />
                    <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-zinc-200">
                          {ancestor.name} <span className="text-xs text-zinc-500 font-normal ml-2">Gen {idx + 1}</span>
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-zinc-500">Lived to:</span> <span className="text-zinc-300">{ancestor.ageAtDeath} years</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Final Job:</span> <span className="text-zinc-300">{ancestor.finalJob}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-zinc-500">Net Worth:</span> <span className="text-emerald-400">${ancestor.netWorth.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Current Player */}
                {player && (
                  <div className="relative">
                    <div className="absolute -left-[33px] top-4 w-4 h-4 rounded-full bg-emerald-500 border-4 border-zinc-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <div className="bg-zinc-950 border border-emerald-900/30 p-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-emerald-400">
                          {player.firstName} {player.lastName} <span className="text-xs text-emerald-500/50 font-normal ml-2">Gen {(player.lineage?.length || 0) + 1} (You)</span>
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-zinc-500">Current Age:</span> <span className="text-zinc-300">{player.age} years</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Current Job:</span> <span className="text-zinc-300">{player.job ? player.job.title : 'Unemployed'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-zinc-500">Net Worth:</span> <span className="text-emerald-400">${calculateNetWorth(player).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative max-h-[80vh] flex flex-col">
            <button 
              onClick={() => setShowResumeModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Resume</h2>
            <div className="overflow-y-auto flex-1 pr-2 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Education</h3>
                {(!player.degrees || player.degrees.filter(d => d !== 'None').length === 0) ? (
                  <p className="text-zinc-400 text-sm italic">No formal education.</p>
                ) : (
                  <div className="space-y-2">
                    {player.degrees.filter(d => d !== 'None').map((edu, idx) => (
                      <div key={idx} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center">
                        <GraduationCap className="w-4 h-4 text-emerald-500 mr-3" />
                        <span className="text-zinc-200 text-sm">{edu}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Work Experience</h3>
                {(!player.jobHistory || player.jobHistory.length === 0) && !player.job ? (
                  <p className="text-zinc-400 text-sm italic">No work experience yet.</p>
                ) : (
                  <div className="space-y-2">
                    {player.jobHistory?.map((job, idx) => (
                      <div key={idx} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex justify-between items-center">
                        <div className="font-medium text-zinc-200 text-sm">{job.title}</div>
                        <div className="text-xs text-zinc-500">{job.years} {job.years === 1 ? 'year' : 'years'}</div>
                      </div>
                    ))}
                    {player.job && (
                      <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="font-medium text-indigo-300 text-sm">{player.job.title}</div>
                          <div className="text-[10px] text-indigo-400/70 uppercase tracking-wider mt-1">Current Job</div>
                        </div>
                        <div className="text-xs text-indigo-400">{player.yearsInJob} {player.yearsInJob === 1 ? 'year' : 'years'}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Save Game</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Save Name</label>
              <input
                type="text"
                value={saveSlotName}
                onChange={e => setSaveSlotName(e.target.value)}
                placeholder={player ? `${player.firstName}'s Life` : 'My Save'}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                autoFocus
              />
            </div>
            <button
              onClick={() => {
                const name = saveSlotName.trim() || (player ? `${player.firstName} ${player.lastName}` : 'Unnamed Save');
                saveGameToSlot(name);
                setSaveSlotName('');
                setShowSaveModal(false);
              }}
              className="w-full p-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors mb-3"
            >
              Save as New
            </button>
            {saveSlots.length > 0 && (
              <>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 mt-4">Or overwrite existing:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {saveSlots.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()).map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => {
                        saveGameToSlot(slot.name, slot.id);
                        setSaveSlotName('');
                        setShowSaveModal(false);
                      }}
                      className="w-full flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors text-left"
                    >
                      <div>
                        <div className="font-medium text-zinc-200 text-sm">{slot.name}</div>
                        <div className="text-xs text-zinc-500">{slot.player.firstName} • Age {slot.player.age} • {new Date(slot.savedAt).toLocaleDateString()}</div>
                      </div>
                      <Save className="w-4 h-4 text-zinc-600" />
                    </button>
                  ))}
                </div>
              </>
            )}
            <button
              onClick={() => { setShowSaveModal(false); setSaveSlotName(''); }}
              className="w-full p-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors mt-3"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Exit Prompt Modal */}
      {showExitPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Exit Game</h2>
            <p className="text-zinc-400 mb-8">Do you want to save your progress before exiting?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => confirmExit(true)}
                className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
              >
                Save and Exit
              </button>
              <button
                onClick={() => confirmExit(false)}
                className="w-full p-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-500 font-bold rounded-xl transition-colors border border-rose-500/50"
              >
                Exit Without Saving
              </button>
              <button
                onClick={() => setShowExitPrompt(false)}
                className="w-full p-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Modal */}
      {currentScenario && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-2 break-words whitespace-normal">{currentScenario.title}</h2>
            <p className="text-zinc-400 mb-8 text-lg break-words whitespace-normal">{currentScenario.description}</p>
            <div className="space-y-3">
              {currentScenario.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleScenarioOption(option)}
                  className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-indigo-500 hover:bg-indigo-500/10 transition-colors text-left text-zinc-200 font-medium break-words whitespace-normal"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Will Modal */}
      {showWillModal && player && player.will?.type === 'custom' && (() => {
        const recipients = getWillRecipients(player);

        const totalAllocated = (Object.values(player.will?.customSplit || {}) as number[]).reduce((a, b) => a + b, 0);
        const isBalanced = totalAllocated === 100;

        // Count assets AND businesses assigned to each recipient
        const assetCounts: Record<string, number> = {};
        const assetValues: Record<string, number> = {};
        recipients.forEach(r => { assetCounts[r.id] = 0; assetValues[r.id] = 0; });
        let unassignedValue = 0;
        player.assets?.forEach(asset => {
          const assignee = player.will?.assetDistribution?.[asset.id];
          if (assignee && assetCounts[assignee] !== undefined) {
            assetCounts[assignee]++;
            assetValues[assignee] = (assetValues[assignee] || 0) + asset.value;
          } else {
            unassignedValue += asset.value;
          }
        });
        player.businesses?.forEach(biz => {
          const assignee = player.will?.assetDistribution?.[biz.id];
          let bizVal = biz.basePrice;
          biz.upgrades.forEach(u => { if (u.purchased) bizVal += Math.floor(biz.basePrice * u.costMultiplier); });
          if (assignee && assetCounts[assignee] !== undefined) {
            assetCounts[assignee]++;
            assetValues[assignee] = (assetValues[assignee] || 0) + bizVal;
          } else {
            unassignedValue += bizVal;
          }
        });

        return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => { setShowWillModal(false); setWillStep('edit'); }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-1">Custom Will & Testament</h2>
            <p className="text-zinc-400 mb-6 text-sm">Distribute your wealth and assign assets to specific people. All family members and friends are available as recipients.</p>
            
            {recipients.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <p className="text-lg mb-2">No recipients available</p>
                <p className="text-sm">You need family or friends to create a custom will.</p>
              </div>
            ) : (
            <div className="space-y-8">
              {willStep === 'edit' && <>
              {/* Recipients Summary Cards */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Recipients Overview</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {recipients.map(r => {
                    const pct = player.will?.customSplit?.[r.id] || 0;
                    const aCount = assetCounts[r.id] || 0;
                    const aValue = assetValues[r.id] || 0;
                    return (
                      <div key={r.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${pct > 0 || aCount > 0 ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                          <span className="text-sm font-medium text-zinc-200 truncate">{r.name}</span>
                        </div>
                        <span className="text-xs text-zinc-500 block">{r.role}</span>
                        <div className="mt-2 text-xs space-y-0.5">
                          <div className="text-indigo-400">{pct}% of money</div>
                          {aCount > 0 && <div className="text-amber-400">{aCount} asset{aCount > 1 ? 's' : ''} (${aValue.toLocaleString()})</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Money Split */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-zinc-200">Money Distribution</h3>
                  <div className={`text-sm font-bold px-3 py-1 rounded-full ${isBalanced ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {totalAllocated}% / 100%
                  </div>
                </div>
                <div className="space-y-4">
                  {recipients.map(r => {
                    const currentSplit = player.will?.customSplit?.[r.id] || 0;
                    return (
                      <div key={r.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-zinc-300">{r.name} <span className="text-zinc-600">({r.role})</span></span>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              min="0"
                              max="100"
                              value={currentSplit}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                                setPlayer(prev => {
                                  if (!prev) return prev;
                                  const newSplit = { ...(prev.will?.customSplit || {}) };
                                  newSplit[r.id] = val;
                                  return { ...prev, will: { ...prev.will, type: 'custom' as const, customSplit: newSplit } };
                                });
                              }}
                              className="w-16 text-right text-sm bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-zinc-200 focus:border-indigo-500 focus:outline-none"
                            />
                            <span className="text-zinc-500 text-sm">%</span>
                          </div>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={currentSplit}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setPlayer(prev => {
                              if (!prev) return prev;
                              const newSplit = { ...(prev.will?.customSplit || {}) };
                              newSplit[r.id] = val;
                              return { ...prev, will: { ...prev.will, type: 'custom' as const, customSplit: newSplit } };
                            });
                          }}
                          className="w-full accent-indigo-500 h-1.5"
                        />
                      </div>
                    );
                  })}
                  
                  {!isBalanced && (
                    <div className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-lg p-3">
                      ⚠ Total must equal exactly 100%. Currently at {totalAllocated}% — {totalAllocated > 100 ? `${totalAllocated - 100}% over` : `${100 - totalAllocated}% unallocated (will be lost)`}.
                    </div>
                  )}

                  <button
                    onClick={() => {
                      const count = recipients.length;
                      const base = Math.floor(100 / count);
                      const remainder = 100 % count;
                      const newSplit: Record<string, number> = {};
                      recipients.forEach((r, i) => { newSplit[r.id] = base + (i === 0 ? remainder : 0); });
                      setPlayer(prev => prev ? { ...prev, will: { ...prev.will, type: 'custom' as const, customSplit: newSplit } } : prev);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                  >
                    Split evenly
                  </button>
                </div>
              </div>

              {/* Asset Distribution */}
              {player.assets && player.assets.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-zinc-200">Asset Distribution</h3>
                    {unassignedValue > 0 && (
                      <span className="text-xs text-zinc-500">${unassignedValue.toLocaleString()} unassigned (distributed by % share)</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {player.assets.map(asset => {
                      const assignedTo = player.will?.assetDistribution?.[asset.id] || '';
                      const assignedRecipient = recipients.find(r => r.id === assignedTo);
                      return (
                        <div key={asset.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${assignedTo ? 'bg-zinc-950 border-indigo-500/20' : 'bg-zinc-950/50 border-zinc-800'}`}>
                          <div className="flex-1 min-w-0 mr-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{asset.type}</span>
                              <span className="font-medium text-zinc-200 text-sm truncate">{asset.name}</span>
                            </div>
                            <div className="text-xs text-zinc-500 mt-0.5">${asset.value.toLocaleString()}</div>
                          </div>
                          <select
                            value={assignedTo}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPlayer(prev => {
                                if (!prev) return prev;
                                const newDist = { ...(prev.will?.assetDistribution || {}) };
                                if (val) {
                                  newDist[asset.id] = val;
                                } else {
                                  delete newDist[asset.id];
                                }
                                return { ...prev, will: { ...prev.will, type: 'custom' as const, assetDistribution: newDist } };
                              });
                            }}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 min-w-[140px]"
                          >
                            <option value="">🔨 Liquidate (Sell)</option>
                            {recipients.map(r => (
                              <option key={r.id} value={r.id}>→ {r.name}</option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick assign buttons */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button
                      onClick={() => {
                        const newDist: Record<string, string> = { ...(player.will?.assetDistribution || {}) };
                        player.assets?.forEach(asset => { newDist[asset.id] = ''; });
                        setPlayer(prev => prev ? { ...prev, will: { ...prev.will, type: 'custom' as const, assetDistribution: newDist } } : prev);
                      }}
                      className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors"
                    >
                      Liquidate All Assets
                    </button>
                    {recipients.length > 0 && (
                      <button
                        onClick={() => {
                          const newDist: Record<string, string> = { ...(player.will?.assetDistribution || {}) };
                          player.assets?.forEach((asset, i) => {
                            newDist[asset.id] = recipients[i % recipients.length].id;
                          });
                          setPlayer(prev => prev ? { ...prev, will: { ...prev.will, type: 'custom' as const, assetDistribution: newDist } } : prev);
                        }}
                        className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors"
                      >
                        Distribute Assets Evenly
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Business Distribution */}
              {player.businesses && player.businesses.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-zinc-200">Business Distribution</h3>
                  </div>
                  <div className="space-y-2">
                    {player.businesses.map(biz => {
                      const assignedTo = player.will?.assetDistribution?.[biz.id] || '';
                      let bizVal = biz.basePrice;
                      biz.upgrades.forEach(u => { if (u.purchased) bizVal += Math.floor(biz.basePrice * u.costMultiplier); });
                      return (
                        <div key={biz.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${assignedTo ? 'bg-zinc-950 border-indigo-500/20' : 'bg-zinc-950/50 border-zinc-800'}`}>
                          <div className="flex-1 min-w-0 mr-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Business</span>
                              <span className="font-medium text-zinc-200 text-sm truncate">{biz.name}</span>
                            </div>
                            <div className="text-xs text-zinc-500 mt-0.5">${bizVal.toLocaleString()} • {biz.category}</div>
                          </div>
                          <select
                            value={assignedTo}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPlayer(prev => {
                                if (!prev) return prev;
                                const newDist = { ...(prev.will?.assetDistribution || {}) };
                                if (val) {
                                  newDist[biz.id] = val;
                                } else {
                                  delete newDist[biz.id];
                                }
                                return { ...prev, will: { ...prev.will, type: 'custom' as const, assetDistribution: newDist } };
                              });
                            }}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 min-w-[140px]"
                          >
                            <option value="">🔨 Liquidate (Sell)</option>
                            {recipients.map(r => (
                              <option key={r.id} value={r.id}>→ {r.name}</option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              </>}
              
              {willStep === 'edit' && (
                <button
                  onClick={() => setWillStep('preview')}
                  className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors mt-4"
                >
                  Preview Distribution →
                </button>
              )}

              {willStep === 'preview' && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-bold text-white border-b border-zinc-700 pb-2">📋 Distribution Preview</h3>
                  
                  {/* Money preview */}
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400 mb-2">💰 Money Distribution</h4>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1">
                      {recipients.filter(r => (player.will?.customSplit?.[r.id] || 0) > 0).map(r => (
                        <div key={r.id} className="flex justify-between text-sm">
                          <span className="text-zinc-300">{r.name} <span className="text-zinc-600">({r.role})</span></span>
                          <span className="text-indigo-400 font-medium">{player.will?.customSplit?.[r.id] || 0}% → ${Math.floor(player.money * (player.will?.customSplit?.[r.id] || 0) / 100).toLocaleString()}</span>
                        </div>
                      ))}
                      {!isBalanced && <div className="text-xs text-rose-400 mt-1">⚠ Percentages don't add up to 100%</div>}
                    </div>
                  </div>

                  {/* Assets preview */}
                  {player.assets.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-400 mb-2">🏠 Assets</h4>
                      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1">
                        {player.assets.map(asset => {
                          const assignee = player.will?.assetDistribution?.[asset.id];
                          const recipientName = assignee ? recipients.find(r => r.id === assignee)?.name || 'Unknown' : 'Auto-distribute by %';
                          return (
                            <div key={asset.id} className="flex justify-between text-sm">
                              <span className="text-zinc-300">{asset.name} <span className="text-zinc-600">(${asset.value.toLocaleString()})</span></span>
                              <span className={assignee ? 'text-emerald-400' : 'text-zinc-500'}>{recipientName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Businesses preview */}
                  {player.businesses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-400 mb-2">🏢 Businesses</h4>
                      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1">
                        {player.businesses.map(biz => {
                          const assignee = player.will?.assetDistribution?.[biz.id];
                          const recipientName = assignee ? recipients.find(r => r.id === assignee)?.name || 'Unknown' : 'Auto-distribute by %';
                          let bizVal = biz.basePrice;
                          biz.upgrades.forEach(u => { if (u.purchased) bizVal += Math.floor(biz.basePrice * u.costMultiplier); });
                          return (
                            <div key={biz.id} className="flex justify-between text-sm">
                              <span className="text-zinc-300">{biz.name} <span className="text-zinc-600">(${bizVal.toLocaleString()})</span></span>
                              <span className={assignee ? 'text-emerald-400' : 'text-zinc-500'}>{recipientName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setWillStep('edit')}
                      className="flex-1 p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl transition-colors"
                    >
                      ← Back to Edit
                    </button>
                    <button
                      onClick={() => {
                        setWillStep('confirmed');
                        setTimeout(() => {
                          setShowWillModal(false);
                          setWillStep('edit');
                          addLog('✅ You finalized your custom will.', 'success');
                        }, 1500);
                      }}
                      className="flex-1 p-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors"
                    >
                      ✓ Confirm & Finalize
                    </button>
                  </div>
                </div>
              )}

              {willStep === 'confirmed' && (
                <div className="mt-6 text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-xl font-bold text-emerald-400">Will Finalized</h3>
                  <p className="text-zinc-500 text-sm mt-1">Your wishes have been recorded.</p>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
        );
      })()}
    </div>
  );
}
