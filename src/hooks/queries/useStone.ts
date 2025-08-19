import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data-provider/supabase-provider';

export const useStone = (id: string) => {
  return useQuery({
    queryKey: ['stones', 'detail', { id }],
    queryFn: () => dataProvider.getStoneById(id),
    enabled: !!id,
  });
};
