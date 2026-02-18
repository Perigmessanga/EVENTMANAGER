import { useRef, useEffect } from 'react';
import './ColorDot.css';

interface ColorDotProps {
  color: string;
}

export function ColorDot({ color }: ColorDotProps) {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dotRef.current) {
      dotRef.current.style.backgroundColor = color;
    }
  }, [color]);

  return (
    <div
      ref={dotRef}
      className="color-dot"
    />
  );
}

