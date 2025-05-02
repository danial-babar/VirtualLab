'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  membranePermeability: number;
  initialConcentrationLeft: number;
  initialConcentrationRight: number;
  osmolarityDifference: number;
  channelType: 'water' | 'solute' | 'both';
  isPaused: boolean;
  setMembranePermeability: (value: number) => void;
  setInitialConcentrationLeft: (value: number) => void;
  setInitialConcentrationRight: (value: number) => void;
  setOsmolarityDifference: (value: number) => void;
  setChannelType: (value: 'water' | 'solute' | 'both') => void;
  setIsPaused: (value: boolean) => void;
  resetSimulation: () => void;
}

function CellMembraneControlsContent({
  membranePermeability,
  initialConcentrationLeft,
  initialConcentrationRight,
  osmolarityDifference,
  channelType,
  isPaused,
  setMembranePermeability,
  setInitialConcentrationLeft,
  setInitialConcentrationRight,
  setOsmolarityDifference,
  setChannelType,
  setIsPaused,
  resetSimulation
}: Props) {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Cell Membrane Transport Controls</h3>
      
      <div className="mb-4">
        <label className="block mb-2">
          Membrane Permeability: {membranePermeability.toFixed(1)}
        </label>
        <div className="flex items-center">
          <span className="mr-2">Low</span>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={membranePermeability}
            onChange={(e) => setMembranePermeability(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">High</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Controls the number of channels in the membrane
        </div>
      </div>
      
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Channel Type</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'water', name: 'Water Only', color: 'bg-blue-100' },
            { id: 'solute', name: 'Solute Only', color: 'bg-red-100' },
            { id: 'both', name: 'Both', color: 'bg-green-100' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setChannelType(type.id as any)}
              className={`py-2 px-3 text-sm rounded transition-colors ${
                channelType === type.id
                  ? `${type.color} border-2 border-blue-500`
                  : `${type.color} border border-gray-300 hover:border-blue-300`
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Left Side Initial Concentration: {initialConcentrationLeft.toFixed(1)}
        </label>
        <div className="flex items-center">
          <span className="mr-2">0</span>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={initialConcentrationLeft}
            onChange={(e) => setInitialConcentrationLeft(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">20</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Right Side Initial Concentration: {initialConcentrationRight.toFixed(1)}
        </label>
        <div className="flex items-center">
          <span className="mr-2">0</span>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={initialConcentrationRight}
            onChange={(e) => setInitialConcentrationRight(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">20</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Osmolarity Difference: {osmolarityDifference.toFixed(1)}
        </label>
        <div className="flex items-center">
          <span className="mr-2 text-xs">More water left</span>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={osmolarityDifference}
            onChange={(e) => setOsmolarityDifference(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2 text-xs">More water right</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Controls the relative amount of water on each side
        </div>
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
        {showInfo ? '▼ Hide' : '► Show'} transport information
      </button>
      
      {showInfo && (
        <div className="border-t pt-4">
          <h4 className="font-bold mb-2">About Cell Membrane Transport</h4>
          
          <div className="mb-3">
            <h5 className="font-medium">Diffusion</h5>
            <p className="text-sm">
              Passive movement of molecules from an area of high concentration to low concentration.
              No energy is required as particles move along the concentration gradient.
            </p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Osmosis</h5>
            <p className="text-sm">
              Special case of diffusion where water molecules move across a semipermeable membrane
              from an area of low solute concentration to high solute concentration.
            </p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Facilitated Diffusion</h5>
            <p className="text-sm">
              Passive transport that uses membrane proteins (channels or carriers) to help 
              molecules cross the membrane. Still moves from high to low concentration.
            </p>
          </div>
          
          <div className="text-xs mt-4">
            <p className="italic">
              In this simulation, you can observe how molecules move through the cell membrane,
              how channel type affects transport, and how concentration gradients drive diffusion.
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
                setChannelType('both');
                setInitialConcentrationLeft(20);
                setInitialConcentrationRight(0);
                setOsmolarityDifference(0);
                setMembranePermeability(3);
                resetSimulation();
              }}
            >
              Simple Diffusion
            </button>: Set high concentration on left, no concentration on right
          </li>
          <li>
            <button 
              className="text-blue-500 hover:underline"
              onClick={() => {
                setChannelType('water');
                setInitialConcentrationLeft(20);
                setInitialConcentrationRight(2);
                setOsmolarityDifference(0);
                setMembranePermeability(3);
                resetSimulation();
              }}
            >
              Osmosis
            </button>: Set water-only channels, with concentration difference
          </li>
          <li>
            <button 
              className="text-blue-500 hover:underline"
              onClick={() => {
                setChannelType('solute');
                setInitialConcentrationLeft(15);
                setInitialConcentrationRight(5);
                setOsmolarityDifference(5);
                setMembranePermeability(2);
                resetSimulation();
              }}
            >
              Facilitated Diffusion
            </button>: Create solute-only channels with concentration gradient
          </li>
        </ul>
      </div>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const CellMembraneControls = dynamic(() => Promise.resolve(CellMembraneControlsContent), {
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

export default CellMembraneControls; 