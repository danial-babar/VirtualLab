'use client';

import React, { Dispatch, SetStateAction } from 'react';

interface ControlsProps {
  amplitude1: number;
  frequency1: number;
  phaseShift: number;
  amplitude2: number;
  frequency2: number;
  showComponents: boolean;
  isPaused: boolean;
  setAmplitude1: Dispatch<SetStateAction<number>>;
  setFrequency1: Dispatch<SetStateAction<number>>;
  setPhase2: Dispatch<SetStateAction<number>>;
  setAmplitude2: Dispatch<SetStateAction<number>>;
  setFrequency2: Dispatch<SetStateAction<number>>;
  setShowComponents: Dispatch<SetStateAction<boolean>>;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  resetSimulation: () => void;
}

export default function WaveControls({
  amplitude1,
  frequency1,
  phaseShift,
  amplitude2,
  frequency2,
  showComponents,
  isPaused,
  setAmplitude1,
  setFrequency1,
  setPhase2,
  setAmplitude2,
  setFrequency2,
  setShowComponents,
  setIsPaused,
  resetSimulation
}: ControlsProps) {
  
  // Preset scenarios
  const presets = [
    {
      name: "Perfect Constructive",
      description: "Equal waves in phase (0°)",
      apply: () => {
        setAmplitude1(50);
        setAmplitude2(50);
        setFrequency1(3);
        setFrequency2(3);
        setPhase2(0);
      }
    },
    {
      name: "Perfect Destructive",
      description: "Equal waves out of phase (180°)",
      apply: () => {
        setAmplitude1(50);
        setAmplitude2(50);
        setFrequency1(3);
        setFrequency2(3);
        setPhase2(180);
      }
    },
    {
      name: "Partial Interference",
      description: "Equal waves with 90° phase difference",
      apply: () => {
        setAmplitude1(50);
        setAmplitude2(50);
        setFrequency1(3);
        setFrequency2(3);
        setPhase2(90);
      }
    },
    {
      name: "Beat Pattern",
      description: "Waves with slightly different frequencies",
      apply: () => {
        setAmplitude1(50);
        setAmplitude2(50);
        setFrequency1(3);
        setFrequency2(3.5);
        setPhase2(0);
      }
    },
    {
      name: "Amplitude Difference",
      description: "Waves with different amplitudes",
      apply: () => {
        setAmplitude1(80);
        setAmplitude2(40);
        setFrequency1(3);
        setFrequency2(3);
        setPhase2(0);
      }
    }
  ];
  
  // Reset to default values
  const resetToDefault = () => {
    setAmplitude1(50);
    setAmplitude2(50);
    setFrequency1(3);
    setFrequency2(3);
    setPhase2(0);
    setShowComponents(true);
    setIsPaused(false);
    resetSimulation();
  };
  
  return (
    <div className="bg-white rounded-lg shadow space-y-4 p-4">
      <h3 className="text-lg font-semibold">Wave Interference Controls</h3>
      
      {/* Presets */}
      <div>
        <h4 className="font-medium mb-2">Preset Scenarios</h4>
        <div className="grid grid-cols-1 gap-2">
          {presets.map((preset, index) => (
            <button
              key={index}
              className="p-2 border rounded hover:bg-gray-100 text-left"
              onClick={preset.apply}
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-sm text-gray-600">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Wave 1 Controls */}
      <div>
        <h4 className="font-medium text-blue-700 mb-2">Wave 1 (Blue)</h4>
        <div className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">
              Amplitude: {amplitude1}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={amplitude1}
              onChange={(e) => setAmplitude1(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm">
              Frequency: {frequency1} Hz
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={frequency1}
              onChange={(e) => setFrequency1(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Wave 2 Controls */}
      <div>
        <h4 className="font-medium text-green-700 mb-2">Wave 2 (Green)</h4>
        <div className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">
              Amplitude: {amplitude2}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={amplitude2}
              onChange={(e) => setAmplitude2(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm">
              Frequency: {frequency2} Hz
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={frequency2}
              onChange={(e) => setFrequency2(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm">
              Phase Shift: {phaseShift}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={phaseShift}
              onChange={(e) => setPhase2(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Display Options */}
      <div>
        <h4 className="font-medium mb-2">Display Options</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showComponents"
              checked={showComponents}
              onChange={(e) => setShowComponents(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showComponents">
              Show individual waves
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPaused"
              checked={isPaused}
              onChange={(e) => setIsPaused(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isPaused">
              Pause animation
            </label>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={resetToDefault}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Reset to Default
        </button>
        
        <button
          onClick={resetSimulation}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Restart Animation
        </button>
      </div>
      
      {/* Educational Content */}
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <h4 className="font-medium mb-1">Key Concepts</h4>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li><strong>Superposition Principle:</strong> When waves overlap, their displacements add together</li>
          <li><strong>Constructive Interference:</strong> Waves in phase amplify each other</li>
          <li><strong>Destructive Interference:</strong> Waves out of phase cancel each other</li>
          <li><strong>Beats:</strong> When waves with slightly different frequencies interfere</li>
        </ul>
      </div>
    </div>
  );
} 