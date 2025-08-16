import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { StarField } from '@/components/StarField';
import starryBackground from '@/assets/starry-sky-pattern.jpg';

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
    <div className="min-h-screen bg-background">
      <StarField />
      
      {/* Subtle background pattern */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${starryBackground})` }}
      />
      
      <main className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50">
          <div className="container py-4">
            <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          </div>
        </div>

        <div className="container py-6 space-y-8 pb-24">
          {/* Profile Header */}
          <div className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarImage src={profile?.avatar_url || ''} alt="User avatar" />
              <AvatarFallback className="bg-muted text-foreground font-semibold">
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
              <p className="text-sm text-muted-foreground">Exploring magical places</p>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Your Activity</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-card border-border/50 rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">{stats.stones}</div>
                  <div className="text-sm text-muted-foreground">Places Added</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50 rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">{stats.reviews}</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50 rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">{stats.favorites}</div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}