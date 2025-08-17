import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stone } from '@/lib/data-provider/interface';
import StoneImage from '@/components/ui/StoneImage';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';

interface StoneInfoWindowProps {
  stone: Stone;
}

const StoneInfoWindow: React.FC<StoneInfoWindowProps> = ({ stone }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/stone/${stone.id}`);
  };

  return (
    <div className="w-64 p-2">
      <div className="space-y-3">
        {/* Stone Image */}
        <div className="flex justify-center">
          <StoneImage 
            stoneId={stone.id}
            stoneName={stone.name}
            thumbnailPath={stone.thumbnail_path}
            size="lg"
          />
        </div>

        {/* Stone Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground leading-tight">
            {stone.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-foreground">
              {stone.average_rating?.toFixed(1) || '0.0'}
            </span>
            <span className="text-sm text-muted-foreground">
              • Rating
            </span>
          </div>

          {/* Location */}
          {stone.address_text && (
            <div className="flex items-start gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground line-clamp-2">
                {stone.address_text}
              </span>
            </div>
          )}

          {/* Description */}
          {stone.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {stone.description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleViewDetails}
          className="w-full"
          size="sm"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default StoneInfoWindow;