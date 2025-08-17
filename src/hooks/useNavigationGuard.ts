import { useEffect, useRef, useCallback } from 'react';
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
  const isBlockingRef = useRef(false);

  // Handle browser navigation (refresh, close tab, back/forward)
  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    const handlePopState = (event: PopStateEvent) => {
      if (isBlockingRef.current) return;
      
      isBlockingRef.current = true;
      const confirmed = window.confirm(`${confirmationTitle}\n\n${confirmationMessage}`);
      
      if (confirmed) {
        onConfirm?.();
        isBlockingRef.current = false;
      } else {
        // Prevent navigation by pushing current state back
        window.history.pushState(null, '', location.pathname);
        isBlockingRef.current = false;
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Push current state to enable popstate detection
    window.history.pushState(null, '', location.pathname);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [shouldBlock, confirmationMessage, confirmationTitle, onConfirm, location.pathname]);

  // Handle React Router navigation (NavLink clicks)
  useEffect(() => {
    if (!shouldBlock) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      
      // Check if this is navigation to a different route
      if (href !== location.pathname && !isBlockingRef.current) {
        event.preventDefault();
        event.stopPropagation();
        
        isBlockingRef.current = true;
        const confirmed = window.confirm(`${confirmationTitle}\n\n${confirmationMessage}`);
        
        if (confirmed) {
          onConfirm?.();
          isBlockingRef.current = false;
          navigate(href);
        } else {
          isBlockingRef.current = false;
        }
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [shouldBlock, confirmationTitle, confirmationMessage, onConfirm, location.pathname, navigate]);

  const blockNavigation = useCallback((targetPath: string) => {
    return shouldBlock;
  }, [shouldBlock]);

  return { blockNavigation };
};