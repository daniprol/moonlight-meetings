import React, { useState, useCallback, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { O_GROVE_BOUNDS, O_GROVE_CENTER } from '@/lib/map-config';
import { Stone } from '@/lib/data-provider/interface';
import StoneInfoWindow from './StoneInfoWindow';

interface ExploreMapProps {
  stones: Stone[];
  onStoneSelect?: (stone: Stone | null) => void;
  onMapClick?: () => void;
  selectedStone?: Stone | null;
  className?: string;
}

/**
 * A simple emoji marker that scales with the map's zoom level
 * and highlights with an outline when selected.
 */
const EmojiMarker = ({ zoom, isSelected }: { zoom: number, isSelected: boolean }) => {
  // Define font size based on zoom level for scalability
  const getFontSize = (currentZoom: number) => {
    if (currentZoom < 13) return '14px'; // Smaller when zoomed out
    if (currentZoom < 15) return '18px'; // Smaller default size
    return '26px';                   // A bit larger on zoom in
  };

  const style: React.CSSProperties = {
    fontSize: getFontSize(zoom),
    cursor: 'pointer',
    transition: 'filter 0.2s ease-in-out',
    // Apply a more prominent glow/outline effect when selected
    filter: isSelected ? 'drop-shadow(0 0 5px #ffc700)' : 'none',
    zIndex: isSelected ? 10 : 1,
    position: 'relative',
  };

  return <div style={style}>🪨</div>;
};


// Component to render markers and handle zoom-based scaling
const MapMarkers: React.FC<{ stones: Stone[]; onStoneSelect: (stone: Stone) => void; selectedStone: Stone | null }> = ({ 
  stones,
  onStoneSelect,
  selectedStone 
}) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map?.getZoom() ?? O_GROVE_CENTER.zoom);

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('zoom_changed', () => {
      setZoom(map.getZoom()!);
    });
    return () => google.maps.event.removeListener(listener);
  }, [map]);
  
  const markersData = stones.filter(stone => stone.latitude && stone.longitude);

  return (
    <>
      {markersData.map((stone) => {
        const isSelected = selectedStone?.id === stone.id;
        return (
          <AdvancedMarker
            key={stone.id}
            position={{ lat: stone.latitude!, lng: stone.longitude! }}
            onClick={() => onStoneSelect(stone)}
          >
            <EmojiMarker isSelected={isSelected} zoom={zoom} />
          </AdvancedMarker>
        );
      })}
    </>
  );
};

const ExploreMap: React.FC<ExploreMapProps> = ({
  stones,
  onStoneSelect,
  onMapClick,
  selectedStone,
  className = "w-full h-full",
}) => {
  const [internalSelectedStone, setInternalSelectedStone] = useState<Stone | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleMarkerClick = useCallback((stone: Stone) => {
    setInternalSelectedStone(stone);
    onStoneSelect?.(stone);
  }, [onStoneSelect]);

  const handleMapClick = useCallback(() => {
    onMapClick?.();
    if ((window as any).__collapseBottomSheet) {
      (window as any).__collapseBottomSheet();
    }
  }, [onMapClick]);

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
          onClick={handleMapClick}
        >
          <MapMarkers 
            stones={stones}
            onStoneSelect={handleMarkerClick}
            selectedStone={activeSelectedStone}
          />

          {activeSelectedStone && (
            <InfoWindow
              position={{
                lat: activeSelectedStone.latitude!,
                lng: activeSelectedStone.longitude!,
              }}
              onCloseClick={handleInfoWindowClose}
              options={{ pixelOffset: new google.maps.Size(0, -30) }} // Adjust InfoWindow position
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