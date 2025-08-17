import { useEffect, useState } from 'react';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useIntl } from 'react-intl';
import { Stone } from '@/lib/data-provider/interface';
import { StarField } from '@/components/StarField';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import ExploreMap from '@/components/explore/ExploreMap';
import PopularPlaces from '@/components/explore/PopularPlaces';
import starryBackground from '@/assets/starry-sky-pattern.jpg';

export default function Explore() {
  const intl = useIntl();
  const [topRated, setTopRated] = useState<Stone[]>([]);
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const [hoveredStone, setHoveredStone] = useState<Stone | null>(null);

  useEffect(() => {
    document.title = `${intl.formatMessage({ id: 'page.explore' })} | ${intl.formatMessage({ id: 'title' })}`;
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', intl.formatMessage({ id: 'description' }));
    document.head.appendChild(meta);
  }, [intl]);

  useEffect(() => {
    dataProvider.getTopRatedStones(20).then(setTopRated);
  }, []);

  const handleStoneSelect = (stone: Stone | null) => {
    setSelectedStone(stone);
  };

  const handleStoneHover = (stone: Stone | null) => {
    setHoveredStone(stone);
  };

  const currentSelectedStone = selectedStone || hoveredStone;

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      
      {/* Subtle background pattern */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
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
            <h1 className="text-2xl font-semibold text-foreground">
              {intl.formatMessage({ id: 'page.explore' })}
            </h1>
          </div>
        </div>

        {/* Map with Overlay */}
        <div className="relative h-[calc(100vh-5rem)]">
          {/* Full Map */}
          <ExploreMap 
            stones={topRated}
            onStoneSelect={handleStoneSelect}
            selectedStone={currentSelectedStone}
            className="w-full h-full"
          />

          {/* Popular Places Overlay */}
          <PopularPlaces 
            stones={topRated}
            selectedStone={currentSelectedStone}
            onStoneHover={handleStoneHover}
          />
        </div>
      </main>
    </div>
  );
}