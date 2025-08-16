import { DevConfig } from '@/types/auth';

// Development configuration for easy role switching
// This would be configurable through environment or config file
export const devConfig: DevConfig = {
  enabled: import.meta.env.DEV, // Only enable in development
  defaultRole: 'normal', // Can be overridden by developers
  defaultUser: {
    email: 'dev@shiningstone.com',
    name: 'Development User'
  }
};

// Helper to get dev role from localStorage or default
export const getDevRole = () => {
  if (!devConfig.enabled) return null;
  
  const stored = localStorage.getItem('dev-role');
  return stored as any || devConfig.defaultRole;
};

// Helper to set dev role
export const setDevRole = (role: string) => {
  if (!devConfig.enabled) return;
  
  localStorage.setItem('dev-role', role);
  // Trigger a page reload to apply the new role
  window.location.reload();
};