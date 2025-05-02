'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  selectedMolecule: string;
  rotationSpeed: number;
  renderStyle: 'ball-and-stick' | 'space-filling';
  showLabels: boolean;
  bondWidth: number;
  setSelectedMolecule: (value: string) => void;
  setRotationSpeed: (value: number) => void;
  setRenderStyle: (value: 'ball-and-stick' | 'space-filling') => void;
  setShowLabels: (value: boolean) => void;
  setBondWidth: (value: number) => void;
}

function MolecularViewerControlsContent({
  selectedMolecule,
  rotationSpeed,
  renderStyle,
  showLabels,
  bondWidth,
  setSelectedMolecule,
  setRotationSpeed,
  setRenderStyle,
  setShowLabels,
  setBondWidth,
}: Props) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Molecular Viewer Controls</h3>
      
      <div className="mb-6">
        <label className="text-sm font-medium mb-1 block">Select Molecule</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { id: 'water', name: 'Water (H₂O)' },
            { id: 'methane', name: 'Methane (CH₄)' },
            { id: 'ammonia', name: 'Ammonia (NH₃)' },
            { id: 'carbon-dioxide', name: 'Carbon Dioxide (CO₂)' },
            { id: 'ethanol', name: 'Ethanol (C₂H₅OH)' },
            { id: 'benzene', name: 'Benzene (C₆H₆)' }
          ].map((molecule) => (
            <button
              key={molecule.id}
              onClick={() => setSelectedMolecule(molecule.id)}
              className={`py-2 px-3 text-sm rounded transition-colors ${
                selectedMolecule === molecule.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {molecule.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Rotation Speed: {rotationSpeed}
        </label>
        <div className="flex items-center">
          <span className="mr-2">0</span>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">10</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Rendering Style</label>
        <div className="flex gap-2">
          <button
            onClick={() => setRenderStyle('ball-and-stick')}
            className={`py-2 px-3 text-sm rounded flex-1 ${
              renderStyle === 'ball-and-stick'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Ball and Stick
          </button>
          <button
            onClick={() => setRenderStyle('space-filling')}
            className={`py-2 px-3 text-sm rounded flex-1 ${
              renderStyle === 'space-filling'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Space Filling
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
            className="mr-2"
          />
          Show atom labels
        </label>
      </div>
      
      {renderStyle === 'ball-and-stick' && (
        <div className="mb-4">
          <label className="block mb-2">
            Bond Width: {bondWidth.toFixed(1)}
          </label>
          <div className="flex items-center">
            <span className="mr-2">0.5</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={bondWidth}
              onChange={(e) => setBondWidth(Number(e.target.value))}
              className="w-full"
            />
            <span className="ml-2">3.0</span>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="text-blue-500 hover:text-blue-700 mb-4 text-sm flex items-center"
      >
        {showInfo ? '▼ Hide' : '► Show'} molecule information
      </button>
      
      {showInfo && (
        <div className="mb-6 border-t pt-4">
          <h4 className="font-bold mb-2">About Molecular Structures</h4>
          <p className="text-sm mb-3">
            Molecular models help visualize the three-dimensional arrangement of atoms in molecules.
            Different visualization styles emphasize different aspects of molecular structure.
          </p>
          
          <div className="mb-3">
            <h5 className="font-medium">Ball and Stick Model</h5>
            <p className="text-xs">
              Shows both atoms (as spheres) and the bonds between them (as sticks).
              Good for visualizing molecular geometry and bond arrangements.
            </p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Space Filling Model</h5>
            <p className="text-xs">
              Represents atoms as spheres with volumes proportional to their van der Waals radii.
              Shows the overall shape and relative size of the molecule.
            </p>
          </div>
        </div>
      )}
      
      <button 
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
        onClick={() => {
          setSelectedMolecule('water');
          setRotationSpeed(5);
          setRenderStyle('ball-and-stick');
          setShowLabels(true);
          setBondWidth(1.0);
        }}
      >
        Reset to Default
      </button>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const MolecularViewerControls = dynamic(() => Promise.resolve(MolecularViewerControlsContent), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Loading controls...</h3>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

export default MolecularViewerControls; 