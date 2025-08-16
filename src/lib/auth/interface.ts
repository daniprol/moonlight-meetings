import { Session, User } from '@supabase/supabase-js';
import { AppRole, Profile, UserRole } from '@/types/auth';

export interface AuthProvider {
  signUp(email: string, password: string, metadata?: any): Promise<{ error: any }>;
  signIn(email: string, password: string): Promise<{ error: any }>;
  signInWithProvider(provider: 'google' | 'facebook'): Promise<{ error: any }>;
  signOut(): Promise<{ error: any }>;
  getSession(): Promise<Session | null>;
  onAuthStateChange(callback: (session: Session | null) => void): () => void;
}

export interface DatabaseProvider {
  getProfile(userId: string): Promise<Profile | null>;
  getUserRoles(userId: string): Promise<UserRole[]>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null>;
  assignRole(userId: string, role: AppRole): Promise<boolean>;
  removeRole(userId: string, role: AppRole): Promise<boolean>;
}