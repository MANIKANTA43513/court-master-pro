import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PricingRule, DayOfWeek } from '@/types/database';

export function usePricingRules() {
  return useQuery({
    queryKey: ['pricing-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as PricingRule[];
    },
  });
}

export function useAllPricingRules() {
  return useQuery({
    queryKey: ['all-pricing-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as PricingRule[];
    },
  });
}
