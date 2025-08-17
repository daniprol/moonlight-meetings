import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';

interface NavigationGuardProps {
  shouldBlock: boolean;
  confirmationTitle: string;
  confirmationMessage: string;
  onNavigationBlocked?: () => void;
  onNavigationAllowed?: () => void;
}

export const NavigationGuard = ({
  shouldBlock,
  confirmationTitle,
  confirmationMessage,
  onNavigationBlocked,
  onNavigationAllowed,
}: NavigationGuardProps) => {
  const location = useLocation();
  
  const { blockNavigation } = useNavigationGuard({
    shouldBlock,
    confirmationTitle,
    confirmationMessage,
    onConfirm: onNavigationAllowed,
  });

  useEffect(() => {
    if (!shouldBlock) return;

    // Listen for navigation attempts within the app
    const handlePopState = (event: PopStateEvent) => {
      if (blockNavigation(location.pathname)) {
        // Block navigation by pushing the current state back
        window.history.pushState(null, '', location.pathname);
        onNavigationBlocked?.();
        event.preventDefault();
      }
    };

    // Override the browser's back button
    window.history.pushState(null, '', location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [shouldBlock, location.pathname, blockNavigation, onNavigationBlocked]);

  return null; // This component doesn't render anything
};