'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';
import ExperimentContentLayout from '@/components/ExperimentContentLayout';

// Dynamically import components with client-side only rendering
const NeuralSignalingSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const NeuralSignalingControls = dynamic(() => import('./Controls'), { ssr: false });

export default function NeuralSignalingExperiment() {
  const [membraneVoltage, setMembraneVoltage] = useState(-70);
  const [threshold, setThreshold] = useState(-55);
  const [stimulationFrequency, setStimulationFrequency] = useState(1);
  const [neurotransmitterAmount, setNeurotransmitterAmount] = useState(5);
  const [showLabels, setShowLabels] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  // Force simulation reset when parameters change
  const [resetCounter, setResetCounter] = useState(0);
  
  const resetSimulation = useCallback(() => {
    setResetCounter(prev => prev + 1);
  }, []);
  
  const triggerStimulation = useCallback(() => {
    // This function will be passed to simulation via a ref
    // For now, we'll just reset to force a new action potential
    resetSimulation();
  }, [resetSimulation]);
  
  // Simulation component
  const simulationComponent = (
    <NeuralSignalingSimulation
      key={resetCounter} // Force component re-mount on reset
      membraneVoltage={membraneVoltage}
      threshold={threshold}
      stimulationFrequency={stimulationFrequency}
      neurotransmitterAmount={neurotransmitterAmount}
      showLabels={showLabels}
      isPaused={isPaused}
    />
  );
  
  // Controls component
  const controlsComponent = (
    <NeuralSignalingControls
      membraneVoltage={membraneVoltage}
      threshold={threshold}
      stimulationFrequency={stimulationFrequency}
      neurotransmitterAmount={neurotransmitterAmount}
      showLabels={showLabels}
      isPaused={isPaused}
      setMembraneVoltage={setMembraneVoltage}
      setThreshold={setThreshold}
      setStimulationFrequency={setStimulationFrequency}
      setNeurotransmitterAmount={setNeurotransmitterAmount}
      setShowLabels={setShowLabels}
      setIsPaused={setIsPaused}
      triggerStimulation={triggerStimulation}
      resetSimulation={resetSimulation}
    />
  );
  
  // Information component
  const infoComponent = (
    <>
      <h3 className="text-lg font-semibold mb-2">About Neural Signaling</h3>
      <p className="text-sm">
        Neural signaling is the process by which neurons communicate with each other through
        electrochemical signals. These signals, called action potentials, travel along axons
        and trigger the release of neurotransmitters at synapses, which then influence the activity
        of receiving neurons.
      </p>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded">
          <h4 className="font-medium mb-1">Action Potentials</h4>
          <p className="text-xs">
            An action potential is a rapid change in electrical potential across the cell membrane
            of a neuron. It occurs when the membrane potential reaches a threshold value, triggering
            the opening and closing of voltage-gated ion channels. This creates a wave of depolarization
            that travels along the axon.
          </p>
        </div>
        
        <div className="bg-green-50 p-3 rounded">
          <h4 className="font-medium mb-1">Synaptic Transmission</h4>
          <p className="text-xs">
            When an action potential reaches the axon terminal, it triggers the release of chemical
            neurotransmitters into the synaptic cleft. These neurotransmitters bind to receptors on the
            postsynaptic neuron, causing ion channels to open or close and changing the membrane potential
            of the receiving neuron.
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
        <li><strong>Resting Potential:</strong> The membrane voltage when a neuron is not transmitting a signal (typically -70mV)</li>
        <li><strong>Threshold Potential:</strong> The voltage at which an action potential is triggered (typically -55mV)</li>
        <li><strong>Depolarization:</strong> The rapid rise in membrane potential during an action potential</li>
        <li><strong>Repolarization:</strong> The return of the membrane potential to its resting state</li>
        <li><strong>Neurotransmitters:</strong> Chemical messengers that transmit signals across synapses</li>
      </ul>
    </div>
  );

  return (
    <ExperimentLayout 
      title="Neural Signaling Simulator"
      category="biology"
      description="Explore action potentials and synaptic transmission between neurons"
      formula="Na+ in, K+ out → Action Potential"
      formulaExplanation="During neural signaling, ion channels open and close to create an electrical signal that travels along the neuron"
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