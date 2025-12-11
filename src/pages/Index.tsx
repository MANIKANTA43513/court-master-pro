import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Calendar, Users, Trophy, Zap, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container py-24 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Smart Court Booking System
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
              Book Your Perfect
              <span className="text-gradient block">Badminton Court</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Reserve courts, rent equipment, and book coaches - all in one place. 
              Dynamic pricing ensures you get the best rates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button variant="hero" size="xl">
                  Book Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="xl">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Calendar, title: '4 Courts', desc: '2 Indoor & 2 Outdoor courts available', color: 'bg-primary/10 text-primary' },
            { icon: Trophy, title: 'Pro Equipment', desc: 'Rackets & shoes available for rent', color: 'bg-accent/20 text-accent' },
            { icon: Users, title: '3 Expert Coaches', desc: 'Book sessions with certified coaches', color: 'bg-success/10 text-success' },
          ].map((feature, i) => (
            <div key={i} className="group rounded-2xl bg-card border border-border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.color} mb-6`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Info */}
      <section className="container py-20">
        <div className="rounded-3xl bg-gradient-dark p-12 text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-bold mb-4">Dynamic Pricing</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Our smart pricing adjusts based on demand. Peak hours (6-9 PM) and weekends have premium rates. 
            Indoor courts include a small premium for climate control.
          </p>
          <Link to="/booking">
            <Button variant="accent" size="lg">View Available Slots</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 CourtBook. Built for Acorn Globus Assignment.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
