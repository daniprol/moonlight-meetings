import { useEffect, useMemo, useState } from 'react';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import EmbeddedMap from '@/components/ui/EmbeddedMap';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function Explore() {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [stones, setStones] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);

  useEffect(() => {
    document.title = 'Explore Stones | Shining Stone';
    // Meta description
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'Explore magical stones and date spots under moonlight.');
    document.head.appendChild(meta);
  }, []);

  useEffect(() => {
    dataProvider.getTopRatedStones(8).then(setTopRated);
  }, []);

  const markers = useMemo(
    () =>
      stones
        .filter((s) => s.latitude && s.longitude)
        .map((s) => ({ id: s.id, position: { lat: s.latitude!, lng: s.longitude! }, title: s.name })),
    [stones]
  );

  const search = async () => {
    const res = await dataProvider.findStones(q);
    setStones(res);
  };

  return (
    <main className="relative min-h-screen pb-20 starfield">
      <section className="container py-6">
        <div className="flex gap-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a stone by city or name..."
            className="bg-card/60"
          />
          <button onClick={search} className="px-4 rounded-md bg-primary text-primary-foreground">Search</button>
        </div>
      </section>

      {stones.length > 0 ? (
        <section className="container grid gap-4">
          <EmbeddedMap markers={markers} className="w-full h-[50vh] rounded-xl" />
          <div className="grid gap-3">
            {stones.map((s) => (
              <Card key={s.id} className="bg-card/60">
                <CardHeader>
                  <CardTitle className="stellar-text">{s.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">{s.address_text || s.description}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <section className="container space-y-4">
          <h2 className="text-lg font-medium text-foreground/80">Top Rated</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topRated.map((s) => (
              <Card key={s.id} className="bg-card/60 hover:shadow-glow transition-shadow">
                <CardHeader>
                  <CardTitle className="text-sm">{s.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-foreground/70">⭐ {s.average_rating?.toFixed(1) || '0.0'}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
