import React, { useEffect } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { O_GROVE_BOUNDS, O_GROVE_CENTER } from '@/lib/map-config';

/**
 * A controller component to programmatically pan and zoom the map.
 * This is the standard way to command an uncontrolled map.
 */
const MapController = ({ center, zoom }: { center: google.maps.LatLngLiteral; zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo(center);
    map.setZoom(zoom);
  }, [map, center, zoom]);

  return null;
};

interface EmbeddedMapProps {
  center?: { lat: number; lng: number } | null;
  zoom?: number;
  onCameraChange?: (e: { center: google.maps.LatLngLiteral; zoom: number }) => void;
  className?: string;
}

const EmbeddedMap: React.FC<EmbeddedMapProps> = ({
  center,
  zoom = 12,
  onCameraChange,
  className,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
          defaultCenter={O_GROVE_CENTER}
          defaultZoom={12}
          mapId={'DEMO_MAP_ID'}
          disableDefaultUI={false}
          gestureHandling={'greedy'}
          style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
          restriction={{
            latLngBounds: O_GROVE_BOUNDS,
            strictBounds: false,
          }}
          onIdle={(e) => {
            if (onCameraChange && e.map) {
              const newCenter = e.map.getCenter()!;
              const newZoom = e.map.getZoom()!;
              onCameraChange({ center: newCenter.toJSON(), zoom: newZoom });
            }
          }}
        >
          {/* The MapController only runs when the parent needs to command the map */}
          {center && <MapController center={center} zoom={zoom} />}
        </Map>
      </div>
    </APIProvider>
  );
};

export default EmbeddedMap;