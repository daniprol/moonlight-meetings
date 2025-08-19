import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useAuth } from '@/contexts/AuthContext';

export const useRemoveFavorite = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stoneId: string) => 
      dataProvider.removeFavorite(user!.id, stoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
