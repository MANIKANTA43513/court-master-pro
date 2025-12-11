import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Coach, CoachAvailability, DayOfWeek } from '@/types/database';

export function useCoaches() {
  return useQuery({
    queryKey: ['coaches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Coach[];
    },
  });
}

export function useAllCoaches() {
  return useQuery({
    queryKey: ['all-coaches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Coach[];
    },
  });
}

export function useCoachAvailability(coachId: string | null, dayOfWeek: DayOfWeek | null) {
  return useQuery({
    queryKey: ['coach-availability', coachId, dayOfWeek],
    queryFn: async () => {
      if (!coachId || !dayOfWeek) return null;
      
      const { data, error } = await supabase
        .from('coach_availability')
        .select('*')
        .eq('coach_id', coachId)
        .eq('day_of_week', dayOfWeek)
        .maybeSingle();
      
      if (error) throw error;
      return data as CoachAvailability | null;
    },
    enabled: !!coachId && !!dayOfWeek,
  });
}
