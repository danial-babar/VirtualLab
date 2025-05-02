'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const GeneticsSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const GeneticsControls = dynamic(() => import('./Controls'), { ssr: false });

interface Trait {
  name: string;
  genotype1: string;
  genotype2: string;
  type: 'mendelian' | 'incomplete-dominance' | 'codominance' | 'blood-type';
}

export default function GeneticsExperiment() {
  const [trait, setTrait] = useState<Trait>({
    name: 'Mendelian Inheritance (Simple Dominant/Recessive)',
    genotype1: 'Aa',
    genotype2: 'Aa',
    type: 'mendelian'
  });
  const [numOffspring, setNumOffspring] = useState(50);
  const [showProbabilities, setShowProbabilities] = useState(true);
  const [showGenotypes, setShowGenotypes] = useState(true);

  return (
    <ExperimentLayout 
      title="Genetics Simulator"
      category="biology"
      description="Model inheritance patterns with Punnett squares"
      formula="P(phenotype) = n/N"
      formulaExplanation="Probability equals the number of favorable outcomes divided by the total number of possible outcomes"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <GeneticsSimulation
            trait={trait as any}
            numOffspring={numOffspring}
            showProbabilities={showProbabilities}
            showGenotypes={showGenotypes}
          />
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Genetic Inheritance</h3>
            <p className="text-sm">
              Genetic inheritance is the process by which genetic information is passed from parents to offspring.
              This simulation demonstrates different patterns of inheritance using Punnett squares, which help visualize
              the possible combinations of alleles that offspring can inherit.
            </p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-medium mb-1">Genotype vs. Phenotype</h4>
                <p className="text-xs">
                  <strong>Genotype</strong> is the genetic makeup of an organism (e.g., AA, Aa, aa).
                  <strong>Phenotype</strong> is the observable characteristic that results from the genotype.
                  Different inheritance patterns determine how genotypes express as phenotypes.
                </p>
              </div>
              
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium mb-1">Punnett Squares</h4>
                <p className="text-xs">
                  A Punnett square is a diagram used to predict the outcome of a particular cross or breeding experiment.
                  It shows all possible combinations of alleles that can result from a cross, allowing us to determine
                  the probability of specific genotypes and phenotypes in offspring.
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded">
              <h4 className="font-medium mb-1">Key Terms</h4>
              <ul className="list-disc pl-5 text-xs">
                <li><strong>Allele:</strong> Different forms of the same gene</li>
                <li><strong>Dominant allele:</strong> An allele that is expressed when present (typically written as a capital letter)</li>
                <li><strong>Recessive allele:</strong> An allele that is only expressed when two copies are present (typically written as a lowercase letter)</li>
                <li><strong>Homozygous:</strong> Having two identical alleles for a gene (e.g., AA or aa)</li>
                <li><strong>Heterozygous:</strong> Having two different alleles for a gene (e.g., Aa)</li>
                <li><strong>Codominance:</strong> When both alleles are fully expressed in the phenotype</li>
                <li><strong>Incomplete dominance:</strong> When the heterozygous phenotype is intermediate between the two homozygous phenotypes</li>
              </ul>
            </div>
            
            <div className="mt-4 text-xs">
              <p>
                In this simulation, you can explore different inheritance patterns by changing the trait type and 
                parent genotypes. You can also adjust the number of offspring to observe how probability works in 
                genetic inheritance. Try different combinations to see various inheritance outcomes!
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:w-96">
          <GeneticsControls
            trait={trait}
            numOffspring={numOffspring}
            showProbabilities={showProbabilities}
            showGenotypes={showGenotypes}
            setTrait={setTrait}
            setNumOffspring={setNumOffspring}
            setShowProbabilities={setShowProbabilities}
            setShowGenotypes={setShowGenotypes}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 