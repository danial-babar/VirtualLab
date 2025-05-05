'use client';

import Slider from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';

interface ControlsProps {
  temperature: number;
  pressure: number;
  reactionType: 'exothermic' | 'endothermic';
  initialConcentrations: {
    reactantA: number;
    reactantB: number;
    productC: number;
    productD: number;
  };
  showConcentrationGraph: boolean;
  isPaused: boolean;
  setTemperature: (value: number) => void;
  setPressure: (value: number) => void;
  setReactionType: (value: 'exothermic' | 'endothermic') => void;
  setInitialConcentrations: (value: {
    reactantA: number;
    reactantB: number;
    productC: number;
    productD: number;
  }) => void;
  setShowConcentrationGraph: (value: boolean) => void;
  setIsPaused: (value: boolean) => void;
  resetSimulation: () => void;
}

export default function EquilibriumControls({
  temperature,
  pressure,
  reactionType,
  initialConcentrations,
  showConcentrationGraph,
  isPaused,
  setTemperature,
  setPressure,
  setReactionType,
  setInitialConcentrations,
  setShowConcentrationGraph,
  setIsPaused,
  resetSimulation
}: ControlsProps) {
  // Handle input changes for initial concentrations
  const handleConcentrationChange = (
    type: 'reactantA' | 'reactantB' | 'productC' | 'productD',
    value: number
  ) => {
    setInitialConcentrations({
      ...initialConcentrations,
      [type]: value
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h2 className="text-xl font-bold mb-4">Simulation Controls</h2>
      
      <div className="space-y-6">
        {/* Reaction Type */}
        <div>
          <h3 className="text-sm font-medium mb-2">Reaction Type</h3>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 px-3 rounded-md ${
                reactionType === 'exothermic'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setReactionType('exothermic')}
            >
              Exothermic
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-md ${
                reactionType === 'endothermic'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setReactionType('endothermic')}
            >
              Endothermic
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {reactionType === 'exothermic'
              ? 'Exothermic: Heat is released when products form'
              : 'Endothermic: Heat is absorbed when products form'}
          </p>
        </div>
        
        {/* Temperature */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium">Temperature</label>
            <span className="text-sm">{temperature}°C</span>
          </div>
          <Slider
            value={temperature}
            min={0}
            max={100}
            step={1}
            onChange={setTemperature}
          />
          <p className="text-xs text-gray-500 mt-1">
            {reactionType === 'exothermic'
              ? 'Higher temperature shifts equilibrium to reactants'
              : 'Higher temperature shifts equilibrium to products'}
          </p>
        </div>
        
        {/* Pressure */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium">Pressure</label>
            <span className="text-sm">{pressure.toFixed(1)} atm</span>
          </div>
          <Slider
            value={pressure}
            min={0.1}
            max={5}
            step={0.1}
            onChange={setPressure}
          />
          <p className="text-xs text-gray-500 mt-1">
            Assumes reaction has fewer gas molecules on product side
          </p>
        </div>
        
        {/* Initial Concentrations */}
        <div>
          <h3 className="text-sm font-medium mb-2">Initial Concentrations</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs">Reactant A</label>
                <span className="text-xs">{initialConcentrations.reactantA.toFixed(1)} M</span>
              </div>
              <Slider
                value={initialConcentrations.reactantA}
                min={0}
                max={2}
                step={0.1}
                onChange={(value) => handleConcentrationChange('reactantA', value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs">Reactant B</label>
                <span className="text-xs">{initialConcentrations.reactantB.toFixed(1)} M</span>
              </div>
              <Slider
                value={initialConcentrations.reactantB}
                min={0}
                max={2}
                step={0.1}
                onChange={(value) => handleConcentrationChange('reactantB', value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs">Product C</label>
                <span className="text-xs">{initialConcentrations.productC.toFixed(1)} M</span>
              </div>
              <Slider
                value={initialConcentrations.productC}
                min={0}
                max={2}
                step={0.1}
                onChange={(value) => handleConcentrationChange('productC', value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs">Product D</label>
                <span className="text-xs">{initialConcentrations.productD.toFixed(1)} M</span>
              </div>
              <Slider
                value={initialConcentrations.productD}
                min={0}
                max={2}
                step={0.1}
                onChange={(value) => handleConcentrationChange('productD', value)}
              />
            </div>
          </div>
        </div>
        
        {/* Display Options */}
        <div>
          <h3 className="text-sm font-medium mb-2">Display Options</h3>
          
          <div className="flex items-center justify-between">
            <label className="text-sm">Show Concentration Graph</label>
            <Switch
              checked={showConcentrationGraph}
              onCheckedChange={setShowConcentrationGraph}
            />
          </div>
        </div>
        
        {/* Playback Controls */}
        <div className="pt-2 border-t">
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 px-3 rounded-md ${
                isPaused ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? 'Play' : 'Pause'}
            </button>
            <button
              className="flex-1 py-2 px-3 rounded-md bg-gray-100 hover:bg-gray-200"
              onClick={resetSimulation}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 