'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  showFieldLines: boolean;
  showForceVectors: boolean;
  numFieldLines: number;
  testChargeEnabled: boolean;
  setShowFieldLines: (value: boolean) => void;
  setShowForceVectors: (value: boolean) => void;
  setNumFieldLines: (value: number) => void;
  setTestChargeEnabled: (value: boolean) => void;
}

function ElectricFieldControlsContent({
  showFieldLines,
  showForceVectors,
  numFieldLines,
  testChargeEnabled,
  setShowFieldLines,
  setShowForceVectors,
  setNumFieldLines,
  setTestChargeEnabled,
}: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Experiment Controls</h3>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showFieldLines}
            onChange={(e) => setShowFieldLines(e.target.checked)}
            className="mr-2"
          />
          Show electric field lines
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showForceVectors}
            onChange={(e) => setShowForceVectors(e.target.checked)}
            className="mr-2"
          />
          Show force vectors
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={testChargeEnabled}
            onChange={(e) => setTestChargeEnabled(e.target.checked)}
            className="mr-2"
          />
          Enable test charge
        </label>
        {testChargeEnabled && (
          <p className="text-xs text-gray-500 mt-1 ml-5">Move cursor over the field to position the test charge</p>
        )}
      </div>

      <button 
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-blue-500 hover:text-blue-700 mb-4 text-sm flex items-center"
      >
        {showAdvanced ? '▼ Hide' : '► Show'} advanced options
      </button>

      {showAdvanced && (
        <div className="mb-4 border-t pt-4">
          <label className="block mb-2">
            Number of field lines: {numFieldLines}
          </label>
          <div className="flex items-center">
            <span className="mr-2">4</span>
            <input
              type="range"
              min="4"
              max="32"
              step="4"
              value={numFieldLines}
              onChange={(e) => setNumFieldLines(Number(e.target.value))}
              className="w-full"
            />
            <span className="ml-2">32</span>
          </div>
        </div>
      )}

      <button 
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={() => {
          setShowFieldLines(true);
          setShowForceVectors(false);
          setNumFieldLines(16);
          setTestChargeEnabled(false);
        }}
      >
        Reset to Default
      </button>

      <div className="mt-6 bg-blue-50 p-3 rounded border border-blue-100 text-sm">
        <h4 className="font-bold mb-1">Electric Field Equations</h4>
        <div className="grid grid-cols-1 gap-2 font-mono">
          <div>
            <p className="font-medium">Electric Field (E):</p>
            <p>E = k·q/r²</p>
          </div>
          <div>
            <p className="font-medium">Coulomb's Law:</p>
            <p>F = k·q₁·q₂/r²</p>
          </div>
          <div>
            <p className="font-medium">Electric Potential:</p>
            <p>V = k·q/r</p>
          </div>
        </div>
        <p className="mt-2 text-xs">
          Where k is Coulomb's constant (9×10⁹ N·m²/C²), q is charge, and r is distance
        </p>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-2 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <span className="font-semibold">Instructions:</span>
          <ul className="list-disc ml-4 mt-1">
            <li>Drag charges to reposition them</li>
            <li>Field lines show the direction a positive charge would move</li>
            <li>Force vectors show strength and direction of the electric field</li>
            <li>The test charge shows the resultant force at any point</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const ElectricFieldControls = dynamic(() => Promise.resolve(ElectricFieldControlsContent), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Loading controls...</h3>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-6"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

export default ElectricFieldControls; 