'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const OrbitalSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const OrbitalControls = dynamic(() => import('./Controls'), { ssr: false });

export default function OrbitalExperiment() {
  const [gravitationalConstant, setGravitationalConstant] = useState(3.0);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showVelocityVectors, setShowVelocityVectors] = useState(true);
  const [showForceVectors, setShowForceVectors] = useState(false);
  const [timeScale, setTimeScale] = useState(1.0);

  return (
    <ExperimentLayout 
      title="Orbital Mechanics"
      category="physics"
      description="Explore planetary motion, gravitational forces, and Kepler's laws"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <OrbitalSimulation
            gravitationalConstant={gravitationalConstant}
            showOrbits={showOrbits}
            showVelocityVectors={showVelocityVectors}
            showForceVectors={showForceVectors}
            timeScale={timeScale}
          />
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Orbital Mechanics</h3>
            <p className="text-sm">
              Orbital mechanics is the application of physics, celestial mechanics, and mathematics to predict and understand the motion 
              of objects in space. This simulation demonstrates how celestial bodies orbit around a central mass due to gravitational forces.
            </p>
            <h4 className="text-md font-medium mt-4 mb-1">Key Concepts</h4>
            <ul className="list-disc pl-5 text-sm">
              <li><strong>Gravity:</strong> The force that attracts objects with mass toward each other</li>
              <li><strong>Orbits:</strong> Curved paths that objects follow around a central mass due to gravity</li>
              <li><strong>Escape velocity:</strong> The minimum speed needed to break free from a gravitational field</li>
              <li><strong>Orbital period:</strong> The time it takes for an object to complete one orbit</li>
            </ul>
            <div className="mt-4 text-sm bg-gray-50 p-3 rounded">
              <p className="mb-2">
                Watch how planets trace elliptical paths, with velocity and force vectors showing the relationship between orbital 
                speed and distance from the central star.
              </p>
              <p>
                Try adjusting the gravitational constant to see how it affects orbital speed and stability. Planets closer to 
                the central mass orbit faster than those farther away, demonstrating Kepler's laws of planetary motion.
              </p>
            </div>
          </div>
        </div>
        <div className="md:w-96">
          <OrbitalControls
            gravitationalConstant={gravitationalConstant}
            showOrbits={showOrbits}
            showVelocityVectors={showVelocityVectors}
            showForceVectors={showForceVectors}
            timeScale={timeScale}
            setGravitationalConstant={setGravitationalConstant}
            setShowOrbits={setShowOrbits}
            setShowVelocityVectors={setShowVelocityVectors}
            setShowForceVectors={setShowForceVectors}
            setTimeScale={setTimeScale}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 