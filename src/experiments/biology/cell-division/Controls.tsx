'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  divisionType: 'mitosis' | 'meiosis';
  speed: number;
  chromosomePairs: number;
  showLabels: boolean;
  isPaused: boolean;
  setDivisionType: (type: 'mitosis' | 'meiosis') => void;
  setSpeed: (speed: number) => void;
  setChromosomePairs: (pairs: number) => void;
  setShowLabels: (show: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  resetSimulation: () => void;
}

function CellDivisionControlsContent({
  divisionType,
  speed,
  chromosomePairs,
  showLabels,
  isPaused,
  setDivisionType,
  setSpeed,
  setChromosomePairs,
  setShowLabels,
  setIsPaused,
  resetSimulation
}: Props) {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Cell Division Controls</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Division Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDivisionType('mitosis')}
            className={`py-2 rounded ${divisionType === 'mitosis'
              ? 'bg-blue-100 border-2 border-blue-500 font-semibold'
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Mitosis
          </button>
          <button
            onClick={() => setDivisionType('meiosis')}
            className={`py-2 rounded ${divisionType === 'meiosis'
              ? 'bg-blue-100 border-2 border-blue-500 font-semibold'
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Meiosis
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Mitosis produces two identical diploid cells, meiosis produces four haploid gametes
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Animation Speed: {speed}x
        </label>
        <div className="flex items-center">
          <span className="mr-2">0.5x</span>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">3x</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Chromosome Pairs: {chromosomePairs}
        </label>
        <div className="flex items-center">
          <span className="mr-2">1</span>
          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={chromosomePairs}
            onChange={(e) => setChromosomePairs(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">4</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Number of homologous chromosome pairs
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
          Show Chromosome Numbers
        </label>
      </div>
      
      <div className="flex mb-6 space-x-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`flex-1 py-2 px-4 rounded ${
            isPaused 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          }`}
        >
          {isPaused ? 'Start' : 'Pause'}
        </button>
        <button
          onClick={resetSimulation}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>
      
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="text-blue-500 hover:text-blue-700 mb-4 text-sm flex items-center"
      >
        {showInfo ? '▼ Hide' : '► Show'} cell division information
      </button>
      
      {showInfo && (
        <div className="border-t pt-4">
          <h4 className="font-bold mb-2">About Cell Division</h4>
          
          <div className="mb-3">
            <h5 className="font-medium">Mitosis</h5>
            <p className="text-sm">
              Mitosis is the process where a single cell divides into two identical daughter cells.
              Each daughter cell receives the same number and type of chromosomes as the parent cell.
              This is used for growth, repair, and asexual reproduction.
            </p>
            <p className="text-xs mt-1">
              <strong>Stages:</strong> Interphase → Prophase → Metaphase → Anaphase → Telophase → Cytokinesis
            </p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Meiosis</h5>
            <p className="text-sm">
              Meiosis is a type of cell division that reduces the chromosome number by half, 
              creating four haploid cells, each with half the number of chromosomes as the parent cell.
              This process is essential for sexual reproduction and genetic diversity.
            </p>
            <p className="text-xs mt-1">
              <strong>Stages:</strong> Interphase → Prophase I → Metaphase I → Anaphase I → Telophase I → 
              Prophase II → Metaphase II → Anaphase II → Telophase II
            </p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Key Differences</h5>
            <ul className="list-disc pl-5 text-xs">
              <li><strong>Number of divisions:</strong> Mitosis has one division, Meiosis has two</li>
              <li><strong>Daughter cells:</strong> Mitosis produces 2 diploid cells, Meiosis produces 4 haploid cells</li>
              <li><strong>Genetic variation:</strong> No crossing over in Mitosis, crossing over occurs in Meiosis</li>
              <li><strong>Purpose:</strong> Mitosis for growth and repair, Meiosis for gamete formation in sexual reproduction</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t">
        <h4 className="font-medium mb-2">Experiment Suggestions</h4>
        <ul className="list-disc pl-5 text-xs space-y-2">
          <li>
            <button 
              className="text-blue-500 hover:underline"
              onClick={() => {
                setDivisionType('mitosis');
                setChromosomePairs(2);
                setSpeed(1);
                setShowLabels(true);
                resetSimulation();
              }}
            >
              Simple Mitosis
            </button>: Watch a basic mitotic division with labeled chromosomes
          </li>
          <li>
            <button 
              className="text-blue-500 hover:underline"
              onClick={() => {
                setDivisionType('meiosis');
                setChromosomePairs(2);
                setSpeed(1);
                setShowLabels(true);
                resetSimulation();
              }}
            >
              Meiosis with Two Chromosome Pairs
            </button>: Observe meiotic division with two chromosome pairs
          </li>
          <li>
            <button 
              className="text-blue-500 hover:underline"
              onClick={() => {
                setDivisionType('meiosis');
                setChromosomePairs(3);
                setSpeed(2);
                setShowLabels(false);
                resetSimulation();
              }}
            >
              Fast Meiosis
            </button>: Speed up the meiotic process with more chromosomes
          </li>
        </ul>
      </div>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const CellDivisionControls = dynamic(() => Promise.resolve(CellDivisionControlsContent), {
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

export default CellDivisionControls; 