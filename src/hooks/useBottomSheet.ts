import { useState, useRef, useEffect, useCallback } from 'react';

interface UseBottomSheetProps {
  minHeight: number; // Percentage of viewport
  maxHeight: number; // Percentage of viewport
  initialHeight: number; // Percentage of viewport
}

export function useBottomSheet({ minHeight, maxHeight, initialHeight }: UseBottomSheetProps) {
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const dragStartHeight = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Snap to closest point
  const snapToPoint = useCallback((currentHeight: number) => {
    const midPoint = (minHeight + maxHeight) / 2;
    const targetHeight = currentHeight > midPoint ? maxHeight : minHeight;
    setHeight(targetHeight);
  }, [minHeight, maxHeight]);

  // Expand to maximum height
  const expandToMax = useCallback(() => {
    setHeight(maxHeight);
  }, [maxHeight]);

  // Collapse to minimum height
  const collapseToMin = useCallback(() => {
    setHeight(minHeight);
  }, [minHeight]);

  // Handle scroll events for expansion/contraction
  const handleScroll = useCallback((e: WheelEvent | TouchEvent) => {
    if (isDragging) return;

    const isExpanded = height >= maxHeight * 0.9; // Consider expanded when near max
    const isCollapsed = height <= minHeight * 1.1; // Consider collapsed when near min
    
    let deltaY = 0;
    
    if ('deltaY' in e) {
      // Mouse wheel
      deltaY = e.deltaY;
    } else {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      if (touch) {
        const currentY = touch.clientY;
        deltaY = currentY - lastScrollY.current;
        lastScrollY.current = currentY;
      }
    }

    // Scrolling up (negative deltaY) when collapsed -> expand
    if (deltaY < 0 && isCollapsed) {
      e.preventDefault();
      expandToMax();
    }
    // Scrolling down (positive deltaY) when expanded -> check if at top of content
    else if (deltaY > 0 && isExpanded) {
      const scrollArea = containerRef.current?.querySelector('[data-scroll-area]') as HTMLElement;
      if (scrollArea && scrollArea.scrollTop === 0) {
        e.preventDefault();
        collapseToMin();
      }
    }

    setIsScrolling(true);
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 150);
  }, [height, maxHeight, minHeight, isDragging, expandToMax, collapseToMin]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!(e.target as HTMLElement)?.hasAttribute('data-drag-handle')) return;
    
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = height;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [height]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = dragStartY.current - e.clientY;
    const deltaPercent = (deltaY / window.innerHeight) * 100;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, dragStartHeight.current + deltaPercent));
    
    setHeight(newHeight);
  }, [isDragging, minHeight, maxHeight]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    snapToPoint(height);
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging, height, snapToPoint]);

  // Touch drag handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!(e.target as HTMLElement)?.hasAttribute('data-drag-handle')) return;
    
    setIsDragging(true);
    dragStartY.current = e.touches[0].clientY;
    dragStartHeight.current = height;
    lastScrollY.current = e.touches[0].clientY;
  }, [height]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    const deltaY = dragStartY.current - e.touches[0].clientY;
    const deltaPercent = (deltaY / window.innerHeight) * 100;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, dragStartHeight.current + deltaPercent));
    
    setHeight(newHeight);
  }, [isDragging, minHeight, maxHeight]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    snapToPoint(height);
  }, [isDragging, height, snapToPoint]);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse events
    container.addEventListener('mousedown', handleMouseDown);
    
    // Touch events
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    // Scroll events for expansion/contraction
    container.addEventListener('wheel', handleScroll, { passive: false });
    container.addEventListener('touchmove', handleScroll, { passive: false });

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleScroll);
      container.removeEventListener('touchmove', handleScroll);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      clearTimeout(scrollTimeout.current);
    };
  }, [handleMouseDown, handleTouchStart, handleTouchMove, handleTouchEnd, handleScroll, handleMouseMove, handleMouseUp]);

  return {
    height,
    isDragging,
    isScrolling,
    containerRef,
    expandToMax,
    collapseToMin,
    snapToPoint: () => snapToPoint(height)
  };
}