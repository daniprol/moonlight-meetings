import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useAuth } from '@/contexts/AuthContext';

export const useMyStones = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['stones', 'my-stones'],
    queryFn: () => dataProvider.getStonesByCreator(user!.id),
    enabled: !!user,
  });
};
