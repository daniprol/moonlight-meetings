import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Stone } from '@/lib/data-provider/interface';
import { Card } from '@/components/ui/card';
import StoneImage from '@/components/ui/StoneImage';
import { Star, MapPin } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">
          {intl.formatMessage({ id: 'explore.popularPlaces' })}
        </h2>
        <span className="text-sm text-muted-foreground">
          {stones.length} {stones.length === 1 ? 'place' : 'places'}
        </span>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stones.map((stone) => (
          <Card
            key={stone.id}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-lg border-border/50 rounded-2xl overflow-hidden ${
              selectedStone?.id === stone.id 
                ? 'ring-2 ring-primary shadow-lg scale-[1.02]' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleStoneClick(stone)}
            onMouseEnter={() => onStoneHover?.(stone)}
            onMouseLeave={() => onStoneHover?.(null)}
          >
            <div className="p-4 space-y-3">
              {/* Stone Image */}
              <div className="flex justify-center">
                <StoneImage 
                  stoneId={stone.id}
                  stoneName={stone.name}
                  thumbnailPath={stone.thumbnail_path}
                  size="lg"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Stone Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground line-clamp-2 text-center">
                  {stone.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {stone.average_rating?.toFixed(1) || '0.0'}
                  </span>
                </div>

                {/* Location */}
                {stone.address_text && (
                  <div className="flex items-start gap-1 justify-center">
                    <MapPin className="w-3 h-3 text-muted-foreground mt-1 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground text-center line-clamp-1">
                      {stone.address_text}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PopularPlaces;