'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

interface Trait {
  name: string;
  genotype1: string;
  genotype2: string;
  type: 'mendelian' | 'incomplete-dominance' | 'codominance' | 'blood-type';
}

interface Props {
  trait: Trait;
  numOffspring: number;
  showProbabilities: boolean;
  showGenotypes: boolean;
  setTrait: (trait: Trait) => void;
  setNumOffspring: (num: number) => void;
  setShowProbabilities: (show: boolean) => void;
  setShowGenotypes: (show: boolean) => void;
}

function GeneticsControlsContent({
  trait,
  numOffspring,
  showProbabilities,
  showGenotypes,
  setTrait,
  setNumOffspring,
  setShowProbabilities,
  setShowGenotypes
}: Props) {
  const [showInfo, setShowInfo] = useState(false);
  
  // Pre-defined trait examples
  const traitExamples: Trait[] = [
    {
      name: 'Mendelian Inheritance (Simple Dominant/Recessive)',
      genotype1: 'Aa',
      genotype2: 'Aa',
      type: 'mendelian'
    },
    {
      name: 'Incomplete Dominance (Flower Color)',
      genotype1: 'Aa',
      genotype2: 'Aa',
      type: 'incomplete-dominance'
    },
    {
      name: 'Codominance (Spotted Pattern)',
      genotype1: 'Aa',
      genotype2: 'Aa',
      type: 'codominance'
    },
    {
      name: 'ABO Blood Type',
      genotype1: 'AO',
      genotype2: 'BO',
      type: 'blood-type'
    }
  ];
  
  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Genetics Controls</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Trait Type</label>
        <select 
          className="w-full p-2 border rounded"
          value={traitExamples.findIndex(t => t.name === trait.name)}
          onChange={(e) => setTrait(traitExamples[parseInt(e.target.value)])}
        >
          {traitExamples.map((t, i) => (
            <option key={i} value={i}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Parent 1 Genotype: {trait.genotype1}
        </label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {trait.type === 'mendelian' || trait.type === 'incomplete-dominance' || trait.type === 'codominance' ? (
            <>
              <button 
                className={`py-2 rounded ${trait.genotype1 === 'AA' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype1: 'AA'})}
              >
                AA
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype1 === 'Aa' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype1: 'Aa'})}
              >
                Aa
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype1 === 'aa' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype1: 'aa'})}
              >
                aa
              </button>
            </>
          ) : (
            <>
              <button 
                className={`py-2 rounded ${trait.genotype1 === 'AA' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype1: 'AA'})}
              >
                AA
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype1 === 'AO' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype1: 'AO'})}
              >
                AO
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype1 === 'BB' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype1: 'BB'})}
              >
                BB
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype1 === 'BO' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype1: 'BO'})}
              >
                BO
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype1 === 'AB' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype1: 'AB'})}
              >
                AB
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype1 === 'OO' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype1: 'OO'})}
              >
                OO
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Parent 2 Genotype: {trait.genotype2}
        </label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {trait.type === 'mendelian' || trait.type === 'incomplete-dominance' || trait.type === 'codominance' ? (
            <>
              <button 
                className={`py-2 rounded ${trait.genotype2 === 'AA' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype2: 'AA'})}
              >
                AA
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype2 === 'Aa' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype2: 'Aa'})}
              >
                Aa
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype2 === 'aa' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype2: 'aa'})}
              >
                aa
              </button>
            </>
          ) : (
            <>
              <button 
                className={`py-2 rounded ${trait.genotype2 === 'AA' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype2: 'AA'})}
              >
                AA
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype2 === 'AO' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype2: 'AO'})}
              >
                AO
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype2 === 'BB' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype2: 'BB'})}
              >
                BB
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype2 === 'BO' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype2: 'BO'})}
              >
                BO
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype2 === 'AB' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype2: 'AB'})}
              >
                AB
              </button>
              <button 
                className={`py-2 rounded ${trait.genotype2 === 'OO' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}
                onClick={() => setTrait({...trait, genotype2: 'OO'})}
              >
                OO
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Number of Offspring: {numOffspring}
        </label>
        <div className="flex items-center">
          <span className="mr-2">10</span>
          <input
            type="range"
            min="10"
            max="100"
            step="10"
            value={numOffspring}
            onChange={(e) => setNumOffspring(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">100</span>
        </div>
      </div>
      
      <div className="mb-4 flex flex-col space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showProbabilities}
            onChange={(e) => setShowProbabilities(e.target.checked)}
            className="mr-2"
          />
          Show Probabilities
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showGenotypes}
            onChange={(e) => setShowGenotypes(e.target.checked)}
            className="mr-2"
          />
          Show Genotypes
        </label>
      </div>
      
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="text-blue-500 hover:text-blue-700 mb-4 text-sm flex items-center"
      >
        {showInfo ? '▼ Hide' : '► Show'} inheritance information
      </button>
      
      {showInfo && (
        <div className="border-t pt-4">
          <h4 className="font-bold mb-2">Inheritance Patterns</h4>
          
          <div className="mb-3">
            <h5 className="font-medium">Mendelian Inheritance</h5>
            <p className="text-sm">
              The most basic pattern where one allele (dominant, represented by capital letters) 
              completely masks the other allele (recessive, represented by lowercase letters).
            </p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Incomplete Dominance</h5>
            <p className="text-sm">
              Neither allele is completely dominant, resulting in a blend of phenotypes 
              in heterozygous individuals (e.g., red + white = pink flowers).
            </p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Codominance</h5>
            <p className="text-sm">
              Both alleles are expressed simultaneously in heterozygous individuals 
              (e.g., red + white = red and white spotted pattern).
            </p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Multiple Alleles (ABO Blood Type)</h5>
            <p className="text-sm">
              More than two alleles for a gene exist in a population. For blood type: 
              A and B are codominant, both dominant over O. Genotypes: AA or AO (Type A), 
              BB or BO (Type B), AB (Type AB), and OO (Type O).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const GeneticsControls = dynamic(() => Promise.resolve(GeneticsControlsContent), {
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

export default GeneticsControls; 