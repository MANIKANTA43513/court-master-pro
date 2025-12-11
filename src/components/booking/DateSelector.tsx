import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const today = startOfDay(new Date());
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const goToPreviousWeek = () => {
    const newDate = addDays(selectedDate, -7);
    if (newDate >= today) {
      onDateChange(newDate);
    }
  };

  const goToNextWeek = () => {
    onDateChange(addDays(selectedDate, 7));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Select Date</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousWeek}
            disabled={isSameDay(selectedDate, today)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[140px] text-center">
            {format(selectedDate, 'MMMM yyyy')}
          </span>
          <Button variant="ghost" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={cn(
                'flex flex-col items-center justify-center rounded-xl p-3 transition-all duration-200',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-glow'
                  : 'bg-card hover:bg-secondary',
                isToday && !isSelected && 'ring-2 ring-primary/30'
              )}
            >
              <span className="text-xs font-medium opacity-70">
                {format(date, 'EEE')}
              </span>
              <span className="text-lg font-bold font-display">
                {format(date, 'd')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
