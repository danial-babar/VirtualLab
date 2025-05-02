'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const CollisionSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const CollisionControls = dynamic(() => import('./Controls'), { ssr: false });

export default function CollisionExperiment() {
  const [elasticity, setElasticity] = useState(0.8);
  const [showVelocityVectors, setShowVelocityVectors] = useState(true);
  const [showMomentumVectors, setShowMomentumVectors] = useState(false);
  const [useGravity, setUseGravity] = useState(false);
  const [slowMotion, setSlowMotion] = useState(false);

  return (
    <ExperimentLayout 
      title="Collision Physics"
      category="physics"
      description="Simulate elastic and inelastic collisions and observe conservation of momentum"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <CollisionSimulation
            elasticity={elasticity}
            showVelocityVectors={showVelocityVectors}
            showMomentumVectors={showMomentumVectors}
            useGravity={useGravity}
            slowMotion={slowMotion}
          />
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Collisions</h3>
            <p className="text-sm">
              In physics, a collision is an event in which two or more objects exert forces on each other for a relatively short time.
              This simulation demonstrates the principles of momentum conservation and energy transfer during collisions.
            </p>
            <h4 className="text-md font-medium mt-4 mb-1">Key Concepts</h4>
            <ul className="list-disc pl-5 text-sm">
              <li><strong>Conservation of momentum:</strong> In all collisions, the total momentum before and after is the same</li>
              <li><strong>Kinetic energy:</strong> In elastic collisions, kinetic energy is conserved; in inelastic collisions, some is converted to other forms</li>
              <li><strong>Coefficient of restitution:</strong> The elasticity parameter determines how much energy is conserved</li>
              <li><strong>Mass effects:</strong> Objects with greater mass have more momentum at the same velocity</li>
            </ul>
            <div className="mt-4 text-sm bg-gray-50 p-3 rounded">
              <p>
                Watch how momentum (mass × velocity) is always conserved, even as kinetic energy may change depending on the elasticity.
                This is a fundamental principle in physics with applications in everything from billiards to car crash safety design.
              </p>
            </div>
          </div>
        </div>
        <div className="md:w-96">
          <CollisionControls
            elasticity={elasticity}
            showVelocityVectors={showVelocityVectors}
            showMomentumVectors={showMomentumVectors}
            useGravity={useGravity}
            slowMotion={slowMotion}
            setElasticity={setElasticity}
            setShowVelocityVectors={setShowVelocityVectors}
            setShowMomentumVectors={setShowMomentumVectors}
            setUseGravity={setUseGravity}
            setSlowMotion={setSlowMotion}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 