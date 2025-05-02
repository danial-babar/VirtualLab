'use client';

import { useState } from 'react';
import Controls from '@/experiments/physics/pendulum/Controls';
import Simulation from '@/experiments/physics/pendulum/Simulation';
import ExperimentLayout from '@/components/ExperimentLayout';

export default function PendulumPage() {
  const [length, setLength] = useState(1);
  const [gravity, setGravity] = useState(9.8);
  const [initialAngle, setInitialAngle] = useState(30);
  const [damping, setDamping] = useState(0.05);

  return (
    <ExperimentLayout
      title="Simple Pendulum Lab"
      category="physics"
      description="A simple pendulum consists of a mass attached to a string that swings back and forth. The motion is governed by gravity, the length of the string, and the initial angle of displacement. For small angles, the pendulum's period (time for one complete oscillation) is independent of the mass and initial angle."
      formula="T = 2π√(L/g)"
      formulaExplanation="Where T is the period in seconds, L is the length of the pendulum in meters, and g is the acceleration due to gravity in m/s². This simulation also includes a damping factor that represents air resistance and other energy-dissipating forces."
    >
      <div className="flex flex-col md:flex-row gap-6">
        <Controls
          length={length}
          gravity={gravity}
          initialAngle={initialAngle}
          damping={damping}
          setLength={setLength}
          setGravity={setGravity}
          setInitialAngle={setInitialAngle}
          setDamping={setDamping}
        />
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Pendulum Simulation</h3>
          <Simulation 
            length={length}
            gravity={gravity}
            initialAngle={initialAngle}
            damping={damping}
          />
          
          <div className="mt-4 bg-yellow-50 p-4 rounded border border-yellow-100">
            <h4 className="font-bold mb-2">Observations:</h4>
            <ul className="list-disc ml-5">
              <li>Increasing pendulum length increases the period</li>
              <li>Increasing gravity decreases the period</li>
              <li>Damping causes the oscillation amplitude to decrease over time</li>
              <li>For small angles, the period is nearly independent of the angle</li>
            </ul>
          </div>
        </div>
      </div>
    </ExperimentLayout>
  );
} 