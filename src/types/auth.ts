import { User, Session } from '@supabase/supabase-js';

export type AppRole = 'normal' | 'editor' | 'admin';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_at: string;
}

export interface AuthUser extends User {
  profile?: Profile;
  roles?: AppRole[];
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: 'google' | 'facebook') => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  hasRole: (role: AppRole) => boolean;
}

// Developer mode types for easy role switching
export interface DevConfig {
  enabled: boolean;
  defaultRole?: AppRole;
  defaultUser?: {
    email: string;
    name: string;
  };
}