'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  temperature: number;
  volume: number;
  particleCount: number;
  showCollisions: boolean;
  selectedLaw: 'boyle' | 'charles' | 'gay-lussac' | 'combined';
  setTemperature: (value: number) => void;
  setVolume: (value: number) => void;
  setParticleCount: (value: number) => void;
  setShowCollisions: (value: boolean) => void;
  setSelectedLaw: (value: 'boyle' | 'charles' | 'gay-lussac' | 'combined') => void;
}

function GasLawsControlsContent({
  temperature,
  volume,
  particleCount,
  showCollisions,
  selectedLaw,
  setTemperature,
  setVolume,
  setParticleCount,
  setShowCollisions,
  setSelectedLaw,
}: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Gas Laws Controls</h3>
      
      <div className="mb-6">
        <label className="text-sm font-medium mb-1 block">Select Gas Law</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'boyle', name: "Boyle's Law" },
            { id: 'charles', name: "Charles's Law" },
            { id: 'gay-lussac', name: "Gay-Lussac's Law" },
            { id: 'combined', name: "Combined Gas Law" }
          ].map((law) => (
            <button
              key={law.id}
              onClick={() => setSelectedLaw(law.id as any)}
              className={`py-2 px-3 text-sm rounded transition-colors ${
                selectedLaw === law.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {law.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Temperature: {temperature.toFixed(1)} K
        </label>
        <div className="flex items-center">
          <span className="mr-2">10K</span>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">200K</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Higher temperature increases particle speed
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Volume: {volume.toFixed(1)} units
        </label>
        <div className="flex items-center">
          <span className="mr-2">50</span>
          <input
            type="range"
            min="50"
            max="150"
            step="10"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">150</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Adjusts the container size
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Number of Particles: {particleCount}
        </label>
        <div className="flex items-center">
          <span className="mr-2">20</span>
          <input
            type="range"
            min="20"
            max="150"
            step="10"
            value={particleCount}
            onChange={(e) => setParticleCount(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">150</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showCollisions}
            onChange={(e) => setShowCollisions(e.target.checked)}
            className="mr-2"
          />
          Enable particle collisions
        </label>
        <div className="text-xs text-gray-500 mt-1 ml-5">
          When enabled, particles can collide with each other
        </div>
      </div>

      <button 
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-blue-500 hover:text-blue-700 mb-4 text-sm flex items-center"
      >
        {showAdvanced ? '▼ Hide' : '► Show'} gas laws explanation
      </button>

      {showAdvanced && (
        <div className="mb-6 border-t pt-4">
          <h4 className="font-bold mb-2">Gas Laws Explained</h4>
          
          <div className="mb-3">
            <h5 className="font-medium">Boyle's Law</h5>
            <p className="text-sm">Pressure is inversely proportional to volume (at constant temperature).</p>
            <p className="text-xs font-mono mt-1">P ∝ 1/V or PV = constant</p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Charles's Law</h5>
            <p className="text-sm">Volume is directly proportional to temperature (at constant pressure).</p>
            <p className="text-xs font-mono mt-1">V ∝ T or V/T = constant</p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Gay-Lussac's Law</h5>
            <p className="text-sm">Pressure is directly proportional to temperature (at constant volume).</p>
            <p className="text-xs font-mono mt-1">P ∝ T or P/T = constant</p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Combined/Ideal Gas Law</h5>
            <p className="text-sm">Combines all three laws into a single equation.</p>
            <p className="text-xs font-mono mt-1">PV = nRT or PV/T = nR (constant)</p>
          </div>
        </div>
      )}

      <button 
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
        onClick={() => {
          setTemperature(100);
          setVolume(100);
          setParticleCount(50);
          setShowCollisions(true);
          setSelectedLaw('combined');
        }}
      >
        Reset to Default
      </button>

      <div className="mt-6 bg-blue-50 p-3 rounded border border-blue-100 text-sm">
        <h4 className="font-bold mb-1">Molecular Kinetic Theory</h4>
        <ul className="list-disc pl-5 text-xs">
          <li>Gases consist of particles in constant random motion</li>
          <li>Particles have negligible volume compared to their container</li>
          <li>Collisions between particles are perfectly elastic</li>
          <li>Temperature is proportional to the average kinetic energy of particles</li>
          <li>Pressure results from collisions with container walls</li>
        </ul>
      </div>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const GasLawsControls = dynamic(() => Promise.resolve(GasLawsControlsContent), {
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

export default GasLawsControls; 