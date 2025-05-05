'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';
import ExperimentContentLayout from '@/components/ExperimentContentLayout';

// Dynamically import components with client-side only rendering
const EnzymeKineticsSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const EnzymeKineticsControls = dynamic(() => import('./Controls'), { ssr: false });

export default function EnzymeKineticsExperiment() {
  const [substrateConcentration, setSubstrateConcentration] = useState(5);
  const [enzymeConcentration, setEnzymeConcentration] = useState(3);
  const [temperature, setTemperature] = useState(37);
  const [pH, setpH] = useState(7);
  const [inhibitorPresent, setInhibitorPresent] = useState(false);
  const [inhibitorType, setInhibitorType] = useState<'competitive' | 'noncompetitive' | 'uncompetitive' | 'none'>('none');
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  
  // Force simulation reset when parameters change
  const [resetCounter, setResetCounter] = useState(0);
  
  const resetSimulation = useCallback(() => {
    setResetCounter(prev => prev + 1);
  }, []);
  
  // Simulation component
  const simulationComponent = (
    <EnzymeKineticsSimulation
      key={resetCounter} // Force component re-mount on reset
      substrateConcentration={substrateConcentration}
      enzymeConcentration={enzymeConcentration}
      temperature={temperature}
      pH={pH}
      inhibitorPresent={inhibitorPresent}
      inhibitorType={inhibitorType}
      speed={speed}
      isPaused={isPaused}
    />
  );
  
  // Controls component
  const controlsComponent = (
    <EnzymeKineticsControls
      substrateConcentration={substrateConcentration}
      enzymeConcentration={enzymeConcentration}
      temperature={temperature}
      pH={pH}
      inhibitorPresent={inhibitorPresent}
      inhibitorType={inhibitorType}
      speed={speed}
      isPaused={isPaused}
      setSubstrateConcentration={setSubstrateConcentration}
      setEnzymeConcentration={setEnzymeConcentration}
      setTemperature={setTemperature}
      setpH={setpH}
      setInhibitorPresent={setInhibitorPresent}
      setInhibitorType={setInhibitorType}
      setSpeed={setSpeed}
      setIsPaused={setIsPaused}
      resetSimulation={resetSimulation}
    />
  );
  
  // Information component
  const infoComponent = (
    <>
      <h3 className="text-lg font-semibold mb-2">About Enzyme Kinetics</h3>
      <p className="text-sm">
        Enzyme kinetics is the study of how enzymes catalyze biochemical reactions. Enzymes are proteins 
        that act as biological catalysts, increasing the rate of reactions without being consumed in the process.
        This simulation demonstrates how enzymes bind to substrates at their active sites to form products.
      </p>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded">
          <h4 className="font-medium mb-1">Lock and Key Model</h4>
          <p className="text-xs">
            This traditional model suggests that enzymes and substrates fit together like a lock and key. 
            The substrate fits perfectly into the active site of the enzyme, forming an enzyme-substrate complex.
            After the reaction occurs, the enzyme releases the product and remains unchanged.
          </p>
        </div>
        
        <div className="bg-green-50 p-3 rounded">
          <h4 className="font-medium mb-1">Induced Fit Model</h4>
          <p className="text-xs">
            This more modern model suggests that the enzyme's active site changes shape slightly when the 
            substrate binds, creating an even better fit. This conformational change helps the enzyme catalyze 
            the reaction more effectively by putting strain on certain bonds or aligning reactive groups.
          </p>
        </div>
      </div>
    </>
  );
  
  // Additional controls info
  const additionalControlsInfo = (
    <div className="p-3 bg-amber-50 rounded">
      <h4 className="font-medium mb-1">Key Concepts</h4>
      <ul className="list-disc pl-5 text-xs">
        <li><strong>Reaction Rate:</strong> The speed at which substrates are converted to products</li>
        <li><strong>Michaelis-Menten Kinetics:</strong> Mathematical model describing the relationship between substrate concentration and reaction rate</li>
        <li><strong>Km (Michaelis Constant):</strong> Substrate concentration at which reaction rate is half of Vmax</li>
        <li><strong>Vmax:</strong> Maximum reaction rate achieved when all enzyme molecules are substrate-bound</li>
        <li><strong>Inhibitors:</strong> Molecules that reduce enzyme activity by binding to the enzyme</li>
      </ul>
    </div>
  );

  return (
    <ExperimentLayout 
      title="Enzyme Kinetics Simulator"
      category="biology"
      description="Visualize enzyme-substrate interactions and factors affecting reaction rates"
      formula="E + S ⇌ ES → E + P"
      formulaExplanation="Enzyme (E) binds to substrate (S) forming an enzyme-substrate complex (ES), which then converts to product (P) and regenerates the enzyme"
    >
      <ExperimentContentLayout
        simulation={simulationComponent}
        controls={controlsComponent}
        info={infoComponent}
        additionalControlsInfo={additionalControlsInfo}
      />
    </ExperimentLayout>
  );
} 