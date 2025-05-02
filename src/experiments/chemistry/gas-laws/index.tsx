'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const GasLawsSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const GasLawsControls = dynamic(() => import('./Controls'), { ssr: false });

export default function GasLawsExperiment() {
  const [temperature, setTemperature] = useState(100);
  const [volume, setVolume] = useState(100);
  const [particleCount, setParticleCount] = useState(50);
  const [showCollisions, setShowCollisions] = useState(true);
  const [selectedLaw, setSelectedLaw] = useState<'boyle' | 'charles' | 'gay-lussac' | 'combined'>('combined');

  return (
    <ExperimentLayout 
      title="Gas Laws Simulator"
      category="chemistry"
      description="Explore the relationship between pressure, volume, and temperature in gases"
      formula="PV = nRT"
      formulaExplanation="The Ideal Gas Law equation describes how gases behave under different conditions"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <GasLawsSimulation
            temperature={temperature}
            volume={volume}
            particleCount={particleCount}
            showCollisions={showCollisions}
            selectedLaw={selectedLaw}
          />
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Gas Laws</h3>
            <p className="text-sm">
              Gas laws are a set of rules that describe how gases behave with changes in pressure, volume, temperature, and amount.
              This simulation demonstrates the relationship between these variables through a dynamic model of gas particles.
            </p>
            
            <h4 className="text-md font-medium mt-4 mb-1">Key Concepts</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>Gas particles are in constant random motion</li>
              <li>Pressure is created by particles colliding with container walls</li>
              <li>Temperature is directly related to the average kinetic energy of particles</li>
              <li>The ideal gas law assumes particles have negligible volume and no intermolecular forces</li>
            </ul>
            
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
              <p className="mb-2">
                <strong>Experimental Tips:</strong>
              </p>
              <ul className="list-disc pl-5 text-xs">
                <li>To observe Boyle's Law: Keep temperature constant and change volume to see pressure respond inversely</li>
                <li>For Charles's Law: Keep pressure constant (approximately) and observe how volume changes with temperature</li>
                <li>For Gay-Lussac's Law: Keep volume constant and observe how pressure increases with temperature</li>
              </ul>
            </div>
            
            <div className="mt-4 text-xs">
              <p className="italic">
                This simulator provides a microscopic view of what's happening at the particle level when we observe the macroscopic
                gas law relationships in laboratory experiments.
              </p>
            </div>
          </div>
        </div>
        <div className="md:w-96">
          <GasLawsControls
            temperature={temperature}
            volume={volume}
            particleCount={particleCount}
            showCollisions={showCollisions}
            selectedLaw={selectedLaw}
            setTemperature={setTemperature}
            setVolume={setVolume}
            setParticleCount={setParticleCount}
            setShowCollisions={setShowCollisions}
            setSelectedLaw={setSelectedLaw}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 