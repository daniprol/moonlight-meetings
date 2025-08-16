import { supabase } from '@/integrations/supabase/client';
import { DatabaseProvider } from './interface';
import { AppRole, Profile, UserRole } from '@/types/auth';

export class SupabaseDatabaseProvider implements DatabaseProvider {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
    
    return data || [];
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    return data;
  }

  async assignRole(userId: string, role: AppRole): Promise<boolean> {
    const { error } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
    
    if (error) {
      console.error('Error assigning role:', error);
      return false;
    }
    
    return true;
  }

  async removeRole(userId: string, role: AppRole): Promise<boolean> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    
    if (error) {
      console.error('Error removing role:', error);
      return false;
    }
    
    return true;
  }
}