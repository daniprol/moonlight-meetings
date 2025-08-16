import { useEffect, useState } from 'react';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarField } from '@/components/StarField';
import heroImage from '@/assets/shining-stone-hero.jpg';

export default function MyStones() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    document.title = 'My Stones | Shining Stone';
  }, []);

  useEffect(() => {
    if (user) dataProvider.getFavoriteStones(user.id).then(setFavorites);
  }, [user]);

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
        <div className="container py-6 pb-24">
          <Tabs defaultValue="favorites">
            <TabsList className="bg-card/60 backdrop-blur border-border/50">
              <TabsTrigger value="favorites" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Favorites</TabsTrigger>
              <TabsTrigger value="want" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Want to Go</TabsTrigger>
              <TabsTrigger value="reviewed" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Reviewed</TabsTrigger>
            </TabsList>
            <TabsContent value="favorites" className="grid gap-3 mt-4 max-h-[75vh] overflow-y-auto">
              {favorites.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="text-4xl animate-twinkle">💫</div>
                  <p className="text-foreground/70 stellar-text">Your next great date is waiting.</p>
                  <p className="text-sm text-foreground/50">Tap the ❤️ on any stone to save it here.</p>
                </div>
              ) : (
                favorites.map((s) => (
                  <Card key={s.id} className="bg-card/60 backdrop-blur border-border/50 hover:shadow-glow/30 transition-all">
                    <CardHeader>
                      <CardTitle className="stellar-text">{s.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-foreground/80">{s.address_text || s.description}</CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            <TabsContent value="want" className="mt-4 text-center py-12">
              <div className="space-y-3">
                <div className="text-4xl animate-float">🌙</div>
                <p className="text-foreground/70 stellar-text">Coming soon under the moonlight...</p>
              </div>
            </TabsContent>
            <TabsContent value="reviewed" className="mt-4 text-center py-12">
              <div className="space-y-3">
                <div className="text-4xl animate-glow">✨</div>
                <p className="text-foreground/70 stellar-text">Your reviews will shine here soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}