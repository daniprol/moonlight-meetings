/**
 * Utility functions for generating and handling image thumbnails
 */

export const THUMBNAIL_SIZE = 200; // Square thumbnails for consistent grid layout
export const THUMBNAIL_QUALITY = 0.8;

/**
 * Generates a thumbnail from an image file
 * @param file Original image file
 * @param size Target size (width/height for square thumbnail)
 * @param quality JPEG quality (0-1)
 * @returns Promise resolving to thumbnail blob and dimensions
 */
export const generateThumbnail = async (
  file: File,
  size: number = THUMBNAIL_SIZE,
  quality: number = THUMBNAIL_QUALITY
): Promise<{ blob: Blob; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Cannot get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate dimensions for square crop (center crop)
      const sourceSize = Math.min(img.naturalWidth, img.naturalHeight);
      const sourceX = (img.naturalWidth - sourceSize) / 2;
      const sourceY = (img.naturalHeight - sourceSize) / 2;

      // Set canvas size to target dimensions
      canvas.width = size;
      canvas.height = size;

      // Draw the cropped and resized image
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceSize, sourceSize, // Source rectangle (square crop)
        0, 0, size, size // Destination rectangle
      );

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({
              blob,
              width: size,
              height: size
            });
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Gets the public URL for a thumbnail from Supabase storage
 */
export const getThumbnailUrl = (thumbnailPath: string): string => {
  return `https://yjtfjremprjzsfemcttr.supabase.co/storage/v1/object/public/stone-thumbnails/${thumbnailPath}`;
};