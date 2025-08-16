/// <reference types="google.maps" />
import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export interface MapMarker {
  id: string;
  position: google.maps.LatLngLiteral;
  title?: string;
}

interface EmbeddedMapProps {
  apiKey?: string; // optional, will read from localStorage if not provided
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: MapMarker[];
  onMarkerClick?: (id: string) => void;
  onMapClick?: (position: google.maps.LatLngLiteral) => void;
  className?: string;
  showApiKeyPrompt?: boolean;
}

const EmbeddedMap: React.FC<EmbeddedMapProps> = ({
  apiKey,
  center = { lat: 40.4168, lng: -3.7038 },
  zoom = 5,
  markers = [],
  onMarkerClick,
  onMapClick,
  className,
  showApiKeyPrompt = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRefs = useRef<Record<string, google.maps.Marker>>({});
  const [apiKeyInput, setApiKeyInput] = React.useState('');
  const [hasApiKey, setHasApiKey] = React.useState(false);

  // Check for API key on mount
  React.useEffect(() => {
    const key = apiKey || localStorage.getItem('GOOGLE_MAPS_API_KEY') || '';
    setHasApiKey(!!key);
  }, [apiKey]);

  useEffect(() => {
    const key = apiKey || localStorage.getItem('GOOGLE_MAPS_API_KEY') || '';
    if (!key) return;

    const loader = new Loader({ apiKey: key, version: 'weekly' });
    let cancelled = false;

    loader.load().then(() => {
      if (cancelled || !containerRef.current) return;
      mapRef.current = new google.maps.Map(containerRef.current, {
        center,
        zoom,
        mapId: 'DEMO_MAP_ID',
        disableDefaultUI: false,
        backgroundColor: '#000',
      });

      // Add map click listener for coordinate selection
      if (onMapClick) {
        mapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick({
              lat: e.latLng.lat(),
              lng: e.latLng.lng()
            });
          }
        });
      }

      // Add markers
      markers.forEach((m) => {
        const marker = new google.maps.Marker({
          position: m.position,
          map: mapRef.current!,
          title: m.title,
        });
        if (onMarkerClick) {
          marker.addListener('click', () => onMarkerClick(m.id));
        }
        markerRefs.current[m.id] = marker;
      });
    }).catch((error) => {
      console.error('Failed to load Google Maps:', error);
    });

    return () => {
      cancelled = true;
      Object.values(markerRefs.current).forEach((mk) => mk.setMap(null));
      markerRefs.current = {};
    };
  }, [apiKey, center, zoom, onMapClick]);

  useEffect(() => {
    // Update markers on change
    if (!mapRef.current) return;

    // Remove all existing markers
    Object.values(markerRefs.current).forEach((mk) => mk.setMap(null));
    markerRefs.current = {};

    markers.forEach((m) => {
      const marker = new google.maps.Marker({ position: m.position, map: mapRef.current!, title: m.title });
      if (onMarkerClick) marker.addListener('click', () => onMarkerClick(m.id));
      markerRefs.current[m.id] = marker;
    });
  }, [markers]);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('GOOGLE_MAPS_API_KEY', apiKeyInput.trim());
      setHasApiKey(true);
      setApiKeyInput('');
    }
  };

  // Show API key setup if no key is available
  if (!hasApiKey && showApiKeyPrompt) {
    return (
      <div className={`${className || 'w-full h-[60vh] rounded-lg'} bg-card/60 backdrop-blur border-border/50 flex flex-col items-center justify-center space-y-4 p-6`}>
        <div className="text-center space-y-2">
          <div className="text-2xl">🗺️</div>
          <h3 className="text-lg font-semibold stellar-text">Google Maps Setup Required</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            To use the interactive map, please add your Google Maps API key. This will be stored locally in your browser.
          </p>
        </div>
        
        <div className="w-full max-w-sm space-y-3">
          <input
            type="text"
            placeholder="Enter your Google Maps API key"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-sm"
          />
          <button
            onClick={handleSaveApiKey}
            disabled={!apiKeyInput.trim()}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium shadow-glow hover:shadow-glow/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Save API Key
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          <p>Don't have an API key? <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Get one here</a></p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className={className || 'w-full h-[60vh] rounded-lg shadow-moonlight'} />;
};

export default EmbeddedMap;
