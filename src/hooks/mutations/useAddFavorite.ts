import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useAuth } from '@/contexts/AuthContext';

export const useAddFavorite = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({ 
    mutationFn: (stoneId: string) => 
      dataProvider.addFavorite(user!.id, stoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
