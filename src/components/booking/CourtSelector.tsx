import { Court } from '@/types/database';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/pricing';
import { MapPin, Building } from 'lucide-react';

interface CourtSelectorProps {
  courts: Court[];
  selectedCourtId: string | null;
  onSelect: (court: Court) => void;
}

export function CourtSelector({ courts, selectedCourtId, onSelect }: CourtSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg font-semibold">Select Court</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {courts.map((court) => {
          const isSelected = court.id === selectedCourtId;
          const isIndoor = court.court_type === 'indoor';

          return (
            <button
              key={court.id}
              onClick={() => onSelect(court)}
              className={cn(
                'flex items-center gap-4 rounded-xl p-4 transition-all duration-200 text-left',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-glow'
                  : 'bg-card hover:bg-secondary border border-border'
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-lg',
                  isSelected
                    ? 'bg-primary-foreground/20'
                    : isIndoor
                    ? 'bg-primary/10 text-primary'
                    : 'bg-accent/20 text-accent'
                )}
              >
                {isIndoor ? (
                  <Building className="h-6 w-6" />
                ) : (
                  <MapPin className="h-6 w-6" />
                )}
              </div>
              
              <div className="flex-1">
                <p className="font-semibold">{court.name}</p>
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <span className="capitalize">{court.court_type}</span>
                  <span>•</span>
                  <span>{formatCurrency(court.base_price)}/hr</span>
                </div>
              </div>

              <div
                className={cn(
                  'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                  isSelected
                    ? 'border-primary-foreground bg-primary-foreground'
                    : 'border-muted-foreground'
                )}
              >
                {isSelected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
