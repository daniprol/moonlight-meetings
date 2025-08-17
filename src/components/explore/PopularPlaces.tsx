import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Stone } from '@/lib/data-provider/interface';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StoneImage from '@/components/ui/StoneImage';
import { Star, MapPin, Filter, ArrowUpDown } from 'lucide-react';

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

  const handleStoneClick = (stone: Stone) => {
    navigate(`/stone/${stone.id}`);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-background rounded-t-3xl shadow-2xl border-t border-border max-h-[40vh] min-h-[40vh]">
      {/* Header with Controls */}
      <div className="sticky top-0 bg-background rounded-t-3xl border-b border-border/50 px-6 py-4">
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
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="w-3 h-3 mr-1" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <ArrowUpDown className="w-3 h-3 mr-1" />
              Sort
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Places List */}
      <div className="overflow-y-auto px-6 pb-6 space-y-3" style={{ maxHeight: 'calc(40vh - 80px)' }}>
        {stones.map((stone) => (
          <Card
            key={stone.id}
            className={`group cursor-pointer transition-all duration-200 border-border/50 rounded-xl overflow-hidden ${
              selectedStone?.id === stone.id 
                ? 'ring-2 ring-primary shadow-md bg-primary/5' 
                : 'hover:shadow-md hover:bg-muted/30'
            }`}
            onClick={() => handleStoneClick(stone)}
            onMouseEnter={() => onStoneHover?.(stone)}
            onMouseLeave={() => onStoneHover?.(null)}
          >
            <div className="p-4">
              <div className="flex items-center gap-4">
                {/* Stone Image */}
                <div className="flex-shrink-0">
                  <StoneImage 
                    stoneId={stone.id}
                    stoneName={stone.name}
                    thumbnailPath={stone.thumbnail_path}
                    size="md"
                    className="group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Stone Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {stone.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-sm text-foreground">
                      {stone.average_rating?.toFixed(1) || '0.0'}
                    </span>
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
  );
};

export default PopularPlaces;