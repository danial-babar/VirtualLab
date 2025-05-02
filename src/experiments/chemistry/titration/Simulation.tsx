'use client';

import { useEffect, useState } from 'react';

interface Props {
  acidConcentration: number;
  baseConcentration: number;
  acidVolume: number;
  titrantVolume: number;
}

export default function TitrationSimulation({
  acidConcentration,
  baseConcentration,
  acidVolume,
  titrantVolume,
}: Props) {
  const [pHValue, setPHValue] = useState(0);
  const [pHHistory, setPHHistory] = useState<{volume: number, pH: number}[]>([]);
  const [equivalencePoint, setEquivalencePoint] = useState(0);
  
  // Calculate pH and update history
  useEffect(() => {
    // Calculate the moles of acid and base
    const molesAcid = acidConcentration * acidVolume / 1000; // Convert mL to L
    const molesBase = baseConcentration * titrantVolume / 1000;
    
    // Calculate the equivalence point
    const eqPoint = (molesAcid * 1000) / baseConcentration; // Convert back to mL
    setEquivalencePoint(eqPoint);
    
    // Calculate the pH (simplified model)
    let pH:number;
    if (titrantVolume < eqPoint) {
      // Before equivalence point (acidic)
      const unNeutralizedAcid = molesAcid - molesBase;
      pH = Math.max(0, -Math.log10(unNeutralizedAcid / (acidVolume / 1000)));
    } else if (Math.abs(titrantVolume - eqPoint) < 0.1) {
      // At equivalence point (neutral for strong acid-strong base)
      pH = 7;
    } else {
      // After equivalence point (basic)
      const excessBase = molesBase - molesAcid;
      const totalVolume = (acidVolume + titrantVolume) / 1000; // Total volume in L
      pH = Math.min(14, 14 + Math.log10(excessBase / totalVolume));
    }
    
    // Handle edge cases
    if (isNaN(pH) || !isFinite(pH)) {
      pH = 7;
    }
    
    setPHValue(pH);
    
    // Update history for plotting
    const existingPoint = pHHistory.find(p => p.volume === titrantVolume);
    if (!existingPoint) {
      setPHHistory(prev => {
        const newHistory = [...prev, { volume: titrantVolume, pH }];
        return newHistory.sort((a, b) => a.volume - b.volume);
      });
    }
  }, [acidConcentration, baseConcentration, acidVolume, titrantVolume, pHHistory]);
  
  // Get the pH color based on the value
  const getPHColor = (pH: number) => {
    if (pH < 3) return 'bg-red-500';
    if (pH < 6) return 'bg-orange-400';
    if (pH < 8) return 'bg-green-500';
    if (pH < 11) return 'bg-blue-400';
    return 'bg-purple-500';
  };
  
  return (
    <div className="w-full">
      {/* Titration Flask Visualization */}
      <div className="relative w-full h-64 border-2 border-gray-300 rounded-lg bg-white mb-4">
        {/* Flask */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-44">
          <div className="w-full h-full relative">
            {/* Flask neck */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-12 bg-gray-100 border border-gray-300"></div>
            
            {/* Flask body */}
            <div className="absolute bottom-0 w-full h-32 bg-gray-100 border border-gray-300 rounded-b-full overflow-hidden">
              {/* Solution */}
              <div 
                className={`absolute bottom-0 w-full transition-all duration-300 ${getPHColor(pHValue)}`} 
                style={{ height: `${Math.min(100, (acidVolume + titrantVolume) / 2)}%`, opacity: 0.5 }}
              ></div>
            </div>
            
            {/* Burette tip */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-gray-400"></div>
            
            {/* pH value */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-sm font-bold">
              pH: {pHValue.toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* Burette */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-16 bg-gray-200 border border-gray-300 overflow-hidden">
          <div 
            className="absolute top-0 w-full bg-blue-200 transition-all"
            style={{ height: `${(100 - titrantVolume)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Titration Curve */}
      <div className="w-full h-48 border border-gray-300 bg-white p-2 rounded">
        <div className="w-full h-full relative">
          {/* Y-axis (pH) */}
          <div className="absolute left-0 top-0 bottom-0 w-10 border-r border-gray-200 flex flex-col justify-between items-center text-xs py-1">
            <span>14</span>
            <span>7</span>
            <span>0</span>
          </div>
          
          {/* X-axis (Volume) */}
          <div className="absolute left-10 right-0 bottom-0 h-6 border-t border-gray-200 flex justify-between items-center text-xs px-1">
            <span>0</span>
            <span>{Math.ceil(equivalencePoint * 2)}mL</span>
          </div>
          
          {/* Plot area */}
          <div className="absolute left-10 top-0 right-0 bottom-6 bg-gray-50">
            {/* Equivalence point line */}
            <div 
              className="absolute top-0 bottom-0 border-l border-red-300 border-dashed"
              style={{ left: `${(equivalencePoint / (equivalencePoint * 2)) * 100}%` }}
            ></div>
            
            {/* pH curve */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={pHHistory.map(point => `${(point.volume / (equivalencePoint * 2)) * 100},${100 - (point.pH / 14) * 100}`).join(' ')}
                stroke="blue"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 