import { PricingRule, Court, Coach, Equipment, DayOfWeek, PriceBreakdown } from '@/types/database';

export function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()] as DayOfWeek;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isPeakHour(hour: number, rules: PricingRule[]): boolean {
  const peakRule = rules.find(r => r.rule_type === 'peak_hour' && r.is_active);
  if (!peakRule || peakRule.start_hour === null || peakRule.end_hour === null) return false;
  return hour >= peakRule.start_hour && hour < peakRule.end_hour;
}

export function calculatePrice(
  court: Court,
  coach: Coach | null,
  selectedEquipment: { equipment: Equipment; quantity: number }[],
  hour: number,
  date: Date,
  rules: PricingRule[]
): PriceBreakdown {
  let basePrice = court.base_price;
  let peakHourFee = 0;
  let weekendFee = 0;
  let indoorPremiumFee = 0;
  let equipmentFee = 0;
  let coachFee = 0;

  // Apply peak hour rule
  const peakRule = rules.find(r => r.rule_type === 'peak_hour' && r.is_active);
  if (peakRule && peakRule.start_hour !== null && peakRule.end_hour !== null) {
    if (hour >= peakRule.start_hour && hour < peakRule.end_hour) {
      peakHourFee = basePrice * (peakRule.multiplier - 1) + peakRule.surcharge;
    }
  }

  // Apply weekend rule
  const weekendRule = rules.find(r => r.rule_type === 'weekend' && r.is_active);
  if (weekendRule && isWeekend(date)) {
    weekendFee = weekendRule.surcharge;
  }

  // Apply indoor premium rule
  const indoorRule = rules.find(r => r.rule_type === 'indoor_premium' && r.is_active);
  if (indoorRule && court.court_type === 'indoor') {
    indoorPremiumFee = indoorRule.surcharge;
  }

  // Calculate equipment fee
  for (const item of selectedEquipment) {
    equipmentFee += item.equipment.price_per_hour * item.quantity;
  }

  // Calculate coach fee
  if (coach) {
    coachFee = coach.hourly_rate;
  }

  const total = basePrice + peakHourFee + weekendFee + indoorPremiumFee + equipmentFee + coachFee;

  return {
    basePrice,
    peakHourFee,
    weekendFee,
    indoorPremiumFee,
    equipmentFee,
    coachFee,
    total,
  };
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function generateTimeSlots(startHour: number = 6, endHour: number = 22): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00:00`);
  }
  return slots;
}
