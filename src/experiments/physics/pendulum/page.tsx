'use client';

import { useState } from 'react';
import Controls from './Controls';
import Simulation from './Simulation';

export default function PendulumPage() {
  const [length, setLength] = useState(1);
  const [gravity, setGravity] = useState(9.8);
  const [initialAngle, setInitialAngle] = useState(30);
  const [damping, setDamping] = useState(0.05);

  return (
    <main className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Simple Pendulum Virtual Lab</h1>
      
      <p className="max-w-2xl text-center mb-6">
        Explore how pendulum period changes with length and gravity. 
        Observe how damping affects the oscillation amplitude over time.
      </p>
      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
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
        </div>
      </div>
    </main>
  );
} 