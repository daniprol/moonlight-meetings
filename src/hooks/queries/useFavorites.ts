import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useAuth } from '@/contexts/AuthContext';

export const useFavorites = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => dataProvider.getFavoriteStones(user!.id),
    enabled: !!user,
  });
};
