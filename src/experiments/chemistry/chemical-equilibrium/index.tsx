'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const EquilibriumSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const EquilibriumControls = dynamic(() => import('./Controls'), { ssr: false });

export default function ChemicalEquilibriumExperiment() {
  const [temperature, setTemperature] = useState(25); // Temperature in °C
  const [pressure, setPressure] = useState(1); // Pressure in atm
  const [reactionType, setReactionType] = useState<'exothermic' | 'endothermic'>('exothermic');
  const [initialConcentrations, setInitialConcentrations] = useState({
    reactantA: 1.0,
    reactantB: 1.0,
    productC: 0.0,
    productD: 0.0
  });
  const [showConcentrationGraph, setShowConcentrationGraph] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  // Force simulation reset when parameters change
  const [resetCounter, setResetCounter] = useState(0);
  
  const resetSimulation = useCallback(() => {
    setResetCounter(prev => prev + 1);
  }, []);

  return (
    <ExperimentLayout 
      title="Chemical Equilibrium Simulator"
      category="chemistry"
      description="Visualize how reaction conditions affect chemical equilibrium"
      formula={reactionType === 'exothermic' ? 'A + B ⇌ C + D + heat' : 'A + B + heat ⇌ C + D'}
      formulaExplanation={reactionType === 'exothermic' 
        ? 'In this exothermic reaction, heat is released as products form' 
        : 'In this endothermic reaction, heat is absorbed for the reaction to proceed'}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <EquilibriumSimulation
            key={resetCounter} // Force component re-mount on reset
            temperature={temperature}
            pressure={pressure}
            reactionType={reactionType}
            initialConcentrations={initialConcentrations}
            showConcentrationGraph={showConcentrationGraph}
            isPaused={isPaused}
          />
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Chemical Equilibrium</h3>
            <p className="text-sm">
              Chemical equilibrium is a dynamic state where the rate of the forward reaction equals the 
              rate of the reverse reaction, resulting in no net change in concentrations over time.
              This simulation demonstrates Le Chatelier's Principle, which predicts how a system at 
              equilibrium responds when conditions are changed.
            </p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-medium mb-1">Le Chatelier's Principle</h4>
                <p className="text-xs">
                  When a system at equilibrium is subjected to a change in conditions (concentration, 
                  temperature, pressure), the equilibrium shifts to counteract the imposed change.
                  This principle helps predict how equilibrium systems respond to disturbances.
                </p>
              </div>
              
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium mb-1">Equilibrium Constant (Keq)</h4>
                <p className="text-xs">
                  The equilibrium constant Keq = [C][D]/[A][B] describes the ratio of product 
                  concentrations to reactant concentrations at equilibrium. A larger Keq indicates 
                  that the reaction favors product formation, while a smaller Keq indicates that 
                  reactants are favored.
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded">
              <h4 className="font-medium mb-1">Key Factors Affecting Equilibrium</h4>
              <ul className="list-disc pl-5 text-xs">
                <li><strong>Temperature:</strong> For exothermic reactions, increasing temperature shifts equilibrium left; for endothermic reactions, it shifts right</li>
                <li><strong>Concentration:</strong> Adding more of a substance shifts equilibrium away from that substance</li>
                <li><strong>Pressure:</strong> For reactions with gaseous components, increasing pressure favors the side with fewer gas molecules</li>
                <li><strong>Catalysts:</strong> Speed up both forward and reverse reactions but do not affect the equilibrium position</li>
              </ul>
            </div>
            
            <div className="mt-4 text-xs">
              <p>
                In this simulation, you can observe how changing temperature, pressure, and initial 
                concentrations affects the equilibrium position. The visualization helps illustrate 
                Le Chatelier's Principle in action and develop an intuition for predicting equilibrium shifts.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:w-96">
          <EquilibriumControls
            temperature={temperature}
            pressure={pressure}
            reactionType={reactionType}
            initialConcentrations={initialConcentrations}
            showConcentrationGraph={showConcentrationGraph}
            isPaused={isPaused}
            setTemperature={setTemperature}
            setPressure={setPressure}
            setReactionType={setReactionType}
            setInitialConcentrations={setInitialConcentrations}
            setShowConcentrationGraph={setShowConcentrationGraph}
            setIsPaused={setIsPaused}
            resetSimulation={resetSimulation}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 