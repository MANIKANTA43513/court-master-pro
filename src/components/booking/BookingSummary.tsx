import { PriceBreakdown, Court, Coach, Equipment } from '@/types/database';
import { formatCurrency, formatTime } from '@/lib/pricing';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Package } from 'lucide-react';

interface BookingSummaryProps {
  court: Court;
  date: Date;
  startTime: string;
  coach: Coach | null;
  selectedEquipment: { equipment: Equipment; quantity: number }[];
  priceBreakdown: PriceBreakdown;
  onConfirm: () => void;
  isLoading: boolean;
  isLoggedIn: boolean;
}

export function BookingSummary({
  court,
  date,
  startTime,
  coach,
  selectedEquipment,
  priceBreakdown,
  onConfirm,
  isLoading,
  isLoggedIn,
}: BookingSummaryProps) {
  const endHour = parseInt(startTime.split(':')[0]) + 1;
  const endTime = `${endHour.toString().padStart(2, '0')}:00:00`;

  return (
    <div className="sticky top-24 rounded-2xl bg-card border border-border overflow-hidden">
      <div className="bg-gradient-primary p-6 text-primary-foreground">
        <h3 className="font-display text-xl font-bold">Booking Summary</h3>
        <p className="text-sm opacity-80">Review your booking details</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Court</p>
              <p className="font-semibold">{court.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{court.court_type}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-semibold">{format(date, 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-semibold">
                {formatTime(startTime)} - {formatTime(endTime)}
              </p>
            </div>
          </div>

          {coach && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coach</p>
                <p className="font-semibold">{coach.name}</p>
              </div>
            </div>
          )}

          {selectedEquipment.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipment</p>
                {selectedEquipment.map((item) => (
                  <p key={item.equipment.id} className="font-semibold">
                    {item.quantity}x {item.equipment.name}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Price</span>
            <span>{formatCurrency(priceBreakdown.basePrice)}</span>
          </div>
          
          {priceBreakdown.peakHourFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Peak Hour Fee</span>
              <span className="text-accent">+{formatCurrency(priceBreakdown.peakHourFee)}</span>
            </div>
          )}
          
          {priceBreakdown.weekendFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Weekend Fee</span>
              <span className="text-accent">+{formatCurrency(priceBreakdown.weekendFee)}</span>
            </div>
          )}
          
          {priceBreakdown.indoorPremiumFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Indoor Premium</span>
              <span className="text-accent">+{formatCurrency(priceBreakdown.indoorPremiumFee)}</span>
            </div>
          )}
          
          {priceBreakdown.equipmentFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Equipment</span>
              <span>+{formatCurrency(priceBreakdown.equipmentFee)}</span>
            </div>
          )}
          
          {priceBreakdown.coachFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Coach</span>
              <span>+{formatCurrency(priceBreakdown.coachFee)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(priceBreakdown.total)}</span>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={onConfirm}
          disabled={isLoading || !isLoggedIn}
          className="w-full"
          variant="hero"
          size="lg"
        >
          {isLoading ? 'Booking...' : isLoggedIn ? 'Confirm Booking' : 'Sign in to Book'}
        </Button>

        {!isLoggedIn && (
          <p className="text-xs text-center text-muted-foreground">
            Please sign in to complete your booking
          </p>
        )}
      </div>
    </div>
  );
}
