import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useAuth } from '@/contexts/AuthContext';
import { NewReview } from '@/lib/data-provider/interface';

export const useAddReview = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData: NewReview) => 
      dataProvider.addReview(reviewData, user!.id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', { stoneId: data.stone_id }] });
    },
  });
};
