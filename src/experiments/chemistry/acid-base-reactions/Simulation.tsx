'use client';

import React from 'react';

interface AcidBaseSimulationProps {
  acidType: 'strong' | 'weak';
  baseType: 'strong' | 'weak';
  acidConcentration: number;
  baseConcentration: number;
  acidVolume: number;
  baseVolume: number;
  showPHCurve: boolean;
  showMolecularView: boolean;
  showIndicator: boolean;
}

export default function AcidBaseSimulation({
  acidType,
  baseType,
  acidConcentration,
  baseConcentration,
  acidVolume,
  baseVolume,
  showPHCurve,
  showMolecularView,
  showIndicator
}: AcidBaseSimulationProps) {
  // Calculate pH based on current volumes and concentrations
  const calculatePH = () => {
    // Basic placeholder calculation - will be more complex in real implementation
    const totalAcidMoles = acidConcentration * (acidVolume / 1000); // convert mL to L
    const totalBaseMoles = baseConcentration * (baseVolume / 1000);
    
    // Net acid or base (positive for excess acid, negative for excess base)
    const netAcid = totalAcidMoles - totalBaseMoles;
    
    if (netAcid > 0) {
      // Acidic solution
      if (acidType === 'strong') {
        return -Math.log10(netAcid / ((acidVolume + baseVolume) / 1000));
      } else {
        // Weak acid - approximate
        return 3.5;
      }
    } else if (netAcid < 0) {
      // Basic solution
      if (baseType === 'strong') {
        return 14 + Math.log10((-netAcid) / ((acidVolume + baseVolume) / 1000));
      } else {
        // Weak base - approximate
        return 10.5;
      }
    } else {
      // Neutral at equivalence point
      return 7;
    }
  };

  // Current pH
  const pH = calculatePH();
  
  // Determine color based on pH
  const getColor = () => {
    if (pH < 3) return 'rgb(255, 0, 0)'; // Red
    if (pH < 5) return 'rgb(255, 150, 0)'; // Orange
    if (pH < 6) return 'rgb(255, 200, 0)'; // Yellow-orange
    if (pH < 7) return 'rgb(200, 255, 0)'; // Yellow-green
    if (pH === 7) return 'rgb(0, 255, 0)'; // Green
    if (pH < 9) return 'rgb(0, 200, 255)'; // Blue-green
    if (pH < 11) return 'rgb(0, 100, 255)'; // Blue
    return 'rgb(150, 0, 255)'; // Purple
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Acid-Base Reaction Simulation</h2>
        <div className="bg-blue-100 px-3 py-1 rounded">
          pH = {pH.toFixed(2)}
        </div>
      </div>
      
      <div className="mb-6 flex items-center justify-center">
        <div 
          className="w-64 h-64 rounded-full flex items-center justify-center border"
          style={{ backgroundColor: getColor() }}
        >
          <div className="bg-white bg-opacity-80 px-3 py-1 rounded">
            {showIndicator && (
              <div>
                <div className="text-center mb-2">
                  {pH < 3 && "Strong Acid"}
                  {pH >= 3 && pH < 7 && "Weak Acid"}
                  {pH === 7 && "Neutral"}
                  {pH > 7 && pH <= 11 && "Weak Base"}
                  {pH > 11 && "Strong Base"}
                </div>
                <div className="font-bold text-xl">pH {pH.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showPHCurve && (
        <div className="mb-6 p-4 bg-gray-100 rounded text-center">
          pH Curve Visualization would appear here
        </div>
      )}
      
      {showMolecularView && (
        <div className="p-4 bg-gray-100 rounded text-center">
          Molecular View would appear here
        </div>
      )}
      
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-2 border rounded bg-gray-50">
          <div className="text-xs text-gray-500">Acid Volume</div>
          <div className="font-medium">{acidVolume.toFixed(1)} mL</div>
        </div>
        <div className="p-2 border rounded bg-gray-50">
          <div className="text-xs text-gray-500">Base Volume</div>
          <div className="font-medium">{baseVolume.toFixed(1)} mL</div>
        </div>
      </div>
    </div>
  );
} 