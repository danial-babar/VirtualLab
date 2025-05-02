'use client';

import { useState } from 'react';
import ExperimentLayout from '@/components/ExperimentLayout';
import Controls from '@/experiments/physics/projectile/Controls';
import Simulation from '@/experiments/physics/projectile/Simulation';

export default function ProjectilePage() {
  const [initialVelocity, setInitialVelocity] = useState(20);
  const [launchAngle, setLaunchAngle] = useState(45);
  const [gravity, setGravity] = useState(9.81); // Earth gravity
  const [airResistance, setAirResistance] = useState(0.01);
  const [height, setHeight] = useState(0);

  return (
    <ExperimentLayout
      title="Projectile Motion Lab"
      category="physics"
      description="Projectile motion is the motion of an object thrown or projected into the air, subject to only the forces of gravity and air resistance. It's a fundamental concept in physics that describes how objects move when thrown."
      formula="x = v₀ cos(θ) t,  y = h₀ + v₀ sin(θ) t - ½gt²"
      formulaExplanation="Where x and y are the horizontal and vertical positions, v₀ is the initial velocity, θ is the launch angle, h₀ is the initial height, g is gravitational acceleration, and t is time. These equations assume no air resistance."
    >
      <div className="flex flex-col md:flex-row gap-6">
        <Controls
          initialVelocity={initialVelocity}
          launchAngle={launchAngle}
          gravity={gravity}
          airResistance={airResistance}
          height={height}
          setInitialVelocity={setInitialVelocity}
          setLaunchAngle={setLaunchAngle}
          setGravity={setGravity}
          setAirResistance={setAirResistance}
          setHeight={setHeight}
        />
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Trajectory Simulation</h3>
          <Simulation
            initialVelocity={initialVelocity}
            launchAngle={launchAngle}
            gravity={gravity}
            airResistance={airResistance}
            height={height}
          />
          
          <div className="mt-4 bg-yellow-50 p-4 rounded border border-yellow-100">
            <h4 className="font-bold mb-2">Observations:</h4>
            <ul className="list-disc ml-5">
              <li>Maximum range occurs at a 45° angle (in vacuum at ground level)</li>
              <li>Air resistance reduces both range and maximum height</li>
              <li>Lower gravity increases both range and flight time</li>
              <li>The trajectory forms a parabola (without air resistance)</li>
              <li>Initial height increases range without changing the shape of the trajectory</li>
            </ul>
          </div>
        </div>
      </div>
    </ExperimentLayout>
  );
} 