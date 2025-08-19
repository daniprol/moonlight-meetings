import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data-provider/supabase-provider';

export const useTopRatedStones = (limit: number) => {
  return useQuery({
    queryKey: ['stones', 'top-rated', { limit }],
    queryFn: () => dataProvider.getTopRatedStones(limit),
  });
};
