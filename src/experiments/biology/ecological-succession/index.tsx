'use client';

import { useState, useCallback } from 'react';
import ExperimentLayout from '@/components/ExperimentLayout';
import ExperimentContentLayout from '@/components/ExperimentContentLayout';

export default function EcologicalSuccessionExperiment() {
  // Placeholder for future implementation
  const simulationComponent = (
    <div className="flex items-center justify-center bg-white p-8 rounded shadow h-[500px]">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Ecological Succession Simulation</h3>
        <p className="text-gray-500">This simulation is under development. Check back soon!</p>
      </div>
    </div>
  );
  
  // Placeholder controls
  const controlsComponent = (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Ecological Succession Controls</h3>
      <p className="text-gray-500">Controls for this simulation are under development.</p>
    </div>
  );
  
  // Information component
  const infoComponent = (
    <>
      <h3 className="text-lg font-semibold mb-2">About Ecological Succession</h3>
      <p className="text-sm">
        Ecological succession is the process of change in the species structure of an ecological 
        community over time. It involves the gradual replacement of early colonizing species by 
        later arriving ones, eventually reaching a stable climax community. This simulation will 
        demonstrate both primary and secondary succession processes.
      </p>
    </>
  );

  return (
    <ExperimentLayout 
      title="Ecological Succession"
      category="biology"
      description="Simulate how ecosystems develop and change over time"
      formula="Pioneer → Intermediate → Climax"
      formulaExplanation="The succession of communities from initial colonizers to a stable ecosystem"
    >
      <ExperimentContentLayout
        simulation={simulationComponent}
        controls={controlsComponent}
        info={infoComponent}
      />
    </ExperimentLayout>
  );
} 