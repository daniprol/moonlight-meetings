import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

export default function Profile() {
  const { user } = useAuth();
  const profile = user?.profile;
  const [stats, setStats] = useState({ stones: 0, reviews: 0, favorites: 0 });

  useEffect(() => {
    document.title = 'Profile | Shining Stone';
  }, []);

  // TODO: fetch stats

  const displayName = profile?.display_name || profile?.username || user?.email || 'Explorer';

  return (
    <main className="relative min-h-screen starfield">
      <div className="container py-8 space-y-6 pb-24">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 shadow-glow border-2 border-primary/20">
            <AvatarImage src={profile?.avatar_url || ''} alt="User avatar" />
            <AvatarFallback className="bg-primary/20 text-primary font-bold">{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold stellar-text">Welcome back, {displayName}!</h1>
            <p className="text-sm text-foreground/70">Under the moonlight, your discoveries shine.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-card/60 backdrop-blur border-border/50 hover:shadow-glow/30 transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold stellar-text">{stats.stones}</div>
              <div className="text-xs text-foreground/70">Stones Added</div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur border-border/50 hover:shadow-glow/30 transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold stellar-text">{stats.reviews}</div>
              <div className="text-xs text-foreground/70">Reviews Written</div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur border-border/50 hover:shadow-glow/30 transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold stellar-text">{stats.favorites}</div>
              <div className="text-xs text-foreground/70">Favorites</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
