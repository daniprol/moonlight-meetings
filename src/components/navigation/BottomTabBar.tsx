import { NavLink, useLocation } from 'react-router-dom';
import { Search, Heart, PlusCircle, User } from 'lucide-react';
import { useIntl } from 'react-intl';

export default function BottomTabBar() {
  const location = useLocation();
  const intl = useIntl();
  
  const tabs = [
    { to: '/explore', icon: Search, label: intl.formatMessage({ id: 'nav.explore' }) },
    { to: '/my-stones', icon: Heart, label: intl.formatMessage({ id: 'nav.myStones' }) },
    { to: '/add-stone', icon: PlusCircle, label: intl.formatMessage({ id: 'nav.addStone' }) },
    { to: '/profile', icon: User, label: intl.formatMessage({ id: 'nav.profile' }) },
  ];
  // Hide on landing, auth, and 404 pages
  if (location.pathname === '/' || location.pathname === '/auth' || location.pathname === '*') return null;

  const getCls = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 py-2 px-3 transition-all duration-200 ${
      isActive 
        ? 'text-primary' 
        : 'text-muted-foreground hover:text-foreground'
    }`;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50">
      <div className="mx-auto max-w-md px-4 py-2">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to} end className={getCls}>
              <t.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{t.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
