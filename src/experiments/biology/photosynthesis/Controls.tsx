'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  lightIntensity: number;
  co2Concentration: number;
  temperature: number;
  showLightReactions: boolean;
  showDarkReactions: boolean;
  isPaused: boolean;
  setLightIntensity: (value: number) => void;
  setCo2Concentration: (value: number) => void;
  setTemperature: (value: number) => void;
  setShowLightReactions: (value: boolean) => void;
  setShowDarkReactions: (value: boolean) => void;
  setIsPaused: (value: boolean) => void;
  resetSimulation: () => void;
}

function PhotosynthesisControlsContent({
  lightIntensity,
  co2Concentration,
  temperature,
  showLightReactions,
  showDarkReactions,
  isPaused,
  setLightIntensity,
  setCo2Concentration,
  setTemperature,
  setShowLightReactions,
  setShowDarkReactions,
  setIsPaused,
  resetSimulation
}: Props) {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Photosynthesis Controls</h3>
      
      <div className="mb-4">
        <label className="block mb-2">
          Light Intensity: {lightIntensity}%
        </label>
        <div className="flex items-center">
          <span className="mr-2">0</span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={lightIntensity}
            onChange={(e) => setLightIntensity(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">100</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Controls the rate of light reactions
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          CO₂ Concentration: {co2Concentration}%
        </label>
        <div className="flex items-center">
          <span className="mr-2">0</span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={co2Concentration}
            onChange={(e) => setCo2Concentration(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">100</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Affects the rate of the Calvin cycle (dark reactions)
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Temperature: {temperature}°C
        </label>
        <div className="flex items-center">
          <span className="mr-2">5</span>
          <input
            type="range"
            min="5"
            max="45"
            step="1"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">45</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Affects enzyme activity and overall reaction rates
        </div>
      </div>
      
      <div className="mb-4 flex flex-col space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showLightReactions}
            onChange={(e) => setShowLightReactions(e.target.checked)}
            className="mr-2"
          />
          Show Light Reactions (Thylakoid)
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showDarkReactions}
            onChange={(e) => setShowDarkReactions(e.target.checked)}
            className="mr-2"
          />
          Show Calvin Cycle (Stroma)
        </label>
      </div>
      
      <div className="flex mb-6 space-x-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`flex-1 py-2 px-4 rounded ${
            isPaused 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          }`}
        >
          {isPaused ? 'Start' : 'Pause'}
        </button>
        <button
          onClick={resetSimulation}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>
      
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="text-blue-500 hover:text-blue-700 mb-4 text-sm flex items-center"
      >
        {showInfo ? '▼ Hide' : '► Show'} photosynthesis information
      </button>
      
      {showInfo && (
        <div className="border-t pt-4">
          <h4 className="font-bold mb-2">About Photosynthesis</h4>
          
          <div className="mb-3">
            <h5 className="font-medium">Light Reactions</h5>
            <p className="text-sm">
              Occur in the thylakoid membrane. Water (H₂O) is split using light energy, 
              producing oxygen (O₂) as a byproduct. Energy from light is captured to produce ATP 
              and NADPH, which power the Calvin cycle.
            </p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Calvin Cycle (Dark Reactions)</h5>
            <p className="text-sm">
              Takes place in the stroma of the chloroplast. Carbon dioxide (CO₂) is fixed and 
              combined with the energy from ATP and NADPH to produce glucose (sugar). Unlike 
              light reactions, the Calvin cycle doesn't directly require light.
            </p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Limiting Factors</h5>
            <p className="text-sm">
              The rate of photosynthesis is affected by light intensity, CO₂ concentration, 
              and temperature. If any of these factors are in short supply, they become the 
              limiting factor, constraining the overall rate of photosynthesis.
            </p>
          </div>
          
          <div className="text-xs mt-4">
            <p className="italic">
              The overall equation for photosynthesis is:
              6 CO₂ + 6 H₂O + light energy → C₆H₁₂O₆ (glucose) + 6 O₂
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t">
        <h4 className="font-medium mb-2">Experiment Suggestions</h4>
        <ul className="list-disc pl-5 text-xs space-y-2">
          <li>
            <button 
              className="text-blue-500 hover:underline"
              onClick={() => {
                setLightIntensity(100);
                setCo2Concentration(20);
                setTemperature(25);
                setShowLightReactions(true);
                setShowDarkReactions(true);
                resetSimulation();
              }}
            >
              Optimal Conditions
            </button>: High light, moderate CO₂, optimal temperature (25°C)
          </li>
          <li>
            <button 
              className="text-blue-500 hover:underline"
              onClick={() => {
                setLightIntensity(20);
                setCo2Concentration(80);
                setTemperature(25);
                setShowLightReactions(true);
                setShowDarkReactions(true);
                resetSimulation();
              }}
            >
              Light-Limited
            </button>: Low light intensity, abundant CO₂
          </li>
          <li>
            <button 
              className="text-blue-500 hover:underline"
              onClick={() => {
                setLightIntensity(80);
                setCo2Concentration(10);
                setTemperature(25);
                setShowLightReactions(true);
                setShowDarkReactions(true);
                resetSimulation();
              }}
            >
              CO₂-Limited
            </button>: High light, low CO₂ concentration
          </li>
          <li>
            <button 
              className="text-blue-500 hover:underline"
              onClick={() => {
                setLightIntensity(80);
                setCo2Concentration(80);
                setTemperature(5);
                setShowLightReactions(true);
                setShowDarkReactions(true);
                resetSimulation();
              }}
            >
              Cold Temperature
            </button>: See how low temperature affects reaction rates
          </li>
        </ul>
      </div>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const PhotosynthesisControls = dynamic(() => Promise.resolve(PhotosynthesisControlsContent), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Loading controls...</h3>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

export default PhotosynthesisControls; 