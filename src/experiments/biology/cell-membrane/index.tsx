'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const CellMembraneSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const CellMembraneControls = dynamic(() => import('./Controls'), { ssr: false });

export default function CellMembraneExperiment() {
  const [membranePermeability, setMembranePermeability] = useState(3);
  const [initialConcentrationLeft, setInitialConcentrationLeft] = useState(10);
  const [initialConcentrationRight, setInitialConcentrationRight] = useState(2);
  const [osmolarityDifference, setOsmolarityDifference] = useState(0);
  const [channelType, setChannelType] = useState<'water' | 'solute' | 'both'>('both');
  const [isPaused, setIsPaused] = useState(false);
  
  // Force simulation reset when parameters change
  const [resetCounter, setResetCounter] = useState(0);
  
  const resetSimulation = useCallback(() => {
    setResetCounter(prev => prev + 1);
  }, []);

  return (
    <ExperimentLayout 
      title="Cell Membrane Transport"
      category="biology"
      description="Simulate diffusion and osmosis across cell membranes"
      formula="J = -D(dC/dx)"
      formulaExplanation="Fick's Law: The diffusion rate is proportional to the concentration gradient"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <CellMembraneSimulation
            key={resetCounter} // Force component re-mount on reset
            membranePermeability={membranePermeability}
            initialConcentrationLeft={initialConcentrationLeft}
            initialConcentrationRight={initialConcentrationRight}
            osmolarityDifference={osmolarityDifference}
            channelType={channelType}
            isPaused={isPaused}
          />
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Cell Membrane Transport</h3>
            <p className="text-sm">
              Cell membranes are selectively permeable barriers that regulate the movement of substances 
              between the inside and outside of cells. This simulation demonstrates two key transport processes:
            </p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-medium mb-1">Diffusion</h4>
                <p className="text-xs">
                  The movement of molecules from an area of high concentration to an area of low concentration.
                  This passive process requires no energy and continues until equilibrium is reached, where the 
                  concentrations on both sides are equal.
                </p>
              </div>
              
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium mb-1">Osmosis</h4>
                <p className="text-xs">
                  A special type of diffusion involving the movement of water molecules across a selectively 
                  permeable membrane. Water moves from an area of low solute concentration to an area of high 
                  solute concentration to equalize the concentrations on both sides.
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded">
              <h4 className="font-medium mb-1">Key Terms</h4>
              <ul className="list-disc pl-5 text-xs">
                <li><strong>Concentration gradient:</strong> The difference in concentration of a substance across a space</li>
                <li><strong>Passive transport:</strong> Movement of substances that doesn't require energy</li>
                <li><strong>Selective permeability:</strong> The membrane's ability to allow certain substances to pass while blocking others</li>
                <li><strong>Facilitated diffusion:</strong> Passive transport using transport proteins to help molecules cross the membrane</li>
                <li><strong>Channel proteins:</strong> Membrane proteins that create pores for specific molecules to pass through</li>
              </ul>
            </div>
            
            <div className="mt-4 text-xs">
              <p>
                In this simulation, you can adjust the permeability of the membrane, initial concentrations 
                on both sides, and the type of channels present. This allows you to observe how substances 
                move across cell membranes under different conditions.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:w-96">
          <CellMembraneControls
            membranePermeability={membranePermeability}
            initialConcentrationLeft={initialConcentrationLeft}
            initialConcentrationRight={initialConcentrationRight}
            osmolarityDifference={osmolarityDifference}
            channelType={channelType}
            isPaused={isPaused}
            setMembranePermeability={setMembranePermeability}
            setInitialConcentrationLeft={setInitialConcentrationLeft}
            setInitialConcentrationRight={setInitialConcentrationRight}
            setOsmolarityDifference={setOsmolarityDifference}
            setChannelType={setChannelType}
            setIsPaused={setIsPaused}
            resetSimulation={resetSimulation}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 