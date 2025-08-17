import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

  const blockNavigation = (targetPath: string) => {
    if (!shouldBlock) return false;
    
    nextLocationRef.current = targetPath;
    
    // Show confirmation dialog
    const confirmed = window.confirm(`${confirmationTitle}\n\n${confirmationMessage}`);
    
    if (confirmed) {
      onConfirm?.();
      return false; // Allow navigation
    }
    
    return true; // Block navigation
  };

  return { blockNavigation };
};