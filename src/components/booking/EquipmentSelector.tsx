import { Equipment } from '@/types/database';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/pricing';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface EquipmentSelectorProps {
  equipment: Equipment[];
  selectedEquipment: { equipment: Equipment; quantity: number }[];
  bookedQuantities: Record<string, number>;
  onQuantityChange: (equipment: Equipment, quantity: number) => void;
}

export function EquipmentSelector({
  equipment,
  selectedEquipment,
  bookedQuantities,
  onQuantityChange,
}: EquipmentSelectorProps) {
  const getSelectedQuantity = (equipmentId: string) => {
    const item = selectedEquipment.find((e) => e.equipment.id === equipmentId);
    return item?.quantity || 0;
  };

  const getAvailableStock = (eq: Equipment) => {
    const booked = bookedQuantities[eq.id] || 0;
    return eq.total_stock - booked;
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg font-semibold">Add Equipment (Optional)</h3>

      <div className="space-y-3">
        {equipment.map((eq) => {
          const selectedQty = getSelectedQuantity(eq.id);
          const availableStock = getAvailableStock(eq);
          const isSelected = selectedQty > 0;

          return (
            <div
              key={eq.id}
              className={cn(
                'flex items-center justify-between rounded-xl p-4 transition-all duration-200',
                isSelected
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-card border border-border'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg text-lg',
                    eq.equipment_type === 'racket'
                      ? 'bg-primary/10'
                      : 'bg-accent/20'
                  )}
                >
                  {eq.equipment_type === 'racket' ? '🏸' : '👟'}
                </div>
                <div>
                  <p className="font-semibold">{eq.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(eq.price_per_hour)}/hr •{' '}
                    <span
                      className={cn(
                        availableStock <= 2 && 'text-destructive font-medium'
                      )}
                    >
                      {availableStock} available
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onQuantityChange(eq, selectedQty - 1)}
                  disabled={selectedQty === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="w-8 text-center font-bold">{selectedQty}</span>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onQuantityChange(eq, selectedQty + 1)}
                  disabled={selectedQty >= availableStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
