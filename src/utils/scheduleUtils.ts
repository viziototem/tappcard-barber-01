import { DaySchedule } from '../types';

export interface BusinessStatusResult {
  isOpen: boolean;
  statusText: string;
  detailText: string;
}

/**
 * Calculates whether the barbershop is currently open and returns descriptive status text.
 */
export function calculateBusinessStatus(schedule: DaySchedule[]): BusinessStatusResult {
  const now = new Date();
  const currentDayIndex = now.getDay(); // 0: Dom, 1: Seg, ..., 6: Sab
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeVal = currentHours * 60 + currentMinutes;

  const todaySchedule = schedule.find(s => s.dayIndex === currentDayIndex);

  // If today is closed all day or not enabled or no periods
  if (!todaySchedule || !todaySchedule.enabled || todaySchedule.closedAllDay || !todaySchedule.periods?.length) {
    // Find next opening day
    const nextOpening = findNextOpening(schedule, currentDayIndex);
    return {
      isOpen: false,
      statusText: 'Fechado agora',
      detailText: nextOpening
    };
  }

  // Check today's periods
  for (const period of todaySchedule.periods) {
    const [startH, startM] = period.opening.split(':').map(Number);
    const [endH, endM] = period.closing.split(':').map(Number);
    const startVal = startH * 60 + (startM || 0);
    const endVal = endH * 60 + (endM || 0);

    if (currentTimeVal >= startVal && currentTimeVal < endVal) {
      return {
        isOpen: true,
        statusText: 'Aberto agora',
        detailText: `Aberto até às ${period.closing}`
      };
    }
  }

  // If before first period today
  const firstPeriod = todaySchedule.periods[0];
  const [firstStartH, firstStartM] = firstPeriod.opening.split(':').map(Number);
  const firstStartVal = firstStartH * 60 + (firstStartM || 0);

  if (currentTimeVal < firstStartVal) {
    return {
      isOpen: false,
      statusText: 'Fechado agora',
      detailText: `Abrimos hoje às ${firstPeriod.opening}`
    };
  }

  // If between periods (e.g. lunch break)
  for (let i = 0; i < todaySchedule.periods.length - 1; i++) {
    const currentClosing = todaySchedule.periods[i].closing;
    const nextOpening = todaySchedule.periods[i + 1].opening;
    const [endH, endM] = currentClosing.split(':').map(Number);
    const [nextH, nextM] = nextOpening.split(':').map(Number);

    if (currentTimeVal >= endH * 60 + endM && currentTimeVal < nextH * 60 + nextM) {
      return {
        isOpen: false,
        statusText: 'Fechado agora',
        detailText: `Reabrimos hoje às ${nextOpening}`
      };
    }
  }

  // After all periods today -> find next opening day
  const nextOpening = findNextOpening(schedule, currentDayIndex);
  return {
    isOpen: false,
    statusText: 'Fechado agora',
    detailText: nextOpening
  };
}

function findNextOpening(schedule: DaySchedule[], currentDayIndex: number): string {
  for (let i = 1; i <= 7; i++) {
    const checkIndex = (currentDayIndex + i) % 7;
    const day = schedule.find(s => s.dayIndex === checkIndex);
    if (day && day.enabled && !day.closedAllDay && day.periods?.length) {
      const dayLabel = i === 1 ? 'amanhã' : `na ${day.shortName}`;
      return `Abrimos ${dayLabel} às ${day.periods[0].opening}`;
    }
  }
  return 'Consulte nossos horários';
}
