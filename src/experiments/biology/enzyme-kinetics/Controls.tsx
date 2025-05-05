'use client';

import React from 'react';

interface EnzymeControlsProps {
  substrateConcentration: number;
  enzymeConcentration: number;
  temperature: number;
  pH: number;
  inhibitorPresent: boolean;
  inhibitorType: 'competitive' | 'noncompetitive' | 'uncompetitive' | 'none';
  speed: number;
  isPaused: boolean;
  setSubstrateConcentration: React.Dispatch<React.SetStateAction<number>>;
  setEnzymeConcentration: React.Dispatch<React.SetStateAction<number>>;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
  setpH: React.Dispatch<React.SetStateAction<number>>;
  setInhibitorPresent: React.Dispatch<React.SetStateAction<boolean>>;
  setInhibitorType: React.Dispatch<React.SetStateAction<'competitive' | 'noncompetitive' | 'uncompetitive' | 'none'>>;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  resetSimulation: () => void;
}

export default function EnzymeControls({
  substrateConcentration,
  enzymeConcentration,
  temperature,
  pH,
  inhibitorPresent,
  inhibitorType,
  speed,
  isPaused,
  setSubstrateConcentration,
  setEnzymeConcentration,
  setTemperature,
  setpH,
  setInhibitorPresent,
  setInhibitorType,
  setSpeed,
  setIsPaused,
  resetSimulation
}: EnzymeControlsProps) {
  
  // Reset to default values
  const resetToDefault = () => {
    setSubstrateConcentration(5);
    setEnzymeConcentration(3);
    setTemperature(37);
    setpH(7);
    setInhibitorPresent(false);
    setInhibitorType('none');
    setSpeed(1);
    setIsPaused(false);
    resetSimulation();
  };
  
  // Preset experiments
  const presets = [
    {
      name: "Optimal Conditions",
      description: "Normal physiological conditions",
      apply: () => {
        setSubstrateConcentration(5);
        setEnzymeConcentration(3);
        setTemperature(37);
        setpH(7);
        setInhibitorPresent(false);
        setInhibitorType('none');
        resetSimulation();
      }
    },
    {
      name: "Temperature Effect",
      description: "High temperature causes enzyme denaturation",
      apply: () => {
        setSubstrateConcentration(5);
        setEnzymeConcentration(3);
        setTemperature(55);
        setpH(7);
        setInhibitorPresent(false);
        setInhibitorType('none');
        resetSimulation();
      }
    },
    {
      name: "pH Effect",
      description: "Extreme pH affects enzyme structure",
      apply: () => {
        setSubstrateConcentration(5);
        setEnzymeConcentration(3);
        setTemperature(37);
        setpH(2);
        setInhibitorPresent(false);
        setInhibitorType('none');
        resetSimulation();
      }
    },
    {
      name: "Competitive Inhibition",
      description: "Inhibitor competes with substrate for active site",
      apply: () => {
        setSubstrateConcentration(5);
        setEnzymeConcentration(3);
        setTemperature(37);
        setpH(7);
        setInhibitorPresent(true);
        setInhibitorType('competitive');
        resetSimulation();
      }
    },
    {
      name: "Non-competitive Inhibition",
      description: "Inhibitor binds elsewhere changing enzyme shape",
      apply: () => {
        setSubstrateConcentration(5);
        setEnzymeConcentration(3);
        setTemperature(37);
        setpH(7);
        setInhibitorPresent(true);
        setInhibitorType('noncompetitive');
        resetSimulation();
      }
    }
  ];
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Enzyme Kinetics Controls</h3>
      
      {/* Presets */}
      <div>
        <h4 className="font-medium mb-2">Experiment Presets</h4>
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
      
      {/* Concentration Controls */}
      <div>
        <h4 className="font-medium mb-3 text-blue-700">Reaction Components</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">
              Substrate Concentration: {substrateConcentration} mM
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={substrateConcentration}
              onChange={(e) => setSubstrateConcentration(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm">
              Enzyme Concentration: {enzymeConcentration} μM
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={enzymeConcentration}
              onChange={(e) => setEnzymeConcentration(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Environmental Controls */}
      <div>
        <h4 className="font-medium mb-3 text-green-700">Environmental Conditions</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">
              Temperature: {temperature}°C
              {temperature > 45 && (
                <span className="ml-2 text-red-500">⚠️ Denaturing</span>
              )}
            </label>
            <input
              type="range"
              min="10"
              max="70"
              step="1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm">
              pH: {pH}
              {Math.abs(pH - 7) > 3 && (
                <span className="ml-2 text-red-500">⚠️ Suboptimal</span>
              )}
            </label>
            <input
              type="range"
              min="1"
              max="14"
              step="0.5"
              value={pH}
              onChange={(e) => setpH(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Inhibitor Controls */}
      <div>
        <h4 className="font-medium mb-3 text-red-700">Inhibition</h4>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inhibitorPresent"
              checked={inhibitorPresent}
              onChange={(e) => setInhibitorPresent(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="inhibitorPresent">
              Add Inhibitor
            </label>
          </div>
          
          {inhibitorPresent && (
            <div className="ml-5 space-y-2">
              <div>
                <label className="block mb-1 text-sm">Inhibitor Type:</label>
                <select 
                  value={inhibitorType} 
                  onChange={(e) => setInhibitorType(e.target.value as any)}
                  className="w-full p-2 border rounded"
                >
                  <option value="competitive">Competitive</option>
                  <option value="noncompetitive">Non-competitive</option>
                  <option value="uncompetitive">Uncompetitive</option>
                </select>
              </div>
              
              <div className="text-xs bg-gray-100 p-2 rounded">
                {inhibitorType === 'competitive' && (
                  <p>Competitive inhibitors bind to the enzyme's active site, preventing substrate binding.</p>
                )}
                {inhibitorType === 'noncompetitive' && (
                  <p>Non-competitive inhibitors bind to a site other than the active site, changing the enzyme's shape.</p>
                )}
                {inhibitorType === 'uncompetitive' && (
                  <p>Uncompetitive inhibitors bind only to the enzyme-substrate complex, not to the free enzyme.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Simulation Controls */}
      <div>
        <h4 className="font-medium mb-3">Simulation Controls</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">
              Speed: {speed}x
            </label>
            <input
              type="range"
              min="0.25"
              max="3"
              step="0.25"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full"
            />
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
              Pause Simulation
            </label>
          </div>
          
          <button
            onClick={resetToDefault}
            className="mt-2 w-full py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Reset All Parameters
          </button>
          
          <button
            onClick={resetSimulation}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Restart Simulation
          </button>
        </div>
      </div>
    </div>
  );
} 