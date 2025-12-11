import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Booking, BookingEquipment } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export function useBookings() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          court:courts(*),
          coach:coaches(*)
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });
      
      if (error) throw error;
      return data as (Booking & { court: any; coach: any })[];
    },
    enabled: !!user,
  });
}

export function useCourtBookings(courtId: string, date: string) {
  return useQuery({
    queryKey: ['court-bookings', courtId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('court_id', courtId)
        .eq('booking_date', date)
        .eq('status', 'confirmed');
      
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!courtId && !!date,
  });
}

export function useCoachBookings(coachId: string | null, date: string) {
  return useQuery({
    queryKey: ['coach-bookings', coachId, date],
    queryFn: async () => {
      if (!coachId) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('coach_id', coachId)
        .eq('booking_date', date)
        .eq('status', 'confirmed');
      
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!coachId && !!date,
  });
}

export function useEquipmentBookings(date: string, startTime: string, endTime: string) {
  return useQuery({
    queryKey: ['equipment-bookings', date, startTime, endTime],
    queryFn: async () => {
      // Get all confirmed bookings for the given date that overlap with the time slot
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_date', date)
        .eq('status', 'confirmed')
        .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`);
      
      if (bookingsError) throw bookingsError;
      if (!bookings || bookings.length === 0) return [];
      
      const bookingIds = bookings.map(b => b.id);
      
      const { data: equipmentBookings, error } = await supabase
        .from('booking_equipment')
        .select(`
          *,
          equipment:equipment(*)
        `)
        .in('booking_id', bookingIds);
      
      if (error) throw error;
      return equipmentBookings as (BookingEquipment & { equipment: any })[];
    },
    enabled: !!date && !!startTime && !!endTime,
  });
}

interface CreateBookingParams {
  courtId: string;
  coachId: string | null;
  bookingDate: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  peakHourFee: number;
  weekendFee: number;
  indoorPremiumFee: number;
  equipmentFee: number;
  coachFee: number;
  totalPrice: number;
  equipment: { equipmentId: string; quantity: number; price: number }[];
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (params: CreateBookingParams) => {
      if (!user) throw new Error('Must be logged in');
      
      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          court_id: params.courtId,
          coach_id: params.coachId,
          booking_date: params.bookingDate,
          start_time: params.startTime,
          end_time: params.endTime,
          base_price: params.basePrice,
          peak_hour_fee: params.peakHourFee,
          weekend_fee: params.weekendFee,
          indoor_premium_fee: params.indoorPremiumFee,
          equipment_fee: params.equipmentFee,
          coach_fee: params.coachFee,
          total_price: params.totalPrice,
          status: 'confirmed',
        })
        .select()
        .single();
      
      if (bookingError) throw bookingError;
      
      // Add equipment if any
      if (params.equipment.length > 0) {
        const equipmentInserts = params.equipment.map(eq => ({
          booking_id: booking.id,
          equipment_id: eq.equipmentId,
          quantity: eq.quantity,
          price_charged: eq.price,
        }));
        
        const { error: equipmentError } = await supabase
          .from('booking_equipment')
          .insert(equipmentInserts);
        
        if (equipmentError) throw equipmentError;
      }
      
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['court-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['coach-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['equipment-bookings'] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['court-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['coach-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['equipment-bookings'] });
    },
  });
}
