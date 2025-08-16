import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { AuthContextType, AuthUser, AppRole } from '@/types/auth';
import { SupabaseAuthProvider } from '@/lib/auth/supabase-auth';
import { SupabaseDatabaseProvider } from '@/lib/auth/supabase-database';
import { devConfig, getDevRole } from '@/lib/dev-config';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authProvider = new SupabaseAuthProvider();
const dbProvider = new SupabaseDatabaseProvider();

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Get profile and roles
      const [profile, roles] = await Promise.all([
        dbProvider.getProfile(session.user.id),
        dbProvider.getUserRoles(session.user.id)
      ]);

      const authUser: AuthUser = {
        ...session.user,
        profile: profile || undefined,
        roles: roles.map(r => r.role)
      };

      // In dev mode, override roles if configured
      if (devConfig.enabled) {
        const devRole = getDevRole();
        if (devRole) {
          authUser.roles = [devRole];
        }
      }

      setUser(authUser);
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = authProvider.onAuthStateChange((session) => {
      setSession(session);
      // Defer loading to avoid blocking auth state changes
      setTimeout(() => {
        loadUserData(session);
      }, 0);
    });

    // Get initial session
    authProvider.getSession().then((session) => {
      setSession(session);
      loadUserData(session);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    return authProvider.signUp(email, password, metadata);
  };

  const signIn = async (email: string, password: string) => {
    return authProvider.signIn(email, password);
  };

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    return authProvider.signInWithProvider(provider);
  };

  const signOut = async () => {
    return authProvider.signOut();
  };

  const hasRole = (role: AppRole): boolean => {
    return user?.roles?.includes(role) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithProvider,
        signOut,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};