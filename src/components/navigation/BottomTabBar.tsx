import { NavLink, useLocation } from 'react-router-dom';
import { Search, Heart, PlusCircle, User } from 'lucide-react';

const tabs = [
  { to: '/explore', icon: Search, label: 'nav.explore' },
  { to: '/my-stones', icon: Heart, label: 'nav.myStones' },
  { to: '/add-stone', icon: PlusCircle, label: 'nav.addStone' },
  { to: '/profile', icon: User, label: 'nav.profile' },
];

export default function BottomTabBar() {
  const location = useLocation();
  // Hide on landing, auth, and 404 pages
  if (location.pathname === '/' || location.pathname === '/auth' || location.pathname === '*') return null;

  const getCls = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg ${
      isActive ? 'bg-muted text-primary' : 'text-foreground/80 hover:bg-muted/60'
    }`;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-3xl grid grid-cols-4 py-2">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end className={getCls}>
            <t.icon className="h-5 w-5" />
            <span className="text-xs">{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
