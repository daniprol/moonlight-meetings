import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { StarField } from '@/components/StarField';
import heroImage from '@/assets/shining-stone-hero.jpg';

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
    <div className="relative min-h-screen starfield overflow-hidden">
      <StarField />
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background/90" />

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/60 rounded-full animate-float hidden sm:block" />
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary/80 rounded-full animate-twinkle hidden sm:block" />
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-accent/40 rounded-full animate-pulse hidden sm:block" />

      <main className="relative z-10">
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
    </div>
  );
}