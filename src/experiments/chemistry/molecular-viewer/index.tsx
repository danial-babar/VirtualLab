'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const MolecularViewerSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const MolecularViewerControls = dynamic(() => import('./Controls'), { ssr: false });

export default function MolecularViewerExperiment() {
  const [selectedMolecule, setSelectedMolecule] = useState('water');
  const [rotationSpeed, setRotationSpeed] = useState(5);
  const [renderStyle, setRenderStyle] = useState<'ball-and-stick' | 'space-filling'>('ball-and-stick');
  const [showLabels, setShowLabels] = useState(true);
  const [bondWidth, setBondWidth] = useState(1.0);

  return (
    <ExperimentLayout 
      title="Molecular Viewer"
      category="chemistry"
      description="Visualize and interact with 3D molecular structures"
      formula=""
      formulaExplanation=""
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <MolecularViewerSimulation
            selectedMolecule={selectedMolecule}
            rotationSpeed={rotationSpeed}
            renderStyle={renderStyle}
            showLabels={showLabels}
            bondWidth={bondWidth}
          />
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Molecular Modeling</h3>
            <p className="text-sm">
              Molecular models help scientists visualize the three-dimensional arrangement of atoms in molecules.
              These models are crucial for understanding chemical properties, reactions, and interactions.
            </p>
            
            <h4 className="text-md font-medium mt-4 mb-1">Key Concepts</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>Molecules have specific 3D geometries that affect their properties</li>
              <li>Bond angles and lengths determine molecular shape</li>
              <li>Atomic size and electronegativity influence molecular behavior</li>
              <li>3D visualization helps understand structure-function relationships</li>
            </ul>
            
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
              <p className="mb-2">
                <strong>Molecular Structure Types:</strong>
              </p>
              <ul className="list-disc pl-5 text-xs">
                <li><strong>Linear:</strong> CO₂ has atoms arranged in a straight line with 180° bond angles</li>
                <li><strong>Tetrahedral:</strong> CH₄ has a central carbon with 109.5° bond angles</li>
                <li><strong>Trigonal Pyramidal:</strong> NH₃ has a pyramid shape with nitrogen at the apex</li>
                <li><strong>Bent/Angular:</strong> H₂O has an angular shape with approximately 104.5° bond angle</li>
                <li><strong>Planar:</strong> Benzene (C₆H₆) has a flat, hexagonal ring structure</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="md:w-96">
          <MolecularViewerControls
            selectedMolecule={selectedMolecule}
            rotationSpeed={rotationSpeed}
            renderStyle={renderStyle}
            showLabels={showLabels}
            bondWidth={bondWidth}
            setSelectedMolecule={setSelectedMolecule}
            setRotationSpeed={setRotationSpeed}
            setRenderStyle={setRenderStyle}
            setShowLabels={setShowLabels}
            setBondWidth={setBondWidth}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 