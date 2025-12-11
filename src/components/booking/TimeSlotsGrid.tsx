import { TimeSlot } from '@/types/database';
import { cn } from '@/lib/utils';
import { formatTime, formatCurrency } from '@/lib/pricing';
import { Clock, Zap } from 'lucide-react';

interface TimeSlotsGridProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotsGrid({ slots, selectedTime, onSelect }: TimeSlotsGridProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Select Time</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-secondary" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-accent" />
            <span>Peak Hour</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {slots.map((slot) => {
          const isSelected = slot.time === selectedTime;

          return (
            <button
              key={slot.time}
              onClick={() => slot.available && onSelect(slot.time)}
              disabled={!slot.available}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-xl p-3 transition-all duration-200',
                slot.available
                  ? isSelected
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-glow'
                    : 'bg-card hover:bg-secondary border border-border'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              )}
            >
              {slot.isPeak && slot.available && (
                <div
                  className={cn(
                    'absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full',
                    isSelected ? 'bg-accent' : 'bg-accent text-accent-foreground'
                  )}
                >
                  <Zap className="h-3 w-3" />
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 opacity-70" />
                <span className="text-sm font-semibold">
                  {formatTime(slot.time)}
                </span>
              </div>
              
              {slot.available && (
                <span className="text-xs opacity-70">
                  {formatCurrency(slot.price)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
