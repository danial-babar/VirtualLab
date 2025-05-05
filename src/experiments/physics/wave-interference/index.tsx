'use client';

import { useState, useCallback } from 'react';
import ExperimentLayout from '@/components/ExperimentLayout';
import WaveSimulation from './Simulation';
import WaveControls from './WaveControls';

// Define types for our Controls component to fix TypeScript errors
type ControlProps = {
  amplitude1: number;
  frequency1: number;
  phaseShift: number;
  amplitude2: number;
  frequency2: number;
  showComponents: boolean;
  isPaused: boolean;
  setAmplitude1: React.Dispatch<React.SetStateAction<number>>;
  setFrequency1: React.Dispatch<React.SetStateAction<number>>;
  setPhase2: React.Dispatch<React.SetStateAction<number>>;
  setAmplitude2: React.Dispatch<React.SetStateAction<number>>;
  setFrequency2: React.Dispatch<React.SetStateAction<number>>;
  setShowComponents: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  resetSimulation: () => void;
}

export default function WaveInterferenceExperiment() {
  // Source 1 parameters
  const [amplitude1, setAmplitude1] = useState(50);
  const [frequency1, setFrequency1] = useState(3);
  const [phase1, setPhase1] = useState(0);
  
  // Source 2 parameters
  const [amplitude2, setAmplitude2] = useState(50);
  const [frequency2, setFrequency2] = useState(3);
  const [phase2, setPhase2] = useState(0);
  
  // Display settings
  const [showComponents, setShowComponents] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  // Force simulation reset when parameters change
  const [resetCounter, setResetCounter] = useState(0);
  
  const resetSimulation = useCallback(() => {
    setResetCounter(prev => prev + 1);
  }, []);

  return (
    <ExperimentLayout 
      title="Wave Interference Simulator"
      category="physics"
      description="Visualize constructive and destructive interference patterns"
      formula="y(x,t) = A₁sin(kx-ωt+φ₁) + A₂sin(kx-ωt+φ₂)"
      formulaExplanation="When waves overlap, their displacements add (superposition), creating constructive or destructive interference patterns."
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content column - fixed width on larger screens */}
        <div className="lg:w-2/3">
          <div className="sticky top-4">
            <WaveSimulation
              key={resetCounter} // Force component re-mount on reset
              amplitude1={amplitude1}
              frequency1={frequency1}
              phaseShift={phase2}
              amplitude2={amplitude2}
              frequency2={frequency2}
              showComponents={showComponents}
            />
            
            <div className="mt-6 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">About Wave Interference</h3>
              <p className="text-sm">
                Wave interference occurs when two or more waves overlap and interact with each other. This fundamental 
                phenomenon can be observed in all types of waves, including water waves, sound waves, light waves, 
                and quantum mechanical waves.
              </p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-medium mb-1">Constructive Interference</h4>
                  <p className="text-xs">
                    When waves meet in phase (crest meets crest), their amplitudes add together, resulting in a 
                    larger wave. This produces points of maximum intensity called antinodes. For constructive 
                    interference to occur, the path difference must be nλ (where n is an integer).
                  </p>
                </div>
                
                <div className="bg-green-50 p-3 rounded">
                  <h4 className="font-medium mb-1">Destructive Interference</h4>
                  <p className="text-xs">
                    When waves meet out of phase (crest meets trough), they cancel each other out, resulting in 
                    reduced or zero amplitude. This produces points of minimum intensity called nodes. For 
                    destructive interference, the path difference must be (n+½)λ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls column - scrollable independently */}
        <div className="lg:w-1/3 lg:sticky lg:top-4 lg:self-start">
          <WaveControls
            amplitude1={amplitude1}
            frequency1={frequency1}
            phaseShift={phase2}
            amplitude2={amplitude2}
            frequency2={frequency2}
            showComponents={showComponents}
            isPaused={isPaused}
            setAmplitude1={setAmplitude1}
            setFrequency1={setFrequency1}
            setPhase2={setPhase2}
            setAmplitude2={setAmplitude2}
            setFrequency2={setFrequency2}
            setShowComponents={setShowComponents}
            setIsPaused={setIsPaused}
            resetSimulation={resetSimulation}
          />
          
          {/* Additional educational content in the control panel */}
          <div className="mt-4 p-3 bg-amber-50 rounded shadow">
            <h4 className="font-medium mb-1">Applications of Wave Interference</h4>
            <ul className="list-disc pl-5 text-xs">
              <li><strong>Young's Double-Slit:</strong> Demonstrates light's wave nature</li>
              <li><strong>Noise-Cancelling:</strong> Uses destructive interference</li>
              <li><strong>Interferometers:</strong> Precise astronomical measurements</li>
              <li><strong>Thin-Film:</strong> Creates soap bubble colors</li>
            </ul>
          </div>
        </div>
      </div>
    </ExperimentLayout>
  );
} 