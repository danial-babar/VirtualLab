'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const ElectricFieldSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const ElectricFieldControls = dynamic(() => import('./Controls'), { ssr: false });

export default function ElectricFieldExperiment() {
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [showForceVectors, setShowForceVectors] = useState(false);
  const [numFieldLines, setNumFieldLines] = useState(16);
  const [testChargeEnabled, setTestChargeEnabled] = useState(false);

  return (
    <ExperimentLayout 
      title="Electric Field Simulator"
      category="physics"
      description="Visualize electric fields, field lines, and forces between charges"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <ElectricFieldSimulation
            showFieldLines={showFieldLines}
            showForceVectors={showForceVectors}
            numFieldLines={numFieldLines}
            testChargeEnabled={testChargeEnabled}
          />
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Electric Fields</h3>
            <p className="text-sm">
              Electric fields are created by electric charges and exert forces on other charges. This simulation demonstrates
              how positive and negative charges interact, creating field patterns in space. Coulomb's law describes the force
              between charges, which is proportional to the product of the charges and inversely proportional to the square
              of the distance between them.
            </p>
            <h4 className="text-md font-medium mt-4 mb-1">Key Concepts</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>Electric field lines always point away from positive charges and toward negative charges</li>
              <li>The density of field lines indicates the strength of the electric field</li>
              <li>Like charges repel, and opposite charges attract</li>
              <li>The electric field at any point is the vector sum of the fields due to each charge</li>
            </ul>
          </div>
        </div>
        <div className="md:w-96">
          <ElectricFieldControls
            showFieldLines={showFieldLines}
            showForceVectors={showForceVectors}
            numFieldLines={numFieldLines}
            testChargeEnabled={testChargeEnabled}
            setShowFieldLines={setShowFieldLines}
            setShowForceVectors={setShowForceVectors}
            setNumFieldLines={setNumFieldLines}
            setTestChargeEnabled={setTestChargeEnabled}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 