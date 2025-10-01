import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollPickerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  formatter?: (value: number) => string;
}

export function ScrollPicker({ 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  suffix = '',
  formatter 
}: ScrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const values = [];
  for (let i = min; i <= max; i += step) {
    values.push(i);
  }

  const itemHeight = 48;
  const visibleItems = 5;
  const currentIndex = values.indexOf(value);

  useEffect(() => {
    if (containerRef.current && currentIndex !== -1) {
      const scrollTop = currentIndex * itemHeight;
      containerRef.current.scrollTop = scrollTop;
    }
  }, [currentIndex, itemHeight]);

  const handleScroll = () => {
    if (!containerRef.current || isDragging) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1));
    
    if (values[clampedIndex] !== value) {
      onChange(values[clampedIndex]);
    }
  };

  const snapToNearest = () => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const targetScroll = index * itemHeight;
    
    containerRef.current.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
    
    setIsDragging(false);
  };

  return (
    <div className="relative h-[240px] overflow-hidden">
      {/* Selection indicator */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 border-y-2 border-primary/30 bg-primary/5 pointer-events-none z-10" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none z-20" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
      
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll scrollbar-hide"
        onScroll={handleScroll}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={snapToNearest}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={snapToNearest}
        style={{
          paddingTop: `${itemHeight * 2}px`,
          paddingBottom: `${itemHeight * 2}px`,
        }}
      >
        {values.map((val) => (
          <div
            key={val}
            className={cn(
              "flex items-center justify-center transition-all duration-200",
              "text-2xl font-semibold cursor-pointer"
            )}
            style={{ height: `${itemHeight}px` }}
            onClick={() => {
              onChange(val);
              if (containerRef.current) {
                const index = values.indexOf(val);
                containerRef.current.scrollTo({
                  top: index * itemHeight,
                  behavior: 'smooth'
                });
              }
            }}
          >
            <span className={cn(
              "transition-all duration-200",
              val === value ? "text-primary scale-110" : "text-muted-foreground scale-90"
            )}>
              {formatter ? formatter(val) : val}{suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
