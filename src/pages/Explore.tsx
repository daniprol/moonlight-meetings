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
    <main className="relative min-h-screen starfield">
      <div className="container py-6 space-y-6 pb-24">
        <div className="flex gap-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a stone by city or name..."
            className="bg-card/60 backdrop-blur"
          />
          <button onClick={search} className="px-4 rounded-md bg-primary text-primary-foreground font-medium shadow-glow hover:shadow-glow/80 transition-shadow">
            Search
          </button>
        </div>
        {stones.length > 0 ? (
          <div className="space-y-4">
            <EmbeddedMap markers={markers} className="w-full h-[45vh] rounded-xl shadow-cosmic" />
            <div className="grid gap-3 max-h-[35vh] overflow-y-auto">
              {stones.map((s) => (
                <Card key={s.id} className="bg-card/60 backdrop-blur border-border/50 hover:shadow-glow/30 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="stellar-text text-base">{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-foreground/80">{s.address_text || s.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-primary">⭐ {s.average_rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-foreground stellar-text">Top Rated Under Moonlight</h2>
            <div className="grid grid-cols-2 gap-3">
              {topRated.map((s) => (
                <Card key={s.id} className="bg-card/60 backdrop-blur border-border/50 hover:shadow-glow/30 transition-all group">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm stellar-text group-hover:animate-glow">{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-primary animate-twinkle">⭐</span>
                      <span className="text-xs text-foreground/70">{s.average_rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
