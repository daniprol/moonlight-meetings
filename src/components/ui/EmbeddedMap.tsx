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
  className?: string;
}

const EmbeddedMap: React.FC<EmbeddedMapProps> = ({
  apiKey,
  center = { lat: 40.4168, lng: -3.7038 },
  zoom = 5,
  markers = [],
  onMarkerClick,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRefs = useRef<Record<string, google.maps.Marker>>({});

  useEffect(() => {
    const key = apiKey || localStorage.getItem('GOOGLE_MAPS_API_KEY') || '';
    if (!key) return; // Ask user to set it in UI

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
    });

    return () => {
      cancelled = true;
      Object.values(markerRefs.current).forEach((mk) => mk.setMap(null));
      markerRefs.current = {};
    };
  }, [apiKey]);

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

  return <div ref={containerRef} className={className || 'w-full h-[60vh] rounded-lg shadow-moonlight'} />;
};

export default EmbeddedMap;
