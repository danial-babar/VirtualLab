'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const AcidBaseSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const AcidBaseControls = dynamic(() => import('./Controls'), { ssr: false });

export default function AcidBaseReactionsExperiment() {
  const [acidType, setAcidType] = useState<'strong' | 'weak'>('strong');
  const [baseType, setBaseType] = useState<'strong' | 'weak'>('strong');
  const [acidConcentration, setAcidConcentration] = useState(0.1);
  const [baseConcentration, setBaseConcentration] = useState(0.1);
  const [acidVolume, setAcidVolume] = useState(50); // mL
  const [baseVolume, setBaseVolume] = useState(0); // mL (titration starts with 0)
  const [showPHCurve, setShowPHCurve] = useState(true);
  const [showMolecularView, setShowMolecularView] = useState(true);
  const [showIndicator, setShowIndicator] = useState(true);
  
  // Force simulation reset when parameters change
  const [resetCounter, setResetCounter] = useState(0);
  
  const resetSimulation = useCallback(() => {
    setResetCounter(prev => prev + 1);
    setBaseVolume(0); // Reset titration
  }, []);

  return (
    <ExperimentLayout 
      title="Acid-Base Reactions Simulator"
      category="chemistry"
      description="Visualize titrations and monitor pH changes between acids and bases"
      formula="HA + BOH → H₂O + BA"
      formulaExplanation="Acid-base reactions involve the transfer of H⁺ ions from acids to bases, forming water and a salt"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <AcidBaseSimulation
            key={resetCounter} // Force component re-mount on reset
            acidType={acidType}
            baseType={baseType}
            acidConcentration={acidConcentration}
            baseConcentration={baseConcentration}
            acidVolume={acidVolume}
            baseVolume={baseVolume}
            showPHCurve={showPHCurve}
            showMolecularView={showMolecularView}
            showIndicator={showIndicator}
          />
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Acid-Base Reactions</h3>
            <p className="text-sm">
              Acid-base reactions are among the most common and important reactions in chemistry. 
              They involve the transfer of protons (H⁺ ions) between chemical species. This simulation 
              demonstrates the process of titration, where a base is slowly added to an acid (or vice versa) 
              until neutralization occurs.
            </p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-medium mb-1">Acids and Bases</h4>
                <p className="text-xs">
                  <strong>Acids</strong> donate H⁺ ions (protons) in solution. Strong acids like HCl completely 
                  dissociate, while weak acids like acetic acid partially dissociate.<br /><br />
                  <strong>Bases</strong> accept H⁺ ions or donate OH⁻ ions. Strong bases like NaOH completely 
                  dissociate, while weak bases like ammonia (NH₃) partially dissociate.
                </p>
              </div>
              
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium mb-1">pH and Indicators</h4>
                <p className="text-xs">
                  pH is a measure of the concentration of H⁺ ions in solution. A pH of 7 is neutral, 
                  below 7 is acidic, and above 7 is basic.<br /><br />
                  <strong>Indicators</strong> are substances that change color at specific pH values, 
                  allowing us to visually detect the endpoint of a titration.
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded">
              <h4 className="font-medium mb-1">Key Concepts in Titrations</h4>
              <ul className="list-disc pl-5 text-xs">
                <li><strong>Equivalence point:</strong> The point at which the acid and base have reacted in their exact stoichiometric proportions</li>
                <li><strong>Endpoint:</strong> The point at which the indicator changes color, ideally close to the equivalence point</li>
                <li><strong>Titration curve:</strong> A plot of pH versus volume of titrant added</li>
                <li><strong>Buffer region:</strong> The relatively flat region of a titration curve where pH changes slowly with added titrant</li>
                <li><strong>pH at equivalence:</strong> Depends on the strength of the acid and base:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Strong acid + strong base = pH 7</li>
                    <li>Strong acid + weak base = pH &lt; 7</li>
                    <li>Weak acid + strong base = pH &gt; 7</li>
                    <li>Weak acid + weak base = depends on relative strengths</li>
                  </ul>
                </li>
              </ul>
            </div>
            
            <div className="mt-4 text-xs">
              <p>
                In this simulation, you can explore how different combinations of acids and bases affect 
                the titration process. Observe the pH changes, molecular interactions, and indicator color 
                changes as you add base to the acid solution.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:w-96">
          <AcidBaseControls
            acidType={acidType}
            baseType={baseType}
            acidConcentration={acidConcentration}
            baseConcentration={baseConcentration}
            acidVolume={acidVolume}
            baseVolume={baseVolume}
            showPHCurve={showPHCurve}
            showMolecularView={showMolecularView}
            showIndicator={showIndicator}
            setAcidType={setAcidType}
            setBaseType={setBaseType}
            setAcidConcentration={setAcidConcentration}
            setBaseConcentration={setBaseConcentration}
            setAcidVolume={setAcidVolume}
            setBaseVolume={setBaseVolume}
            setShowPHCurve={setShowPHCurve}
            setShowMolecularView={setShowMolecularView}
            setShowIndicator={setShowIndicator}
            resetSimulation={resetSimulation}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 