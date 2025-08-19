import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Stone } from '@/lib/data-provider/interface';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StoneImage from '@/components/ui/StoneImage';
import { Star, MapPin, Filter, ArrowUpDown, Heart } from 'lucide-react';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useFavorites } from '@/hooks/queries/useFavorites';
import { useAddFavorite } from '@/hooks/mutations/useAddFavorite';
import { useRemoveFavorite } from '@/hooks/mutations/useRemoveFavorite';
import { useAuth } from '@/contexts/AuthContext';

interface PopularPlacesProps {
  stones: Stone[];
  selectedStone?: Stone | null;
  onStoneHover?: (stone: Stone | null) => void;
  onMapClick?: () => void;
  isLoading?: boolean;
}

const PopularPlaces: React.FC<PopularPlacesProps> = ({ 
  stones, 
  selectedStone, 
  onStoneHover,
  onMapClick,
  isLoading
}) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Favorite functionality
  const { data: favorites = [] } = useFavorites();
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();
  
  const isFavorite = (stoneId: string) => {
    return favorites.some(fav => fav.id === stoneId);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent, stoneId: string) => {
    e.stopPropagation(); // Prevent stone navigation
    if (!user) return;
    
    if (isFavorite(stoneId)) {
      removeFavoriteMutation.mutate(stoneId);
    } else {
      addFavoriteMutation.mutate(stoneId);
    }
  };
  
  const { height, isDragging, isScrolling, containerRef, expandToMax, collapseToMin } = useBottomSheet({
    minHeight: 40, // 40% of viewport
    maxHeight: 80, // 80% of viewport
    initialHeight: 40
  });

  const heightInPixels = (height / 100) * window.innerHeight;

  const isExpanded = height >= 75; // Consider expanded when >= 75% of max height

  // Handle wheel scroll to expand/contract panel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const scrollArea = containerRef.current?.querySelector('[data-scroll-area]') as HTMLElement;
      
      if (!isExpanded && e.deltaY < 0) {
        // Scrolling up when not expanded - expand the panel
        e.preventDefault();
        expandToMax();
      } else if (isExpanded && e.deltaY > 0 && scrollArea?.scrollTop === 0) {
        // Scrolling down when expanded and at top of content - collapse the panel
        e.preventDefault();
        collapseToMin();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isExpanded, expandToMax, collapseToMin, containerRef]);

  const handleStoneClick = (stone: Stone) => {
    navigate(`/stone/${stone.id}`);
  };

  // Listen for map clicks to collapse the bottom sheet
  useEffect(() => {
    const handleMapClickToCollapse = () => {
      collapseToMin();
    };

    // Expose collapse function globally for map interaction
    if (onMapClick) {
      (window as any).__collapseBottomSheet = handleMapClickToCollapse;
    }

    return () => {
      if ((window as any).__collapseBottomSheet) {
        delete (window as any).__collapseBottomSheet;
      }
    };
  }, [collapseToMin, onMapClick]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-x-0 bottom-0 z-30 bg-background/95 backdrop-blur-xl border-t border-border shadow-2xl transition-all duration-300 ease-out"
      style={{ 
        height: `${heightInPixels}px`,
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px'
      }}
    >
      {/* Drag Handle */}
      <div 
        data-drag-handle
        className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
      >
        <div className="w-10 h-1 bg-muted-foreground/40 rounded-full"></div>
      </div>

      {/* Header with Controls */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {intl.formatMessage({ id: 'explore.popularPlaces' })}
            </h2>
            <span className="text-sm text-muted-foreground">
              {stones.length} {stones.length === 1 ? 'place' : 'places'}
            </span>
          </div>
          
          {/* Filter and Sort Controls */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              <Filter className="w-3 h-3 mr-1" />
              {intl.formatMessage({ id: 'explore.filters' })}
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              <ArrowUpDown className="w-3 h-3 mr-1" />
              {intl.formatMessage({ id: 'explore.sort' })}
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Places List */}
      <div 
        data-scroll-area
        className="overflow-y-auto scrollbar-minimal px-4 pb-safe"
        style={{ 
          height: `${heightInPixels - 120}px` // Account for header and drag handle
        }}
      >
        <div className="space-y-3 py-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            stones.map((stone) => (
              <Card
                key={stone.id}
                className={`group cursor-pointer transition-all duration-200 border-border/50 rounded-2xl overflow-hidden backdrop-blur-sm ${
                  selectedStone?.id === stone.id 
                    ? 'ring-2 ring-primary shadow-lg bg-primary/10 border-primary/30' 
                    : 'hover:shadow-lg hover:bg-card/80 hover:border-border'
                }`}
                onClick={() => handleStoneClick(stone)}
                onMouseEnter={() => onStoneHover?.(stone)}
                onMouseLeave={() => onStoneHover?.(null)}
              >
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    {/* Stone Image */}
                    <div className="flex-shrink-0">
                      <StoneImage
                        stoneId={stone.id}
                        stoneName={stone.name}
                        thumbnailPath={stone.thumbnail_path}
                        size="sm"
                        className="group-hover:scale-105 transition-transform duration-200 rounded-xl"
                      />
                    </div>

                    {/* Stone Info - Horizontal Layout */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground line-clamp-1 text-sm">
                          {stone.name}
                        </h3>
                        
                        {/* Rating and Favorite */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                            <span className="text-xs text-foreground font-medium">
                              {stone.average_rating?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                          {user && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-background/80"
                              onClick={(e) => handleFavoriteClick(e, stone.id)}
                            >
                              <Heart 
                                className={`w-3 h-3 transition-colors ${
                                  isFavorite(stone.id) 
                                    ? 'text-red-500 fill-red-500' 
                                    : 'text-muted-foreground hover:text-red-400'
                                }`}
                              />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      {stone.address_text && (
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {stone.address_text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularPlaces;