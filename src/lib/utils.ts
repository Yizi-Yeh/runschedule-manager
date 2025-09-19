import { format, startOfWeek, addWeeks } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';
import { TrainingItem, DayTraining, WeekTraining, Season } from '@/types';

export function generateId(): string {
  return uuidv4();
}

export function formatDate(date: Date, formatStr: string = 'yyyy/MM/dd'): string {
  return format(date, formatStr, { locale: zhTW });
}

export function getWeekStartDate(seasonStartDate: Date, weekNumber: number): Date {
  return addWeeks(startOfWeek(seasonStartDate, { weekStartsOn: 1 }), weekNumber - 1);
}

export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

export function createEmptyTrainingItem(type: TrainingItem['type']): Omit<TrainingItem, 'id'> {
  return {
    type,
    title: '',
    description: '',
    notes: '',
  };
}

export function createEmptyDayTraining(dayOfWeek: number): DayTraining {
  return {
    id: generateId(),
    dayOfWeek,
    trainingItems: [],
  };
}

export function createEmptyWeekTraining(weekNumber: number): WeekTraining {
  const days = Array.from({ length: 7 }, (_, i) => createEmptyDayTraining(i));

  return {
    id: generateId(),
    weekNumber,
    days,
  };
}

export function createEmptySeason(name: string, startDate: Date, totalWeeks: number = 12): Season {
  const weeks = Array.from({ length: totalWeeks }, (_, i) =>
    createEmptyWeekTraining(i + 1)
  );

  return {
    id: generateId(),
    name,
    startDate,
    totalWeeks,
    weeks,
    auxiliaryTrainings: [],
    timePreferences: {
      defaultTimeSlot: 'morning',
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
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function calculateTrainingDuration(trainingItems: TrainingItem[]): number {
  return trainingItems.reduce((total, item) => {
    if (item.duration) {
      return total + item.duration;
    }
    return total;
  }, 0);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}小時${mins > 0 ? `${mins}分鐘` : ''}`;
  }
  return `${mins}分鐘`;
}

export function formatDistance(distance: number): string {
  if (distance >= 1) {
    return `${distance}公里`;
  }
  return `${distance * 1000}公尺`;
}

export function parseTrainingText(text: string): Record<string, Record<string, Omit<TrainingItem, 'id'>[]>> {
  const lines = text.split('\n').filter(line => line.trim());
  const result: Record<string, Record<string, Omit<TrainingItem, 'id'>[]>> = {};

  let currentWeek = null;
  let currentDay = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    const weekMatch = trimmedLine.match(/[Ww](\d+)|第(\d+)週|週(\d+)/);
    if (weekMatch) {
      currentWeek = parseInt(weekMatch[1] || weekMatch[2] || weekMatch[3]);
      result[currentWeek] = {};
      continue;
    }

    const dayMatch = trimmedLine.match(/(週[一二三四五六日]|星期[一二三四五六日]|[一二三四五六日])/);
    if (dayMatch && currentWeek) {
      const dayMap: { [key: string]: number } = {
        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 0
      };
      const dayChar = dayMatch[0].slice(-1);
      currentDay = dayMap[dayChar];
      if (currentDay !== undefined) {
        result[currentWeek][currentDay] = [];
      }
      continue;
    }

    if (currentWeek && currentDay !== null && trimmedLine) {
      const trainingItem = parseTrainingLine(trimmedLine);
      if (trainingItem) {
        result[currentWeek][currentDay].push(trainingItem);
      }
    }
  }

  return result;
}

function parseTrainingLine(line: string): Omit<TrainingItem, 'id'> | null {
  const distanceMatch = line.match(/(\d+\.?\d*)[公里kmKM]/);
  const timeMatch = line.match(/(\d+)分鐘?/);
  const paceMatch = line.match(/([EMTIR]配速|輕鬆|節奏|間歇)/);
  const setsMatch = line.match(/(\d+)(?:組|次|趟)/);

  let type: TrainingItem['type'] = 'main';
  if (line.includes('暖身') || line.includes('熱身')) {
    type = 'warmup';
  } else if (line.includes('收操') || line.includes('伸展') || line.includes('放鬆')) {
    type = 'cooldown';
  }

  return {
    type,
    title: line.length > 20 ? line.substring(0, 20) + '...' : line,
    description: line,
    distance: distanceMatch ? parseFloat(distanceMatch[1]) : undefined,
    duration: timeMatch ? parseInt(timeMatch[1]) : undefined,
    pace: paceMatch ? paceMatch[1] : undefined,
    sets: setsMatch ? parseInt(setsMatch[1]) : undefined,
  };
}

export function exportSeasonData(season: Season): string {
  return JSON.stringify(season, null, 2);
}

export function validateSeasonData(data: unknown): boolean {
  try {
    const season = data as Season;
    return (
      season &&
      typeof season.id === 'string' &&
      typeof season.name === 'string' &&
      season.startDate &&
      typeof season.totalWeeks === 'number' &&
      Array.isArray(season.weeks)
    );
  } catch {
    return false;
  }
}