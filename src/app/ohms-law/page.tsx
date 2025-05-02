'use client';

import { useState } from 'react';
import Controls from '@/experiments/physics/ohms-law/Controls';
import Simulation from '@/experiments/physics/ohms-law/Simulation';
import ExperimentLayout from '@/components/ExperimentLayout';

export default function OhmsLawPage() {
  const [voltage, setVoltage] = useState(9);
  const [resistance, setResistance] = useState(3);

  return (
    <ExperimentLayout
      title="Ohm's Law Virtual Lab"
      category="physics"
      description="Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the two points."
      formula="I = V/R"
      formulaExplanation="Where I is the current in amperes, V is the potential difference in volts, and R is the resistance in ohms. This experiment allows you to adjust voltage and resistance and observe how these changes affect the current flowing through the circuit."
    >
      <div className="flex flex-col md:flex-row gap-6">
        <Controls
          voltage={voltage}
          resistance={resistance}
          setVoltage={setVoltage}
          setResistance={setResistance}
        />
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Circuit Simulation</h3>
          <Simulation voltage={voltage} resistance={resistance} />
          
          <div className="mt-4 bg-yellow-50 p-4 rounded border border-yellow-100">
            <h4 className="font-bold mb-2">Observations:</h4>
            <ul className="list-disc ml-5">
              <li>Increasing voltage increases current (if resistance is constant)</li>
              <li>Increasing resistance decreases current (if voltage is constant)</li>
              <li>The speed of electrons represents the current magnitude</li>
            </ul>
          </div>
        </div>
      </div>
    </ExperimentLayout>
  );
} 