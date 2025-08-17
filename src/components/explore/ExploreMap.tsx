import React, { useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { O_GROVE_BOUNDS, O_GROVE_CENTER } from '@/lib/map-config';
import { Stone } from '@/lib/data-provider/interface';
import StoneInfoWindow from './StoneInfoWindow';

interface ExploreMapProps {
  stones: Stone[];
  onStoneSelect?: (stone: Stone | null) => void;
  className?: string;
}

const ExploreMap: React.FC<ExploreMapProps> = ({
  stones,
  onStoneSelect,
  className = "w-full h-full",
}) => {
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleMarkerClick = useCallback((stone: Stone) => {
    setSelectedStone(stone);
    onStoneSelect?.(stone);
  }, [onStoneSelect]);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedStone(null);
    onStoneSelect?.(null);
  }, [onStoneSelect]);

  if (!apiKey) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted rounded-2xl`}>
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">Map Unavailable</h3>
          <p className="text-muted-foreground">Google Maps API Key is not configured</p>
        </div>
      </div>
    );
  }

  // Filter stones that have valid coordinates
  const markersData = stones.filter(stone => 
    stone.latitude && stone.longitude
  );

  return (
    <APIProvider apiKey={apiKey}>
      <div className={className}>
        <Map
          defaultCenter={O_GROVE_CENTER}
          defaultZoom={13}
          mapId={'DEMO_MAP_ID'}
          disableDefaultUI={false}
          gestureHandling={'greedy'}
          style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
          restriction={{
            latLngBounds: O_GROVE_BOUNDS,
            strictBounds: false,
          }}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
        >
          {/* Render markers for each stone */}
          {markersData.map((stone) => (
            <AdvancedMarker
              key={stone.id}
              position={{ lat: stone.latitude!, lng: stone.longitude! }}
              onClick={() => handleMarkerClick(stone)}
              title={stone.name}
            >
              <div className="bg-primary text-primary-foreground px-3 py-2 rounded-full shadow-lg border-2 border-background cursor-pointer hover:scale-110 transition-transform duration-200">
                <span className="text-sm font-medium">{stone.name}</span>
              </div>
            </AdvancedMarker>
          ))}

          {/* Info Window for selected stone */}
          {selectedStone && (
            <InfoWindow
              position={{
                lat: selectedStone.latitude!,
                lng: selectedStone.longitude!,
              }}
              onCloseClick={handleInfoWindowClose}
            >
              <StoneInfoWindow stone={selectedStone} />
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default ExploreMap;