import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data-provider/supabase-provider';

export const useStones = (query: string) => {
  return useQuery({
    queryKey: ['stones', 'list', { query }],
    queryFn: () => dataProvider.findStones(query),
    enabled: !!query,
  });
};
