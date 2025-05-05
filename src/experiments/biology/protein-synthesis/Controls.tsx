'use client';

import React from 'react';

interface ProteinSynthesisControlsProps {
  dnaSequence: string;
  displayMode: 'transcription' | 'translation' | 'both';
  speed: number;
  isPaused: boolean;
  showLabels: boolean;
  setDnaSequence: React.Dispatch<React.SetStateAction<string>>;
  setDisplayMode: React.Dispatch<React.SetStateAction<'transcription' | 'translation' | 'both'>>;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLabels: React.Dispatch<React.SetStateAction<boolean>>;
  resetSimulation: () => void;
}

export default function ProteinSynthesisControls({
  dnaSequence,
  displayMode,
  speed,
  isPaused,
  showLabels,
  setDnaSequence,
  setDisplayMode,
  setSpeed,
  setIsPaused,
  setShowLabels,
  resetSimulation
}: ProteinSynthesisControlsProps) {
  
  // Reset to default values
  const resetToDefault = () => {
    setDnaSequence('ATGTACTGACCGAGCTTCAAGACTTATAG');
    setDisplayMode('both');
    setSpeed(1);
    setIsPaused(false);
    setShowLabels(true);
    resetSimulation();
  };
  
  // Preset DNA sequences
  const presets = [
    {
      name: "Short Polypeptide",
      sequence: "ATGTACTGACCGAGCTTCAAGACTTATAG",
      description: "A short gene coding for a simple protein",
    },
    {
      name: "GFP Fragment",
      sequence: "ATGGTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGAG",
      description: "Fragment of Green Fluorescent Protein gene",
    },
    {
      name: "Insulin Chain",
      sequence: "ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTC",
      description: "Part of human insulin gene",
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Protein Synthesis Controls</h3>
      
      {/* Presets */}
      <div>
        <h4 className="font-medium mb-2">DNA Sequence Presets</h4>
        <div className="grid grid-cols-1 gap-2">
          {presets.map((preset, index) => (
            <button
              key={index}
              className="p-2 border rounded hover:bg-gray-100 text-left"
              onClick={() => {
                setDnaSequence(preset.sequence);
                resetSimulation();
              }}
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-sm text-gray-600">{preset.description}</div>
              <div className="text-xs text-gray-500 mt-1 truncate">{preset.sequence}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* DNA Sequence */}
      <div>
        <h4 className="font-medium mb-2 text-blue-700">DNA Sequence</h4>
        <textarea
          value={dnaSequence}
          onChange={(e) => setDnaSequence(e.target.value.toUpperCase().replace(/[^ATGC]/g, ''))}
          className="w-full p-2 border rounded font-mono text-sm h-20"
          placeholder="Enter DNA sequence (A, T, G, C only)"
        />
        <div className="text-xs text-gray-500 mt-1">
          Length: {dnaSequence.length} nucleotides (need multiple of 3 for complete codons)
        </div>
      </div>
      
      {/* Display Mode */}
      <div>
        <h4 className="font-medium mb-2 text-purple-700">Display Mode</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              checked={displayMode === 'transcription'}
              onChange={() => setDisplayMode('transcription')}
              className="mr-2"
            />
            Transcription Only (DNA → mRNA)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={displayMode === 'translation'}
              onChange={() => setDisplayMode('translation')}
              className="mr-2"
            />
            Translation Only (mRNA → Protein)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={displayMode === 'both'}
              onChange={() => setDisplayMode('both')}
              className="mr-2"
            />
            Complete Process (DNA → mRNA → Protein)
          </label>
        </div>
      </div>
      
      {/* Simulation Controls */}
      <div>
        <h4 className="font-medium mb-3 text-green-700">Simulation Controls</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">
              Animation Speed: {speed}x
            </label>
            <input
              type="range"
              min="0.25"
              max="3"
              step="0.25"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showLabels"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showLabels">
              Show Labels and Annotations
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPaused"
              checked={isPaused}
              onChange={(e) => setIsPaused(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isPaused">
              Pause Simulation
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={resetToDefault}
              className="py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Reset All Parameters
            </button>
            
            <button
              onClick={resetSimulation}
              className="py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Restart Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 