import { NavLink, useLocation } from 'react-router-dom';
import { Search, Heart, PlusCircle, User } from 'lucide-react';

const tabs = [
  { to: '/explore', icon: Search, label: 'Explore' },
  { to: '/my-stones', icon: Heart, label: 'My Stones' },
  { to: '/add-stone', icon: PlusCircle, label: 'Add Stone' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomTabBar() {
  const location = useLocation();
  // Hide on landing, auth, and 404 pages
  if (location.pathname === '/' || location.pathname === '/auth' || location.pathname === '*') return null;

  const getCls = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl transition-all duration-300 ${
      isActive 
        ? 'bg-primary/20 text-primary shadow-glow border border-primary/30' 
        : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
    }`;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-card/95 backdrop-blur-xl shadow-cosmic supports-[backdrop-filter]:bg-card/90">
      <div className="mx-auto max-w-md grid grid-cols-4 gap-2 p-2">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end className={getCls}>
            <t.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
