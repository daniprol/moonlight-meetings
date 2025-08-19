import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data-provider/supabase-provider';

export const useReviews = (stoneId: string) => {
  return useQuery({
    queryKey: ['reviews', { stoneId }],
    queryFn: () => dataProvider.getReviewsForStone(stoneId),
    enabled: !!stoneId,
  });
};
