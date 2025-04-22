"use client";

import React, { useState, useEffect, useRef } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  defaultMinValue?: number;
  defaultMaxValue?: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 100,
  minValue,
  maxValue,
  defaultMinValue,
  defaultMaxValue,
  onMinChange,
  onMaxChange,
}) => {
  // Use provided defaults or current values as fallback
  const defaultMin = defaultMinValue !== undefined ? defaultMinValue : minValue;
  const defaultMax = defaultMaxValue !== undefined ? defaultMaxValue : maxValue;

  const handleReset = () => {
    onMinChange(defaultMin);
    onMaxChange(defaultMax);
  };
  const [minThumbPosition, setMinThumbPosition] = useState(0);
  const [maxThumbPosition, setMaxThumbPosition] = useState(0);
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);

  // Calculate position from value
  const valueToPosition = (value: number): number => {
    return ((value - min) / (max - min)) * 100;
  };

  // Calculate value from position
  const positionToValue = (position: number): number => {
    const rawValue = min + (position / 100) * (max - min);
    return Math.round(rawValue / step) * step;
  };

  // Update positions when values change
  useEffect(() => {
    setMinThumbPosition(valueToPosition(minValue));
    setMaxThumbPosition(valueToPosition(maxValue));
  }, [minValue, maxValue, min, max]);

  // Handle track click
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;

    const value = positionToValue(position);

    // Determine which thumb to move based on which is closer
    const minDistance = Math.abs(value - minValue);
    const maxDistance = Math.abs(value - maxValue);

    if (minDistance <= maxDistance) {
      onMinChange(Math.min(value, maxValue - step));
    } else {
      onMaxChange(Math.max(value, minValue + step));
    }
  };

  // Handle min thumb drag
  const handleMinMouseDown = () => {
    setIsDraggingMin(true);
  };

  // Handle max thumb drag
  const handleMaxMouseDown = () => {
    setIsDraggingMax(true);
  };

  // Handle hover for tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setHoverPosition(position);
    setHoverValue(positionToValue(position));
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  // Global mouse move and up handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingMin && !isDraggingMax) return;
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const position = Math.min(
        Math.max(((e.clientX - rect.left) / rect.width) * 100, 0),
        100
      );
      const value = positionToValue(position);

      if (isDraggingMin) {
        const boundedValue = Math.min(Math.max(value, min), maxValue - step);
        onMinChange(boundedValue);
      } else if (isDraggingMax) {
        const boundedValue = Math.max(Math.min(value, max), minValue + step);
        onMaxChange(boundedValue);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingMin(false);
      setIsDraggingMax(false);
    };

    if (isDraggingMin || isDraggingMax) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDraggingMin,
    isDraggingMax,
    min,
    max,
    step,
    minValue,
    maxValue,
    onMinChange,
    onMaxChange,
  ]);

  return (
    <div className="w-full min-w-3xl px-2 py-4 select-none">
      {/* Value display */}
      <div className="flex justify-between mb-2 text-sm text-neutral-700">
        <div className="flex gap-x-4">
          <div>
            Min: <span className="font-medium">{minValue}</span>
          </div>
          <div>
            Max: <span className="font-medium">{maxValue}</span>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="text-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded border border-neutral-300 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset
        </button>
      </div>

      {/* Track and thumbs */}
      <div
        className="relative h-10 w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main track */}
        <div
          ref={trackRef}
          className="absolute top-1/2 left-0 right-0 h-2 -mt-1 rounded-full bg-neutral-200 cursor-pointer"
          onClick={handleTrackClick}
        >
          {/* Active track */}
          <div
            className="absolute h-full bg-neutral-600 rounded-full"
            style={{
              left: `${minThumbPosition}%`,
              right: `${100 - maxThumbPosition}%`,
            }}
          />
        </div>

        {/* Minimum thumb */}
        <div
          className={`absolute top-1/2 -mt-3 -ml-3 h-6 w-6 rounded-full bg-white border-2 border-neutral-600 cursor-grab shadow-md transition-shadow ${
            isDraggingMin ? "cursor-grabbing shadow-lg border-neutral-800" : ""
          } hover:shadow-lg hover:border-neutral-800`}
          style={{ left: `${minThumbPosition}%` }}
          onMouseDown={handleMinMouseDown}
        />

        {/* Maximum thumb */}
        <div
          className={`absolute top-1/2 -mt-3 -ml-3 h-6 w-6 rounded-full bg-white border-2 border-neutral-600 cursor-grab shadow-md transition-shadow ${
            isDraggingMax ? "cursor-grabbing shadow-lg border-neutral-800" : ""
          } hover:shadow-lg hover:border-neutral-800`}
          style={{ left: `${maxThumbPosition}%` }}
          onMouseDown={handleMaxMouseDown}
        />

        {/* Tooltip */}
        {hoverValue !== null && (
          <div
            className="absolute bottom-full mb-2 px-2 py-1 -translate-x-1/2 bg-neutral-800 text-white text-xs rounded shadow pointer-events-none"
            style={{ left: `${hoverPosition}%` }}
          >
            {hoverValue}
          </div>
        )}
      </div>

      {/* Step markers */}
      <div className="relative w-full h-5 mt-1">
        {Array.from({ length: (max - min) / (step * 5) + 1 }).map((_, i) => {
          const position = ((i * 5 * step) / (max - min)) * 100;
          const value = min + i * 5 * step;
          return (
            <div
              key={i}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${position}%` }}
            >
              <div className="w-0.5 h-1.5 bg-neutral-300 mx-auto"></div>
              <div className="text-xs text-neutral-500 mt-1">{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RangeSlider;
