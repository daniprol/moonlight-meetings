import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useAuth } from '@/contexts/AuthContext';

export const useProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => dataProvider.getUserProfile(user!.id),
    enabled: !!user,
  });
};
