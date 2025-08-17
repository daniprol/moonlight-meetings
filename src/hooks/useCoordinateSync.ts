import { useState, useEffect, useTransition, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDebounce } from '@/hooks/useDebounce';
import { isValidCoordinate } from '@/lib/utils';
import { O_GROVE_BOUNDS, O_GROVE_CENTER } from '@/lib/map-config';

interface MapCamera {
  center: google.maps.LatLngLiteral;
  zoom: number;
}

/**
 * A robust hook to handle 2-way synchronization between a form and a map's camera.
 * It uses a ref to track the source of updates to prevent feedback loops.
 */
export function useCoordinateSync(form: UseFormReturn<any>) {
  const [mapCamera, setMapCamera] = useState<MapCamera>({ center: O_GROVE_CENTER, zoom: 12 });
  const [isPending, startTransition] = useTransition();

  // Ref to track if the last update came from the map, to prevent feedback loops.
  const updateSource = useRef<'form' | 'map'>('form');

  // --- Data flow: Form Inputs -> Map Camera ---
  const latValue = form.watch('latitude');
  const lngValue = form.watch('longitude');
  const debouncedLat = useDebounce(latValue, 300);
  const debouncedLng = useDebounce(lngValue, 300);

  useEffect(() => {
    // If the last update came from the map, we must not send a command back to the map.
    // We simply reset the flag and exit the effect.
    if (updateSource.current === 'map') {
      updateSource.current = 'form'; // Reset for the next form input
      return;
    }

    if (isValidCoordinate(debouncedLat, debouncedLng, O_GROVE_BOUNDS)) {
      startTransition(() => {
        setMapCamera((prev) => ({ ...prev, center: { lat: debouncedLat, lng: debouncedLng } }));
      });
    }
  }, [debouncedLat, debouncedLng, form]);


  // --- Data flow: Map Camera -> Form Inputs ---
  const handleCameraChange = (e: MapCamera) => {
    // When the map moves, flag that it is the source of the upcoming update.
    updateSource.current = 'map';

    // Update the form fields. The ref guard above will prevent this from causing a snap back.
    form.setValue('latitude', e.center.lat, { shouldValidate: true, shouldDirty: true });
    form.setValue('longitude', e.center.lng, { shouldValidate: true, shouldDirty: true });

    // We still update the zoom level instantly.
    setMapCamera((prev) => ({ ...prev, zoom: e.zoom }));
  };

  return {
    mapCenter: mapCamera.center,
    mapZoom: mapCamera.zoom,
    handleCameraChange,
    isPending,
  };
}
