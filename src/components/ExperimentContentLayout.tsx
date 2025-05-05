'use client';

import React, { useEffect, useState } from 'react';

interface ExperimentContentLayoutProps {
  simulation: React.ReactNode;
  controls: React.ReactNode;
  info?: React.ReactNode;
  additionalControlsInfo?: React.ReactNode;
}

/**
 * A reusable layout component for experiment content that implements:
 * - Responsive layout (side-by-side on large screens, stacked on mobile)
 * - Sticky simulation and controllers that remain visible during scrolling
 * - Scrollable controllers when they exceed the viewport height
 * - Optimized space usage for the best user experience
 */
export default function ExperimentContentLayout({
  simulation,
  controls,
  info,
  additionalControlsInfo
}: ExperimentContentLayoutProps) {
  // Calculate the max height for controls based on viewport size
  const [maxControlsHeight, setMaxControlsHeight] = useState('calc(100vh - 2rem)');
  
  useEffect(() => {
    // Set initial height and update on resize
    const updateMaxHeight = () => {
      // Account for header and some padding
      const headerHeight = 60; // Approximate header height
      const paddingSpace = 40; // Extra padding
      const viewportHeight = window.innerHeight;
      const calculatedHeight = viewportHeight - headerHeight - paddingSpace;
      setMaxControlsHeight(`${calculatedHeight}px`);
    };
    
    // Set initial value
    updateMaxHeight();
    
    // Add resize listener
    window.addEventListener('resize', updateMaxHeight);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateMaxHeight);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content column - simulation and info */}
      <div className="lg:w-2/3">
        <div className="sticky top-4">
          {/* Simulation area */}
          <div className="bg-white rounded-lg shadow p-4">
            {simulation}
          </div>
          
          {/* Information section (if provided) */}
          {info && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow">
              {info}
            </div>
          )}
        </div>
      </div>
      
      {/* Controls column - sticky on desktop with independent scrolling */}
      <div className="lg:w-1/3 lg:sticky lg:top-4 lg:self-start">
        {/* Scrollable container for controls */}
        <div 
          className="scrollbar-thin lg:overflow-y-auto lg:pb-4 lg:pr-2" 
          style={{ maxHeight: maxControlsHeight }}
        >
          {/* Main controls */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            {controls}
          </div>
          
          {/* Additional info for controls (if provided) */}
          {additionalControlsInfo && (
            <div className="bg-white rounded-lg shadow p-4">
              {additionalControlsInfo}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 