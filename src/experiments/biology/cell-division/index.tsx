'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const CellDivisionSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const CellDivisionControls = dynamic(() => import('./Controls'), { ssr: false });

export default function CellDivisionExperiment() {
  const [divisionType, setDivisionType] = useState<'mitosis' | 'meiosis'>('mitosis');
  const [speed, setSpeed] = useState(1);
  const [chromosomePairs, setChromosomePairs] = useState(2);
  const [showLabels, setShowLabels] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  // Force simulation reset when parameters change
  const [resetCounter, setResetCounter] = useState(0);
  
  const resetSimulation = useCallback(() => {
    setResetCounter(prev => prev + 1);
  }, []);

  return (
    <ExperimentLayout 
      title="Cell Division Visualizer"
      category="biology"
      description="Explore mitosis and meiosis processes"
      formula={divisionType === 'mitosis' ? '2n → 2n + 2n' : '2n → n + n + n + n'}
      formulaExplanation={divisionType === 'mitosis' 
        ? 'Mitosis: one diploid cell divides into two identical diploid cells' 
        : 'Meiosis: one diploid cell divides into four haploid cells'}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <CellDivisionSimulation
            key={resetCounter} // Force component re-mount on reset
            divisionType={divisionType}
            speed={speed}
            chromosomePairs={chromosomePairs}
            showLabels={showLabels}
            isPaused={isPaused}
          />
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Cell Division</h3>
            <p className="text-sm">
              Cell division is the process by which a parent cell divides into two or more daughter cells.
              This simulation demonstrates two types of cell division: mitosis and meiosis, both critical 
              for growth, reproduction, and maintenance of all living organisms.
            </p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-medium mb-1">Mitosis</h4>
                <p className="text-xs">
                  Mitosis produces two genetically identical daughter cells, each with the same number of 
                  chromosomes as the parent cell (diploid). This process is used for growth, tissue repair, 
                  and asexual reproduction. It consists of Prophase, Metaphase, Anaphase, and Telophase, 
                  followed by Cytokinesis.
                </p>
              </div>
              
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium mb-1">Meiosis</h4>
                <p className="text-xs">
                  Meiosis produces four haploid daughter cells, each with half the number of chromosomes 
                  as the parent cell. This process is used for sexual reproduction, creating gametes (eggs or sperm).
                  It involves two successive divisions (Meiosis I and Meiosis II) and includes genetic 
                  recombination through crossing over.
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded">
              <h4 className="font-medium mb-1">Key Terms</h4>
              <ul className="list-disc pl-5 text-xs">
                <li><strong>Chromosomes:</strong> Structures containing DNA and proteins that carry genetic information</li>
                <li><strong>Homologous chromosomes:</strong> Matching chromosome pairs, one inherited from each parent</li>
                <li><strong>Chromatids:</strong> The two identical copies of a chromosome joined at the centromere</li>
                <li><strong>Diploid (2n):</strong> Having two complete sets of chromosomes</li>
                <li><strong>Haploid (n):</strong> Having a single set of chromosomes</li>
                <li><strong>Centromere:</strong> The region where sister chromatids are joined</li>
                <li><strong>Crossing over:</strong> Exchange of genetic material between homologous chromosomes</li>
              </ul>
            </div>
            
            <div className="mt-4 text-xs">
              <p>
                In this simulation, you can observe the differences between mitosis and meiosis, control 
                the animation speed, and adjust the number of chromosome pairs. The visualization helps 
                understand how chromosomes move and separate during each stage of cell division.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:w-96">
          <CellDivisionControls
            divisionType={divisionType}
            speed={speed}
            chromosomePairs={chromosomePairs}
            showLabels={showLabels}
            isPaused={isPaused}
            setDivisionType={setDivisionType}
            setSpeed={setSpeed}
            setChromosomePairs={setChromosomePairs}
            setShowLabels={setShowLabels}
            setIsPaused={setIsPaused}
            resetSimulation={resetSimulation}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 