'use client';

import { useState, useCallback } from 'react';
import ExperimentLayout from '@/components/ExperimentLayout';
import ExperimentContentLayout from '@/components/ExperimentContentLayout';

export default function CirculatorySystemExperiment() {
  // Placeholder for future implementation
  const simulationComponent = (
    <div className="flex items-center justify-center bg-white p-8 rounded shadow h-[500px]">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Circulatory System Simulation</h3>
        <p className="text-gray-500">This simulation is under development. Check back soon!</p>
      </div>
    </div>
  );
  
  // Placeholder controls
  const controlsComponent = (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Circulatory System Controls</h3>
      <p className="text-gray-500">Controls for this simulation are under development.</p>
    </div>
  );
  
  // Information component
  const infoComponent = (
    <>
      <h3 className="text-lg font-semibold mb-2">About the Circulatory System</h3>
      <p className="text-sm">
        The circulatory system is responsible for transporting oxygen, nutrients, hormones, and 
        cellular waste throughout the body. In humans, it consists of the heart, blood vessels, 
        and blood. This simulation will demonstrate how blood flows through the heart, lungs, 
        and body, and how oxygen and carbon dioxide are exchanged.
      </p>
    </>
  );

  return (
    <ExperimentLayout 
      title="Circulatory System Simulator"
      category="biology"
      description="Visualize blood flow, heart function, and oxygen exchange"
      formula="O₂ + Hb ⇌ HbO₂"
      formulaExplanation="Oxygen binds with hemoglobin in the lungs and is released to tissues throughout the body"
    >
      <ExperimentContentLayout
        simulation={simulationComponent}
        controls={controlsComponent}
        info={infoComponent}
      />
    </ExperimentLayout>
  );
} 