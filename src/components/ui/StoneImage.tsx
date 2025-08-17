import { useState } from 'react';
import { getThumbnailUrl } from '@/lib/thumbnail-utils';

/**
 * Generates a consistent color based on a string (stone ID)
 * Uses a simple hash function to ensure same ID always gets same color
 */
const getStoneColor = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Generate HSL color with good saturation and lightness
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

interface StoneImageProps {
  stoneId: string;
  stoneName: string;
  thumbnailPath?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16', 
  lg: 'w-24 h-24'
};

const iconSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

/**
 * Default shining stone icon component
 */
const ShiningStoneIcon = ({ size = 'md', color }: { size: keyof typeof iconSizes; color: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={iconSizes[size]}
    style={{ color }}
    fill="currentColor"
  >
    <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"/>
    <path d="M12 2v20" stroke="white" strokeWidth="0.5" opacity="0.3"/>
    <path d="M4 7l8 5 8-5" stroke="white" strokeWidth="0.5" opacity="0.3"/>
    <circle cx="8" cy="6" r="1" fill="white" opacity="0.6"/>
    <circle cx="16" cy="10" r="0.5" fill="white" opacity="0.8"/>
    <circle cx="10" cy="15" r="0.8" fill="white" opacity="0.4"/>
  </svg>
);

export default function StoneImage({ 
  stoneId, 
  stoneName, 
  thumbnailPath, 
  className = '', 
  size = 'md' 
}: StoneImageProps) {
  const [imageError, setImageError] = useState(false);
  const stoneColor = getStoneColor(stoneId);

  // If no thumbnail or image failed to load, show default stone graphic
  if (!thumbnailPath || imageError) {
    return (
      <div 
        className={`${sizeClasses[size]} ${className} rounded-xl flex items-center justify-center`}
        style={{ backgroundColor: `${stoneColor}20` }} // 20% opacity background
      >
        <ShiningStoneIcon size={size} color={stoneColor} />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-xl overflow-hidden bg-muted`}>
      <img
        src={getThumbnailUrl(thumbnailPath)}
        alt={`${stoneName} thumbnail`}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}