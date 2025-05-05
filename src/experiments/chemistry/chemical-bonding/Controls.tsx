'use client';

import React from 'react';
import Slider from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';

interface ControlsProps {
  bondType: 'ionic' | 'covalent' | 'metallic' | 'hydrogen';
  moleculeType: 'simple' | 'complex';
  electronegativityDiff: number;
  showElectronCloud: boolean;
  showDipoles: boolean;
  showLabels: boolean;
  rotationSpeed: number;
  isPaused: boolean;
  setBondType: (value: 'ionic' | 'covalent' | 'metallic' | 'hydrogen') => void;
  setMoleculeType: (value: 'simple' | 'complex') => void;
  setElectronegativityDiff: (value: number) => void;
  setShowElectronCloud: (value: boolean) => void;
  setShowDipoles: (value: boolean) => void;
  setShowLabels: (value: boolean) => void;
  setRotationSpeed: (value: number) => void;
  setIsPaused: (value: boolean) => void;
  resetSimulation: () => void;
}

export default function BondingControls({
  bondType,
  moleculeType,
  electronegativityDiff,
  showElectronCloud,
  showDipoles,
  showLabels,
  rotationSpeed,
  isPaused,
  setBondType,
  setMoleculeType,
  setElectronegativityDiff,
  setShowElectronCloud,
  setShowDipoles,
  setShowLabels,
  setRotationSpeed,
  setIsPaused,
  resetSimulation
}: ControlsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h2 className="text-xl font-bold mb-4">Simulation Controls</h2>
      
      <div className="space-y-6">
        {/* Bond Type */}
        <div>
          <h3 className="text-sm font-medium mb-2">Bond Type</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`py-2 px-3 rounded-md ${
                bondType === 'ionic'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setBondType('ionic')}
            >
              Ionic
            </button>
            <button
              className={`py-2 px-3 rounded-md ${
                bondType === 'covalent'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setBondType('covalent')}
            >
              Covalent
            </button>
            <button
              className={`py-2 px-3 rounded-md ${
                bondType === 'metallic'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setBondType('metallic')}
            >
              Metallic
            </button>
            <button
              className={`py-2 px-3 rounded-md ${
                bondType === 'hydrogen'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setBondType('hydrogen')}
            >
              Hydrogen
            </button>
          </div>
        </div>
        
        {/* Molecule Type */}
        <div>
          <h3 className="text-sm font-medium mb-2">Molecule Type</h3>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 px-3 rounded-md ${
                moleculeType === 'simple'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setMoleculeType('simple')}
            >
              Simple
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-md ${
                moleculeType === 'complex'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setMoleculeType('complex')}
            >
              Complex
            </button>
          </div>
        </div>
        
        {/* Electronegativity Difference */}
        {bondType === 'covalent' && (
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium">Electronegativity Difference</label>
              <span className="text-sm">{electronegativityDiff.toFixed(1)}</span>
            </div>
            <Slider
              value={electronegativityDiff}
              min={0}
              max={3}
              step={0.1}
              onChange={setElectronegativityDiff}
            />
            <p className="text-xs text-gray-500 mt-1">
              Affects bond polarity (0 = nonpolar, &gt;1.7 = ionic character)
            </p>
          </div>
        )}
        
        {/* Rotation Speed */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium">Rotation Speed</label>
            <span className="text-sm">{rotationSpeed.toFixed(1)}x</span>
          </div>
          <Slider
            value={rotationSpeed}
            min={0}
            max={3}
            step={0.1}
            onChange={setRotationSpeed}
          />
        </div>
        
        {/* Display Options */}
        <div>
          <h3 className="text-sm font-medium mb-2">Display Options</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">Show Electron Cloud</label>
              <Switch
                checked={showElectronCloud}
                onCheckedChange={setShowElectronCloud}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Show Dipoles</label>
              <Switch
                checked={showDipoles}
                onCheckedChange={setShowDipoles}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Show Labels</label>
              <Switch
                checked={showLabels}
                onCheckedChange={setShowLabels}
              />
            </div>
          </div>
        </div>
        
        {/* Playback Controls */}
        <div className="pt-2 border-t">
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 px-3 rounded-md ${
                isPaused ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? 'Play' : 'Pause'}
            </button>
            <button
              className="flex-1 py-2 px-3 rounded-md bg-gray-100 hover:bg-gray-200"
              onClick={resetSimulation}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 