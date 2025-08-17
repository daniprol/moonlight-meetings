import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useBlocker } from 'react-router-dom';

interface UseNavigationGuardProps {
  shouldBlock: boolean;
  confirmationTitle: string;
  confirmationMessage: string;
  onConfirm?: () => void;
}

export const useNavigationGuard = ({
  shouldBlock,
  confirmationTitle,
  confirmationMessage,
  onConfirm,
}: UseNavigationGuardProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const nextLocationRef = useRef<string | null>(null);

  // Block React Router navigation
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldBlock && currentLocation.pathname !== nextLocation.pathname
  );

  // Handle blocked navigation
  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmed = window.confirm(`${confirmationTitle}\n\n${confirmationMessage}`);
      
      if (confirmed) {
        onConfirm?.();
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, confirmationTitle, confirmationMessage, onConfirm]);

  // Handle browser navigation (refresh, close tab)
  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldBlock, confirmationMessage]);

  const blockNavigation = useCallback((targetPath: string) => {
    if (!shouldBlock) return false;
    
    nextLocationRef.current = targetPath;
    
    // This is now handled by the useBlocker hook above
    return shouldBlock;
  }, [shouldBlock]);

  return { blockNavigation };
};