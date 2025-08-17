import { useState, useEffect, useTransition } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDebounce } from '@/hooks/useDebounce';
import { isValidCoordinate } from '@/lib/utils';

/**
 * A custom hook to synchronize coordinates between a react-hook-form
 * and a map component.
 * @param form The form instance from useForm.
 * @returns An object with marker position, map click handler, and transition state.
 */
export function useCoordinateSync(form: UseFormReturn<any>) {
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [isPending, startTransition] = useTransition();

  // Watch form fields for latitude and longitude
  const latValue = form.watch('latitude');
  const lngValue = form.watch('longitude');

  // Debounce the watched values to avoid excessive map updates
  const debouncedLat = useDebounce(latValue, 300);
  const debouncedLng = useDebounce(lngValue, 300);

  // Effect to update the map marker when debounced coordinates change
  useEffect(() => {
    if (isValidCoordinate(debouncedLat, debouncedLng)) {
      // Use startTransition to prevent UI blocking while map updates
      startTransition(() => {
        setMarkerPosition({ lat: debouncedLat, lng: debouncedLng });
      });
    }
  }, [debouncedLat, debouncedLng]);

  // Handler for when the user clicks on the map
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      startTransition(() => {
        setMarkerPosition({ lat, lng });
      });

      // Update form values and trigger validation
      form.setValue('latitude', lat, { shouldValidate: true, shouldDirty: true });
      form.setValue('longitude', lng, { shouldValidate: true, shouldDirty: true });
    }
  };

  return {
    markerPosition,
    handleMapClick,
    isPending, // The component can use this to show a loading state
  };
}
