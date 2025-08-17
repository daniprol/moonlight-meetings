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
  useNavigationGuard({
    shouldBlock,
    confirmationTitle,
    confirmationMessage,
    onConfirm: onNavigationAllowed,
  });

  return null; // This component doesn't render anything
};