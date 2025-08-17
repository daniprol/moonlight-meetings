import { useEffect, useState } from 'react';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useIntl } from 'react-intl';
import { Stone } from '@/lib/data-provider/interface';
import { StarField } from '@/components/StarField';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import ExploreMap from '@/components/explore/ExploreMap';
import PopularPlaces from '@/components/explore/PopularPlaces';
import SearchSection from '@/components/explore/SearchSection';
import starryBackground from '@/assets/starry-sky-pattern.jpg';

export default function Explore() {
  const intl = useIntl();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stone[]>([]);
  const [topRated, setTopRated] = useState<Stone[]>([]);
  const [isSearching, setIsSearching] = useState(false);
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
    dataProvider.getTopRatedStones(12).then(setTopRated);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await dataProvider.findStones(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStoneSelect = (stone: Stone | null) => {
    setSelectedStone(stone);
  };

  const handleStoneHover = (stone: Stone | null) => {
    setHoveredStone(stone);
  };

  // Determine which stones to display in the map and list
  const displayedStones = searchResults.length > 0 ? searchResults : topRated;
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

        {/* Main Content */}
        <div className="container py-6 space-y-6 pb-24">
          {/* Search Section */}
          <SearchSection 
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            isSearching={isSearching}
          />

          {/* Map and Places Layout */}
          {displayedStones.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[70vh]">
              {/* Map Section - Takes 2/3 on large screens */}
              <div className="xl:col-span-2 order-2 xl:order-1">
                <div className="sticky top-24 bg-card rounded-2xl p-2 shadow-sm border border-border/50 h-[70vh]">
                  <ExploreMap 
                    stones={displayedStones}
                    onStoneSelect={handleStoneSelect}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Places List - Takes 1/3 on large screens */}
              <div className="xl:col-span-1 order-1 xl:order-2">
                <div className="h-[70vh] overflow-y-auto pr-2">
                  <PopularPlaces 
                    stones={displayedStones}
                    selectedStone={currentSelectedStone}
                    onStoneHover={handleStoneHover}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {searchQuery 
                    ? intl.formatMessage({ id: 'explore.noResults' }) 
                    : intl.formatMessage({ id: 'explore.noPlaces' })
                  }
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {searchQuery 
                    ? `No stones found for "${searchQuery}". Try a different search term.`
                    : 'No places available at the moment. Check back later!'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}