import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

// Exporting MapMarker so other components can use the type
export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title?: string;
}

interface EmbeddedMapProps {
  center?: { lat: number; lng: number } | null;
  zoom?: number;
  markers?: MapMarker[];
  onMarkerClick?: (id: string) => void;
  onMapClick?: (e: google.maps.MapMouseEvent) => void; // Prop to handle map clicks
  className?: string;
}

const EmbeddedMap: React.FC<EmbeddedMapProps> = ({
  center,
  zoom = 5,
  markers = [],
  onMarkerClick,
  onMapClick, // Handler for map clicks
  className,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Use a default center if the provided center is null or undefined
  const mapCenter = center || { lat: 40.4168, lng: -3.7038 };

  if (!apiKey) {
    return (
      <div className={className || 'w-full h-[60vh] rounded-lg shadow-moonlight flex items-center justify-center bg-gray-200'}>
        <p>Google Maps API Key is not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className={className || 'w-full h-[60vh] rounded-lg shadow-moonlight'}>
        <Map
          key={`${mapCenter.lat}-${mapCenter.lng}-${zoom}`} // Force re-render on center/zoom change
          center={mapCenter}
          zoom={zoom}
          mapId={'DEMO_MAP_ID'}
          disableDefaultUI={false}
          gestureHandling={'greedy'}
          style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
          onClick={onMapClick} // Attach the click handler here
        >
          {markers.map((m) => (
            <Marker
              key={m.id}
              position={m.position}
              title={m.title}
              onClick={() => onMarkerClick && onMarkerClick(m.id)}
            />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
};

export default EmbeddedMap;
