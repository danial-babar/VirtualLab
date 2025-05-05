'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';
import ExperimentContentLayout from '@/components/ExperimentContentLayout';

// Dynamically import components with client-side only rendering
const ProteinSynthesisSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const ProteinSynthesisControls = dynamic(() => import('./Controls'), { ssr: false });

export default function ProteinSynthesisExperiment() {
  const [dnaSequence, setDnaSequence] = useState('ATGTACTGACCGAGCTTCAAGACTTATAG');
  const [displayMode, setDisplayMode] = useState<'transcription' | 'translation' | 'both'>('both');
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  
  // Force simulation reset when parameters change
  const [resetCounter, setResetCounter] = useState(0);
  
  const resetSimulation = useCallback(() => {
    setResetCounter(prev => prev + 1);
  }, []);
  
  // Simulation component
  const simulationComponent = (
    <ProteinSynthesisSimulation
      key={resetCounter} // Force component re-mount on reset
      dnaSequence={dnaSequence}
      displayMode={displayMode}
      speed={speed}
      isPaused={isPaused}
      showLabels={showLabels}
    />
  );
  
  // Controls component
  const controlsComponent = (
    <ProteinSynthesisControls
      dnaSequence={dnaSequence}
      displayMode={displayMode}
      speed={speed}
      isPaused={isPaused}
      showLabels={showLabels}
      setDnaSequence={setDnaSequence}
      setDisplayMode={setDisplayMode}
      setSpeed={setSpeed}
      setIsPaused={setIsPaused}
      setShowLabels={setShowLabels}
      resetSimulation={resetSimulation}
    />
  );
  
  // Information component
  const infoComponent = (
    <>
      <h3 className="text-lg font-semibold mb-2">About Protein Synthesis</h3>
      <p className="text-sm">
        Protein synthesis is the process by which cells build proteins. It involves two main stages:
        transcription (copying DNA to mRNA) and translation (using mRNA to create proteins).
        This simulation demonstrates these fundamental processes of molecular biology.
      </p>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded">
          <h4 className="font-medium mb-1">Transcription</h4>
          <p className="text-xs">
            Transcription occurs in the cell nucleus. DNA unwinds and RNA polymerase 
            synthesizes messenger RNA (mRNA) by matching complementary RNA nucleotides 
            to the DNA template strand. The mRNA is then processed and exported to the cytoplasm.
          </p>
        </div>
        
        <div className="bg-green-50 p-3 rounded">
          <h4 className="font-medium mb-1">Translation</h4>
          <p className="text-xs">
            Translation occurs at ribosomes in the cytoplasm. mRNA nucleotides are read in 
            groups of three (codons), each specifying an amino acid. tRNAs bring amino acids 
            to the ribosome, which links them into a growing polypeptide chain that will fold 
            into a protein.
          </p>
        </div>
      </div>
    </>
  );
  
  // Additional controls info
  const additionalControlsInfo = (
    <div className="p-3 bg-amber-50 rounded">
      <h4 className="font-medium mb-1">Key Concepts</h4>
      <ul className="list-disc pl-5 text-xs">
        <li><strong>DNA:</strong> Genetic material containing the instructions for protein synthesis</li>
        <li><strong>mRNA:</strong> Messenger RNA that carries the genetic code from DNA to ribosomes</li>
        <li><strong>Codon:</strong> Three-nucleotide sequence in mRNA that codes for a specific amino acid</li>
        <li><strong>RNA Polymerase:</strong> Enzyme that synthesizes RNA from a DNA template</li>
        <li><strong>Ribosome:</strong> Cellular structure where protein synthesis occurs</li>
        <li><strong>tRNA:</strong> Transfer RNA that brings amino acids to the ribosome</li>
      </ul>
    </div>
  );

  return (
    <ExperimentLayout 
      title="Protein Synthesis Simulator"
      category="biology"
      description="Visualize DNA transcription and mRNA translation processes"
      formula="DNA → mRNA → Protein"
      formulaExplanation="The central dogma of molecular biology: genetic information flows from DNA to RNA to protein"
    >
      <ExperimentContentLayout
        simulation={simulationComponent}
        controls={controlsComponent}
        info={infoComponent}
        additionalControlsInfo={additionalControlsInfo}
      />
    </ExperimentLayout>
  );
} 