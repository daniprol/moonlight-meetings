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
 * Get different stone shapes based on stone ID for variety
 */
const getStoneShape = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 4; // 4 different stone shapes
};

/**
 * Collection of realistic stone/rock SVG shapes
 */
const StoneShapes = {
  0: ({ color, className }: { color: string; className: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill={color}>
      <path d="M12 2c-2.5 0-4.8 1.2-6.2 3.1C4.2 6.8 3 9.2 3 12c0 2.8 1.2 5.2 2.8 6.9C7.2 20.8 9.5 22 12 22s4.8-1.2 6.2-3.1C19.8 17.2 21 14.8 21 12c0-2.8-1.2-5.2-2.8-6.9C16.8 3.2 14.5 2 12 2z"/>
      <ellipse cx="8" cy="8" rx="1.5" ry="1" fill="white" opacity="0.4"/>
      <ellipse cx="16" cy="14" rx="1" ry="0.8" fill="white" opacity="0.3"/>
    </svg>
  ),
  1: ({ color, className }: { color: string; className: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill={color}>
      <path d="M6 7c-1.1 0-2 .9-2 2v6c0 3.3 2.7 6 6 6h4c3.3 0 6-2.7 6-6V9c0-1.1-.9-2-2-2h-2L14 4h-4L8 7H6z"/>
      <circle cx="9" cy="10" r="0.8" fill="white" opacity="0.5"/>
      <circle cx="15" cy="16" r="1.2" fill="white" opacity="0.3"/>
      <ellipse cx="12" cy="13" rx="0.6" ry="0.4" fill="white" opacity="0.4"/>
    </svg>
  ),
  2: ({ color, className }: { color: string; className: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill={color}>
      <path d="M12 3L4 6v4c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-8-3z"/>
      <circle cx="10" cy="9" r="1" fill="white" opacity="0.6"/>
      <circle cx="14" cy="15" r="0.7" fill="white" opacity="0.4"/>
      <ellipse cx="8" cy="16" rx="0.8" ry="0.5" fill="white" opacity="0.3"/>
    </svg>
  ),
  3: ({ color, className }: { color: string; className: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill={color}>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      <circle cx="7" cy="11" r="0.9" fill="white" opacity="0.5"/>
      <circle cx="15" cy="17" r="1.1" fill="white" opacity="0.4"/>
      <ellipse cx="11" cy="14" rx="0.7" ry="0.5" fill="white" opacity="0.6"/>
    </svg>
  )
};

/**
 * Stone icon component that shows different shapes and colors
 */
const StoneIcon = ({ size = 'md', color, stoneId }: { size: keyof typeof iconSizes; color: string; stoneId: string }) => {
  const shapeIndex = getStoneShape(stoneId);
  const StoneShape = StoneShapes[shapeIndex as keyof typeof StoneShapes];
  
  return <StoneShape color={color} className={iconSizes[size]} />;
};

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
        <StoneIcon size={size} color={stoneColor} stoneId={stoneId} />
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