export type CourtType = 'indoor' | 'outdoor';
export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlist';
export type EquipmentType = 'racket' | 'shoes';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Court {
  id: string;
  name: string;
  court_type: CourtType;
  base_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: string;
  name: string;
  equipment_type: EquipmentType;
  total_stock: number;
  price_per_hour: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Coach {
  id: string;
  name: string;
  bio: string | null;
  hourly_rate: number;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoachAvailability {
  id: string;
  coach_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface PricingRule {
  id: string;
  name: string;
  description: string | null;
  rule_type: string;
  multiplier: number;
  surcharge: number;
  start_hour: number | null;
  end_hour: number | null;
  applies_to_days: DayOfWeek[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  court_id: string;
  coach_id: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  base_price: number;
  peak_hour_fee: number;
  weekend_fee: number;
  indoor_premium_fee: number;
  equipment_fee: number;
  coach_fee: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  court?: Court;
  coach?: Coach;
}

export interface BookingEquipment {
  id: string;
  booking_id: string;
  equipment_id: string;
  quantity: number;
  price_charged: number;
  created_at: string;
  equipment?: Equipment;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  time: string;
  hour: number;
  available: boolean;
  price: number;
  isPeak: boolean;
}

export interface PriceBreakdown {
  basePrice: number;
  peakHourFee: number;
  weekendFee: number;
  indoorPremiumFee: number;
  equipmentFee: number;
  coachFee: number;
  total: number;
}
