'use client';

import { useState } from 'react';
import ExperimentLayout from '@/components/ExperimentLayout';
import Controls from '@/experiments/chemistry/titration/Controls';
import Simulation from '@/experiments/chemistry/titration/Simulation';

export default function TitrationPage() {
  const [acidConcentration, setAcidConcentration] = useState(0.1);
  const [baseConcentration, setBaseConcentration] = useState(0.1);
  const [acidVolume, setAcidVolume] = useState(25);
  const [titrantVolume, setTitrantVolume] = useState(0);

  return (
    <ExperimentLayout
      title="Acid-Base Titration Lab"
      category="chemistry"
      description="In a titration, a solution of known concentration (the titrant) is added to a solution of unknown concentration until the reaction reaches the equivalence point."
      formula="moles(acid) = moles(base)"
      formulaExplanation="At the equivalence point, the moles of acid equal the moles of base. For a solution, moles = molarity × volume. So for a strong acid-strong base titration, M₁V₁ = M₂V₂, where M is molarity (mol/L) and V is volume (L)."
    >
      <div className="flex flex-col md:flex-row gap-6">
        <Controls
          acidConcentration={acidConcentration}
          baseConcentration={baseConcentration}
          acidVolume={acidVolume}
          titrantVolume={titrantVolume}
          setAcidConcentration={setAcidConcentration}
          setBaseConcentration={setBaseConcentration}
          setAcidVolume={setAcidVolume}
          setTitrantVolume={setTitrantVolume}
        />
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Titration Simulation</h3>
          <Simulation
            acidConcentration={acidConcentration}
            baseConcentration={baseConcentration}
            acidVolume={acidVolume}
            titrantVolume={titrantVolume}
          />
          
          <div className="mt-4 bg-yellow-50 p-4 rounded border border-yellow-100">
            <h4 className="font-bold mb-2">Observations:</h4>
            <ul className="list-disc ml-5">
              <li>Solution is acidic (red/orange) before the equivalence point</li>
              <li>At the equivalence point, pH changes rapidly</li>
              <li>Solution becomes basic (blue/purple) after the equivalence point</li>
              <li>The titration curve has an S-shape</li>
            </ul>
          </div>
        </div>
      </div>
    </ExperimentLayout>
  );
} 