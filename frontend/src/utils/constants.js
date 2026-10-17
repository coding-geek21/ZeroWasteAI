export const API_BASE_URL = '/api';

export const RISK_COLORS = {
  HIGH: 'red',
  MEDIUM: 'yellow',
  LOW: 'green',
  CRITICAL: 'red',
};

export const RISK_LABELS = {
  HIGH: 'High Risk',
  MEDIUM: 'Medium Risk',
  LOW: 'Low Risk',
  CRITICAL: 'Critical',
};

export const CATEGORY_ICONS = {
  dairy: '🥛',
  meat: '🥩',
  produce: '🥦',
  bakery: '🍞',
  seafood: '🐟',
  frozen: '🧊',
  beverages: '🥤',
  snacks: '🍿',
  condiments: '🫙',
  grains: '🌾',
  legumes: '🫘',
  herbs: '🌿',
  other: '📦',
};

export const CATEGORIES = [
  'dairy',
  'meat',
  'produce',
  'bakery',
  'seafood',
  'frozen',
  'beverages',
  'snacks',
  'condiments',
  'grains',
  'legumes',
  'herbs',
  'other',
];

export const UNITS = ['kg', 'g', 'lbs', 'oz', 'L', 'ml', 'units', 'pcs', 'dozen', 'pack'];

export const ACTION_TYPES = {
  DISCOUNT: 'DISCOUNT',
  RECIPE: 'RECIPE',
  DONATE: 'DONATE',
  ALERT: 'ALERT',
};

export const BADGES = [
  {
    id: 'zero_hero',
    name: 'Zero Hero',
    description: 'Saved your first item from waste',
    icon: '🦸',
    requirement: 'Save 1 item',
    threshold: 1,
  },
  {
    id: 'waste_warrior',
    name: 'Waste Warrior',
    description: 'Saved 50 kg of food from going to waste',
    icon: '⚔️',
    requirement: 'Save 50 kg',
    threshold: 50,
  },
  {
    id: 'eco_champion',
    name: 'Eco Champion',
    description: 'Prevented 100 kg of CO₂ emissions',
    icon: '🌍',
    requirement: 'Prevent 100 kg CO₂',
    threshold: 100,
  },
  {
    id: 'community_feeder',
    name: 'Community Feeder',
    description: 'Donated food for 100 meals',
    icon: '🤝',
    requirement: 'Donate 100 meals',
    threshold: 100,
  },
  {
    id: 'smart_saver',
    name: 'Smart Saver',
    description: 'Recovered $500 in food value',
    icon: '💰',
    requirement: 'Recover $500',
    threshold: 500,
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Logged food for 30 consecutive days',
    icon: '🔥',
    requirement: '30-day streak',
    threshold: 30,
  },
  {
    id: 'sustainability_sage',
    name: 'Sustainability Sage',
    description: 'Achieved zero waste for a full week',
    icon: '🧙',
    requirement: 'Zero waste week',
    threshold: 7,
  },
];

export const PERIOD_OPTIONS = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'grocery', label: 'Grocery Store' },
  { value: 'household', label: 'Household' },
  { value: 'cafe', label: 'Café' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'school', label: 'School / Institution' },
];
