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
    <main className="relative min-h-screen pb-20 starfield container py-6">
      <Tabs defaultValue="favorites">
        <TabsList>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="want">Want to Go</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
        </TabsList>
        <TabsContent value="favorites" className="grid gap-3 mt-4">
          {favorites.length === 0 ? (
            <p className="text-foreground/70">Your next great date is waiting. Tap the ❤️ on any stone to save it here.</p>
          ) : (
            favorites.map((s) => (
              <Card key={s.id} className="bg-card/60">
                <CardHeader>
                  <CardTitle>{s.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">{s.address_text || s.description}</CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="want" className="mt-4 text-foreground/70">
          Coming soon.
        </TabsContent>
        <TabsContent value="reviewed" className="mt-4 text-foreground/70">
          Coming soon.
        </TabsContent>
      </Tabs>
    </main>
  );
}
