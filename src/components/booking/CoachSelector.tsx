import { Coach, DayOfWeek } from '@/types/database';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/pricing';
import { User, Check } from 'lucide-react';

interface CoachSelectorProps {
  coaches: Coach[];
  selectedCoachId: string | null;
  coachAvailability: Record<string, boolean>;
  onSelect: (coach: Coach | null) => void;
}

export function CoachSelector({
  coaches,
  selectedCoachId,
  coachAvailability,
  onSelect,
}: CoachSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg font-semibold">Add Coach (Optional)</h3>

      <div className="space-y-3">
        {/* No coach option */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            'w-full flex items-center gap-4 rounded-xl p-4 transition-all duration-200 text-left',
            selectedCoachId === null
              ? 'bg-primary text-primary-foreground shadow-lg shadow-glow'
              : 'bg-card hover:bg-secondary border border-border'
          )}
        >
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full',
              selectedCoachId === null
                ? 'bg-primary-foreground/20'
                : 'bg-muted'
            )}
          >
            <span className="text-xl">🚫</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold">No Coach</p>
            <p className="text-sm opacity-70">Play on your own</p>
          </div>
          {selectedCoachId === null && (
            <Check className="h-5 w-5" />
          )}
        </button>

        {coaches.map((coach) => {
          const isSelected = coach.id === selectedCoachId;
          const isAvailable = coachAvailability[coach.id] ?? true;

          return (
            <button
              key={coach.id}
              onClick={() => isAvailable && onSelect(coach)}
              disabled={!isAvailable}
              className={cn(
                'w-full flex items-center gap-4 rounded-xl p-4 transition-all duration-200 text-left',
                !isAvailable
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  : isSelected
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-glow'
                  : 'bg-card hover:bg-secondary border border-border'
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full',
                  isSelected
                    ? 'bg-primary-foreground/20'
                    : 'bg-primary/10 text-primary'
                )}
              >
                {coach.avatar_url ? (
                  <img
                    src={coach.avatar_url}
                    alt={coach.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{coach.name}</p>
                <p className="text-sm opacity-70 truncate">
                  {coach.bio || 'Professional coach'}
                </p>
                <p className="text-sm font-medium">
                  {formatCurrency(coach.hourly_rate)}/hr
                </p>
              </div>

              {!isAvailable ? (
                <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                  Unavailable
                </span>
              ) : isSelected ? (
                <Check className="h-5 w-5" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
