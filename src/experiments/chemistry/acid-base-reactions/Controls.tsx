'use client';

import React from 'react';
import Slider from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';

interface ControlsProps {
  acidType: 'strong' | 'weak';
  baseType: 'strong' | 'weak';
  acidConcentration: number;
  baseConcentration: number;
  acidVolume: number;
  baseVolume: number;
  showPHCurve: boolean;
  showMolecularView: boolean;
  showIndicator: boolean;
  setAcidType: (value: 'strong' | 'weak') => void;
  setBaseType: (value: 'strong' | 'weak') => void;
  setAcidConcentration: (value: number) => void;
  setBaseConcentration: (value: number) => void;
  setAcidVolume: (value: number) => void;
  setBaseVolume: (value: number) => void;
  setShowPHCurve: (value: boolean) => void;
  setShowMolecularView: (value: boolean) => void;
  setShowIndicator: (value: boolean) => void;
  resetSimulation: () => void;
}

export default function AcidBaseControls({
  acidType,
  baseType,
  acidConcentration,
  baseConcentration,
  acidVolume,
  baseVolume,
  showPHCurve,
  showMolecularView,
  showIndicator,
  setAcidType,
  setBaseType,
  setAcidConcentration,
  setBaseConcentration,
  setAcidVolume,
  setAcidVolume: _setAcidVolume, // Unused but kept for consistency
  setBaseVolume,
  setShowPHCurve,
  setShowMolecularView,
  setShowIndicator,
  resetSimulation
}: ControlsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h2 className="text-xl font-bold mb-4">Simulation Controls</h2>
      
      <div className="space-y-6">
        {/* Acid Type */}
        <div>
          <h3 className="text-sm font-medium mb-2">Acid Type</h3>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 px-3 rounded-md ${
                acidType === 'strong'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setAcidType('strong')}
            >
              Strong
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-md ${
                acidType === 'weak'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setAcidType('weak')}
            >
              Weak
            </button>
          </div>
        </div>
        
        {/* Base Type */}
        <div>
          <h3 className="text-sm font-medium mb-2">Base Type</h3>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 px-3 rounded-md ${
                baseType === 'strong'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setBaseType('strong')}
            >
              Strong
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-md ${
                baseType === 'weak'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setBaseType('weak')}
            >
              Weak
            </button>
          </div>
        </div>
        
        {/* Acid Concentration */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium">Acid Concentration</label>
            <span className="text-sm">{acidConcentration.toFixed(2)} M</span>
          </div>
          <Slider
            value={acidConcentration}
            min={0.01}
            max={1}
            step={0.01}
            onChange={setAcidConcentration}
          />
        </div>
        
        {/* Base Concentration */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium">Base Concentration</label>
            <span className="text-sm">{baseConcentration.toFixed(2)} M</span>
          </div>
          <Slider
            value={baseConcentration}
            min={0.01}
            max={1}
            step={0.01}
            onChange={setBaseConcentration}
          />
        </div>
        
        {/* Base Volume (Titration) */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium">Base Volume (Titration)</label>
            <span className="text-sm">{baseVolume.toFixed(1)} mL</span>
          </div>
          <Slider
            value={baseVolume}
            min={0}
            max={100}
            step={0.5}
            onChange={setBaseVolume}
          />
        </div>
        
        {/* Display Options */}
        <div>
          <h3 className="text-sm font-medium mb-2">Display Options</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">Show pH Curve</label>
              <Switch
                checked={showPHCurve}
                onCheckedChange={setShowPHCurve}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Show Molecular View</label>
              <Switch
                checked={showMolecularView}
                onCheckedChange={setShowMolecularView}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Show Indicator</label>
              <Switch
                checked={showIndicator}
                onCheckedChange={setShowIndicator}
              />
            </div>
          </div>
        </div>
        
        {/* Reset Button */}
        <div className="pt-2 border-t">
          <button
            className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={resetSimulation}
          >
            Reset Simulation
          </button>
        </div>
      </div>
    </div>
  );
} 