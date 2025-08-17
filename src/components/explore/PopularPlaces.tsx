import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Stone } from '@/lib/data-provider/interface';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StoneImage from '@/components/ui/StoneImage';
import { Star, MapPin, Filter, ArrowUpDown, GripHorizontal } from 'lucide-react';
import { useBottomSheet } from '@/hooks/useBottomSheet';

interface PopularPlacesProps {
  stones: Stone[];
  selectedStone?: Stone | null;
  onStoneHover?: (stone: Stone | null) => void;
}

const PopularPlaces: React.FC<PopularPlacesProps> = ({ 
  stones, 
  selectedStone, 
  onStoneHover 
}) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { height, isDragging, containerRef } = useBottomSheet({
    minHeight: 40,
    maxHeight: 80,
    initialHeight: 40
  });

  const handleStoneClick = (stone: Stone) => {
    navigate(`/stone/${stone.id}`);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-x-0 bottom-0 z-30 bg-background/95 backdrop-blur-xl border-t border-border shadow-2xl transition-all duration-300 ease-out"
      style={{ 
        height: `${height}vh`,
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
              Filters
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              <ArrowUpDown className="w-3 h-3 mr-1" />
              Sort
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Places List */}
      <div 
        data-scroll-area
        className="overflow-y-auto scrollbar-minimal px-4 pb-safe"
        style={{ height: `calc(${height}vh - 120px)` }}
      >
        <div className="space-y-3 py-2">
          {stones.map((stone) => (
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
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-xs text-foreground font-medium">
                          {stone.average_rating?.toFixed(1) || '0.0'}
                        </span>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularPlaces;