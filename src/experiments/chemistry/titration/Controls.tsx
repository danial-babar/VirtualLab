'use client';

import { useEffect, useState } from 'react';

interface Props {
  acidConcentration: number;
  baseConcentration: number;
  acidVolume: number;
  titrantVolume: number;
  setAcidConcentration: (concentration: number) => void;
  setBaseConcentration: (concentration: number) => void;
  setAcidVolume: (volume: number) => void;
  setTitrantVolume: (volume: number) => void;
}

export default function TitrationControls({
  acidConcentration,
  baseConcentration,
  acidVolume,
  titrantVolume,
  setAcidConcentration,
  setBaseConcentration,
  setAcidVolume,
  setTitrantVolume,
}: Props) {
  const [expectedEquivalencePoint, setExpectedEquivalencePoint] = useState(0);
  const [pHValue, setPHValue] = useState(0);

  // Calculate the expected equivalence point and current pH
  useEffect(() => {
    // Calculate the moles of acid and base
    const molesAcid = acidConcentration * acidVolume / 1000; // Convert mL to L
    const molesBase = baseConcentration * titrantVolume / 1000;
    
    // Calculate the expected equivalence point (volume of base needed)
    const equivalencePoint = (molesAcid * 1000) / baseConcentration; // Convert back to mL
    setExpectedEquivalencePoint(equivalencePoint);
    
    // Calculate the pH (simplified model)
    let pH;
    if (titrantVolume < equivalencePoint) {
      // Before equivalence point (acidic)
      const unNeutralizedAcid = molesAcid - molesBase;
      pH = -Math.log10(unNeutralizedAcid / (acidVolume / 1000));
    } else if (Math.abs(titrantVolume - equivalencePoint) < 0.1) {
      // At equivalence point (neutral for strong acid-strong base)
      pH = 7;
    } else {
      // After equivalence point (basic)
      const excessBase = molesBase - molesAcid;
      const totalVolume = (acidVolume + titrantVolume) / 1000; // Total volume in L
      pH = 14 + Math.log10(excessBase / totalVolume);
    }
    
    // Constrain pH to reasonable values
    pH = Math.max(0, Math.min(14, pH));
    setPHValue(pH);
  }, [acidConcentration, baseConcentration, acidVolume, titrantVolume]);

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Experiment Controls</h3>
      
      <div className="mb-4">
        <label className="block mb-2">
          Acid Concentration (M): {acidConcentration.toFixed(2)}M
        </label>
        <div className="flex items-center">
          <span className="mr-2">0.01M</span>
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={acidConcentration}
            onChange={(e) => setAcidConcentration(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">1.00M</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Base Concentration (M): {baseConcentration.toFixed(2)}M
        </label>
        <div className="flex items-center">
          <span className="mr-2">0.01M</span>
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={baseConcentration}
            onChange={(e) => setBaseConcentration(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">1.00M</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Acid Volume (mL): {acidVolume.toFixed(1)}mL
        </label>
        <div className="flex items-center">
          <span className="mr-2">10mL</span>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={acidVolume}
            onChange={(e) => setAcidVolume(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">100mL</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Titrant Volume (mL): {titrantVolume.toFixed(1)}mL
        </label>
        <div className="flex items-center">
          <span className="mr-2">0mL</span>
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={titrantVolume}
            onChange={(e) => setTitrantVolume(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">100mL</span>
        </div>
      </div>

      <button 
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={() => {
          setAcidConcentration(0.1);
          setBaseConcentration(0.1);
          setAcidVolume(25);
          setTitrantVolume(0);
        }}
      >
        Reset to Default
      </button>

      <div className="mt-6 bg-gray-50 p-3 rounded border">
        <h4 className="font-bold mb-2">Measurements:</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="font-medium">Current pH:</p>
            <p className="text-blue-600">{pHValue.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium">Equivalence Point:</p>
            <p className="text-blue-600">{expectedEquivalencePoint.toFixed(1)} mL</p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-green-50 p-3 rounded border border-green-100 text-sm">
        <h4 className="font-bold mb-1">Acid-Base Titration</h4>
        <p>For a strong acid-strong base titration:</p>
        <div className="font-semibold my-2 text-center">moles(acid) = moles(base) at equivalence</div>
        <p>Or:</p>
        <div className="font-semibold my-2 text-center">M₁V₁ = M₂V₂</div>
        <p className="mt-2 text-xs">
          Where M is molarity (mol/L) and V is volume (L).
        </p>
      </div>
    </div>
  );
} 