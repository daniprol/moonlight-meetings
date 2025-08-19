import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useAuth } from '@/contexts/AuthContext';
import { NewStone } from '@/lib/data-provider/interface';

export const useAddStone = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({ 
    mutationFn: (data: { stoneData: NewStone, photos: File[] }) => 
      dataProvider.addStone(data.stoneData, data.photos, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stones', 'my-stones'] });
      queryClient.invalidateQueries({ queryKey: ['stones', 'list'] });
    },
  });
};
