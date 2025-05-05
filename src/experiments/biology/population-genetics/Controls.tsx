'use client';

import React from 'react';

interface PopulationGeneticsControlsProps {
  populationSize: number;
  initialFrequency: number;
  selectionCoefficient: number;
  mutationRate: number;
  migrationRate: number;
  generationsPerSecond: number;
  isPaused: boolean;
  showLegend: boolean;
  selectionMode: 'neutral' | 'positive' | 'negative' | 'balancing';
  setPopulationSize: React.Dispatch<React.SetStateAction<number>>;
  setInitialFrequency: React.Dispatch<React.SetStateAction<number>>;
  setSelectionCoefficient: React.Dispatch<React.SetStateAction<number>>;
  setMutationRate: React.Dispatch<React.SetStateAction<number>>;
  setMigrationRate: React.Dispatch<React.SetStateAction<number>>;
  setGenerationsPerSecond: React.Dispatch<React.SetStateAction<number>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLegend: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectionMode: React.Dispatch<React.SetStateAction<'neutral' | 'positive' | 'negative' | 'balancing'>>;
  resetSimulation: () => void;
}

export default function PopulationGeneticsControls({
  populationSize,
  initialFrequency,
  selectionCoefficient,
  mutationRate,
  migrationRate,
  generationsPerSecond,
  isPaused,
  showLegend,
  selectionMode,
  setPopulationSize,
  setInitialFrequency,
  setSelectionCoefficient,
  setMutationRate,
  setMigrationRate,
  setGenerationsPerSecond,
  setIsPaused,
  setShowLegend,
  setSelectionMode,
  resetSimulation
}: PopulationGeneticsControlsProps) {
  
  // Reset to default values
  const resetToDefault = () => {
    setPopulationSize(100);
    setInitialFrequency(0.5);
    setSelectionCoefficient(0);
    setMutationRate(0);
    setMigrationRate(0);
    setGenerationsPerSecond(1);
    setIsPaused(false);
    setShowLegend(true);
    setSelectionMode('neutral');
    resetSimulation();
  };
  
  // Preset scenarios
  const presets = [
    {
      name: "Hardy-Weinberg Equilibrium",
      description: "No evolutionary forces acting on population",
      apply: () => {
        setPopulationSize(500);
        setInitialFrequency(0.5);
        setSelectionCoefficient(0);
        setMutationRate(0);
        setMigrationRate(0);
        setSelectionMode('neutral');
        resetSimulation();
      }
    },
    {
      name: "Natural Selection",
      description: "Selection favors the dominant allele",
      apply: () => {
        setPopulationSize(500);
        setInitialFrequency(0.3);
        setSelectionCoefficient(0.2);
        setMutationRate(0);
        setMigrationRate(0);
        setSelectionMode('positive');
        resetSimulation();
      }
    },
    {
      name: "Genetic Drift - Small Population",
      description: "Random changes in allele frequency in a small population",
      apply: () => {
        setPopulationSize(20);
        setInitialFrequency(0.5);
        setSelectionCoefficient(0);
        setMutationRate(0);
        setMigrationRate(0);
        setSelectionMode('neutral');
        resetSimulation();
      }
    },
    {
      name: "Mutation Pressure",
      description: "Mutations driving allele frequency change",
      apply: () => {
        setPopulationSize(500);
        setInitialFrequency(0.1);
        setSelectionCoefficient(0);
        setMutationRate(0.05);
        setMigrationRate(0);
        setSelectionMode('neutral');
        resetSimulation();
      }
    },
    {
      name: "Gene Flow",
      description: "Migration introducing new alleles",
      apply: () => {
        setPopulationSize(100);
        setInitialFrequency(0.2);
        setSelectionCoefficient(0);
        setMutationRate(0);
        setMigrationRate(0.1);
        setSelectionMode('neutral');
        resetSimulation();
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Population Genetics Controls</h3>
      
      {/* Presets */}
      <div>
        <h4 className="font-medium mb-2">Experiment Presets</h4>
        <div className="grid grid-cols-1 gap-2">
          {presets.map((preset, index) => (
            <button
              key={index}
              className="p-2 border rounded hover:bg-gray-100 text-left"
              onClick={preset.apply}
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-sm text-gray-600">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Population Parameters */}
      <div>
        <h4 className="font-medium mb-3 text-blue-700">Population Parameters</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">
              Population Size: {populationSize} individuals
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={populationSize}
              onChange={(e) => setPopulationSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm">
              Initial Allele Frequency: {initialFrequency.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={initialFrequency}
              onChange={(e) => setInitialFrequency(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500">
              Starting frequency of the dominant allele (A)
            </div>
          </div>
        </div>
      </div>
      
      {/* Evolutionary Forces */}
      <div>
        <h4 className="font-medium mb-3 text-green-700">Evolutionary Forces</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Selection Mode:</label>
            <select
              value={selectionMode}
              onChange={(e) => setSelectionMode(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="neutral">Neutral Selection</option>
              <option value="positive">Positive Selection</option>
              <option value="negative">Negative Selection</option>
              <option value="balancing">Balancing Selection</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm">
              Selection Coefficient: {selectionCoefficient.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={selectionCoefficient}
              onChange={(e) => setSelectionCoefficient(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500">
              Strength of selection pressure (0 = no selection)
            </div>
          </div>
          
          <div>
            <label className="block mb-1 text-sm">
              Mutation Rate: {mutationRate.toFixed(3)}
            </label>
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.001"
              value={mutationRate}
              onChange={(e) => setMutationRate(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm">
              Migration Rate: {migrationRate.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={migrationRate}
              onChange={(e) => setMigrationRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500">
              Rate of migrant individuals entering the population (fixed allele frequency of 0.8)
            </div>
          </div>
        </div>
      </div>
      
      {/* Simulation Controls */}
      <div>
        <h4 className="font-medium mb-3 text-purple-700">Simulation Controls</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">
              Simulation Speed: {generationsPerSecond} generations/second
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={generationsPerSecond}
              onChange={(e) => setGenerationsPerSecond(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showLegend"
              checked={showLegend}
              onChange={(e) => setShowLegend(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showLegend">
              Show Legend and Labels
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