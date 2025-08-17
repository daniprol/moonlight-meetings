import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// NEW: Interface for geographical bounds
interface Bounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

/**
 * Checks if a given latitude and longitude are valid geographical coordinates.
 * Can optionally check if the coordinates are within a specific bounding box.
 * @param lat The latitude.
 * @param lng The longitude.
 * @param bounds Optional. The bounding box to check against.
 * @returns True if the coordinates are valid, false otherwise.
 */
export function isValidCoordinate(lat: unknown, lng: unknown, bounds?: Bounds): boolean {
  if (typeof lat !== 'number' || isNaN(lat) || typeof lng !== 'number' || isNaN(lng)) {
    return false;
  }

  // If bounds are provided, check against them
  if (bounds) {
    return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
  }

  // Otherwise, check against world bounds
  if (lat < -90 || lat > 90) {
    return false;
  }
  if (lng < -180 || lng > 180) {
    return false;
  }
  
  return true;
}
