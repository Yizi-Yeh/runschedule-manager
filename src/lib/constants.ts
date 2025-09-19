export const DAYS_OF_WEEK = [
  { value: 0, label: '週日', short: '日' },
  { value: 1, label: '週一', short: '一' },
  { value: 2, label: '週二', short: '二' },
  { value: 3, label: '週三', short: '三' },
  { value: 4, label: '週四', short: '四' },
  { value: 5, label: '週五', short: '五' },
  { value: 6, label: '週六', short: '六' },
];

export const TIME_SLOTS = [
  { value: 'morning', label: '早上', defaultTime: '07:00' },
  { value: 'afternoon', label: '下午', defaultTime: '14:00' },
  { value: 'evening', label: '晚上', defaultTime: '18:00' },
];

export const TRAINING_TYPES = [
  { value: 'warmup', label: '暖身', color: '#4CAF50' },
  { value: 'main', label: '主訓練', color: '#2196F3' },
  { value: 'cooldown', label: '收操', color: '#FF9800' },
];

export const PACE_ZONES = [
  { name: 'E配速', description: '輕鬆跑', color: '#4CAF50' },
  { name: 'M配速', description: '馬拉松配速', color: '#2196F3' },
  { name: 'T配速', description: '節奏跑', color: '#FF9800' },
  { name: 'I配速', description: '間歇跑', color: '#F44336' },
  { name: 'R配速', description: '重複跑', color: '#9C27B0' },
];

export const COMMON_TRAINING_TEMPLATES = [
  {
    type: 'warmup',
    title: '標準暖身',
    description: '輕鬆跑 + 動態熱身',
    distance: 1.5,
    duration: 15,
  },
  {
    type: 'main',
    title: '輕鬆跑',
    description: 'E配速持續跑',
    pace: 'E配速',
  },
  {
    type: 'main',
    title: '節奏跑',
    description: 'T配速訓練',
    pace: 'T配速',
  },
  {
    type: 'main',
    title: '間歇訓練',
    description: 'I配速間歇跑',
    pace: 'I配速',
    sets: 6,
    rest: 90,
  },
  {
    type: 'cooldown',
    title: '標準收操',
    description: '輕鬆跑 + 伸展',
    distance: 1,
    duration: 10,
  },
];

export const DEFAULT_TIME_PREFERENCES = {
  defaultTimeSlot: 'morning' as const,
  customTimes: {
    morning: '07:00',
    afternoon: '14:00',
    evening: '18:00',
  },
  estimatedDuration: {
    warmup: 15,
    main: 60,
    cooldown: 10,
  },
};

export const WEEK_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);

export const STORAGE_KEYS = {
  SEASONS: 'runschedule_seasons',
  SETTINGS: 'runschedule_settings',
  CURRENT_SEASON: 'runschedule_current_season',
} as const;