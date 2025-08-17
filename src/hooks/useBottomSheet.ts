import { useState, useRef, useCallback, useEffect } from 'react';

interface UseBottomSheetProps {
  minHeight?: number; // percentage
  maxHeight?: number; // percentage
  initialHeight?: number; // percentage
}

export function useBottomSheet({
  minHeight = 40,
  maxHeight = 80,
  initialHeight = 40
}: UseBottomSheetProps = {}) {
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    startY.current = touch.clientY;
    startHeight.current = height;
    setIsDragging(true);
  }, [height]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const deltaY = startY.current - touch.clientY;
    const viewportHeight = window.innerHeight;
    const deltaPercent = (deltaY / viewportHeight) * 100;
    
    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, startHeight.current + deltaPercent)
    );
    
    setHeight(newHeight);
  }, [isDragging, minHeight, maxHeight]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Snap to closest position
    const midPoint = (minHeight + maxHeight) / 2;
    const targetHeight = height > midPoint ? maxHeight : minHeight;
    setHeight(targetHeight);
  }, [isDragging, height, minHeight, maxHeight]);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (!target || !containerRef.current) return;

    const scrollTop = target.scrollTop;
    const isAtTop = scrollTop === 0;
    
    if (isAtTop && height < maxHeight) {
      setIsScrolling(true);
      setHeight(maxHeight);
      
      // Reset scroll after animation
      setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    }
  }, [height, maxHeight]);

  const expandToMax = useCallback(() => {
    setHeight(maxHeight);
  }, [maxHeight]);

  const collapseToMin = useCallback(() => {
    setHeight(minHeight);
  }, [minHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add touch event listeners to the drag handle
    const dragHandle = container.querySelector('[data-drag-handle]') as HTMLElement;
    if (dragHandle) {
      dragHandle.addEventListener('touchstart', handleTouchStart, { passive: false });
    }

    // Add scroll listener to the scrollable content
    const scrollArea = container.querySelector('[data-scroll-area]') as HTMLElement;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Global touch move and end listeners
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      if (dragHandle) {
        dragHandle.removeEventListener('touchstart', handleTouchStart);
      }
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', handleScroll);
      }
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleScroll]);

  return {
    height,
    isDragging,
    isScrolling,
    containerRef,
    expandToMax,
    collapseToMin,
    setHeight
  };
}