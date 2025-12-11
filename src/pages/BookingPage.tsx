import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Navbar } from '@/components/layout/Navbar';
import { DateSelector } from '@/components/booking/DateSelector';
import { CourtSelector } from '@/components/booking/CourtSelector';
import { TimeSlotsGrid } from '@/components/booking/TimeSlotsGrid';
import { EquipmentSelector } from '@/components/booking/EquipmentSelector';
import { CoachSelector } from '@/components/booking/CoachSelector';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { useCourts } from '@/hooks/useCourts';
import { useEquipment } from '@/hooks/useEquipment';
import { useCoaches } from '@/hooks/useCoaches';
import { usePricingRules } from '@/hooks/usePricingRules';
import { useCourtBookings, useCoachBookings, useCreateBooking } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Court, Coach, Equipment, TimeSlot, DayOfWeek } from '@/types/database';
import { calculatePrice, generateTimeSlots, getDayOfWeek, isPeakHour } from '@/lib/pricing';
import { toast } from 'sonner';

export default function BookingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<{ equipment: Equipment; quantity: number }[]>([]);

  const { data: courts = [] } = useCourts();
  const { data: equipment = [] } = useEquipment();
  const { data: coaches = [] } = useCoaches();
  const { data: pricingRules = [] } = usePricingRules();
  
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const { data: courtBookings = [] } = useCourtBookings(selectedCourt?.id || '', dateStr);
  const { data: coachBookings = [] } = useCoachBookings(selectedCoach?.id || null, dateStr);
  
  const createBooking = useCreateBooking();

  const timeSlots = useMemo((): TimeSlot[] => {
    if (!selectedCourt) return [];
    const slots = generateTimeSlots(6, 22);
    const bookedTimes = new Set(courtBookings.map(b => b.start_time));
    
    return slots.map(time => {
      const hour = parseInt(time.split(':')[0]);
      const price = calculatePrice(selectedCourt, null, [], hour, selectedDate, pricingRules);
      return {
        time,
        hour,
        available: !bookedTimes.has(time),
        price: price.basePrice + price.peakHourFee + price.weekendFee + price.indoorPremiumFee,
        isPeak: isPeakHour(hour, pricingRules),
      };
    });
  }, [selectedCourt, courtBookings, selectedDate, pricingRules]);

  const coachAvailability = useMemo(() => {
    const availability: Record<string, boolean> = {};
    if (!selectedTime) return availability;
    
    coaches.forEach(coach => {
      const isBooked = coachBookings.some(b => b.coach_id === coach.id && b.start_time === selectedTime);
      availability[coach.id] = !isBooked;
    });
    return availability;
  }, [coaches, coachBookings, selectedTime]);

  const priceBreakdown = useMemo(() => {
    if (!selectedCourt || !selectedTime) {
      return { basePrice: 0, peakHourFee: 0, weekendFee: 0, indoorPremiumFee: 0, equipmentFee: 0, coachFee: 0, total: 0 };
    }
    const hour = parseInt(selectedTime.split(':')[0]);
    return calculatePrice(selectedCourt, selectedCoach, selectedEquipment, hour, selectedDate, pricingRules);
  }, [selectedCourt, selectedCoach, selectedEquipment, selectedTime, selectedDate, pricingRules]);

  const handleEquipmentChange = (eq: Equipment, quantity: number) => {
    setSelectedEquipment(prev => {
      if (quantity <= 0) return prev.filter(e => e.equipment.id !== eq.id);
      const existing = prev.find(e => e.equipment.id === eq.id);
      if (existing) return prev.map(e => e.equipment.id === eq.id ? { ...e, quantity } : e);
      return [...prev, { equipment: eq, quantity }];
    });
  };

  const handleConfirm = async () => {
    if (!selectedCourt || !selectedTime || !user) return;
    
    const endHour = parseInt(selectedTime.split(':')[0]) + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:00:00`;
    
    try {
      await createBooking.mutateAsync({
        courtId: selectedCourt.id,
        coachId: selectedCoach?.id || null,
        bookingDate: dateStr,
        startTime: selectedTime,
        endTime,
        basePrice: priceBreakdown.basePrice,
        peakHourFee: priceBreakdown.peakHourFee,
        weekendFee: priceBreakdown.weekendFee,
        indoorPremiumFee: priceBreakdown.indoorPremiumFee,
        equipmentFee: priceBreakdown.equipmentFee,
        coachFee: priceBreakdown.coachFee,
        totalPrice: priceBreakdown.total,
        equipment: selectedEquipment.map(e => ({ equipmentId: e.equipment.id, quantity: e.quantity, price: e.equipment.price_per_hour * e.quantity })),
      });
      toast.success('Booking confirmed!');
      navigate('/my-bookings');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Book a Court</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <CourtSelector courts={courts} selectedCourtId={selectedCourt?.id || null} onSelect={setSelectedCourt} />
            {selectedCourt && <TimeSlotsGrid slots={timeSlots} selectedTime={selectedTime} onSelect={setSelectedTime} />}
            {selectedTime && <EquipmentSelector equipment={equipment} selectedEquipment={selectedEquipment} bookedQuantities={{}} onQuantityChange={handleEquipmentChange} />}
            {selectedTime && <CoachSelector coaches={coaches} selectedCoachId={selectedCoach?.id || null} coachAvailability={coachAvailability} onSelect={setSelectedCoach} />}
          </div>
          
          {selectedCourt && selectedTime && (
            <div className="lg:col-span-1">
              <BookingSummary court={selectedCourt} date={selectedDate} startTime={selectedTime} coach={selectedCoach} selectedEquipment={selectedEquipment} priceBreakdown={priceBreakdown} onConfirm={handleConfirm} isLoading={createBooking.isPending} isLoggedIn={!!user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
