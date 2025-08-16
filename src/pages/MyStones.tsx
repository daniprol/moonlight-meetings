import { useEffect, useState } from 'react';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <main className="relative min-h-screen starfield">
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
  );
}
