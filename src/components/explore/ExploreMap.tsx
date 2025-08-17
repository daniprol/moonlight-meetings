import React, { useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { O_GROVE_BOUNDS, O_GROVE_CENTER } from '@/lib/map-config';
import { Stone } from '@/lib/data-provider/interface';
import StoneInfoWindow from './StoneInfoWindow';

interface ExploreMapProps {
  stones: Stone[];
  onStoneSelect?: (stone: Stone | null) => void;
  selectedStone?: Stone | null;
  className?: string;
}

// Component to render markers after map is ready
const MapMarkers: React.FC<{ stones: Stone[]; onStoneSelect: (stone: Stone) => void; selectedStone: Stone | null }> = ({
  stones,
  onStoneSelect,
  selectedStone
}) => {
  const map = useMap();
  
  // Only render markers when map is ready and properly initialized
  if (!map || !map.getDiv) return null;

  // Filter stones that have valid coordinates
  const markersData = stones.filter(stone => 
    stone.latitude && stone.longitude && 
    typeof stone.latitude === 'number' && 
    typeof stone.longitude === 'number'
  );

  // Add error boundary protection for marker rendering
  try {
    return (
      <>
        {markersData.map((stone) => {
          const isSelected = selectedStone?.id === stone.id;
          
          // Validate coordinates before creating marker
          const lat = Number(stone.latitude);
          const lng = Number(stone.longitude);
          
          if (isNaN(lat) || isNaN(lng)) return null;
          
          return (
            <AdvancedMarker
              key={stone.id}
              position={{ lat, lng }}
              onClick={() => onStoneSelect(stone)}
              title={stone.name}
            >
              <div className={`bg-background text-foreground px-3 py-2 rounded-lg shadow-lg border cursor-pointer transition-all duration-200 min-w-0 max-w-48 ${
                isSelected 
                  ? 'border-primary scale-110 shadow-xl ring-2 ring-primary/20' 
                  : 'border-border hover:scale-105 hover:shadow-xl'
              }`}>
                <div className="text-xs font-semibold truncate">{stone.name}</div>
                {stone.average_rating > 0 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span>★</span>
                    <span>{stone.average_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </AdvancedMarker>
          );
        })}
      </>
    );
  } catch (error) {
    console.warn('Error rendering map markers:', error);
    return null;
  }
};

const ExploreMap: React.FC<ExploreMapProps> = ({
  stones,
  onStoneSelect,
  selectedStone,
  className = "w-full h-full",
}) => {
  const [internalSelectedStone, setInternalSelectedStone] = useState<Stone | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleMarkerClick = useCallback((stone: Stone) => {
    setInternalSelectedStone(stone);
    onStoneSelect?.(stone);
  }, [onStoneSelect]);

  const handleInfoWindowClose = useCallback(() => {
    setInternalSelectedStone(null);
    onStoneSelect?.(null);
  }, [onStoneSelect]);

  const activeSelectedStone = internalSelectedStone || selectedStone;

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

  return (
    <APIProvider apiKey={apiKey}>
      <div className={className}>
        <Map
          defaultCenter={O_GROVE_CENTER}
          defaultZoom={13}
          mapId={'DEMO_MAP_ID'}
          disableDefaultUI={true}
          gestureHandling={'greedy'}
          style={{ width: '100%', height: '100%' }}
          restriction={{
            latLngBounds: O_GROVE_BOUNDS,
            strictBounds: false,
          }}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
        >
          {/* Render markers after map is ready */}
          <MapMarkers 
            stones={stones}
            onStoneSelect={handleMarkerClick}
            selectedStone={activeSelectedStone}
          />

          {/* Info Window for selected stone */}
          {activeSelectedStone && (
            <InfoWindow
              position={{
                lat: activeSelectedStone.latitude!,
                lng: activeSelectedStone.longitude!,
              }}
              onCloseClick={handleInfoWindowClose}
            >
              <StoneInfoWindow stone={activeSelectedStone} />
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default ExploreMap;