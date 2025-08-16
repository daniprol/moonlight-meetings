import { useEffect, useMemo, useState } from 'react';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import EmbeddedMap from '@/components/ui/EmbeddedMap';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { StarField } from '@/components/StarField';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useIntl } from 'react-intl';
import starryBackground from '@/assets/starry-sky-pattern.jpg';

export default function Explore() {
  const { user } = useAuth();
  const intl = useIntl();
  const [q, setQ] = useState('');
  const [stones, setStones] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);

  useEffect(() => {
    document.title = `${intl.formatMessage({ id: 'page.explore' })} | ${intl.formatMessage({ id: 'title' })}`;
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', intl.formatMessage({ id: 'description' }));
    document.head.appendChild(meta);
  }, [intl]);

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
    <div className="min-h-screen bg-background">
      <StarField />
      
      {/* Subtle background pattern */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${starryBackground})` }}
      />
      
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      <main className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50">
          <div className="container py-4">
            <h1 className="text-2xl font-semibold text-foreground">{intl.formatMessage({ id: 'page.explore' })}</h1>
          </div>
        </div>

        <div className="container py-6 space-y-8 pb-24">
          {/* Search Section */}
          <div className="relative">
            <div className="flex gap-3">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={intl.formatMessage({ id: 'explore.searchPlaceholder' })}
                className="h-12 text-base bg-card border-border/50 rounded-xl shadow-sm"
              />
              <button 
                onClick={search} 
                className="px-6 h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                {intl.formatMessage({ id: 'explore.search' })}
              </button>
            </div>
          </div>
          {/* Results */}
          {stones.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-1 shadow-sm border border-border/50">
                <EmbeddedMap markers={markers} className="w-full h-[350px] rounded-xl" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">{intl.formatMessage({ id: 'explore.searchResults' })}</h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {stones.map((s) => (
                    <Card key={s.id} className="bg-card border-border/50 hover:shadow-md transition-all duration-300 rounded-2xl">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-foreground">{s.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-primary">★</span>
                            <span className="text-foreground/70">{s.average_rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{s.address_text || s.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground">{intl.formatMessage({ id: 'explore.popularPlaces' })}</h2>
                <span className="text-sm text-muted-foreground">{intl.formatMessage({ id: 'explore.topRated' })}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {topRated.map((s) => (
                  <Card key={s.id} className="bg-card border-border/50 hover:shadow-md transition-all duration-300 rounded-2xl group">
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{s.name}</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-primary text-sm">★</span>
                        <span className="text-sm text-foreground/70">{s.average_rating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}