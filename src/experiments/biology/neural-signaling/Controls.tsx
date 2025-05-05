'use client';

import React from 'react';

interface NeuralSignalingControlsProps {
  membraneVoltage: number;
  threshold: number;
  stimulationFrequency: number;
  neurotransmitterAmount: number;
  showLabels: boolean;
  isPaused: boolean;
  setMembraneVoltage: React.Dispatch<React.SetStateAction<number>>;
  setThreshold: React.Dispatch<React.SetStateAction<number>>;
  setStimulationFrequency: React.Dispatch<React.SetStateAction<number>>;
  setNeurotransmitterAmount: React.Dispatch<React.SetStateAction<number>>;
  setShowLabels: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  triggerStimulation: () => void;
  resetSimulation: () => void;
}

export default function NeuralSignalingControls({
  membraneVoltage,
  threshold,
  stimulationFrequency,
  neurotransmitterAmount,
  showLabels,
  isPaused,
  setMembraneVoltage,
  setThreshold,
  setStimulationFrequency,
  setNeurotransmitterAmount,
  setShowLabels,
  setIsPaused,
  triggerStimulation,
  resetSimulation
}: NeuralSignalingControlsProps) {
  
  // Reset to default values
  const resetToDefault = () => {
    setMembraneVoltage(-70);
    setThreshold(-55);
    setStimulationFrequency(1);
    setNeurotransmitterAmount(5);
    setShowLabels(true);
    setIsPaused(false);
    resetSimulation();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Neural Signaling Controls</h3>
      
      {/* Neuron Properties */}
      <div>
        <h4 className="font-medium mb-3 text-blue-700">Neuron Properties</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">
              Resting Membrane Potential: {membraneVoltage} mV
            </label>
            <input
              type="range"
              min="-90"
              max="-50"
              step="1"
              value={membraneVoltage}
              onChange={(e) => setMembraneVoltage(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm">
              Threshold Potential: {threshold} mV
            </label>
            <input
              type="range"
              min="-60"
              max="-40"
              step="1"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500">
              Membrane voltage must exceed this threshold to trigger an action potential
            </div>
          </div>
        </div>
      </div>
      
      {/* Stimulation Controls */}
      <div>
        <h4 className="font-medium mb-3 text-green-700">Stimulation</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">
              Stimulation Frequency: {stimulationFrequency} Hz
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={stimulationFrequency}
              onChange={(e) => setStimulationFrequency(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500">
              Controls how frequently the neuron receives stimulation
            </div>
          </div>
          
          <button
            onClick={triggerStimulation}
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Trigger Manual Stimulation
          </button>
        </div>
      </div>
      
      {/* Synaptic Transmission */}
      <div>
        <h4 className="font-medium mb-3 text-purple-700">Synaptic Transmission</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">
              Neurotransmitter Amount: {neurotransmitterAmount} units
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={neurotransmitterAmount}
              onChange={(e) => setNeurotransmitterAmount(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Simulation Controls */}
      <div>
        <h4 className="font-medium mb-3">Simulation Controls</h4>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showLabels"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showLabels">
              Show Labels and Annotations
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
              Pause Simulation
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={resetToDefault}
              className="py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Reset All Parameters
            </button>
            
            <button
              onClick={resetSimulation}
              className="py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Restart Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 