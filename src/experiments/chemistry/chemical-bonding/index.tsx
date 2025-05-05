'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const BondingSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const BondingControls = dynamic(() => import('./Controls'), { ssr: false });

export default function ChemicalBondingExperiment() {
  const [bondType, setBondType] = useState<'ionic' | 'covalent' | 'metallic' | 'hydrogen'>('covalent');
  const [moleculeType, setMoleculeType] = useState<'simple' | 'complex'>('simple');
  const [electronegativityDiff, setElectronegativityDiff] = useState(0.5);
  const [showElectronCloud, setShowElectronCloud] = useState(true);
  const [showDipoles, setShowDipoles] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  
  // Force simulation reset when parameters change
  const [resetCounter, setResetCounter] = useState(0);
  
  const resetSimulation = useCallback(() => {
    setResetCounter(prev => prev + 1);
  }, []);

  return (
    <ExperimentLayout 
      title="Chemical Bonding Visualizer"
      category="chemistry"
      description="Explore different types of chemical bonds and molecular structures"
      formula={
        bondType === 'ionic' ? 'Na⁺ + Cl⁻ → NaCl' : 
        bondType === 'covalent' ? 'H + H → H₂' :
        bondType === 'metallic' ? 'Na + Na + Na → Na₃' : 
        'O—H···O'
      }
      formulaExplanation={
        bondType === 'ionic' ? 'Ionic bonds form through electron transfer between atoms of different electronegativities' : 
        bondType === 'covalent' ? 'Covalent bonds form through electron sharing between atoms' :
        bondType === 'metallic' ? 'Metallic bonds involve delocalized electrons shared among positive ions in a lattice' : 
        'Hydrogen bonds are weak intermolecular forces between a hydrogen attached to an electronegative atom and another electronegative atom'
      }
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <BondingSimulation
            key={resetCounter} // Force component re-mount on reset
            bondType={bondType}
            moleculeType={moleculeType}
            electronegativityDiff={electronegativityDiff}
            showElectronCloud={showElectronCloud}
            showDipoles={showDipoles}
            showLabels={showLabels}
            rotationSpeed={rotationSpeed}
            isPaused={isPaused}
          />
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Chemical Bonding</h3>
            <p className="text-sm">
              Chemical bonding is the process by which atoms combine to form molecules and compounds.
              Different types of bonds arise from various patterns of electron sharing or transfer,
              resulting in unique physical and chemical properties. This simulation allows you to
              visualize and compare different bonding types at the molecular level.
            </p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-medium mb-1">Ionic Bonding</h4>
                <p className="text-xs">
                  Ionic bonds form when one atom transfers electrons to another, creating oppositely 
                  charged ions that are attracted to each other. These typically form between metals and 
                  non-metals with large electronegativity differences (&gt; 1.7). Examples include 
                  NaCl, MgO, and CaF₂. Ionic compounds are usually brittle, have high melting points, 
                  and conduct electricity when dissolved in water.
                </p>
              </div>
              
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium mb-1">Covalent Bonding</h4>
                <p className="text-xs">
                  Covalent bonds form when atoms share electrons. They typically occur between non-metals 
                  with similar electronegativities. Covalent bonds can be polar (uneven electron sharing) 
                  or nonpolar (even electron sharing). Examples include H₂, O₂, CH₄, and CO₂. Covalent 
                  compounds often have lower melting points and can be gases, liquids, or solids at room 
                  temperature.
                </p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-3 rounded">
                <h4 className="font-medium mb-1">Metallic Bonding</h4>
                <p className="text-xs">
                  Metallic bonds occur in metals, where valence electrons are delocalized and form an 
                  "electron sea" that surrounds positively charged metal ions. This structure enables 
                  properties such as electrical conductivity, thermal conductivity, malleability, and 
                  ductility. Examples include copper, aluminum, iron, and all other metals and most alloys.
                </p>
              </div>
              
              <div className="bg-amber-50 p-3 rounded">
                <h4 className="font-medium mb-1">Hydrogen Bonding</h4>
                <p className="text-xs">
                  Hydrogen bonds are intermolecular forces (not true bonds) that form when a hydrogen 
                  atom bonded to a highly electronegative atom (usually N, O, or F) is attracted to 
                  another electronegative atom. These bonds are responsible for many important 
                  properties, including water's high boiling point, surface tension, and the structure 
                  of biological molecules like DNA and proteins.
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">Key Factors Affecting Bonding</h4>
              <ul className="list-disc pl-5 text-xs">
                <li><strong>Electronegativity:</strong> The tendency of an atom to attract electrons in a bond</li>
                <li><strong>Electron configuration:</strong> The arrangement of electrons in an atom's orbitals</li>
                <li><strong>Bond length:</strong> The distance between the nuclei of bonded atoms</li>
                <li><strong>Bond energy:</strong> The energy required to break a bond</li>
                <li><strong>Bond angle:</strong> The angle formed by three connected atoms</li>
                <li><strong>Dipole moment:</strong> The measure of the separation of positive and negative charges in a molecule</li>
              </ul>
            </div>
            
            <div className="mt-4 text-xs">
              <p>
                In this simulation, you can explore the differences between bonding types and how they 
                affect molecular structure. Adjust parameters like electronegativity difference and 
                molecular complexity to see how bonding changes. Understanding these concepts is 
                fundamental to predicting chemical behavior and properties.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:w-96">
          <BondingControls
            bondType={bondType}
            moleculeType={moleculeType}
            electronegativityDiff={electronegativityDiff}
            showElectronCloud={showElectronCloud}
            showDipoles={showDipoles}
            showLabels={showLabels}
            rotationSpeed={rotationSpeed}
            isPaused={isPaused}
            setBondType={setBondType}
            setMoleculeType={setMoleculeType}
            setElectronegativityDiff={setElectronegativityDiff}
            setShowElectronCloud={setShowElectronCloud}
            setShowDipoles={setShowDipoles}
            setShowLabels={setShowLabels}
            setRotationSpeed={setRotationSpeed}
            setIsPaused={setIsPaused}
            resetSimulation={resetSimulation}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 