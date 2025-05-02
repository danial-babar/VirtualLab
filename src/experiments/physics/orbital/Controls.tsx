'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  gravitationalConstant: number;
  showOrbits: boolean;
  showVelocityVectors: boolean;
  showForceVectors: boolean;
  timeScale: number;
  setGravitationalConstant: (value: number) => void;
  setShowOrbits: (value: boolean) => void;
  setShowVelocityVectors: (value: boolean) => void;
  setShowForceVectors: (value: boolean) => void;
  setTimeScale: (value: number) => void;
}

function OrbitalControlsContent({
  gravitationalConstant,
  showOrbits,
  showVelocityVectors,
  showForceVectors,
  timeScale,
  setGravitationalConstant,
  setShowOrbits,
  setShowVelocityVectors,
  setShowForceVectors,
  setTimeScale,
}: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Experiment Controls</h3>
      
      <div className="mb-4">
        <label className="block mb-2">
          Gravitational Constant: {gravitationalConstant.toFixed(2)}
        </label>
        <div className="flex items-center">
          <span className="mr-2">0.5</span>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={gravitationalConstant}
            onChange={(e) => setGravitationalConstant(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">10.0</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Controls the strength of gravity in the simulation
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Time Scale: {timeScale.toFixed(1)}x
        </label>
        <div className="flex items-center">
          <span className="mr-2">0.5x</span>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={timeScale}
            onChange={(e) => setTimeScale(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">5.0x</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Adjusts the speed of the simulation
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showOrbits}
            onChange={(e) => setShowOrbits(e.target.checked)}
            className="mr-2"
          />
          Show orbit paths
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showVelocityVectors}
            onChange={(e) => setShowVelocityVectors(e.target.checked)}
            className="mr-2"
          />
          Show velocity vectors
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
          Show gravitational force vectors
        </label>
      </div>

      <button 
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={() => {
          setGravitationalConstant(3.0);
          setShowOrbits(true);
          setShowVelocityVectors(true);
          setShowForceVectors(false);
          setTimeScale(1.0);
        }}
      >
        Reset to Default
      </button>

      <div className="mt-6 bg-blue-50 p-3 rounded border border-blue-100 text-sm">
        <h4 className="font-bold mb-1">Orbital Mechanics Equations</h4>
        <div className="grid grid-cols-1 gap-2 font-mono">
          <div>
            <p className="font-medium">Newton's Law of Gravitation:</p>
            <p>F = G·(m₁·m₂)/r²</p>
          </div>
          <div>
            <p className="font-medium">Kepler's Third Law:</p>
            <p>T² ∝ r³</p>
          </div>
          <div>
            <p className="font-medium">Circular Orbital Velocity:</p>
            <p>v = √(G·M/r)</p>
          </div>
        </div>
        <p className="mt-2 text-xs">
          Where G is the gravitational constant, m is mass, r is distance, T is orbital period, and v is velocity
        </p>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-2 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <span className="font-semibold">Kepler's Laws:</span>
          <ul className="list-disc ml-4 mt-1">
            <li><strong>First Law:</strong> Planets move in elliptical orbits with the sun at one focus</li>
            <li><strong>Second Law:</strong> A line joining a planet and the sun sweeps out equal areas in equal times</li>
            <li><strong>Third Law:</strong> The square of the orbital period is proportional to the cube of the semi-major axis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const OrbitalControls = dynamic(() => Promise.resolve(OrbitalControlsContent), {
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

export default OrbitalControls; 