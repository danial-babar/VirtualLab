'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  elasticity: number;
  showVelocityVectors: boolean;
  showMomentumVectors: boolean;
  useGravity: boolean;
  slowMotion: boolean;
  setElasticity: (value: number) => void;
  setShowVelocityVectors: (value: boolean) => void;
  setShowMomentumVectors: (value: boolean) => void;
  setUseGravity: (value: boolean) => void;
  setSlowMotion: (value: boolean) => void;
}

function CollisionControlsContent({
  elasticity,
  showVelocityVectors,
  showMomentumVectors,
  useGravity,
  slowMotion,
  setElasticity,
  setShowVelocityVectors,
  setShowMomentumVectors,
  setUseGravity,
  setSlowMotion,
}: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Experiment Controls</h3>
      
      <div className="mb-4">
        <label className="block mb-2">
          Elasticity: {elasticity.toFixed(2)}
        </label>
        <div className="flex items-center">
          <span className="mr-2">0.0</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={elasticity}
            onChange={(e) => setElasticity(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">1.0</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          0 = perfectly inelastic (no bounce) | 1 = perfectly elastic (full bounce)
        </div>
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
            checked={showMomentumVectors}
            onChange={(e) => setShowMomentumVectors(e.target.checked)}
            className="mr-2"
          />
          Show momentum vectors
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useGravity}
            onChange={(e) => setUseGravity(e.target.checked)}
            className="mr-2"
          />
          Enable gravity
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={slowMotion}
            onChange={(e) => setSlowMotion(e.target.checked)}
            className="mr-2"
          />
          Slow motion
        </label>
      </div>

      <button 
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={() => {
          setElasticity(0.8);
          setShowVelocityVectors(true);
          setShowMomentumVectors(false);
          setUseGravity(false);
          setSlowMotion(false);
        }}
      >
        Reset to Default
      </button>

      <div className="mt-6 bg-blue-50 p-3 rounded border border-blue-100 text-sm">
        <h4 className="font-bold mb-1">Collision Physics Equations</h4>
        <div className="grid grid-cols-1 gap-2 font-mono">
          <div>
            <p className="font-medium">Kinetic Energy:</p>
            <p>KE = ½mv²</p>
          </div>
          <div>
            <p className="font-medium">Momentum:</p>
            <p>p = mv</p>
          </div>
          <div>
            <p className="font-medium">Conservation of Momentum:</p>
            <p>m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'</p>
          </div>
        </div>
        <p className="mt-2 text-xs">
          Where m is mass, v is velocity, and v' is velocity after collision
        </p>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-2 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <span className="font-semibold">Collision Types:</span>
          <ul className="list-disc ml-4 mt-1">
            <li><strong>Elastic collision (e=1):</strong> Kinetic energy is conserved</li>
            <li><strong>Inelastic collision (0&lt;e&lt;1):</strong> Some kinetic energy is lost</li>
            <li><strong>Perfectly inelastic (e=0):</strong> Maximum kinetic energy lost</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const CollisionControls = dynamic(() => Promise.resolve(CollisionControlsContent), {
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

export default CollisionControls; 