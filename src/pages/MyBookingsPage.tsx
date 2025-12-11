import { Navbar } from '@/components/layout/Navbar';
import { useBookings, useCancelBooking } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatTime } from '@/lib/pricing';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useBookings();
  const cancelBooking = useCancelBooking();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Please sign in</h1>
          <Link to="/auth"><Button variant="hero">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking.mutateAsync(bookingId);
      toast.success('Booking cancelled');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold mb-8">My Bookings</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No bookings yet</p>
            <Link to="/booking"><Button variant="hero">Book a Court</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-card border border-border rounded-xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${booking.status === 'confirmed' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{booking.court?.name}</span>
                      <span className="text-muted-foreground capitalize">({booking.court?.court_type})</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{format(new Date(booking.booking_date), 'MMM d, yyyy')}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                    </div>
                    {booking.coach && <div className="flex items-center gap-1 text-sm"><User className="h-4 w-4 text-muted-foreground" />Coach: {booking.coach.name}</div>}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{formatCurrency(booking.total_price)}</p>
                    {booking.status === 'confirmed' && (
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => handleCancel(booking.id)} disabled={cancelBooking.isPending}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
